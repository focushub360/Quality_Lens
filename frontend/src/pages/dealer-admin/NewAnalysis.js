import React, { useState, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import {
  Card, CardContent, Grid, TextField, MenuItem, Button, Typography, Alert,
  Box, Chip, Paper, Tooltip, Container, CircularProgress
} from '@mui/material';
import {
  PlayArrow, Check, Error, Schedule, Refresh,
  Language, Translate, Add, VideoCameraBack, HelpOutline
} from '@mui/icons-material';
import api from '../../services/api';

// QualityLens Branding Theme
const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#F0FDFA',
  accent: '#00B4DB',
  accentLight: '#E0F2FE',
  accentUltraLight: '#F8FAFC',
  orange: '#0DA1B8',
  orangeLight: '#F0FDFA',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  successLight: '#F0FDF4',
  warning: '#F59E0B',
  warningLight: '#FFFBE8',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  gradientPrimary: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
  gradientAccent: 'linear-gradient(135deg, #0DA1B8 0%, #0C587D 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  shadowSm: '0 4px 20px rgba(0,0,0,0.03)',
  shadowMd: '0 8px 30px rgba(13, 161, 184, 0.08)',
  shadowLg: '0 12px 40px rgba(13, 161, 184, 0.12)',
};

const LANGS = [
  { code: "auto", name: "Auto Detect", icon: "🔍" },
  { code: "en", name: "English", icon: "🇺🇸" },
  { code: "as", name: "Assamese", icon: "🇮🇳" },
  { code: "bn", name: "Bengali", icon: "🇮🇳" },
  { code: "gu", name: "Gujarati", icon: "🇮🇳" },
  { code: "hi", name: "Hindi", icon: "🇮🇳" },
  { code: "kn", name: "Kannada", icon: "🇮🇳" },
  { code: "ml", name: "Malayalam", icon: "🇮🇳" },
  { code: "mr", name: "Marathi", icon: "🇮🇳" },
  { code: "ne", name: "Nepali", icon: "🇳🇵" },
  { code: "or", name: "Odia", icon: "🇮🇳" },
  { code: "pa", name: "Punjabi", icon: "🇮🇳" },
  { code: "sa", name: "Sanskrit", icon: "🇮🇳" },
  { code: "ta", name: "Tamil", icon: "🇮🇳" },
  { code: "te", name: "Telugu", icon: "🇮🇳" },
  { code: "ur", name: "Urdu", icon: "🇵🇰" },
];

const STATUS_CONFIG = {
  pending: {
    color: 'default',
    icon: <Schedule sx={{ color: THEME.textTertiary }} />,
    label: 'Pending',
    bgColor: THEME.surface,
    textColor: THEME.textTertiary
  },
  processing: {
    color: 'primary',
    icon: <Refresh sx={{ color: THEME.primary }} />,
    label: 'Processing',
    bgColor: THEME.primaryUltraLight,
    textColor: THEME.primary
  },
  completed: {
    color: 'success',
    icon: <Check sx={{ color: THEME.success }} />,
    label: 'Completed',
    bgColor: THEME.successLight,
    textColor: THEME.success
  },
  failed: {
    color: 'error',
    icon: <Error sx={{ color: THEME.error }} />,
    label: 'Failed',
    bgColor: THEME.errorLight,
    textColor: THEME.error
  }
};

export default function NewAnalysis() {
  const { tasks, addTask } = useTasks();
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('auto');
  const [target, setTarget] = useState('en');
  const [localLoading, setLocalLoading] = useState(false); // Only for submission request
  const [error, setError] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [progressPct, setProgressPct] = useState(0);
  const [resultData, setResultData] = useState(null);

  // Derived state: find the task in global context
  const currentTask = tasks.find(t => t.task_id === currentTaskId) || null;

  // Cleanup: if task completes/fails, we stop local "loading" if we were waiting (though we rely on context now)
  useEffect(() => {
    if (currentTask && (currentTask.status === 'completed' || currentTask.status === 'failed')) {
      setLocalLoading(false);
      if (currentTask.status === 'completed') {
        setProgressPct(100);
        // Fetch the full result inline
        if (currentTask.result_id) {
          api.get(`/results/${currentTask.result_id}`)
            .then(res => setResultData(res.data))
            .catch(err => console.warn('Could not fetch result inline:', err));
        }
      }
    }
  }, [currentTask]);

  // Simulate progressive percentage while processing
  useEffect(() => {
    if (!currentTask || currentTask.status !== 'processing') return;
    setProgressPct(prev => (prev < 1 ? 1 : prev)); // start at 1
    const interval = setInterval(() => {
      setProgressPct(prev => {
        if (prev >= 95) return prev; // slow down near end, wait for real completion
        // Increment faster early, slower later
        const increment = prev < 30 ? 3 : prev < 60 ? 2 : prev < 80 ? 1 : 0.5;
        return Math.min(95, prev + increment);
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [currentTask?.status]);

  // Reset progress when new task starts
  useEffect(() => {
    if (currentTaskId) setProgressPct(0);
  }, [currentTaskId]);

  const submit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError('');
    setCurrentTaskId(null);

    try {
      const res = await api.post('/analyze', {
        citnow_url: url,
        transcription_language: lang,
        target_language: target
      });

      const newTaskId = res.data.task_id;
      if (!newTaskId) {
        throw new Error('No task ID returned from server');
      }

      // Add to global context to start tracking
      addTask({
        task_id: newTaskId,
        status: 'pending',
        message: 'Queued for processing...',
        type: 'analysis',
        created_at: new Date().toISOString()
      });

      setCurrentTaskId(newTaskId);

    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Analysis failed to start');
      setLocalLoading(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setLang('auto');
    setTarget('en');
    setCurrentTaskId(null);
    setError('');
    setLocalLoading(false);
    setResultData(null);
    setProgressPct(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2" // Larger, bolder font
          sx={{
            fontWeight: 800,
            letterSpacing: '-1.5px', // Tighter, elite feel
            color: THEME.textPrimary,
            mb: 2,
            background: THEME.gradientPrimary,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 12px rgba(28,105,212,0.15))'
          }}
        >
          New Video Analysis
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: THEME.textSecondary,
            fontWeight: 400,
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Analyze QualityLens videos with AI-powered transcription, translation, and quality assessment
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{
            background: THEME.surfaceElevated,
            border: `1.5px solid ${THEME.border}`,
            borderRadius: 4,
            boxShadow: THEME.shadowLg,
            overflow: 'visible',
            position: 'relative'
          }}>
            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    border: `1px solid ${THEME.errorLight}`,
                    backgroundColor: THEME.errorLight
                  }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={resetForm}
                      sx={{ fontWeight: 600 }}
                    >
                      Reset
                    </Button>
                  }
                >
                  <Typography variant="body2" fontWeight="600">
                    {error}
                  </Typography>
                </Alert>
              )}

              {currentTask && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: STATUS_CONFIG[currentTask.status]?.bgColor,
                    border: `1px solid ${THEME.borderLight}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: THEME.background,
                        border: `1px solid ${THEME.border}`
                      }}>
                        {STATUS_CONFIG[currentTask.status]?.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ color: STATUS_CONFIG[currentTask.status]?.textColor }}>
                          Analysis {STATUS_CONFIG[currentTask.status]?.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: THEME.textSecondary, mt: 0.5 }}>
                          Task ID: {currentTask.task_id}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={STATUS_CONFIG[currentTask.status]?.label}
                      sx={{
                        backgroundColor: STATUS_CONFIG[currentTask.status]?.bgColor,
                        color: STATUS_CONFIG[currentTask.status]?.textColor,
                        fontWeight: 600,
                        border: `1px solid ${STATUS_CONFIG[currentTask.status]?.textColor}20`
                      }}
                    />
                  </Box>

                  {currentTask.status === 'processing' && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 5, 
                      mb: 2,
                      background: '#0a0a0a', // Deep black like the reference
                      borderRadius: 4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      border: '1px solid #222'
                    }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                        {/* Background Circle */}
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={130}
                          thickness={4}
                          sx={{ color: '#222' }} // Dark track
                        />
                        {/* Progress Circle (Lime Green like reference) */}
                        <CircularProgress
                          variant="determinate"
                          value={progressPct}
                          size={130}
                          thickness={5}
                          sx={{
                            color: '#A3E635', // Lime green
                            position: 'absolute',
                            left: 0,
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round',
                              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            },
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="h3" component="div" fontWeight="800" sx={{ 
                            color: '#FFFFFF', 
                            letterSpacing: '-1px',
                            fontFamily: '"Orbitron", "Roboto", sans-serif' // Futuristic font feel
                          }}>
                            {Math.round(progressPct)}<Box component="span" sx={{ fontSize: '1.5rem', ml: 0.5 }}>%</Box>
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" sx={{ 
                        color: '#A3E635', 
                        fontWeight: 700, 
                        letterSpacing: '2px', 
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        opacity: 0.9
                      }}>
                        {currentTask.message || "ANALYZING VIDEO CONTENT"}
                      </Typography>
                      {/* Sub-text pulse animation hint */}
                      <Box sx={{ 
                        mt: 1, 
                        width: '40px', 
                        height: '2px', 
                        background: '#A3E635', 
                        borderRadius: 1,
                        animation: 'pulse 2s infinite'
                      }} />
                      <style>
                        {`
                          @keyframes pulse {
                            0% { opacity: 0.3; width: 20px; }
                            50% { opacity: 1; width: 60px; }
                            100% { opacity: 0.3; width: 20px; }
                          }
                        `}
                      </style>
                    </Box>
                  )}

                  {currentTask.status === 'completed' && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 5, 
                      mb: 2,
                      background: '#0a0a0a',
                      borderRadius: 4,
                      border: `1px solid ${THEME.success}40`,
                      boxShadow: `0 10px 30px ${THEME.success}15`
                    }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={130}
                          thickness={5}
                          sx={{
                            color: THEME.success,
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round',
                            },
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check sx={{ color: THEME.success, fontSize: '4rem' }} />
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 800, textTransform: 'uppercase' }}>
                        Analysis Complete
                      </Typography>
                      <Typography variant="caption" sx={{ color: THEME.success, fontWeight: 600, mt: 1 }}>
                        READY FOR REVIEW
                      </Typography>
                    </Box>
                  )}

                  {currentTask.message && (
                    <Typography variant="body2" sx={{ color: THEME.textPrimary, mb: 1 }}>
                      {currentTask.message}
                    </Typography>
                  )}

                  {currentTask.status === 'completed' && currentTask.result_id && (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 2,
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: THEME.successLight,
                      border: `1px solid ${THEME.success}20`
                    }}>
                      <Check sx={{ color: THEME.success }} />
                      <Typography variant="body2" fontWeight="600" sx={{ color: THEME.success }}>
                        Analysis completed successfully!
                      </Typography>
                    </Box>
                  )}

                  {currentTask.status === 'failed' && currentTask.error_message && (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 2,
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: THEME.errorLight,
                      border: `1px solid ${THEME.error}20`
                    }}>
                      <Error sx={{ color: THEME.error }} />
                      <Typography variant="body2" fontWeight="600" sx={{ color: THEME.error }}>
                        Error: {currentTask.error_message}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* ─── Inline Result Display ─── */}
              {resultData && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" fontWeight="700" sx={{
                    color: THEME.textPrimary, mb: 2,
                    display: 'flex', alignItems: 'center', gap: 1
                  }}>
                    <Check sx={{ color: THEME.success }} /> Analysis Result
                  </Typography>

                  {/* Score Cards */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                      {
                        label: 'Video Quality',
                        value: resultData.video_analysis?.quality_score ?? resultData.video_quality_score ?? 0,
                        color: THEME.primary,
                        issues: resultData.video_analysis?.issues || [],
                        tips: [
                          ...(resultData.video_analysis?.issues || []).map(i => `Fix: ${i}`),
                          'Ensure good, bright lighting',
                          'Use a stable tripod or gimbal',
                          'Shoot in HD (1080p or higher)',
                          'Keep the camera lens clean and focused',
                        ]
                      },
                      {
                        label: 'Audio Quality',
                        value: resultData.audio_analysis?.score ?? resultData.audio_quality_score ?? 0,
                        color: THEME.accent,
                        issues: resultData.audio_analysis?.issues || [],
                        tips: [
                          ...(resultData.audio_analysis?.issues || []).map(i => `Fix: ${i}`),
                          'Use an external microphone',
                          'Record in a quiet environment',
                          'Speak clearly and at a consistent volume',
                          'Reduce wind and background noise',
                        ]
                      },
                      {
                        label: 'Overall Score',
                        value: resultData.overall_quality?.overall_score ?? resultData.overall_quality_score ?? 0,
                        color: THEME.success,
                        issues: [
                          ...(resultData.video_analysis?.issues || []),
                          ...(resultData.audio_analysis?.issues || [])
                        ],
                        tips: [
                          'Improve both video and audio quality',
                          'Ensure complete transcription with clear speech',
                          'Minimize all detected issues listed above',
                          'Maintain professional camera framing throughout',
                        ]
                      },
                    ].map(({ label, value, color, issues, tips }) => {
                      const tooltipContent = (
                        <Box sx={{ p: 0.5, maxWidth: 280 }}>
                          {issues.length > 0 && (
                            <>
                              <Typography variant="caption" fontWeight="700" sx={{ color: '#FFB400', display: 'block', mb: 0.5 }}>
                                ⚠️ Why this score:
                              </Typography>
                              {issues.slice(0, 3).map((issue, i) => (
                                <Typography key={i} variant="caption" sx={{ display: 'block', mb: 0.3, color: '#ffd580' }}>
                                  • {issue}
                                </Typography>
                              ))}
                              <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.15)', my: 1 }} />
                            </>
                          )}
                          <Typography variant="caption" fontWeight="700" sx={{ color: '#90EE90', display: 'block', mb: 0.5 }}>
                            🚀 To reach 10/10:
                          </Typography>
                          {tips.slice(0, 4).map((tip, i) => (
                            <Typography key={i} variant="caption" sx={{ display: 'block', mb: 0.3, color: '#d4edda' }}>
                              ✓ {tip}
                            </Typography>
                          ))}
                        </Box>
                      );
                      return (
                        <Grid item xs={4} key={label}>
                          <Paper elevation={0} sx={{
                            p: 2, borderRadius: 2, textAlign: 'center',
                            border: `1px solid ${THEME.border}`,
                            background: THEME.surface,
                            position: 'relative'
                          }}>
                            <Tooltip
                              title={tooltipContent}
                              placement="top"
                              arrow
                              componentsProps={{ tooltip: { sx: { bgcolor: '#1a2a3a', maxWidth: 300, p: 1.5, borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' } }, arrow: { sx: { color: '#1a2a3a' } } }}
                            >
                              <HelpOutline
                                sx={{
                                  position: 'absolute', top: 6, right: 6,
                                  fontSize: 15, color: THEME.textSecondary,
                                  cursor: 'help',
                                  '&:hover': { color: THEME.primary }
                                }}
                              />
                            </Tooltip>
                            <Typography variant="h4" fontWeight="700" sx={{ color }}>
                              {Number(value).toFixed(1)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                              {label}
                            </Typography>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* Vehicle & Case Details */}
                  {resultData.citnow_metadata && (() => {
                    const m = resultData.citnow_metadata;
                    const details = [
                      { label: '🚗 Vehicle', value: m.vehicle || m.registration || m.reg_no || m.vehicle_number || '—' },
                      { label: '🔖 Registration', value: m.registration || m.reg_no || '—' },
                      { label: '🔢 VIN', value: m.vin || '—' },
                      { label: '🏢 Dealership', value: m.dealership || '—' },
                      { label: '👤 Service Advisor', value: m.service_advisor || '—' },
                      { label: '📧 Email', value: m.email || '—' },
                      { label: '📞 Phone', value: m.phone || '—' },
                    ].filter(d => d.value && d.value !== '—');

                    return (
                      <>
                        {/* Real Rating / Satisfaction (If available) */}
                        {(m.star_rating !== undefined || m.customer_feedback) && (
                          <Paper elevation={0} sx={{
                            p: 2.5, mb: 2, borderRadius: 2,
                            border: `1px solid ${THEME.success}30`,
                            background: `${THEME.success}05`
                          }}>
                            <Typography variant="subtitle2" fontWeight="700" sx={{ color: THEME.success, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                              ⭐ Customer Satisfaction (Real Rating)
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: m.customer_feedback ? 2 : 0 }}>
                              {m.star_rating !== undefined && (
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Typography key={star} sx={{ 
                                      color: star <= m.star_rating ? '#FFB400' : '#E0E0E0',
                                      fontSize: '24px',
                                      lineHeight: 1
                                    }}>
                                      ★
                                    </Typography>
                                  ))}
                                  <Typography sx={{ ml: 1, fontWeight: 700, color: THEME.textPrimary }}>
                                    {m.star_rating}/5
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            {m.customer_feedback && (
                              <Box sx={{ p: 1.5, background: '#FFFFFF', borderRadius: 1.5, borderLeft: `3px solid ${THEME.success}` }}>
                                <Typography variant="body2" italic sx={{ color: THEME.textSecondary }}>
                                  "{m.customer_feedback}"
                                </Typography>
                              </Box>
                            )}
                          </Paper>
                        )}

                        {details.length > 0 && (
                          <Paper elevation={0} sx={{
                            p: 2.5, mb: 2, borderRadius: 2,
                            border: `1px solid ${THEME.border}`,
                            background: THEME.surface
                          }}>
                            <Typography variant="subtitle2" fontWeight="700" sx={{ color: THEME.textPrimary, mb: 1.5 }}>
                              🚘 Vehicle & Case Details
                            </Typography>
                            <Grid container spacing={1.5}>
                              {details.map(({ label, value }) => (
                                <Grid item xs={12} sm={6} key={label}>
                                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                    <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600, minWidth: 120 }}>
                                      {label}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: THEME.textPrimary, fontWeight: 500, wordBreak: 'break-word' }}>
                                      {value}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Paper>
                        )}
                      </>
                    );
                  })()}

                  {/* Transcription */}
                  {resultData.transcription?.text && (
                    <Paper elevation={0} sx={{
                      p: 2.5, mb: 2, borderRadius: 2,
                      border: `1px solid ${THEME.border}`,
                      background: THEME.surface
                    }}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ color: THEME.textPrimary, mb: 1 }}>
                        📝 Transcription
                      </Typography>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, lineHeight: 1.7 }}>
                        {resultData.transcription.text}
                      </Typography>
                    </Paper>
                  )}

                  {/* Summary */}
                  {resultData.summarization?.summary && (
                    <Paper elevation={0} sx={{
                      p: 2.5, mb: 2, borderRadius: 2,
                      border: `1px solid ${THEME.border}`,
                      background: THEME.surface
                    }}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ color: THEME.textPrimary, mb: 1 }}>
                        💡 Summary
                      </Typography>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, lineHeight: 1.7 }}>
                        {resultData.summarization.summary}
                      </Typography>
                    </Paper>
                  )}

                  {/* Translation */}
                  {resultData.translation?.translated_text && (
                    <Paper elevation={0} sx={{
                      p: 2.5, mb: 2, borderRadius: 2,
                      border: `1px solid ${THEME.border}`,
                      background: THEME.surface
                    }}>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ color: THEME.textPrimary, mb: 1 }}>
                        🌐 Translation
                      </Typography>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, lineHeight: 1.7 }}>
                        {resultData.translation.translated_text}
                      </Typography>
                    </Paper>
                  )}

                  {/* Overall Label / Quality */}
                  {resultData.overall_quality?.overall_label && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip
                        label={`Quality: ${resultData.overall_quality.overall_label}`}
                        sx={{
                          fontWeight: 700,
                          background: THEME.primaryUltraLight,
                          color: THEME.primary
                        }}
                      />
                      {resultData.citnow_metadata?.service_advisor && (
                        <Chip
                          label={`Advisor: ${resultData.citnow_metadata.service_advisor}`}
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              )}

              <form onSubmit={submit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VideoCameraBack sx={{ color: THEME.textSecondary, fontSize: 20 }} />
                          <span>QualityLens Video URL</span>
                        </Box>
                      }
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      disabled={localLoading || (currentTask && ['pending', 'processing'].includes(currentTask.status))}
                      helperText="Enter the full URL of your video for analysis"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: THEME.surface,
                          transition: 'all 0.2s ease',
                          '& fieldset': { borderColor: THEME.border },
                          '&:hover fieldset': { borderColor: THEME.primaryLight },
                          '&.Mui-focused fieldset': {
                            borderColor: THEME.primary,
                            borderWidth: '2px'
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 12px rgba(28, 63, 170, 0.08)'
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Language sx={{ color: THEME.textSecondary, fontSize: 20 }} />
                          <span>Spoken Language</span>
                        </Box>
                      }
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      disabled={localLoading || (currentTask && ['pending', 'processing'].includes(currentTask.status))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: THEME.surface,
                          transition: 'all 0.2s ease',
                          '& fieldset': { borderColor: THEME.border },
                          '&:hover fieldset': { borderColor: THEME.primaryLight },
                          '&.Mui-focused fieldset': {
                            borderColor: THEME.primary,
                            borderWidth: '2px'
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 12px rgba(28, 63, 170, 0.08)'
                          }
                        }
                      }}
                    >
                      {LANGS.map(l => (
                        <MenuItem key={l.code} value={l.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="body1">{l.icon}</Typography>
                            <Typography>{l.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Translate sx={{ color: THEME.textSecondary, fontSize: 20 }} />
                          <span>Target Language</span>
                        </Box>
                      }
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      disabled={localLoading || (currentTask && ['pending', 'processing'].includes(currentTask.status))}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: THEME.surface,
                          transition: 'all 0.2s ease',
                          '& fieldset': { borderColor: THEME.border },
                          '&:hover fieldset': { borderColor: THEME.primaryLight },
                          '&.Mui-focused fieldset': {
                            borderColor: THEME.primary,
                            borderWidth: '2px'
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 12px rgba(28, 63, 170, 0.08)'
                          }
                        }
                      }}
                    >
                      {LANGS.filter(l => l.code !== 'auto').map(l => (
                        <MenuItem key={l.code} value={l.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="body1">{l.icon}</Typography>
                            <Typography>{l.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={localLoading || (currentTask && ['pending', 'processing'].includes(currentTask.status))}
                        startIcon={<PlayArrow />}
                        sx={{
                          background: THEME.gradientPrimary,
                          borderRadius: 3,
                          px: 6,
                          py: 1.8,
                          fontWeight: 700,
                          textTransform: 'none',
                          fontSize: '1.05rem',
                          boxShadow: '0 8px 20px -6px rgba(28, 105, 212, 0.5)',
                          '&:hover': {
                            boxShadow: '0 12px 25px -6px rgba(28, 105, 212, 0.6)',
                            transform: 'translateY(-2px)'
                          },
                          '&:disabled': {
                            background: THEME.textTertiary,
                            transform: 'none',
                            boxShadow: 'none'
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          minWidth: 160
                        }}
                      >
                        {localLoading ? 'Starting Analysis...' : 'Start Analysis'}
                      </Button>

                      {(currentTask && (currentTask.status === 'completed' || currentTask.status === 'failed')) && (
                        <Button
                          variant="outlined"
                          onClick={resetForm}
                          startIcon={<Add />}
                          sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '16px',
                            borderColor: THEME.primary,
                            color: THEME.primary,
                            '&:hover': {
                              backgroundColor: THEME.primaryUltraLight,
                              borderColor: THEME.primaryDark
                            }
                          }}
                        >
                          New Analysis
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </form>
              {/* Help section */}
              {!currentTask && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    mt: 5,
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${THEME.surface} 0%, rgba(248, 250, 252, 0.4) 100%)`,
                    border: '1px solid',
                    borderColor: 'rgba(28, 105, 212, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.01)'
                  }}
                >
                  {/* Decorative glow inside help box */}
                  <Box sx={{
                    position: 'absolute', top: -30, right: -30, width: 100, height: 100,
                    background: 'radial-gradient(circle, rgba(28,105,212,0.1) 0%, transparent 70%)',
                    borderRadius: '50%'
                  }} />
                  <Typography variant="subtitle1" fontWeight="700" sx={{ color: THEME.primary, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: '1.2rem' }}>💡</span> How it works
                  </Typography>
                  <Box sx={{
                    display: 'flex', flexDirection: 'column', gap: 1.5,
                    '& p': { color: THEME.textSecondary, display: 'flex', alignItems: 'center', gap: 1.5, m: 0, fontSize: '0.95rem' },
                    '& span.bullet': { color: THEME.primaryLight, fontSize: '1.5rem', lineHeight: 0.5 }
                  }}>
                    <p><span className="bullet">•</span> Analysis runs seamlessly in the background — feel free to continue using the dashboard.</p>
                    <p><span className="bullet">•</span> Real-time progress tracking with automatic status updates.</p>
                    <p><span className="bullet">•</span> Comprehensive video, audio, and transcription intelligence.</p>
                    <p><span className="bullet">•</span> Results are beautifully formatted and available immediately upon completion.</p>
                  </Box>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container >
  );
}