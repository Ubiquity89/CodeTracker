import { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { Header } from '../Header/Header';
import { NavigationDrawer } from '../Drawer/NavigationDrawer';

interface PlatformIds {
  leetcode?: string;
  codeforces?: string;
  hackerrank?: string;
}

export const Profile = () => {
  const [platformIds, setPlatformIds] = useState<PlatformIds>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        const userData = userDoc.data();
        setPlatformIds(userData?.platformIds || {});
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        platformIds,
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to save profile data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <NavigationDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Container maxWidth="md">
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Profile Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Enter your usernames for different coding platforms to track your progress
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Profile updated successfully
                </Alert>
              )}

              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="LeetCode Username"
                  value={platformIds.leetcode || ''}
                  onChange={(e) => setPlatformIds(prev => ({ ...prev, leetcode: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="CodeForces Handle"
                  value={platformIds.codeforces || ''}
                  onChange={(e) => setPlatformIds(prev => ({ ...prev, codeforces: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="HackerRank Username"
                  value={platformIds.hackerrank || ''}
                  onChange={(e) => setPlatformIds(prev => ({ ...prev, hackerrank: e.target.value }))}
                  fullWidth
                />

                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ mt: 2 }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
