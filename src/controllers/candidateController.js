import Candidate from "../models/Candidate.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findOne({ user: req.user._id }).populate("user", "name email");
  if (!candidate) throw new HttpError(404, "Profil tapılmadı");
  res.json({ success: true, data: candidate });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { phone, skills, experienceYears, about } = req.body;
  const candidate = await Candidate.findOneAndUpdate(
    { user: req.user._id },
    { phone, skills, experienceYears, about },
    { new: true, runValidators: true, omitUndefined: true }
  );
  if (!candidate) throw new HttpError(404, "Profil tapılmadı");
  res.json({ success: true, data: candidate });
});

export const getCandidates = asyncHandler(async (req, res) => {
  const { skill, minExperience } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);

  const query = {};
  if (skill) query.skills = { $regex: skill, $options: "i" };
  if (minExperience) query.experienceYears = { $gte: Number(minExperience) };

  const total = await Candidate.countDocuments(query);
  const data = await Candidate.find(query)
    .populate("user", "name email")
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ success: true, total, page, pages: Math.ceil(total / limit), data });
});
