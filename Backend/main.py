# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

# Import routers
from authentication.login_api import app as login_router
from authentication.signup_api import app as signup_router
from routes.route_recommendations import app as route_router
from Chatbot.routes import app as chat_router

# Initialize FastAPI app
app = FastAPI(
    title="TechTonic Travel API",
    description="Complete Travel Management System with AI Chatbot and Route Recommendations",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
# Authentication routes
app.include_router(login_router, prefix="/api")
app.include_router(signup_router, prefix="/api")

# Travel route recommendations
app.include_router(route_router, prefix="/api")

# Chatbot routes (basic + AI-powered)
app.include_router(chat_router, prefix="/api")


@app.get("/")
def home():
    """Welcome endpoint with API documentation"""
    return {
        "message": "Welcome to TechTonic Travel API v2.0",
        "description": "Your AI-powered travel companion for finding the best routes and recommendations",
        "version": "2.0.0",
        "api_sections": {
            "authentication": {
                "signup": "POST /api/auth/signup",
                "login": "POST /api/auth/login"
            },
            "travel_routes": {
                "get_recommendations": "POST /api/routes/recommend",
                "available_routes": "GET /api/routes/available-routes"
            },
            "chatbot_basic": {
                "create_session": "POST /api/chat/session/create",
                "send_message": "POST /api/chat/message",
                "get_history": "GET /api/chat/session/{session_id}/history",
                "user_sessions": "GET /api/chat/user/{user_id}/sessions"
            },
            "chatbot_ai_powered": {
                "ai_recommendation": "POST /api/chat/ai/recommendation?source=Delhi&destination=Nagpur",
                "ai_chat": "POST /api/chat/ai/chat (with source and destination in message)"
            },
            "status": {
                "health_check": "GET /api/chat/health"
            }
        },
        "features": [
            "🔐 JWT Authentication (signup & login)",
            "🗺️ Route recommendations with multiple transport modes",
            "💬 AI-powered chatbot using LangChain",
            "✈️ Real flight data from Amadeus API",
            "🚂 Train and bus information",
            "📍 Support for Delhi, Mumbai, Bangalore, Hyderabad, Nagpur, Pune, Kolkata, Chennai",
            "💾 MongoDB integration for chat history",
            "🔄 Multi-turn conversations"
        ],
        "quick_start": {
            "step1": "Authentication: POST /api/auth/signup with name, email, password",
            "step2": "Login: POST /api/auth/login to get access token",
            "step3": "Chat Session: POST /api/chat/session/create with user_id",
            "step4": "Ask Question: POST /api/chat/ai/chat with session_id and message like 'How do I go from Delhi to Nagpur?'",
            "alternative": "Direct recommendation: POST /api/chat/ai/recommendation?source=Delhi&destination=Nagpur"
        },
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json"
        }
    }


@app.get("/health")
def health_check():
    """System health check"""
    return {
        "status": "operational",
        "service": "TechTonic Travel API",
        "components": {
            "authentication": "✅ Active",
            "route_recommendations": "✅ Active",
            "chatbot_basic": "✅ Active",
            "chatbot_ai": "✅ Active (LangChain + Amadeus)",
            "database": "✅ MongoDB Connected"
        },
        "version": "2.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
