// src/components/layout/Layout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: '#FAFBFC', 
        width: '100%',
        maxWidth: '100vw', 
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* 🧭 Sidebar on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <Box 
        sx={{ 
          flex: 1,
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          width: { xs: '100%', md: 'calc(100% - 280px)' }, 
          minWidth: 0, 
          overflowX: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <Navbar />
        
        <Box 
          component="main" 
          sx={{ 
            flex: 1,
            flexGrow: 1, 
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2, sm: 2.5, md: 3, lg: 3.5 }, 
            mt: { xs: '64px', sm: '72px' }, // Offset for fixed Navbar
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
        >
          {children}
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}
