'use client';

import { AppBar, Toolbar, Typography, Button as MuiButton, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Menu as MenuIcon, Person, ExitToApp } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      className={cn(
        'bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-600',
        'shadow-lg backdrop-blur-sm'
      )}
    >
      <Toolbar className="container mx-auto px-4 py-2">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Typography variant="h6" className="text-white font-bold text-sm">
                LC
              </Typography>
            </div>
            <Typography variant="h6" className="text-white font-bold text-xl">
              LifeConnect
            </Typography>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-white/90 hover:text-white transition-colors font-medium">
            About
          </Link>
          <Link href="/services" className="text-white/90 hover:text-white transition-colors font-medium">
            Services
          </Link>
          <Link href="/contact" className="text-white/90 hover:text-white transition-colors font-medium">
            Contact
          </Link>
          
          <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-white/30">
            <Link href="/login">
              <MuiButton
                variant="outlined"
                className={cn(
                  'text-white border-white/50 hover:border-white',
                  'hover:bg-white/10 transition-all duration-200 font-medium'
                )}
              >
                Login
              </MuiButton>
            </Link>
            <Link href="/register">
              <MuiButton
                variant="contained"
                className={cn(
                  'bg-white text-primary-600 hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5',
                  'transition-all duration-200 font-medium'
                )}
              >
                Sign Up
              </MuiButton>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
            className="text-white"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            className="mt-2"
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              className: 'rounded-xl shadow-large border border-gray-100'
            }}
          >
            <MenuItem onClick={handleClose} className="hover:bg-gray-50">
              <Link href="/about" className="w-full text-gray-700">About</Link>
            </MenuItem>
            <MenuItem onClick={handleClose} className="hover:bg-gray-50">
              <Link href="/services" className="w-full text-gray-700">Services</Link>
            </MenuItem>
            <MenuItem onClick={handleClose} className="hover:bg-gray-50">
              <Link href="/contact" className="w-full text-gray-700">Contact</Link>
            </MenuItem>
            <div className="border-t border-gray-100 my-2"></div>
            <MenuItem onClick={handleClose} className="hover:bg-gray-50">
              <Link href="/login" className="w-full text-gray-700">Login</Link>
            </MenuItem>
            <MenuItem onClick={handleClose} className="hover:bg-gray-50">
              <Link href="/register" className="w-full text-gray-700">Sign Up</Link>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}