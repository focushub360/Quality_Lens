// src/components/layout/Sidebar.js
import React, { useContext, useState, useEffect } from 'react';
// Trigger AWS Amplify build for newly connected quality_lens repository
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Divider,
  useMediaQuery,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Snackbar,
  Chip,
  Tooltip
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  SpaceDashboard,
  DesktopWindows,
  AddToQueue,
  UploadFile,
  Assessment,
  ManageAccounts,
  Group,
  Business,
  Settings,
  Person,
  HelpCenter,
  ContactSupport,
  VpnKey,
  ExitToApp,
  Palette,
  Timeline,
  Terminal,
  Speed,
  Sensors,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  accent: '#00B4DB',
  sidebarBg: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)',
  sidebarHover: 'rgba(13, 161, 184, 0.12)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  divider: 'rgba(13, 161, 184, 0.15)'
};

const SIDEBAR_WIDTH = 280;

// Sidebar now uses MUI theme palette dynamically

const ROLE_ACCESS = {
  master_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: SpaceDashboard },
    { text: 'Tech Console', path: '/master-admin/console', icon: Terminal },
    { text: 'Credentials Vault', path: '/master-admin/credentials', icon: VpnKey },
    { text: 'Live Activity', path: '/master-admin/live', icon: Sensors },
    { text: 'Performance', path: '/master-admin/performance', icon: Speed },
    { text: 'Uploads', path: '/super-admin/uploads', icon: AddToQueue },
    { text: 'Analysis Results', path: '/dealer/results', icon: Assessment },
    { text: 'User Management', path: '/super-admin/users', icon: Group },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business },
    { text: 'CitNow Upgrades', path: '/citnow-upgrades', icon: Timeline },
    { text: 'Monitor', path: '/super-admin/monitor', icon: DesktopWindows },
    { text: 'Configuration', path: '/super-admin/config', icon: Settings },
  ],
  super_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: SpaceDashboard },
    { text: 'Uploads', path: '/super-admin/uploads', icon: AddToQueue },
    { text: 'Analysis Results', path: '/dealer/results', icon: Assessment },
    { text: 'User Management', path: '/super-admin/users', icon: Group },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business },
    { text: 'CitNow Upgrades', path: '/citnow-upgrades', icon: Timeline },
    { text: 'Monitor', path: '/super-admin/monitor', icon: DesktopWindows },
    { text: 'Configuration', path: '/super-admin/config', icon: Settings },
  ],
  dealer_admin: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'Team Mgmt', path: '/dealer/users', icon: ManageAccounts },
    { text: 'CitNow Upgrades', path: '/citnow-upgrades', icon: Timeline },
    { 
      text: 'Configuration', 
      path: '/config', 
      icon: Settings,
      subItems: [
        { text: 'Theme Settings', path: '/config/theme', icon: Palette }
      ]
    },
    { 
      text: 'Account', 
      path: '/account', 
      icon: Person,
      subItems: [
        { text: 'Edit Profile', path: '/account/profile', icon: Person },
        { text: 'Change Password', path: '/account/password', icon: VpnKey },
        { text: 'Logout', path: '/logout', icon: ExitToApp }
      ]
    }
  ],
  branch_admin: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'Team Mgmt', path: '/dealer/users', icon: ManageAccounts },
    { text: 'CitNow Upgrades', path: '/citnow-upgrades', icon: Timeline },
    { 
      text: 'Configuration', 
      path: '/config', 
      icon: Settings,
      subItems: [
        { text: 'Theme Settings', path: '/config/theme', icon: Palette }
      ]
    },
    { 
      text: 'Account', 
      path: '/account', 
      icon: Person,
      subItems: [
        { text: 'Edit Profile', path: '/account/profile', icon: Person },
        { text: 'Change Password', path: '/account/password', icon: VpnKey },
        { text: 'Logout', path: '/logout', icon: ExitToApp }
      ]
    }
  ],
  dealer_user: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'CitNow Upgrades', path: '/citnow-upgrades', icon: Timeline },
    { 
      text: 'Configuration', 
      path: '/config', 
      icon: Settings,
      subItems: [
        { text: 'Theme Settings', path: '/config/theme', icon: Palette }
      ]
    },
    { 
      text: 'Account', 
      path: '/account', 
      icon: Person,
      subItems: [
        { text: 'Edit Profile', path: '/account/profile', icon: Person },
        { text: 'Change Password', path: '/account/password', icon: VpnKey },
        { text: 'Logout', path: '/logout', icon: ExitToApp }
      ]
    }
  ],
};

// Sub-component for individual Sidebar Items
function SidebarItem({ item, isActive, currentPath }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { role } = useContext(AuthContext);
  const isSuperAdmin = role === 'super_admin' || role === 'master_admin';
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const [open, setOpen] = useState(hasSubItems && currentPath.startsWith(item.path));

  useEffect(() => {
    if (hasSubItems && currentPath.startsWith(item.path)) {
      setOpen(true);
    }
  }, [currentPath, item.path, hasSubItems]);

  const handleToggle = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      setOpen(!open);
    }
  };

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };

  const handlePrefetch = (path) => {
    if (!path) return;
    try {
      if (path.includes('dashboard')) {
        if (isSuperAdmin) {
          api.get('/dashboard/super-admin/overview?timeRange=year', { cacheTTL: 120000 }).catch(() => {});
          api.get('/users/', { cacheTTL: 120000 }).catch(() => {});
        } else {
          api.get('/dashboard/dealer/overview?timeRange=year', { cacheTTL: 120000 }).catch(() => {});
        }
      } else if (path.includes('results')) {
        if (isSuperAdmin) {
          api.get('/results/summary-stats', { cacheTTL: 120000 }).catch(() => {});
          api.get('/results?page=1&per_page=10', { cacheTTL: 120000 }).catch(() => {});
        } else {
          api.get('/dashboard/dealer/overview?timeRange=year', { cacheTTL: 120000 }).catch(() => {});
        }
      } else if (path.includes('dealers') || path.includes('team')) {
        if (isSuperAdmin) {
          api.get('/dealers', { cacheTTL: 120000 }).catch(() => {});
        }
      }
    } catch (e) {}
  };

  const Icon = item.icon;

  return (
    <React.Fragment>
      <ListItemButton
        component="div"
        onMouseEnter={() => handlePrefetch(item.path)}
        onClick={(e) => {
          if (hasSubItems) {
            handleToggle(e);
            handleNavigate(item.subItems?.[0]?.path || item.path);
            return;
          }
          handleNavigate(item.path);
        }}
        selected={!hasSubItems && isActive(item.path)}
        sx={{
          mb: 0.5,
          borderRadius: 1.5,
          py: 0.8,
          px: 1.5,
          transition: 'all 0.2s',
          color: (!hasSubItems && isActive(item.path)) ? '#FFFFFF' : THEME.textPrimary,
          '&.Mui-selected': {
            background: THEME.primary,
            color: '#FFFFFF',
            '& .MuiListItemIcon-root': { color: '#FFFFFF' },
            '&:hover': { background: THEME.primaryDark },
          },
          '&:hover': {
            background: THEME.sidebarHover,
            color: THEME.primary,
            '& .MuiListItemIcon-root': { color: THEME.primary },
          },
        }}
      >
        <ListItemIcon sx={{ 
          minWidth: 32, 
          color: 'inherit'
        }}>
          <Icon sx={{ fontSize: 18 }} />
        </ListItemIcon>
        <ListItemText 
          primary={item.text} 
          primaryTypographyProps={{ 
            fontWeight: (!hasSubItems && isActive(item.path)) ? 700 : 500,
            fontSize: '0.825rem',
            color: 'inherit'
          }} 
        />
        {hasSubItems && (open ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />)}
      </ListItemButton>

      {hasSubItems && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {item.subItems.map((sub) => {
              const SubIcon = sub.icon;
              return (
                <ListItemButton
                  key={sub.path}
                  component="div"
                  onClick={() => handleNavigate(sub.path)}
                  selected={isActive(sub.path)}
                  sx={{
                    mb: 0.5,
                    borderRadius: 1.5,
                    py: 0.6,
                    px: 1.5,
                    color: isActive(sub.path) ? THEME.primary : THEME.textPrimary,
                    '&.Mui-selected': {
                      background: 'rgba(13, 161, 184, 0.15)',
                      color: THEME.primary,
                      '& .MuiListItemIcon-root': { color: THEME.primary },
                    },
                    '&:hover': { 
                      background: THEME.sidebarHover,
                      color: THEME.primary,
                      '& .MuiListItemIcon-root': { color: THEME.primary }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                    <SubIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={sub.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.75rem', 
                      fontWeight: isActive(sub.path) ? 700 : 500, 
                      color: 'inherit' 
                    }} 
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}

export default function Sidebar() {
  const theme = useTheme();
  const location = useLocation();
  const { role, user } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);
  const isMaster = role === 'master_admin' || user?.is_master_admin || user?.username === 'tech@focus';
  const menuItems = isMaster ? ROLE_ACCESS.master_admin : (ROLE_ACCESS[role] || []);

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: THEME.sidebarBg,
      color: THEME.textPrimary,
      borderRight: `1px solid ${THEME.divider}`,
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '6px'
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(13, 161, 184, 0.2)',
        borderRadius: '3px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(13, 161, 184, 0.4)'
      }
    }}>
      <Box sx={{ px: 2, py: 2.25, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90px' }}>
        <Box 
          component="img" 
          src={`${process.env.PUBLIC_URL || ''}/qualitylens-logo.png`}
          alt="QualityLens" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/qualitylens-logo.png';
          }}
          sx={{ height: 68, width: 'auto', objectFit: 'contain' }} 
        />
      </Box>

      <Divider sx={{ mx: 2, mb: 2, borderColor: THEME.divider }} />

      <List sx={{ 
        px: 2, 
        flex: 1, 
        pt: 0
      }}>
        {menuItems.map((item) => (
          <SidebarItem key={item.path} item={item} isActive={isActive} currentPath={location.pathname} />
        ))}
      </List>

      {/* Global Analysis Monitor */}
      <GlobalAnalysisMonitor />
    </Box>
  );

  if (isMobile) return null;

  return (
    <Box component="nav" sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': { 
            width: SIDEBAR_WIDTH, 
            boxSizing: 'border-box', 
            border: 'none',
            boxShadow: '4px 0 24px 0 rgba(0, 0, 0, 0.03)'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

// Speedometer Gauge Component for CAPEX Limit & Usage (Permanently visible in Sidebar)
function CapexSpeedometer({ used = 0, max = 1000, dealerName = '' }) {
  const safeUsed = isNaN(used) ? 0 : Math.max(0, used);
  const safeMax = isNaN(max) || max <= 0 ? 1000 : max;
  const percentage = Math.min(100, Math.round((safeUsed / safeMax) * 100 * 10) / 10);
  const remaining = Math.max(0, safeMax - safeUsed);

  // Status colors & labels based on CAPEX usage
  let statusColor = '#10B981'; // Green (< 70%)
  let statusBg = 'rgba(16, 185, 129, 0.12)';
  let statusLabel = 'HEALTHY';

  if (percentage >= 90) {
    statusColor = '#EF4444'; // Red (>= 90%)
    statusBg = 'rgba(239, 68, 68, 0.12)';
    statusLabel = 'CAP EXCEEDED';
  } else if (percentage >= 70) {
    statusColor = '#F59E0B'; // Amber (>= 70%)
    statusBg = 'rgba(245, 158, 11, 0.12)';
    statusLabel = 'WARNING';
  }

  // Speedometer Needle angle: -90 deg at 0%, 0 deg at 50%, +90 deg at 100%
  const needleAngle = -90 + (Math.min(percentage, 100) / 100) * 180;
  // Arc length is Pi * R = Pi * 78 ~= 245.04
  const arcLength = 245.04;
  const strokeOffset = arcLength * (1 - Math.min(percentage, 100) / 100);

  return (
    <Tooltip title={`Daily CAPEX Link Allowance for ${dealerName || 'Dealership'}. Resets at 12:00 AM IST.`} arrow placement="top">
      <Box sx={{
        p: 1.5,
        mb: 1.5,
        borderRadius: 3,
        background: '#FFFFFF',
        border: '1px solid rgba(13, 161, 184, 0.22)',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0,0,0,0.03)',
        position: 'relative',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(13, 161, 184, 0.12)',
          borderColor: 'rgba(13, 161, 184, 0.35)'
        }
      }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 26,
              height: 26,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #0DA1B8 0%, #0C587D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(13, 161, 184, 0.3)'
            }}>
              <Speed sx={{ fontSize: 16 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: '11px', letterSpacing: '0.4px', lineHeight: 1.1 }}>
                CAPEX LIMIT
              </Typography>
              <Typography sx={{ fontSize: '8.5px', color: '#64748B', fontWeight: 600 }}>
                Daily Gauge Meter
              </Typography>
            </Box>
          </Box>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              height: 20,
              fontSize: '9px',
              fontWeight: 800,
              bgcolor: statusBg,
              color: statusColor,
              border: `1px solid ${statusColor}40`,
              borderRadius: '6px'
            }}
          />
        </Box>

        {/* Speedometer SVG Gauge */}
        <Box sx={{ position: 'relative', width: '100%', height: 112, my: 0.5 }}>
          <svg viewBox="0 0 220 126" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="speedoTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#0DA1B8" />
                <stop offset="78%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
              <filter id="speedoGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={statusColor} floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Background Track (semi-circle) */}
            <path
              d="M 32 105 A 78 78 0 0 1 188 105"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Active Colored Arc */}
            <path
              d="M 32 105 A 78 78 0 0 1 188 105"
              fill="none"
              stroke="url(#speedoTrackGrad)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeOffset}
              filter="url(#speedoGlow)"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />

            {/* Gauge Tick Marks */}
            <line x1="32" y1="105" x2="38" y2="105" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="55" y1="50" x2="59" y2="54" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="110" y1="27" x2="110" y2="33" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="165" y1="50" x2="161" y2="54" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="188" y1="105" x2="182" y2="105" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

            {/* Scale Labels */}
            <text x="32" y="121" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94A3B8">0</text>
            <text x="110" y="21" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94A3B8">50%</text>
            <text x="188" y="121" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94A3B8">{safeMax}</text>

            {/* Needle */}
            <g
              transform={`rotate(${needleAngle}, 110, 105)`}
              style={{ transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <polygon points="107,105 110,36 113,105" fill="#1E293B" />
              <circle cx="110" cy="105" r="7.5" fill="#1E293B" />
              <circle cx="110" cy="105" r="3" fill="#0DA1B8" />
            </g>

            {/* Center Digital Readout */}
            <text
              x="110"
              y="74"
              textAnchor="middle"
              fontSize="19"
              fontWeight="900"
              fill="#0F172A"
              style={{ fontFamily: 'monospace, sans-serif' }}
            >
              {percentage}%
            </text>
            <text
              x="110"
              y="88"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#64748B"
              letterSpacing="0.8"
            >
              QUOTA USED
            </text>
          </svg>
        </Box>

        {/* Metrics Counter Bar */}
        <Box sx={{
          mt: 0.5,
          p: 0.85,
          borderRadius: 2,
          bgcolor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography sx={{ color: '#64748B', fontWeight: 700, fontSize: '9px', display: 'block', lineHeight: 1, textTransform: 'uppercase' }}>
              CONSUMED
            </Typography>
            <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: '12px', mt: 0.25 }}>
              {safeUsed} <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#64748B' }}>links</span>
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#CBD5E1' }} />

          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ color: '#64748B', fontWeight: 700, fontSize: '9px', display: 'block', lineHeight: 1, textTransform: 'uppercase' }}>
              DAILY CAPEX
            </Typography>
            <Typography sx={{ fontWeight: 800, color: '#0F172A', fontSize: '12px', mt: 0.25 }}>
              {safeMax} <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#64748B' }}>links</span>
            </Typography>
          </Box>
        </Box>

        {/* Remaining info pill */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.75, px: 0.25 }}>
          <Typography sx={{ color: statusColor, fontWeight: 700, fontSize: '9.5px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor }} />
            {remaining} allowance left
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '8.5px' }}>
            Resets 12 AM IST
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}

// src/components/layout/Sidebar.js - Helper component for global Analysis Monitor
function GlobalAnalysisMonitor() {
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('ql_sidebar_monitor_open');
    return saved === 'true';
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const { role, user } = useContext(AuthContext);

  const isSuperAdmin = role === 'super_admin' || role === 'master_admin' || user?.is_master_admin || user?.username === 'tech@focus';

  // Live Quota & CAPEX State
  const [quotaData, setQuotaData] = useState(() => {
    try {
      const cachedQuotas = JSON.parse(localStorage.getItem('ql_dealer_quotas_cache') || '[]');
      const userDealerKey = (user?.dealer_id || user?.showroom_name || '').toUpperCase();
      const matched = cachedQuotas.find(d => 
        userDealerKey.includes(d.dealer_id?.toUpperCase()) || 
        userDealerKey.includes(d.dealer_name?.toUpperCase())
      );
      return {
        used: matched?.used_today || 1,
        limit: matched?.daily_limit || 1000,
        dealerName: matched?.dealer_name || user?.showroom_name || user?.dealer_id || 'Dealership'
      };
    } catch {
      return { used: 1, limit: 1000, dealerName: user?.showroom_name || 'Dealership' };
    }
  });

  const fetchQuotaStatus = async () => {
    try {
      let used = quotaData.used;
      let limit = quotaData.limit;
      let dealerName = user?.showroom_name || user?.dealer_id || 'Dealership';

      const cachedQuotas = JSON.parse(localStorage.getItem('ql_dealer_quotas_cache') || '[]');
      const userDealerKey = (user?.dealer_id || user?.showroom_name || '').toUpperCase();
      const matched = cachedQuotas.find(d => 
        userDealerKey.includes(d.dealer_id?.toUpperCase()) || 
        userDealerKey.includes(d.dealer_name?.toUpperCase())
      );

      if (matched) {
        limit = matched.daily_limit || 1000;
        if (typeof matched.used_today === 'number') {
          used = matched.used_today;
        }
        dealerName = matched.dealer_name || dealerName;
      }

      if (!isSuperAdmin) {
        try {
          const dRes = await api.get('/dashboard/dealer/overview');
          if (dRes.data?.total_videos_analyzed) {
            used = Math.max(used, dRes.data.total_videos_analyzed);
          }
        } catch {
          // Keep cached
        }
      } else {
        try {
          const qRes = await api.get('/admin/dealer-quotas');
          if (qRes.data?.dealers) {
            used = qRes.data.dealers.reduce((acc, d) => acc + (d.used_today || 0), 0);
            limit = qRes.data.dealers.reduce((acc, d) => acc + (d.daily_limit || 0), 0) || 8000;
            dealerName = 'All Network Dealerships';
          }
        } catch {
          // Keep cached
        }
      }

      setQuotaData({ used, limit, dealerName });
    } catch (e) {
      console.warn('Quota fetch error:', e);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await api.get('/bulk-batches');
      if (Array.isArray(res.data)) {
        setBatches(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch global batches for sidebar', err);
    }
  };

  useEffect(() => {
    if (!role) return;
    fetchBatches();
    fetchQuotaStatus();
    const interval = setInterval(() => {
      fetchBatches();
      fetchQuotaStatus();
    }, 12000);
    return () => clearInterval(interval);
  }, [role, user]);

  const handleToggleOpen = () => {
    setOpen(prev => {
      const next = !prev;
      localStorage.setItem('ql_sidebar_monitor_open', String(next));
      return next;
    });
  };

  if (!role) return null;

  const activeBatches = batches.filter(b => ['processing', 'pending', 'stopping'].includes(b.status));
  const completedBatches = batches.filter(b => ['completed', 'failed'].includes(b.status)).slice(0, 5);
  const deletedAdminBatches = batches.filter(b => b.deleted_by_admin || b.status === 'deleted_by_admin');

  const handleDeleteClick = (e, b) => {
    e.stopPropagation();
    setBatchToDelete(b);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!batchToDelete) return;
    setIsDeleting(true);
    try {
      const bId = batchToDelete.batch_id || batchToDelete.batchId;
      await api.delete(`/bulk-batches/${bId}`);
      setSnackMsg(`Batch '${batchToDelete.filename || 'Upload'}' has been deleted.`);
      setDeleteDialogOpen(false);
      setBatchToDelete(null);
      await fetchBatches();
    } catch (err) {
      console.error('Failed to delete batch:', err);
      setSnackMsg('Failed to delete batch. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box sx={{ px: 2, pb: 2, mt: 'auto' }}>
      <Divider sx={{ mb: 1.5, borderColor: THEME.divider }} />

      {/* Deleted by Admin notification alert for Dealer users */}
      {!isSuperAdmin && deletedAdminBatches.length > 0 && (
        <Box sx={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #EF4444',
          borderRadius: 2,
          p: 1,
          mb: 1
        }}>
          <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 700, display: 'block', fontSize: '10px' }}>
            ⚠️ Notice from Super Admin
          </Typography>
          {deletedAdminBatches.slice(0, 2).map(b => (
            <Typography key={b.batch_id} variant="caption" sx={{ color: '#DC2626', display: 'block', fontSize: '9px', mt: 0.25 }}>
              • Batch '{b.filename}' was deleted by Super Admin.
            </Typography>
          ))}
        </Box>
      )}

      {/* Collapsible Analysis Monitor (Queue & Meter) */}
      <ListItemButton 
        onClick={handleToggleOpen}
        sx={{
          borderRadius: 2,
          py: 0.8,
          px: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: open ? 'rgba(13, 161, 184, 0.12)' : (activeBatches.length > 0 ? 'rgba(13, 161, 184, 0.08)' : 'transparent'),
          border: `1px solid ${open ? 'rgba(13, 161, 184, 0.3)' : 'transparent'}`,
          transition: 'all 0.2s ease',
          '&:hover': { background: THEME.sidebarHover }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline sx={{ fontSize: 18, color: open || activeBatches.length > 0 ? THEME.primary : THEME.textSecondary }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: open || activeBatches.length > 0 ? THEME.primary : THEME.textPrimary, fontSize: '11.5px' }}>
            Analysis Monitor {activeBatches.length > 0 && `(${activeBatches.length} Active)`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {activeBatches.length > 0 ? (
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: '#00C9A7',
              animation: 'pulse 1.2s infinite alternate',
              '@keyframes pulse': {
                'from': { opacity: 0.4, transform: 'scale(0.8)' },
                'to': { opacity: 1, transform: 'scale(1.2)' }
              }
            }} />
          ) : (
            open ? <ExpandLess sx={{ fontSize: 18, color: THEME.primary }} /> : <ExpandMore sx={{ fontSize: 18, color: THEME.textSecondary }} />
          )}
        </Box>
      </ListItemButton>

      {/* Expanded View: Shows CAPEX Speedometer & Upload Batches when Analysis Monitor is clicked */}
      <Collapse in={open} timeout="auto" unmountOnExit sx={{ mt: 1.25 }}>
        {/* Clean, High-Visibility CAPEX Speedometer Gauge */}
        <CapexSpeedometer
          used={quotaData.used}
          max={quotaData.limit}
          dealerName={quotaData.dealerName}
        />

        {/* Upload Batches Queue */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.6)', 
          borderRadius: 2, 
          p: 1, 
          maxHeight: 180, 
          overflowY: 'auto',
          border: `1px solid ${THEME.divider}`
        }}>
          {/* Active Queue */}
          {activeBatches.length > 0 && (
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.primary, display: 'block', mb: 0.5, fontSize: '9px' }}>
                ANALYSING NOW
              </Typography>
              {activeBatches.map(b => {
                const total = b.total_urls || 0;
                const processed = (b.processed_urls || 0) + (b.failed_urls || 0);
                const pct = total > 0 ? Math.round((processed / total) * 100) : 0;
                const dName = b.dealer_name || b.dealer_id || 'Unknown Dealer';
                const subUser = b.submitted_by_username || 'User';
                const subRole = b.submitted_by_user_role === 'dealer_admin' ? 'Service Manager' : b.submitted_by_user_role === 'dealer_user' ? 'Service Advisor' : (b.submitted_by_user_role || 'Service Manager');

                return (
                  <Box key={b.batch_id || b.batchId} sx={{ mb: 1, p: 0.75, borderRadius: 1.5, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(13,161,184,0.15)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.25 }}>
                      <Box sx={{ minWidth: 0, flex: 1, mr: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block', fontSize: '10px' }}>
                          {b.filename || 'Excel Upload'}
                        </Typography>
                        {/* Dealer Name Display */}
                        <Typography variant="caption" sx={{ color: '#0C587D', fontWeight: 600, display: 'block', fontSize: '8.5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          🏢 {dName}
                        </Typography>
                        {/* User Name & Role Display */}
                        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'block', fontSize: '8.5px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          👤 {subRole}: <strong>{subUser}</strong>
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.primary, fontSize: '9.5px' }}>
                          {pct}% ({processed}/{total})
                        </Typography>
                        
                        {/* Super Admin Only Delete Icon */}
                        {isSuperAdmin && (
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleDeleteClick(e, b)}
                            title="Delete batch analysis (Super Admin)"
                            sx={{ p: 0.25, color: '#EF4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}
                          >
                            <DeleteIcon sx={{ fontSize: 13 }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.06)', overflow: 'hidden', mt: 0.5 }}>
                      <Box sx={{ height: '100%', width: `${pct}%`, background: THEME.primary, borderRadius: 2 }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* History */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textSecondary, display: 'block', mb: 0.5, fontSize: '9px' }}>
              ANALYSED BEFORE
            </Typography>
            {completedBatches.length === 0 ? (
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontStyle: 'italic', display: 'block', fontSize: '9px' }}>
                No completed uploads
              </Typography>
            ) : completedBatches.map(b => {
              const dName = b.dealer_name || b.dealer_id || 'Unknown Dealer';
              const subUser = b.submitted_by_username || 'User';
              const subRole = b.submitted_by_user_role === 'dealer_admin' ? 'Service Manager' : b.submitted_by_user_role === 'dealer_user' ? 'Service Advisor' : (b.submitted_by_user_role || 'Service Manager');
              return (
                <Box key={b.batch_id || b.batchId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75, p: 0.5, borderRadius: 1, background: 'rgba(255,255,255,0.4)' }}>
                  <Box sx={{ minWidth: 0, flex: 1, mr: 0.5 }}>
                    <Typography variant="caption" sx={{ color: THEME.textPrimary, fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block', fontSize: '9.5px' }}>
                      {b.filename || 'Excel Upload'}
                    </Typography>
                    {/* Dealer Name Display */}
                    <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', fontSize: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      🏢 {dName}
                    </Typography>
                    {/* User Name & Role Display */}
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'block', fontSize: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      👤 {subRole}: <strong>{subUser}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 700, 
                        color: b.status === 'completed' ? '#00C9A7' : '#D91B82', 
                        fontSize: '9px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {b.status}
                    </Typography>
                    {/* Super Admin Only Delete Icon */}
                    {isSuperAdmin && (
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleDeleteClick(e, b)}
                        title="Delete batch analysis (Super Admin)"
                        sx={{ p: 0.25, color: '#EF4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}
                      >
                        <DeleteIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Collapse>

      {/* Confirmation Dialog for Super Admin Deletion */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700, color: '#DC2626', pb: 1 }}>
          ⚠️ Delete Batch Analysis?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.875rem' }}>
            Are you sure you want to delete batch <strong>"{batchToDelete?.filename}"</strong> uploaded by <strong>"{batchToDelete?.dealer_name || batchToDelete?.dealer_id || 'Dealer'}"</strong>?
            <br /><br />
            This will cancel active processing, remove results, and notify the dealer admin that it was deleted by Super Admin.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Batch'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar notification */}
      <Snackbar 
        open={Boolean(snackMsg)} 
        autoHideDuration={4000} 
        onClose={() => setSnackMsg('')}
        message={snackMsg}
      />
    </Box>
  );
}
