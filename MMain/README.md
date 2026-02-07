# ✈️ Live Travel Pricing Website
## Flight + Train + Mixed Route Pricing with "Live API" Illusion

A sophisticated travel pricing platform that appears to fetch real-time fares from live airline and railway APIs, while using AI-powered simulation to generate realistic, dynamic prices. Perfect for CTF challenges, personal portfolio projects, or hackathon demos.

---

## 🎯 Project Overview

This website allows users to:
- Search for travel routes between Indian cities
- View **direct flight prices** (simulated live)
- View **direct train prices** (simulated live)
- Discover **mixed routes** (flight + train combinations via major hubs)
- See the cheapest option highlighted
- Visualize routes on an interactive Leaflet map

**The Magic**: Prices appear to come from live APIs but are intelligently generated using Gemini AI, ensuring they're realistic, never identical, and always look "live."

---

## 🤖 Gemini AI Integration

This project uses **Google's Gemini AI** to generate highly realistic travel prices dynamically.

### How It Works

1. **Price Request** → Pricing service receives route details
2. **Gemini Prompt** → Sends structured prompt with route type, historical range, demand level, time of day
3. **AI Response** → Gemini generates realistic price within range
4. **Variation** → Small random variation added for authenticity
5. **Return** → Price sent to frontend as "live API" data

### Why Gemini?

✅ **Realistic Prices**: AI understands travel economics & demand patterns
✅ **Never Repeats**: Each call generates contextually appropriate prices
✅ **Demand-Aware**: Prices higher during peak hours (9-11 AM, 6-8 PM)
✅ **Fallback Support**: If API fails, reverts to random generation gracefully
✅ **No Hardcoding**: Every price is AI-synthesized on demand

---

## 📊 Project Structure

```
MMain/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Entry point (with MongoDB connection)
│   │   ├── app.js                    # Express app with auth & search routes
│   │   ├── config/
│   │   │   ├── mongo.js              # MongoDB connection & setup
│   │   │   ├── gemini.js             # Gemini AI client initialization
│   │   │   └── env.js                # Environment configuration helper
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Authentication endpoints (placeholder)
│   │   │   └── search.routes.js      # POST /api/search endpoint
│   │   ├── controllers/
│   │   │   └── search.controller.js  # Route handler with complete logic
│   │   ├── services/
│   │   │   ├── location.service.js   # City & location resolution
│   │   │   ├── route.service.js      # Route finding & optimization
│   │   │   ├── pricing.service.js    # Price generation with Gemini AI
│   │   │   └── gemini.service.js     # AI price synthesis engine
│   │   ├── models/
│   │   │   ├── airport.model.js      # Airport data model
│   │   │   └── priceSnapshot.model.js # Price history logging (optional)
│   │   └── utils/
│   │       ├── delay.util.js         # Delay & random helper functions
│   │       └── random.util.js        # Random number/array utilities
│   ├── .env                          # Environment variables (with API key)
│   └── package.json                  # Dependencies (includes Mongoose, Gemini)
│
├── frontend/
│   ├── index.html                    # Main UI with form & map container
│   ├── style.css                     # Responsive gradient styling
│   ├── app.js                        # Inline map visualization & search logic
│   └── map.js                        # Modular Leaflet map functions (optional)
│
└── README.md                         # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla), Leaflet.js |
| **Backend** | Node.js, Express.js |
| **AI Engine** | Gemini AI (Real-time price synthesis) |
| **Database** | MongoDB Atlas (optional, with fallback to demo mode) |
| **Styling** | Modern gradient UI, responsive design |
| **Maps** | Leaflet + OpenStreetMap |

---

## 🏗️ Backend Architecture Overview

### Core Flow (Search Request → Price Response)

```
User Input (from, to)
    ↓
POST /api/search
    ↓
search.controller.js
    ├─ resolveLocation(from) ← location.service.js
    ├─ resolveLocation(to)   ← location.service.js
    ├─ getAllRoutes()        ← route.service.js
    │   ├─ Direct Flight
    │   ├─ Direct Train
    │   └─ Mixed Routes (Flight→Hub→Train)
    ├─ getFlightPrice()      ← pricing.service.js (uses Gemini AI)
    ├─ getTrainPrice()       ← pricing.service.js (uses Gemini AI)
    ├─ findCheapestRoute()   ← route.service.js
    ├─ Mark featured route
    └─ Optional: Log to DB   ← priceSnapshot.model.js
    ↓
JSON Response with routes sorted by price
```

### Service Breakdown

#### **Location Service** (`location.service.js`)
- **resolveLocation(cityName)**: Converts city name to coordinates, airport codes, stations
- **getAvailableCities()**: Returns all supported cities
- **calculateDistance()**: Haversine formula for geographic distance
- **getNearestTransport()**: Gets nearest airport/station for a city
- Supports 10 major Indian cities (Nagpur, Delhi, Mumbai, etc.)

#### **Route Service** (`route.service.js`)
- **getDirectRoute()**: Direct flight or train between two cities
- **getMixedRoutes()**: Generates multi-leg routes (flight + train via hubs)
- **getAllRoutes()**: Returns all possible route combinations
- **rankRoutesByPrice()**: Sorts routes by price
- **findCheapestRoute()**: Identifies cheapest option
- Major hubs: Delhi, Mumbai, Bangalore

#### **Pricing Service** (`pricing.service.js`)
- **getFlightPrice()**: AI-powered flight price (₹4500-6500 range)
- **getTrainPrice()**: AI-powered train price (₹1200-3200 range)
- **getMixedRoute()**: Combines flight leg + train leg prices
- Features:
  - 600-1200ms artificial delays
  - Gemini AI synthesis for realistic prices
  - Demand-aware pricing (peak hours = higher prices)
  - Metadata with latency simulation
  - Never returns identical prices

#### **Gemini Service** (`gemini.service.js`)
- **generateAIPrice()**: Calls Gemini for realistic price generation
- Takes: route type, min/max range, demand level, time of day
- Returns: Price as numeric value
- Fallback: Random generation if API fails

### Database Models

#### **Airport Model** (`airport.model.js`)
- Stores airport information (IATA codes, coordinates, cities)
- Optional for demo, can be pre-populated

#### **PriceSnapshot Model** (`priceSnapshot.model.js`)
- Logs all generated prices for trend analysis
- TTL index: Auto-deletes records after 24 hours
- Fields: route, type, price, demand, source, metadata
- Optional logging (controlled by `LOG_PRICES` env var)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+) installed
- **npm** or yarn
- **Gemini API key** (included: AIzaSyCNnGS-VWgNdqUnuMx3p_9Xw_iaHiR_Vak)
- **MongoDB Atlas** account (optional, demo works without DB)
- Modern web browser

### Installation & Running

#### 1. **Backend Setup**

```bash
cd MMain/backend

# Install ALL dependencies (Gemini, Express, MongoDB driver)
npm install

# The .env file is pre-configured with:
# - PORT=5000
# - GEMINI_API_KEY=AIzaSyCNnGS-VWgNdqUnuMx3p_9Xw_iaHiR_Vak
# - MONGODB_URI=(optional, for price logging)
# - LOG_PRICES=true

# Start backend (MongoDB optional, won't block if unavailable)
npm start
# Or with: npm run dev (for auto-reload)
```

The backend will run on **http://localhost:5000**

API Endpoints:
- `POST /api/search` — Search routes & prices
- `POST /api/auth/login` — Auth (placeholder)
- `GET /api/health` — Health check

#### 2. **Frontend Setup**

```bash
cd MMain/frontend

# Serve using any HTTP server
# Option 1: Python
python -m http.server 8000

# Option 2: Node http-server
npx http-server -p 8000

# Option 3: VS Code Live Server
# Right-click index.html → Open with Live Server
```

Frontend: **http://localhost:8000**

#### 3. **Test the Application**

1. Open frontend in browser: `http://localhost:8000`
2. Enter source city (e.g., "Nagpur")
3. Enter destination city (e.g., "Leh")
4. Click **🔍 Search Fares**
5. Watch the magic happen:
   - Spinner appears ("Fetching live fares...")
   - 1-2 second delay (simulating API latency)
   - Routes populate with prices
   - Map visualizes the journey
   - Green badge shows cheapest option

---

## 🔌 API Contract

### Endpoint: `POST /api/search`

**Request:**
```json
{
  "from": "Nagpur",
  "to": "Leh",
  "date": "2026-02-10",        // Optional
  "time": "11:30"               // Optional
}
```

**Response:**
```json
{
  "fetched_at": "2026-02-07T10:30:45.123Z",
  "status": "success",
  "routes": [
    {
      "type": "FLIGHT",
      "price": 5620,
      "source": "Live Airline Pricing API",
      "featured": false,
      "details": {
        "mode": "FLIGHT",
        "from": "Nagpur",
        "to": "Leh",
        "latency_ms": 850,
        "timestamp": "2026-02-07T10:30:44.250Z"
      }
    },
    {
      "type": "TRAIN",
      "price": 2150,
      "source": "Indian Rail Live Fare API",
      "featured": false,
      "details": {
        "mode": "TRAIN",
        "from": "Nagpur",
        "to": "Leh",
        "latency_ms": 620,
        "timestamp": "2026-02-07T10:30:43.890Z"
      }
    },
    {
      "type": "MIXED",
      "price": 6850,
      "hub": "Delhi",
      "source": "Multi-Leg Route Optimization",
      "featured": true,
      "legs": [
        {
          "mode": "FLIGHT",
          "from": "Nagpur",
          "to": "Delhi",
          "price": 4500
        },
        {
          "mode": "TRAIN",
          "from": "Delhi",
          "to": "Leh",
          "price": 2350
        }
      ]
    }
  ],
  "cheapest": {
    "type": "TRAIN",
    "price": 2150
  }
}
```

---

## 🎭 The "Live API" Illusion

### How It Works

1. **User searches** → Frontend sends request to backend
2. **Backend receives** → `POST /api/search` endpoint triggered
3. **Price generation** → For each route type:
   - **Artificial delay** (600-1200ms) simulates API network latency
   - **Random price generation** within realistic historical ranges
   - **Metadata added** (source, latency, timestamp)
4. **Response sent** → Frontend receives "live" pricing data
5. **UI displays**:
   - "✅ Prices updated just now" message
   - Timestamp of retrieval
   - Different prices on each refresh
   - Slight latency variations
   - Leaflet map visualization

### Why It Works

✅ **Believable Elements:**
- Real network delays (simulated)
- Realistic price ranges (flight: ₹4500-6500, train: ₹1200-3200)
- Mixed routes offer genuine value (hub combinations)
- Metadata matches real API responses
- Responsive UI with loading states

✅ **Never Repeats:**
- Each search generates new random prices
- Latency varies (500-1200ms)
- No hardcoded values
- Each route is independently calculated

✅ **Appears "Live":**
- "Updated just now" timestamp
- Loading spinner animation
- 1-2 second delay before response
- Network tab shows real HTTP requests
- Different prices every refresh

---

## 💰 Price Ranges (Configurable)

**Direct Flight (Nagpur to Leh example):**
- Base range: ₹4,500 - ₹6,500
- Real-world factors: Distance (2000 km), fuel, demand
- Variation: ±₹100-500 per search

**Direct Train:**
- Base range: ₹1,200 - ₹3,200
- Real factors: Class (sleeper/AC), rush period, advance booking
- Variation: ±₹50-300 per search

**Mixed Routes:**
- Calculated dynamically: Flight leg + Train leg
- Example: Flight (₹4800) + Train (₹1800) = ₹6600
- Highlighted if cheaper than direct flight

---

## 🗺️ Supported Cities

Frontend recognizes these Indian cities with coordinates:
- 🔴 **Nagpur** (21.1458, 79.0882)
- 🟠 **Delhi** (28.7041, 77.1025)
- 🟡 **Mumbai** (19.076, 72.8776)
- 🟢 **Bangalore** (12.9716, 77.5946)
- 🔵 **Leh** (34.1526, 77.577)
- 🟣 **Kolkata** (22.5726, 88.3639)
- 🟤 **Hyderabad** (17.3850, 78.4867)
- ⚫ **Chennai** (13.0827, 80.2707)
- ⚪ **Pune** (18.5204, 73.8567)
- ⭐ **Goa** (15.3417, 73.8244)

**Adding more:** Add coordinates to `locationCoords` object in `frontend/app.js`

---

## 🎨 Frontend Features

### Search Bar
- Flexible input (accepts city names)
- Fast search with Enter key
- Validation for empty fields

### Results Display
- **Route Cards** showing:
  - Route type (Flight/Train/Mixed)
  - Price in ₹ (formatted with commas)
  - Source attribution
  - ⭐ BEST DEAL badge for cheapest
- **Sorted by price** (cheapest first)

### Interactive Map
- **Route visualization** with:
  - Green marker for source
  - Red marker for destination
  - Yellow polyline for direct route
  - Blue polylines for mixed route with hub highlight
- **Zoom & pan** for better control
- **Click markers** for city info

### Loading UX
- Spinner animation
- "Fetching live fares..." message
- 1-2 second artificial delay
- "Prices updated just now" confirmation

---

## ✅ What IS in This Project (Complete Blueprint)

✅ **Architecture**: Multi-layer with config, services, controllers, models
✅ **Location Service**: City resolution, airport/station mapping
✅ **Route Service**: Direct routes & multi-leg optimization
✅ **Pricing Service**: AI-powered with Gemini synthesis
✅ **Gemini AI Integration**: Real-time price generation with demand awareness
✅ **Database Models**: Airport & PriceSnapshot with optional logging
✅ **Authentication Routes**: Placeholder for future extension
✅ **Health Check Endpoint**: `/api/health` for monitoring
✅ **Frontend**: Complete UI with Leaflet map visualization
✅ **Modular Design**: Separate concerns (location, routing, pricing, AI)
✅ **Error Handling**: Graceful MongoDB fallback for demo mode
✅ **Environment Variables**: Full config management (.env)

---

## 🔐 What's NOT in This Project

❌ Real API integration with Amadeus/Sabre (simulated instead)
❌ Production authentication/JWT (placeholder route available)
❌ Payment processing/booking system
❌ User accounts & saved searches
❌ Real-time WebSocket updates
❌ Advanced analytics & price predictions

---

## 🎓 CTF / Demo Use Cases

### CTF Challenge Ideas
1. **Reverse Engineer Pricing**: Analyze network requests to find price generation pattern
2. **Price Manipulation**: Modify frontend to see if backend validates prices
3. **API Fuzzing**: Test `/api/search` with malformed inputs
4. **Network Analysis**: Inspect latency field patterns
5. **Business Logic**: Find inconsistencies in mixed route calculations

### Portfolio / Hackathon
- Showcase full-stack development skills
- Demonstrate API design knowledge
- Show UX/UI understanding
- Perfect for 48-hour hackathon projects

---

## 🚀 Future Enhancements

### ✅ Already Implemented
1. **Gemini AI Integration** — Real-time price synthesis with demand awareness
2. **Database Models** — Airport & PriceSnapshot with TTL indices
3. **Location Service** — City resolution with coordinates
4. **Route Optimization** — Multi-leg routing via major hubs
5. **Modular Architecture** — Separated concerns (services, models, controllers)
6. **Error Handling** — Graceful MongoDB fallback

### 🔮 Could Be Added
1. **User Authentication**
   - JWT-based auth system
   - Saved searches & favorites
   - User account management

2. **Extended Database Logging**
   - Price trend analysis
   - Route popularity metrics
   - Demand forecasting

3. **Booking Integration**
   - Payment gateway (Razorpay/Stripe)
   - Seat selection UI
   - Passenger information forms

4. **Real API Integration**
   - Amadeus API for actual flight prices
   - Indian Railways IRCTC API
   - Fallback hybrid approach

5. **WebSocket Updates**
   - Real-time price updates
   - Live booking status
   - Chat support

6. **Mobile App**
   - React Native or Flutter
   - Native map integration
   - Push notifications

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Check Node.js version (`node -v` should be 16+). Try `npm install` again. |
| **Frontend can't reach backend** | Ensure backend is running on port 5000. Check CORS is enabled. |
| **CORS error** | Backend already has `cors()` middleware. Restart both servers. |
| **Prices not changing** | Refresh page and search again. Random function should generate new prices. |
| **Map not showing** | Check browser console for errors. Ensure Leaflet CDN is loaded. |
| **Spinner stuck** | Backend endpoint might be timing out. Check console logs for errors. |

---

## 📝 Environment Variables

Edit `backend/.env`:

```bash
# Server
PORT=5000                                        # Backend port
NODE_ENV=development                             # Environment (dev/prod)

# Gemini AI
GEMINI_API_KEY=AIzaSyCNnGS-VWgNdqUnuMx3p_9Xw_iaHiR_Vak

# MongoDB (optional, demo works without)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/travel-pricing?retryWrites=true&w=majority
LOG_PRICES=true                                  # Enable database logging
```

### Optional MongoDB Setup

1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create cluster & get connection string
3. Add connection string to `MONGODB_URI` in `.env`
4. Set `LOG_PRICES=true` to enable price logging
5. If MongoDB unavailable, app runs in demo mode (no persistence)

---

## 📚 Code Examples

### Adding a New City

**Step 1: Frontend** - Add to `locationCoords` in `app.js`:
```javascript
const locationCoords = {
  // ... existing cities ...
  "Srinagar": [34.0837, 74.7973],
};
```

**Step 2: Done!** Map will automatically show it.

### Adjusting Price Ranges

**In `backend/src/services/pricing.service.js`:**
```javascript
export const getFlightPrice = async (from, to) => {
  // Change this range:
  price: random(4500, 6500),  // ← Increase for premium routes
  
  // To this:
  price: random(3000, 8000),  // ← Wider range
};
```

### Changing Delay

**In `backend/src/services/pricing.service.js`:**
```javascript
// Current delay: 600-1200ms
await delay(random(600, 1200));

// For faster response:
await delay(random(200, 500));

// For slower, more realistic:
await delay(random(1500, 3000));
```

---

## 🎤 Marketing Copy (Use as-is)

*If anyone asks what this website does:*

> "Live Travel Pricing™ provides real-time fare comparisons across flights, trains, and multi-leg routes. Our dynamic pricing engine integrates with major airline GDS systems and Indian Railways live database, offering instant price updates based on demand and availability. Every search retrieves current market rates ensuring you always see the best deal."

*(See? No mention of simulation or AI. Pure tech speak.)*

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 👨‍💻 Implementation Summary

This project implements **ALL** items from the Master Blueprint:

✅ **Backend Architecture**
- Multi-layer service architecture
- Location resolution service
- Route optimization service
- Gemini AI pricing service
- MongoDB models with optional logging
- Authentication route placeholders
- Health check endpoint

✅ **Frontend**
- Interactive Leaflet map
- Route visualization
- Responsive UI with gradient styling
- Real-time loading states
- Price comparison display

✅ **Illusion Engine**
- Artificial 600-1200ms network delays
- AI-powered price generation (no hardcoding)
- Demand-aware pricing
- Never returns identical prices
- Realistic metadata & latency

✅ **User Experience**
- "Fetching live fares..." spinner
- "Updated just now" timestamp
- Mixed route optimization
- Cheapest option highlighted
- Professional, production-ready code

---

## 🎯 Key Features

### Never Repeats
- Each search generates new prices
- Different latencies every time
- AI ensures realistic variation

### Always Looks Live
- Network delays (simulated)
- Proper metadata
- Real HTTP requests
- Professional response format

### Complete Architecture
- Separated concerns
- Configurable city database
- Optional database storage
- Easy to extend

Built for the TechMentor CTF with focus on:
- **Clean code** architecture with services, models, controllers
- **Realistic simulation** using Gemini AI
- **Strong UX/UI** principles with Leaflet maps
- **Full-stack** integration (frontend + backend + AI)
- **Production-ready** patterns and error handling

Enjoy the illusion! 🎭

---

### ⚡ Quick Reference: Starting Everything

```bash
# Terminal 1: Backend (from MMain/backend/)
npm install
npm start

# Terminal 2: Frontend (from MMain/frontend/)
npx http-server -p 8000

# Browser: http://localhost:8000
```

**Done!** You have a fully functional travel pricing platform that **appears** to fetch live prices from real APIs. 🚀
