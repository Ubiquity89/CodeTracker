from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import requests
from typing import Optional

from .settings import BASE_URL

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class CodeforcesUser(BaseModel):
    username: str

class CodeforcesStats(BaseModel):
    username: str
    rating: str
    max_rating: str
    rank: str
    max_rank: str
    contribution: int
    friend_count: int
    avatar: str
    profile_url: str

@router.post("/codeforces/stats", response_model=CodeforcesStats)
async def get_codeforces_stats(user: CodeforcesUser):
    try:
        logger.debug(f"Fetching Codeforces stats for: {user.username}")

        username = user.username.strip()
        url = f"{BASE_URL}user.info?handles={username}"
        
        response = requests.get(url)
        data = response.json()

        if data["status"] == "OK":
            user_info = data["result"][0]
            
            return CodeforcesStats(
                username=user_info["handle"],
                rating=str(user_info.get("rating", "N/A")),
                max_rating=str(user_info.get("maxRating", "N/A")),
                rank=user_info.get("rank", "N/A"),
                max_rank=user_info.get("maxRank", "N/A"),
                contribution=user_info.get("contribution", 0),
                friend_count=user_info.get("friendOfCount", 0),
                avatar=user_info.get("avatar", ""),
                profile_url=f"https://codeforces.com/profile/{username}"
            )
        else:
            logger.error(f"User not found: {username}")
            raise HTTPException(
                status_code=404,
                detail=f"User '{username}' not found on Codeforces. Please check the username and try again."
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching Codeforces stats: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch Codeforces stats: {str(e)}. Please try again later."
        )
