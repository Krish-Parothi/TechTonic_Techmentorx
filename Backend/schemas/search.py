# schemas/flight_search.py
from datetime import datetime, date
from base import MongoBase

class FlightSearchSchema(MongoBase):
    userId: str
    origin: str
    destination: str
    departureDate: date
    returnDate: date
    searchedAt: datetime
