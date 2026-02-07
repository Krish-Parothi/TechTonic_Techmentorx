// ============================================
// LOCATION DATA & CITY INFORMATION
// ============================================

const cityDatabase = {
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

const locationCoords = {
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

// ============================================
// MAP INITIALIZATION
// ============================================

let map = null;
let markers = {};
let polylines = {};

function initializeMap() {
  if (map) return map;
  
  map = L.map("map").setView([22.9734, 78.6569], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);
  
  return map;
}

// ============================================
// LOCATION UTILITIES
// ============================================

function getCityInfo(cityName) {
  const key = cityName.toLowerCase().trim();
  return cityDatabase[key];
}

function updateAirportCode(inputId, labelId) {
  const city = document.getElementById(inputId).value.trim();
  const label = document.getElementById(labelId);
  
  if (city) {
    const info = getCityInfo(city);
    if (info) {
      label.textContent = info.airport;
      label.classList.add("show");
    } else {
      label.classList.remove("show");
    }
  } else {
    label.classList.remove("show");
  }
}

function swapCities() {
  const fromInput = document.getElementById("from");
  const toInput = document.getElementById("to");
  [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
  
  updateAirportCode("from", "from-airport");
  updateAirportCode("to", "to-airport");
}

// Update airport codes on input
document.getElementById("from")?.addEventListener("input", () => {
  updateAirportCode("from", "from-airport");
});

document.getElementById("to")?.addEventListener("input", () => {
  updateAirportCode("to", "to-airport");
});

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

let searchStartTime = null;
let currentShowAll = false;
let currentRoutes = [];
let currentRejected = [];

async function search() {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();

  if (!from || !to) {
    alert("Please enter both source and destination from the list");
    return;
  }

  // Validate cities
  if (!getCityInfo(from)) {
    alert(`City not found: ${from}`);
    return;
  }
  if (!getCityInfo(to)) {
    alert(`City not found: ${to}`);
    return;
  }

  searchStartTime = Date.now();
  
  // Show loading state
  document.getElementById("loading").style.display = "block";
  document.getElementById("status").textContent = "";
  document.getElementById("results").style.display = "none";

  try {
    // Small artificial delay for UX
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

    // Hide loading, show results
    document.getElementById("loading").style.display = "none";
    const elapsed = Math.round((Date.now() - searchStartTime) / 100) / 10;
    document.getElementById("status").innerHTML =
      `✅ Prices updated just now (${new Date().toLocaleTimeString()}) - Fetched in ${elapsed}s via Live Pricing APIs`;
    document.getElementById("results").style.display = "block";

    // Display search info
    const fromCity = getCityInfo(from).airport;
    const toCity = getCityInfo(to).airport;
    document.querySelector(".search-info").innerHTML =
      `<strong>${from} (${fromCity}) → ${to} (${toCity})</strong> | ${data.routes.length} routes found`;

    // Store data for show-more functionality
    currentShowAll = false;
    currentRoutes = data.routes;
    currentRejected = data.rejected_routes || [];

    // Render routes
    renderRoutes(from, to);

    // Render cheapest info
    const cheapest = data.cheapest;
    document.querySelector(".cheapest-badge").innerHTML =
      `💚 Best Price: ${cheapest.type} @ ₹${cheapest.price.toLocaleString("en-IN")}`;

    // Draw map
    initializeMap();
    drawMap(from, to, data.routes);
  } catch (error) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("status").innerHTML =
      `❌ Error: ${error.message}. Ensure backend is running on port 5000.`;
    console.error("Search error:", error);
  }
}

// ============================================
// ROUTE RENDERING
// ============================================

function renderRoutes(from, to) {
  const routesList = document.getElementById("routesList");
  routesList.innerHTML = "";

  // Filter routes: show PRIMARY by default, all if showAll
  const visibleRoutes = currentShowAll
    ? currentRoutes
    : currentRoutes.filter((r) => r.visibility !== "SECONDARY");

  // Render visible routes
  visibleRoutes.forEach((route, index) => {
    const card = document.createElement("div");
    card.className = `route-card ${route.featured ? "featured" : ""} ${
      route.visibility === "SECONDARY" ? "secondary" : ""
    }`;

    const typeEmoji = {
      FLIGHT: "✈️",
      TRAIN: "🚂",
      MIXED: "🔀",
    }[route.type] || "📍";

    let mainDetails = "";
    let additionalInfo = "";

    if (route.type === "FLIGHT") {
      mainDetails = `${typeEmoji} Direct Flight: ${from} → ${to}`;
      additionalInfo = `
        <div class="route-details-row">
          <div class="detail-item">
            <div class="detail-label">Duration</div>
            <div class="detail-value">${route.total_time.toFixed(1)} hours</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Stops</div>
            <div class="detail-value">Non-stop</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Source</div>
            <div class="detail-value">Live API</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Updated</div>
            <div class="detail-value">Just now</div>
          </div>
        </div>
      `;
    } else if (route.type === "TRAIN") {
      mainDetails = `${typeEmoji} Direct Train: ${from} → ${to}`;
      additionalInfo = `
        <div class="route-details-row">
          <div class="detail-item">
            <div class="detail-label">Duration</div>
            <div class="detail-value">${route.total_time.toFixed(1)} hours</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Class</div>
            <div class="detail-value">Sleeper/AC</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Source</div>
            <div class="detail-value">Live API</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Available</div>
            <div class="detail-value">Multiple times</div>
          </div>
        </div>
      `;
    } else if (route.type === "MIXED") {
      const leg1 = route.legs?.[0];
      const leg2 = route.legs?.[1];
      mainDetails = `${typeEmoji} Multi-leg via ${route.hub}: ${from} → ${route.hub} → ${to}`;

      const leg1Price = leg1?.price || 0;
      const leg2Price = leg2?.price || 0;

      const explanationHTML = route.explanation
        ? `<div class="explanation">💡 ${route.explanation}</div>`
        : "";

      additionalInfo = `
        <div class="route-details-row">
          <div class="detail-item">
            <div class="detail-label">Route Type</div>
            <div class="detail-value">Optimized Connection</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Hub</div>
            <div class="detail-value">${route.hub}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Total Time</div>
            <div class="detail-value">${route.total_time.toFixed(1)} hours</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Source</div>
            <div class="detail-value">Route Optimization</div>
          </div>
        </div>
        ${explanationHTML}
        ${leg1 ? `<div class="leg-info">✈️ <strong>Leg 1:</strong> ${leg1.from} → ${leg1.to} | ₹${leg1Price.toLocaleString("en-IN")}</div>` : ""}
        ${leg2 ? `<div class="leg-info">🚂 <strong>Leg 2:</strong> ${leg2.from} → ${leg2.to} | ₹${leg2Price.toLocaleString("en-IN")}</div>` : ""}
      `;
    }

    const displayPrice = route.total_price ?? route.price ?? 0;

    card.innerHTML = `
      <div class="route-header">
        <div>
          <div class="route-type">${mainDetails}</div>
          ${route.featured ? '<span class="featured-badge">⭐ CHEAPEST</span>' : ""}
        </div>
        <div class="route-price">₹${displayPrice.toLocaleString("en-IN")}</div>
      </div>
      <div class="route-details">
        ${additionalInfo}
      </div>
    `;

    routesList.appendChild(card);
  });

  // Show "more routes" button if there are secondary routes not visible
  const secondaryCount = currentRoutes.filter(
    (r) => r.visibility === "SECONDARY"
  ).length;
  if (secondaryCount > 0 && !currentShowAll) {
    const moreBtn = document.createElement("button");
    moreBtn.className = "show-more-btn";
    moreBtn.innerText = `Show ${secondaryCount} more route(s)`;
    moreBtn.onclick = () => {
      currentShowAll = true;
      renderRoutes(from, to);
    };
    routesList.appendChild(moreBtn);
  } else if (currentShowAll && secondaryCount > 0) {
    const hideBtn = document.createElement("button");
    hideBtn.className = "show-more-btn";
    hideBtn.innerText = "Hide secondary routes";
    hideBtn.onclick = () => {
      currentShowAll = false;
      renderRoutes(from, to);
    };
    routesList.appendChild(hideBtn);
  }

  // Render rejected routes in greyed format
  if (currentRejected && currentRejected.length > 0) {
    const rejectedSection = document.createElement("div");
    rejectedSection.className = "rejected-routes-section";
    rejectedSection.innerHTML = "<h4>🚫 Evaluated but not recommended:</h4>";

    const rejectedList = document.createElement("div");
    rejectedList.className = "rejected-routes-list";

    currentRejected.forEach((item) => {
      const rejectedCard = document.createElement("div");
      rejectedCard.className = "rejected-route-card";
      rejectedCard.innerHTML = `
        <div class="rejected-route-text">
          <strong>${item.city}</strong>
          <span class="rejection-reason">${item.reason}</span>
        </div>
      `;
      rejectedList.appendChild(rejectedCard);
    });

    rejectedSection.appendChild(rejectedList);
    routesList.appendChild(rejectedSection);
  }
}

// ============================================
// MAP VISUALIZATION
// ============================================

function clearMap() {
  Object.values(markers).forEach((marker) => {
    if (map.hasLayer(marker)) map.removeLayer(marker);
  });
  markers = {};

  Object.values(polylines).forEach((polyline) => {
    if (map.hasLayer(polyline)) map.removeLayer(polyline);
  });
  polylines = {};
}

function drawMap(from, to, routes) {
  clearMap();

  const fromCoords = locationCoords[from] || [22.9734, 78.6569];
  const toCoords = locationCoords[to] || [22.9734, 78.6569];

  // Add markers
  const fromMarker = L.marker(fromCoords, {
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

  const toMarker = L.marker(toCoords, {
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

  // Find cheapest (support total_price or price)
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
        `✈️ <strong>Flight</strong><br>₹${cheapest.price.toLocaleString("en-IN")}`
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
        `🚂 <strong>Train</strong><br>₹${cheapest.price.toLocaleString("en-IN")}`
      );
  } else if (cheapest.type === "MIXED" && cheapest.hub) {
    const hubCoords = locationCoords[cheapest.hub] || fromCoords;

    // Flight leg
    L.polyline([fromCoords, hubCoords], {
      color: "#e74c3c",
      weight: 3,
      opacity: 0.8,
    })
      .addTo(map)
      .bindPopup(`✈️ Flight to ${cheapest.hub}`);

    // Train leg
    L.polyline([hubCoords, toCoords], {
      color: "#3498db",
      weight: 3,
      opacity: 0.8,
      dashArray: "5, 5",
    })
      .addTo(map)
      .bindPopup(`🚂 Train from ${cheapest.hub}`);

    // Hub marker
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
}

// ============================================
// KEYBOARD NAVIGATION & INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("from")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") search();
  });
  document.getElementById("to")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") search();
  });

  // Initialize map
  initializeMap();
});
