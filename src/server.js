import express from "express";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import vacancyRoutes from "./routes/vacancy.js";
import candidateRoutes from "./routes/candidate.js";
import applicationRoutes from "./routes/application.js";
import interviewRoutes from "./routes/interview.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "Route tapılmadı" }));
app.use(errorHandler);

await connectDB();
app.listen(process.env.PORT || 3000, () => console.log("Server işləyir"));
