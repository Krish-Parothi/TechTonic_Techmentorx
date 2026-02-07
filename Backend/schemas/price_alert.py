# schemas/price_alert.py
from datetime import datetime
from base import MongoBase

class PriceAlertSchema(MongoBase):
    userId: str
    origin: str
    destination: str
    targetPrice: str
    isActive: bool = True
    createdAt: datetime
