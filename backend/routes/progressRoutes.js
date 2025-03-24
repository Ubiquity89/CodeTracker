const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const axios = require('axios');

// Get progress for all platforms
router.get('/:userId', async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update LeetCode progress
router.post('/leetcode/update', async (req, res) => {
  try {
    const { userId, username } = req.body;
    
    // LeetCode GraphQL API endpoint
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
            }
          }
        }
      `,
      variables: { username }
    });

    const data = response.data.data.matchedUser;
    
    let progress = await Progress.findOne({ userId, platform: 'leetcode' });
    if (!progress) {
      progress = new Progress({ userId, platform: 'leetcode' });
    }

    progress.problemsSolved = data.submitStats.acSubmissionNum.reduce((acc, curr) => acc + curr.count, 0);
    progress.rank = data.profile.ranking;
    progress.lastUpdated = new Date();

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update CodeForces progress
router.post('/codeforces/update', async (req, res) => {
  try {
    const { userId, username } = req.body;
    
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    const userData = response.data.result[0];

    let progress = await Progress.findOne({ userId, platform: 'codeforces' });
    if (!progress) {
      progress = new Progress({ userId, platform: 'codeforces' });
    }

    progress.rating = userData.rating || 0;
    progress.rank = userData.rank || 'unrated';
    progress.lastUpdated = new Date();

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add more platform-specific routes here (HackerRank, CodeChef, etc.)

module.exports = router;
