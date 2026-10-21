import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    vacancy: { type: mongoose.Schema.Types.ObjectId, ref: "Vacancy", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ["applied", "reviewing", "interview", "accepted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

// Eyni namizəd eyni vakansiyaya təkrar müraciət edə bilməz
applicationSchema.index({ vacancy: 1, candidate: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
