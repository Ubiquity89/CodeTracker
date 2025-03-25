import re
from typing import Dict, Any

def is_user_valid(username: str) -> bool:
    """Check if the username is valid."""
    # CodeChef username rules
    return bool(re.match(r'^[a-zA-Z0-9_]+$', username))

def parse_html(html_content: bytes) -> Dict[str, Any]:
    """Parse the HTML content to extract user statistics."""
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')

        # Extract rating
        rating_element = soup.find('div', class_='rating-number')
        rating = int(rating_element.text.strip()) if rating_element else 0

        # Extract global rank
        rank_element = soup.find('div', class_='rating-ranks')
        rank = 0
        if rank_element:
            rank_text = rank_element.find('strong').text.strip()
            rank = int(rank_text.split('#')[1]) if rank_text.startswith('#') else 0

        # Extract solved problems
        solved_element = soup.find('section', class_='rating-data-section problems-solved')
        total_solved = 0
        if solved_element:
            full_text = solved_element.get_text()
            total_solved = int(re.search(r'\d+', full_text).group())

        return {
            'rating': rating,
            'rank': rank,
            'total_solved': total_solved
        }
    except Exception as e:
        print(f"Error parsing HTML: {e}")
        return None

def build_response_dict(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Build the response dictionary from parsed user data."""
    return {
        'rating': user_data.get('rating', 0),
        'rank': user_data.get('rank', 0),
        'total_solved': user_data.get('total_solved', 0)
    }
