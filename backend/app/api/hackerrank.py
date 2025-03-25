from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import requests
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

class HackerRankUser(BaseModel):
    username: str

class Badge(BaseModel):
    title: str
    stars: int

class Certificate(BaseModel):
    name: str
    url: str
    verified: bool

class HackerRankStats(BaseModel):
    badges: list[Badge]
    certificates: list[Certificate]
    profile_url: str

@router.post("/hackerrank/stats", response_model=HackerRankStats)
async def get_hackerrank_stats(user: HackerRankUser):
    try:
        logger.debug(f"Fetching HackerRank stats for: {user.username}")

        username = user.username  # Keep the original case
        url = f"https://www.hackerrank.com/profile/{username}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Connection': 'keep-alive'
        }

        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"HackerRank API Error: {response.text}")
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"User '{username}' not found on HackerRank")
            raise HTTPException(status_code=response.status_code, detail=f"HackerRank API Error: {response.text}")

        soup = BeautifulSoup(response.text, "html.parser")

        # Extract badges
        badges = []
        badge_titles = soup.find_all("svg", class_="hexagon")
        for badge_title in badge_titles:
            title_element = badge_title.find("text", class_="badge-title")
            if title_element:
                title_name = title_element.text.strip()
                badge_stars = badge_title.find_all("path", class_="star")
                badges.append({
                    "title": title_name,
                    "stars": len(badge_stars)
                })

        # Extract certificates
        certificates = []
        certificates_div = soup.find("div", class_="hacker-certificates")
        if certificates_div:
            certificate_links = certificates_div.find_all("a", class_="certificate-link")
            for cert in certificate_links:
                cert_heading = cert.find("h2", class_="certificate_v3-heading")
                if cert_heading:
                    cert_name = cert_heading.text.replace("Certificate:", "").strip()
                    cert_url = "https://www.hackerrank.com" + cert.get("href", "")
                    is_verified = bool(cert.find("span", class_="certificate_v3-heading-verified"))
                    certificates.append({
                        "name": cert_name,
                        "url": cert_url,
                        "verified": is_verified
                    })

        logger.debug(f"Extracted {len(badges)} badges and {len(certificates)} certificates")

        return HackerRankStats(
            badges=badges,
            certificates=certificates,
            profile_url=url
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching HackerRank stats: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch HackerRank stats: {str(e)}")
