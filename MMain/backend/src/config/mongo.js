import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/travel-pricing";

let isConnected = false;

export const connectMongo = async () => {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.warn("⚠️ MongoDB connection failed. Running in demo mode (no persistence).");
    console.error("Error:", error.message);
  }
};

export const disconnectMongo = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("❌ Disconnected from MongoDB");
  }
};

export default mongoose;
