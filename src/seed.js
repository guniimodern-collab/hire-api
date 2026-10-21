import mongoose from "mongoose";
import User from "./models/User.js";
import Candidate from "./models/Candidate.js";
import Vacancy from "./models/Vacancy.js";
import Application from "./models/Application.js";
import Interview from "./models/Interview.js";

await mongoose.connect(process.env.MONGO_URI);

// Diqqət: köhnə məlumatlar silinir
await Promise.all([
  User.deleteMany(),
  Candidate.deleteMany(),
  Vacancy.deleteMany(),
  Application.deleteMany(),
  Interview.deleteMany(),
]);

const password = await Bun.password.hash("123456");

const hr = await User.create({ name: "HR Menecer", email: "hr@test.com", password, role: "hr" });
const u1 = await User.create({ name: "Nezrin", email: "nezrin@test.com", password, role: "candidate" });
const u2 = await User.create({ name: "Ali", email: "ali@test.com", password, role: "candidate" });

const c1 = await Candidate.create({ user: u1._id, phone: "0501234567", skills: ["JavaScript", "Node"], experienceYears: 2 });
const c2 = await Candidate.create({ user: u2._id, phone: "0557654321", skills: ["Python"], experienceYears: 4 });

const v1 = await Vacancy.create({ title: "Backend Developer", description: "Bun və Express ilə API", city: "Baku", salary: 1800, createdBy: hr._id });
const v2 = await Vacancy.create({ title: "Frontend Developer", description: "React ilə interfeys", city: "Ganja", salary: 1500, createdBy: hr._id });
await Vacancy.create({ title: "QA Engineer", description: "Test mühəndisi", city: "Baku", salary: 1200, status: "closed", createdBy: hr._id });

const a1 = await Application.create({ vacancy: v1._id, candidate: c1._id, coverLetter: "Salam, müraciət edirəm", status: "interview" });
await Application.create({ vacancy: v2._id, candidate: c2._id, coverLetter: "Maraqlanıram" });

await Interview.create({ application: a1._id, date: new Date("2026-11-01T10:00:00Z"), location: "Ofis, Bakı" });

console.log("Nümunə data yaradıldı.");
console.log("HR:        hr@test.com / 123456");
console.log("Namizəd:   nezrin@test.com / 123456");
await mongoose.disconnect();
