/**
 * Map Visualization Module
 * Handles all Leaflet map rendering and route visualization
 */

let map = null;
let markers = {};
let polylines = {};

/**
 * Initialize the Leaflet map
 */
export const initializeMap = (mapContainerId = "map") => {
  if (map) {
    console.warn("Map already initialized");
    return map;
  }

  map = L.map(mapContainerId).setView([22.9734, 78.6569], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  return map;
};

/**
 * City coordinates database
 */
const cityCoordinates = {
  Nagpur: [21.1458, 79.0882],
  Delhi: [28.7041, 77.1025],
  Mumbai: [19.076, 72.8776],
  Bangalore: [12.9716, 77.5946],
  Leh: [34.1526, 77.577],
  Kolkata: [22.5726, 88.3639],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Pune: [18.5204, 73.8567],
  Goa: [15.3417, 73.8244],
};

/**
 * Get coordinates for a city
 */
const getCoordinates = (city) => {
  return cityCoordinates[city] || [22.9734, 78.6569]; // Default to India center
};

/**
 * Clear all markers and polylines
 */
export const clearMap = () => {
  // Remove markers
  Object.values(markers).forEach((marker) => {
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
  });
  markers = {};

  // Remove polylines
  Object.values(polylines).forEach((polyline) => {
    if (map.hasLayer(polyline)) {
      map.removeLayer(polyline);
    }
  });
  polylines = {};
};

/**
 * Add a marker to the map
 */
const addMarker = (id, coordinates, title, type = "default", popup = "") => {
  let color = "blue";
  if (type === "source") color = "green";
  if (type === "destination") color = "red";
  if (type === "hub") color = "purple";

  const markerIcon = L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const marker = L.marker(coordinates, { icon: markerIcon, title })
    .addTo(map)
    .bindPopup(popup || title);

  markers[id] = marker;
  return marker;
};

/**
 * Draw a route polyline
 */
const drawPolyline = (id, coordinates, type = "direct", featured = false) => {
  let color = "#667eea";
  let weight = 2;
  let dashArray = null;

  if (featured) {
    color = "#fdd835";
    weight = 3;
  } else if (type === "direct") {
    dashArray = "5, 5";
  } else if (type === "train") {
    color = "#2ecc71";
  } else if (type === "flight") {
    color = "#e74c3c";
  }

  const polyline = L.polyline(coordinates, {
    color,
    weight,
    opacity: 0.8,
    dashArray,
  }).addTo(map);

  polylines[id] = polyline;
  return polyline;
};

/**
 * Animate a leg from one city to another by progressively drawing a polyline
 */
const animateLeg = (id, fromCoords, toCoords, color = "#3498db", steps = 80, interval = 18) => {
  const poly = L.polyline([], { color, weight: 4, opacity: 0.9 }).addTo(map);
  polylines[id] = poly;

  let i = 0;
  const dLat = (toCoords[0] - fromCoords[0]) / steps;
  const dLng = (toCoords[1] - fromCoords[1]) / steps;
  let lat = fromCoords[0];
  let lng = fromCoords[1];

  const timer = setInterval(() => {
    lat += dLat;
    lng += dLng;
    poly.addLatLng([lat, lng]);
    i++;
    if (i >= steps) clearInterval(timer);
  }, interval);

  return poly;
};

/**
 * Draw a complete route visualization
 */
export const drawRoute = (from, to, routeType, featured = false, hub = null) => {
  clearMap();

  const fromCoords = getCoordinates(from);
  const toCoords = getCoordinates(to);

  // Add source and destination markers
  addMarker(`${from}-source`, fromCoords, from, "source", `📍 ${from}`);
  addMarker(`${to}-destination`, toCoords, to, "destination", `📍 ${to}`);

  if (routeType === "DIRECT" || routeType === "FLIGHT") {
    // Draw direct flight route
    drawPolyline(
      "direct-flight",
      [fromCoords, toCoords],
      "flight",
      featured
    );
  } else if (routeType === "TRAIN") {
    // Draw direct train route
    drawPolyline(
      "direct-train",
      [fromCoords, toCoords],
      "train",
      featured
    );
  } else if (routeType === "MIXED" && hub) {
    // Draw mixed route with hub
    const hubCoords = getCoordinates(hub);

    // Flight leg
    drawPolyline("mixed-flight", [fromCoords, hubCoords], "flight", featured);

    // Train leg
    drawPolyline("mixed-train", [hubCoords, toCoords], "train", featured);

    // Add hub marker
    addMarker(`${hub}-hub`, hubCoords, hub, "hub", `🎯 Hub: ${hub}`);
  }

  // Fit bounds to show entire route
  const bounds = L.latLngBounds([fromCoords, toCoords]);
  map.fitBounds(bounds, { padding: [50, 50] });
};

/**
 * Draw all routes for comparison
 */
export const drawAllRoutes = (from, to, routes) => {
  clearMap();

  const fromCoords = getCoordinates(from);
  const toCoords = getCoordinates(to);

  // Add markers
  addMarker(`${from}-source`, fromCoords, from, "source", `📍 ${from}`);
  addMarker(`${to}-destination`, toCoords, to, "destination", `📍 ${to}`);

  // Draw all routes (only cheapest is featured)
  routes.forEach((route, index) => {
    const featured = route.featured || false;

    if (route.type === "FLIGHT" || (route.type === "DIRECT" && !route.hub)) {
      drawPolyline(
        `route-${index}`,
        [fromCoords, toCoords],
        "flight",
        featured
      );
    } else if (route.type === "TRAIN") {
      drawPolyline(
        `route-${index}`,
        [fromCoords, toCoords],
        "train",
        featured
      );
    } else if (route.type === "MIXED" && route.hub) {
      const hubCoords = getCoordinates(route.hub);
      // Animate legs for mixed routes if featured, otherwise draw simple lines
      if (featured) {
        animateLeg(`route-${index}-flight`, fromCoords, hubCoords, "#e74c3c");
        animateLeg(`route-${index}-train`, hubCoords, toCoords, "#2ecc71");
        addMarker(`route-${index}-hub`, hubCoords, route.hub, "hub", 
          `🎯 ${route.hub}\n💚 Cheapest Mixed Route`);
      } else {
        drawPolyline(`route-${index}-flight`, [fromCoords, hubCoords], "flight", false);
        drawPolyline(`route-${index}-train`, [hubCoords, toCoords], "train", false);
      }
    }
  });

  // Fit bounds
  const bounds = L.latLngBounds([fromCoords, toCoords]);
  map.fitBounds(bounds, { padding: [50, 50] });
};

/**
 * Add a popup to a location
 */
export const addPopup = (city, content) => {
  const coords = getCoordinates(city);
  const marker = L.marker(coords).addTo(map).bindPopup(content);
  return marker;
};

/**
 * Zoom to fit all markers
 */
export const zoomToFit = () => {
  if (Object.keys(markers).length === 0) return;

  const group = new L.featureGroup(Object.values(markers));
  map.fitBounds(group.getBounds(), { padding: [50, 50] });
};

/**
 * Get map instance
 */
export const getMap = () => map;

export default {
  initializeMap,
  clearMap,
  drawRoute,
  drawAllRoutes,
  addPopup,
  zoomToFit,
  getMap,
};
