/**
 * Time Estimate Service
 * Estimates travel time based on mode and distance
 */
import { haversine } from "../utils/distance.util.js";
import { CITY_COORDS } from "../utils/coords.js";

/**
 * Estimate travel time in hours
 */
export const estimateTime = (mode, from, to) => {
  try {
    const fromCoord = CITY_COORDS[from];
    const toCoord = CITY_COORDS[to];

    if (!fromCoord || !toCoord) {
      return 24; // Assume max time on error
    }

    const distKm = haversine(fromCoord, toCoord);

    if (mode === "FLIGHT") {
      // Flight: ~700 km/h cruise, plus 2 hours boarding/taxiing
      return Math.ceil((distKm / 700 + 2) * 10) / 10;
    } else if (mode === "TRAIN") {
      // Train: ~80 km/h average (including stops)
      return Math.ceil((distKm / 80) * 10) / 10;
    }

    return 0;
  } catch (err) {
    return 24; // Assume max time on error
  }
};

export default { estimateTime };
