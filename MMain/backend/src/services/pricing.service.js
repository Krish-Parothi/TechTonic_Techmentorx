import { random, delay } from "../utils/delay.util.js";
import { generateAIPrice } from "./gemini.service.js";

export const getFlightPrice = async (from, to) => {
  await delay(random(600, 1200));

  // AI-powered price generation (with fallback)
  const price = await generateAIPrice(
    "FLIGHT",
    4500,
    6500,
    getDemand(),
    new Date().getHours()
  );

  // Add some controlled variation but HARD-GUARD to min/max
  const variation = random(-80, 150);
  const final = Math.round(price + variation);
  const clamped = Math.max(4500, Math.min(6500, final));

  return {
    mode: "FLIGHT",
    from,
    to,
    price: clamped,
    source: "Live Airline Pricing API",
    latency_ms: random(700, 1200),
    timestamp: new Date().toISOString(),
  };
};

export const getTrainPrice = async (from, to) => {
  await delay(random(400, 900));

  // AI-powered price generation (with fallback)
  const price = await generateAIPrice(
    "TRAIN",
    1200,
    3200,
    getDemand(),
    new Date().getHours()
  );

  // Controlled variation + hard-guard
  const variationT = random(-50, 100);
  const finalT = Math.round(price + variationT);
  const clampedT = Math.max(1200, Math.min(3200, finalT));

  return {
    mode: "TRAIN",
    from,
    to,
    price: clampedT,
    source: "Indian Rail Live Fare API",
    latency_ms: random(500, 900),
    timestamp: new Date().toISOString(),
  };
};

export const getMixedRoute = async (from, hub, to) => {
  const leg1 = await getFlightPrice(from, hub);
  const leg2 = await getTrainPrice(hub, to);

  return {
    mode: "MIXED",
    legs: [leg1, leg2],
    total_price: leg1.price + leg2.price,
    hub: hub,
  };
};

// Helper: Determine demand based on time of booking
const getDemand = () => {
  const hour = new Date().getHours();
  if (hour >= 9 && hour <= 11) return "High"; // Morning rush
  if (hour >= 18 && hour <= 20) return "High"; // Evening rush
  if (hour >= 23 || hour <= 6) return "Low"; // Night
  return "Medium";
};
