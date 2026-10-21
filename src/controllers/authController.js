import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Candidate from "../models/Candidate.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) throw new HttpError(400, "name, email və password mütləqdir");
  if (password.length < 6) throw new HttpError(400, "Parol minimum 6 simvol olmalıdır");

  const hashed = await Bun.password.hash(password);
  const user = await User.create({ name, email, password: hashed, role });

  if (user.role === "candidate") await Candidate.create({ user: user._id });

  res.status(201).json({
    success: true,
    token: sign(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, "email və password mütləqdir");

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await Bun.password.verify(password, user.password))) {
    throw new HttpError(401, "Email və ya parol yanlışdır");
  }

  res.json({
    success: true,
    token: sign(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});
