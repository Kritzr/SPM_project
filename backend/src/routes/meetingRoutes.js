import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();


router.post('/groups/:groupId', auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, description, date } = req.body;

    // Validate input
    if (!title || !date)
      return res.status(400).send({ error: 'Title and date are required.' });

    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
    });

    if (!group)
      return res.status(404).send({ error: 'Group not found.' });

    if (group.ownerId !== req.user.id)
      return res
        .status(403)
        .send({ error: 'Only group owner can create a meeting.' });

    const meeting = await prisma.meeting.create({
      data: {
  
        groupId: parseInt(groupId),
        hostId: req.user.id,
        title,
        description,
        scheduledAt: new Date(date)

      },
    });

    res.status(201).json(meeting);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).send({ error: 'Failed to create meeting', details: error.message });
  }
});

/**
 * ✅ Start Meeting
 * Endpoint: PATCH /api/meetings/:id/start
 */
router.patch('/:id/start', auth, async (req, res) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { group: true },
    });

    if (!meeting)
      return res.status(404).send({ error: 'Meeting not found.' });

    if (meeting.group.ownerId !== req.user.id)
      return res.status(403).send({ error: 'Only owner can start meeting.' });

    const updated = await prisma.meeting.update({
      where: { id: meeting.id },
      data: { startedAt: new Date() },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error starting meeting:', error);
    res.status(500).send({ error: 'Failed to start meeting', details: error.message });
  }
});

/**
 * ✅ End Meeting
 * Endpoint: PATCH /api/meetings/:id/end
 */
router.patch('/:id/end', auth, async (req, res) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { group: true },
    });

    if (!meeting)
      return res.status(404).send({ error: 'Meeting not found.' });

    if (meeting.group.ownerId !== req.user.id)
      return res.status(403).send({ error: 'Only owner can end meeting.' });

    const ended = await prisma.meeting.update({
      where: { id: meeting.id },
      data: { endedAt: new Date() },
    });

    // Update attendance for participants who haven’t left
    const atts = await prisma.attendance.findMany({
      where: { meetingId: meeting.id },
    });

    for (const a of atts) {
      if (!a.leftAt && a.joinedAt) {
        const duration = Math.floor(
          (new Date(ended.endedAt) - new Date(a.joinedAt)) / 1000
        );
        await prisma.attendance.update({
          where: { id: a.id },
          data: {
            leftAt: ended.endedAt,
            durationSeconds: duration,
            status: true, // mark as present
          },
        });
      }
    }

    res.json(ended);
  } catch (error) {
    console.error('Error ending meeting:', error);
    res.status(500).send({ error: 'Failed to end meeting', details: error.message });
  }
});

/**
 * ✅ Get Meeting Details (with files, attendance, and group)
 * Endpoint: GET /api/meetings/:id
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        files: true,
        attendance: { include: { user: true } },
        group: true,
      },
    });

    if (!meeting)
      return res.status(404).send({ error: 'Meeting not found.' });

    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    res.status(500).send({ error: 'Failed to fetch meeting', details: error.message });
  }
});

export default router;
