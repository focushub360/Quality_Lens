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
  Snackbar
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
  Timeline,
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
      <Box sx={{ px: 0.5, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '110px', overflow: 'hidden' }}>
        <img src="/qualitylens-logo.png" alt="QualityLens" style={{ width: '100%', maxWidth: '272px', maxHeight: '100px', objectFit: 'contain', transform: 'scale(1.08)' }} />
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

// src/components/layout/Sidebar.js - Helper component for global Analysis Monitor
function GlobalAnalysisMonitor() {
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const { role } = useContext(AuthContext);

  const isSuperAdmin = role === 'super_admin';

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
    const interval = setInterval(fetchBatches, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [role]);

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

      <ListItemButton 
        onClick={() => setOpen(!open)}
        sx={{
          borderRadius: 1.5,
          py: 0.6,
          px: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: activeBatches.length > 0 ? 'rgba(13, 161, 184, 0.08)' : 'transparent',
          '&:hover': { background: THEME.sidebarHover }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline sx={{ fontSize: 16, color: activeBatches.length > 0 ? THEME.primary : THEME.textSecondary }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: activeBatches.length > 0 ? THEME.primary : THEME.textPrimary }}>
            Analysis Monitor {activeBatches.length > 0 && `(${activeBatches.length} Active)`}
          </Typography>
        </Box>
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
          open ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit sx={{ mt: 1 }}>
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.4)', 
          borderRadius: 2, 
          p: 1, 
          maxHeight: 220, 
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
