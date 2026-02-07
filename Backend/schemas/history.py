# schemas/price_history.py
from datetime import datetime, date
from base import MongoBase

class PriceHistorySchema(MongoBase):
    origin: str
    destination: str
    date: date
    price: str
    recordedAt: datetime
