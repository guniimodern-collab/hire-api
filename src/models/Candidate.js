import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    phone: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    experienceYears: { type: Number, min: 0, default: 0 },
    about: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
