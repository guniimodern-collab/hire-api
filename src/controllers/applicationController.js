import Application from "../models/Application.js";
import Vacancy from "../models/Vacancy.js";
import Candidate from "../models/Candidate.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const STATUSES = ["applied", "reviewing", "interview", "accepted", "rejected"];

export const applyToVacancy = asyncHandler(async (req, res) => {
  const { vacancyId, coverLetter } = req.body;
  if (!vacancyId) throw new HttpError(400, "vacancyId mütləqdir");

  const vacancy = await Vacancy.findById(vacancyId);
  if (!vacancy) throw new HttpError(404, "Vakansiya tapılmadı");
  if (vacancy.status !== "open") throw new HttpError(400, "Vakansiya bağlıdır");

  const candidate = await Candidate.findOne({ user: req.user._id });
  if (!candidate) throw new HttpError(404, "Namizəd profili tapılmadı");

  const exists = await Application.findOne({ vacancy: vacancyId, candidate: candidate._id });
  if (exists) throw new HttpError(409, "Bu vakansiyaya artıq müraciət etmisiniz");

  const application = await Application.create({
    vacancy: vacancyId,
    candidate: candidate._id,
    coverLetter,
  });
  res.status(201).json({ success: true, data: application });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const candidate = await Candidate.findOne({ user: req.user._id });
  if (!candidate) throw new HttpError(404, "Namizəd profili tapılmadı");

  const data = await Application.find({ candidate: candidate._id }).populate("vacancy", "title city salary status");
  res.json({ success: true, count: data.length, data });
});

export const getApplications = asyncHandler(async (req, res) => {
  const { vacancy, status } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);

  const query = {};
  if (vacancy) query.vacancy = vacancy;
  if (status) query.status = status;

  const total = await Application.countDocuments(query);
  const data = await Application.find(query)
    .populate("vacancy", "title city")
    .populate({ path: "candidate", populate: { path: "user", select: "name email" } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ success: true, total, page, pages: Math.ceil(total / limit), data });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    throw new HttpError(400, `status bunlardan biri olmalıdır: ${STATUSES.join(", ")}`);
  }
  const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!application) throw new HttpError(404, "Müraciət tapılmadı");
  res.json({ success: true, data: application });
});
