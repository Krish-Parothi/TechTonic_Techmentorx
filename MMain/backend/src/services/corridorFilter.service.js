/**
 * Corridor Filter Service
 * Validates that intermediate cities are on a sensible route corridor
 */
import { haversine } from "../utils/distance.util.js";
import { CITY_COORDS } from "../utils/coords.js";

export const corridorFilter = (from, to, cities) => {
  try {
    // Get coordinates directly from CITY_COORDS
    const fromCoord = CITY_COORDS[from];
    const toCoord = CITY_COORDS[to];
    
    if (!fromCoord || !toCoord) {
      return [];
    }

    const directDist = haversine(fromCoord, toCoord);

    // Allow up to 50% detour for realistic train connections
    // (trains have established networks that may not follow straight lines)
    const DETOUR_TOLERANCE = 1.5;
    const maxDistance = directDist * DETOUR_TOLERANCE;

    return cities.filter((city) => {
      try {
        const cityCoord = CITY_COORDS[city];
        
        if (!cityCoord) {
          return false;
        }

        const d1 = haversine(fromCoord, cityCoord);
        const d2 = haversine(cityCoord, toCoord);
        const viaTotal = d1 + d2;

        // City must be on the route corridor and not a massive detour
        return viaTotal <= maxDistance;
      } catch (err) {
        return false;
      }
    });
  } catch (err) {
    return [];
  }
};

export default { corridorFilter };
