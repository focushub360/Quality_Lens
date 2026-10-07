import { createTheme } from '@mui/material/styles';

const BRAND_PRIMARY = '#0DA1B8';
const BRAND_DARK = '#1E293B';
const BRAND_LIGHT = '#3BC5D9';
const SILVER = '#F8FAFC';
const LIGHT_GRAY = '#F1F5F9';
const ACCENT_TEAL = '#00B4DB';

const theme = createTheme({
  palette: {
    primary: { main: BRAND_PRIMARY, contrastText: '#FFFFFF' },
    secondary: { main: SILVER, contrastText: BRAND_DARK },
    error: { main: '#EF4444' },
    background: { default: '#FFFFFF', paper: SILVER },
    text: { primary: BRAND_DARK, secondary: '#64748B' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
          textTransform: 'none',
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        contained: {
          background: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(13, 161, 184, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #007299 0%, #00a4c7 100%)',
            boxShadow: '0 6px 16px rgba(13, 161, 184, 0.35)',
            transform: 'translateY(-2px)'
          }
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(13, 161, 184, 0.04)'
          }
        }
      }
    },
    MuiCard: { styleOverrides: { root: { borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' } } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: '#FFFFFF', color: BRAND_DARK, borderBottom: '1px solid #E2E8F0' } } },
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box'
        },
        '#root': {
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        },
        body: {
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }
      }
    }
  }
});

export default theme;


