const express = require('express');
const router = express.Router();
const axios = require('axios');

// LeetCode stats endpoint
router.post('/stats', async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const url = "https://leetcode.com/graphql";
        const query = `{
            matchedUser(username: "${username}") {
                username
                profile {
                    ranking
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }`;

        const response = await axios.post(url, { query });
        const data = response.data;

        if (!data.data?.matchedUser) {
            return res.status(404).json({ error: 'User not found on LeetCode' });
        }

        // Initialize difficulty stats
        const difficultyStats = {
            EASY: 0,
            MEDIUM: 0,
            HARD: 0
        };

        // Process difficulty stats
        if (data.data.matchedUser.submitStats?.acSubmissionNum) {
            data.data.matchedUser.submitStats.acSubmissionNum.forEach(item => {
                if (item.difficulty) {
                    const difficulty = item.difficulty.toUpperCase();
                    if (difficulty in difficultyStats) {
                        difficultyStats[difficulty] = item.count;
                    }
                }
            });
        }

        // Calculate total solved
        const totalSolved = Object.values(difficultyStats).reduce((sum, count) => sum + count, 0);

        const stats = {
            total_solved: totalSolved,
            easy_solved: difficultyStats.EASY,
            medium_solved: difficultyStats.MEDIUM,
            hard_solved: difficultyStats.HARD,
            ranking: data.data.matchedUser.profile.ranking,
            profile_url: `https://leetcode.com/${username}`
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching LeetCode stats:', error);
        res.status(500).json({ error: 'Failed to fetch LeetCode stats' });
    }
});

module.exports = router;
