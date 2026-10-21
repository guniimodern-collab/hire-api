import express from "express";
import { getMyProfile, updateMyProfile, getCandidates } from "../controllers/candidateController.js";
import { auth, restrictTo } from "../middleware/auth.js";

const router = express.Router();
router.get("/me", auth, restrictTo("candidate"), getMyProfile);
router.put("/me", auth, restrictTo("candidate"), updateMyProfile);
router.get("/", auth, restrictTo("hr"), getCandidates);

export default router;
