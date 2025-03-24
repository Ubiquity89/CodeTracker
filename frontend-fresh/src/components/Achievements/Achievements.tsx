import { Box, Container, Grid, Paper, Typography, LinearProgress, Tooltip } from '@mui/material';
import { EmojiEvents, Grade, Speed, Whatshot } from '@mui/icons-material';
import { Header } from '../Header/Header';
import { NavigationDrawer } from '../Drawer/NavigationDrawer';
import { usePlatformData } from '../../hooks/usePlatformData';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export const Achievements = () => {
  const { data: platformData } = usePlatformData();
  const totalSolved = platformData?.totalSolved || 0;

  const achievements: Achievement[] = [
    {
      id: 'beginner',
      title: 'Getting Started',
      description: 'Solve your first 10 problems',
      icon: <EmojiEvents color="primary" />,
      progress: Math.min(totalSolved, 10),
      maxProgress: 10,
      unlocked: totalSolved >= 10,
    },
    {
      id: 'intermediate',
      title: 'Rising Star',
      description: 'Solve 50 problems',
      icon: <Grade color="primary" />,
      progress: Math.min(totalSolved, 50),
      maxProgress: 50,
      unlocked: totalSolved >= 50,
    },
    {
      id: 'advanced',
      title: 'Problem Solver',
      description: 'Solve 100 problems',
      icon: <Speed color="primary" />,
      progress: Math.min(totalSolved, 100),
      maxProgress: 100,
      unlocked: totalSolved >= 100,
    },
    {
      id: 'expert',
      title: 'Code Master',
      description: 'Solve 500 problems',
      icon: <Whatshot color="primary" />,
      progress: Math.min(totalSolved, 500),
      maxProgress: 500,
      unlocked: totalSolved >= 500,
    },
  ];

  return (
    <Box>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <NavigationDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Achievements
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Track your milestones and earn badges as you progress
            </Typography>

            <Grid container spacing={3}>
              {achievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      background: achievement.unlocked
                        ? 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(255,255,255,0.1) 100%)'
                        : undefined,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        p: 1,
                        opacity: achievement.unlocked ? 1 : 0.3,
                      }}
                    >
                      {achievement.icon}
                    </Box>

                    <Typography variant="h6" gutterBottom>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {achievement.description}
                    </Typography>

                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {achievement.progress} / {achievement.maxProgress}
                        </Typography>
                      </Box>
                      <Tooltip title={`${Math.round((achievement.progress / achievement.maxProgress) * 100)}%`}>
                        <LinearProgress
                          variant="determinate"
                          value={(achievement.progress / achievement.maxProgress) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
