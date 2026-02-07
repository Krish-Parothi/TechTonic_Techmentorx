/**
 * Search Controller - NEW AI-DRIVEN ROUTING SYSTEM
 * AI suggests intermediate cities, backend filters realism
 */
import { getFlightPrice, getTrainPrice } from "../services/pricing.service.js";
import { resolveLocation } from "../services/location.service.js";
import { getPossibleIntermediates } from "../services/intermediate.service.js";
import { corridorFilter } from "../services/corridorFilter.service.js";
import { estimateTime } from "../services/timeEstimate.service.js";
import { explainCombo } from "../services/explain.service.js";
import { PriceSnapshot } from "../models/priceSnapshot.model.js";

export const searchController = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: "Missing from/to locations" });
    }

    // Validate locations exist
    try {
      resolveLocation(from);
      resolveLocation(to);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const routes = [];
    const rejectedRoutes = [];

    // ========== DIRECT FLIGHT ==========
    const directFlight = await getFlightPrice(from, to);
    const directFlightTime = estimateTime("FLIGHT", from, to);

    routes.push({
      type: "FLIGHT",
      price: directFlight.price,
      total_time: directFlightTime,
      from,
      to,
      visibility: "PRIMARY",
      featured: false,
    });

    // ========== DIRECT TRAIN ==========
    const directTrain = await getTrainPrice(from, to);
    const directTrainTime = estimateTime("TRAIN", from, to);

    routes.push({
      type: "TRAIN",
      price: directTrain.price,
      total_time: directTrainTime,
      from,
      to,
      visibility: "PRIMARY",
      featured: false,
    });

    // ========== AI-DRIVEN MIXED ROUTES ==========
    try {
      // Step 1: AI suggests possibilities
      const aiCities = await getPossibleIntermediates(from, to);
      console.log(`🌍 Intermediates for ${from}→${to}: [${aiCities.join(", ")}]`);

      // Step 2: Geographic corridor filter
      const validCities = corridorFilter(from, to, aiCities);

      // Step 3: Generate mixed routes with validation
      for (const city of validCities) {
        try {
          // Get pricing
          const flightLeg = await getFlightPrice(from, city);
          const trainLeg = await getTrainPrice(city, to);

          // Estimate times
          const flightTime = estimateTime("FLIGHT", from, city);
          const trainTime = estimateTime("TRAIN", city, to);
          const totalTime = flightTime + trainTime;

          // Time sanity check: no route > 24 hours
          if (totalTime > 24) {
            rejectedRoutes.push({
              city,
              reason: `Exceeds 24-hour travel time (${totalTime.toFixed(1)}h)`,
            });
            continue;
          }

          const total = flightLeg.price + trainLeg.price;
          const saving = directFlight.price - total;

          let explanation = null;
          if (saving > 500) {
            explanation = await explainCombo({ from, hub: city, to, saving });
          }

          routes.push({
            type: "MIXED",
            total_price: total,
            total_time: Math.round(totalTime * 10) / 10,
            legs: [
              { mode: "FLIGHT", from, to: city, price: flightLeg.price },
              { mode: "TRAIN", from: city, to, price: trainLeg.price },
            ],
            hub: city,
            explanation,
            visibility: "SECONDARY", // Secondary by default
            featured: false,
          });
        } catch (err) {
          rejectedRoutes.push({
            city,
            reason: "Route generation failed",
          });
        }
      }

      // Track rejected cities from AI (out of corridor)
      const acceptedCities = validCities;
      const rejectedCities = aiCities.filter(
        (c) => !acceptedCities.includes(c)
      );
      rejectedCities.forEach((city) => {
        rejectedRoutes.push({
          city,
          reason: "Out of route corridor (geographic detour)",
        });
      });
    } catch (err) {
      console.error("AI-driven routing error:", err.message);
      // Continue with direct routes only
    }

    // ========== RANK & FEATURE ==========
    const getPrice = (r) => r.total_price ?? r.price ?? Number.MAX_SAFE_INTEGER;
    routes.sort((a, b) => getPrice(a) - getPrice(b));

    // Mark top 3 as PRIMARY, rest as SECONDARY
    const PRIMARY_LIMIT = 3;
    routes.forEach((r, i) => {
      if (i < PRIMARY_LIMIT) {
        r.visibility = "PRIMARY";
      } else {
        r.visibility = "SECONDARY";
      }
    });

    // Feature cheapest
    if (routes.length > 0) {
      routes[0].featured = true;
    }

    // ========== OPTIONAL DB LOGGING ==========
    try {
      if (process.env.LOG_PRICES !== "false") {
        routes.forEach((route) => {
          const snapshot = new PriceSnapshot({
            route: { from, to },
            type: route.type,
            price: getPrice(route),
            source: route.type === "MIXED" ? "Multi-Leg Route Optimization" : "Live API",
            demand: getDemand(),
            metadata: {
              hub: route.hub,
              time: route.total_time,
            },
          });
          snapshot.save().catch(() => {});
        });
      }
    } catch {
      // Fail silently
    }

    // ========== BUILD RESPONSE ==========
    res.json({
      fetched_at: new Date().toISOString(),
      routes: routes.map((r) => {
        if (r.type === "MIXED") {
          return {
            type: "MIXED",
            total_price: r.total_price,
            total_time: r.total_time,
            legs: r.legs,
            hub: r.hub,
            explanation: r.explanation,
            visibility: r.visibility,
            featured: r.featured || false,
          };
        }

        return {
          type: r.type,
          price: r.price,
          total_time: r.total_time,
          from: r.from,
          to: r.to,
          visibility: r.visibility,
          featured: r.featured || false,
        };
      }),
      rejected_routes: rejectedRoutes,
      cheapest: {
        type: routes[0]?.type || "unknown",
        price: getPrice(routes[0] || {}),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
};

const getDemand = () => {
  const hour = new Date().getHours();
  if ((hour >= 9 && hour <= 11) || (hour >= 18 && hour <= 20)) return "High";
  if (hour >= 23 || hour <= 6) return "Low";
  return "Medium";
};
