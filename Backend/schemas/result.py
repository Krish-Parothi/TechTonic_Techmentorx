# schemas/flight_result.py
from datetime import datetime, date
from pydantic import BaseModel
from base import MongoBase

class PriceSchema(BaseModel):
    total: str
    currency: str = "EUR"

class FlightResultSchema(MongoBase):
    searchId: str
    type: str
    origin: str
    destination: str
    departureDate: date
    returnDate: date
    price: PriceSchema
    fetchedAt: datetime
