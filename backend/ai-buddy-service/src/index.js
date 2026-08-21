import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import buddyRoutes from "./routes/buddy.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "ai-buddy-service" }));

app.use("/auth", authRoutes);
app.use("/buddy", buddyRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Buddy service running on http://localhost:${PORT}`);
});
