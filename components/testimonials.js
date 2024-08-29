import React from 'react';
import { Box, Typography, Avatar, Grid } from '@mui/material';

const testimonials = [
  {
    name: 'Jane Doe',
    feedback: 'SnapCards has transformed the way I study. The AI-generated flashcards are a game changer!',
    avatar: '/images/avatar1.jpg', // Replace with actual image paths
  },
  {
    name: 'John Smith',
    feedback: 'The spaced repetition feature is amazing. My retention has improved drastically.',
    avatar: '/images/avatar2.jpg',
  },
  {
    name: 'Emily Johnson',
    feedback: 'I love being able to access my flashcards on any device. Super convenient!',
    avatar: '/images/avatar3.jpg',
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        What Our Users Say
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box
              sx={{
                borderRadius: '12px',
                p: 3,
                bgcolor: 'background.paper',
                boxShadow: 3,
                textAlign: 'center',
              }}
            >
              <Avatar alt={testimonial.name} src={testimonial.avatar} sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom>
                {testimonial.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testimonial.feedback}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
