// src/components/layout/Sidebar.js
import React, { useContext, useState, useEffect } from 'react';
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
  Collapse
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  SpaceDashboard,
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
  Timeline
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

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
  super_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: SpaceDashboard },
    { text: 'User Management', path: '/super-admin/users', icon: Group },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business },
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

  const Icon = item.icon;

  return (
    <React.Fragment>
      <ListItemButton
        component="div"
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
  const { role } = useContext(AuthContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);
  const menuItems = ROLE_ACCESS[role] || [];

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: THEME.sidebarBg,
      color: THEME.textPrimary,
      borderRight: `1px solid ${THEME.divider}`
    }}>
      <Box sx={{ px: 1, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', overflow: 'hidden' }}>
        <img src="/qualitylens-logo.png" alt="QualityLens" style={{ width: '100%', maxWidth: '260px', maxHeight: '84px', objectFit: 'contain' }} />
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
