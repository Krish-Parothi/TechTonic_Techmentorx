import mongoose from "mongoose";

const airportSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true }, // e.g., "NAG", "DEL"
    name: { type: String, required: true }, // e.g., "Indira Gandhi International"
    city: { type: String, required: true }, // e.g., "Delhi"
    country: { type: String, default: "India" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timezone: String,
    iata: String, // IATA code
    icao: String, // ICAO code
  },
  { timestamps: true }
);

export const Airport =
  mongoose.models.Airport || mongoose.model("Airport", airportSchema);

export default Airport;
