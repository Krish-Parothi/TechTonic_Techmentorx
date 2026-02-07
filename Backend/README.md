# TechTonic Travel API - Backend

**Complete Travel Management System with AI Chatbot and Route Recommendations**

## 🎯 What's New in v2.0

✨ **Added LangChain Integration** - AI-powered chatbot using OpenAI GPT-3.5  
✨ **Amadeus API Integration** - Real flight data and recommendations  
✨ **Enhanced Authentication** - JWT-based secure endpoints  
✨ **Smart Route Recommendations** - Multiple transport modes with intelligent suggestions  
✨ **MongoDB Chat History** - Persistent conversation storage  
✨ **Dual Chatbot System** - Rule-based + AI-powered options  

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Main Server                       │
│                      (main.py)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬────────────────┐
        │              │              │                │
   ┌────▼────┐  ┌─────▼──────┐  ┌───▼─────┐  ┌──────▼──────┐
   │  Auth   │  │   Routes   │  │ Chatbot │  │   System   │
   │ Module  │  │ Recommend  │  │ Module  │  │  Status    │
   └────┬────┘  └─────┬──────┘  └───┬─────┘  └──────┬──────┘
        │              │             │               │
        │              │        ┌────▼────────┐     │
        │              │        │   DB (MongoDB)    │
        │              │        └───────────────┘   │
   ┌────▼──────┐      │                              │
   │  JWT Auth │      │                              │
   │ (jose)    │      │                              │
   └───────────┘  ┌───▼────────┐           ┌────────▼────┐
                  │ LangChain  │           │ Amadeus API │
                  │ + OpenAI   │           └─────────────┘
                  └────────────┘
```

---

## 📦 Installation

### 1. Install Dependencies
```bash
pip install -r requirements.txt
# Or manually:
pip install fastapi uvicorn python-jose passlib langchain-openai pymongo
```

### 2. Configure .env
```env
SECRET_KEY=your_secret_key
ALGORITHM=HS256
OPENAI_API_KEY=sk-your-key
AMADEUS_KEY=your-amadeus-key
MONGODB_URL=mongodb://localhost:27017
```

### 3. Start Services
```bash
# Start MongoDB
mongod

# Start API
uvicorn main:app --reload
```

---

## 🚀 Quick API Examples

### Get AI Travel Recommendation
```bash
POST /api/chat/ai/recommendation?source=Delhi&destination=Nagpur

Response:
{
  "source": "Delhi",
  "destination": "Nagpur",
  "ai_recommendation": "Based on your journey from Delhi to Nagpur (1365 km), 
                        I recommend taking a flight for speed or a train for 
                        comfort and value..."
}
```

### Ask Multi-turn Question
```bash
POST /api/chat/ai/chat
{
  "user_id": "user_123",
  "session_id": "xxx",
  "message": "I want to travel from Delhi to Nagpur. What's the best option?"
}
```

### Get Route Options
```bash
POST /api/routes/recommend
{
  "source": "Delhi",
  "destination": "Nagpur"
}

Response:
{
  "travel_modes": [
    {"mode": "bus", "duration": "20 hours", "price": 800},
    {"mode": "train", "duration": "18 hours", "price": 1500},
    {"mode": "plane", "duration": "2 hours", "price": 3500}
  ],
  "best_for": {
    "fastest": "plane (2 hours)",
    "cheapest": "bus (₹800)",
    "comfort": "plane (Standard)"
  }
}
```

---

## 📋 File Structure

```
Backend/
├── main.py                      # FastAPI entry point (ALL ROUTES INTEGRATED)
├── .env                         # Config + API Keys
│
├── authentication/              # User auth
│   ├── jwt_utils.py            # Token generation
│   ├── jwt_protected.py        # Token verification
│   ├── password_utils.py       # Hashing
│   ├── login_api.py            # Login endpoint
│   ├── signup_api.py           # Signup endpoint
│   └── mongo_connection.py     # DB connection
│
├── routes/                      # Travel routes
│   └── route_recommendations.py # Route API
│
├── Chatbot/                     # Chatbot modules
│   ├── bot.py                  # Rule-based bot
│   ├── langchain_bot.py        # LLM-powered bot ⭐NEW
│   ├── chat_schema.py          # Data models
│   ├── chat_routes.py          # Chat endpoints
│   └── db.py                   # MongoDB ops
│
├── schemas/                     # Pydantic models
│   ├── route.py
│   ├── history.py
│   └── ...
│
├── test_all.py                 # Comprehensive tests
├── SETUP_GUIDE.md              # Detailed setup
└── README.md                   # This file
```

---

## 🔗 All Routes Connected to main.py

Every route is registered in `main.py` with `/api` prefix:

```python
# Authentication
/api/auth/signup         (POST)
/api/auth/login          (POST)

# Travel Routes
/api/routes/recommend           (POST)
/api/routes/available-routes    (GET)

# Basic Chatbot
/api/chat/session/create        (POST)
/api/chat/message              (POST)
/api/chat/session/{id}/history (GET)

# AI Chatbot (NEW)
/api/chat/ai/recommendation     (POST)  ⭐
/api/chat/ai/chat              (POST)  ⭐
/api/chat/health               (GET)

# System
/                              (GET)  - Root welcome
/health                        (GET)  - Health check
```

---

## ⭐ Key Features

### 1. **Dual Chatbot System**
- **Rule-based**: Fast, pattern-matching, works offline
- **LangChain-powered**: Uses OpenAI GPT-3.5, real Amadeus data

### 2. **Intelligent Route Recommendations**
- Three transport modes (plane, train, bus)
- Automatic "best for" suggestions
- Price ranges & comfort levels
- Daily availability info

### 3. **Secure Authentication**
- JWT tokens with jose library
- Bcrypt password hashing
- Session-based access control
- MongoDB user storage

### 4. **Complete Chat History**
- MongoDB persistence
- Multi-turn conversations
- User session tracking
- Searchable message history

### 5. **API Integration**
- Amadeus for real flight data
- OpenAI for LLM responses
- Third-party API error handling
- Fallback to mock data

---

## 🧪 Testing

```bash
# Run all tests
python test_all.py

# Test specific components
python test_routes.py      # Route recommendations
python test_chatbot.py     # Basic chatbot
```

---

## 🔄 Integration Summary

| Component | Status | Location | Role |
|-----------|--------|----------|------|
| **Authentication** | ✅ Complete | `authentication/` | Signup/Login |
| **Route Recommendations** | ✅ Complete | `routes/` | Get recommendations |
| **Basic Chatbot** | ✅ Complete | `Chatbot/` | Rule-based responses |
| **LangChain Bot** | ✅ Complete | `Chatbot/langchain_bot.py` | AI responses |
| **Amadeus API** | ✅ Integrated | `Chatbot/langchain_bot.py` | Real flight data |
| **MongoDB** | ✅ Connected | `Chatbot/db.py` | Chat history |
| **FastAPI** | ✅ Unified | `main.py` | All routes registered |

---

## 📚 Documentation

Interactive docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Jump to [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

---

## 🎓 Technology Stack

```
Backend Framework: FastAPI
Database: MongoDB
Auth: JWT (jose)
Hashing: bcrypt/passlib
LLM: LangChain + OpenAI
APIs: Amadeus Travel API
Package Manager: pip/uv
Python Version: 3.12+
```

---

## 🚦 Quick Start

1. **Install**: `pip install -r requirements.txt`
2. **Configure**: Update `.env` with API keys
3. **Database**: Start MongoDB (`mongod`)
4. **Run**: `uvicorn main:app --reload`
5. **Test**: Visit http://localhost:8000/docs

---

## 📞 Support

- Documentation: http://localhost:8000
- Tests: `python test_all.py`
- Logs: Check terminal output during execution

---

**Version 2.0 - Built with ❤️ for TechTonic Techmentorx**
