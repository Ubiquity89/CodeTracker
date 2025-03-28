from fastapi import APIRouter, HTTPException
import requests
import json
from pydantic import BaseModel
import logging
import time

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class LeetCodeUser(BaseModel):
    username: str

class LeetCodeStats(BaseModel):
    total_solved: int
    easy_solved: int
    medium_solved: int
    hard_solved: int
    ranking: int
    profile_url: str

@router.post("/leetcode/stats", response_model=LeetCodeStats)
async def get_leetcode_stats(user: LeetCodeUser):
    try:
        logger.debug(f"Fetching LeetCode stats for: {user.username}")

        url = "https://leetcode.com/graphql"
        query = '''
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    ranking
                }
                submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
        '''

        payload = {
            "query": query,
            "variables": {"username": user.username}
        }

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': 'https://leetcode.com/',
            'Origin': 'https://leetcode.com'
        }

        # Add a small delay to prevent rate limiting
        time.sleep(0.5)
        
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        
        if response.status_code != 200:
            logger.error(f"LeetCode API Error: {response.text}")
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"User '{user.username}' not found on LeetCode")
            raise HTTPException(status_code=response.status_code, detail=f"LeetCode API Error: {response.text}")

        data = response.json()
        
        if "errors" in data:
            logger.error(f"GraphQL Errors: {data['errors']}")
            raise HTTPException(status_code=400, detail=f"GraphQL Error: {data['errors']}")

        user_data = data.get("data", {}).get("matchedUser")
        if not user_data:
            logger.error(f"No user data found: {data}")
            raise HTTPException(status_code=404, detail=f"User '{user.username}' not found on LeetCode")

        stats = user_data["submitStatsGlobal"]["acSubmissionNum"]
        difficulty_count = {stat["difficulty"].upper(): stat["count"] for stat in stats}

        return LeetCodeStats(
            total_solved=difficulty_count.get("ALL", 0),
            easy_solved=difficulty_count.get("EASY", 0),
            medium_solved=difficulty_count.get("MEDIUM", 0),
            hard_solved=difficulty_count.get("HARD", 0),
            ranking=user_data["profile"]["ranking"],
            profile_url=f"https://leetcode.com/{user.username}/"
        )

    except requests.exceptions.Timeout:
        logger.error("Request to LeetCode timed out")
        raise HTTPException(status_code=504, detail="Request to LeetCode timed out")
    except Exception as e:
        logger.error(f"Error fetching LeetCode stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch LeetCode stats: {str(e)}")