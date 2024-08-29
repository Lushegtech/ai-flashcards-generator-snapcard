'use client'; // Ensure this is a client-side component

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, SignInButton, SignUpButton, SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Typography, Button, Box, Grid, useTheme, useMediaQuery, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import SubscriptionCard from '../components/subscriptionCard';
import Testimonials from '../components/testimonials';
import ComparisonTable from '../components/comparisonTable';

// Create a dark theme with gradients and custom colors
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3F51B5',
    },
    secondary: {
      main: '#FF4081',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 'bold',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  },
});

export default function Home() {
  const { user } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const subscriptionPlans = [
    {
      planName: 'Free',
      price: '$0/month',
      features: ['10 AI-generated flashcards per month', 'Basic AI features', 'Community support'],
      link: '/sign-up?plan=free',
    },
    {
      planName: 'Pro',
      price: '$15/month',
      features: ['Unlimited flashcards', 'Advanced AI features', 'Priority email support'],
      link: '/sign-up?plan=pro',
    },
    {
      planName: 'Enterprise',
      price: 'Contact us',
      features: ['Custom solutions', 'Team collaboration', 'Dedicated support'],
      link: '/contact',
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          textAlign: 'center',
          my: 4,
          position: 'relative',
          zIndex: 1,
          padding: isMobile ? '0 8px' : '0 16px',
          color: 'text.primary',
          background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <IconButton
          onClick={() => router.back()}
          sx={{ position: 'absolute', top: 16, left: 16, color: 'text.primary' }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to SnapCards
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: '300' }}>
          Supercharge your learning with AI-generated flashcards
        </Typography>

        <Box sx={{ mt: 2 }}>
          <SignedIn>
            <SignOutButton>
              <Button variant="contained" color="primary" sx={{ mt: 1, px: 4 }}>
                Sign Out
              </Button>
            </SignOutButton>
            <Link href="/generate" passHref>
              <Button variant="contained" color="primary" sx={{ ml: 2, mt: 1, px: 4 }}>
                Create Flashcards
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignUpButton mode="modal">
              <Button variant="contained" color="primary" sx={{ mr: 2, mt: 1, px: 4 }}>
                Get Started
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outlined" color="primary" sx={{ mt: 1, px: 4 }}>
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </Box>

        <SignedOut>
          <Box component="section" sx={{ my: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Choose Your Plan
            </Typography>
            <Grid container spacing={4}>
              {subscriptionPlans.map((plan, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <SubscriptionCard
                    planName={plan.planName}
                    price={plan.price}
                    features={plan.features}
                    link={plan.link}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </SignedOut>

        {/* Add the testimonials section */}
        <Testimonials />

        {/* Add the comparison table */}
        <ComparisonTable />

      </Box>
    </ThemeProvider>
  );
}
