import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface Platform {
  name: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  recentSubmissions: { date: string; count: number }[];
}

const mockData: Record<string, Platform> = {
  leetcode: {
    name: 'LeetCode',
    totalSolved: 325,
    easySolved: 150,
    mediumSolved: 125,
    hardSolved: 50,
    ranking: 15243,
    recentSubmissions: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      count: Math.floor(Math.random() * 10),
    })).reverse(),
  },
  codeforces: {
    name: 'CodeForces',
    totalSolved: 245,
    easySolved: 100,
    mediumSolved: 95,
    hardSolved: 50,
    ranking: 8654,
    recentSubmissions: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      count: Math.floor(Math.random() * 10),
    })).reverse(),
  },
  codechef: {
    name: 'CodeChef',
    totalSolved: 178,
    easySolved: 80,
    mediumSolved: 68,
    hardSolved: 30,
    ranking: 12543,
    recentSubmissions: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      count: Math.floor(Math.random() * 10),
    })).reverse(),
  },
};

export const Dashboard = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('leetcode');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlePlatformChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPlatform: string
  ) => {
    if (newPlatform !== null) {
      setSelectedPlatform(newPlatform);
    }
  };

  const platform = mockData[selectedPlatform];

  const chartData = {
    labels: platform.recentSubmissions.map((s) => s.date),
    datasets: [
      {
        label: 'Problems Solved',
        data: platform.recentSubmissions.map((s) => s.count),
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile menu button */}
      <IconButton
        color="inherit"
        edge="start"
        onClick={() => setMobileOpen(!mobileOpen)}
        sx={{ position: 'fixed', top: 16, left: 16, display: { sm: 'none' } }}
      >
        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Main content */}
      <Container maxWidth="xl" sx={{ py: 4, mt: { xs: 8, sm: 4 } }}>
        <Grid container spacing={3}>
          {/* Platform selector */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <ToggleButtonGroup
                  value={selectedPlatform}
                  exclusive
                  onChange={handlePlatformChange}
                  aria-label="coding platform"
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  {Object.keys(mockData).map((platform) => (
                    <ToggleButton
                      key={platform}
                      value={platform}
                      sx={{
                        flex: { xs: '1 1 auto', sm: '0 1 auto' },
                        textTransform: 'capitalize',
                      }}
                    >
                      {mockData[platform].name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </CardContent>
            </Card>
          </Grid>

          {/* Stats summary */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Problems Solved
                  </Typography>
                  <Typography variant="h3" color="primary" gutterBottom>
                    {platform.totalSolved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ranking: #{platform.ranking}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Difficulty Breakdown
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="h6" color="success.main">
                          {platform.easySolved}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Easy
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6" color="warning.main">
                          {platform.mediumSolved}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Medium
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h6" color="error.main">
                          {platform.hardSolved}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hard
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Progress chart */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Achievement progress */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Achievement Progress
                  </Typography>
                  <Grid container spacing={3}>
                    {[
                      { name: 'Problem Solver', progress: 65 },
                      { name: 'Consistency King', progress: 80 },
                      { name: 'Hard Mode', progress: 45 },
                    ].map((achievement) => (
                      <Grid item xs={12} sm={4} key={achievement.name}>
                        <Tooltip title={`${achievement.progress}% Complete`}>
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              {achievement.name}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={achievement.progress}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
