import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const auth = asyncHandler(async (req, res, next) => {
  const [type, token] = (req.headers.authorization || "").split(" ");
  if (type !== "Bearer" || !token) throw new HttpError(401, "Token yoxdur");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, "Token yanlışdır və ya vaxtı bitib");
  }

  const user = await User.findById(payload.id);
  if (!user) throw new HttpError(401, "İstifadəçi tapılmadı");

  req.user = user;
  next();
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new HttpError(403, "Bu əməliyyat üçün icazəniz yoxdur"));
  }
  next();
};
