import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./components/LandingPage/LandingPage";
import Dashboard from "./components/Dashboard/Dashboard";
import { Achievements } from "./components/Achievements/Achievements";
import Onboarding from './components/Onboarding/Onboarding';
import { Box } from '@mui/material';

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
  },
});

const queryClient = new QueryClient();

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (hasError) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        <h1>Something went wrong</h1>
        {error && <p>{error}</p>}
        <button
          onClick={() => {
            setHasError(false);
            setError(null);
          }}
          style={{ padding: '8px 16px', backgroundColor: '#4338ca', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Try again
        </button>
      </Box>
    );
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/achievements" element={<Achievements />} />
              </Routes>
            </Router>
          </Box>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
