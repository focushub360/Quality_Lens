// src/components/layout/TechLuxuryLayout.js
import React, { useState } from 'react';
import { Box, Typography, Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import {
  DashboardOutlined,
  AddCircleOutline,
  CloudUploadOutlined,
  AssessmentOutlined,
  GroupOutlined,
  BoltOutlined,
  SettingsOutlined,
  PersonOutline,
  KeyboardArrowDown,
  Logout as LogoutIcon,
  Tune,
  VpnKey,
  Sensors,
  Speed,
  DesktopWindows,
  AddToQueue,
  Business,
  Terminal
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GlobalAnalysisMonitor } from './Sidebar';

const PAGE_META = {
  '/super-admin/dashboard': {
    eyebrow: 'ANALYTICS & INSIGHTS',
    title: 'Performance at a Glance',
    subtitle: 'Real-time telemetry and core operational benchmarks across all connected dealerships',
    sloganTop: 'DRIVEN BY DATA.',
    sloganBottom: 'BUILT FOR BETTER.',
  },
  '/': {
    eyebrow: 'ANALYTICS & INSIGHTS',
    title: 'Performance at a Glance',
    subtitle: 'Real-time telemetry and core operational benchmarks across all connected dealerships',
    sloganTop: 'DRIVEN BY DATA.',
    sloganBottom: 'BUILT FOR BETTER.',
  },
  '/super-admin/monitor': {
    eyebrow: 'SYSTEM TELEMETRY',
    title: 'Live Telemetry & Diagnostics',
    subtitle: 'Real-time cluster health, active worker processes, and processing pipeline queues',
    sloganTop: 'PRECISION TELEMETRY.',
    sloganBottom: 'ACTIVE INTELLIGENCE.',
  },
  '/dealer/results': {
    eyebrow: 'QUALITY AUDIT',
    title: 'Analysis Results',
    subtitle: 'Comprehensive video and audio inspection reports across dealership uploads',
    sloganTop: 'DEEP INSPECTION.',
    sloganBottom: 'MEASURED EXCELLENCE.',
  },
  '/dealer/new': {
    eyebrow: 'MEDIA PROCESSING',
    title: 'New Video Analysis',
    subtitle: 'Upload and evaluate single video walkarounds against quality benchmarks',
    sloganTop: 'INSTANT SCORING.',
    sloganBottom: 'ACTIONABLE FEEDBACK.',
  },
  '/dealer/bulk': {
    eyebrow: 'BATCH PIPELINE',
    title: 'Bulk Upload Engine',
    subtitle: 'Batch process multi-vehicle video inventories with parallel queueing',
    sloganTop: 'HIGH THROUGHPUT.',
    sloganBottom: 'ENTERPRISE SCALE.',
  },
  '/master-admin/console': {
    eyebrow: 'CORE INFRASTRUCTURE',
    title: 'Tech & Operations Console',
    subtitle: 'Low-level engine controls, worker lifecycle, and quota capping management',
    sloganTop: 'SYSTEM MASTERY.',
    sloganBottom: 'UNCOMPROMISED UPTIME.',
  },
  '/master-admin/credentials': {
    eyebrow: 'SECURITY & ACCESS',
    title: 'Credentials Vault',
    subtitle: 'Secure API tokens, third-party credentials, and encrypted service secrets',
    sloganTop: 'ZERO TRUST.',
    sloganBottom: 'MAXIMUM SECURITY.',
  },
  '/master-admin/live': {
    eyebrow: 'REAL-TIME TELEMETRY',
    title: 'Live Activity Stream',
    subtitle: 'Instantaneous event logs, worker executions, and websocket heartbeat',
    sloganTop: 'LIVE PULSE.',
    sloganBottom: 'CONTINUOUS TRACING.',
  },
  '/super-admin/live': {
    eyebrow: 'REAL-TIME TELEMETRY',
    title: 'Live Activity Stream',
    subtitle: 'Instantaneous event logs, worker executions, and websocket heartbeat',
    sloganTop: 'LIVE PULSE.',
    sloganBottom: 'CONTINUOUS TRACING.',
  },
  '/master-admin/performance': {
    eyebrow: 'HARDWARE & ENGINE',
    title: 'Performance Diagnostics',
    subtitle: 'Hardware acceleration, CPU/GPU utilization, and memory profiling',
    sloganTop: 'PEAK EFFICIENCY.',
    sloganBottom: 'OPTIMIZED COMPUTE.',
  },
  '/super-admin/performance': {
    eyebrow: 'HARDWARE & ENGINE',
    title: 'Performance Diagnostics',
    subtitle: 'Hardware acceleration, CPU/GPU utilization, and memory profiling',
    sloganTop: 'PEAK EFFICIENCY.',
    sloganBottom: 'OPTIMIZED COMPUTE.',
  },
  '/super-admin/uploads': {
    eyebrow: 'INGESTION ENGINE',
    title: 'Uploads & Processing Queue',
    subtitle: 'Live upload tracking, ingestion queue status, and retry controls',
    sloganTop: 'RELIABLE INGEST.',
    sloganBottom: 'ZERO DATA LOSS.',
  },
  '/super-admin/users': {
    eyebrow: 'DIRECTORY & ACCESS',
    title: 'Team & User Management',
    subtitle: 'Configure administrative privileges, roles, and dealer team access',
    sloganTop: 'ROLE-BASED ACCESS.',
    sloganBottom: 'TOTAL GOVERNANCE.',
  },
  '/super-admin/dealers': {
    eyebrow: 'NETWORK OVERVIEW',
    title: 'Dealer Network Operations',
    subtitle: 'Manage connected dealer groups, franchises, and regional branches',
    sloganTop: 'CONNECTED NETWORK.',
    sloganBottom: 'DEALER SUCCESS.',
  },
  '/dealer/dashboard': {
    eyebrow: 'DEALERSHIP INTELLIGENCE',
    title: 'Dealer Overview & Metrics',
    subtitle: 'Operational benchmarks, branch breakdown, and performance targets',
    sloganTop: 'LOCAL PRECISION.',
    sloganBottom: 'PROVEN OUTCOMES.',
  },
  '/dealer/users': {
    eyebrow: 'BRANCH ACCESS',
    title: 'Dealer Staff Directory',
    subtitle: 'Technician accounts, advisor permissions, and dealership roster',
    sloganTop: 'CONNECTED TEAM.',
    sloganBottom: 'STREAMLINED ACCESS.',
  },
  '/citnow-upgrades': {
    eyebrow: 'INTEGRATIONS & ADD-ONS',
    title: 'CitNow Upgrades & Features',
    subtitle: 'Manage CitNow automation, connector settings, and enhanced analytics plugins',
    sloganTop: 'SEAMLESS CONNECT.',
    sloganBottom: 'FEATURE EXPANSION.',
  },
  '/config/theme': {
    eyebrow: 'BRAND & PRESENTATION',
    title: 'Platform Configuration',
    subtitle: 'Manage UI themes, dark mode preferences, and layout parameters',
    sloganTop: 'CURATED LUXURY.',
    sloganBottom: 'TAILORED EXPERIENCE.',
  },
  '/config': {
    eyebrow: 'BRAND & PRESENTATION',
    title: 'Platform Configuration',
    subtitle: 'Manage UI themes, dark mode preferences, and layout parameters',
    sloganTop: 'CURATED LUXURY.',
    sloganBottom: 'TAILORED EXPERIENCE.',
  },
  '/account/profile': {
    eyebrow: 'SECURITY CREDENTIALS',
    title: 'Account Profile',
    subtitle: 'Manage administrative profile settings and authentication preferences',
    sloganTop: 'AUTHENTICATED ACCESS.',
    sloganBottom: 'ROOT PRIVILEGE.',
  },
  '/account/password': {
    eyebrow: 'SECURITY CREDENTIALS',
    title: 'Change Password',
    subtitle: 'Update account credentials and security authentication',
    sloganTop: 'SECURE CREDENTIALS.',
    sloganBottom: 'MAXIMUM INTEGRITY.',
  },
  '/support': {
    eyebrow: 'HELP & DOCUMENTATION',
    title: 'Technical Support & Guides',
    subtitle: 'Access system documentation, API references, and technical assistance',
    sloganTop: 'EXPERT ASSISTANCE.',
    sloganBottom: '24/7 READINESS.',
  },
};

export default function TechLuxuryLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const effectiveRole = role || user?.role || 'super_admin';
  const isMasterAdmin = Boolean(
    effectiveRole === 'master_admin' ||
    user?.role === 'master_admin' ||
    user?.is_master_admin === true ||
    user?.username === 'tech@focus'
  );

  const currentMeta = PAGE_META[location.pathname] ||
    Object.entries(PAGE_META).find(([key]) => key !== '/' && location.pathname.startsWith(key))?.[1] || {
      eyebrow: 'QUALITY LENS PLATFORM',
      title: isMasterAdmin ? 'Tech Admin Workspace' : 'Executive Workspace',
      subtitle: 'Advanced management, diagnostics, and video quality intelligence',
      sloganTop: 'DRIVEN BY DATA.',
      sloganBottom: 'BUILT FOR BETTER.',
    };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'CORE & ANALYTICS',
      items: [
        {
          label: 'Top Dashboard',
          path: isMasterAdmin || effectiveRole === 'super_admin' ? '/super-admin/dashboard' : '/dealer/dashboard',
          icon: <DashboardOutlined sx={{ fontSize: 18 }} />
        },
        ...(isMasterAdmin || effectiveRole === 'super_admin' ? [
          { label: 'Monitor', path: '/super-admin/monitor', icon: <DesktopWindows sx={{ fontSize: 18 }} /> },
          ...(!isMasterAdmin ? [{ label: 'Uploads / Queue', path: '/super-admin/uploads', icon: <AddToQueue sx={{ fontSize: 18 }} /> }] : []),
        ] : []),
        { label: 'Analysis Results', path: '/dealer/results', icon: <AssessmentOutlined sx={{ fontSize: 18 }} /> },
        { label: 'New Analysis', path: '/dealer/new', icon: <AddCircleOutline sx={{ fontSize: 18 }} /> },
        { label: 'Bulk Upload', path: '/dealer/bulk', icon: <CloudUploadOutlined sx={{ fontSize: 18 }} /> },
      ]
    },
    ...(isMasterAdmin ? [
      {
        title: 'TECH & INFRASTRUCTURE',
        items: [
          { label: 'Tech Console', path: '/master-admin/console', icon: <Tune sx={{ fontSize: 18 }} /> },
          { label: 'Credentials Vault', path: '/master-admin/credentials', icon: <VpnKey sx={{ fontSize: 18 }} /> },
          { label: 'Live Activity', path: '/master-admin/live', icon: <Sensors sx={{ fontSize: 18 }} /> },
          { label: 'Performance', path: '/master-admin/performance', icon: <Speed sx={{ fontSize: 18 }} /> },
          { label: 'Uploads / Queue', path: '/super-admin/uploads', icon: <AddToQueue sx={{ fontSize: 18 }} /> },
        ]
      }
    ] : []),
    {
      title: 'MANAGEMENT & NETWORK',
      items: [
        {
          label: 'Team Mgmt',
          path: isMasterAdmin || effectiveRole === 'super_admin' ? '/super-admin/users' : '/dealer/users',
          icon: <GroupOutlined sx={{ fontSize: 18 }} />
        },
        ...(isMasterAdmin || effectiveRole === 'super_admin' ? [
          { label: 'Dealer Network', path: '/super-admin/dealers', icon: <Business sx={{ fontSize: 18 }} /> },
        ] : []),
        { label: 'CitNow Upgrades', path: '/citnow-upgrades', icon: <BoltOutlined sx={{ fontSize: 18 }} /> },
        { label: 'Configuration', path: '/config/theme', icon: <SettingsOutlined sx={{ fontSize: 18 }} /> },
        { label: 'Account', path: '/account/profile', icon: <PersonOutline sx={{ fontSize: 18 }} /> },
      ]
    }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#070C12',
      backgroundImage: 'radial-gradient(ellipse 90% 40% at 50% -10%, rgba(13, 161, 184, 0.08), transparent 70%)'
    }}>
      {/* ─────────────────────────────────────────────────────────────
          1. TOP LUXURY AUTOMOTIVE BRAND HEADER (Matching Image 2)
         ───────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          height: { xs: 84, md: 98 },
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2.5, md: 4 },
          backgroundImage: `linear-gradient(to right, rgba(10, 14, 18, 0.95) 0%, rgba(14, 20, 28, 0.88) 45%, rgba(10, 14, 18, 0.94) 100%), url(/assets/luxury_car_banner.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        {/* Left: QualityLens Official Logo (Clean, Transparent, Neat & Clear) */}
        <Box
          onClick={() => navigate(isMasterAdmin || effectiveRole === 'super_admin' ? '/super-admin/dashboard' : '/dealer/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            '&:hover': { transform: 'scale(1.02)' }
          }}
        >
          <Box
            component="img"
            src="/qualitylens-logo-white.png"
            alt="QualityLens"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/qualitylens-logo.png';
            }}
            sx={{
              height: { xs: 52, md: 64 },
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 14px rgba(0, 0, 0, 0.6))'
            }}
          />
        </Box>

        {/* Center Motto */}
        <Typography
          sx={{
            display: { xs: 'none', lg: 'block' },
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.84rem',
            fontWeight: 400,
            letterSpacing: '0.08em',
            fontStyle: 'normal',
          }}
        >
          Better Insights. Stronger Performance.
        </Typography>

        {/* Right: User Profile & Avatar */}
        <Box
          onClick={handleOpenMenu}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            p: 0.75,
            px: 1.5,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.18)',
            },
          }}
        >
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.2 }}>
              {user?.username || (isMasterAdmin ? 'tech@focus' : 'admin')}
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem', fontWeight: 400 }}>
              {isMasterAdmin
                ? 'Master Admin • Tech'
                : effectiveRole === 'super_admin'
                  ? 'Super Admin'
                  : effectiveRole === 'dealer_admin'
                    ? 'Dealer Admin'
                    : effectiveRole === 'branch_admin'
                      ? 'Branch Admin'
                      : (effectiveRole.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Admin')}
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#1E293B',
              color: isMasterAdmin ? '#38BDF8' : '#34D399',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: isMasterAdmin ? '1.5px solid rgba(56, 189, 248, 0.4)' : '1.5px solid rgba(52, 211, 153, 0.4)',
            }}
          >
            {isMasterAdmin ? 'TA' : (user?.username || 'AD').substring(0, 2).toUpperCase()}
          </Avatar>
          <KeyboardArrowDown sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 18 }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              mt: 1,
              bgcolor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: 2.5,
              border: '1px solid rgba(255,255,255,0.1)',
              minWidth: 180,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            },
          }}
        >
          {isMasterAdmin && (
            <MenuItem onClick={() => { handleCloseMenu(); navigate('/master-admin/console'); }}>
              <ListItemIcon><Tune sx={{ color: '#38BDF8', fontSize: 18 }} /></ListItemIcon>
              Tech Console
            </MenuItem>
          )}
          <MenuItem onClick={() => { handleCloseMenu(); navigate('/account/profile'); }}>
            <ListItemIcon><PersonOutline sx={{ color: '#94A3B8', fontSize: 18 }} /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: '#F87171' }}>
            <ListItemIcon><LogoutIcon sx={{ color: '#F87171', fontSize: 18 }} /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN BODY (Sidebar + Page Content)
         ───────────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flex: 1, minHeight: { xs: 'calc(100vh - 84px)', md: 'calc(100vh - 98px)' }, position: 'relative' }}>
        {/* Left Dark Frosted Sidebar (Matching Image 2 Reference) */}
        <Box
          sx={{
            width: { xs: 70, md: 260 },
            flexShrink: 0,
            bgcolor: '#070C10',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'sticky',
            top: { xs: 84, md: 98 },
            height: { xs: 'calc(100vh - 84px)', md: 'calc(100vh - 98px)' },
            maxHeight: { xs: 'calc(100vh - 84px)', md: 'calc(100vh - 98px)' },
            overflow: 'hidden',
          }}
        >
          {/* Panoramic Mountain Landscape & Winding Road Underlay (User Uploaded Scenic Road) */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              backgroundImage: `linear-gradient(180deg, rgba(7, 13, 17, 0.94) 0%, rgba(8, 15, 19, 0.82) 36%, rgba(7, 14, 18, 0.30) 62%, rgba(6, 12, 16, 0.04) 80%, rgba(5, 9, 13, 0.60) 100%), url(/assets/sidebar_scenic_road.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              pointerEvents: 'none'
            }}
          />

          {/* Scrollable Sidebar Content on top */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflowY: 'auto',
              overflowX: 'hidden',
              py: 2.5,
              px: { xs: 1, md: 1.75 },
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '2px'
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
          {/* Nav Items Grouped by Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {navSections.map((sec) => (
              <Box key={sec.title} sx={{ mb: 1.75 }}>
                <Typography
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    fontSize: '0.67rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    color: 'rgba(255, 255, 255, 0.42)',
                    px: 1.25,
                    mb: 0.6,
                    textTransform: 'uppercase'
                  }}
                >
                  {sec.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                  {sec.items.map((item) => {
                    const isActive = location.pathname === item.path || (item.path === '/super-admin/dashboard' && location.pathname === '/');
                    return (
                      <Box
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          px: { xs: 1.2, md: 1.5 },
                          py: 0.85,
                          borderRadius: 2,
                          cursor: 'pointer',
                          userSelect: 'none',
                          bgcolor: isActive ? 'rgba(16, 185, 129, 0.14)' : 'transparent',
                          border: isActive ? '1px solid rgba(16, 185, 129, 0.38)' : '1px solid transparent',
                          color: isActive ? '#34D399' : 'rgba(255, 255, 255, 0.72)',
                          transition: 'all 0.15s ease-in-out',
                          position: 'relative',
                          '&:hover': {
                            bgcolor: isActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                            color: isActive ? '#34D399' : '#FFFFFF',
                            transform: 'translateX(2px)',
                          },
                        }}
                      >
                        {/* Left Active Glow Indicator */}
                        {isActive && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: -6,
                              width: 3.5,
                              height: 18,
                              bgcolor: '#10B981',
                              borderRadius: '0 4px 4px 0',
                              boxShadow: '0 0 10px #10B981',
                            }}
                          />
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.icon}
                        </Box>
                        <Typography
                          sx={{
                            display: { xs: 'none', md: 'block' },
                            fontSize: '0.82rem',
                            fontWeight: isActive ? 700 : 500,
                            letterSpacing: '0.01em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))}

            {/* Analysis Monitor & CAPEX speedometer gauge */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mt: 1, mb: 1.5 }}>
              <GlobalAnalysisMonitor />
            </Box>
          </Box>

          {/* Bottom Sidebar Watermark Caption (Exact match to Image 2) */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, pt: 2, px: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                lineHeight: 1.6,
                textTransform: 'uppercase',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)'
              }}
            >
              INSIGHTS TODAY.
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.65)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                lineHeight: 1.4,
                textTransform: 'uppercase',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.9)'
              }}
            >
              A STRONGER TOMORROW.
            </Typography>
          </Box>
        </Box>
      </Box>

        {/* ─────────────────────────────────────────────────────────────
            3. MAIN CONTENT AREA (Inside Main Bar + Page Content)
           ───────────────────────────────────────────────────────────── */}
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#F4F6F9',
            overflowY: 'auto',
          }}
        >
          {/* Panoramic Alpine Road & Luxury Sports Car Inside Main Bar */}
          <Box
            sx={{
              width: '100%',
              minHeight: { xs: 150, md: 175 },
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#FFFFFF',
              borderBottom: '1px solid #E2E8F0',
              px: { xs: 2.5, sm: 3.5, md: 4.5 },
              py: 2.5,
              flexShrink: 0,
            }}
          >
            {/* Panoramic Alpine Road & Luxury Sports Car with 50/50 Full-Height Mask */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: { xs: '100%', md: '52%' },
                backgroundImage: 'url(/assets/luxury_car_banner.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'right 68%',
                maskImage: {
                  xs: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 30%, black 100%)',
                  md: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 15%, rgba(0,0,0,0.65) 45%, black 85%)'
                },
                WebkitMaskImage: {
                  xs: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 30%, black 100%)',
                  md: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 15%, rgba(0,0,0,0.65) 45%, black 85%)'
                },
              }}
            />

            {/* Atmospheric Misty Fade Overlay for Ultra-Smooth 50/50 Blending */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: {
                  xs: 'linear-gradient(to right, #FFFFFF 0%, rgba(255, 255, 255, 0.94) 50%, rgba(255, 255, 255, 0.4) 100%)',
                  md: 'linear-gradient(to right, #FFFFFF 0%, #FFFFFF 46%, rgba(255, 255, 255, 0.88) 52%, rgba(255, 255, 255, 0.25) 68%, transparent 88%)'
                },
                pointerEvents: 'none'
              }}
            />

            {/* Left: Title & Subtitle sitting crisply on the clean white background */}
            <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 2, md: 3 }, maxWidth: { xs: '100%', md: '48%' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    color: '#64748B',
                    textTransform: 'uppercase'
                  }}
                >
                  {currentMeta.eyebrow}
                </Typography>
                <Box sx={{ width: 28, height: '1.5px', bgcolor: '#CBD5E1' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  fontSize: { xs: '1.65rem', md: '2.1rem' },
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                  mb: 0.75,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                {currentMeta.title}
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '0.92rem', fontWeight: 400 }}>
                {currentMeta.subtitle}
              </Typography>
            </Box>

            {/* Right: Slogan with subtle vertical line divider (exact match to screenshot) */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                pr: { xs: 3, md: 5 },
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box sx={{ width: '1.5px', height: 32, bgcolor: 'rgba(255, 255, 255, 0.45)' }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9)'
                  }}
                >
                  {currentMeta.sloganTop}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9)'
                  }}
                >
                  {currentMeta.sloganBottom}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Page Children Container with Luminous Luxury Card Texture + Gradient Styling */}
          <Box
            sx={{
              flex: 1,
              width: '100%',
              p: location.pathname === '/super-admin/dashboard' ? 0 : { xs: 2.5, sm: 3, md: 4 },
              boxSizing: 'border-box',
              // Section typography outside cards
              '& .MuiTypography-h4': {
                color: '#0F172A !important',
                textShadow: 'none !important',
              },
              '& .MuiTypography-body1': {
                color: '#64748B !important',
              },
              // Clean Glass Floating Filter Pill
              '& .MuiPaper-root:has(button)': {
                background: '#FFFFFF !important',
                border: '1px solid #E2E8F0 !important',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05) !important',
              },
              // Universal Luminous Luxury Card Styling (Light Carbon Image Background + Gradient Overlay)
              '& .MuiCard-root, & .MuiPaper-elevation1': {
                borderRadius: '20px !important',
                backgroundImage: 'linear-gradient(145deg, rgba(255, 255, 255, 0.94) 0%, rgba(246, 250, 254, 0.90) 100%), url(/assets/light_card_texture.jpg) !important',
                backgroundSize: 'cover !important',
                backgroundPosition: 'center !important',
                backgroundColor: '#FFFFFF !important',
                border: '1px solid rgba(13, 161, 184, 0.18) !important',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(13, 161, 184, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.95) !important',
                color: '#0F172A !important',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important',
                '&:hover': {
                  borderColor: 'rgba(13, 161, 184, 0.42) !important',
                  boxShadow: '0 16px 40px rgba(13, 161, 184, 0.12), 0 4px 12px rgba(15, 23, 42, 0.06) !important',
                  transform: 'translateY(-2px) !important',
                },
                '& .MuiTypography-root': {
                  color: 'inherit',
                },
                '& .MuiTypography-h4, & .MuiTypography-h5, & .MuiTypography-h6, & .MuiTypography-subtitle1': {
                  color: '#0F172A !important',
                  textShadow: 'none !important',
                },
                '& .MuiTypography-body2, & .MuiTypography-caption': {
                  color: '#64748B !important',
                },
                '& .MuiBox-root': {
                  borderColor: 'rgba(226, 232, 240, 0.8)',
                },
                '& .recharts-cartesian-grid line': {
                  stroke: 'rgba(15, 23, 42, 0.07) !important',
                },
                '& .recharts-text': {
                  fill: '#64748B !important',
                },
                '& .recharts-legend-item-text': {
                  color: '#334155 !important',
                },
                '& .MuiTabs-root': {
                  '& .MuiTab-root': {
                    color: '#64748B !important',
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: '#0DA1B8 !important',
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#0DA1B8 !important',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                    boxShadow: '0 0 8px rgba(13, 161, 184, 0.5) !important',
                  }
                },
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#FFFFFF !important',
                  color: '#0F172A !important',
                  borderRadius: '12px !important',
                  '& fieldset': {
                    borderColor: 'rgba(13, 161, 184, 0.25) !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(13, 161, 184, 0.5) !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0DA1B8 !important',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#0DA1B8 !important',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#64748B !important',
                },
                '& .recharts-default-tooltip': {
                  backgroundColor: '#FFFFFF !important',
                  borderColor: 'rgba(13, 161, 184, 0.3) !important',
                  borderRadius: '10px !important',
                  boxShadow: '0 8px 30px rgba(15, 23, 42, 0.12) !important',
                  color: '#0F172A !important',
                },
              },
              '& .MuiTableContainer-root': {
                borderRadius: '18px !important',
                border: '1px solid rgba(13, 161, 184, 0.16) !important',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.05) !important',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF !important',
              }
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
