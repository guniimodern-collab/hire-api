import Vacancy from "../models/Vacancy.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createVacancy = asyncHandler(async (req, res) => {
  const { title, description, city, salary } = req.body;
  const vacancy = await Vacancy.create({ title, description, city, salary, createdBy: req.user._id });
  res.status(201).json({ success: true, data: vacancy });
});

export const getVacancies = asyncHandler(async (req, res) => {
  const { city, search, status, minSalary } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);

  const query = {};
  if (city) query.city = { $regex: city, $options: "i" };
  if (search) query.title = { $regex: search, $options: "i" };
  if (status) query.status = status;
  if (minSalary) query.salary = { $gte: Number(minSalary) };

  const total = await Vacancy.countDocuments(query);
  const data = await Vacancy.find(query)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ success: true, total, page, pages: Math.ceil(total / limit), count: data.length, data });
});

export const getVacancy = asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findById(req.params.id).populate("createdBy", "name email");
  if (!vacancy) throw new HttpError(404, "Vakansiya tapılmadı");
  res.json({ success: true, data: vacancy });
});

export const updateVacancy = asyncHandler(async (req, res) => {
  const { title, description, city, salary, status } = req.body;
  const vacancy = await Vacancy.findByIdAndUpdate(
    req.params.id,
    { title, description, city, salary, status },
    { new: true, runValidators: true, omitUndefined: true }
  );
  if (!vacancy) throw new HttpError(404, "Vakansiya tapılmadı");
  res.json({ success: true, data: vacancy });
});

export const deleteVacancy = asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
  if (!vacancy) throw new HttpError(404, "Vakansiya tapılmadı");
  res.json({ success: true, message: "Vakansiya silindi" });
});
