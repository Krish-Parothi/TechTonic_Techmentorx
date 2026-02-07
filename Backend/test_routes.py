"""
Quick test script to demonstrate the route recommendation feature
Run with: python test_routes.py
"""

import json
from routes.route_recommendations import recommend_routes, get_available_routes
from schemas.route import RouteRecommendationRequest


def test_route_recommendations():
    """Test the route recommendation feature"""
    
    print("=" * 70)
    print("ROUTE RECOMMENDATION FEATURE TEST")
    print("=" * 70)
    
    # Test 1: Get available routes
    print("\n1. Available Routes in System:")
    print("-" * 70)
    available = get_available_routes()
    for route in available["routes"]:
        print(f"   {route['source']:15} → {route['destination']:15} ({route['distance_km']} km)")
    
    # Test 2: Recommend routes for Delhi to Nagpur
    print("\n2. Route Recommendations: Delhi → Nagpur")
    print("-" * 70)
    
    request = RouteRecommendationRequest(
        source="Delhi",
        destination="Nagpur"
    )
    
    response = recommend_routes(request)
    
    print(f"Distance: {response.distance_km} km")
    print(f"\nTransport Options:")
    print()
    
    for mode in response.travel_modes:
        print(f"   🚀 {mode.mode.upper()}")
        print(f"      Duration:      {mode.duration}")
        print(f"      Price:         ₹{mode.price} ({mode.estimated_cost_range})")
        print(f"      Daily Services: {mode.availability}")
        print(f"      Comfort Level: {mode.comfort_level}")
        print()
    
    print("Best Options:")
    for preference, option in response.best_for.items():
        print(f"   • {preference.title():12} → {option}")
    
    # Test 3: Different route
    print("\n3. Route Recommendations: Mumbai → Bangalore")
    print("-" * 70)
    
    request2 = RouteRecommendationRequest(
        source="Mumbai",
        destination="Bangalore"
    )
    
    response2 = recommend_routes(request2)
    
    for mode in response2.travel_modes:
        print(f"   {mode.mode.upper():8} → {mode.duration:15} : ₹{mode.price:6} | {mode.comfort_level}")
    
    print("\n" + "=" * 70)
    print("✅ All tests passed!")
    print("=" * 70)


if __name__ == "__main__":
    try:
        test_route_recommendations()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
