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
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface PlatformStats {
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  ranking?: number;
  coding_score?: number;
  profile_url: string;
}

interface PlatformData {
  name: string;
  username: string;
  stats?: PlatformStats;
  error?: string;
  loading: boolean;
  lastUpdated?: Date;
}

function Dashboard() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("leetcode");
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const savedData = localStorage.getItem('codingProfile');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPlatforms([
        { name: "leetcode", username: data.leetcode, loading: true },
        { name: "gfg", username: data.gfg, loading: true },
        { name: "hackerrank", username: data.hackerrank, loading: false },
        { name: "codeforces", username: data.codeforces, loading: false },
        { name: "codechef", username: data.codechef, loading: false },
      ]);
    }
  }, []);

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
      setIsFetching(true);
      setPlatforms(prev => 
        prev.map(p => 
          p.name === platform.name 
            ? { ...p, loading: true, error: "" }
            : p
        )
      );

      let response;
      console.log(`Fetching stats for ${platform.name} with username: ${platform.username}`);
      
      if (platform.name === "leetcode") {
        try {
          response = await axios.post('http://localhost:8000/api/leetcode/stats', { username: platform.username }, {
            timeout: 5000,
          });
          console.log(`LeetCode response received`, response.data);
        } catch (err: any) {
          console.error('LeetCode API error:', err);
          throw err;
        }
      } else if (platform.name === "gfg") {
        try {
          response = await axios.post('http://localhost:8000/api/gfg/stats', { username: platform.username }, {
            timeout: 5000,
          });
          console.log(`GFG response received`, response.data);
        } catch (err: any) {
          console.error('GFG API error:', err);
          throw err;
        }
      }
      
      setPlatforms(prev => 
        prev.map(p => 
          p.name === platform.name 
            ? { ...p, stats: response.data, loading: false, error: "", lastUpdated: new Date() }
            : p
        )
      );
    } catch (err: any) {
      console.error(`Error fetching ${platform.name} stats:`, err);
      const errorMessage = err.response?.data?.detail || 
        (err.message.includes('404') ? 'User not found on this platform' : 
        (err.message.includes('timeout') ? 'Request timed out' : 
        (err.message.includes('Network Error') ? 'Network connection error' : 
        (err.message.includes('ECONNREFUSED') ? 'Backend server not running' : 
        'Failed to fetch data'))));
      
      setPlatforms(prev => 
        prev.map(p => 
          p.name === platform.name 
            ? { ...p, error: errorMessage, loading: false }
            : p
        )
      );
    } finally {
      setIsFetching(false);
    }
  };

  const fetchAllPlatforms = async () => {
    const activePlatforms = platforms.filter(p => p.username);
    if (activePlatforms.length === 0) return;

    await Promise.all(activePlatforms.map(platform => fetchPlatformStats(platform)));
  };

  useEffect(() => {
    const activePlatforms = platforms.filter(p => p.username);
    if (activePlatforms.length > 0) {
      fetchAllPlatforms();
    }
  }, [platforms]);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "leetcode":
        return theme.palette.primary.main;
      case "gfg":
        return theme.palette.secondary.main;
      case "hackerrank":
        return theme.palette.success.main;
      case "codeforces":
        return theme.palette.warning.main;
      case "codechef":
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return theme.palette.success.main;
      case "medium":
        return theme.palette.warning.main;
      case "hard":
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const renderLoadingSkeleton = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader
            avatar={<Skeleton variant="circular" width={40} height={40} />}
            title={<Skeleton variant="text" width={150} height={20} />}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={100} height={20} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {[...Array(3)].map((_, i) => (
                <Box key={i} sx={{ flexGrow: 1 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" width={80} height={20} />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <Tabs 
              value={selectedPlatform} 
              onChange={(_, value) => setSelectedPlatform(value)}
              sx={{ mb: 2 }}
            >
              {platforms.map(platform => (
                <Tab 
                  key={platform.name} 
                  value={platform.name} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          mr: 1, 
                          bgcolor: getPlatformColor(platform.name),
                          width: 24,
                          height: 24,
                          fontSize: '0.875rem'
                        }}
                      >
                        {platform.name.charAt(0).toUpperCase()}
                      </Avatar>
                      {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
                    </Box>
                  }
                />
              ))}
            </Tabs>

            {platforms.map(platform => {
              if (platform.name !== selectedPlatform) return null;

              if (platform.error) {
                return (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {platform.error}
                      <Button
                        size="small"
                        onClick={() => fetchPlatformStats(platform)}
                        sx={{ ml: 2 }}
                      >
                        Retry
                      </Button>
                    </Alert>
                  </Box>
                );
              }

              if (platform.loading || isFetching) {
                return renderLoadingSkeleton();
              }

              if (!platform.stats) {
                return null;
              }

              return (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 12px -2px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.06)'
                          }
                        }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar 
                              sx={{ bgcolor: getPlatformColor(platform.name) }}
                              aria-label="Platform Stats"
                            >
                              {platform.name.charAt(0).toUpperCase()}
                            </Avatar>
                          }
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="h6">{platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}</Typography>
                              <Tooltip title="View Profile">
                                <IconButton 
                                  size="small" 
                                  component="a" 
                                  href={platform.stats.profile_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <LinkIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          }
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h5" color="primary">
                                {platform.stats.total_solved}
                              </Typography>
                              <Chip
                                label="Total Solved"
                                color="primary"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                                <Typography variant="h6" color={getDifficultyColor("easy")}>
                                  {platform.stats.easy_solved}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Easy
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                                <Typography variant="h6" color={getDifficultyColor("medium")}>
                                  {platform.stats.medium_solved}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Medium
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                                <Typography variant="h6" color={getDifficultyColor("hard")}>
                                  {platform.stats.hard_solved}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Hard
                                </Typography>
                              </Box>
                            </Box>
                            {platform.stats.ranking && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                                <Typography variant="body1" color="success.main">
                                  Rank #{platform.stats.ranking}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
