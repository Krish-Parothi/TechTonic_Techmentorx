# schemas/auth.py
from pydantic import BaseModel, EmailStr

class SignupSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenResponseSchema(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
