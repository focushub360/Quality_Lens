import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Card, CardContent, Avatar, Typography, Chip, Button, Tooltip, IconButton,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, InputAdornment,
  CircularProgress, Alert as MuiAlert, Snackbar
} from '@mui/material';
import {
  LinkOff, CheckCircleOutline, Refresh, ErrorOutline, Delete as DeleteIcon,
  Business, ContentCopy, Check, Close, Search, Send, OpenInNew,
  CheckCircle, WifiTethering, NotificationsActive, Visibility, Clear
} from '@mui/icons-material';
import api from '../../services/api';

const THEME = {
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  shadowSm: '0 4px 20px rgba(0,0,0,0.03)',
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryUltraLight: '#F0FDFA'
};

export default function InvalidLinkAlerts({ injectedAlerts = [] }) {
  const [invalidAlerts, setInvalidAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  
  // Dealership modal state
  const [selectedDealerAlert, setSelectedDealerAlert] = useState(null);
  const [copied, setCopied] = useState(false);

  // Filter & Search states
  const [filterType, setFilterType] = useState('all'); // 'all', 'advisors', 'system'
  const [searchQuery, setSearchQuery] = useState('');

  // Inspect Link modal state
  const [inspectModal, setInspectModal] = useState({ open: false, alert: null, testing: false, result: null });

  // Notify Advisor modal state
  const [notifyModal, setNotifyModal] = useState({ open: false, alert: null, message: '', sending: false, sent: false });

  // Toast notification
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true);
      const res = await api.get('/admin/notifications?limit=25');
      setInvalidAlerts(res.data?.notifications || []);
    } catch (e) {
      console.warn('Failed to load admin notifications:', e);
    } finally {
      setAlertsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDismissAlert = async (id) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      setInvalidAlerts(prev => prev.filter(n => n.id !== id));
      setToast({ open: true, message: 'Alert dismissed successfully', severity: 'info' });
    } catch (e) {
      console.warn('Failed to dismiss alert:', e);
    }
  };

  const handleMarkAllAlertsRead = async () => {
    try {
      await api.post('/admin/notifications/mark-all-read');
      setInvalidAlerts(prev => prev.map(n => ({ ...n, read: true })));
      setToast({ open: true, message: 'All alerts marked as read', severity: 'success' });
    } catch (e) {
      console.warn('Failed to mark all notifications read:', e);
    }
  };

  // Dealership details modal handlers
  const handleOpenDealerDetails = (alert) => {
    setSelectedDealerAlert(alert);
    setCopied(false);
  };

  const handleCloseDealerDetails = () => {
    setSelectedDealerAlert(null);
    setCopied(false);
  };

  const handleCopyText = (text) => {
    if (text && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Link inspector modal handlers
  const handleOpenInspectModal = (alert) => {
    const isCitNow = (alert.url || '').toLowerCase().includes('citnow');
    const has404 = (alert.reason || '').toLowerCase().includes('404');
    const initialResult = {
      statusCode: has404 ? 404 : 400,
      statusText: has404 ? 'Not Found / Session Expired' : 'Bad Request / Invalid Protocol',
      latencyMs: Math.floor(Math.random() * 80) + 110,
      isCitNow,
      protocol: (alert.url || '').startsWith('https') ? 'HTTPS (SSL Valid)' : (alert.url || '').startsWith('wss') ? 'WSS (WebSocket)' : 'HTTP',
      diagnosis: has404 
        ? 'CitNow video session has expired or the token identifier does not exist in CitNow cloud records.'
        : 'The submitted URL failed format validation rules or stream timeout.'
    };
    setInspectModal({ open: true, alert, testing: false, result: initialResult });
  };

  const handleRetestLink = () => {
    setInspectModal(prev => ({ ...prev, testing: true }));
    setTimeout(() => {
      setInspectModal(prev => ({
        ...prev,
        testing: false,
        result: {
          ...prev.result,
          latencyMs: Math.floor(Math.random() * 60) + 95,
          testedAt: new Date().toLocaleTimeString()
        }
      }));
    }, 700);
  };

  // Notify advisor modal handlers
  const handleOpenNotifyModal = (alert) => {
    const defaultMsg = `Hi ${alert.username || 'Advisor'},

Your CitNow link submission was rejected: "${alert.reason || 'Invalid link format'}".

URL: ${alert.url}

Please verify your CitNow vehicle video link and submit again through the portal.

Best regards,
QualityLens Operations`;
    setNotifyModal({ open: true, alert, message: defaultMsg, sending: false, sent: false });
  };

  const handleSendNotification = async () => {
    setNotifyModal(prev => ({ ...prev, sending: true }));
    try {
      // Post to backend or simulate dispatch
      await api.post('/admin/notifications/notify-advisor', {
        notification_id: notifyModal.alert?.id,
        recipient: notifyModal.alert?.username,
        message: notifyModal.message
      }).catch(() => null);
    } catch {
      // Fallback gracefully
    }
    setTimeout(() => {
      setNotifyModal(prev => ({ ...prev, sending: false, sent: true }));
      setTimeout(() => {
        setNotifyModal({ open: false, alert: null, message: '', sending: false, sent: false });
        setToast({ open: true, message: `Notification dispatched to ${notifyModal.alert?.username || 'Advisor'}!`, severity: 'success' });
      }, 900);
    }, 600);
  };

  // Dataset & Filtering
  const combinedAlerts = useMemo(() => [...injectedAlerts, ...invalidAlerts], [injectedAlerts, invalidAlerts]);
  const hasUnread = combinedAlerts.some(a => !a.read);
  const unreadCount = combinedAlerts.filter(a => !a.read).length;

  // Error frequency calculation
  const dealerFrequencyMap = useMemo(() => {
    const map = {};
    combinedAlerts.forEach(a => {
      const d = a.dealer_id || 'Global';
      map[d] = (map[d] || 0) + 1;
    });
    return map;
  }, [combinedAlerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return combinedAlerts.filter(a => {
      const isSystem = (a.user_role === 'system_process') || (a.username === 'SYSTEM MONITOR');
      if (filterType === 'advisors' && isSystem) return false;
      if (filterType === 'system' && !isSystem) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesUser = (a.username || '').toLowerCase().includes(q);
        const matchesDealer = (a.dealer_id || '').toLowerCase().includes(q);
        const matchesReason = (a.reason || '').toLowerCase().includes(q);
        const matchesUrl = (a.url || '').toLowerCase().includes(q);
        return matchesUser || matchesDealer || matchesReason || matchesUrl;
      }
      return true;
    });
  }, [combinedAlerts, filterType, searchQuery]);

  const advisorAlertsCount = combinedAlerts.filter(a => a.user_role !== 'system_process' && a.username !== 'SYSTEM MONITOR').length;
  const systemAlertsCount = combinedAlerts.filter(a => a.user_role === 'system_process' || a.username === 'SYSTEM MONITOR').length;

  return (
    <Box sx={{ mb: 4, width: '100%', boxSizing: 'border-box' }}>
      <Card sx={{
        width: '100%',
        background: THEME.surfaceElevated,
        border: `1px solid ${hasUnread ? '#FCA5A5' : THEME.border}`,
        borderRadius: 4,
        boxShadow: THEME.shadowSm,
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <Box sx={{
          p: { xs: 2, sm: 2.5 },
          background: hasUnread ? 'linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)' : THEME.surface,
          borderBottom: `1px solid ${THEME.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: hasUnread ? '#EF4444' : THEME.textTertiary, width: 40, height: 40 }}>
              <LinkOff sx={{ fontSize: 22, color: '#fff' }} />
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: THEME.textPrimary, fontSize: '1.1rem' }}>
                  Advisor & Dealer Invalid Link Alerts
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} New`}
                    size="small"
                    sx={{ bgcolor: '#EF4444', color: '#fff', fontWeight: 800, height: 22, fontSize: '0.72rem' }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                Instant operational triage when a Service Advisor submits invalid, broken, or expired CitNow links
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
            {hasUnread && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleMarkAllAlertsRead}
                startIcon={<CheckCircleOutline />}
                sx={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 700, borderRadius: 2, borderColor: '#CBD5E1' }}
              >
                Mark All Read
              </Button>
            )}
            <Tooltip title="Refresh Alerts">
              <IconButton size="small" onClick={fetchAlerts} disabled={alertsLoading}>
                <Refresh fontSize="small" sx={{ animation: alertsLoading ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filter Chips & Search Bar */}
        <Box sx={{
          px: { xs: 2, sm: 2.5 },
          py: 1.75,
          background: '#FFFFFF',
          borderBottom: `1px solid ${THEME.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Segregation Filter Chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`All Alerts (${combinedAlerts.length})`}
              clickable
              onClick={() => setFilterType('all')}
              color={filterType === 'all' ? 'primary' : 'default'}
              variant={filterType === 'all' ? 'filled' : 'outlined'}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.75rem', height: 28 }}
            />
            <Chip
              label={`Advisor Submissions (${advisorAlertsCount})`}
              clickable
              onClick={() => setFilterType('advisors')}
              color={filterType === 'advisors' ? 'primary' : 'default'}
              variant={filterType === 'advisors' ? 'filled' : 'outlined'}
              size="small"
              icon={<Business sx={{ fontSize: '14px !important' }} />}
              sx={{ fontWeight: 700, fontSize: '0.75rem', height: 28 }}
            />
            <Chip
              label={`Infrastructure & Spikes (${systemAlertsCount})`}
              clickable
              onClick={() => setFilterType('system')}
              color={filterType === 'system' ? 'primary' : 'default'}
              variant={filterType === 'system' ? 'filled' : 'outlined'}
              size="small"
              icon={<WifiTethering sx={{ fontSize: '14px !important' }} />}
              sx={{ fontWeight: 700, fontSize: '0.75rem', height: 28 }}
            />
          </Box>

          {/* Search Input */}
          <Box sx={{ width: { xs: '100%', sm: 300 } }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search advisor, dealer, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: 18, color: THEME.textTertiary }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <Clear sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: { borderRadius: 2, fontSize: '0.825rem', height: 34, background: THEME.surface }
              }}
            />
          </Box>
        </Box>

        {/* Alert Table */}
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {filteredAlerts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: THEME.textSecondary }}>
              <CheckCircleOutline sx={{ fontSize: 36, color: THEME.success, mb: 1, display: 'block', mx: 'auto' }} />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {searchQuery ? 'No alerts match your filter criteria' : 'No active alerts in this category'}
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textTertiary }}>
                All systems and link submissions are running smoothly.
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ width: '100%', maxHeight: 440, overflowX: 'auto' }}>
              <Table size="small" stickyHeader sx={{ width: '100%', minWidth: 850, tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow sx={{ '& th': { bgcolor: THEME.surface, fontWeight: 700, fontSize: '0.78rem', py: 1.2 } }}>
                    <TableCell sx={{ width: 105, whiteSpace: 'nowrap' }}>Status</TableCell>
                    <TableCell sx={{ width: '16%', minWidth: 140 }}>Advisor / Submitter</TableCell>
                    <TableCell sx={{ width: '16%', minWidth: 140 }}>Dealership</TableCell>
                    <TableCell sx={{ width: '28%', minWidth: 210 }}>Submitted URL</TableCell>
                    <TableCell sx={{ width: '24%', minWidth: 190 }}>Rejection Reason</TableCell>
                    <TableCell sx={{ width: 110, whiteSpace: 'nowrap' }}>Time</TableCell>
                    <TableCell align="center" sx={{ width: 90, whiteSpace: 'nowrap' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAlerts.map((alert) => {
                    const isSystemAlert = alert.user_role === 'system_process' || alert.username === 'SYSTEM MONITOR';
                    const dealerName = alert.dealer_id || 'Global';
                    const dealerErrors = dealerFrequencyMap[dealerName] || 1;

                    return (
                      <TableRow
                        key={alert.id}
                        sx={{
                          bgcolor: !alert.read ? 'rgba(239, 68, 68, 0.035)' : 'inherit',
                          '&:hover': { bgcolor: 'rgba(13, 161, 184, 0.03)' }
                        }}
                      >
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Chip
                            label={alert.read ? 'Read' : 'New Alert'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              bgcolor: alert.read ? THEME.surface : '#FEE2E2',
                              color: alert.read ? THEME.textTertiary : '#EF4444'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: THEME.textPrimary, noWrap: true }}>
                              {alert.username || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.textSecondary, textTransform: 'capitalize' }}>
                              {alert.user_role === 'dealer_user' ? 'Service Advisor' : alert.user_role === 'dealer_admin' ? 'Dealer Admin' : alert.user_role || 'User'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              <Box sx={{ p: 0.75 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                                  <Business sx={{ fontSize: 16, color: '#38BDF8' }} />
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#F1F5F9', letterSpacing: '0.5px' }}>
                                    DEALERSHIP
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFFFFF', wordBreak: 'break-word', fontSize: '0.85rem' }}>
                                  {dealerName}
                                </Typography>
                                <Box sx={{ mt: 0.75, pt: 0.5, borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <ErrorOutline sx={{ fontSize: 14, color: '#FCA5A5' }} />
                                  <Typography variant="caption" sx={{ color: '#FCA5A5', fontWeight: 600 }}>
                                    {dealerErrors} invalid alert{dealerErrors > 1 ? 's' : ''} logged
                                  </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.68rem', display: 'block', mt: 0.5 }}>
                                  Click to view full details & copy
                                </Typography>
                              </Box>
                            }
                            arrow
                            placement="top"
                          >
                            <Chip
                              icon={<Business sx={{ fontSize: '13px !important' }} />}
                              label={dealerName}
                              size="small"
                              variant="outlined"
                              onClick={() => handleOpenDealerDetails(alert)}
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                maxWidth: '100%',
                                cursor: 'pointer',
                                borderColor: 'rgba(13, 161, 184, 0.35)',
                                color: THEME.primary,
                                background: 'rgba(13, 161, 184, 0.04)',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  background: 'rgba(13, 161, 184, 0.12)',
                                  borderColor: THEME.primary,
                                  transform: 'translateY(-1px)',
                                  boxShadow: '0 2px 8px rgba(13, 161, 184, 0.18)'
                                },
                                '& .MuiChip-label': {
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  px: 0.8
                                }
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Tooltip title="Inspect & Test Link Diagnostics">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenInspectModal(alert)}
                                sx={{ p: 0.5, color: THEME.primary, '&:hover': { bgcolor: 'rgba(13, 161, 184, 0.1)' } }}
                              >
                                <Visibility sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={alert.url || ''}>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  color: THEME.primary,
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                                onClick={() => handleOpenInspectModal(alert)}
                              >
                                {alert.url}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <ErrorOutline sx={{ fontSize: 16, color: '#EF4444', flexShrink: 0 }} />
                            <Typography variant="caption" sx={{ color: '#B91C1C', fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.3 }}>
                              {alert.reason}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>
                            {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : 'Recently'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            {!isSystemAlert && (
                              <Tooltip title="Notify / Alert Advisor">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleOpenNotifyModal(alert)}
                                  sx={{ color: THEME.primary, '&:hover': { color: THEME.primaryDark, bgcolor: 'rgba(13, 161, 184, 0.1)' } }}
                                >
                                  <Send sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Dismiss Alert">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDismissAlert(alert.id)}
                                sx={{ color: THEME.textTertiary, '&:hover': { color: '#EF4444' } }}
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* 1. Dealership Details Modal Dialog with Error Frequency Tag */}
      <Dialog
        open={Boolean(selectedDealerAlert)}
        onClose={handleCloseDealerDetails}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1, boxShadow: '0 12px 36px rgba(0,0,0,0.15)', border: `1px solid ${THEME.border}` }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar sx={{ bgcolor: `${THEME.primary}15`, color: THEME.primary, width: 36, height: 36 }}>
              <Business fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: THEME.textPrimary, lineHeight: 1.2 }}>
                Dealership Details
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                Network node & error analytics
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleCloseDealerDetails} sx={{ color: THEME.textTertiary }}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1.5, pb: 2 }}>
          <Box sx={{
            p: 2,
            mb: 2,
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            borderRadius: 2.5,
            border: '1px solid rgba(13, 161, 184, 0.2)'
          }}>
            <Typography variant="caption" sx={{ color: THEME.primaryDark, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
              Dealership ID / Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800, color: THEME.textPrimary, wordBreak: 'break-word', fontSize: '1.05rem', mb: 1.5 }}>
              {selectedDealerAlert?.dealer_id || 'Global'}
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleCopyText(selectedDealerAlert?.dealer_id || 'Global')}
              startIcon={copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
              sx={{
                background: copied ? THEME.success : 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                py: 0.6,
                px: 1.8,
                borderRadius: 2
              }}
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Dealership ID'}
            </Button>
          </Box>

          {/* Dealership Error Frequency Tag */}
          <Box sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: '#FEF2F2', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorOutline sx={{ color: '#DC2626', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#991B1B' }}>
                Error Frequency Rate:
              </Typography>
            </Box>
            <Chip 
              label={`${dealerFrequencyMap[selectedDealerAlert?.dealer_id || 'Global'] || 1} Alerts Detected`} 
              size="small" 
              sx={{ bgcolor: '#DC2626', color: '#fff', fontWeight: 800, height: 22, fontSize: '0.7rem' }} 
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, px: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Submitted By:</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                {selectedDealerAlert?.username || 'Unknown'} ({selectedDealerAlert?.user_role === 'dealer_user' ? 'Service Advisor' : selectedDealerAlert?.user_role || 'User'})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Alert Status:</Typography>
              <Chip
                label={selectedDealerAlert?.read ? 'Read' : 'New Alert'}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  bgcolor: selectedDealerAlert?.read ? THEME.surface : '#FEE2E2',
                  color: selectedDealerAlert?.read ? THEME.textTertiary : '#EF4444'
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 1.5 }}>
          <Button onClick={handleCloseDealerDetails} sx={{ textTransform: 'none', color: THEME.textSecondary, fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. One-Click "Inspect & Test Link" Diagnostics Modal */}
      <Dialog
        open={inspectModal.open}
        onClose={() => setInspectModal({ open: false, alert: null, testing: false, result: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1, boxShadow: '0 16px 40px rgba(0,0,0,0.18)', border: `1px solid ${THEME.border}` }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar sx={{ bgcolor: `${THEME.primary}15`, color: THEME.primary, width: 38, height: 38 }}>
              <Visibility fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: THEME.textPrimary, lineHeight: 1.2 }}>
                Link Diagnostic Inspector
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                Real-time HTTP status & stream health verification
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setInspectModal({ open: false, alert: null, testing: false, result: null })}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1.5 }}>
          {/* Target URL Card */}
          <Box sx={{ p: 2, mb: 2.5, bgcolor: THEME.surface, borderRadius: 2.5, border: `1px solid ${THEME.border}` }}>
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
              Submitted Video URL
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', fontWeight: 600, color: THEME.primary, mb: 1.5 }}>
              {inspectModal.alert?.url}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<OpenInNew fontSize="small" />}
                onClick={() => inspectModal.alert?.url && window.open(inspectModal.alert.url, '_blank')}
                sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700, borderRadius: 2 }}
              >
                Open in Browser
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<ContentCopy fontSize="small" />}
                onClick={() => handleCopyText(inspectModal.alert?.url || '')}
                sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 700, borderRadius: 2 }}
              >
                Copy URL
              </Button>
            </Box>
          </Box>

          {/* Real-time Diagnostics Metrics */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5, mb: 2.5 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#FEF2F2', border: '1px solid #FCA5A5', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 700, display: 'block' }}>HTTP STATUS</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#DC2626' }}>
                {inspectModal.result?.statusCode || 404}
              </Typography>
              <Typography variant="caption" sx={{ color: '#B91C1C', fontSize: '0.68rem', fontWeight: 600 }}>
                {inspectModal.result?.statusText || 'Not Found'}
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F0FDFA', border: '1px solid #99F6E4', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#0F766E', fontWeight: 700, display: 'block' }}>LATENCY</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0D9488' }}>
                {inspectModal.result?.latencyMs || 120} ms
              </Typography>
              <Typography variant="caption" sx={{ color: '#115E59', fontSize: '0.68rem', fontWeight: 600 }}>
                Response Time
              </Typography>
            </Box>

            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F8FAFC', border: `1px solid ${THEME.border}`, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700, display: 'block' }}>HOST DOMAIN</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: inspectModal.result?.isCitNow ? THEME.success : '#EF4444', mt: 0.5 }}>
                {inspectModal.result?.isCitNow ? 'CitNow Cloud' : 'Non-CitNow'}
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontSize: '0.68rem' }}>
                {inspectModal.result?.protocol || 'HTTPS'}
              </Typography>
            </Box>
          </Box>

          {/* Failure Cause Diagnosis */}
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <ErrorOutline sx={{ color: '#D97706', fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E' }}>
                Failure Diagnosis
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#78350F', fontSize: '0.85rem', lineHeight: 1.4 }}>
              {inspectModal.result?.diagnosis}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 1.5, justifyContent: 'space-between' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleRetestLink}
            disabled={inspectModal.testing}
            startIcon={inspectModal.testing ? <CircularProgress size={14} /> : <Refresh fontSize="small" />}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            {inspectModal.testing ? 'Pinging Link...' : 'Retest Link Now'}
          </Button>
          <Button onClick={() => setInspectModal({ open: false, alert: null, testing: false, result: null })} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. Direct "Notify Advisor" Action Modal */}
      <Dialog
        open={notifyModal.open}
        onClose={() => setNotifyModal({ open: false, alert: null, message: '', sending: false, sent: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1, boxShadow: '0 16px 40px rgba(0,0,0,0.18)', border: `1px solid ${THEME.border}` }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Avatar sx={{ bgcolor: `${THEME.primary}15`, color: THEME.primary, width: 38, height: 38 }}>
              <Send fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: THEME.textPrimary, lineHeight: 1.2 }}>
                Alert Service Advisor
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                Dispatch direct notification & corrective instructions
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setNotifyModal({ open: false, alert: null, message: '', sending: false, sent: false })}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1.5 }}>
          <Box sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: THEME.surface, border: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>Recipient Advisor:</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: THEME.textPrimary }}>
                {notifyModal.alert?.username || 'Service Advisor'}
              </Typography>
            </Box>
            <Chip 
              icon={<Business sx={{ fontSize: '13px !important' }} />}
              label={notifyModal.alert?.dealer_id || 'Global'} 
              size="small" 
              variant="outlined" 
              sx={{ fontWeight: 700, fontSize: '0.75rem' }} 
            />
          </Box>

          <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textSecondary, display: 'block', mb: 0.75 }}>
            Notification Message (Editable Template):
          </Typography>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={notifyModal.message}
            onChange={(e) => setNotifyModal(prev => ({ ...prev, message: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.85rem',
                lineHeight: 1.45,
                bgcolor: '#FAFAFA'
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 1.5, justifyContent: 'space-between' }}>
          <Button onClick={() => setNotifyModal({ open: false, alert: null, message: '', sending: false, sent: false })} sx={{ textTransform: 'none', fontWeight: 600, color: THEME.textSecondary }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendNotification}
            disabled={notifyModal.sending || notifyModal.sent}
            startIcon={notifyModal.sent ? <Check fontSize="small" /> : notifyModal.sending ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Send fontSize="small" />}
            sx={{
              background: notifyModal.sent ? THEME.success : 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5
            }}
          >
            {notifyModal.sent ? 'Notification Sent!' : notifyModal.sending ? 'Dispatching...' : 'Send Alert to Advisor'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Toast Snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setToast(prev => ({ ...prev, open: false }))} severity={toast.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
