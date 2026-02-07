# main.py
from fastapi import FastAPI
from authentication.login_api import router as login_router
from authentication.signup_api import router as signup_router
from routes.route_recommendations import router as route_router

app = FastAPI(
    title="TechTonic Travel API",
    description="Travel route recommendations with multiple transport modes",
    version="1.0.0"
)

# Include authentication routers
app.include_router(login_router)
app.include_router(signup_router)

# Include route recommendation router
app.include_router(route_router)


@app.get("/")
def home():
    """Welcome endpoint"""
    return {
        "message": "Welcome to TechTonic Travel API",
        "endpoints": {
            "auth": "/auth/signup, /auth/login",
            "routes": "/routes/recommend, /routes/available-routes"
        }
    }
