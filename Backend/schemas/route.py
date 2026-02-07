from pydantic import BaseModel
from typing import List, Optional


class TransportOption(BaseModel):
    """Single transport mode option with details"""
    mode: str  # "train", "plane", "bus"
    duration: str  # e.g., "6 hours", "2 hours 30 min"
    price: float  # in INR
    distance: float  # in km
    availability: int  # number of daily services
    comfort_level: str  # "Budget", "Standard", "Premium"
    estimated_cost_range: str  # e.g., "500-1500"


class RouteRecommendationRequest(BaseModel):
    """Request model for route recommendations"""
    source: str  # e.g., "Delhi"
    destination: str  # e.g., "Nagpur"
    travel_date: Optional[str] = None  # e.g., "2026-02-15"
    preferences: Optional[List[str]] = None  # e.g., ["fastest", "cheapest", "comfort"]


class RouteRecommendationResponse(BaseModel):
    """Response model with recommended routes"""
    source: str
    destination: str
    distance_km: float
    travel_modes: List[TransportOption]  # List of train, plane, bus options
    best_for: dict  # Best options for different preferences
    
    class Config:
        json_schema_extra = {
            "example": {
                "source": "Delhi",
                "destination": "Nagpur",
                "distance_km": 1365,
                "travel_modes": [
                    {
                        "mode": "plane",
                        "duration": "2 hours",
                        "price": 3500,
                        "distance": 1365,
                        "availability": 8,
                        "comfort_level": "Standard",
                        "estimated_cost_range": "2500-5000"
                    },
                    {
                        "mode": "train",
                        "duration": "18 hours",
                        "price": 1500,
                        "distance": 1365,
                        "availability": 6,
                        "comfort_level": "Standard",
                        "estimated_cost_range": "800-2500"
                    },
                    {
                        "mode": "bus",
                        "duration": "20 hours",
                        "price": 800,
                        "distance": 1365,
                        "availability": 12,
                        "comfort_level": "Budget",
                        "estimated_cost_range": "500-1200"
                    }
                ],
                "best_for": {
                    "fastest": "plane (2 hours)",
                    "cheapest": "bus (₹800)",
                    "comfort": "plane (Standard)"
                }
            }
        }
