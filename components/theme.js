'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007AFF', // A refined blue similar to Apple's color scheme
    },
    secondary: {
      main: '#FF9500', // Vibrant orange for accents
    },
    background: {
      default: '#FFFFFF', // Clean white background
      paper: '#F7F7F8', // Slightly off-white for cards and paper
    },
    text: {
      primary: '#333333', // Dark text for good readability
      secondary: '#8E8E93', // Subtle secondary text
    },
  },
  typography: {
    fontFamily: '"San Francisco", "Roboto", "Helvetica", "Arial", sans-serif', // Apple's system font
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem', // Larger font size for h1
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem', // Slightly larger font size for h4
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners for a modern look
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '12px 24px',
          borderRadius: 20,
          fontWeight: 500,
          fontSize: '0.875rem',
          boxShadow: 'none',
          transition: 'background-color 0.3s ease, transform 0.3s ease',
          '&:hover': {
            backgroundColor: '#0051A2', // Slightly darker blue on hover
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
  },
});

export default theme;
