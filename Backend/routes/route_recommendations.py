from fastapi import APIRouter, HTTPException
from schemas.route import RouteRecommendationRequest, RouteRecommendationResponse, TransportOption
from typing import Dict, List

app = APIRouter(prefix="/routes", tags=["Routes"])

# Sample route data (in production, this would come from a database or external API)
ROUTE_DATABASE = {
    ("delhi", "nagpur"): {
        "distance_km": 1365,
        "modes": {
            "plane": {
                "duration": "2 hours",
                "price": 3500,
                "availability": 8,
                "comfort_level": "Standard"
            },
            "train": {
                "duration": "18 hours",
                "price": 1500,
                "availability": 6,
                "comfort_level": "Standard"
            },
            "bus": {
                "duration": "20 hours",
                "price": 800,
                "availability": 12,
                "comfort_level": "Budget"
            }
        }
    },
    ("mumbai", "bangalore"): {
        "distance_km": 981,
        "modes": {
            "plane": {
                "duration": "1.5 hours",
                "price": 3000,
                "availability": 12,
                "comfort_level": "Standard"
            },
            "train": {
                "duration": "16 hours",
                "price": 1200,
                "availability": 5,
                "comfort_level": "Standard"
            },
            "bus": {
                "duration": "18 hours",
                "price": 600,
                "availability": 10,
                "comfort_level": "Budget"
            }
        }
    },
    ("bangalore", "hyderabad"): {
        "distance_km": 586,
        "modes": {
            "plane": {
                "duration": "1 hour",
                "price": 2500,
                "availability": 6,
                "comfort_level": "Standard"
            },
            "train": {
                "duration": "12 hours",
                "price": 800,
                "availability": 4,
                "comfort_level": "Standard"
            },
            "bus": {
                "duration": "8 hours",
                "price": 400,
                "availability": 15,
                "comfort_level": "Budget"
            }
        }
    }
}


def normalize_location(location: str) -> str:
    """Normalize location name for database lookup"""
    return location.lower().strip()


def get_estimated_price_range(price: float, mode: str) -> str:
    """Generate estimated price range based on mode and base price"""
    ranges = {
        "plane": (price * 0.7, price * 1.4),
        "train": (price * 0.5, price * 1.6),
        "bus": (price * 0.6, price * 1.5)
    }
    
    if mode in ranges:
        min_price, max_price = ranges[mode]
        return f"₹{int(min_price)}-{int(max_price)}"
    return f"₹{int(price * 0.8)}-{int(price * 1.5)}"


def determine_best_options(modes: Dict) -> Dict[str, str]:
    """Determine best options for different preferences"""
    best_options = {}
    
    # Fastest
    durations = {
        mode: modes[mode]['duration'] for mode in modes
    }
    
    def parse_duration_to_minutes(duration_str: str) -> int:
        """Convert duration string to minutes for comparison"""
        parts = duration_str.split()
        total_minutes = 0
        i = 0
        while i < len(parts):
            try:
                value = float(parts[i])
                unit = parts[i + 1].lower()
                
                if 'hour' in unit:
                    total_minutes += int(value * 60)
                elif 'min' in unit:
                    total_minutes += int(value)
                
                i += 2
            except (ValueError, IndexError):
                i += 1
        
        return total_minutes
    
    fastest_mode = min(durations.keys(), 
                      key=lambda x: parse_duration_to_minutes(durations[x]))
    best_options["fastest"] = f"{fastest_mode} ({durations[fastest_mode]})"
    
    # Cheapest
    cheapest_mode = min(modes.keys(), key=lambda x: modes[x]['price'])
    best_options["cheapest"] = f"{cheapest_mode} (₹{modes[cheapest_mode]['price']})"
    
    # Most Comfort
    comfort_scores = {
        "Premium": 3,
        "Standard": 2,
        "Budget": 1
    }
    most_comfort_mode = max(modes.keys(), 
                            key=lambda x: comfort_scores.get(modes[x]['comfort_level'], 0))
    best_options["comfort"] = f"{most_comfort_mode} ({modes[most_comfort_mode]['comfort_level']})"
    
    return best_options


@app.post("/recommend", response_model=RouteRecommendationResponse)
def recommend_routes(request: RouteRecommendationRequest):
    """
    Get route recommendations between two locations with multiple transport modes.
    
    **Parameters:**
    - `source`: Starting location (e.g., "Delhi")
    - `destination`: Ending location (e.g., "Nagpur")
    - `travel_date`: Optional travel date (e.g., "2026-02-15")
    - `preferences`: Optional list of preferences (e.g., ["fastest", "cheapest", "comfort"])
    
    **Returns:**
    - List of transport options (plane, train, bus) with detailed information
    - Best options for different preferences
    """
    
    source = normalize_location(request.source)
    destination = normalize_location(request.destination)
    
    # Look up route (check both directions)
    route_key = (source, destination)
    reverse_route_key = (destination, source)
    
    route_data = None
    if route_key in ROUTE_DATABASE:
        route_data = ROUTE_DATABASE[route_key]
    elif reverse_route_key in ROUTE_DATABASE:
        route_data = ROUTE_DATABASE[reverse_route_key]
    else:
        raise HTTPException(
            status_code=404,
            detail=f"Route from {request.source} to {request.destination} not found. Try popular routes like Delhi-Nagpur, Mumbai-Bangalore, etc."
        )
    
    # Build transport options
    transport_options: List[TransportOption] = []
    modes_dict = route_data["modes"]
    
    for mode_name, mode_data in modes_dict.items():
        option = TransportOption(
            mode=mode_name,
            duration=mode_data["duration"],
            price=mode_data["price"],
            distance=route_data["distance_km"],
            availability=mode_data["availability"],
            comfort_level=mode_data["comfort_level"],
            estimated_cost_range=get_estimated_price_range(mode_data["price"], mode_name)
        )
        transport_options.append(option)
    
    # Sort by price (cheapest first) by default
    transport_options.sort(key=lambda x: x.price)
    
    # Determine best options
    best_for = determine_best_options(modes_dict)
    
    return RouteRecommendationResponse(
        source=request.source,
        destination=request.destination,
        distance_km=route_data["distance_km"],
        travel_modes=transport_options,
        best_for=best_for
    )


@app.get("/available-routes")
def get_available_routes():
    """Get list of all available routes in the system"""
    routes = []
    for (source, destination) in ROUTE_DATABASE.keys():
        routes.append({
            "source": source.title(),
            "destination": destination.title(),
            "distance_km": ROUTE_DATABASE[(source, destination)]["distance_km"]
        })
    
    return {
        "total_routes": len(routes),
        "routes": sorted(routes, key=lambda x: x["source"])
    }
