const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

// join meeting
router.post('/:meetingId/join', auth, async (req, res) => {
  const { meetingId } = req.params;
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId }, include: { group: true }});
  if(!meeting) return res.status(404).send({ error: 'Meeting not found' });
  // ensure user is member of group
  const member = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId: meeting.groupId, userId: req.user.id }}}).catch(()=>null);
  if(!member) return res.status(403).send({ error: 'Not a group member' });
  const now = new Date();
  const att = await prisma.attendance.upsert({
    where: { meetingId_userId: { meetingId, userId: req.user.id } },
    create: { meetingId, userId: req.user.id, joinedAt: now, present: true },
    update: { joinedAt: now, present: true }
  });
  res.json(att);
});

// leave meeting
router.post('/:meetingId/leave', auth, async (req, res) => {
  const { meetingId } = req.params;
  const att = await prisma.attendance.findUnique({ where: { meetingId_userId: { meetingId, userId: req.user.id }}}).catch(()=>null);
  if(!att) return res.status(404).send({ error: 'Attendance not found' });
  const now = new Date();
  const dur = att.joinedAt ? Math.floor((now - new Date(att.joinedAt)) / 1000) : null;
  const updated = await prisma.attendance.update({ where: { id: att.id }, data: { leftAt: now, durationSeconds: dur, present: true }});
  res.json(updated);
});

// get attendance for meeting (with percentage)
router.get('/:meetingId', auth, async (req, res) => {
  const { meetingId } = req.params;
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId }});
  if(!meeting) return res.status(404).send({ error: 'Meeting not found' });
  const atts = await prisma.attendance.findMany({ where: { meetingId }, include: { user: true }});
  // compute meeting duration
  const meetingDuration = meeting.startedAt && meeting.endedAt ? Math.max(1, Math.floor((new Date(meeting.endedAt) - new Date(meeting.startedAt)) / 1000)) : null;
  const results = atts.map(a => {
    const duration = a.durationSeconds || (a.joinedAt && meeting.endedAt ? Math.floor((new Date(meeting.endedAt) - new Date(a.joinedAt)) / 1000) : 0);
    const percent = meetingDuration ? Math.round((100 * duration / meetingDuration) * 100) / 100 : null;
    return { user: a.user, durationSeconds: duration, attendancePercent: percent };
  });
  res.json({ meetingId, meetingDurationSeconds: meetingDuration, attendance: results });
});

module.exports = router;
