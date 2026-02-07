/**
 * Route Service
 * Finds and calculates possible routes between cities
 */
import { resolveLocation, calculateDistance } from "./location.service.js";

// Major transit hubs in India
const MAJOR_HUBS = ["Delhi", "Mumbai", "Bangalore"];

/**
 * Get valid hubs between two cities using distance: hub must reduce total distance
 */
export const getValidHubs = (from, to) => {
  try {
    const fromLoc = resolveLocation(from);
    const toLoc = resolveLocation(to);

    const directDist = calculateDistance(
      fromLoc.lat,
      fromLoc.lon,
      toLoc.lat,
      toLoc.lon
    );

    return MAJOR_HUBS.filter((hub) => {
      if (hub === from || hub === to) return false;
      try {
        const hubLoc = resolveLocation(hub);
        const d1 = calculateDistance(fromLoc.lat, fromLoc.lon, hubLoc.lat, hubLoc.lon);
        const d2 = calculateDistance(hubLoc.lat, hubLoc.lon, toLoc.lat, toLoc.lon);

        // Hub should be between source and destination and reduce total distance
        // Additionally ensure the via-hub path is not significantly longer than direct
        const viaTotal = d1 + d2;
        const allowance = 1.05; // allow up to 5% extra distance for sensible connections
        return d1 < directDist && d2 < directDist && viaTotal <= directDist * allowance;
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
};

/**
 * Get direct route between two cities
 */
export const getDirectRoute = (from, to) => {
  return {
    type: "DIRECT",
    legs: [
      {
        from,
        to,
        mode: "TRANSPORT", // Will be FLIGHT or TRAIN
      },
    ],
  };
};

/**
 * Get mixed routes via hubs
 * Returns array of potential multi-leg routes
 */
export const getMixedRoutes = (from, to) => {
  const mixedRoutes = [];

  // Use valid hubs that actually make geographic sense
  const viableHubs = getValidHubs(from, to);

  for (const hub of viableHubs) {
    mixedRoutes.push({
      type: "MIXED",
      hub,
      legs: [
        { from, to: hub, mode: "FLIGHT" },
        { from: hub, to, mode: "TRAIN" },
      ],
    });
  }

  return mixedRoutes;
};

/**
 * Get all possible routes between two cities
 */
export const getAllRoutes = (from, to) => {
  const routes = [];

  // Direct flight
  routes.push({
    type: "DIRECT",
    mode: "FLIGHT",
    from,
    to,
  });

  // Direct train
  routes.push({
    type: "DIRECT",
    mode: "TRAIN",
    from,
    to,
  });

  // Mixed routes
  const mixed = getMixedRoutes(from, to);
  routes.push(...mixed);

  return routes;
};

/**
 * Rank routes by price (requires price data)
 */
export const rankRoutesByPrice = (routesWithPrices) => {
  return [...routesWithPrices].sort((a, b) => a.price - b.price);
};

/**
 * Find cheapest route
 */
export const findCheapestRoute = (routes) => {
  if (!routes || routes.length === 0) return null;
  return routes.reduce((min, route) => {
    const p = route.total_price ?? route.price ?? Number.MAX_SAFE_INTEGER;
    const mp = min.total_price ?? min.price ?? Number.MAX_SAFE_INTEGER;
    return p < mp ? route : min;
  });
};

export default {
  getDirectRoute,
  getMixedRoutes,
  getAllRoutes,
  rankRoutesByPrice,
  findCheapestRoute,
};
