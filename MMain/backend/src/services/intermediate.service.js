/**
 * Intermediate Cities Discovery Service
 * Uses Gemini to generate realistic intermediate cities between source and destination
 * Falls back to sensible defaults if Gemini fails
 */
import model from "../config/gemini.js";
import { getCache, setCache } from "./cache.service.js";

// Smart fallback intermediate cities for common route segments
const FALLBACK_INTERMEDIATES = {
  "Nagpur-Leh": ["Delhi", "Chandigarh"],
  "Nagpur-Delhi": ["Bhopal", "Gwalior", "Jaipur", "Agra"],
  "Nagpur-Shimla": ["Delhi", "Chandigarh"],
  "Nagpur-Kolkata": ["Raipur", "Bilaspur", "Jharsuguda"],
  "Nagpur-Bangalore": ["Hyderabad", "Belgaum"],
  "Nagpur-Chennai": ["Hyderabad"],
  "Nagpur-Mumbai": ["Pune"],
  "Nagpur-Goa": ["Pune"],
  "Mumbai-Delhi": ["Indore", "Gwalior", "Jaipur", "Agra"],
  "Mumbai-Bangalore": ["Pune", "Belgaum"],
  "Mumbai-Chennai": ["Bangalore", "Hyderabad"],
  "Mumbai-Kolkata": ["Indore", "Bhopal", "Allahabad"],
  "Delhi-Bangalore": ["Bhopal", "Indore", "Hyderabad"],
  "Delhi-Chennai": ["Hyderabad", "Bhopal"],
  "Delhi-Kolkata": ["Allahabad", "Varanasi"],
  "Delhi-Leh": ["Chandigarh", "Shimla"],
  "Bangalore-Chennai": ["Tirupati"],
  "Bangalore-Hyderabad": ["Kurnool"],
  "Bangalore-Kolkata": ["Hyderabad", "Bhopal"],
  "Chennai-Delhi": ["Hyderabad", "Bhopal", "Jaipur"],
  "Chennai-Kolkata": ["Hyderabad", "Bhopal", "Allahabad"],
  "Kolkata-Mumbai": ["Allahabad", "Indore", "Bhopal"],
};

// Default intermediates for any unspecified route (major hub cities)
const DEFAULT_INTERMEDIATES = ["Delhi", "Bhopal", "Hyderabad"];

/**
 * Get fallback intermediates with smart defaulting
 */
const getFallbackIntermediates = (from, to) => {
  const key = `${from}-${to}`;
  const reversed = `${to}-${from}`;
  
  // Try exact match first
  if (FALLBACK_INTERMEDIATES[key]) {
    return FALLBACK_INTERMEDIATES[key];
  }
  
  // Try reversed match
  if (FALLBACK_INTERMEDIATES[reversed]) {
    return FALLBACK_INTERMEDIATES[reversed];
  }
  
  // Return smart default if no match (major hub cities that work for most routes)
  return DEFAULT_INTERMEDIATES;
};

export const getPossibleIntermediates = async (from, to) => {
  const key = `cities:${from}:${to}`;
  const cached = getCache(key);
  if (cached) return cached;

  try {
    const prompt = `List intermediate cities between ${from} and ${to} for train/flight connections.
Output: JSON array only, no text.
Example: ["Delhi","Jaipur"]`;

    // Wrap in timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 5000)
    );
    
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    const text = result.response.text().trim();

    let cities = [];
    try {
      // Try direct JSON parse
      cities = JSON.parse(text);
    } catch (err) {
      // Try to extract array from markdown or wrapped text
      const match = text.match(/\[.*\]/s);
      if (match) {
        try {
          cities = JSON.parse(match[0]);
        } catch {
          // If still fails, will use fallback below
        }
      }
    }

    // Ensure it's an array of strings
    cities = Array.isArray(cities) ? cities.filter((c) => typeof c === "string") : [];

    // If Gemini returned nothing, use smart fallback
    if (cities.length === 0) {
      cities = getFallbackIntermediates(from, to);
    }

    setCache(key, cities);
    return cities;
  } catch (err) {
    // Last resort: smart fallback
    const cities = getFallbackIntermediates(from, to);
    setCache(key, cities);
    return cities;
  }
};

export default { getPossibleIntermediates };
