'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const cardColors = ['#FFB74D', '#81C784', '#64B5F6', '#E57373', '#BA68C8', '#4DB6AC'];

const Flashcard = styled(Box)(({ theme, flipped, index }) => ({
  width: '100%',
  height: '200px',
  perspective: '1000px',
  cursor: 'pointer',
  '& .card-inner': {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  },
  '& .card-front, & .card-back': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: cardColors[index % cardColors.length],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows[3],
  },
  '& .card-back': {
    transform: 'rotateY(180deg)',
  },
}));

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

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (isSignedIn) {
        try {
          const colRef = collection(db, 'users', user.id, 'flashcards');
          const snapshot = await getDocs(colRef);
          const cards = snapshot.docs.map((doc) => doc.data());
          setFlashcards(cards);
        } catch (error) {
          alert('An error occurred while fetching flashcards.');
        }
      }
    };

    fetchFlashcards();
  }, [isSignedIn, user?.id]);

  const handleCardClick = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Flashcards
          </Typography>

          {/* Display Flashcards */}
          {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Your Flashcards
              </Typography>
              <Grid container spacing={2}>
                {flashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Flashcard
                      onClick={() => handleCardClick(index)}
                      flipped={flipped[index]}
                      index={index}
                    >
                      <div className="card-inner">
                        <div className="card-front">
                          <Typography variant="h6">
                            {flashcard.front}
                          </Typography>
                        </div>
                        <div className="card-back">
                          <Typography variant="h6">
                            {flashcard.back}
                          </Typography>
                        </div>
                      </div>
                    </Flashcard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
