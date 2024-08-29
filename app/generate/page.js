'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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

const SelectedCardBox = styled(Box)(({ theme, index }) => ({
  width: '100%',
  maxWidth: '600px',
  height: '300px',
  margin: '20px auto',
  perspective: '1000px',
  '& .card-inner': {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
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

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to generate flashcards');
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      alert('An error occurred while generating flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    try {
      const batch = writeBatch(db);
      const userDocRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        if (collections.find((f) => f.name === name)) {
          alert('Flashcard collection with the same name already exists.');
          return;
        } else {
          collections.push({ name });
          batch.set(userDocRef, { flashcards: collections }, { merge: true });
        }
      } else {
        batch.set(userDocRef, { flashcards: [{ name }] });
      }

      const colRef = collection(db, 'users', user.id, 'flashcards');
      flashcards.forEach((flashcard) => {
        const cardDocRef = doc(colRef);
        batch.set(cardDocRef, flashcard);
      });

      await batch.commit();
      handleClose();
      router.push('/flashcards');
    } catch (error) {
      alert('An error occurred while saving flashcards.');
    }
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : prev));
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
          >
            {loading ? 'Generating...' : 'Generate Flashcards'}
          </Button>
        </Box>

        {/* Display Generated Flashcards */}
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcards
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

        {/* Selected Flashcard Display */}
        {flashcards.length > 0 && (
          <SelectedCardBox index={currentCardIndex}>
            <div className="card-inner">
              <div className="card-front">
                <Typography variant="h5">
                  {flashcards[currentCardIndex]?.front || 'No Flashcard Selected'}
                </Typography>
              </div>
              <div className="card-back">
                <Typography variant="h5">
                  {flashcards[currentCardIndex]?.back || 'No Flashcard Selected'}
                </Typography>
              </div>
            </div>
          </SelectedCardBox>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handlePreviousCard} disabled={currentCardIndex === 0}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="subtitle1">
            {`${currentCardIndex + 1} / ${flashcards.length}`}
          </Typography>
          <IconButton onClick={handleNextCard} disabled={currentCardIndex === flashcards.length - 1}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        <Button variant="outlined" color="primary" onClick={handleOpen}>
          Save Flashcards
        </Button>
      </Container>

      {/* Save Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flashcard Information Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Flashcard Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Here you can see detailed information about the selected flashcard.
          </DialogContentText>
          <Typography variant="h6" component="p">
            Front: {flashcards[currentCardIndex]?.front || 'No Flashcard Selected'}
          </Typography>
          <Typography variant="h6" component="p">
            Back: {flashcards[currentCardIndex]?.back || 'No Flashcard Selected'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
