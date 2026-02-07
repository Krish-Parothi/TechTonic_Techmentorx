const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion;

// ==================== CONSTANTS & DATA ====================

const CITY_DATABASE = {
  nagpur: { name: "Nagpur", airport: "NAG", lat: 21.1458, lon: 79.0882 },
  delhi: { name: "Delhi", airport: "DEL", lat: 28.7041, lon: 77.1025 },
  mumbai: { name: "Mumbai", airport: "BOM", lat: 19.076, lon: 72.8776 },
  bangalore: { name: "Bangalore", airport: "BLR", lat: 12.9716, lon: 77.5946 },
  leh: { name: "Leh", airport: "LEH", lat: 34.1526, lon: 77.577 },
  kolkata: { name: "Kolkata", airport: "CCU", lat: 22.5726, lon: 88.3639 },
  hyderabad: { name: "Hyderabad", airport: "HYD", lat: 17.385, lon: 78.4867 },
  chennai: { name: "Chennai", airport: "MAA", lat: 13.0827, lon: 80.2707 },
  pune: { name: "Pune", airport: "PNQ", lat: 18.5204, lon: 73.8567 },
  goa: { name: "Goa", airport: "GOI", lat: 15.3417, lon: 73.8244 },
};

const LOCATION_COORDS = {
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

// ==================== HEADER COMPONENT ====================

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        ✈️ AIRPORT // LLM
      </motion.h1>
      <motion.p
        className="subtitle"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        AI-OPTIMIZED ROUTING SYSTEM
      </motion.p>
      <motion.div
        className="status-badge"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        🟢 SYSTEM NORMAL
      </motion.div>
    </motion.header>
  );
}

// ==================== AIRPORT INPUT COMPONENT ====================

function AirportInput({ label, value, onChange, placeholder, airportCode }) {
  return (
    <motion.div
      className="input-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <label className="input-label">{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="input-field"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          list="airport-list"
        />
        {airportCode && (
          <motion.div
            className="airport-code show"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {airportCode}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== BOARDING PASS COMPONENT ====================

function BoardingPass({ route, from, to }) {
  const typeEmoji = {
    FLIGHT: "✈️",
    TRAIN: "🚂",
    MIXED: "🔀",
  }[route.type] || "📍";

  return (
    <motion.div
      className={`route-card ${route.featured ? "featured" : ""} ${
        route.visibility === "SECONDARY" ? "secondary" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* Route Header */}
      <div className="route-header">
        <div>
          <div className="route-type">
            {typeEmoji}{" "}
            {route.type === "FLIGHT"
              ? `Direct Flight: ${from} → ${to}`
              : route.type === "TRAIN"
              ? `Direct Train: ${from} → ${to}`
              : `Multi-leg via ${route.hub}: ${from} → ${route.hub} → ${to}`}
          </div>
          {route.featured && (
            <span className="featured-badge">⭐ CHEAPEST</span>
          )}
        </div>
        <motion.div
          className="route-price"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          ₹{(route.total_price ?? route.price ?? 0).toLocaleString("en-IN")}
        </motion.div>
      </div>

      {/* Route Details */}
      <div className="route-details">
        {route.type === "FLIGHT" && (
          <div className="route-details-row">
            <div className="detail-item">
              <div className="detail-label">Duration</div>
              <div className="detail-value">
                {route.total_time.toFixed(1)} hours
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Stops</div>
              <div className="detail-value">Non-stop</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Source</div>
              <div className="detail-value">Live API</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Updated</div>
              <div className="detail-value">Just now</div>
            </div>
          </div>
        )}

        {route.type === "TRAIN" && (
          <div className="route-details-row">
            <div className="detail-item">
              <div className="detail-label">Duration</div>
              <div className="detail-value">
                {route.total_time.toFixed(1)} hours
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Class</div>
              <div className="detail-value">Sleeper/AC</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Source</div>
              <div className="detail-value">Live API</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Available</div>
              <div className="detail-value">Multiple times</div>
            </div>
          </div>
        )}

        {route.type === "MIXED" && (
          <>
            <div className="route-details-row">
              <div className="detail-item">
                <div className="detail-label">Route Type</div>
                <div className="detail-value">Optimized Connection</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Hub</div>
                <div className="detail-value">{route.hub}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Total Time</div>
                <div className="detail-value">
                  {route.total_time.toFixed(1)} hours
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Source</div>
                <div className="detail-value">Route Optimization</div>
              </div>
            </div>

            {route.explanation && (
              <motion.div
                className="explanation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                💡 {route.explanation}
              </motion.div>
            )}

            {route.legs && route.legs[0] && (
              <div className="leg-info">
                ✈️ <strong>Leg 1:</strong> {route.legs[0].from} →{" "}
                {route.legs[0].to} | ₹
                {(route.legs[0].price || 0).toLocaleString("en-IN")}
              </div>
            )}

            {route.legs && route.legs[1] && (
              <div className="leg-info">
                🚂 <strong>Leg 2:</strong> {route.legs[1].from} →{" "}
                {route.legs[1].to} | ₹
                {(route.legs[1].price || 0).toLocaleString("en-IN")}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

// ==================== ROUTES LIST COMPONENT ====================

function RoutesList({ routes, rejected, from, to, showAll, setShowAll }) {
  const visibleRoutes = showAll
    ? routes
    : routes.filter((r) => r.visibility !== "SECONDARY");
  const secondaryCount = routes.filter(
    (r) => r.visibility === "SECONDARY"
  ).length;

  return (
    <motion.div className="routes-list">
      <AnimatePresence>
        {visibleRoutes.map((route, idx) => (
          <BoardingPass
            key={idx}
            route={route}
            from={from}
            to={to}
          />
        ))}
      </AnimatePresence>

      {/* Show More / Hide Button */}
      {secondaryCount > 0 && (
        <motion.button
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showAll
            ? "Hide secondary routes"
            : `Show ${secondaryCount} more route(s)`}
        </motion.button>
      )}

      {/* Rejected Routes */}
      {rejected && rejected.length > 0 && (
        <motion.div
          className="rejected-routes-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4>🚫 Evaluated but not recommended:</h4>
          <div className="rejected-routes-list">
            <AnimatePresence>
              {rejected.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="rejected-route-card"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="rejected-route-text">
                    <strong>{item.city}</strong>
                    <span className="rejection-reason">{item.reason}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ==================== MAP COMPONENT ====================

function MapComponent({ from, to, routes }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [22.9734, 78.6569],
        5
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const fromCoords = LOCATION_COORDS[from] || [22.9734, 78.6569];
    const toCoords = LOCATION_COORDS[to] || [22.9734, 78.6569];

    // Add markers
    L.marker(fromCoords, {
      title: from,
      icon: L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    })
      .addTo(map)
      .bindPopup(`📍 <strong>${from}</strong><br>Source`);

    L.marker(toCoords, {
      title: to,
      icon: L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    })
      .addTo(map)
      .bindPopup(`📍 <strong>${to}</strong><br>Destination`);

    // Find cheapest route
    const cheapest = routes.reduce((min, route) => {
      const p = route.total_price ?? route.price ?? Number.MAX_SAFE_INTEGER;
      const mp = min.total_price ?? min.price ?? Number.MAX_SAFE_INTEGER;
      return p < mp ? route : min;
    });

    if (cheapest.type === "FLIGHT") {
      L.polyline([fromCoords, toCoords], {
        color: "#fdd835",
        weight: 4,
        opacity: 0.9,
      })
        .addTo(map)
        .bindPopup(
          `✈️ <strong>Flight</strong><br>₹${cheapest.price.toLocaleString(
            "en-IN"
          )}`
        );
    } else if (cheapest.type === "TRAIN") {
      L.polyline([fromCoords, toCoords], {
        color: "#2ecc71",
        weight: 4,
        opacity: 0.9,
        dashArray: "10, 5",
      })
        .addTo(map)
        .bindPopup(
          `🚂 <strong>Train</strong><br>₹${cheapest.price.toLocaleString(
            "en-IN"
          )}`
        );
    } else if (cheapest.type === "MIXED" && cheapest.hub) {
      const hubCoords = LOCATION_COORDS[cheapest.hub] || fromCoords;

      L.polyline([fromCoords, hubCoords], {
        color: "#e74c3c",
        weight: 3,
        opacity: 0.8,
      })
        .addTo(map)
        .bindPopup(`✈️ Flight to ${cheapest.hub}`);

      L.polyline([hubCoords, toCoords], {
        color: "#3498db",
        weight: 3,
        opacity: 0.8,
        dashArray: "5, 5",
      })
        .addTo(map)
        .bindPopup(`🚂 Train from ${cheapest.hub}`);

      L.circleMarker(hubCoords, {
        radius: 10,
        fillColor: "#f39c12",
        fillOpacity: 0.8,
        color: "#e67e22",
        weight: 2,
        title: cheapest.hub,
      })
        .addTo(map)
        .bindPopup(`🎯 <strong>Hub: ${cheapest.hub}</strong><br>💚 Cheapest Route`);
    }

    // Fit bounds
    const bounds = L.latLngBounds([fromCoords, toCoords]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [from, to, routes]);

  return <div id="map-view" ref={mapRef} className="map-container" />;
}

// ==================== MAIN APP COMPONENT ====================

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const handleFromChange = (e) => setFrom(e.target.value);
  const handleToChange = (e) => setTo(e.target.value);

  const handleSwap = () => {
    [setFrom, setTo] = [setTo, setFrom];
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const getAirportCode = (city) => {
    const info = CITY_DATABASE[city.toLowerCase().trim()];
    return info?.airport || "";
  };

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) {
      alert("Please enter both source and destination");
      return;
    }

    if (!CITY_DATABASE[from.toLowerCase().trim()]) {
      alert(`City not found: ${from}`);
      return;
    }

    if (!CITY_DATABASE[to.toLowerCase().trim()]) {
      alert(`City not found: ${to}`);
      return;
    }

    const startTime = Date.now();
    setLoading(true);
    setResults(null);
    setShowAll(false);

    try {
      await new Promise((res) => setTimeout(res, 500));

      const response = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const time = (Date.now() - startTime) / 1000;
      setElapsed(time.toFixed(1));
      setResults(data);
    } catch (error) {
      alert(`Error: ${error.message}. Ensure backend is running on port 5000.`);
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container">
      <Header />

      {!results ? (
        <>
          {/* Search Section */}
          <motion.section className="search-section">
            <h2>Search Routes</h2>
            <div className="search-bar">
              <AirportInput
                label="From"
                value={from}
                onChange={handleFromChange}
                placeholder="Enter city..."
                airportCode={getAirportCode(from)}
              />

              <motion.button
                className="swap-btn"
                onClick={handleSwap}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ⇄
              </motion.button>

              <AirportInput
                label="To"
                value={to}
                onChange={handleToChange}
                placeholder="Enter city..."
                airportCode={getAirportCode(to)}
              />

              <motion.button
                className="search-btn"
                onClick={handleSearch}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? "SEARCHING..." : "SEARCH"}
              </motion.button>
            </div>

            {/* Loading State */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  className="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="spinner" />
                  <p>Finding optimal routes...</p>
                  <p className="latency">Connecting to AI routing engine</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Empty Map */}
          {!loading && (
            <motion.section className="map-section">
              <h3>Route Map</h3>
              <div className="map-container" style={{ background: "#rgba(0,0,0,0.2)" }} />
            </motion.section>
          )}
        </>
      ) : (
        <>
          {/* Results Header */}
          <motion.section
            className="results-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="results-header">
              <div className="results-info">
                <div className="results-count">
                  <strong>
                    {from} ({getAirportCode(from)}) → {to} ({getAirportCode(to)})
                  </strong>{" "}
                  | {results.routes.length} routes found
                </div>
                <div className="cheapest-badge">
                  💚 Best Price: {results.cheapest.type} @ ₹
                  {results.cheapest.price.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <motion.div
              className="status-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "rgba(0, 255, 150, 0.1)",
                border: "1px solid rgba(0, 255, 150, 0.2)",
                color: "rgba(0, 255, 150, 0.9)",
                padding: "15px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              ✅ Prices updated just now ({new Date().toLocaleTimeString()}) -
              Fetched in {elapsed}s via Live Pricing APIs
            </motion.div>

            {/* Routes */}
            <RoutesList
              routes={results.routes}
              rejected={results.rejected_routes}
              from={from}
              to={to}
              showAll={showAll}
              setShowAll={setShowAll}
            />

            {/* Search Again Button */}
            <motion.button
              className="search-again-btn"
              onClick={() => setResults(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              style={{ width: "100%", marginTop: "20px" }}
            >
              Search Another Route
            </motion.button>
          </motion.section>

          {/* Map Section */}
          <motion.section
            className="map-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3>Route Map</h3>
            <MapComponent from={from} to={to} routes={results.routes} />
          </motion.section>
        </>
      )}

      {/* Footer */}
      <footer>
        <p>🌍 AI-Powered Multimodal Route Optimization</p>
        <p>© 2024 TechTonic - Route Analysis Powered by Google Generative AI</p>
      </footer>

      {/* Datalist for city autocomplete */}
      <datalist id="airport-list">
        {Object.entries(CITY_DATABASE).map(([key, city]) => (
          <option key={key} value={city.name} />
        ))}
      </datalist>
    </div>
  );
}

// ==================== RENDER APP ====================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
