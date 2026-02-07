import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/travel-pricing",
  API_TIMEOUT: 5000,
  CACHE_TTL: 300, // 5 minutes
};

export default config;
