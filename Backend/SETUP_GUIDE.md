# TechTonic Travel API - Complete Setup Guide

## 🎯 Overview

TechTonic Travel API is a full-stack travel management system featuring:
- ✅ **JWT Authentication** (signup & login)
- ✅ **Route Recommendations** (plane, train, bus)
- ✅ **Rule-based Chatbot** (MongoDB integration)
- ✅ **LangChain AI Chatbot** (Amadeus API integration)

---

## 📋 Prerequisites

### Required Software
- Python 3.12+
- MongoDB (running on localhost:27017)
- pip or uv package manager

### API Keys Needed
1. **OpenAI API Key** (for LangChain features)
   - Get from: https://platform.openai.com/api-keys
   - Set in `.env` as `OPENAI_API_KEY=sk-...`

2. **Amadeus API Key** (for real flight data)
   - Get from: https://developers.amadeus.com
   - Already set in `.env` (provided)

---

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
# Using pip
pip install python-jose passlib langchain-openai requests

# Or install from requirements
pip install -r requirements.txt
```

### Step 2: Configure Environment Variables

Edit `.env` file:

```env
# Authentication
SECRET_KEY=your_super_long_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# APIs
AMADEUS_KEY="8g0RaCNpXirAYFUGGbPikoqUzLCDF0cD"
SECRET="vTAlujD13hAG7Szv"
OPENAI_API_KEY=sk-your-openai-key-here

# Database
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=airport_llm
```

### Step 3: Start MongoDB

```bash
# Windows
net start MongoDB

# Linux/Mac
mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 4: Run the API Server

```bash
# Start with auto-reload
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at: **http://localhost:8000**

---

## 📚 API Endpoints

### 1️⃣ Authentication Routes

#### Signup
```bash
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secure_password"
}

Response:
{
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 2️⃣ Travel Route Recommendations

#### Get Routes
```bash
POST /api/routes/recommend
{
  "source": "Delhi",
  "destination": "Nagpur"
}

Response:
{
  "source": "Delhi",
  "destination": "Nagpur",
  "distance_km": 1365,
  "travel_modes": [
    {
      "mode": "bus",
      "duration": "20 hours",
      "price": 800,
      "comfort_level": "Budget"
    },
    {
      "mode": "train",
      "duration": "18 hours",
      "price": 1500,
      "comfort_level": "Standard"
    },
    {
      "mode": "plane",
      "duration": "2 hours",
      "price": 3500,
      "comfort_level": "Standard"
    }
  ],
  "best_for": {
    "fastest": "plane (2 hours)",
    "cheapest": "bus (₹800)",
    "comfort": "plane"
  }
}
```

#### Available Routes
```bash
GET /api/routes/available-routes

Response:
{
  "total_routes": 3,
  "routes": [
    {"source": "Delhi", "destination": "Nagpur", "distance_km": 1365},
    {"source": "Mumbai", "destination": "Bangalore", "distance_km": 981},
    {"source": "Bangalore", "destination": "Hyderabad", "distance_km": 586}
  ]
}
```

---

### 3️⃣ Basic Chatbot (Rule-based)

#### Create Session
```bash
POST /api/chat/session/create
{
  "user_id": "user_123"
}

Response:
{
  "user_id": "user_123",
  "session_id": "29e5b3c4-d73b-48ba-b1dd-ed20691c121d",
  "message": "Session created successfully"
}
```

#### Send Message
```bash
POST /api/chat/message
{
  "user_id": "user_123",
  "session_id": "29e5b3c4-d73b-48ba-b1dd-ed20691c121d",
  "message": "How do I travel from Delhi to Nagpur?"
}

Response:
{
  "session_id": "...",
  "user_message": "How do I travel from Delhi to Nagpur?",
  "bot_response": "🛫 **Delhi to Nagpur (1365 km)**\n\nHere are your transport options:\n...",
  "timestamp": "2026-02-07T10:00:05"
}
```

#### Get Chat History
```bash
GET /api/chat/session/{session_id}/history

Response:
{
  "session_id": "...",
  "message_count": 2,
  "messages": [
    {"role": "user", "content": "...", "timestamp": "..."},
    {"role": "assistant", "content": "...", "timestamp": "..."}
  ]
}
```

---

### 4️⃣ AI-Powered Chatbot (LangChain + Amadeus)

#### Direct Recommendation (with source/destination)
```bash
POST /api/chat/ai/recommendation?source=Delhi&destination=Nagpur&query=What%20is%20the%20fastest%20option
```

#### Multi-turn AI Chat
```bash
POST /api/chat/ai/chat
{
  "user_id": "user_123",
  "session_id": "29e5b3c4-d73b-48ba-b1dd-ed20691c121d",
  "message": "I want to travel from Delhi to Nagpur. What's the best option for comfort?"
}

Response:
{
  "session_id": "...",
  "user_message": "...",
  "bot_response": "Based on your preference for comfort, I recommend flying from Delhi to Nagpur...",
  "context": {
    "source": "Delhi",
    "destination": "Nagpur",
    "powered_by": "LangChain"
  }
}
```

---

### 5️⃣ System Status

#### Health Check
```bash
GET /api/chat/health

Response:
{
  "status": "healthy",
  "version": "2.0.0",
  "features": [
    "Rule-based route recommendations",
    "LangChain AI-powered responses",
    "Amadeus API integration",
    "..."
  ]
}
```

#### Welcome/Info
```bash
GET /

Shows all available endpoints and quick start guide
```

---

## 🧪 Testing

### Run All Tests
```bash
python test_all.py
```

### Test Specific Features
```bash
# Test route recommendations
python test_routes.py

# Test basic chatbot
python test_chatbot.py
```

---

## 📁 Project Structure

```
Backend/
├── main.py                              # FastAPI app entry point
├── .env                                 # Environment variables
├── pyproject.toml                       # Dependencies
├──
├── authentication/
│   ├── jwt_utils.py                     # JWT token creation
│   ├── jwt_protected.py                 # JWT verification dependency
│   ├── password_utils.py                # Password hashing/verification
│   ├── auth_schema.py                   # Pydantic models
│   ├── login_api.py                     # Login endpoint
│   ├── signup_api.py                    # Signup endpoint
│   └── mongo_connection.py              # MongoDB connection
│
├── routes/
│   ├── route_recommendations.py         # Route recommendation API
│   └── __init__.py
│
├── Chatbot/
│   ├── bot.py                           # Rule-based chatbot
│   ├── langchain_bot.py                 # LangChain + Amadeus integration
│   ├── chat_schema.py                   # Chat data models
│   ├── chat_routes.py                   # Chat API endpoints
│   ├── db.py                            # MongoDB operations
│   └── __init__.py
│
├── schemas/
│   ├── route.py                         # Route recommendation models
│   └── ...
│
└── tests/
    ├── test_all.py                      # Comprehensive test suite
    ├── test_routes.py                   # Route recommendation tests
    └── test_chatbot.py                  # Chatbot tests
```

---

## 🔧 Key Features Breakdown

### Authentication Flow
1. User signs up with name, email, password
2. Password hashed using bcrypt
3. Login generates JWT token
4. Token used for protected endpoints
5. JWT verified using jose library

### Route Recommendations
1. View all supported routes (Delhi↔Nagpur, etc.)
2. Get detailed recommendations with 3 transport modes
3. System recommends best options (fastest, cheapest, comfort)
4. Sorted by price by default

### Chatbots (Dual System)

**Basic Chatbot** (Rule-based):
- Pattern matching on user input
- Fast responses without LLM
- Works offline
- Perfect for simple queries

**AI Chatbot** (LangChain-powered):
- Uses OpenAI GPT-3.5
- Integrates with Amadeus API for real flight data
- Context-aware responses
- Handles complex travel queries
- Multi-turn conversations

### MongoDB Integration
- User chat sessions
- Complete message history
- Bot response storage with context
- Indexed for performance

---

## 🎨 Supported Cities

- Delhi (DEL)
- Mumbai (BOM)
- Bangalore (BLR)
- Hyderabad (HYD)
- Nagpur (NAG)
- Pune (PNQ)
- Kolkata (CCU)
- Chennai (MAA)

---

## 🔑 Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `SECRET_KEY` | ✅ | JWT signing secret |
| `ALGORITHM` | ✅ | JWT algorithm (HS256) |
| `OPENAI_API_KEY` | ❌ | LangChain features |
| `AMADEUS_KEY` | ❌ | Real flight data |
| `AMADEUS_SECRET` | ❌ | Amadeus authentication |
| `MONGODB_URL` | ✅ | MongoDB connection |
| `MONGODB_DB` | ✅ | Database name |

---

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Solution: Make sure MongoDB is running
- Windows: net start MongoDB
- Linux: sudo systemctl start mongod
```

### OpenAI API Error
```
Solution: Set OPENAI_API_KEY in .env
Get key from: https://platform.openai.com/api-keys
```

### Import Errors
```
Solution: Install missing packages
pip install python-jose passlib langchain-openai
```

---

## 📖 Interactive Documentation

Once server is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## 🎯 Quick Start Example

### 1. Signup
```bash
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "mypassword123"
  }'
```

### 2. Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "mypassword123"
  }'

# Save the accessToken from response
```

### 3. Create Chat Session
```bash
curl -X POST "http://localhost:8000/api/chat/session/create" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "john@example.com"}'

# Save the session_id from response
```

### 4. Chat with AI
```bash
curl -X POST "http://localhost:8000/api/chat/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "john@example.com",
    "session_id": "YOUR_SESSION_ID",
    "message": "I want to travel from Delhi to Nagpur. What are my options?"
  }'
```

---

## 📝 License

This project is part of TechTonic Techmentorx.

---

## 🤝 Support

For issues or questions, please refer to the API documentation at `/docs` endpoint.
