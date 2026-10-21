import mongoose from "mongoose";

const vacancySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Başlıq mütləqdir"], trim: true },
    description: { type: String, required: [true, "Təsvir mütləqdir"] },
    city: { type: String, required: [true, "Şəhər mütləqdir"], trim: true },
    salary: { type: Number, required: [true, "Maaş mütləqdir"], min: 0 },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Vacancy", vacancySchema);
