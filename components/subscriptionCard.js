import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const SubscriptionCard = ({ planName, price, features, link }) => {
  // Remove this file if not needed or repurpose to highlight "Premium" features.
  return (
    <Box
      sx={{
        border: '1px solid #ffffff22',
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
        background: '#1e1e1e',
      }}
    >
      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
        {planName}
      </Typography>
      <Typography variant="h6" sx={{ marginTop: '8px' }}>
        {price}
      </Typography>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {features.map((feature, index) => (
          <li key={index}>
            <Typography variant="body1" sx={{ margin: '8px 0' }}>
              {feature}
            </Typography>
          </li>
        ))}
      </ul>
      <Button variant="contained" color="secondary" href={link} sx={{ marginTop: '16px' }}>
        {planName === 'Premium' ? 'Get Premium' : 'Learn More'}
      </Button>
    </Box>
  );
};

export default SubscriptionCard;
