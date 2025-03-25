import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  leetcode: string;
  gfg: string;
  hackerrank: string;
  codeforces: string;
  codechef: string;
}

function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    leetcode: '',
    gfg: '',
    hackerrank: '',
    codeforces: '',
    codechef: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.leetcode) {
      setError('Please fill in your name and LeetCode username');
      return;
    }
    
    // Save the form data to localStorage
    localStorage.setItem('codingProfile', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md">
      <Paper
        sx={{
          p: 4,
          mt: 8,
          borderRadius: 2,
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(30, 41, 59, 0.85)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            Connect Your Coding Profiles
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LeetCode Username"
                  name="leetcode"
                  value={formData.leetcode}
                  onChange={handleChange}
                  required
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="GeeksforGeeks Username"
                  name="gfg"
                  value={formData.gfg}
                  onChange={handleChange}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="HackerRank Username"
                  name="hackerrank"
                  value={formData.hackerrank}
                  onChange={handleChange}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Codeforces Username"
                  name="codeforces"
                  value={formData.codeforces}
                  onChange={handleChange}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CodeChef Username"
                  name="codechef"
                  value={formData.codechef}
                  onChange={handleChange}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  {loading ? 'Connecting...' : 'Connect Profiles'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </motion.div>
      </Paper>
    </Container>
  );
}

export default Onboarding;
