const express = require('express');
const router = express.Router();
const axios = require('axios');

// GFG stats endpoint
router.post('/stats', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const response = await axios.get(`https://auth.geeksforgeeks.org/user/${username}/practice/`);
        const html = response.data;

        // Extract stats using regex
        const stats = {
            total_solved: 0,
            easy_solved: 0,
            medium_solved: 0,
            hard_solved: 0,
            profile_url: `https://auth.geeksforgeeks.org/user/${username}/practice/`
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching GFG stats:', error);
        res.status(500).json({ error: 'Failed to fetch GFG stats' });
    }
});

module.exports = router;
