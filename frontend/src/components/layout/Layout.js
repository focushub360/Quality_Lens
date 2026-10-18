import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import TechLuxuryLayout from './TechLuxuryLayout';
import { useAuth } from '../../contexts/AuthContext';
import { isProTechExperience } from '../../utils/uiExperience';

export default function Layout({ children }) {
  const { user } = useAuth();
  const [, setTick] = useState(0);

  // Listen for real-time UI preference changes
  useEffect(() => {
    const handlePrefChange = (e) => {
      const { username, userId } = e.detail || {};
      const currentUsername = user?.username ? String(user.username).toLowerCase() : null;
      const currentId = user?.id ? String(user.id) : (user?._id ? String(user._id) : null);
      if (
        (username && currentUsername && username.toLowerCase() === currentUsername) ||
        (userId && currentId && userId === currentId)
      ) {
        setTick((t) => t + 1);
      }
    };

    window.addEventListener('ql_ui_preference_changed', handlePrefChange);
    return () => window.removeEventListener('ql_ui_preference_changed', handlePrefChange);
  }, [user]);

  const isTechUser = isProTechExperience(user);

  if (isTechUser) {
    return <TechLuxuryLayout>{children}</TechLuxuryLayout>;
  }
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
