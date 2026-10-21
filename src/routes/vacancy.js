import express from "express";
import {
  createVacancy, getVacancies, getVacancy, updateVacancy, deleteVacancy,
} from "../controllers/vacancyController.js";
import { auth, restrictTo } from "../middleware/auth.js";

const router = express.Router();
router.get("/", getVacancies);
router.get("/:id", getVacancy);
router.post("/", auth, restrictTo("hr"), createVacancy);
router.put("/:id", auth, restrictTo("hr"), updateVacancy);
router.delete("/:id", auth, restrictTo("hr"), deleteVacancy);

export default router;
