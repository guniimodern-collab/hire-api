import express from "express";
import { createInterview, getInterviews, updateInterviewResult } from "../controllers/interviewController.js";
import { auth, restrictTo } from "../middleware/auth.js";

const router = express.Router();
router.post("/", auth, restrictTo("hr"), createInterview);
router.get("/", auth, restrictTo("hr"), getInterviews);
router.patch("/:id/result", auth, restrictTo("hr"), updateInterviewResult);

export default router;
