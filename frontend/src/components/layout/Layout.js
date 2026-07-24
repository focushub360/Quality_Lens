// src/components/layout/Layout.jsx
import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFBFC', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* 🚀 Sidebar on the left */}
      <Sidebar />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { sm: `calc(100% - 280px)` }, minWidth: 0, overflowX: 'hidden' }}>
        <Navbar />
        
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 1.5, sm: 2, md: 2.5 }, 
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