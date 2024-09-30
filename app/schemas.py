from pydantic import BaseModel, EmailStr

# Schema for creating a new user (for registration)
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Schema for user response (without password)
class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr

    class Config:
        orm_mode = True

# Schema for login (only email and password)
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# New schema for token response
class Token(BaseModel):
    access_token: str
    token_type: str
