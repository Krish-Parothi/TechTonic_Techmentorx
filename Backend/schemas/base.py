# schemas/base.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MongoBase(BaseModel):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {datetime: lambda v: v.isoformat()}
