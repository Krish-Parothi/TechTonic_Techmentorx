# schemas/session.py
from datetime import datetime
from base import MongoBase

class SessionSchema(MongoBase):
    userId: str
    refreshToken: str
    expiresAt: datetime
    createdAt: datetime
