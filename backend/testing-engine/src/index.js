import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testsRoutes from "./routes/tests.js";
import pathsRoutes from "./routes/paths.js";
import { requireAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "testing-engine" }));

app.use("/tests",  requireAuth, testsRoutes);
app.use("/paths",  requireAuth, pathsRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Testing Engine running on http://localhost:${PORT}`);
});
