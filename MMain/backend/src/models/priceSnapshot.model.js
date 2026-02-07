import mongoose from "mongoose";

const priceSnapshotSchema = new mongoose.Schema(
  {
    route: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    type: { type: String, enum: ["FLIGHT", "TRAIN", "MIXED"], required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    demand: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    season: String,
    source: { type: String, default: "Live Pricing API" },
    latency_ms: Number,
    fetched_at: { type: Date, default: Date.now },
    metadata: {
      hub: String, // For mixed routes
      legs: Array,
    },
  },
  { timestamps: true }
);

// Optional: Add TTL index to auto-delete old records after 24 hours
priceSnapshotSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const PriceSnapshot =
  mongoose.models.PriceSnapshot ||
  mongoose.model("PriceSnapshot", priceSnapshotSchema);

export default PriceSnapshot;
