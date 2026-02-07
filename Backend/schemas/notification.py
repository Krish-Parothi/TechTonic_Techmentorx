# schemas/notification.py
from datetime import datetime
from base import MongoBase

class NotificationSchema(MongoBase):
    userId: str
    type: str  # PRICE_DROP, INFO
    message: str
    isRead: bool = False
    createdAt: datetime
