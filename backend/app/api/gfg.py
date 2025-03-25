from fastapi import APIRouter, HTTPException
import requests
from pydantic import BaseModel
import logging
from bs4 import BeautifulSoup
import re
import time
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class GFGUser(BaseModel):
    username: str

class GFGStats(BaseModel):
    total_solved: int
    contest_rating: int
    profile_url: str

@router.post("/gfg/stats", response_model=GFGStats)
@lru_cache(maxsize=128)
async def get_gfg_stats(user: GFGUser):
    try:
        logger.debug(f"Fetching GFG stats for: {user.username}")

        url = f"https://www.geeksforgeeks.org/user/{user.username.lower()}/"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }

        # Add a small delay to prevent rate limiting
        time.sleep(0.5)
        
        response = requests.get(url, headers=headers, timeout=3)
        
        if response.status_code != 200:
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"User '{user.username}' not found on GFG")
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch GFG data")

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find total solved problems
        total_solved = 0
        solved_text = soup.find('span', string=re.compile(r'\d+ solved'))
        if solved_text:
            total_solved = int(re.search(r'\d+', solved_text.text).group())

        # Find contest rating
        contest_rating = 0
        rating_text = soup.find('span', string=re.compile(r'\d+ rating'))
        if rating_text:
            contest_rating = int(re.search(r'\d+', rating_text.text).group())

        return GFGStats(
            total_solved=total_solved,
            contest_rating=contest_rating,
            profile_url=url
        )

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Request to GFG timed out")
    except Exception as e:
        logger.error(f"Error fetching GFG stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch GFG stats: {str(e)}")
