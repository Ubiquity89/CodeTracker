from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "your-secret-key"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

# Mock database
users_db = {
    "testuser": {
        "username": "testuser",
        "full_name": "Test User",
        "email": "test@example.com",
        "hashed_password": pwd_context.hash("testpass"),
    }
}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = users_db.get(username)
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Mock coding platform data
@app.get("/api/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    return {
        "total_problems": 425,
        "current_streak": 15,
        "achievements": 28,
        "global_rank": 1234
    }

@app.get("/api/progress")
async def get_progress(current_user: dict = Depends(get_current_user)):
    return [
        {"date": "2024-01", "github": 40, "leetcode": 30, "codeforces": 20},
        {"date": "2024-02", "github": 55, "leetcode": 45, "codeforces": 25},
        {"date": "2024-03", "github": 75, "leetcode": 60, "codeforces": 35},
    ]

@app.get("/api/achievements")
async def get_achievements(current_user: dict = Depends(get_current_user)):
    return [
        {
            "id": 1,
            "title": "Problem Solver",
            "description": "Solved 100 problems",
            "icon": "EmojiEvents",
            "progress": 100,
            "unlocked": True
        },
        {
            "id": 2,
            "title": "Streak Master",
            "description": "Maintained a 7-day streak",
            "icon": "Timer",
            "progress": 70,
            "unlocked": False
        }
    ]

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
