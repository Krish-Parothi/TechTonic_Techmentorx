# main.py
from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.profile import router as profile_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)
