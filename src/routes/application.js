import express from "express";
import {
  applyToVacancy, getMyApplications, getApplications, updateApplicationStatus,
} from "../controllers/applicationController.js";
import { auth, restrictTo } from "../middleware/auth.js";

const router = express.Router();
router.post("/", auth, restrictTo("candidate"), applyToVacancy);
router.get("/my", auth, restrictTo("candidate"), getMyApplications);
router.get("/", auth, restrictTo("hr"), getApplications);
router.patch("/:id/status", auth, restrictTo("hr"), updateApplicationStatus);

export default router;
