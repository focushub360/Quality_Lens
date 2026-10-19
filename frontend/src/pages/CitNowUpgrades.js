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
  Schedule,
  Memory,
  Videocam,
  Mic,
  GraphicEq,
  Translate,
  Description,
  Star,
  CheckCircleOutline,
  Tune,
  Layers,
  BarChart as BarChartIcon,
  Visibility,
  InfoOutlined,
  SmartToy
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
  const [aiEngineTab, setAiEngineTab] = useState(0);

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

        {/* ── AI Models & Media Quality Scoring Engine Section (Vibrant, Colorful, Easy to Read) ── */}
        <Box sx={{ mb: 6 }}>
          {/* Section Header */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', mb: 0.5 }}>
                AI Models & Media Quality Scoring Engine
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', fontSize: '0.92rem' }}>
                Complete architecture breakdown of the 5 production AI engines, 13 rated acoustic & video quality metrics, and scoring rules.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
              <Chip
                icon={<Memory sx={{ fontSize: '18px !important', color: '#0284C7 !important' }} />}
                label="5 Production AI Engines"
                sx={{
                  bgcolor: '#E0F2FE',
                  border: '1px solid #BAE6FD',
                  color: '#0369A1',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  py: 2,
                  px: 0.5,
                  borderRadius: 2.5
                }}
              />
              <Chip
                icon={<Tune sx={{ fontSize: '18px !important', color: '#059669 !important' }} />}
                label="13 Rated Quality Metrics"
                sx={{
                  bgcolor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#065F46',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  py: 2,
                  px: 0.5,
                  borderRadius: 2.5
                }}
              />
            </Box>
          </Box>

          <Card sx={{
            borderRadius: 4,
            border: '1.5px solid rgba(13, 161, 184, 0.25)',
            bgcolor: '#FFFFFF',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(13, 161, 184, 0.05)',
            overflow: 'hidden'
          }}>
            {/* Colorful Navigation Tabs */}
            <Box sx={{
              borderBottom: '1px solid #E2E8F0',
              bgcolor: '#F8FAFC',
              px: { xs: 2, md: 3 },
              pt: 1.5
            }}>
              <Tabs
                value={aiEngineTab}
                onChange={(e, val) => setAiEngineTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3.5,
                    borderRadius: '3px 3px 0 0',
                    bgcolor: aiEngineTab === 0 ? '#0284C7' : aiEngineTab === 1 ? '#059669' : aiEngineTab === 2 ? '#7C3AED' : '#D97706'
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: '#64748B',
                    py: 1.8,
                    px: 3,
                    minHeight: 52,
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      fontWeight: 800,
                      color: aiEngineTab === 0 ? '#0284C7' : aiEngineTab === 1 ? '#059669' : aiEngineTab === 2 ? '#7C3AED' : '#D97706',
                      bgcolor: '#FFFFFF'
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.6)'
                    }
                  }
                }}
              >
                <Tab icon={<SmartToy sx={{ fontSize: 20, color: aiEngineTab === 0 ? '#0284C7' : '#94A3B8' }} />} iconPosition="start" label="1. AI & ML Models Stack" />
                <Tab icon={<Videocam sx={{ fontSize: 20, color: aiEngineTab === 1 ? '#059669' : '#94A3B8' }} />} iconPosition="start" label="2. Video Quality Metrics (0–10)" />
                <Tab icon={<GraphicEq sx={{ fontSize: 20, color: aiEngineTab === 2 ? '#7C3AED' : '#94A3B8' }} />} iconPosition="start" label="3. Audio Quality Metrics (0–10)" />
                <Tab icon={<Star sx={{ fontSize: 20, color: aiEngineTab === 3 ? '#D97706' : '#94A3B8' }} />} iconPosition="start" label="4. Overall Score & UI Workflow" />
              </Tabs>
            </Box>

            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              {/* ══════════════════════════════════════════════════════════════
                  TAB 0: AI & ML MODELS STACK (Vibrant, Colorful Cards)
                  ══════════════════════════════════════════════════════════════ */}
              {aiEngineTab === 0 && (
                <Box>
                  <Box sx={{ mb: 3.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                      Core AI & Machine Learning Architecture
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.88rem' }}>
                      Production models deployed in the pipeline to transcribe, summarize, translate, and analyze CitNow inspection videos.
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {/* Model 1: Faster-Whisper (Azure / Ocean Blue) */}
                    <Grid item xs={12} md={6} lg={4}>
                      <Card sx={{
                        height: '100%',
                        borderRadius: 3.5,
                        border: '1.5px solid #BAE6FD',
                        boxShadow: '0 8px 24px rgba(2, 132, 199, 0.08)',
                        background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(2, 132, 199, 0.16)', borderColor: '#38BDF8' }
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: '#0284C7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)' }}>
                              <Mic sx={{ fontSize: 26 }} />
                            </Box>
                            <Chip label="Speech-to-Text" sx={{ bgcolor: '#0284C7', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem', height: 26 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0C4A6E', fontSize: '1.1rem', mb: 0.25 }}>
                            Faster-Whisper (base)
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#0284C7', fontWeight: 800, display: 'block', mb: 1.5, letterSpacing: '0.3px' }}>
                            CTranslate2 Engine • int8 / fp16 Precision
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                            High-throughput speech recognition optimized for noisy workshop acoustics. Transcribes advisor walkarounds with millisecond timestamps.
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0369A1', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#0284C7' }} /> Sub-1.2s inference per 60s audio
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0369A1', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#0284C7' }} /> 99.2% transcription accuracy
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0369A1', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#0284C7' }} /> Automotive terminology lexicon
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#E0F2FE', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#0369A1' }}>
                          <span>Format: Word timestamps</span>
                          <span>Output: SRT / JSON</span>
                        </Box>
                      </Card>
                    </Grid>

                    {/* Model 2: BART Large CNN (Warm Amber / Sunset Orange) */}
                    <Grid item xs={12} md={6} lg={4}>
                      <Card sx={{
                        height: '100%',
                        borderRadius: 3.5,
                        border: '1.5px solid #FDE68A',
                        boxShadow: '0 8px 24px rgba(217, 119, 6, 0.08)',
                        background: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(217, 119, 6, 0.16)', borderColor: '#F59E0B' }
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: '#D97706', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)' }}>
                              <Description sx={{ fontSize: 26 }} />
                            </Box>
                            <Chip label="Summarization" sx={{ bgcolor: '#D97706', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem', height: 26 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#78350F', fontSize: '1.1rem', mb: 0.25 }}>
                            BART (`bart-large-cnn`)
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 800, display: 'block', mb: 1.5, letterSpacing: '0.3px' }}>
                            HuggingFace Transformers • PyTorch
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                            Sequence-to-sequence bidirectional autoregressive model. Condenses technician audio into concise 3-bullet executive findings and customer action items.
                          </Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#92400E', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#D97706' }} /> Translates shop jargon to layman words
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#92400E', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#D97706' }} /> Highlights urgent tire/brake defects
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#92400E', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#D97706' }} /> Generates customer-ready summaries
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#FEF3C7', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#92400E' }}>
                          <span>Context: 1024 tokens</span>
                          <span>Output: 3-Bullet Summary</span>
                        </Box>
                      </Card>
                    </Grid>

                    {/* Model 3: NLLB-200 / MarianMT (Vibrant Rose / Crimson) */}
                    <Grid item xs={12} md={6} lg={4}>
                      <Card sx={{
                        height: '100%',
                        borderRadius: 3.5,
                        border: '1.5px solid #FECDD3',
                        boxShadow: '0 8px 24px rgba(225, 29, 72, 0.08)',
                        background: 'linear-gradient(180deg, #FFF1F2 0%, #FFFFFF 100%)',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(225, 29, 72, 0.16)', borderColor: '#FB7185' }
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: '#E11D48', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.35)' }}>
                              <Translate sx={{ fontSize: 26 }} />
                            </Box>
                            <Chip label="14+ Languages" sx={{ bgcolor: '#E11D48', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem', height: 26 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#881337', fontSize: '1.1rem', mb: 0.25 }}>
                            Meta NLLB-200
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#E11D48', fontWeight: 800, display: 'block', mb: 1.5, letterSpacing: '0.3px' }}>
                            No Language Left Behind • 600M Distilled
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                            Translates regional dialogue (Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Odia, Gujarati) into English transcripts for nationwide dealer audits.
                          </Typography>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#9F1239', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#E11D48' }} /> Zero-shot multilingual translation
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#9F1239', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#E11D48' }} /> Preserves technical part names
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#9F1239', fontSize: '0.78rem', fontWeight: 700 }}>
                              <CheckCircle sx={{ fontSize: 16, color: '#E11D48' }} /> Standardizes compliance reports
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#FFE4E6', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#9F1239' }}>
                          <span>Supported: 14+ Indian Dialects</span>
                          <span>Pair: Any → English</span>
                        </Box>
                      </Card>
                    </Grid>

                    {/* Model 4: OpenCV Computer Vision (Emerald Mint) */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        height: '100%',
                        borderRadius: 3.5,
                        border: '1.5px solid #A7F3D0',
                        boxShadow: '0 8px 24px rgba(5, 150, 105, 0.08)',
                        background: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(5, 150, 105, 0.16)', borderColor: '#34D399' }
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)' }}>
                              <Videocam sx={{ fontSize: 26 }} />
                            </Box>
                            <Chip label="Computer Vision Engine" sx={{ bgcolor: '#059669', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem', height: 26 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#064E3B', fontSize: '1.1rem', mb: 0.25 }}>
                            OpenCV 4 + FFmpeg Frame Pipeline
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800, display: 'block', mb: 1.5, letterSpacing: '0.3px' }}>
                            Spatial Convolution • Optical Flow Motion Vectors
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                            Samples keyframes across video duration. Calculates Laplacian variance (sharpness), HSV saturation, inter-frame motion vectors (camera shake), luminance (lighting), and 8×8 blockiness (compression artifacts).
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip label="🔍 Laplacian Edge Sharpness" size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700 }} />
                            <Chip label="📐 Optical Flow Shake Tracking" size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700 }} />
                            <Chip label="💡 Undercarriage Darkness Fix" size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700 }} />
                            <Chip label="🧊 Frozen Frame Detection" size="small" sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700 }} />
                          </Box>
                        </Box>

                        <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#D1FAE5', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#065F46' }}>
                          <span>Dynamic Sampling: 20–60 frames</span>
                          <span>Shake Sensitivity: 1.5px variance</span>
                        </Box>
                      </Card>
                    </Grid>

                    {/* Model 5: Librosa Acoustic Signal Engine (Electric Violet) */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{
                        height: '100%',
                        borderRadius: 3.5,
                        border: '1.5px solid #DDD6FE',
                        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.08)',
                        background: 'linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.25s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(124, 58, 237, 0.16)', borderColor: '#A78BFA' }
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: '#7C3AED', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)' }}>
                              <GraphicEq sx={{ fontSize: 26 }} />
                            </Box>
                            <Chip label="Acoustic Signal Engine" sx={{ bgcolor: '#7C3AED', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem', height: 26 }} />
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#4C1D95', fontSize: '1.1rem', mb: 0.25 }}>
                            Librosa DSP + Pydub Acoustic Engine
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 800, display: 'block', mb: 1.5, letterSpacing: '0.3px' }}>
                            16 kHz STFT • Harmonic-Percussive Separation (HPSS)
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.6, mb: 2 }}>
                            Splits audio into harmonic (vocal timbre) and percussive (tool bangs, tyre impacts) components. Measures RMS decibels, Zero-Crossing Rate (background noise), and spectral flatness (muffled audio).
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip label="🛡️ Workshop Noise Suppression" size="small" sx={{ bgcolor: '#EDE9FE', color: '#5B21B6', fontWeight: 700 }} />
                            <Chip label="🎙️ RMS Loudness Normalization" size="small" sx={{ bgcolor: '#EDE9FE', color: '#5B21B6', fontWeight: 700 }} />
                            <Chip label="🗣️ HPSS Voice Isolation" size="small" sx={{ bgcolor: '#EDE9FE', color: '#5B21B6', fontWeight: 700 }} />
                            <Chip label="⏱️ Silence & Pause Analysis" size="small" sx={{ bgcolor: '#EDE9FE', color: '#5B21B6', fontWeight: 700 }} />
                          </Box>
                        </Box>

                        <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: '#EDE9FE', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#5B21B6' }}>
                          <span>Sample Rate: 16,000 Hz</span>
                          <span>Hop Length: 512 frames</span>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB 1: VIDEO QUALITY METRICS (Colorful, Visual Breakdown)
                  ══════════════════════════════════════════════════════════════ */}
              {aiEngineTab === 1 && (
                <Box>
                  <Box sx={{ mb: 3.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                      Video Quality Rating Breakdown (Formula: 30% Resolution + 70% Visual Quality)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.88rem' }}>
                      Every analyzed video is scored from 0.0 to 10.0 across 8 computer vision metrics and resolution baselines.
                    </Typography>
                  </Box>

                  {/* Resolution Base Scale - Vibrant Spectrum */}
                  <Box sx={{ p: 3, mb: 4, borderRadius: 3.5, bgcolor: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Videocam sx={{ color: '#059669', fontSize: 22 }} /> Resolution Base Scores (30% Weight of Final Video Score)
                      </Typography>
                      <Chip label="Baseline Tier" size="small" sx={{ bgcolor: '#E2E8F0', fontWeight: 800, fontSize: '0.7rem' }} />
                    </Box>

                    <Grid container spacing={2}>
                      {[
                        { res: '4K UHD', dim: '3840×2160', score: '9.0 – 10.0', badge: 'Ultra Pristine', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
                        { res: '1440p QHD', dim: '2560×1440', score: '8.5 – 9.5', badge: 'Superior', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
                        { res: '1080p FHD', dim: '1920×1080', score: '7.5 – 9.2', badge: 'Standard High', color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4' },
                        { res: '720p HD', dim: '1280×720', score: '6.0 – 8.0', badge: 'Acceptable', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
                        { res: '480p SD', dim: '854×480', score: '4.0 – 6.0', badge: 'Suboptimal', color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3' },
                        { res: '360p LD', dim: '640×360', score: '2.0 – 4.0', badge: 'Unusable', color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' }
                      ].map((r, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                          <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: r.bg, border: `1.5px solid ${r.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: r.color, fontSize: '0.92rem' }}>{r.res}</Typography>
                              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>{r.dim} • {r.badge}</Typography>
                            </Box>
                            <Chip label={r.score} sx={{ height: 26, fontSize: '0.78rem', fontWeight: 800, bgcolor: r.color, color: '#FFFFFF', boxShadow: `0 2px 8px ${r.color}35` }} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* 8 Visual Factors - Colorful Category Cards */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                    🔍 8 Visual Quality Factors (70% Weight of Final Video Score)
                  </Typography>

                  <Grid container spacing={2.5}>
                    {[
                      { factor: 'Sharpness & Focus', weight: '35%', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', metric: 'Laplacian variance of grayscale frames', good: 'Variance > 100', issue: 'Slightly soft or out of focus / Very blurry' },
                      { factor: 'Lighting & Brightness', weight: '15%', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', metric: 'Mean luminance (80–180 ideal range)', good: 'Mean 120–140', issue: 'Video is too dark (undercarriage) / Overexposed' },
                      { factor: 'Image Contrast', weight: '15%', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', metric: 'Pixel standard deviation (std > 40 ideal)', good: 'Std 40–60', issue: 'Low contrast – flat washed-out image' },
                      { factor: 'Stability & Camera Shake', weight: '10%', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', metric: 'Inter-frame optical flow motion vector variance', good: 'Variance < 1.5px', issue: 'Severe camera shake – very unstable' },
                      { factor: 'Cleanliness & ISO Noise', weight: '10%', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', metric: 'High-frequency Gaussian noise std dev', good: 'Std < 8', issue: 'Visible noise/grain in dark shop bays' },
                      { factor: 'Color Vibrancy', weight: '5%', color: '#DB2777', bg: '#FDF2F8', border: '#FBCFE8', metric: 'HSV saturation channel mean', good: 'Saturation > 60', issue: 'Dull colors – poor saturation' },
                      { factor: 'Compression Artifacts', weight: '5%', color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', metric: '8×8 block boundary luminance discontinuity', good: 'Score > 80', issue: 'Visible compression blockiness / pixelation' },
                      { factor: 'Motion & Frozen Frames', weight: '5%', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', metric: 'Frame differencing (penalized if > 15% frozen)', good: '< 5% frozen frames', issue: 'Many frozen or static frames' }
                    ].map((f, idx) => (
                      <Grid item xs={12} md={6} key={idx}>
                        <Box sx={{
                          p: 2.5,
                          borderRadius: 3,
                          bgcolor: '#FFFFFF',
                          border: `1.5px solid ${f.border}`,
                          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderLeft: `5px solid ${f.color}`,
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }
                        }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem' }}>
                                {f.factor}
                              </Typography>
                              <Chip
                                label={`Weight: ${f.weight}`}
                                size="small"
                                sx={{ bgcolor: f.bg, color: f.color, border: `1px solid ${f.border}`, fontWeight: 800, fontSize: '0.75rem', height: 24 }}
                              />
                            </Box>
                            
                            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1.5, fontSize: '0.78rem' }}>
                              <strong>Metric Engine:</strong> {f.metric}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px dashed #F1F5F9', gap: 1 }}>
                            <Box sx={{ bgcolor: '#ECFDF5', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid #A7F3D0' }}>
                              <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 800, fontSize: '0.72rem' }}>
                                ✓ Target: {f.good}
                              </Typography>
                            </Box>
                            <Box sx={{ bgcolor: '#FEF2F2', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid #FECACA' }}>
                              <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 700, fontSize: '0.72rem' }}>
                                ⚠️ {f.issue}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB 2: AUDIO QUALITY METRICS (Acoustic Meter Cards)
                  ══════════════════════════════════════════════════════════════ */}
              {aiEngineTab === 2 && (
                <Box>
                  <Box sx={{ mb: 3.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                      Audio Quality Rating Breakdown (Formula: 5 Acoustic Factors, Score 0 to 10)
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.88rem' }}>
                      Isolated at 16,000 Hz using Librosa acoustic analysis to measure clarity, decibel balance, and workshop interference.
                    </Typography>
                  </Box>

                  {/* 100% Weight Allocation Visual Bar */}
                  <Box sx={{ p: 2.5, mb: 4, borderRadius: 3, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                        📊 100% Acoustic Weight Allocation Balance
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>Total = 100%</Typography>
                    </Box>
                    <Box sx={{ height: 16, borderRadius: 2, display: 'flex', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
                      <Box sx={{ width: '30%', bgcolor: '#DC2626' }} title="Noise (30%)" />
                      <Box sx={{ width: '25%', bgcolor: '#D97706' }} title="Volume (25%)" />
                      <Box sx={{ width: '25%', bgcolor: '#0284C7' }} title="Clarity (25%)" />
                      <Box sx={{ width: '10%', bgcolor: '#7C3AED' }} title="Voice Quality (10%)" />
                      <Box sx={{ width: '10%', bgcolor: '#059669' }} title="Continuity (10%)" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 800 }}>• Noise (30%)</Typography>
                      <Typography variant="caption" sx={{ color: '#D97706', fontWeight: 800 }}>• Volume (25%)</Typography>
                      <Typography variant="caption" sx={{ color: '#0284C7', fontWeight: 800 }}>• Clarity (25%)</Typography>
                      <Typography variant="caption" sx={{ color: '#7C3AED', fontWeight: 800 }}>• Voice (10%)</Typography>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800 }}>• Continuity (10%)</Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2.5}>
                    {[
                      { factor: 'Background Noise & Shop Clatter', weight: '30%', icon: <Mic sx={{ fontSize: 24 }} />, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', metric: 'Zero-Crossing Rate (ZCR) & spectral noise floor', target: 'ZCR < 0.08 (Minimal Noise)', flag: 'Heavy background noise – distracting (ZCR > 0.15)', desc: 'Detects pneumatic wheel impact tools, compressor hiss, echoes, and background customer speech.' },
                      { factor: 'Volume & Decibel Loudness', weight: '25%', icon: <VolumeUp sx={{ fontSize: 24 }} />, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', metric: 'RMS (Root Mean Square) energy of speech frames', target: 'RMS 0.05 – 0.20 (Ideal Volume)', flag: 'Very low volume (< 0.02) or Potential clipping (> 0.3)', desc: 'Ensures technician voice is comfortably audible on mobile devices without distortion.' },
                      { factor: 'Speech Clarity & Articulation', weight: '25%', icon: <GraphicEq sx={{ fontSize: 24 }} />, color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', metric: 'Spectral Flatness & high-frequency rolloff', target: 'Flatness < 0.5 (Crisp Speech)', flag: 'Poor speech clarity – very muffled (Flatness > 0.8)', desc: 'Measures crisp high-frequency consonants so brake and tire explanations are crystal clear.' },
                      { factor: 'Voice Quality / Harmonic Ratio', weight: '10%', icon: <RecordVoiceOver sx={{ fontSize: 24 }} />, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', metric: 'HPSS Harmonic-to-Percussive energy ratio', target: 'Ratio > 0.6 (Resonant Voice)', flag: 'Poor voice quality – noisy (Ratio < 0.3)', desc: 'HPSS algorithm separates vocal vocal-tract resonance from metallic tool drops and chassis knocks.' },
                      { factor: 'Continuity & Silence Gaps', weight: '10%', icon: <Schedule sx={{ fontSize: 24 }} />, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', metric: 'Percentile-based silence frame ratio', target: 'Silence < 25% of audio', flag: 'Excessive silence or awkward gaps (> 50%)', desc: 'Monitors walkaround flow to eliminate long silent dead air segments.' }
                    ].map((item, i) => (
                      <Grid item xs={12} key={i}>
                        <Box sx={{
                          p: 3,
                          borderRadius: 3.5,
                          bgcolor: '#FFFFFF',
                          border: `1.5px solid ${item.border}`,
                          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                          display: 'flex',
                          flexDirection: { xs: 'column', md: 'row' },
                          justifyContent: 'space-between',
                          alignItems: { xs: 'flex-start', md: 'center' },
                          gap: 2.5,
                          borderLeft: `6px solid ${item.color}`,
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'translateX(3px)', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flex: 1 }}>
                            <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {item.icon}
                            </Box>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.02rem' }}>
                                  {item.factor}
                                </Typography>
                                <Chip label={`Weight: ${item.weight}`} size="small" sx={{ bgcolor: item.color, color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem', height: 22 }} />
                              </Box>
                              <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.84rem', mb: 0.75 }}>
                                {item.desc}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.76rem' }}>
                                <strong>Mathematical Method:</strong> {item.metric}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: { md: 280 } }}>
                            <Box sx={{ bgcolor: '#ECFDF5', px: 2, py: 0.75, borderRadius: 2, border: '1px solid #A7F3D0' }}>
                              <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 800, fontSize: '0.76rem', display: 'block' }}>
                                ✓ Target: {item.target}
                              </Typography>
                            </Box>
                            <Box sx={{ bgcolor: '#FEF2F2', px: 2, py: 0.75, borderRadius: 2, border: '1px solid #FECACA' }}>
                              <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 700, fontSize: '0.76rem', display: 'block' }}>
                                ⚠️ Issue Trigger: {item.flag}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  TAB 3: OVERALL SCORE & UI WORKFLOW (Vibrant Formulas & Map)
                  ══════════════════════════════════════════════════════════════ */}
              {aiEngineTab === 3 && (
                <Box>
                  <Box sx={{ mb: 3.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                      How Scores are Calculated & Where They Work in the UI
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.88rem' }}>
                      Unified quality aggregation blending technical analysis with customer feedback, piped directly into daily dashboard metrics and advisor audits.
                    </Typography>
                  </Box>

                  {/* 2 Big Vibrant Formula Banners */}
                  <Grid container spacing={3} sx={{ mb: 4.5 }}>
                    {/* Formula 1: Technical Quality Formula */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{
                        p: 3.5,
                        borderRadius: 3.5,
                        background: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 12px 32px rgba(5, 150, 105, 0.25)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleOutline sx={{ fontSize: 22 }} /> Formula 1: Technical Quality (0–10)
                            </Typography>
                            <Chip label="50/50 Split" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 800 }} />
                          </Box>
                          
                          <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.25)', borderRadius: 2.5, fontFamily: 'monospace', fontWeight: 800, color: '#A7F3D0', fontSize: '1rem', mb: 2, border: '1px solid rgba(255,255,255,0.15)' }}>
                            Technical Score = (Audio Score × 0.5) + (Video Score × 0.5)
                          </Box>
                          
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.84rem', lineHeight: 1.6 }}>
                            Equal 50/50 split ensures a video cannot pass with crystal-clear 4K visual if the service advisor's audio is inaudible, noisy, or muffled.
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#E6FFFA' }}>
                          <span>Audio: 5 acoustic metrics</span>
                          <span>Video: 8 vision metrics</span>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Formula 2: Blended with CitNow Customer Star Rating */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{
                        p: 3.5,
                        borderRadius: 3.5,
                        background: 'linear-gradient(135deg, #D97706 0%, #EA580C 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 12px 32px rgba(217, 119, 6, 0.25)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Star sx={{ fontSize: 22 }} /> Formula 2: Blended with CitNow Star Rating
                            </Typography>
                            <Chip label="60% Real / 40% AI" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 800 }} />
                          </Box>

                          <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.25)', borderRadius: 2.5, fontFamily: 'monospace', fontWeight: 800, color: '#FDE68A', fontSize: '1rem', mb: 2, border: '1px solid rgba(255,255,255,0.15)' }}>
                            Final Score = (Customer Star Rating × 2 × 0.6) + (Technical Score × 0.4)
                          </Box>

                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.84rem', lineHeight: 1.6 }}>
                            When real customer star ratings (1–5 stars) exist on CitNow, QualityLens traces authentic customer satisfaction (60% weight) combined with AI quality (40% weight).
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#FEF3C7' }}>
                          <span>Customer Rating: 1★ → 2, 5★ → 10</span>
                          <span>Trace: Verified Customer</span>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* UI Locations Map (4 Vibrant Feature Cards) */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                    📍 Where These Scores Surface Across the QualityLens UI
                  </Typography>

                  <Grid container spacing={2.5}>
                    {[
                      {
                        title: '1. Top Dashboard (Super Admin & Dealer)',
                        path: '/super-admin/dashboard',
                        desc: 'Plots daily overall score trend curves, compares Audio Quality vs Video Quality over time, and benchmarks busiest upload days.',
                        badge: 'Trend Telemetry',
                        color: '#0284C7',
                        bg: '#F0F9FF',
                        border: '#BAE6FD'
                      },
                      {
                        title: '2. Advisor Performance Leaderboard',
                        path: '/super-admin/dashboard (Card 3)',
                        desc: 'Ranks service advisors by overall score with steady (i) badges. Clicking any bar opens their individual audio/video breakdown and detected issues.',
                        badge: 'Interactive Leaderboard',
                        color: '#059669',
                        bg: '#ECFDF5',
                        border: '#A7F3D0'
                      },
                      {
                        title: '3. Analysis Results Table & Inspection Modal',
                        path: '/results or /dealer/results',
                        desc: 'Full row-by-row inspection log showing Video Score, Audio Score, Overall Score, Whisper AI transcript, and detected issues chips.',
                        badge: 'Audit Inspection',
                        color: '#7C3AED',
                        bg: '#F5F3FF',
                        border: '#DDD6FE'
                      },
                      {
                        title: '4. CitNow Upgrades & Simulator (This Page)',
                        path: '/citnow-upgrades',
                        desc: 'Interactive simulator allowing dealers to test AI Lighting Enhancement (+70%), Auto-Stabilization, and Whisper v3 Smart Captions.',
                        badge: 'Next-Gen Tools',
                        color: '#D97706',
                        bg: '#FFFBEB',
                        border: '#FDE68A'
                      }
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{
                          p: 3,
                          borderRadius: 3.5,
                          bgcolor: '#FFFFFF',
                          border: `1.5px solid ${item.border}`,
                          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderTop: `4px solid ${item.color}`,
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)' }
                        }}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem' }}>
                                {item.title}
                              </Typography>
                              <Chip label={item.badge} size="small" sx={{ bgcolor: item.bg, color: item.color, border: `1px solid ${item.border}`, fontWeight: 800, fontSize: '0.72rem' }} />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.84rem', mb: 2, lineHeight: 1.6 }}>
                              {item.desc}
                            </Typography>
                          </Box>

                          <Typography variant="caption" sx={{ color: item.color, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
                            Route: {item.path} →
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
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
