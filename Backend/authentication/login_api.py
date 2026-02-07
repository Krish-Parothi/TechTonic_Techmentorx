from fastapi import APIRouter, HTTPException
from datetime import datetime
import os

from auth_schema import LoginSchema, TokenResponseSchema
from password_utils import verify_password
from jwt_utils import create_access_token
from mongo_connection import users_collection

router = APIRouter(prefix="/auth", tags=["Auth"])

# Load token expiry from .env (default 60 minutes)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


@router.post("/login", response_model=TokenResponseSchema)
def login(data: LoginSchema):
    user = users_collection.find_one({"email": data.email})

    if not user or not verify_password(data.password, user["passwordHash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"lastLogin": datetime.utcnow()}}
    )

    token = create_access_token(
        data={"userId": str(user["_id"])},
        expires_minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    return {"accessToken": token, "tokenType": "bearer"}
