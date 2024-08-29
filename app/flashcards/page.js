// File: /app/flashcards/page.js

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3F51B5',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const cardColors = ['#FFB74D', '#81C784', '#64B5F6', '#E57373', '#BA68C8', '#4DB6AC'];

export default function FlashcardsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const collections = docSnap.data().flashcards || [];
          setFlashcardSets(collections);
        }
      } catch (error) {
        console.error('Error fetching flashcard sets:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && isSignedIn) {
      getFlashcardSets();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Flashcard Sets
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/generate"
            sx={{ mb: 3 }}
          >
            Create New Flashcard Set
          </Button>
          <Grid container spacing={3}>
            {flashcardSets.map((set, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Link href={`/flashcards/${encodeURIComponent(set.name)}`} passHref style={{ textDecoration: 'none' }}>
                  <StyledCard sx={{ bgcolor: cardColors[index % cardColors.length] }}>
                    <CardActionArea sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                          {set.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Click to view flashcards
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </StyledCard>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}