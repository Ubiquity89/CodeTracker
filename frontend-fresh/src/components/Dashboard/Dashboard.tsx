import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Badge {
  title: string;
  stars: number;
}

interface Certificate {
  name: string;
  url: string;
  verified: boolean;
}

interface PlatformStats {
  total_solved?: number;
  school_solved?: number;
  basic_solved?: number;
  easy_solved?: number;
  medium_solved?: number;
  hard_solved?: number;
  ranking?: number;
  coding_score?: number;
  profile_url: string;
  badges?: Badge[];
  certificates?: Certificate[];
  stars?: number;
  skills?: number;
  rating?: number;
  rank?: number;
  max_rating?: number;
  max_rank?: string;
  contest_count?: number;
}

interface PlatformData {
  name: string;
  username: string;
  stats?: PlatformStats;
  error?: string;
  loading: boolean;
}

function Dashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("leetcode");
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const savedData = localStorage.getItem('codingProfile');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPlatforms([
        { name: "leetcode", username: data.leetcode, loading: true },
        { name: "gfg", username: data.gfg, loading: true },
        { name: "hackerrank", username: data.hackerrank, loading: true },
        { name: "codeforces", username: data.codeforces, loading: true },
        { name: "codechef", username: data.codechef, loading: false },
      ]);
    }
  }, []);

  useEffect(() => {
    const fetchPlatformStats = async (platform: PlatformData) => {
      if (!platform.username) {
        setPlatforms(prev => 
          prev.map(p => 
            p.name === platform.name 
              ? { ...p, error: "Please enter a username for this platform", loading: false } 
              : p
          )
        );
        return;
      }

      try {
        let response;
        if (platform.name === "leetcode") {
          response = await axios.post('http://localhost:5000/api/leetcode/stats', { username: platform.username });
        } else if (platform.name === "gfg") {
          response = await axios.post('http://localhost:5000/api/gfg/stats', { username: platform.username });
        } else if (platform.name === "hackerrank") {
          response = await axios.post('http://localhost:5000/api/hackerrank/stats', { username: platform.username });
        } else if (platform.name === "codechef") {
          response = await axios.post('http://localhost:5000/api/codechef/stats', { username: platform.username });
        } else if (platform.name === "codeforces") {
          response = await axios.post('http://localhost:5000/api/codeforces/stats', { username: platform.username });
        }

        if (response && response.data) {
          setPlatforms(prev => 
            prev.map(p => 
              p.name === platform.name 
                ? { ...p, stats: response.data, loading: false } 
                : p
            )
          );
        } else {
          setPlatforms(prev => 
            prev.map(p => 
              p.name === platform.name 
                ? { ...p, error: "Failed to fetch data", loading: false } 
                : p
            )
          );
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 
          (err.message.includes('404') ? 'User not found on this platform' : 'Failed to fetch data');
        setPlatforms(prev => 
          prev.map(p => 
            p.name === platform.name 
              ? { ...p, error: errorMessage, loading: false } 
              : p
          )
        );
      }
    };

    const selectedPlatformData = platforms.find(p => p.name === selectedPlatform);
    if (selectedPlatformData && !selectedPlatformData.stats && !selectedPlatformData.error) {
      fetchPlatformStats(selectedPlatformData);
    }
  }, [selectedPlatform, platforms]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedPlatform(newValue);
  };

  const getPlatformStats = (platform: PlatformData) => {
    if (!platform.stats) return null;

    return (
      <Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>Statistics</Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                {platform.name === "hackerrank" ? platform.stats.badges?.length :
                 platform.name === "gfg" ? platform.stats.total_solved :
                 platform.name === "codechef" ? platform.stats.rating :
                 platform.name === "codeforces" ? platform.stats.rating :
                 platform.stats.total_solved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {platform.name === "hackerrank" ? `Badges: ${platform.stats.badges?.length}` :
                 platform.name === "gfg" ? `Total Solved: ${platform.stats.total_solved}` :
                 platform.name === "codechef" ? `Rank: #${platform.stats.rank}` :
                 platform.name === "codeforces" ? `Rank: ${platform.stats.rank}` :
                 `Ranking: #${platform.stats.ranking}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom>Platform Specific Stats</Typography>
              <Grid container spacing={2}>
                {platform.name === "hackerrank" ? (
                  <>
                    {platform.stats.badges?.map((badge, index) => (
                      <Grid item xs={4} key={index}>
                        <Typography variant="h6" color="primary.main">{badge.stars}</Typography>
                        <Typography variant="body2" color="text.secondary">{badge.title}</Typography>
                      </Grid>
                    ))}
                  </>
                ) : platform.name === "gfg" ? (
                  <>
                    <Grid item xs={3}><Typography variant="h6" color="success.main">{platform.stats.school_solved}</Typography><Typography variant="body2" color="text.secondary">School</Typography></Grid>
                    <Grid item xs={3}><Typography variant="h6" color="warning.main">{platform.stats.basic_solved}</Typography><Typography variant="body2" color="text.secondary">Basic</Typography></Grid>
                    <Grid item xs={3}><Typography variant="h6" color="error.main">{platform.stats.easy_solved}</Typography><Typography variant="body2" color="text.secondary">Easy</Typography></Grid>
                    <Grid item xs={3}><Typography variant="h6" color="primary.main">{platform.stats.medium_solved}</Typography><Typography variant="body2" color="text.secondary">Medium</Typography></Grid>
                    <Grid item xs={3}><Typography variant="h6" color="secondary.main">{platform.stats.hard_solved}</Typography><Typography variant="body2" color="text.secondary">Hard</Typography></Grid>
                  </>
                ) : platform.name === "codechef" ? (
                  <>
                    <Grid item xs={4}><Typography variant="h6" color="success.main">{platform.stats.rating}</Typography><Typography variant="body2" color="text.secondary">Rating</Typography></Grid>
                    <Grid item xs={4}><Typography variant="h6" color="warning.main">{platform.stats.rank}</Typography><Typography variant="body2" color="text.secondary">Rank</Typography></Grid>
                    <Grid item xs={4}><Typography variant="h6" color="error.main">{platform.stats.total_solved}</Typography><Typography variant="body2" color="text.secondary">Total Solved</Typography></Grid>
                  </>
                ) : platform.name === "codeforces" ? (
                  <>
                    <Grid item xs={4}><Typography variant="h6" color="success.main">{platform.stats.rating}</Typography><Typography variant="body2" color="text.secondary">Rating</Typography></Grid>
                    <Grid item xs={4}><Typography variant="h6" color="warning.main">{platform.stats.max_rating}</Typography><Typography variant="body2" color="text.secondary">Max Rating</Typography></Grid>
                    <Grid item xs={4}><Typography variant="h6" color="error.main">{platform.stats.contest_count}</Typography><Typography variant="body2" color="text.secondary">Contests</Typography></Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={3}><Typography variant="h6" color="success.main">{platform.stats.easy_solved}</Typography><Typography variant="body2" color="text.secondary">Easy</Typography></Grid>
                    <Grid item xs={3}><Typography variant="h6" color="warning.main">{platform.stats.medium_solved}</Typography><Typography variant="body2" color="text.secondary">Medium</Typography></Grid>
                    <Grid item xs={3}><Typography variant="h6" color="error.main">{platform.stats.hard_solved}</Typography><Typography variant="body2" color="text.secondary">Hard</Typography></Grid>
                    <Grid item xs={3}><Typography variant="h6" color="primary.main">{platform.stats.total_solved}</Typography><Typography variant="body2" color="text.secondary">Total</Typography></Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>Detailed Statistics</Typography>
          {platform.name === "hackerrank" ? (
            <>
              <Typography variant="body1">Total Badges: {platform.stats.badges?.length}</Typography>
              {platform.stats.badges?.map((badge, index) => (
                <Typography variant="body1" key={index}>{badge.title}: {badge.stars} stars</Typography>
              ))}
              {platform.stats.certificates?.map((cert, index) => (
                <>
                  <Typography variant="body1" key={index}>{cert.name}</Typography>
                  <Typography variant="body2" color={cert.verified ? "success.main" : "text.secondary"}>
                    {cert.verified ? "✓ Verified" : "Not Verified"}
                  </Typography>
                </>
              ))}
            </>
          ) : platform.name === "gfg" ? (
            <>
              <Typography variant="body1">Total Solved: {platform.stats.total_solved}</Typography>
              <Typography variant="body1">School Problems: {platform.stats.school_solved}</Typography>
              <Typography variant="body1">Basic Problems: {platform.stats.basic_solved}</Typography>
              <Typography variant="body1">Easy Problems: {platform.stats.easy_solved}</Typography>
              <Typography variant="body1">Medium Problems: {platform.stats.medium_solved}</Typography>
              <Typography variant="body1">Hard Problems: {platform.stats.hard_solved}</Typography>
            </>
          ) : platform.name === "codechef" ? (
            <>
              <Typography variant="body1">Rating: {platform.stats.rating}</Typography>
              <Typography variant="body1">Rank: #{platform.stats.rank}</Typography>
              <Typography variant="body1">Total Solved: {platform.stats.total_solved}</Typography>
            </>
          ) : platform.name === "codeforces" ? (
            <>
              <Typography variant="body1">Rating: {platform.stats.rating}</Typography>
              <Typography variant="body1">Max Rating: {platform.stats.max_rating}</Typography>
              <Typography variant="body1">Rank: {platform.stats.rank}</Typography>
              <Typography variant="body1">Max Rank: {platform.stats.max_rank}</Typography>
              <Typography variant="body1">Total Solved: {platform.stats.total_solved}</Typography>
              <Typography variant="body1">Contests: {platform.stats.contest_count}</Typography>
            </>
          ) : (
            <>
              <Typography variant="body1">Total Solved: {platform.stats.total_solved}</Typography>
              <Typography variant="body1">Easy Problems: {platform.stats.easy_solved}</Typography>
              <Typography variant="body1">Medium Problems: {platform.stats.medium_solved}</Typography>
              <Typography variant="body1">Hard Problems: {platform.stats.hard_solved}</Typography>
            </>
          )}
          <Button variant="outlined" color="primary" href={platform.stats.profile_url} target="_blank">View Profile on {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}</Button>
        </Paper>
      </Box>
    );
  };

  const selectedPlatformData = platforms.find(p => p.name === selectedPlatform);

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 8, borderRadius: 2, backdropFilter: 'blur(6px)', backgroundColor: 'rgba(30, 41, 59, 0.85)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>Your Coding Progress</Typography>
          <Tabs value={selectedPlatform} onChange={handleTabChange} sx={{ mb: 4 }}>
            {platforms.map(platform => (
              <Tab key={platform.name} value={platform.name} label={platform.name.charAt(0).toUpperCase() + platform.name.slice(1)} />
            ))}
          </Tabs>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {selectedPlatformData && (
            <Box>
              {selectedPlatformData.loading && <CircularProgress />}
              {selectedPlatformData.error && <Alert severity="error" sx={{ mb: 2 }}>{selectedPlatformData.error}</Alert>}
              {getPlatformStats(selectedPlatformData)}
            </Box>
          )}
        </motion.div>
      </Paper>
    </Container>
  );
}

export default Dashboard;