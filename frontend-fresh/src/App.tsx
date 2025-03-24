import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./components/LandingPage/LandingPage";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { Achievements } from "./components/Achievements/Achievements";
import Onboarding from './components/Onboarding/Onboarding';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4338ca",
      light: "#6366f1",
      dark: "#3730a3",
    },
    secondary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#000000",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontFamily: "Oswald, sans-serif",
      fontWeight: 600,
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: "Oswald, sans-serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "Oswald, sans-serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Oswald, sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "Oswald, sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "Oswald, sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 300,
    },
    body2: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 300,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          backgroundColor: "#4338ca",
          '&:hover': {
            backgroundColor: "#3730a3",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(30, 41, 59, 0.85)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#f8fafc",
        },
      },
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
