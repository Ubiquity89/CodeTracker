import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Paper,
  Grid,
  CssBaseline,
} from '@mui/material';
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: darkMode ? "#000000" : "#ffffff",
        color: darkMode ? "#f8fafc" : "#0f172a",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          bgcolor: darkMode ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderBottom: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: darkMode ? "#f8fafc" : "#0f172a",
              }}
            >
              Code<span style={{ color: "#dc2626", fontWeight: 800 }}>Cracker</span>
            </Typography>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{ color: darkMode ? "#f8fafc" : "#0f172a" }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 6, md: 10 },
          bgcolor: darkMode ? "#000000" : "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Animations */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "20%",
                left: "-10%",
                width: "120%",
                height: "120%",
                background: `radial-gradient(circle at 50% 50%, ${darkMode ? "rgba(255, 44, 44, 0.1)" : "rgba(220, 38, 38, 0.1)"} 0%, transparent 70%)`,
                borderRadius: "50%",
                filter: "blur(100px)",
              }}
            />
          </motion.div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: "-20%",
                right: "-10%",
                width: "120%",
                height: "120%",
                background: `radial-gradient(circle at 50% 50%, ${darkMode ? "rgba(255, 44, 44, 0.1)" : "rgba(220, 38, 38, 0.1)"} 0%, transparent 70%)`,
                borderRadius: "50%",
                filter: "blur(100px)",
              }}
            />
          </motion.div>
        </Box>

        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: darkMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)",
              borderRadius: { xs: 0, md: 2 },
              boxShadow: { xs: "none", md: darkMode ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)" },
              p: { xs: 0, md: 4 },
              overflow: "hidden",
              transition: "box-shadow 0.3s ease",
              '&:hover': {
                boxShadow: darkMode ? "0 8px 16px rgba(0, 0, 0, 0.4)" : "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Grid container spacing={0}>
              {/* Content Section */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    height: { xs: "auto", md: "100%" }
                  }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Typography
                        variant="h1"
                        component="h1"
                        gutterBottom
                        sx={{
                          fontSize: { xs: "2.5rem", md: "3.5rem" },
                          fontWeight: 600,
                          mb: 2,
                          color: darkMode ? "#f8fafc" : "#0f172a",
                          textAlign: "center",
                        }}
                      >
                        Track Your <span style={{ color: "#dc2626" }}>Coding</span> Journey
                      </Typography>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{
                          fontSize: { xs: "1.25rem", md: "1.5rem" },
                          fontWeight: 300,
                          mb: 2,
                          color: darkMode ? "#94a3b8" : "#475569",
                          textAlign: "center",
                        }}
                      >
                        Monitor your progress across LeetCode, GeeksForGeeks, CodeForces, and CodeChef in one interactive dashboard. 
                        Get insights into your strengths, weaknesses, and growth over time.
                      </Typography>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleGetStarted}
                          sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            bgcolor: "#dc2626",
                            color: "#ffffff",
                            '&:hover': {
                              bgcolor: "#991b1b",
                            },
                            textTransform: "none",
                          }}
                        >
                          Get Started
                        </Button>
                      </Box>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>

              {/* Image Section */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: 350, md: "100%" },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 2,
                      mt: { xs: 4, md: 0 }
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <Box
                        component="img"
                        src="/images/image-removebg-preview (1).png"
                        alt="Girl Coding Illustration"
                        sx={{
                          width: { xs: "90%", md: "100%" },
                          height: "auto",
                          objectFit: "contain",
                          filter: darkMode ? "brightness(0.9)" : "brightness(1.1)",
                        }}
                      />
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          {/* Floating Elements */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "10%",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: darkMode ? "rgba(255, 44, 44, 0.1)" : "rgba(220, 38, 38, 0.1)",
                  borderRadius: "50%",
                }}
              />
            </motion.div>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: "10%",
              right: "10%",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: darkMode ? "rgba(255, 44, 44, 0.1)" : "rgba(220, 38, 38, 0.1)",
                  borderRadius: "50%",
                }}
              />
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          bgcolor: darkMode ? "#000000" : "#ffffff",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            sx={{
              mb: 6,
              textAlign: "center",
              color: darkMode ? "#f8fafc" : "#0f172a",
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Connect",
                description: "Link your coding platform accounts seamlessly",
                number: 1,
                color: "#dc2626",
              },
              {
                title: "Track",
                description: "Monitor your progress with beautiful visualizations",
                number: 2,
                color: "#dc2626",
              },
              {
                title: "Improve",
                description: "Get personalized recommendations to boost your skills",
                number: 3,
                color: "#dc2626",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      bgcolor: darkMode ? "#000000" : "#ffffff",
                      position: "relative",
                      overflow: "hidden",
                      '&:before': {
                        content: "''",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, 
                          rgba(220, 38, 38, 0.1) 0%,
                          rgba(220, 38, 38, 0) 100%
                        )`,
                        zIndex: 0,
                      },
                      '&:after': {
                        content: "''",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(45deg, 
                          rgba(220, 38, 38, 0.1) 0%,
                          rgba(220, 38, 38, 0) 100%
                        )`,
                        zIndex: 0,
                      },
                      '&:hover': {
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease",
                      },
                      '& > *': {
                        position: "relative",
                        zIndex: 1,
                      },
                      boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1),
                                0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        bgcolor: feature.color,
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        fontSize: "2rem",
                        fontWeight: 700,
                        position: "relative",
                        overflow: "hidden",
                        transformStyle: "preserve-3d",
                        transition: "all 0.3s ease",
                        '&:before': {
                          content: "''",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.2) 0%,
                            rgba(255, 255, 255, 0) 100%
                          )`,
                          transform: "rotate(45deg)",
                          zIndex: 0,
                        },
                        '&:after': {
                          content: "''",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(45deg, 
                            rgba(0, 0, 0, 0.2) 0%,
                            rgba(0, 0, 0, 0) 100%
                          )`,
                          transform: "rotate(45deg)",
                          zIndex: 0,
                        },
                        '&:hover': {
                          transform: "translateZ(10px) rotateX(10deg) rotateY(10deg)",
                          boxShadow: `0 10px 20px rgba(0, 0, 0, 0.2),
                                    inset 0 0 10px rgba(255, 255, 255, 0.3)`,
                        },
                        '& > span': {
                          position: "relative",
                          zIndex: 1,
                          textShadow: `2px 2px 4px rgba(0, 0, 0, 0.3),
                                    -2px -2px 4px rgba(255, 255, 255, 0.2)`,
                          transform: "translateZ(0) rotateX(6deg) rotateY(6deg)",
                          transition: "transform 0.3s ease",
                          '&:hover': {
                            transform: "translateZ(0) rotateX(12deg) rotateY(12deg)",
                          },
                        },
                      }}
                    >
                      <span>{feature.number}</span>
                    </Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: darkMode ? "#f8fafc" : "#0f172a",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color={darkMode ? "#94a3b8" : "#475569"}
                      sx={{ mb: 2 }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;
