"""
FastAPI routes for Groq Travel Assistant
Minimal routes file - all logic in chatbot.py
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from Chatbot.chatbot import get_travel_recommendation, chat_with_assistant, get_available_cities

app = APIRouter(prefix="/chat", tags=["Travel Assistant"])

# ==================== REQUEST MODELS ====================

class RecommendationRequest(BaseModel):
    source: str
    destination: str
    query: Optional[str] = "What's the best option?"

class ChatRequest(BaseModel):
    message: str

# ==================== ENDPOINTS ====================

@app.post("/recommend")
async def get_recommendation(request: RecommendationRequest):
    """Get travel recommendation for source->destination route"""
    result = get_travel_recommendation(
        source=request.source,
        destination=request.destination,
        query=request.query
    )
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result["data"]

@app.post("/chat")
async def chat(request: ChatRequest):
    """Multi-turn conversation endpoint - extracts source/destination from message"""
    result = chat_with_assistant(request.message)
    return result

@app.get("/cities")
async def list_cities():
    """Get list of available cities"""
    return get_available_cities()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Groq Travel Assistant",
        "llm": "mixtral-8x7b-32768",
        "endpoints": [
            "POST /api/chat/recommend - Get flight recommendation",
            "POST /api/chat/chat - Chat interface",
            "GET /api/chat/cities - Available cities",
            "GET /api/chat/health - This endpoint"
        ]
    }
