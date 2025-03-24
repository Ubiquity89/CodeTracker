import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    platformId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 2,
          mt: 8,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome to Coding Progress Dashboard
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Platform ID (any ID)"
                name="platformId"
                value={formData.platformId}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#dc2626',
                  '&:hover': { bgcolor: '#991b1b' },
                }}
              >
                Continue to Dashboard
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default Onboarding;
