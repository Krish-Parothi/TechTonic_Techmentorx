import express from "express";
import cors from "cors";
import searchRoutes from "./routes/search.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/search", searchRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Travel Pricing API is running",
    timestamp: new Date().toISOString(),
  });
});

export default app;
