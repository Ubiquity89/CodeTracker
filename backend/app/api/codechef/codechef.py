from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import requests
from typing import Optional

from .settings import BASE_URL
from .utils import is_user_valid, parse_html, build_response_dict

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class CodeChefUser(BaseModel):
    username: str

class CodeChefStats(BaseModel):
    rating: int
    rank: int
    total_solved: int
    profile_url: str

@router.post("/codechef/stats", response_model=CodeChefStats)
async def get_codechef_stats(user: CodeChefUser):
    try:
        logger.debug(f"Fetching CodeChef stats for: {user.username}")

        username = user.username.lower()
        url = f"{BASE_URL}{username}"

        # Validate username
        if not is_user_valid(username):
            raise HTTPException(status_code=400, detail="Invalid username format")

        # Make request to CodeChef
        response = requests.get(url)
        
        if response.status_code != 200:
            logger.error(f"CodeChef API Error: {response.text}")
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"User '{username}' not found on CodeChef")
            raise HTTPException(status_code=response.status_code, detail=f"CodeChef API Error: {response.text}")

        # Parse HTML to get user data
        user_data = parse_html(response.content)
        
        if not user_data:
            raise HTTPException(status_code=500, detail="Failed to parse user data")

        # Build response
        response_data = build_response_dict(user_data)
        
        logger.debug(f"Extracted stats - Rating: {response_data['rating']}, Rank: {response_data['rank']}, Total Solved: {response_data['total_solved']}")

        return CodeChefStats(
            rating=response_data['rating'],
            rank=response_data['rank'],
            total_solved=response_data['total_solved'],
            profile_url=url
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching CodeChef stats: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch CodeChef stats: {str(e)}")
