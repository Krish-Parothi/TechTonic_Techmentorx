"""
Fast Travel Assistant using Groq LLM + Amadeus API
Single file with Langchain + Groq + JSON output
"""

import os
import json
import requests
from typing import Dict, Optional, Any
from datetime import datetime
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

load_dotenv()

# ==================== INITIALIZATION ====================

# Groq LLM - Fast model (initialized lazily)
groq_api_key = os.getenv("GROQ_API_KEY", "")
llm = None

def get_llm():
    """Get or initialize Groq LLM"""
    global llm
    if llm is None and groq_api_key:
        llm = ChatGroq(
            model="openai/gpt-oss-120b",
            api_key=groq_api_key,
            temperature=0.3,
            max_tokens=1024
        )
    return llm

# Amadeus API credentials
AMADEUS_CLIENT_ID = os.getenv("AMADEUS_KEY", "")
AMADEUS_CLIENT_SECRET = os.getenv("SECRET", "")

# ==================== AMADEUS API INTEGRATION ====================

class AmadeusClient:
    """Fast Amadeus API client for flight data"""
    
    BASE_URL = "https://test.api.amadeus.com"
    
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token = None
        self.token_expiry = 0
    
    def get_token(self) -> Optional[str]:
        """Get OAuth2 token from Amadeus"""
        if self.token and datetime.now().timestamp() < self.token_expiry:
            return self.token
        
        try:
            response = requests.post(
                f"{self.BASE_URL}/v1/security/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret
                },
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.token_expiry = datetime.now().timestamp() + data.get("expires_in", 1800)
                return self.token
        except Exception as e:
            print(f"Token error: {e}")
        return None
    
    def get_flights(self, origin: str, destination: str) -> Dict[str, Any]:
        """Fetch flights from Amadeus API"""
        token = self.get_token()
        if not token:
            return self._get_mock_flights(origin, destination)
        
        try:
            headers = {"Authorization": f"Bearer {token}"}
            params = {
                "originLocationCode": origin,
                "destinationLocationCode": destination,
                "departureDate": "2024-12-25",
                "adults": "1"
            }
            response = requests.get(
                f"{self.BASE_URL}/v2/shopping/flight-offers",
                headers=headers,
                params=params,
                timeout=5
            )
            if response.status_code == 200:
                return {"source": "amadeus", "data": response.json()}
        except Exception as e:
            print(f"Flight fetch error: {e}")
        
        return self._get_mock_flights(origin, destination)
    
    def _get_mock_flights(self, origin: str, destination: str) -> Dict[str, Any]:
        """Fallback mock flight data - super fast"""
        return {
            "source": "mock",
            "data": {
                "flights": [
                    {
                        "id": "FL001",
                        "airline": "IndiGo",
                        "departure": "08:00",
                        "arrival": "10:30",
                        "duration": "2h 30m",
                        "price": 3500,
                        "currency": "INR"
                    },
                    {
                        "id": "FL002",
                        "airline": "Spice Jet",
                        "departure": "14:00",
                        "arrival": "16:15",
                        "duration": "2h 15m",
                        "price": 3200,
                        "currency": "INR"
                    },
                    {
                        "id": "FL003",
                        "airline": "Air India",
                        "departure": "18:00",
                        "arrival": "20:30",
                        "duration": "2h 30m",
                        "price": 4200,
                        "currency": "INR"
                    }
                ]
            }
        }

# Initialize Amadeus client
amadeus = AmadeusClient(AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET)

# ==================== PYDANTIC OUTPUT MODELS ====================

class Flight(BaseModel):
    id: str
    airline: str
    departure: str
    arrival: str
    duration: str
    price: float
    currency: str = "INR"

class RouteRecommendation(BaseModel):
    source_city: str = Field(description="Starting city")
    destination_city: str = Field(description="Destination city")
    source_airport: str = Field(description="Source airport code")
    destination_airport: str = Field(description="Destination airport code")
    best_flight: Dict[str, Any] = Field(description="Recommended flight option")
    all_flights: list = Field(description="All available flights")
    recommendation_reason: str = Field(description="Why this flight is recommended")

# ==================== LANGCHAIN SETUP ====================

# City to airport code mapping
CITY_AIRPORT_MAP = {
    "delhi": "DEL", "new delhi": "DEL", "dilli": "DEL",
    "mumbai": "BOM", "bombay": "BOM",
    "bangalore": "BLR", "bengaluru": "BLR",
    "hyderabad": "HYD", "kolkata": "CCU", "calcutta": "CCU",
    "goa": "GOI", "gurugram": "DEL", "noida": "DEL"
}

def get_airport_code(city: str) -> str:
    """Convert city name to airport code"""
    return CITY_AIRPORT_MAP.get(city.lower().strip(), city.upper()[:3])

# JSON Output Parser
output_parser = JsonOutputParser(pydantic_object=RouteRecommendation)

# Prompt template with dynamic variables
prompt_template = PromptTemplate(
    input_variables=["source_city", "destination_city", "flight_data", "user_query"],
    template="""You are a fast travel booking assistant. Analyze the flight data and provide recommendations.

Source City: {source_city}
Destination City: {destination_city}
User Query: {user_query}

Available Flights Data:
{flight_data}

Based on this data, recommend the best flight option considering price, duration, and timing.
Respond in JSON format with these fields:
- source_city
- destination_city  
- source_airport
- destination_airport
- best_flight (the flight object you recommend)
- all_flights (list of all available flights)
- recommendation_reason (brief explanation why you chose this flight)

Respond ONLY with valid JSON, no other text."""
)

def get_chain():
    """Get LangChain chain (dynamically creates if Groq key available)"""
    llm_instance = get_llm()
    if llm_instance:
        return prompt_template | llm_instance | output_parser
    else:
        # Fallback chain without LLM for testing/mock mode
        return None

# ==================== MAIN CHATBOT CLASS ====================

class GroqTravelAssistant:
    """Fast travel assistant using Groq LLM"""
    
    def __init__(self):
        self.amadeus = amadeus
        self.conversation_history = []
    
    def _generate_mock_recommendation(self, source: str, destination: str, flights: list) -> Dict[str, Any]:
        """Generate mock recommendation when Groq not available"""
        if not flights:
            flights = []
        
        best_flight = flights[0] if flights else {
            "id": "MOCK001",
            "airline": "IndiGo",
            "departure": "08:00",
            "arrival": "10:30",
            "duration": "2h 30m",
            "price": 3500,
            "currency": "INR"
        }
        
        return {
            "source_city": source,
            "destination_city": destination,
            "source_airport": get_airport_code(source),
            "destination_airport": get_airport_code(destination),
            "best_flight": best_flight,
            "all_flights": flights,
            "recommendation_reason": "Fast mock recommendation (Groq LLM not configured). Add GROQ_API_KEY to .env for AI recommendations."
        }
    
    def get_recommendation(
        self, 
        source: str, 
        destination: str, 
        query: str = "What's the best flight option?"
    ) -> Dict[str, Any]:
        """
        Get travel recommendation - FAST
        
        Args:
            source: Starting city (e.g., "Delhi")
            destination: Destination city (e.g., "Mumbai")
            query: User's specific question (optional)
        
        Returns:
            JSON response with flight recommendations
        """
        try:
            # Get airport codes
            source_code = get_airport_code(source)
            dest_code = get_airport_code(destination)
            
            # Fetch flights from Amadeus (or mock)
            flight_response = self.amadeus.get_flights(source_code, dest_code)
            
            # Format flight data for LLM
            if "data" in flight_response and "flights" in flight_response["data"]:
                flights = flight_response["data"]["flights"]
            else:
                flights = []
            
            # Try to use Groq LLM if available
            chain = get_chain()
            if chain:
                try:
                    flight_data_str = json.dumps(flights, indent=2)
                    recommendation = chain.invoke({
                        "source_city": source.title(),
                        "destination_city": destination.title(),
                        "flight_data": flight_data_str,
                        "user_query": query
                    })
                    return {
                        "status": "success",
                        "data": recommendation,
                        "source": "groq_ai",
                        "amadeus_source": flight_response.get("source", "mock")
                    }
                except Exception as e:
                    print(f"LLM error: {e}, using mock recommendation")
            
            # Fallback to mock if Groq not available
            recommendation = self._generate_mock_recommendation(source, destination, flights)
            return {
                "status": "success",
                "data": recommendation,
                "source": "mock_recommendation",
                "amadeus_source": flight_response.get("source", "mock"),
                "note": "Using mock recommendation (add GROQ_API_KEY for AI-powered responses)"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "data": None
            }
    
    def chat(self, user_message: str) -> Dict[str, Any]:
        """
        Multi-turn conversation - extracts source/destination from message
        
        Args:
            user_message: User's query (e.g., "flights from Delhi to Mumbai")
        
        Returns:
            JSON response
        """
        # Store in history
        self.conversation_history.append({
            "role": "user",
            "content": user_message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Simple extraction of source and destination
        words = user_message.lower().split()
        source = destination = None
        
        # Extract cities from message
        all_cities = list(CITY_AIRPORT_MAP.keys())
        for word in words:
            if word in all_cities:
                if source is None:
                    source = word.title()
                else:
                    destination = word.title()
                    break
        
        # If not found, ask for clarification
        if not source or not destination:
            response = {
                "status": "clarification_needed",
                "message": "Please specify source and destination cities (e.g., 'flights from Delhi to Mumbai')",
                "data": None
            }
        else:
            response = self.get_recommendation(source, destination, user_message)
        
        # Store response
        self.conversation_history.append({
            "role": "assistant",
            "content": str(response),
            "timestamp": datetime.now().isoformat()
        })
        
        return response

# ==================== GLOBAL INSTANCE ====================

travel_assistant = GroqTravelAssistant()

# ==================== UTILITY FUNCTIONS ====================

def get_travel_recommendation(source: str, destination: str, query: str = "") -> Dict[str, Any]:
    """Public function to get travel recommendation"""
    return travel_assistant.get_recommendation(source, destination, query)

def chat_with_assistant(user_message: str) -> Dict[str, Any]:
    """Public function for multi-turn conversation"""
    return travel_assistant.chat(user_message)

def get_available_cities() -> Dict[str, list]:
    """Get list of available cities"""
    return {"cities": sorted(list(set(CITY_AIRPORT_MAP.keys())))}
