from fastapi import FastAPI, HTTPException, Depends
from .schemas import UserCreate, UserResponse, UserLogin, Token
from .crud import create_user, get_user_by_email
from .auth import verify_password, create_access_token, oauth2_scheme, verify_token, blacklist
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
import subprocess
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Database setup
DATABASE_URL = "sqlite:///./chatbot.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Create FastAPI app
app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if frontend is hosted elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String)
    sender = Column(String)  # 'user' or 'bot'

    user = relationship("User")

# Create database tables
Base.metadata.create_all(bind=engine)

# Pydantic models (for request/response validation)
class ChatMessageRequest(BaseModel):
    username: str
    message: str
    sender: str  # 'user' or 'bot'

class ChatMessageResponse(BaseModel):
    message: str
    sender: str

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/")
def read_root():
    return {"message": "Welcome to the Addiction Solver Bot API!"}

# Register route
@app.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = await get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = await create_user(user.dict())
    return new_user

# Login route that generates JWT token
@app.post("/login", response_model=Token)
async def login_for_access_token(user: UserLogin, db: Session = Depends(get_db)):
    db_user = await get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=30)  # Token expiration time
    access_token = create_access_token(data={"sub": db_user["username"]}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

# Logout route that blacklists the token
@app.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    blacklist.add(token)  # Add the token to the blacklist to "log out" the user
    return {"message": "Successfully logged out"}

@app.post("/save_message/")
def save_message(message: ChatMessageRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == message.username).first()
    if not user:
        user = User(username=message.username)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    chat_message = ChatMessage(user_id=user.id, message=message.message, sender=message.sender)
    db.add(chat_message)
    db.commit()
    return {"status": "Message saved"}

# Get chat history route
@app.get("/chat_history/{username}")
async def get_chat_history(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    chat_history = db.query(ChatMessage).filter(ChatMessage.user_id == user.id).all()
    return [{"message": chat.message, "sender": chat.sender} for chat in chat_history]





@app.delete("/clear_chat/{username}")
async def clear_chat_history(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete all chat messages for the user
    db.query(ChatMessage).filter(ChatMessage.user_id == user.id).delete()
    db.commit()
    
    return {"status": "Chat history cleared successfully"}

ADDICTION_KEYWORDS = [
    "addiction", "substance abuse",  "recovery", "drug", "alcohol",
    "rehab", "withdrawal", "overdose", "dependence", "therapy", "counseling",
    "habit", "compulsion", "detox", "smoking", "social media","hi" , "hello" , "greetings" 
]


def is_addiction_related(prompt: str):
    prompt_lower = prompt.lower()
    return any(keyword in prompt_lower for keyword in ADDICTION_KEYWORDS)

@app.post("/chatbot")
async def generate_response(prompt: str, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):

    user = verify_token(token)

    if not is_addiction_related(prompt):
        return {"response": "I can only assist with addiction-related stuff. Please ask me anything about addiction recovery."}

    try:
        # Run the LLaMA model using the provided prompt
        result = subprocess.run(
            ['/usr/local/bin/ollama', 'run', 'llama3.1', prompt],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Failed to run the LLaMA model. Error: {result.stderr}")

        # Get the bot's response
        bot_response = result.stdout.strip()

        # Save user and bot messages to the database
        user_message = ChatMessageRequest(username=user["sub"], message=prompt, sender="user")
        bot_message = ChatMessageRequest(username=user["sub"], message=bot_response, sender="bot")

        # Save both user and bot messages in the database
        save_message(user_message, db)  # Save user message
        save_message(bot_message, db)   # Save bot message

        return {"response": bot_response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
