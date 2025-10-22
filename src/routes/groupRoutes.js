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
  if (req.user.role !== "owner")
    return res.status(403).json({ error: "Only owners can create groups" });

  const group = await prisma.group.create({
    data: { name: req.body.name, ownerId: req.user.id },
  });
  res.json(group);
});

export default router;
