const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const { uploadBuffer } = require('../services/azureBlobService');

const prisma = new PrismaClient();
const router = express.Router();
const upload = multer(); // memory storage

// upload file to a meeting
router.post('/meetings/:meetingId', auth, upload.single('file'), async (req, res) => {
  const { meetingId } = req.params;
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId }, include: { group: true }});
  if(!meeting) return res.status(404).send({ error: 'Meeting not found' });
  // check membership
  const member = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId: meeting.groupId, userId: req.user.id }}}).catch(()=>null);
  if(!member) return res.status(403).send({ error: 'Not a group member' });
  if(!req.file) return res.status(400).send({ error: 'file required' });
  const folder = `groups/${meeting.groupId}/meetings/${meetingId}`;
  // upload buffer
  const blobUrl = await uploadBuffer(folder, req.file.originalname, req.file.buffer, req.file.mimetype);
  const saved = await prisma.meetingFile.create({
    data: {
      meetingId,
      uploadedBy: req.user.id,
      filename: req.file.originalname,
      blobUrl,
      size: req.file.size,
      contentType: req.file.mimetype
    }
  });
  res.status(201).json(saved);
});

module.exports = router;
