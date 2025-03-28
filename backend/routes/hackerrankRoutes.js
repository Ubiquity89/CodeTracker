const express = require('express');
const router = express.Router();
const axios = require('axios');

// HackerRank stats endpoint
router.post('/stats', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const response = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/profile`);
        const data = response.data;

        if (!data.success) {
            return res.status(404).json({ error: 'User not found on HackerRank' });
        }

        const stats = {
            total_solved: data.model.score,
            easy_solved: 0,
            medium_solved: 0,
            hard_solved: 0,
            profile_url: `https://www.hackerrank.com/${username}`
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching HackerRank stats:', error);
        res.status(500).json({ error: 'Failed to fetch HackerRank stats' });
    }
});

module.exports = router;
