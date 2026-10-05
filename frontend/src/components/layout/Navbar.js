// src/components/layout/Navbar.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Dialog,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Fade,
  InputAdornment,
  Badge,
  Popover
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Business,
  Analytics,
  CloudUpload,
  Assessment,
  ExitToApp,
  Person,
  Edit,
  Save,
  Cancel,
  Close,
  Visibility,
  VisibilityOff,
  SmartDisplay,
  SpaceDashboard,
  AddToQueue,
  UploadFile,
  Group,
  Settings,
  ManageAccounts,
  NotificationsActive,
  DoneAll,
  DeleteOutline
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import api from '../../services/api';

// QualityLens Branding Theme Colors
const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#E8F8FA',
  accent: '#1CB5E0',
  white: '#FFFFFF',
  background: '#FAFBFC',
  surface: '#F8FAFC',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#00A86B',
  error: '#EF4444'
};

// Menu configuration
const ROLE_ACCESS = {
  super_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: SpaceDashboard },
    { text: 'User Management', path: '/super-admin/users', icon: Group },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business }
  ],
  dealer_admin: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'Team Mgmt', path: '/dealer/users', icon: ManageAccounts }
  ],
  branch_admin: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment },
    { text: 'Team Mgmt', path: '/dealer/users', icon: ManageAccounts }
  ],
  dealer_user: [
    { text: 'Top Dashboard', path: '/dealer/dashboard', icon: SpaceDashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: AddToQueue },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: UploadFile },
    { text: 'Result', path: '/dealer/results', icon: Assessment }
  ],
};

const ROLE_LABEL = {
  super_admin: 'Super Admin',
  dealer_admin: 'Service Manager',
  branch_admin: 'Branch Admin',
  dealer_user: 'Service Advisor',
};

const ROLE_COLOR = {
  super_admin: THEME.primary,
  dealer_admin: THEME.accent,
  branch_admin: '#8B5CF6',
  dealer_user: THEME.success,
};

export default function Navbar() {
  const { user, role, logout, updateProfile } = useContext(AuthContext);
  const { tasks } = useTasks(); // Access global tasks
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isActive = (p) => location.pathname.startsWith(p);

  const [userAnchor, setUserAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const fetchNotifications = async () => {
    if (role !== 'super_admin') return;
    try {
      const res = await api.get('/admin/notifications?limit=25');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (err) {
      console.warn('Could not fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (role === 'super_admin') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 12000);
      return () => clearInterval(interval);
    }
  }, [role]);

  const handleOpenNotifs = (e) => {
    setNotifAnchor(e.currentTarget);
    fetchNotifications();
  };

  const handleCloseNotifs = () => setNotifAnchor(null);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/admin/notifications/mark-all-read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.warn('Failed to mark all read:', err);
    }
  };

  const handleDeleteNotif = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to delete notification:', err);
    }
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const openUserMenu = (e) => setUserAnchor(e.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  const handleEditClick = () => {
    navigate('/account/profile');
    closeUserMenu();
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: THEME.white }}>
      {/* Drawer Header */}
      <Box sx={{
        p: 3,
        background: 'linear-gradient(180deg, #083344 0%, #0c4a6e 100%)',
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Box sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img src="/qualitylens-logo-mark.png" alt="QualityLens" style={{ height: 48, width: 'auto' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar 
            src={user?.profile_image}
            sx={{
            width: 40,
            height: 40,
            border: '2px solid rgba(255,255,255,0.2)',
            bgcolor: THEME.primary,
          }}>
            {!user?.profile_image && <Person />}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFFFFF', lineHeight: 1.2 }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {ROLE_LABEL[role] || 'User'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ p: 2 }}>
        {(ROLE_ACCESS[role] || []).map(({ text, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={RouterLink}
            to={path}
            selected={isActive(path)}
            onClick={toggleDrawer}
            sx={{
              mb: 0.5,
              borderRadius: 1.5,
              '&.Mui-selected': {
                background: THEME.primaryUltraLight,
                color: THEME.primary,
                '& .MuiListItemIcon-root': { color: THEME.primary },
                '&:hover': {
                  background: THEME.primaryUltraLight
                }
              },
              '&:hover': {
                backgroundColor: THEME.surface
              }
            }}
          >
            <ListItemIcon sx={{
              color: isActive(path) ? THEME.primary : THEME.textTertiary,
              minWidth: 40
            }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontWeight: isActive(path) ? 600 : 500,
                fontSize: '0.9375rem',
                color: isActive(path) ? THEME.primary : THEME.textPrimary
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Main AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: THEME.white,
          borderBottom: `1px solid ${THEME.border}`,
          zIndex: theme.zIndex.drawer + 1,
          width: { md: `calc(100% - 280px)` },
          ml: { md: `280px` }
        }}
      >
        <Toolbar sx={{
          justifyContent: 'space-between',
          minHeight: { xs: '64px', sm: '72px' },
          px: { xs: 2, sm: 3 }
        }}>
          {/* Left: Menu Toggle (Mobile Only) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: THEME.textPrimary,
                  '&:hover': { background: THEME.surface }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {/* Center: Desktop Navigation - NOW REMOVED (Horizontal items are in Sidebar) */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, ml: 4 }}>
               <Typography variant="h6" sx={{ 
                 fontWeight: 700, 
                 color: THEME.textPrimary,
                 letterSpacing: '-0.5px'
               }}>
                 {ROLE_ACCESS[role]?.find(m => isActive(m.path))?.text || 'QualityLens Analyzer'}
               </Typography>
            </Box>
          )}

          {/* Right: Role + User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

            {/* Global Task Indicator */}
            {tasks && tasks.filter(t => ['pending', 'processing'].includes(t.status)).length > 0 && (
              <Chip
                icon={<CircularProgress size={16} color="inherit" />}
                label={`Processing (${tasks.filter(t => ['pending', 'processing'].includes(t.status)).length})`}
                size="small"
                sx={{
                  background: THEME.primaryUltraLight,
                  color: THEME.primary,
                  borderColor: THEME.primary,
                  fontWeight: 600,
                  border: `1px solid ${THEME.primary}40`,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 },
                  }
                }}
                onClick={() => navigate((role === 'dealer_admin' || role === 'branch_admin') ? '/dealer/new' : '/dealer/dashboard')}
              />
            )}

            {/* Super Admin Invalid Link Notifications */}
            {role === 'super_admin' && (
              <>
                <Tooltip title="Invalid Link Alerts & Notifications">
                  <IconButton
                    onClick={handleOpenNotifs}
                    sx={{
                      p: 1,
                      color: unreadCount > 0 ? '#EF4444' : THEME.textSecondary,
                      '&:hover': { background: THEME.surface }
                    }}
                  >
                    <Badge badgeContent={unreadCount} color="error" max={99}>
                      <NotificationsActive sx={{ fontSize: 22 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Popover
                  open={Boolean(notifAnchor)}
                  anchorEl={notifAnchor}
                  onClose={handleCloseNotifs}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      width: 420,
                      maxWidth: '92vw',
                      maxHeight: 520,
                      borderRadius: 3,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
                      border: `1px solid ${THEME.border}`,
                      overflow: 'hidden'
                    }
                  }}
                >
                  <Box sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${THEME.borderLight}`,
                    background: THEME.surface
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight="700" sx={{ color: THEME.textPrimary }}>
                        🚨 Invalid Link Alerts
                      </Typography>
                      {unreadCount > 0 && (
                        <Chip
                          label={`${unreadCount} New`}
                          size="small"
                          color="error"
                          sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                        />
                      )}
                    </Box>
                    {notifications.length > 0 && (
                      <Button
                        size="small"
                        onClick={handleMarkAllRead}
                        startIcon={<DoneAll sx={{ fontSize: 16 }} />}
                        sx={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 600, color: THEME.primary }}
                      >
                        Mark all read
                      </Button>
                    )}
                  </Box>

                  <Box sx={{ maxHeight: 420, overflowY: 'auto', p: 1.5 }}>
                    {notifications.length === 0 ? (
                      <Box sx={{ py: 5, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>✅</Typography>
                        <Typography variant="body2" fontWeight="600" sx={{ color: THEME.textPrimary }}>
                          No Invalid Link Alerts
                        </Typography>
                        <Typography variant="caption" sx={{ color: THEME.textTertiary }}>
                          All advisor and dealer video submissions are healthy.
                        </Typography>
                      </Box>
                    ) : (
                      notifications.map((n) => (
                        <Paper
                          key={n.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 1.5,
                            borderRadius: 2,
                            background: n.is_read ? THEME.surface : '#FFFBEB',
                            border: `1px solid ${n.is_read ? THEME.borderLight : '#FDE68A'}`,
                            position: 'relative'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                label={n.dealer_id || 'Unknown Dealership'}
                                size="small"
                                sx={{
                                  height: 22,
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: '#EFF6FF',
                                  color: '#1D4ED8'
                                }}
                              />
                              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                                By: {n.submitted_by_username} {n.submitted_by_role === 'dealer_user' ? '(Advisor)' : '(Manager)'}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => handleDeleteNotif(n.id, e)}
                              sx={{ p: 0.5, color: THEME.textTertiary, '&:hover': { color: '#EF4444' } }}
                            >
                              <DeleteOutline sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          <Box sx={{ p: 1.2, mb: 1, background: '#FEF2F2', borderRadius: 1.5, borderLeft: '3px solid #EF4444' }}>
                            <Typography variant="caption" sx={{ color: '#B91C1C', fontWeight: 600, display: 'block' }}>
                              ⚠️ Failure Reason:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#991B1B', display: 'block', mt: 0.2 }}>
                              {n.error_reason || 'Video not found or link expired'}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: THEME.textTertiary,
                                maxWidth: '240px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontFamily: 'monospace'
                              }}
                              title={n.url}
                            >
                              {n.url}
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.textTertiary, fontSize: '0.68rem' }}>
                              {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </Typography>
                          </Box>
                        </Paper>
                      ))
                    )}
                  </Box>
                </Popover>
              </>
            )}

            {/* Username + Role Label */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end', mr: 0.5 }}>
              <Typography variant="body2" sx={{
                fontWeight: 600,
                color: THEME.textPrimary,
                lineHeight: 1.3,
                fontSize: '0.875rem'
              }}>
                {user?.username || 'User'}
              </Typography>
              <Typography variant="caption" sx={{
                fontWeight: 600,
                color: ROLE_COLOR[role] || THEME.primary,
                lineHeight: 1.2,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {ROLE_LABEL[role] || 'User'}
              </Typography>
              {(user?.showroom_name || user?.dealer_id) && role !== 'super_admin' && (
                <Typography variant="caption" sx={{
                  fontWeight: 600,
                  color: THEME.primary,
                  fontSize: '0.68rem',
                  maxWidth: 160,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user.showroom_name || user.dealer_id}
                </Typography>
              )}
            </Box>

            {/* User Avatar */}
            <Tooltip title="Account">
              <IconButton
                onClick={openUserMenu}
                sx={{
                  p: 0.5,
                  border: `2px solid ${ROLE_COLOR[role] || THEME.border}30`,
                  '&:hover': {
                    borderColor: ROLE_COLOR[role] || THEME.primary,
                    background: THEME.primaryUltraLight
                  }
                }}
              >
                <Avatar
                  src={user?.profile_image}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: ROLE_COLOR[role] || THEME.primary,
                    fontWeight: 700,
                    fontSize: '15px'
                  }}
                >
                  {!user?.profile_image && (user?.username || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            border: 'none'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={closeUserMenu}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            border: `1px solid ${THEME.border}`,
            borderRadius: 2
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} color={THEME.textPrimary}>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="caption" color={THEME.textSecondary} sx={{ display: 'block', mb: 0.5 }}>
            {user?.email || 'user@example.com'}
          </Typography>
          {(user?.showroom_name || user?.dealer_id) && (
            <Chip
              size="small"
              icon={<Business sx={{ fontSize: '13px !important' }} />}
              label={user.showroom_name || user.dealer_id}
              sx={{
                mt: 0.5,
                fontSize: '0.72rem',
                height: 22,
                bgcolor: '#E0F2FE',
                color: '#0369A1',
                fontWeight: 600,
                maxWidth: 220,
                '& .MuiChip-label': { px: 1, textOverflow: 'ellipsis', overflow: 'hidden' }
              }}
            />
          )}
        </Box>
        <Divider />

        {/* Edit Profile Menu Item */}
        <MenuItem
          onClick={handleEditClick}
          sx={{
            color: THEME.textPrimary,
            py: 1.5,
            '&:hover': {
              background: THEME.surface
            }
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: THEME.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Edit Profile</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => { closeUserMenu(); logout(); }}
          sx={{
            color: THEME.textPrimary,
            py: 1.5,
            '&:hover': {
              background: THEME.surface
            }
          }}
        >
          <ListItemIcon>
            <ExitToApp fontSize="small" sx={{ color: THEME.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Logout</Typography>
        </MenuItem>
      </Menu>



      {/* Toolbar spacer */}
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }} />
    </>
  );
}

// Navigation Button Component
function NavButton({ to, icon: Icon, active, children }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2.5,
          py: 1.25,
          borderRadius: 50,
          color: active ? THEME.primary : THEME.textSecondary,
          background: active ? THEME.white : 'transparent',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: active ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: active ? THEME.white : 'rgba(255,255,255,0.5)',
            color: THEME.primary,
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'scale(0.98)'
          }
        }}
      >
        {Icon && <Icon sx={{
          fontSize: 20,
          transition: 'transform 0.3s ease',
          transform: active ? 'scale(1.1)' : 'scale(1)'
        }} />}
        <Typography variant="body2" fontWeight={active ? 700 : 600} sx={{ letterSpacing: '0.01em' }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
