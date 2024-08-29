'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAuth,
  SignInButton,
  SignUpButton,
  SignOutButton,
  SignedIn,
  SignedOut
} from '@clerk/nextjs';
import {
  ThemeProvider,
  createTheme
} from '@mui/material/styles';
import {
  CssBaseline,
  Typography,
  Button,
  Box,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Container,
  CircularProgress,
  Grow,
  Fade
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Lightbulb, Timer, Sync } from '@mui/icons-material';
import Link from 'next/link';
import { keyframes } from '@mui/system';

// Custom hook for theme toggle
function useThemeToggle() {
  const [mode, setMode] = useState('dark');

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  return [mode, toggleTheme];
}

// Create a theme with gradients and custom colors
const createAppTheme = mode => createTheme({
  palette: {
    mode,
    primary: { main: '#3F51B5' },
    secondary: { main: '#F50057' },
    background: {
      default: mode === 'dark' ? '#121212' : '#F5F5F5',
      paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF'
    },
    text: { primary: mode === 'dark' ? '#FFFFFF' : '#000000' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: '20px' }
      }
    }
  }
});

// Custom Button component
const CustomButton = React.forwardRef(({ children, ...props }, ref) => (
  <Button
    ref={ref}
    sx={{
      borderRadius: '20px',
      textTransform: 'none',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.15s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)'
      }
    }}
    {...props}
  >
    {children}
  </Button>
));

CustomButton.displayName = 'CustomButton';

// Background animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function Home() {
  const { user } = useAuth();
  const [mode, toggleTheme] = useThemeToggle();
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: 'AI-Powered Generation',
      description: 'Create flashcards instantly from any text using advanced AI',
      icon: Lightbulb
    },
    {
      title: 'Smart Study Sessions',
      description: 'Optimize your learning with spaced repetition algorithms',
      icon: Timer
    },
    {
      title: 'Sync Across Devices',
      description: 'Access your flashcards anywhere, anytime',
      icon: Sync
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          component="main"
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            padding: isMobile ? '24px 16px' : '48px 32px',
            color: 'text.primary',
            background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 50%, #1e1e1e 100%)',
            backgroundSize: '400% 400%',
            animation: `${gradientAnimation} 15s ease infinite`,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <Grow in timeout={1000}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Welcome to SnapCards
            </Typography>
          </Grow>

          <Fade in timeout={1500}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: '300', mb: 4 }}
            >
              Supercharge your learning with AI-generated flashcards
            </Typography>
          </Fade>

          <Box sx={{ mt: 4, mb: 6 }}>
            <SignedIn>
              <SignOutButton>
                <CustomButton
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, px: 4, py: 1.5 }}
                >
                  Sign Out
                </CustomButton>
              </SignOutButton>
              <Link href="/generate" passHref>
                <CustomButton
                  variant="contained"
                  color="secondary"
                  sx={{ ml: 3, mt: 2, px: 4, py: 1.5 }}
                >
                  Create Flashcards
                </CustomButton>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignUpButton mode="modal">
                <CustomButton
                  variant="contained"
                  color="primary"
                  sx={{ mr: 3, mt: 2, px: 4, py: 1.5 }}
                >
                  Get Started
                </CustomButton>
              </SignUpButton>
              <SignInButton mode="modal">
                <CustomButton
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2, px: 4, py: 1.5 }}
                >
                  Sign In
                </CustomButton>
              </SignInButton>
            </SignedOut>
          </Box>

          <Box component="section" sx={{ my: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 5 }}
            >
              Features
            </Typography>
            <Grid container spacing={6}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Grow in timeout={1000 * (index + 1)}>
                    <Box
                      sx={{
                        borderRadius: '16px',
                        p: 4,
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'scale(1.05)',
                          bgcolor: 'primary.dark'
                        }
                      }}
                    >
                      <feature.icon
                        sx={{ fontSize: 48, mb: 3, color: 'primary.main' }}
                      />
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{ mb: 2 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Fade in={true} timeout={2000}>
            <Container component="section" maxWidth="sm" sx={{
              my: 8,
              py: 5,
              px: 4,
              bgcolor: 'background.paper',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.05)',
              },
            }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Go Premium
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                Unlock exclusive features and take your learning to the next level.
              </Typography>
              <CustomButton 
                variant="contained" 
                color="secondary" 
                startIcon={<StarIcon sx={{ color: 'gold' }} />} 
                sx={{ mt: 3, px: 5, py: 1.5 }}
              >
                Get Premium
              </CustomButton>
            </Container>
          </Fade>

          <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
            <IconButton onClick={toggleTheme} color="inherit" sx={{ p: 1.5 }}>
              {mode === 'dark' ? '🌙' : '☀️'}
            </IconButton>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}