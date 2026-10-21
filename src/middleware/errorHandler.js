export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Server xətası";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.code === 11000) {
    status = 409;
    message = "Bu məlumat artıq mövcuddur";
  } else if (err.name === "CastError") {
    status = 400;
    message = "Yanlış ID formatı";
  }

  res.status(status).json({ success: false, message });
};
