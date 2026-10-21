import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createInterview = asyncHandler(async (req, res) => {
  const { applicationId, date, location, note } = req.body;
  if (!applicationId) throw new HttpError(400, "applicationId mütləqdir");

  const application = await Application.findById(applicationId);
  if (!application) throw new HttpError(404, "Müraciət tapılmadı");

  const interview = await Interview.create({ application: applicationId, date, location, note });
  application.status = "interview";
  await application.save();

  res.status(201).json({ success: true, data: interview });
});

export const getInterviews = asyncHandler(async (req, res) => {
  const data = await Interview.find().populate({
    path: "application",
    populate: [
      { path: "vacancy", select: "title" },
      { path: "candidate", populate: { path: "user", select: "name email" } },
    ],
  });
  res.json({ success: true, count: data.length, data });
});

export const updateInterviewResult = asyncHandler(async (req, res) => {
  const { result } = req.body;
  if (!["pending", "passed", "failed"].includes(result)) {
    throw new HttpError(400, "result: pending, passed və ya failed olmalıdır");
  }
  const interview = await Interview.findByIdAndUpdate(req.params.id, { result }, { new: true });
  if (!interview) throw new HttpError(404, "Müsahibə tapılmadı");
  res.json({ success: true, data: interview });
});
