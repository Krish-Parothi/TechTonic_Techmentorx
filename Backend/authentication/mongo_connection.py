# db/mongo.py
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["airport_llm"]

users_collection = db["users"]
sessions_collection = db["sessions"]
