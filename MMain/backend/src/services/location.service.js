/**
 * Location Service
 * Resolves city names to coordinates and nearest airports/stations
 */

// City database with coordinates and nearest airports
const CITIES_DB = {
  nagpur: {
    name: "Nagpur",
    lat: 21.1458,
    lon: 79.0882,
    airport: "NAG", // Dr. Babasaheb Ambedkar International Airport
    station: "Nagpur Railway Station",
  },
  delhi: {
    name: "Delhi",
    lat: 28.7041,
    lon: 77.1025,
    airport: "DEL", // Indira Gandhi International
    station: "New Delhi Railway Station",
  },
  mumbai: {
    name: "Mumbai",
    lat: 19.076,
    lon: 72.8776,
    airport: "BOM", // Bombay Sambhaji Maharaj International
    station: "Mumbai Central Railway Station",
  },
  bangalore: {
    name: "Bangalore",
    lat: 12.9716,
    lon: 77.5946,
    airport: "BLR", // Kempegowda International
    station: "Bangalore City Railway Station",
  },
  leh: {
    name: "Leh",
    lat: 34.1526,
    lon: 77.577,
    airport: "LEH", // Kushok Bakula Rimpochee
    station: "Leh Station", // Limited rail connectivity
  },
  kolkata: {
    name: "Kolkata",
    lat: 22.5726,
    lon: 88.3639,
    airport: "CCU", // Netaji Subhas Chandra Bose
    station: "Howrah Railway Station",
  },
  hyderabad: {
    name: "Hyderabad",
    lat: 17.385,
    lon: 78.4867,
    airport: "HYD", // Rajiv Gandhi International
    station: "Hyderabad Deccan Railway Station",
  },
  chennai: {
    name: "Chennai",
    lat: 13.0827,
    lon: 80.2707,
    airport: "MAA", // Chennai International
    station: "Chennai Central Railway Station",
  },
  pune: {
    name: "Pune",
    lat: 18.5204,
    lon: 73.8567,
    airport: "PNQ", // Pune Airport
    station: "Pune Railway Station",
  },
  goa: {
    name: "Goa",
    lat: 15.3417,
    lon: 73.8244,
    airport: "GOI", // Manohar International Airport
    station: "Madgaon Railway Station",
  },
};

/**
 * Resolve city name to location object
 */
export const resolveLocation = (cityName) => {
  const key = cityName.toLowerCase().trim();
  if (CITIES_DB[key]) {
    return CITIES_DB[key];
  }
  throw new Error(`City not found: ${cityName}`);
};

/**
 * Get all available cities
 */
export const getAvailableCities = () =>
  Object.values(CITIES_DB).map((city) => city.name);

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get nearest airport/station from a city
 */
export const getNearestTransport = (cityName) => {
  const location = resolveLocation(cityName);
  return {
    airport: location.airport,
    station: location.name,
    coordinates: { lat: location.lat, lon: location.lon },
  };
};

export default {
  resolveLocation,
  getAvailableCities,
  calculateDistance,
  getNearestTransport,
};
