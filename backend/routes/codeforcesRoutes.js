const express = require('express');
const router = express.Router();
const axios = require('axios');

// CodeForces stats endpoint
router.post('/stats', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        const data = response.data;

        if (data.status !== 'OK') {
            return res.status(404).json({ error: 'User not found on CodeForces' });
        }

        const stats = {
            total_solved: 0,
            easy_solved: 0,
            medium_solved: 0,
            hard_solved: 0,
            rating: data.result[0].rating,
            max_rating: data.result[0].maxRating,
            rank: data.result[0].rank,
            max_rank: data.result[0].maxRank,
            profile_url: `https://codeforces.com/profile/${username}`
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching CodeForces stats:', error);
        res.status(500).json({ error: 'Failed to fetch CodeForces stats' });
    }
});

module.exports = router;
