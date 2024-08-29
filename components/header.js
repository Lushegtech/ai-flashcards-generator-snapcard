// components/Header.js
'use client'; // Ensure this is a client-side component

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/nextjs';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SnapCards
          </Typography>
          <div>
            <SignedOut>
              <Link href="/sign-in" passHref>
                <Button color="inherit">Sign In</Button>
              </Link>
              <Link href="/sign-up" passHref>
                <Button color="inherit">Sign Up</Button>
              </Link>
            </SignedOut>

            <SignedIn>
              <Button color="inherit" onClick={handleMenuOpen}>
                <UserButton />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'user-menu-button',
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <SignOutButton>Sign Out</SignOutButton>
                </MenuItem>
              </Menu>
            </SignedIn>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
