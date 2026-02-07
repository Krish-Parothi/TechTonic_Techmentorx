# routes/auth.py
from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId

from mongo_connection import users_collection
from auth_schema import SignupSchema
from password_utils import hash_password

app = APIRouter(prefix="/auth", tags=["Auth"])


@app.post("/signup")
def signup(data: SignupSchema):
    if users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    user = {
        "name": data.name,
        "email": data.email,
        "passwordHash": hash_password(data.password),
        "isPremium": False,
        "createdAt": datetime.utcnow(),
        "lastLogin": None
    }

    users_collection.insert_one(user)
    return {"message": "Signup successful"}
