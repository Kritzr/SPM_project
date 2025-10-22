const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

// create meeting (only group owner)
router.post('/groups/:groupId', auth, async (req, res) => {
  const { groupId } = req.params;
  const group = await prisma.group.findUnique({ where: { id: groupId }});
  if(!group) return res.status(404).send({ error: 'Group not found' });
  if(group.ownerId !== req.user.id) return res.status(403).send({ error: 'Only group owner can create meeting' });
  const meeting = await prisma.meeting.create({
    data: {
      groupId,
      hostId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : null
    }
  });
  res.status(201).json(meeting);
});

// start meeting
router.patch('/:id/start', auth, async (req, res) => {
  const meeting = await prisma.meeting.findUnique({ where: { id: req.params.id }, include: { group: true }});
  if(!meeting) return res.status(404).send({ error: 'Meeting not found' });
  if(meeting.group.ownerId !== req.user.id) return res.status(403).send({ error: 'Only owner can start meeting' });
  const updated = await prisma.meeting.update({ where: { id: meeting.id }, data: { startedAt: new Date() }});
  res.json(updated);
});

// end meeting
router.patch('/:id/end', auth, async (req, res) => {
  const meeting = await prisma.meeting.findUnique({ where: { id: req.params.id }, include: { group: true }});
  if(!meeting) return res.status(404).send({ error: 'Meeting not found' });
  if(meeting.group.ownerId !== req.user.id) return res.status(403).send({ error: 'Only owner can end meeting' });
  const ended = await prisma.meeting.update({ where: { id: meeting.id }, data: { endedAt: new Date() }});
  // finalize attendance durations for attendees without leftAt
  const atts = await prisma.attendance.findMany({ where: { meetingId: meeting.id }});
  const meetingDuration = (new Date(ended.endedAt) - new Date(ended.startedAt)) / 1000;
  for(const a of atts) {
    if(!a.leftAt && a.joinedAt) {
      const dur = Math.floor((new Date(ended.endedAt) - new Date(a.joinedAt)) / 1000);
      await prisma.attendance.update({ where: { id: a.id }, data: { leftAt: ended.endedAt, durationSeconds: dur, present: true }});
    }
  }
  res.json(ended);
});

// get meeting details incl files and attendance
router.get('/:id', auth, async (req, res) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id: req.params.id },
    include: { files: true, attendance: { include: { user: true } }, group: true }
  });
  if(!meeting) return res.status(404).send({ error: 'Meeting not found' });
  res.json(meeting);
});

module.exports = router;
