import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import { Dashboard as DashboardIcon, Assessment, EmojiEvents, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export const NavigationDrawer = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Progress', icon: <Assessment />, path: '/progress' },
    { text: 'Achievements', icon: <EmojiEvents />, path: '/achievements' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: '64px', // Height of AppBar
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: 'none',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
      </Box>
    </Drawer>
  );
};
