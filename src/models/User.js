import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Ad mütləqdir"], trim: true },
    email: { type: String, required: [true, "Email mütləqdir"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["hr", "candidate"], default: "candidate" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
