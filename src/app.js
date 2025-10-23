
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import attendance from "./routes/attendanceRoutes.js";
import file from "./routes/fileRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/attendance", attendance);
app.use("/api/files", file);
export default app;
