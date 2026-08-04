// src/pages/auth/LoginPage.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Fade,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Lock, Person, Business, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#E8F8FA',
  accent: '#1CB5E0',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  error: '#EF4444',
  gradientPrimary: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export default function LoginPage() {
  const { login, loading, role, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Snackbar state - simplified
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Prefill username from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const usernameFromQuery = params.get('username');
    const dealerFromQuery = params.get('dealer');

    if (usernameFromQuery && dealerFromQuery) {
      setForm(prev => ({ ...prev, username: usernameFromQuery }));
      setTimeout(() => passwordRef.current?.focus(), 100);
    }
  }, [location.search]);

  // Auto-focus username field on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // Redirect on login success - FIXED
  useEffect(() => {
    if (isAuthenticated && role) {
      const roleLabels = {
        super_admin: 'Super Admin',
        dealer_admin: 'Dealer Admin',
        branch_admin: 'Branch Admin',
        dealer_user: 'Dealer User'
      };

      setSnackbar({
        open: true,
        message: `Logging in as ${roleLabels[role] || 'User'}...`,
        severity: 'success'
      });

      // Small delay to show the success message before redirect
      const timer = setTimeout(() => {
        const roleRedirects = {
          super_admin: '/super-admin/dashboard',
          dealer_admin: '/dealer/dashboard',
          branch_admin: '/dealer/dashboard',
          dealer_user: '/dealer/new'
        };
        navigate(roleRedirects[role] || '/');
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setSnackbar({ open: false, message: '', severity: 'info' });

    if (!form.username || !form.password) {
      showSnackbar('Both username and password are required.', 'warning');
      return;
    }

    // Since the backend is hosted on Hugging Face free tier, it sleeps after inactivity.
    // If login takes longer than 3.5 seconds, notify the user.
    const hfWakeupTimer = setTimeout(() => {
      showSnackbar('Waking up the backend servers... This usually takes ~1 minute. Please wait!', 'info');
    }, 3500);

    try {
      await login(form.username.trim(), form.password);
      clearTimeout(hfWakeupTimer);
      // Success message is handled in the useEffect above
    } catch (err) {
      clearTimeout(hfWakeupTimer);
      console.error("Login Error:", err);
      const errorMessage = err.response?.data?.detail || err.message || 'Invalid username or password.';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, #061e38 0%, #086b8f 50%, #00b4db 100%)`,
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(0, 180, 219, 0.25) 0, transparent 50%),
          radial-gradient(at 100% 0%, rgba(28, 181, 224, 0.2) 0, transparent 50%),
          radial-gradient(at 100% 100%, rgba(0, 180, 219, 0.25) 0, transparent 50%),
          radial-gradient(at 0% 100%, rgba(28, 181, 224, 0.2) 0, transparent 50%)
        `,
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
          background: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          transform: 'rotate(15deg)',
          zIndex: 0
        }
      }}
    >


      <Fade in timeout={800}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 460,
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            zIndex: 1,
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
            {/* Header - Logo Only */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box
                component="img"
                src="/qualitylens-logo.png"
                alt="QualityLens Logo"
                sx={{
                  width: 'auto',
                  height: 76,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.05))',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Smooth elastic bounce
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.15)', // Much bigger pop-up zoom
                    filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.1))'
                  }
                }}
              />
            </Box>

            {/* Form */}
            <form onSubmit={onSubmit} noValidate>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Username or Email"
                  name="username"
                  fullWidth
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  inputRef={usernameRef}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: THEME.primary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(248, 250, 252, 0.8)',
                      transition: 'all 0.2s ease',
                      '& fieldset': { borderColor: 'rgba(226, 232, 240, 0.8)' },
                      '&:hover fieldset': {
                        borderColor: THEME.primaryLight,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: THEME.primary,
                        borderWidth: '2px'
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 12px rgba(28, 105, 212, 0.08)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: THEME.textSecondary,
                      fontWeight: 500
                    }
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  inputRef={passwordRef}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: THEME.primary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          tabIndex={-1}
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(248, 250, 252, 0.8)',
                      transition: 'all 0.2s ease',
                      '& fieldset': { borderColor: 'rgba(226, 232, 240, 0.8)' },
                      '&:hover fieldset': {
                        borderColor: THEME.primaryLight,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: THEME.primary,
                        borderWidth: '2px'
                      },
                      '&.Mui-focused': {
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 12px rgba(28, 105, 212, 0.08)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: THEME.textSecondary,
                      fontWeight: 500
                    }
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: `linear-gradient(45deg, ${THEME.primaryDark} 0%, ${THEME.primary} 100%)`,
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(28, 105, 212, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'linear-gradient(rgba(255,255,255,0.2) 0%, transparent 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s'
                    },
                    '&:hover': {
                      boxShadow: '0 12px 28px rgba(28, 105, 212, 0.45)',
                      transform: 'translateY(-3px)',
                      '&::after': { opacity: 1 }
                    },
                    '&:disabled': {
                      background: THEME.textTertiary,
                      opacity: 0.7
                    },
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Fade>

      {/* Snackbar for errors & success - FIXED */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          // Ensure snackbar is on top of everything
          zIndex: 9999,
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          elevation={6}
          variant="filled"
          sx={{
            width: '100%',
            fontWeight: 600,
            alignItems: 'center',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}