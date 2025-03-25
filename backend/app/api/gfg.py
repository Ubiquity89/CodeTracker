from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import requests
from bs4 import BeautifulSoup
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class GFGUser(BaseModel):
    username: str

class GFGStats(BaseModel):
    total_solved: int
    school_solved: int
    basic_solved: int
    easy_solved: int
    medium_solved: int
    hard_solved: int
    profile_url: str

@router.post("/gfg/stats", response_model=GFGStats)
async def get_gfg_stats(user: GFGUser):
    try:
        logger.debug(f"Fetching GFG stats for: {user.username}")

        username = user.username  # Keep the original case
        url = f"https://www.geeksforgeeks.org/user/{username}"
        
        # Make request to GFG
        response = requests.get(url)
        
        if response.status_code != 200:
            logger.error(f"GFG API Error: {response.text}")
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"User '{username}' not found on GFG")
            raise HTTPException(status_code=response.status_code, detail=f"GFG API Error: {response.text}")

        # Parse HTML using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the problem statistics element
        problem_stats = soup.find('div', class_='problemNavbar_head__cKSRi')
        
        if not problem_stats:
            raise HTTPException(status_code=400, detail=f"No problem statistics found for user '{username}'")

        # Extract difficulty-wise problem counts
        difficulty_tags = ["School", "Basic", "Easy", "Medium", "Hard"]
        values = {tag: 0 for tag in difficulty_tags}
        total_solved = 0

        # Process the text to extract numbers
        raw_text = problem_stats.get_text()
        
        # Extract numbers from the text
        numbers = []
        current_number = ''
        for char in raw_text:
            if char.isdigit():
                current_number += char
            elif current_number:
                numbers.append(int(current_number))
                current_number = ''
        if current_number:  # Add the last number if exists
            numbers.append(int(current_number))

        # Assign numbers to difficulty levels
        for i, num in enumerate(numbers):
            if i < len(difficulty_tags):
                values[difficulty_tags[i]] = num
                total_solved += num

        logger.debug(f"Extracted stats - Total Solved: {total_solved}, School: {values['School']}, Basic: {values['Basic']}, Easy: {values['Easy']}, Medium: {values['Medium']}, Hard: {values['Hard']}")

        return GFGStats(
            total_solved=total_solved,
            school_solved=values['School'],
            basic_solved=values['Basic'],
            easy_solved=values['Easy'],
            medium_solved=values['Medium'],
            hard_solved=values['Hard'],
            profile_url=url
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching GFG stats: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch GFG stats: {str(e)}")
