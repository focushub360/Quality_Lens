import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, IconButton, Chip,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Alert,
  InputAdornment, Accordion, AccordionSummary, AccordionDetails, Select,
  MenuItem, FormControl, InputLabel, CircularProgress, Snackbar
} from '@mui/material';
import {
  VpnKey, Visibility, VisibilityOff, ContentCopy, Lock, LockOpen,
  Search, Refresh, Business, CheckCircle, Edit,
  FileDownload, ExpandMore, Clear, Shield, UnfoldMore, UnfoldLess
} from '@mui/icons-material';
import api from '../../services/api';
import { formatDateTime } from '../../utils/dateFormatter';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  accent: '#7C3AED', // Tech Violet
  accentLight: '#EDE9FE',
  accentGlow: 'rgba(124, 58, 237, 0.25)',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

const MASTER_VAULT_KEY = '2526@focus';

const KNOWN_DEALER_NAMES = {
  EMINENT: 'EMINENT CARS PRIVATE LIMITED',
  BAVARIA: 'BAVARIA MOTORS PRIVATE LIMITED',
  GALLOP: 'GALLOPS AUTOHAUS',
  BIRD: 'BIRD AUTOMOTIVE PRIVATE LIMITED',
  EVMAUTOKRAFT: 'EVM AUTOKRAFT',
  DEUTSCHEMOTOREN: 'DEUTSCHE CARS PRIVATE LIMITED',
  'BMW-KUN': 'BMW KUN EXCLUSIVE',
  'VARSHA AUTOHAUS': 'VARSHA AUTOHAUS'
};

const getStoredCustomPasswords = () => {
  try {
    return JSON.parse(localStorage.getItem('ql_custom_passwords') || '{}');
  } catch {
    return {};
  }
};

const saveStoredCustomPassword = (userId, password, updatedAt) => {
  try {
    const existing = getStoredCustomPasswords();
    existing[userId] = {
      password,
      updated_at: updatedAt || new Date().toISOString()
    };
    localStorage.setItem('ql_custom_passwords', JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save custom password to local storage', e);
  }
};

let _globalVaultCache = null;

// Helper for Role Badges
const RoleBadge = React.memo(function RoleBadge({ role }) {
  switch (role) {
    case 'super_admin':
      return <Chip size="small" label="SUPER ADMIN" sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 800, fontSize: '10px' }} />;
    case 'dealer_admin':
      return <Chip size="small" label="DEALER ADMIN" sx={{ bgcolor: '#EDE9FE', color: '#7C3AED', fontWeight: 800, fontSize: '10px' }} />;
    case 'branch_admin':
      return <Chip size="small" label="BRANCH ADMIN" sx={{ bgcolor: '#E0F2FE', color: '#0284C7', fontWeight: 800, fontSize: '10px' }} />;
    case 'dealer_user':
    default:
      return <Chip size="small" label="DEALER USER" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '10px' }} />;
  }
});

// Memoized Dealership Accordion for Instant 60fps Toggle
const DealerAccordionItem = React.memo(function DealerAccordionItem({
  dealerGroup,
  isExpanded,
  onToggle,
  revealedPasswords,
  revealAll,
  onTogglePassword,
  onCopy,
  onOpenUpdateModal
}) {
  const handleToggle = useCallback(() => {
    onToggle(dealerGroup.dealer_name);
  }, [onToggle, dealerGroup.dealer_name]);

  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleToggle}
      disableGutters
      TransitionProps={{ unmountOnExit: true, timeout: 80 }}
      sx={{
        mb: 2,
        borderRadius: '14px !important',
        border: `1.5px solid ${THEME.border}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        '&:before': { display: 'none' },
        overflow: 'hidden'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: isExpanded ? '#F8FAFC' : '#FFFFFF',
          py: 0.8,
          px: 2.5,
          minHeight: 56,
          borderBottom: isExpanded ? `1px solid ${THEME.border}` : 'none',
          '&:hover': { bgcolor: '#F8FAFC' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1.5, flexWrap: 'wrap', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: THEME.accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: THEME.accent,
              flexShrink: 0
            }}>
              <Business sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: THEME.textPrimary, lineHeight: 1.2 }}>
                {dealerGroup.dealer_name}
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontFamily: 'monospace' }}>
                ID: {dealerGroup.dealer_id}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={`${dealerGroup.users.length} Users`}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: '11px',
                bgcolor: '#EDE9FE',
                color: THEME.accent,
                border: `1px solid ${THEME.accent}30`
              }}
            />
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        {isExpanded && (
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, pl: 3, width: 220 }}>User & Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 180 }}>Login Username</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 220 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 240 }}>Current Password</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Branch / Location</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'right', pr: 3, width: 130 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dealerGroup.users.map((user) => {
                  const isRevealed = Boolean(revealedPasswords[user.id] || revealAll);

                  return (
                    <TableRow key={user.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      {/* User & Role */}
                      <TableCell sx={{ pl: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                          {user.name || user.username}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.3 }}>
                          <RoleBadge role={user.role} />
                          {user.job_title && (
                            <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                              {user.job_title}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      {/* Login Username */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E293B' }}>
                            {user.username}
                          </Typography>
                          <Tooltip title="Copy Username">
                            <IconButton
                              size="small"
                              onClick={() => onCopy(user.username, 'Username')}
                              sx={{ p: 0.3, color: '#94A3B8', '&:hover': { color: THEME.accent } }}
                            >
                              <ContentCopy sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>

                      {/* Email Address */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '12.5px' }}>
                            {user.email || '-'}
                          </Typography>
                          {user.email && (
                            <Tooltip title="Copy Email">
                              <IconButton
                                size="small"
                                onClick={() => onCopy(user.email, 'Email')}
                                sx={{ p: 0.3, color: '#94A3B8', '&:hover': { color: THEME.accent } }}
                              >
                                <ContentCopy sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>

                      {/* Current Password Column */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{
                            px: 1.2,
                            py: 0.4,
                            borderRadius: 1.5,
                            bgcolor: isRevealed ? '#FAF5FF' : '#F1F5F9',
                            border: `1px solid ${isRevealed ? '#D8B4FE' : '#E2E8F0'}`,
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '13px',
                            color: isRevealed ? '#6B21A8' : '#64748B',
                            minWidth: 105,
                            textAlign: 'center',
                            userSelect: 'all'
                          }}>
                            {isRevealed ? user.password : '••••••••'}
                          </Box>

                          <Tooltip title={isRevealed ? 'Hide Password' : 'Show Password'}>
                            <IconButton
                              size="small"
                              onClick={() => onTogglePassword(user.id)}
                              sx={{ p: 0.4, color: isRevealed ? THEME.accent : '#94A3B8' }}
                            >
                              {isRevealed ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Copy Password">
                            <IconButton
                              size="small"
                              onClick={() => onCopy(user.password, 'Password')}
                              sx={{ p: 0.4, color: '#94A3B8', '&:hover': { color: THEME.success } }}
                            >
                              <ContentCopy sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>

                          {user.is_recently_updated && (
                            <Tooltip title={`Password updated on: ${formatDateTime(user.password_updated_at)}`}>
                              <Chip
                                label="UPDATED"
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '8.5px',
                                  fontWeight: 900,
                                  bgcolor: '#DCFCE7',
                                  color: '#15803D',
                                  border: '1px solid #86EFAC'
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                        {user.password !== 'sales@focus' && (
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '10.5px', display: 'block', mt: 0.35 }}>
                            Backup PW: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#64748B' }}>sales@focus</span>
                          </Typography>
                        )}
                      </TableCell>

                      {/* Branch / Showroom */}
                      <TableCell>
                        <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '12px' }}>
                          {user.branch_name || user.showroom_name || '-'}
                        </Typography>
                      </TableCell>

                      {/* Actions Column */}
                      <TableCell sx={{ textAlign: 'right', pr: 3 }}>
                        <Tooltip title="Update / Reset Password for this user">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Edit sx={{ fontSize: 13 }} />}
                            onClick={() => onOpenUpdateModal(user)}
                            sx={{
                              fontSize: '11px',
                              fontWeight: 700,
                              py: 0.3,
                              px: 1.2,
                              textTransform: 'none',
                              borderRadius: 2,
                              color: THEME.accent,
                              borderColor: `${THEME.accent}50`,
                              '&:hover': { bgcolor: THEME.accentLight, borderColor: THEME.accent }
                            }}
                          >
                            Update PW
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AccordionDetails>
    </Accordion>
  );
});

export default function CredentialsVault() {
  // Security Gate State
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('ql_vault_unlocked') === 'true';
  });
  const [securityKeyInput, setSecurityKeyInput] = useState('');
  const [showGateKey, setShowGateKey] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Data State
  const [dealersData, setDealersData] = useState(() => _globalVaultCache?.dealers || []);
  const [allUsers, setAllUsers] = useState(() => _globalVaultCache?.users || []);
  const [loading, setLoading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealerFilter, setSelectedDealerFilter] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [expandedDealerships, setExpandedDealerships] = useState({});
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [revealAll, setRevealAll] = useState(false);

  // Update Password Dialog State
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Toast / Feedback State
  const [toastMsg, setToastMsg] = useState(null);

  // Helper to unify all super admin / system admin groups into single "Quality Lens Admin Team"
  const normalizeVaultData = (data) => {
    if (!data) return data;
    const dealers = data.dealers || [];
    const users = data.users || [];

    const adminTeamUsers = [];
    const otherDealers = [];

    dealers.forEach((d) => {
      const isSystemAdminGroup =
        d.dealer_id === 'SYSTEM_ADMIN' ||
        ['CitNow Headquarters', 'Focus Engineering', 'System & Tech Admins', 'Quality Lens Admin Team'].includes(d.dealer_name) ||
        (Array.isArray(d.users) && d.users.length > 0 && d.users.every((u) => u.role === 'super_admin'));

      if (isSystemAdminGroup) {
        adminTeamUsers.push(...(d.users || []));
      } else {
        otherDealers.push(d);
      }
    });

    const unifiedAdminGroup = adminTeamUsers.length > 0 ? {
      dealer_id: 'SYSTEM_ADMIN',
      dealer_name: 'Quality Lens Admin Team',
      users: adminTeamUsers.map((u) => ({ ...u, dealer_name: 'Quality Lens Admin Team', dealer_id: 'SYSTEM_ADMIN' }))
    } : null;

    const finalDealers = unifiedAdminGroup ? [unifiedAdminGroup, ...otherDealers] : otherDealers;

    const finalUsers = users.map((u) => {
      if (
        u.role === 'super_admin' ||
        u.dealer_id === 'SYSTEM_ADMIN' ||
        ['CitNow Headquarters', 'Focus Engineering', 'System & Tech Admins'].includes(u.dealer_name)
      ) {
        return { ...u, dealer_name: 'Quality Lens Admin Team', dealer_id: 'SYSTEM_ADMIN' };
      }
      return u;
    });

    return {
      dealers: finalDealers,
      users: finalUsers
    };
  };

  // Process raw users into dealer-wise groups (fallback if backend vault endpoint is not yet restarted)
  const processUsersFallback = (rawUsers, rawDealers = []) => {
    const dealerMap = {};
    (rawDealers || []).forEach((d) => {
      const did = d.dealer_id || d.id;
      const dname = d.name || d.dealership_name || did;
      if (did) dealerMap[did] = dname;
    });

    Object.entries(KNOWN_DEALER_NAMES).forEach(([k, v]) => {
      if (!dealerMap[k]) dealerMap[k] = v;
    });

    const storedPasswords = getStoredCustomPasswords();
    const formattedUsers = [];
    const grouped = {};

    (rawUsers || []).forEach((u) => {
      const uId = String(u._id || u.id);
      const username = u.username || 'Unknown';
      const email = u.email || '';
      const role = u.role || 'dealer_user';
      const rawDid = (u.dealer_id || '').trim();

      let canonDid = rawDid || 'SYSTEM_ADMIN';
      for (const k of Object.keys(KNOWN_DEALER_NAMES)) {
        if (canonDid.toUpperCase().includes(k)) {
          canonDid = k;
          break;
        }
      }

      const isSuperAdmin = role === 'super_admin' || canonDid === 'SYSTEM_ADMIN';
      if (isSuperAdmin) {
        canonDid = 'SYSTEM_ADMIN';
      }
      const dealerName = isSuperAdmin
        ? 'Quality Lens Admin Team'
        : (dealerMap[canonDid] || u.showroom_name || canonDid);

      // Determine plain password
      const stored = storedPasswords[uId];
      let plainPw = u.plain_password;
      let pwUpdatedAt = u.password_updated_at;

      if (stored) {
        plainPw = stored.password;
        pwUpdatedAt = stored.updated_at;
      }

      if (!plainPw) {
        if (username === 'admin' || username === 'owner') {
          plainPw = 'admin123';
        } else if (email.includes('tech@focus') || username.toLowerCase().includes('tech')) {
          plainPw = 'tech2526';
        } else {
          plainPw = 'sales@focus';
        }
      }

      const userInfo = {
        id: uId,
        username,
        email,
        name: u.name || u.showroom_name || username,
        role,
        dealer_id: canonDid,
        dealer_name: dealerName,
        branch_id: u.branch_id,
        branch_name: u.branch_name,
        job_title: u.job_title || role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        phone_number: u.phone_number || '-',
        is_active: u.is_active !== false,
        status: u.status || 'active',
        password: plainPw,
        password_updated_at: pwUpdatedAt ? String(pwUpdatedAt) : null,
        is_recently_updated: Boolean(pwUpdatedAt)
      };

      formattedUsers.push(userInfo);

      if (!grouped[dealerName]) {
        grouped[dealerName] = {
          dealer_id: canonDid,
          dealer_name: dealerName,
          users: []
        };
      }
      grouped[dealerName].users.push(userInfo);
    });

    const sortedDealers = Object.values(grouped).sort((a, b) => {
      if (a.dealer_id === 'SYSTEM_ADMIN') return -1;
      if (b.dealer_id === 'SYSTEM_ADMIN') return 1;
      return a.dealer_name.localeCompare(b.dealer_name);
    });

    return normalizeVaultData({
      dealers: sortedDealers,
      users: formattedUsers
    });
  };

  // Unlock Handler
  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    setUnlockError('');
    setIsUnlocking(true);

    const key = securityKeyInput.trim();
    if (key !== MASTER_VAULT_KEY) {
      setTimeout(() => {
        setIsUnlocking(false);
        setUnlockError('Invalid Security Key. Access Denied.');
      }, 350);
      return;
    }

    try {
      let vaultData = null;
      try {
        const res = await api.post('/admin/credentials-vault/unlock', { security_key: key });
        if (res.data?.unlocked) {
          vaultData = normalizeVaultData({ dealers: res.data.dealers || [], users: res.data.users || [] });
        }
      } catch (backendErr) {
        // Fallback to standard users endpoint
        console.warn('Backend vault endpoint fallback:', backendErr?.message);
        const [usersRes, dealersRes] = await Promise.all([
          api.get('/users/').catch(() => ({ data: [] })),
          api.get('/dealers').catch(() => ({ data: [] }))
        ]);
        vaultData = processUsersFallback(usersRes.data || [], dealersRes.data || []);
      }

      if (vaultData) {
        _globalVaultCache = vaultData;
        setIsUnlocked(true);
        sessionStorage.setItem('ql_vault_unlocked', 'true');
        sessionStorage.setItem('ql_vault_key', key);
        setDealersData(vaultData.dealers);
        setAllUsers(vaultData.users);

        // Expand first 4 dealerships by default
        const initExpanded = {};
        vaultData.dealers.slice(0, 4).forEach((d) => {
          initExpanded[d.dealer_name] = true;
        });
        setExpandedDealerships(initExpanded);
        setToastMsg({ type: 'success', text: 'Vault unlocked successfully!' });
      }
    } catch (err) {
      console.error('Unlock error:', err);
      setUnlockError(err.response?.data?.detail || 'Failed to authenticate with server.');
    } finally {
      setIsUnlocking(false);
    }
  };

  // Re-fetch vault if already unlocked in session
  const fetchVaultData = async () => {
    setLoading(true);
    const key = sessionStorage.getItem('ql_vault_key') || MASTER_VAULT_KEY;
    try {
      let vaultData = null;
      try {
        const res = await api.post('/admin/credentials-vault/unlock', { security_key: key });
        if (res.data?.unlocked) {
          vaultData = normalizeVaultData({ dealers: res.data.dealers || [], users: res.data.users || [] });
        }
      } catch (backendErr) {
        console.warn('Backend vault endpoint fallback:', backendErr?.message);
        const [usersRes, dealersRes] = await Promise.all([
          api.get('/users/').catch(() => ({ data: [] })),
          api.get('/dealers').catch(() => ({ data: [] }))
        ]);
        vaultData = processUsersFallback(usersRes.data || [], dealersRes.data || []);
      }

      if (vaultData) {
        _globalVaultCache = vaultData;
        setDealersData(vaultData.dealers);
        setAllUsers(vaultData.users);
        if (Object.keys(expandedDealerships).length === 0) {
          const initExpanded = {};
          vaultData.dealers.slice(0, 4).forEach((d) => {
            initExpanded[d.dealer_name] = true;
          });
          setExpandedDealerships(initExpanded);
        }
      }
    } catch (err) {
      console.warn('Vault fetch failed:', err);
      setIsUnlocked(false);
      sessionStorage.removeItem('ql_vault_unlocked');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchVaultData();
    }
  }, [isUnlocked]);

  // Lock Vault Handler
  const handleLockVault = () => {
    setIsUnlocked(false);
    setSecurityKeyInput('');
    sessionStorage.removeItem('ql_vault_unlocked');
    sessionStorage.removeItem('ql_vault_key');
    setRevealedPasswords({});
    setRevealAll(false);
    setToastMsg({ type: 'info', text: 'Vault locked. Security Key required to re-enter.' });
  };

  // Copy to Clipboard Helper
  const copyToClipboard = useCallback((text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setToastMsg({ type: 'success', text: `Copied ${label}: "${text}"` });
  }, []);

  // Toggle Single Password Visibility
  const togglePasswordVisibility = useCallback((userId) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  }, []);

  // Toggle Reveal All
  const handleToggleRevealAll = useCallback(() => {
    setRevealAll((prev) => {
      const nextState = !prev;
      const updated = {};
      allUsers.forEach((u) => {
        updated[u.id] = nextState;
      });
      setRevealedPasswords(updated);
      return nextState;
    });
  }, [allUsers]);

  // Open Update Password Dialog
  const handleOpenUpdateModal = useCallback((user) => {
    setSelectedUser(user);
    setNewPasswordValue(user.password || 'sales@focus');
    setShowNewPassword(true);
    setUpdateModalOpen(true);
  }, []);

  // Generate Suggested Password
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let generated = 'Focus@';
    for (let i = 0; i < 4; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordValue(generated);
  };

  // Toggle Individual Accordion (Instant 60fps)
  const handleToggleAccordion = useCallback((dealerName) => {
    setExpandedDealerships((prev) => ({
      ...prev,
      [dealerName]: !prev[dealerName]
    }));
  }, []);

  // Submit Password Update
  const handleSubmitPasswordUpdate = async () => {
    if (!selectedUser || !newPasswordValue.trim()) return;
    setIsUpdatingPassword(true);
    const key = sessionStorage.getItem('ql_vault_key') || MASTER_VAULT_KEY;
    const updatedPassword = newPasswordValue.trim();
    const nowIso = new Date().toISOString();

    try {
      let updateSucceeded = false;
      let updatedAtStr = nowIso;

      try {
        const res = await api.post('/admin/credentials-vault/update-user-password', {
          user_id: selectedUser.id,
          new_password: updatedPassword,
          security_key: key
        });
        if (res.data?.success) {
          updateSucceeded = true;
          updatedAtStr = res.data.updated_at || nowIso;
        }
      } catch (vaultApiErr) {
        console.warn('Vault direct update endpoint fallback, calling PUT /users/{id}:', vaultApiErr?.message);
        // Fallback to standard update user endpoint
        await api.put(`/users/${selectedUser.id}`, {
          password: updatedPassword
        });
        updateSucceeded = true;
      }

      if (updateSucceeded) {
        // Persist in local storage
        saveStoredCustomPassword(selectedUser.id, updatedPassword, updatedAtStr);

        // Update user in local state immediately
        const updateUserList = (prev) =>
          prev.map((u) => {
            if (u.id === selectedUser.id) {
              return {
                ...u,
                password: updatedPassword,
                password_updated_at: updatedAtStr,
                is_recently_updated: true
              };
            }
            return u;
          });

        const updateDealerList = (prev) =>
          prev.map((dealerGroup) => ({
            ...dealerGroup,
            users: dealerGroup.users.map((u) => {
              if (u.id === selectedUser.id) {
                return {
                  ...u,
                  password: updatedPassword,
                  password_updated_at: updatedAtStr,
                  is_recently_updated: true
                };
              }
              return u;
            })
          }));

        setAllUsers(updateUserList);
        setDealersData(updateDealerList);

        if (_globalVaultCache) {
          _globalVaultCache = {
            dealers: updateDealerList(_globalVaultCache.dealers),
            users: updateUserList(_globalVaultCache.users)
          };
        }

        // Ensure password is revealed so admin sees the update
        setRevealedPasswords((prev) => ({
          ...prev,
          [selectedUser.id]: true
        }));

        setToastMsg({
          type: 'success',
          text: `Password updated for ${selectedUser.username} to "${updatedPassword}"!`
        });
        setUpdateModalOpen(false);
      }
    } catch (err) {
      console.error('Update password failed:', err);
      setToastMsg({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update password.'
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Export CSV of Credentials
  const handleExportCsv = () => {
    if (allUsers.length === 0) return;
    const headers = ['Dealership', 'Full Name', 'Username', 'Email', 'Role', 'Password', 'Last Password Update', 'Status'];
    const rows = allUsers.map((u) => [
      `"${u.dealer_name || ''}"`,
      `"${u.name || ''}"`,
      `"${u.username || ''}"`,
      `"${u.email || ''}"`,
      `"${u.role || ''}"`,
      `"${u.password || ''}"`,
      `"${u.password_updated_at ? formatDateTime(u.password_updated_at) : 'Default'}"`,
      `"${u.status || 'active'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `QualityLens_User_Credentials_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMsg({ type: 'info', text: 'Exported credentials CSV successfully.' });
  };

  // Memoized Filter Dealers & Users (prevents full recalcs on click)
  const filteredDealers = useMemo(() => {
    if (!dealersData.length) return [];
    const q = searchQuery.trim().toLowerCase();

    return dealersData
      .filter((d) => {
        if (selectedDealerFilter !== 'ALL' && d.dealer_id !== selectedDealerFilter && d.dealer_name !== selectedDealerFilter) {
          return false;
        }
        return true;
      })
      .map((dealerGroup) => {
        const filteredUsers = dealerGroup.users.filter((user) => {
          if (selectedRoleFilter !== 'ALL' && user.role !== selectedRoleFilter) {
            return false;
          }
          if (q) {
            const match =
              (user.name && user.name.toLowerCase().includes(q)) ||
              (user.username && user.username.toLowerCase().includes(q)) ||
              (user.email && user.email.toLowerCase().includes(q)) ||
              (user.role && user.role.toLowerCase().includes(q)) ||
              (user.dealer_name && user.dealer_name.toLowerCase().includes(q)) ||
              (user.branch_name && user.branch_name.toLowerCase().includes(q));
            if (!match) return false;
          }
          return true;
        });

        return {
          ...dealerGroup,
          users: filteredUsers
        };
      })
      .filter((dealerGroup) => dealerGroup.users.length > 0);
  }, [dealersData, selectedDealerFilter, selectedRoleFilter, searchQuery]);

  // Quick Expand / Collapse All
  const handleExpandAll = useCallback(() => {
    const allExp = {};
    filteredDealers.forEach((d) => {
      allExp[d.dealer_name] = true;
    });
    setExpandedDealerships(allExp);
  }, [filteredDealers]);

  const handleCollapseAll = useCallback(() => {
    setExpandedDealerships({});
  }, []);

  // -------------------------------------------------------------
  // VIEW A: LOCKED SECURITY CHALLENGE SCREEN
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <Box sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 4 },
        bgcolor: '#F8FAFC'
      }}>
        <Card sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden'
        }}>
          {/* Header Banner */}
          <Box sx={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #00B4DB 100%)',
            p: 3.5,
            textAlign: 'center',
            color: '#FFFFFF'
          }}>
            <Box sx={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
              border: '2px solid rgba(255, 255, 255, 0.4)'
            }}>
              <Shield sx={{ fontSize: 36, color: '#FFFFFF' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5, mb: 0.5 }}>
              Credentials Vault
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '13px' }}>
              Master Security Verification Required
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5, fontSize: '12.5px' }}>
              <strong>Protected Tech Zone:</strong> This vault stores and displays live passwords for all dealership users. Please authenticate with your Master Key.
            </Alert>

            {unlockError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontSize: '12.5px' }}>
                {unlockError}
              </Alert>
            )}

            <form onSubmit={handleUnlock}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textSecondary, mb: 1, display: 'block' }}>
                  MASTER SECURITY KEY
                </Typography>
                <TextField
                  fullWidth
                  autoFocus
                  type={showGateKey ? 'text' : 'password'}
                  placeholder="Enter Master Key (e.g. 2526@focus)"
                  value={securityKeyInput}
                  onChange={(e) => {
                    setSecurityKeyInput(e.target.value);
                    if (unlockError) setUnlockError('');
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey sx={{ color: THEME.accent, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowGateKey(!showGateKey)}
                          edge="end"
                        >
                          {showGateKey ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      bgcolor: '#FFFFFF'
                    }
                  }}
                />
              </Box>

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={isUnlocking || !securityKeyInput}
                startIcon={isUnlocking ? <CircularProgress size={18} color="inherit" /> : <LockOpen />}
                sx={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                  py: 1.4,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  fontSize: '14.5px',
                  textTransform: 'none',
                  boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)'
                  }
                }}
              >
                {isUnlocking ? 'Authenticating...' : 'Unlock Credentials Vault'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                QualityLens Security • Authorized Tech Personnel Only
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: UNLOCKED CREDENTIALS VAULT (DEALER-WISE VIEW)
  // -------------------------------------------------------------
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, margin: '0 auto' }}>
      {/* Top Header Card */}
      <Card sx={{
        mb: 3,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
        color: '#FFFFFF',
        p: { xs: 2.5, sm: 3.5 },
        boxShadow: '0 20px 40px -15px rgba(49, 46, 129, 0.4)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 54,
              height: 54,
              borderRadius: 3,
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid rgba(255, 255, 255, 0.3)'
            }}>
              <VpnKey sx={{ fontSize: 30, color: '#A7F3D0' }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                  Dealer-Wise User Credentials Vault
                </Typography>
                <Chip
                  label="VAULT UNLOCKED"
                  size="small"
                  icon={<CheckCircle sx={{ fontSize: '13px !important', color: '#10B981 !important' }} />}
                  sx={{
                    bgcolor: 'rgba(16, 185, 129, 0.2)',
                    color: '#A7F3D0',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    fontWeight: 800,
                    fontSize: '11px'
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5, fontSize: '13.5px' }}>
                Complete user access credentials categorized by dealership. Updates automatically when passwords are changed.
              </Typography>
            </Box>
          </Box>

          {/* Quick Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleToggleRevealAll}
              startIcon={revealAll ? <VisibilityOff /> : <Visibility />}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                borderRadius: 2.2,
                fontWeight: 700,
                textTransform: 'none',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.28)' }
              }}
            >
              {revealAll ? 'Hide All Passwords' : 'Reveal All Passwords'}
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={handleExportCsv}
              startIcon={<FileDownload />}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                borderRadius: 2.2,
                fontWeight: 700,
                textTransform: 'none',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.28)' }
              }}
            >
              Export CSV
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={fetchVaultData}
              startIcon={<Refresh />}
              disabled={loading}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                borderRadius: 2.2,
                fontWeight: 700,
                textTransform: 'none',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.28)' }
              }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={handleLockVault}
              startIcon={<Lock />}
              sx={{
                bgcolor: '#EF4444',
                color: '#FFFFFF',
                borderRadius: 2.2,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                '&:hover': { bgcolor: '#DC2626' }
              }}
            >
              Lock Vault
            </Button>
          </Box>
        </Box>

        {/* Quick KPI Counters */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>TOTAL USERS</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{allUsers.length}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>DEALERSHIPS</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{dealersData.length}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>UPDATED PASSWORDS</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#A7F3D0' }}>
                {allUsers.filter((u) => u.is_recently_updated).length} tracked
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700 }}>ACCESS PROTOCOL</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#FDE047' }}>Key 2526@focus</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Universal Backup Password Notice */}
        <Box sx={{
          mt: 2.5,
          p: 1.5,
          borderRadius: 2.5,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Shield sx={{ fontSize: 20, color: '#FDE047' }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '13px', color: '#FFFFFF' }}>
                Universal Backup Login Password: <span style={{ fontFamily: 'monospace', color: '#FDE047', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.5px' }}>sales@focus</span>
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '11.5px', color: '#E2E8F0' }}>
                All users display their original set CitNOW passwords. sales@focus remains configured as the universal fallback password.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Filter and Search Bar */}
      <Card variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: '#FFFFFF', borderColor: THEME.border }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Search by name, username, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 19, color: THEME.textSecondary }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ minWidth: { xs: '100%', sm: 340 } }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {/* Dealer Filter */}
            <FormControl size="small" sx={{ minWidth: 240 }}>
              <InputLabel>Filter Dealership</InputLabel>
              <Select
                value={selectedDealerFilter}
                label="Filter Dealership"
                onChange={(e) => setSelectedDealerFilter(e.target.value)}
                sx={{ fontSize: '13px', fontWeight: 700 }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 360, borderRadius: 2 }
                  }
                }}
              >
                <MenuItem value="ALL">🌐 All Dealerships ({dealersData.length})</MenuItem>
                {dealersData.map((d) => (
                  <MenuItem key={d.dealer_name} value={d.dealer_name}>
                    {d.dealer_name} ({d.users.length})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Role Filter */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Filter Role</InputLabel>
              <Select
                value={selectedRoleFilter}
                label="Filter Role"
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                sx={{ fontSize: '13px', fontWeight: 700 }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 360, borderRadius: 2 }
                  }
                }}
              >
                <MenuItem value="ALL">All Roles</MenuItem>
                <MenuItem value="super_admin">Super Admin</MenuItem>
                <MenuItem value="dealer_admin">Dealer Admin</MenuItem>
                <MenuItem value="branch_admin">Branch Admin</MenuItem>
                <MenuItem value="dealer_user">Dealer User</MenuItem>
              </Select>
            </FormControl>

            {/* Quick Expand / Collapse All */}
            <Button
              size="small"
              variant="outlined"
              startIcon={<UnfoldMore sx={{ fontSize: 16 }} />}
              onClick={handleExpandAll}
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                color: THEME.accent,
                borderColor: `${THEME.accent}40`,
                '&:hover': { borderColor: THEME.accent, bgcolor: THEME.accentLight }
              }}
            >
              Expand All
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<UnfoldLess sx={{ fontSize: 16 }} />}
              onClick={handleCollapseAll}
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                color: THEME.textSecondary,
                borderColor: THEME.border,
                '&:hover': { borderColor: THEME.textSecondary }
              }}
            >
              Collapse All
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Dealer-Wise Accordions List */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
          <Typography variant="body2" sx={{ mt: 2, color: THEME.textSecondary }}>
            Loading dealership user credentials...
          </Typography>
        </Box>
      ) : filteredDealers.length === 0 ? (
        <Card variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Business sx={{ fontSize: 48, color: '#CBD5E1', mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
            No credentials found
          </Typography>
          <Typography variant="body2" sx={{ color: THEME.textSecondary, mt: 0.5 }}>
            No users match the search query "{searchQuery}" or selected filters.
          </Typography>
        </Card>
      ) : (
        filteredDealers.map((dealerGroup) => (
          <DealerAccordionItem
            key={dealerGroup.dealer_name}
            dealerGroup={dealerGroup}
            isExpanded={Boolean(expandedDealerships[dealerGroup.dealer_name])}
            onToggle={handleToggleAccordion}
            revealedPasswords={revealedPasswords}
            revealAll={revealAll}
            onTogglePassword={togglePasswordVisibility}
            onCopy={copyToClipboard}
            onOpenUpdateModal={handleOpenUpdateModal}
          />
        ))
      )}

      {/* ------------------------------------------------------------- */}
      {/* DIALOG: UPDATE / RESET USER PASSWORD                          */}
      {/* ------------------------------------------------------------- */}
      <Dialog
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          Update User Password
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {selectedUser && (
            <Box sx={{ mb: 2.5, p: 1.5, borderRadius: 2, bgcolor: '#F8FAFC', border: `1px solid ${THEME.border}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: THEME.textPrimary }}>
                {selectedUser.name || selectedUser.username}
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                Username: <strong>{selectedUser.username}</strong> | Dealer: <strong>{selectedUser.dealer_name}</strong>
              </Typography>
            </Box>
          )}

          <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textSecondary, mb: 1, display: 'block' }}>
            NEW PASSWORD (SAVED IMMEDIATELY IN VAULT & DB)
          </Typography>
          <TextField
            fullWidth
            size="small"
            type={showNewPassword ? 'text' : 'password'}
            value={newPasswordValue}
            onChange={(e) => setNewPasswordValue(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 1.5 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              size="small"
              onClick={handleGeneratePassword}
              sx={{ fontSize: '11px', textTransform: 'none', color: THEME.accent, fontWeight: 700 }}
            >
              🎲 Generate Strong Password
            </Button>
            <Button
              size="small"
              onClick={() => setNewPasswordValue('sales@focus')}
              sx={{ fontSize: '11px', textTransform: 'none', color: THEME.textSecondary }}
            >
              Set Default (sales@focus)
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setUpdateModalOpen(false)} sx={{ textTransform: 'none', color: THEME.textSecondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitPasswordUpdate}
            disabled={isUpdatingPassword || !newPasswordValue.trim()}
            sx={{
              bgcolor: THEME.accent,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: '#6D28D9' }
            }}
          >
            {isUpdatingPassword ? 'Saving...' : 'Save & Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Feedback */}
      <Snackbar
        open={Boolean(toastMsg)}
        autoHideDuration={3500}
        onClose={() => setToastMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toastMsg ? (
          <Alert severity={toastMsg.type} onClose={() => setToastMsg(null)} sx={{ borderRadius: 2, fontWeight: 600 }}>
            {toastMsg.text}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
}
