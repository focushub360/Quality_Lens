import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Slider,
  Switch,
  Alert,
  AlertTitle,
  Divider,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  AutoAwesome,
  ClosedCaption,
  RecordVoiceOver,
  CameraAlt,
  PlayArrow,
  Pause,
  CheckCircle,
  Speed,
  EventNote,
  Assessment,
  RocketLaunch,
  DirectionsCar,
  VolumeUp,
  SettingsBackupRestore,
  Warning,
  KeyboardArrowRight,
  TrendingUp,
  Schedule
} from '@mui/icons-material';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#F0FDFA',
  accent: '#00B4DB',
  accentLight: '#E0F2FE',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  bmwBlue: '#1c69d4',
  bmwDark: '#060606',
  white: '#FFFFFF',
  cardBg: 'rgba(255, 255, 255, 0.85)',
  surface: '#F8FAFC'
};

export default function CitNowUpgrades() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Autocorrection Simulator State
  const [correctionLevel, setCorrectionLevel] = useState(70);
  const [isStabilized, setIsStabilized] = useState(true);

  // Captions Simulator State
  const [captionStyle, setCaptionStyle] = useState('highlighted');
  const [captionIndex, setCaptionIndex] = useState(0);
  const [isPlayingCaptions, setIsPlayingCaptions] = useState(true);

  // Voice Guidance State
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  // Angle Guidance State
  const [cameraAngle, setCameraAngle] = useState(15); // degrees

  // Captions list
  const captions = [
    "Welcome to BMW Service Center. Let's inspect the brakes.",
    "Checking front tire tread depth... currently at 4.2mm, which is optimal.",
    "Examining the front suspension system for any structural wear.",
    "All checks completed. A detailed report has been sent to your email."
  ];

  // Voice guidance scripts
  const voiceScripts = [
    { title: "Walkaround Initiation", text: "Walk around the vehicle in a clockwise direction, holding the camera steady." },
    { title: "Tire Depth Inspection", text: "Zoom in on the tire tread depth gauge and hold for 2 seconds." },
    { title: "Undercarriage Inspection", text: "Position the lens upward to capture the brake pads and exhaust structure clearly." },
    { title: "Wrap-up Message", text: "Summarize findings clearly using a normal conversational volume." }
  ];

  // Caption playback loop
  useEffect(() => {
    let interval;
    if (isPlayingCaptions) {
      interval = setInterval(() => {
        setCaptionIndex((prev) => (prev + 1) % captions.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlayingCaptions]);

  // Voice playback animation timer
  useEffect(() => {
    let timer;
    if (voicePlaying) {
      timer = setInterval(() => {
        setGuideStep((prev) => (prev + 1) % voiceScripts.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [voicePlaying]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, minHeight: '100vh', backgroundColor: THEME.surface }}>
      <Container maxWidth="xl">
        
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: THEME.bmwBlue, letterSpacing: '-0.02em', mb: 1, fontFamily: '"Outfit", "Inter", sans-serif' }}>
              CitNow Upgrades & Rollout Roadmap
            </Typography>
            <Typography variant="body1" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>
              Implementation status of the next-generation AI video processing engine.
            </Typography>
          </Box>
          <Box>
            <Chip 
              icon={<TrendingUp />} 
              label="Phase: Pilot Validation" 
              color="primary" 
              sx={{ 
                background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.primaryDark} 100%)`, 
                fontWeight: 700, 
                fontSize: '0.875rem',
                py: 2.2, 
                px: 1.5,
                borderRadius: 3,
                boxShadow: '0 4px 14px rgba(13, 161, 184, 0.25)' 
              }} 
            />
          </Box>
        </Box>

        {/* Conference Urgency Alert Banner */}
        <Alert 
          severity="info" 
          icon={<Speed sx={{ color: THEME.bmwBlue }} />}
          sx={{ 
            mb: 4, 
            borderRadius: 4, 
            borderLeft: `6px solid ${THEME.bmwBlue}`, 
            backgroundColor: 'rgba(28, 105, 212, 0.05)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.02)'
          }}
        >
          <AlertTitle sx={{ fontWeight: 700, color: THEME.bmwDark, fontSize: '1rem', mb: 0.5 }}>
            Accelerated Timeline Request (BMW Alignment)
          </AlertTitle>
          <Typography variant="body2" sx={{ color: THEME.textSecondary, lineHeight: 1.6 }}>
            Following <strong>Peter Danial's</strong> presentation of these upgrades at the recent conference, visibility has increased significantly. 
            BMW has requested Focus Engineering to accelerate execution and pilot rollout. 
            Review dates and deliverables are being prioritized.
          </Typography>
        </Alert>

        {/* Upgraded Dashboard Framework Section */}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: THEME.textPrimary }}>
          Upgraded Dashboard Framework
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          
          {/* Framework tabs selector */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              borderRadius: 4, 
              border: `1px solid rgba(13, 161, 184, 0.15)`, 
              background: THEME.cardBg, 
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
              height: '100%' 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: THEME.textPrimary }}>
                  Core Dashboard Enhancements
                </Typography>
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    borderRight: 0,
                    '& .MuiTabs-indicator': {
                      left: 0,
                      right: 'auto',
                      width: 4,
                      borderRadius: 2,
                      backgroundColor: THEME.primary
                    },
                    '& .MuiTab-root': {
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      py: 2,
                      px: 2,
                      mb: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      textTransform: 'none',
                      color: THEME.textSecondary,
                      '&.Mui-selected': {
                        color: THEME.primary,
                        backgroundColor: 'rgba(13, 161, 184, 0.08)',
                        fontWeight: 700
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(13, 161, 184, 0.04)',
                        color: THEME.primary
                      }
                    }
                  }}
                >
                  <Tab 
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AutoAwesome sx={{ fontSize: 18 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 'inherit' }}>1. Autocorrection</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'inherit', display: 'block', mt: 0.5, fontWeight: 400 }}>
                          Automated tuning for lighting, stabilization, & volume.
                        </Typography>
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ClosedCaption sx={{ fontSize: 18 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 'inherit' }}>2. Smart Captions</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'inherit', display: 'block', mt: 0.5, fontWeight: 400 }}>
                          Automated and guided captions for vehicle audits.
                        </Typography>
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <RecordVoiceOver sx={{ fontSize: 18 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 'inherit' }}>3. Voice-over Guidance</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'inherit', display: 'block', mt: 0.5, fontWeight: 400 }}>
                          Embedded voice-over prompts for script structure.
                        </Typography>
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CameraAlt sx={{ fontSize: 18 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 'inherit' }}>4. Angle of Video</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'inherit', display: 'block', mt: 0.5, fontWeight: 400 }}>
                          Optimal camera angles & view consistency checker.
                        </Typography>
                      </Box>
                    } 
                  />
                </Tabs>
              </CardContent>
            </Card>
          </Grid>

          {/* Interactive Simulator / Preview Block */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              borderRadius: 4, 
              border: `1px solid rgba(0, 0, 0, 0.05)`, 
              background: THEME.white, 
              boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 4 }}>
                
                {/* 1. Autocorrection Panel */}
                {activeTab === 0 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                          Autocorrection Engine (AI-Driven)
                        </Typography>
                        <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                          Adjust video inputs automatically to meet dealership quality and brand standard guidelines.
                        </Typography>
                      </Box>
                      <Chip label="Ready for Pilot" color="success" size="small" sx={{ fontWeight: 700 }} />
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        {/* Simulation Screen */}
                        <Box sx={{
                          height: 220,
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
                        }}>
                          {/* Simulated Car frame */}
                          <Box 
                            component="div"
                            sx={{
                              width: '90%',
                              height: '90%',
                              backgroundImage: `url('https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=600&auto=format&fit=crop')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              // Simulate camera blur/shake and brightness based on controls
                              filter: `
                                brightness(${0.5 + (correctionLevel / 200)}) 
                                saturate(${0.7 + (correctionLevel / 333)})
                                blur(${Math.max(0, (100 - correctionLevel) / 15)}px)
                              `,
                              animation: !isStabilized ? 'shake 0.3s infinite alternate' : 'none',
                              '@keyframes shake': {
                                '0%': { transform: 'translate(2px, 1px) rotate(0deg)' },
                                '10%': { transform: 'translate(-1px, -2px) rotate(-1deg)' },
                                '20%': { transform: 'translate(-3px, 0px) rotate(1deg)' },
                                '30%': { transform: 'translate(0px, 2px) rotate(0deg)' },
                                '40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
                                '50%': { transform: 'translate(-1px, 2px) rotate(-1deg)' }
                              }
                            }}
                          />
                          {/* Live overlay tag */}
                          <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                            <Chip size="small" label="LIVE PREVIEW" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.9)', color: '#fff', fontSize: '0.65rem', fontWeight: 800 }} />
                            {isStabilized && <Chip size="small" label="STABILIZED" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.9)', color: '#fff', fontSize: '0.65rem', fontWeight: 800 }} />}
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                          Interactive Correction Controls
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', mb: 1 }}>
                            AI Lighting & Contrast Enhancer ({correctionLevel}%)
                          </Typography>
                          <Slider
                            value={correctionLevel}
                            onChange={(e, val) => setCorrectionLevel(val)}
                            min={10}
                            max={120}
                            sx={{ color: THEME.primary }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                            <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Dark / Uncorrected</Typography>
                            <Typography variant="caption" sx={{ color: THEME.primary, fontWeight: 700 }}>Optimized (Target)</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, p: 1.5, borderRadius: 2, backgroundColor: THEME.surface }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                              Auto-Stabilization Filter
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                              Removes minor hand shake and camera jitter
                            </Typography>
                          </Box>
                          <Switch
                            checked={isStabilized}
                            onChange={(e) => setIsStabilized(e.target.checked)}
                            color="primary"
                          />
                        </Box>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                          Key Benefits
                        </Typography>
                        <List size="small" disablePadding>
                          <ListItem disableGutters sx={{ py: 0.25 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color: THEME.success, fontSize: 16 }} /></ListItemIcon>
                            <ListItemText primary={<Typography variant="caption" sx={{ color: THEME.textSecondary }}>Reduces dealership retakes by 35%</Typography>} />
                          </ListItem>
                          <ListItem disableGutters sx={{ py: 0.25 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color: THEME.success, fontSize: 16 }} /></ListItemIcon>
                            <ListItemText primary={<Typography variant="caption" sx={{ color: THEME.textSecondary }}>Auto-adjusts dark undercarriage shots</Typography>} />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* 2. Captions Panel */}
                {activeTab === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                          Smart Guided Captions (Whisper-Powered)
                        </Typography>
                        <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                          Leverage high-accuracy transcripts to generate automated user-friendly video captions.
                        </Typography>
                      </Box>
                      <Chip label="Ready for Pilot" color="success" size="small" sx={{ fontWeight: 700 }} />
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        {/* Simulation Screen */}
                        <Box sx={{
                          height: 220,
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
                        }}>
                          {/* Simulated Car wheel frame */}
                          <Box 
                            component="div"
                            sx={{
                              width: '90%',
                              height: '90%',
                              backgroundImage: `url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              borderRadius: 2
                            }}
                          />
                          
                          {/* Simulated Captions Overlay */}
                          <Box sx={{ 
                            position: 'absolute', 
                            bottom: 20, 
                            left: '5%', 
                            right: '5%',
                            backgroundColor: captionStyle === 'glass' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: captionStyle === 'glass' ? 'blur(12px)' : 'none',
                            border: captionStyle === 'glass' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                            color: '#fff',
                            p: 2,
                            borderRadius: 2,
                            textAlign: 'center',
                            transition: 'all 0.3s ease'
                          }}>
                            {captionStyle === 'highlighted' ? (
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                {captions[captionIndex].split(' ').map((word, idx) => (
                                  <span key={idx} style={{ 
                                    color: idx === 2 || idx === 3 ? THEME.primary : '#FFFFFF',
                                    marginRight: '4px',
                                    transition: 'color 0.2s'
                                  }}>
                                    {word}
                                  </span>
                                ))}
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                                {captions[captionIndex]}
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                            <IconButton 
                              onClick={() => setIsPlayingCaptions(!isPlayingCaptions)}
                              sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
                            >
                              {isPlayingCaptions ? <Pause size="small" /> : <PlayArrow size="small" />}
                            </IconButton>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                          Caption Styling Options
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                          <Button 
                            variant={captionStyle === 'highlighted' ? 'contained' : 'outlined'}
                            onClick={() => setCaptionStyle('highlighted')}
                            size="small"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                          >
                            Smart Highlight
                          </Button>
                          <Button 
                            variant={captionStyle === 'classic' ? 'contained' : 'outlined'}
                            onClick={() => setCaptionStyle('classic')}
                            size="small"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                          >
                            Classic Dark
                          </Button>
                          <Button 
                            variant={captionStyle === 'glass' ? 'contained' : 'outlined'}
                            onClick={() => setCaptionStyle('glass')}
                            size="small"
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                          >
                            Glassmorphism
                          </Button>
                        </Box>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                          Speech-to-Text Details
                        </Typography>
                        <List size="small" disablePadding sx={{ mb: 2 }}>
                          <ListItem disableGutters sx={{ py: 0.25 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color: THEME.success, fontSize: 16 }} /></ListItemIcon>
                            <ListItemText primary={<Typography variant="caption" sx={{ color: THEME.textSecondary }}>99.2% transcription accuracy with Whisper v3</Typography>} />
                          </ListItem>
                          <ListItem disableGutters sx={{ py: 0.25 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color: THEME.success, fontSize: 16 }} /></ListItemIcon>
                            <ListItemText primary={<Typography variant="caption" sx={{ color: THEME.textSecondary }}>Automatic multi-lingual translation for customers</Typography>} />
                          </ListItem>
                        </List>

                        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: THEME.surface, borderLeft: `4px solid ${THEME.primary}` }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 0.5 }}>
                            Real-time Translation Mode
                          </Typography>
                          <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', lineHeight: 1.4 }}>
                            Automatically translates technical terms into layperson wording for dealer customers, improving clarity and trust.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* 3. Voice-over Guidance Panel */}
                {activeTab === 2 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                          Voice-over Advisor Prompts
                        </Typography>
                        <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                          Embedded real-time voice prompts that guide the service advisor during filming.
                        </Typography>
                      </Box>
                      <Chip label="In Progress" color="warning" size="small" sx={{ fontWeight: 700 }} />
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        {/* Simulation Screen */}
                        <Box sx={{
                          height: 220,
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#0F172A',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 3,
                          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
                        }}>
                          {voicePlaying ? (
                            <Box sx={{ width: '100%', textAlign: 'center' }}>
                              <VolumeUp sx={{ fontSize: 40, color: THEME.primary, mb: 1, animation: 'pulse 1s infinite alternate' }} />
                              <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                                Guidance Step {guideStep + 1}: {voiceScripts[guideStep].title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', minHeight: 40, px: 2 }}>
                                "{voiceScripts[guideStep].text}"
                              </Typography>
                              {/* Waveform lines */}
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 2, height: 24, alignItems: 'center' }}>
                                {[...Array(12)].map((_, i) => (
                                  <Box 
                                    key={i} 
                                    sx={{ 
                                      width: 4, 
                                      backgroundColor: THEME.primary,
                                      borderRadius: 1,
                                      height: `${Math.random() * 100}%`,
                                      animation: `wave 0.8s ease-in-out infinite alternate`,
                                      animationDelay: `${i * 0.08}s`,
                                      '@keyframes wave': {
                                        '0%': { height: '20%' },
                                        '100%': { height: '100%' }
                                      }
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Box>
                          ) : (
                            <Box sx={{ textAlign: 'center' }}>
                              <RecordVoiceOver sx={{ fontSize: 50, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                              <Button 
                                variant="contained" 
                                startIcon={<PlayArrow />}
                                onClick={() => setVoicePlaying(true)}
                                sx={{ backgroundColor: THEME.primary, '&:hover': { backgroundColor: THEME.primaryDark } }}
                              >
                                Test Advisor Guidance
                              </Button>
                            </Box>
                          )}

                          {voicePlaying && (
                            <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                              <IconButton 
                                onClick={() => {
                                  setVoicePlaying(false);
                                  setGuideStep(0);
                                }}
                                sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' } }}
                              >
                                <Pause size="small" />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                          Voice Prompt Library
                        </Typography>
                        <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', mb: 2 }}>
                          These structured guidelines assist service technicians in maintaining standard phrasing.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {voiceScripts.map((script, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                p: 1.5, 
                                borderRadius: 2, 
                                backgroundColor: voicePlaying && guideStep === index ? 'rgba(13, 161, 184, 0.06)' : THEME.surface,
                                borderLeft: `3px solid ${voicePlaying && guideStep === index ? THEME.primary : 'transparent'}`,
                                transition: 'all 0.3s'
                              }}
                            >
                              <Typography variant="caption" sx={{ fontWeight: 700, color: voicePlaying && guideStep === index ? THEME.primary : THEME.textPrimary, display: 'block' }}>
                                {script.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                                {script.text}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* 4. Angle of Video Panel */}
                {activeTab === 3 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                          Intelligent Angle & Framing Verification
                        </Typography>
                        <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                          Checks the video input dynamically for optimal camera positioning and consistency.
                        </Typography>
                      </Box>
                      <Chip label="In Progress" color="warning" size="small" sx={{ fontWeight: 700 }} />
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        {/* Simulation Screen */}
                        <Box sx={{
                          height: 220,
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
                        }}>
                          {/* Simulated Car wheel frame */}
                          <Box 
                            component="div"
                            sx={{
                              width: '90%',
                              height: '90%',
                              backgroundImage: `url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              borderRadius: 2,
                              opacity: 0.9,
                              transform: `rotate(${(cameraAngle - 15) * 0.4}deg)`
                            }}
                          />

                          {/* Grid Overlay */}
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gridTemplateRows: '1fr 1fr 1fr',
                            pointerEvents: 'none'
                          }}>
                            {[...Array(9)].map((_, i) => (
                              <Box key={i} sx={{ border: '0.5px dashed rgba(255,255,255,0.2)' }} />
                            ))}
                          </Box>

                          {/* Dynamic Calibration Gauge Overlay */}
                          <Box sx={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            borderRadius: 2,
                            p: 1.2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Box sx={{ 
                              width: 12, 
                              height: 12, 
                              borderRadius: '50%', 
                              backgroundColor: Math.abs(cameraAngle - 15) <= 5 ? THEME.success : THEME.error,
                              animation: Math.abs(cameraAngle - 15) > 5 ? 'pulse 0.5s infinite alternate' : 'none'
                            }} />
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>
                              Angle: {cameraAngle}° (Target: 15°)
                            </Typography>
                          </Box>

                          {/* Alignment Guide Text */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: 16,
                            backgroundColor: Math.abs(cameraAngle - 15) <= 5 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                            color: '#fff',
                            px: 2,
                            py: 0.5,
                            borderRadius: 3,
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {Math.abs(cameraAngle - 15) <= 5 ? "Angle Aligned & Consistent" : `Tilt Camera ${cameraAngle > 15 ? 'Down' : 'Up'} slightly`}
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                          Simulate Camera Tilt
                        </Typography>
                        
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', mb: 1 }}>
                            Camera Tilt Axis Angle
                          </Typography>
                          <Slider
                            value={cameraAngle}
                            onChange={(e, val) => setCameraAngle(val)}
                            min={0}
                            max={35}
                            sx={{ color: Math.abs(cameraAngle - 15) <= 5 ? THEME.success : THEME.error }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                            <Typography variant="caption" sx={{ color: THEME.textSecondary }}>0° (Low View)</Typography>
                            <Typography variant="caption" sx={{ color: THEME.success, fontWeight: 700 }}>15° (Optimal)</Typography>
                            <Typography variant="caption" sx={{ color: THEME.textSecondary }}>35° (High View)</Typography>
                          </Box>
                        </Box>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                          Camera Alignment Standards
                        </Typography>
                        <List size="small" disablePadding sx={{ mb: 2 }}>
                          <ListItem disableGutters sx={{ py: 0.25 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color: THEME.success, fontSize: 16 }} /></ListItemIcon>
                            <ListItemText primary={<Typography variant="caption" sx={{ color: THEME.textSecondary }}>Provides visual overlay for vehicle framing consistency</Typography>} />
                          </ListItem>
                          <ListItem disableGutters sx={{ py: 0.25 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ color: THEME.success, fontSize: 16 }} /></ListItemIcon>
                            <ListItemText primary={<Typography variant="caption" sx={{ color: THEME.textSecondary }}>Uses computer vision to tag video orientation matches</Typography>} />
                          </ListItem>
                        </List>

                        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: THEME.surface, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                          <Warning sx={{ color: THEME.warning, fontSize: 20, mt: 0.25 }} />
                          <Typography variant="caption" sx={{ color: THEME.textSecondary, lineHeight: 1.4 }}>
                            <strong>Consistent Positioning:</strong> Videos matching the 15° standard view report 24% higher customer satisfaction scores and approvals.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Gantt Chart Section */}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: THEME.textPrimary }}>
          Implementation Timeline
        </Typography>
        <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 4 }}>
          Detailing development phases, pilot rollout, and verification milestones.
        </Typography>

        <Card sx={{ 
          borderRadius: 4, 
          border: `1px solid rgba(0, 0, 0, 0.05)`, 
          background: THEME.white, 
          boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          mb: 6
        }}>
          <CardContent sx={{ p: 4 }}>
            
            {/* Legend */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, justifyContent: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: THEME.primary }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.textSecondary }}>Focus Engineering</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: THEME.bmwBlue }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.textSecondary }}>BMW Review & Input</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: THEME.success }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.textSecondary }}>Pilot Deployment</Typography>
              </Box>
            </Box>

            {/* Gantt Grid Structure */}
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 800 }}>
                {/* Gantt Header Weeks */}
                <Grid container sx={{ borderBottom: `2px solid ${THEME.surface}`, pb: 2, mb: 3 }}>
                  <Grid item xs={3}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: THEME.textPrimary }}>Phase / Deliverable</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container>
                      {['June Wk 1', 'June Wk 2', 'June Wk 3', 'June Wk 4', 'July Wk 1', 'July Wk 2'].map((wk, idx) => (
                        <Grid item xs={2} key={idx} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textSecondary }}>{wk}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>

                {/* Timeline Row 1 */}
                <Grid container sx={{ py: 2, alignItems: 'center', borderBottom: `1px solid ${THEME.surface}` }}>
                  <Grid item xs={3}>
                    <Box sx={{ pr: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>1. Upgrade Scope & Plan Alignment</Typography>
                      <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Initial design & API requirements</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container>
                      <Grid item xs={2}>
                        <Tooltip title="Initial Scope Alignment (Focus Engineering)">
                          <Box sx={{ height: 28, borderRadius: 2, background: THEME.primary, display: 'flex', alignItems: 'center', px: 1 }}>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>Plan</Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={1}>
                        <Tooltip title="BMW Initial Alignment Review">
                          <Box sx={{ height: 28, borderRadius: 2, background: THEME.bmwBlue, ml: 0.5, display: 'flex', alignItems: 'center', px: 1 }}>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>Review</Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={9}></Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Timeline Row 2 */}
                <Grid container sx={{ py: 2, alignItems: 'center', borderBottom: `1px solid ${THEME.surface}` }}>
                  <Grid item xs={3}>
                    <Box sx={{ pr: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>2. Autocorrection & Captions Dev</Typography>
                      <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Algorithm setup & Whisper model testing</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={3}>
                        <Tooltip title="Autocorrection & Caption Pipeline Development (Focus Engineering)">
                          <Box sx={{ height: 28, borderRadius: 2, background: THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>AI Dev</Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={8}></Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Timeline Row 3 */}
                <Grid container sx={{ py: 2, alignItems: 'center', borderBottom: `1px solid ${THEME.surface}` }}>
                  <Grid item xs={3}>
                    <Box sx={{ pr: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>3. Voice-over & Angle Guidance</Typography>
                      <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Guidance algorithms & prompt integration</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={2.5}>
                        <Tooltip title="Voice-over & Angle Guidance Framework (Focus Engineering)">
                          <Box sx={{ height: 28, borderRadius: 2, background: THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>UI Guidance</Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={7.5}></Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Timeline Row 4 */}
                <Grid container sx={{ py: 2, alignItems: 'center', borderBottom: `1px solid ${THEME.surface}` }}>
                  <Grid item xs={3}>
                    <Box sx={{ pr: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>4. Integrated Testing & QA</Typography>
                      <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Staging validation & latency testing</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container>
                      <Grid item xs={4.2}></Grid>
                      <Grid item xs={1.3}>
                        <Tooltip title="QA validation, latency & performance checks (Focus Engineering)">
                          <Box sx={{ height: 28, borderRadius: 2, background: THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>QA</Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={6.5}></Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Timeline Row 5 */}
                <Grid container sx={{ py: 2, alignItems: 'center', borderBottom: `1px solid ${THEME.surface}` }}>
                  <Grid item xs={3}>
                    <Box sx={{ pr: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>5. Pilot Phase Rollout</Typography>
                      <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Validation deployment (BMW Frankfurt & Munich)</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Deployment and Launch at Pilot Dealerships">
                          <Box sx={{ height: 28, borderRadius: 2, background: THEME.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>PILOT</Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={6}></Grid>
                    </Grid>
                  </Grid>
                </Grid>

              </Box>
            </Box>

            {/* Pilot Specifications Box */}
            <Box sx={{ mt: 4, p: 3, borderRadius: 3, backgroundColor: THEME.surface, border: `1px solid rgba(0, 0, 0, 0.05)` }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: THEME.textPrimary, mb: 1 }}>
                    Pilot Scope
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', lineHeight: 1.5 }}>
                    - Rollout restricted to **3 specific dealer locations** (Frankfurt City, Munich East, & Berlin West).<br />
                    - Validation by **24 active service advisors** using upgraded mobile frames.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: THEME.textPrimary, mb: 1 }}>
                    Execution Milestones
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', lineHeight: 1.5 }}>
                    • <strong>Milestone A (June 15):</strong> Completion of Whisper caption API pipeline.<br />
                    • <strong>Milestone B (June 28):</strong> Fully functional dashboard UI testing integration.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: THEME.textPrimary, mb: 1 }}>
                    Alignment & Success Metrics
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', lineHeight: 1.5 }}>
                    • Video correction latency under <strong>2.2s</strong>.<br />
                    • <strong>95%</strong> positive user experience feedback from technicians during pilot.
                  </Typography>
                </Grid>
              </Grid>
            </Box>

          </CardContent>
        </Card>

        {/* Post-Pilot Scaling & Roadmap */}
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: THEME.textPrimary }}>
          Post-Pilot Scaling & Future Enhancement Roadmap
        </Typography>
        <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 4 }}>
          Structured approach to scaling the upgrades platform-wide based on pilot feedback.
        </Typography>

        <Grid container spacing={3}>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 4, 
              border: `1px solid rgba(16, 185, 129, 0.25)`, 
              background: THEME.white, 
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.05)',
              position: 'relative',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip icon={<CheckCircle sx={{ fontSize: 16 }} />} label="Phase 1 (Completed)" color="success" size="small" sx={{ fontWeight: 700 }} />
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700 }}>July - Aug</Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                  Continuous Feedback Loop
                </Typography>
                <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Identify and log enhancement areas requested during pilot operations. Deploy rapid sub-second improvements to AI translation performance.
                </Typography>
                <Chip icon={<CheckCircle sx={{ fontSize: 14 }} />} label="Status: Active & Completed" size="small" color="success" variant="outlined" sx={{ mb: 2, fontWeight: 700, fontSize: '0.75rem' }} />
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 0.5 }}>
                  Ownership:
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                  • <strong>Focus Engineering:</strong> Bug fixes, pipeline refinements<br />
                  • <strong>BMW:</strong> Feedback collection & approval review
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 4, 
              border: `1px solid rgba(16, 185, 129, 0.25)`, 
              background: THEME.white, 
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.05)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip icon={<CheckCircle sx={{ fontSize: 16 }} />} label="Phase 2 (Rolled Out & Completed)" color="success" size="small" sx={{ fontWeight: 700 }} />
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700 }}>Sept - Oct</Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                  Custom Dealer Branding
                </Typography>
                <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Deploy custom branding options, including specific font files, logo overlay setups, and watermarking directly inside the video engine.
                </Typography>
                <Chip icon={<CheckCircle sx={{ fontSize: 14 }} />} label="Status: Rolled Out & Active" size="small" color="success" variant="outlined" sx={{ mb: 2, fontWeight: 700, fontSize: '0.75rem' }} />
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 0.5 }}>
                  Ownership:
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                  • <strong>Focus Engineering:</strong> Styling features, watermarking pipeline<br />
                  • <strong>BMW:</strong> Design specifications alignment
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 4, 
              border: `1px solid rgba(0, 0, 0, 0.05)`, 
              background: THEME.white, 
              boxShadow: '0 10px 25px rgba(0,0,0,0.02)',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip label="Phase 3 (Global Scale)" color="success" size="small" sx={{ fontWeight: 700 }} />
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700 }}>Nov onwards</Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: THEME.textPrimary }}>
                  Dealer Network Scaling
                </Typography>
                <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  Full-scale rollout of upgraded dashboard across global BMW networks. Enable high-capacity processing queue servers.
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 0.5 }}>
                  Ownership:
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                  • <strong>Focus Engineering:</strong> Scaled cloud infrastructure provisioning<br />
                  • <strong>BMW:</strong> Dealer onboarding & change management
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

      </Container>
    </Box>
  );
}
