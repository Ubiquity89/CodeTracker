import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Alert } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      // For demo purposes, using a test account
      await signInWithEmailAndPassword(auth, 'test@example.com', 'testpass123');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Welcome Back!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to continue to your dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ width: '100%', mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
              For demo purposes:
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
              Email: test@example.com<br />
              Password: testpass123
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Button
              fullWidth
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
