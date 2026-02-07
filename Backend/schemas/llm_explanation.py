# schemas/llm_explanation.py
from datetime import datetime
from base import MongoBase

class LLMExplanationSchema(MongoBase):
    userId: str
    flightResultId: str
    explanation: str
    createdAt: datetime
