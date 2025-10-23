const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/:meetingId/join', auth, async (req, res) => {
  const { meetingId } = req.params;
  const meeting = await prisma.meeting.findUnique({ 
    where: { id: parseInt(meetingId) }, 
    include: { group: true } 
  });
  if(!meeting) return res.status(404).send({ error: 'Meeting not found' });
  
  // ensure user is member of group
  const member = await prisma.groupMember.findUnique({ 
    where: { groupId_userId: { groupId: meeting.groupId, userId: req.user.id }}
  }).catch(() => null);
  
  if(!member) return res.status(403).send({ error: 'Not a group member' });

  const now = new Date();
  const att = await prisma.attendance.upsert({
    where: { meetingId_userId: { meetingId: parseInt(meetingId), userId: req.user.id } },
    create: { meetingId: parseInt(meetingId), userId: req.user.id, joinedAt: now, status: true },
    update: { joinedAt: now, status: true }
  });

  res.json(att);
});

// leave meeting
router.post('/:meetingId/leave', auth, async (req, res) => {
  const { meetingId } = req.params;
  const att = await prisma.attendance.findUnique({
    where: {
      meetingId_userId: { meetingId: parseInt(meetingId), userId: req.user.id }
    }
  }).catch(() => null);

  if (!att) return res.status(404).send({ error: 'Attendance not found' });

  const now = new Date();
  const dur = att.joinedAt
    ? Math.floor((now - new Date(att.joinedAt)) / 1000)
    : null;

  const updated = await prisma.attendance.update({
    where: { id: att.id },
    data: { leftAt: now, durationSeconds: dur, status: false }
  });

  res.json(updated);
});

// GET attendance for a meeting (with percentage)
router.get('/:meetingId', auth, async (req, res) => {
  const meetingId = parseInt(req.params.meetingId);
  if (isNaN(meetingId)) return res.status(400).json({ error: 'Invalid meeting ID' });

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

  const atts = await prisma.attendance.findMany({
    where: { meetingId },
    include: { user: true },
  });

  console.log('MEETING:', meeting);
  console.log('ATTENDANCE:', atts);

  const meetingDuration =
    meeting.startedAt && meeting.endedAt
      ? Math.max(1, Math.floor((new Date(meeting.endedAt) - new Date(meeting.startedAt)) / 1000))
      : null;

  const results = atts.map(a => ({
    user: a.user
      ? {
          id: a.user.id,
          name: a.user.name,
          email: a.user.email
        }
      : null,
    durationSeconds: a.durationSeconds || 0,
    attendancePercent: meetingDuration
      ? Math.round((a.durationSeconds / meetingDuration) * 10000) / 100
      : null
  }));

  res.json({
    meetingId,
    meetingDurationSeconds: meetingDuration,
    attendance: results
  });
});


module.exports = router;
