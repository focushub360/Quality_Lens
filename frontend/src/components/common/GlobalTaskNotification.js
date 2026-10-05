import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  IconButton,
  Slide,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  ErrorOutline,
  Close,
  ArrowForward,
  NotificationsActive,
  VideoLibrary
} from '@mui/icons-material';
import { useTasks } from '../../contexts/TaskContext';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#F0FDFA',
  success: '#10B981',
  successLight: '#ECFDF5',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  gradientPrimary: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
  shadowAlert: '0 20px 48px -10px rgba(13, 161, 184, 0.28), 0 10px 20px -5px rgba(0, 0, 0, 0.1)'
};

export default function GlobalTaskNotification() {
  const { completionAlert, dismissCompletionAlert } = useTasks();
  const navigate = useNavigate();

  // Auto-dismiss after 20 seconds if user does not interact
  useEffect(() => {
    if (!completionAlert) return;
    const timer = setTimeout(() => {
      dismissCompletionAlert();
    }, 20000);
    return () => clearTimeout(timer);
  }, [completionAlert, dismissCompletionAlert]);

  if (!completionAlert) return null;

  const isSuccess = completionAlert.status === 'completed';

  const handleViewResults = () => {
    dismissCompletionAlert();
    if (completionAlert.resultId) {
      navigate(`/dealer/results?id=${completionAlert.resultId}`);
    } else {
      navigate('/dealer/results');
    }
  };

  return (
    <Slide direction="up" in={Boolean(completionAlert)} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 28 },
          right: { xs: 16, sm: 28 },
          zIndex: 99999,
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 440 },
          width: '100%'
        }}
      >
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderRadius: 3.5,
            border: `1.5px solid ${isSuccess ? THEME.primaryLight : THEME.error}`,
            boxShadow: THEME.shadowAlert,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Top accent glowing stripe */}
          <Box
            sx={{
              height: 4,
              width: '100%',
              background: isSuccess ? THEME.gradientPrimary : THEME.error
            }}
          />

          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Pulsing status avatar */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSuccess ? THEME.successLight : THEME.errorLight,
                  color: isSuccess ? THEME.success : THEME.error,
                  flexShrink: 0,
                  position: 'relative',
                  animation: 'pulseGlow 2s infinite',
                  '@keyframes pulseGlow': {
                    '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' }
                  }
                }}
              >
                {isSuccess ? (
                  <CheckCircle sx={{ fontSize: 26 }} />
                ) : (
                  <ErrorOutline sx={{ fontSize: 26 }} />
                )}
              </Box>

              {/* Text content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: THEME.textPrimary,
                      fontSize: '0.98rem',
                      lineHeight: 1.2
                    }}
                  >
                    {completionAlert.title || 'Optimization Complete!'}
                  </Typography>
                  <Chip
                    label="Ready"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: isSuccess ? THEME.successLight : THEME.errorLight,
                      color: isSuccess ? THEME.success : THEME.error
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: THEME.textSecondary,
                    fontSize: '0.84rem',
                    lineHeight: 1.4,
                    mb: 2
                  }}
                >
                  {completionAlert.message || 'Your video analysis is complete. Return to view quality scoring and transcriptions.'}
                </Typography>

                {/* Action buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  {isSuccess ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleViewResults}
                      endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                      sx={{
                        background: THEME.gradientPrimary,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        px: 2.2,
                        py: 0.7,
                        boxShadow: '0 4px 14px rgba(13, 161, 184, 0.4)',
                        '&:hover': {
                          background: THEME.gradientPrimary,
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 18px rgba(13, 161, 184, 0.5)'
                        }
                      }}
                    >
                      Return & View Results
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        dismissCompletionAlert();
                        navigate('/dealer/new');
                      }}
                      sx={{
                        borderColor: THEME.error,
                        color: THEME.error,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        '&:hover': { bgcolor: THEME.errorLight }
                      }}
                    >
                      Try Again
                    </Button>
                  )}

                  <Button
                    size="small"
                    onClick={dismissCompletionAlert}
                    sx={{
                      color: THEME.textSecondary,
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      '&:hover': { color: THEME.textPrimary }
                    }}
                  >
                    Dismiss
                  </Button>
                </Box>
              </Box>

              {/* Close icon */}
              <IconButton
                size="small"
                onClick={dismissCompletionAlert}
                sx={{
                  color: THEME.textSecondary,
                  p: 0.5,
                  mt: -0.5,
                  mr: -0.5,
                  '&:hover': { color: THEME.textPrimary }
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Slide>
  );
}
