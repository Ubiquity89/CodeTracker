import { Grid, Paper, Typography, Box } from '@mui/material';
import { TrendingUp, EmojiEvents, Timer, Grade } from '@mui/icons-material';

interface StatsSummaryProps {
  totalSolved: number;
}

export const StatsSummary = ({ totalSolved }: StatsSummaryProps) => {
  const stats = [
    {
      title: 'Total Problems',
      value: totalSolved.toString(),
      change: 'Across all platforms',
      icon: <TrendingUp color="primary" />,
    },
    {
      title: 'Current Streak',
      value: '15 days',
      change: 'Best: 30 days',
      icon: <Timer color="primary" />,
    },
    {
      title: 'Achievements',
      value: '28',
      change: '2 new unlocked',
      icon: <EmojiEvents color="primary" />,
    },
    {
      title: 'Global Rank',
      value: '#1,234',
      change: 'Top 5%',
      icon: <Grade color="primary" />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {stat.icon}
            <Box>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
              <Typography variant="h6">{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.change}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
