// src/components/layout/Footer.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  Divider,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email,
  LocationOn,
  LinkedIn,
  Twitter,
  GitHub,
  SmartDisplay
} from '@mui/icons-material';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#F0FDFA',
  accent: '#00B4DB',
  accentLight: '#E0F2FE',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gradientPrimary: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
  gradientAccent: 'linear-gradient(135deg, #0DA1B8 0%, #0C587D 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
};

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: THEME.surface,
        borderTop: `1px solid ${THEME.border}`,
        mt: 'auto',
        py: 4 // Reduced from py: 6
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 2 }}> {/* Reduced from mb: 3 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Box sx={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <img
                    src="/qualitylens-logo.png"
                    alt="QualityLens"
                    style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                  />
                </Box>
                <Box sx={{ width: '1px', height: 75, bgcolor: '#e0e0e0', flexShrink: 0 }} />
                <img
                  src="/focus-technologies-logo.png"
                  alt="Focus Technologies"
                  style={{ height: '90px', width: 'auto', objectFit: 'contain' }}
                />
              </Box>

            </Box>

            {/* Social Links */}
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                sx={{
                  background: THEME.primaryUltraLight,
                  color: THEME.primary,
                  '&:hover': {
                    background: THEME.primary,
                    color: '#fff'
                  }
                }}
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  background: THEME.primaryUltraLight,
                  color: THEME.primary,
                  '&:hover': {
                    background: THEME.primary,
                    color: '#fff'
                  }
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  background: THEME.primaryUltraLight,
                  color: THEME.primary,
                  '&:hover': {
                    background: THEME.primary,
                    color: '#fff'
                  }
                }}
              >
                <GitHub fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>





          {/* Contact Information */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" sx={{ // Changed from h6 to subtitle2
              fontWeight: 600,
              color: THEME.textPrimary,
              mb: 1.5, // Reduced from mb: 2
              fontSize: '0.9rem'
            }}>
              Contact
            </Typography>
            <Stack spacing={1.5}> {/* Reduced from spacing={2} */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOn sx={{
                  color: THEME.primary,
                  mr: 1.5, // Reduced from mr: 2
                  fontSize: 18, // Smaller icon
                  mt: 0.25 // Align better with text
                }} />
                <Typography variant="body2" sx={{
                  color: THEME.textSecondary,
                  fontSize: '0.875rem' // Smaller text
                }}>
                  FocusEngineering, Gudiyatham, Tamil Nadu, India - 632602
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{
                  color: THEME.primary,
                  mr: 1.5, // Reduced from mr: 2
                  fontSize: 18 // Smaller icon
                }} />
                <Link
                  href="mailto:support@qualitylens.co.uk"
                  variant="body2"
                  sx={{
                    color: THEME.textSecondary,
                    textDecoration: 'none',
                    fontSize: '0.875rem', // Smaller text
                    '&:hover': {
                      color: THEME.primary
                    }
                  }}
                >
                  info@focusengineering.in

                </Link>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: THEME.borderLight }} /> {/* Reduced from my: 4 */}

        {/* Bottom Section - More Compact */}
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: 2
        }}>
          <Typography variant="body2" sx={{
            color: THEME.textTertiary,
            textAlign: isMobile ? 'center' : 'left',
            width: isMobile ? '100%' : 'auto',
            fontSize: '0.875rem' // Smaller text
          }}>
            © {currentYear} FocusEngineering All rights reserved.
          </Typography>

          <Box sx={{
            display: 'flex',
            gap: 2, // Reduced from gap: 3
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            {[
              'Privacy',
              'Terms',
              'Cookies',
              'Security'
            ].map((item) => (
              <Link
                key={item}
                href="#"
                variant="body2"
                sx={{
                  color: THEME.textTertiary,
                  textDecoration: 'none',
                  fontSize: '0.875rem', // Smaller text
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    color: THEME.primary
                  }
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Version Info - More Compact */}
        <Box sx={{
          mt: 2, // Reduced from mt: 3
          textAlign: 'center'
        }}>
          <Typography variant="caption" sx={{
            color: THEME.textTertiary,
            fontSize: '0.7rem' // Smaller text
          }}>
            v2.1.0 • React & FastAPI • UnifiedMediaAnalyzer
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}