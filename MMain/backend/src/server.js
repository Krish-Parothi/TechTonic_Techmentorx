import app from "./app.js";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Optional: Connect to MongoDB (non-blocking if fails)
connectMongo().catch(() => {
  console.log("⚠️ Running in demo mode without database persistence");
});

app.listen(PORT, () => {
  console.log(`✈️  Backend running on port ${PORT}`);
  console.log(`📍 POST http://localhost:${PORT}/api/search`);
  console.log(`🔐 GET  http://localhost:${PORT}/api/auth/check`);
  console.log(`❤️  GET  http://localhost:${PORT}/api/health`);
});
