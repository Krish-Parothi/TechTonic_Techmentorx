# schemas/user.py
from pydantic import EmailStr
from datetime import datetime
from base import MongoBase

class UserSchema(MongoBase):
    name: str
    email: EmailStr
    passwordHash: str
    isPremium: bool = False
    createdAt: datetime
    lastLogin: datetime | None = None
