import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

router.post("/", auth, async (req, res) => {
  if (req.user.role !== "OWNER")
    return res.status(403).json({ error: "Only owners can create groups" });

  const group = await prisma.group.create({
    data: { name: req.body.name, ownerId: req.user.id },
  });
  res.json(group);
});



// ✅ Add member to group
router.post("/:groupId/add-member", auth, async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    // 1️⃣ Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
    });
    if (!group) return res.status(404).json({ error: "Group not found" });

    // 2️⃣ Only the owner of the group can add members
    if (group.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Only the group owner can add members" });
    }

    // 3️⃣ Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 4️⃣ Check if user already in group
    const existing = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId,
        },
      },
    });
    if (existing) {
      return res.status(400).json({ error: "User is already a member of this group" });
    }

    // 5️⃣ Add user to group
    const newMember = await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId,
      },
    });

    res.status(201).json({
      message: "Member added successfully",
      member: newMember,
    });
  } catch (err) {
    console.error("Error adding member:", err);
    res.status(500).json({ error: "Failed to add member" });
  }
});
router.get('/:groupId/members', auth, async (req, res) => {
  const { groupId } = req.params;

  // Make sure groupId is an integer
  const group = await prisma.group.findUnique({
    where: { id: parseInt(groupId) },
    include: {
      members: {
        include: { user: true}// include user details
      }
    }
  });

  if (!group) return res.status(404).json({ error: 'Group not found' });

  // Extract user details
  const members = group.members.map(m => m.user);

  res.json({ groupOwner: group.ownerId, groupId: group.id, groupName: group.name, members });
});


export default router;
