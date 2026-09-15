import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  UploadFile,
  Close,
  Visibility,
  VisibilityOff,
  CheckCircle,
  ErrorOutline,
  ExpandMore,
  ExpandLess,
  Description,
  Group,
  Business,
  SupervisorAccount,
  Person,
  ArrowBack,
  Search
} from '@mui/icons-material';
import { importUsersFromExcel, previewUsersFromExcel } from '../../services/users';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#F0FDFA',
  accent: '#00B4DB',
  accentLight: '#E0F2FE',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  gradientPrimary: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

export default function ImportUsersModal({ open, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [defaultPassword, setDefaultPassword] = useState('sales@focus');
  const [showPassword, setShowPassword] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showErrorsList, setShowErrorsList] = useState(false);
  const [previewSearch, setPreviewSearch] = useState('');
  const [expandedDealer, setExpandedDealer] = useState(false);
  const fileInputRef = useRef(null);

  const resetState = () => {
    setFile(null);
    setDefaultPassword('sales@focus');
    setShowPassword(false);
    setPreviewLoading(false);
    setPreviewData(null);
    setImporting(false);
    setError('');
    setResult(null);
    setShowErrorsList(false);
    setPreviewSearch('');
    setExpandedDealer(false);
  };

  const handleClose = () => {
    if (previewLoading || importing) return;
    const hadSuccess = Boolean(result && result.success);
    resetState();
    onClose();
    if (hadSuccess && onSuccess) {
      onSuccess();
    }
  };

  const analyzeFile = async (selectedFile) => {
    setFile(selectedFile);
    setError('');
    setPreviewData(null);
    setResult(null);
    setPreviewLoading(true);

    try {
      const data = await previewUsersFromExcel(selectedFile);
      setPreviewData(data);
      // Auto-expand first dealer if available
      if (data.dealers && data.dealers.length > 0) {
        setExpandedDealer(data.dealers[0].dealer_name);
      }
    } catch (err) {
      console.error('Preview error:', err);
      const detail = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to inspect Excel file.';
      setError(detail);
      setFile(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }
    analyzeFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (!dropped.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }
    analyzeFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleConfirmImport = async () => {
    if (!file) {
      setError('Please select an Excel file to import.');
      return;
    }
    if (!defaultPassword) {
      setError('Default password cannot be empty.');
      return;
    }

    setImporting(true);
    setError('');

    try {
      const data = await importUsersFromExcel(file, defaultPassword);
      setResult(data);
    } catch (err) {
      console.error('Import error:', err);
      const detail = err.response?.data?.detail || err.response?.data?.error || err.message || 'Import failed.';
      setError(detail);
    } finally {
      setImporting(false);
    }
  };

  // Filter preview dealers based on search
  const filteredDealers = (previewData?.dealers || []).filter(dealer => {
    if (!previewSearch) return true;
    const q = previewSearch.toLowerCase();
    const dealerMatches = dealer.dealer_name.toLowerCase().includes(q);
    const userMatches = dealer.users?.some(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.job_title.toLowerCase().includes(q)
    );
    return dealerMatches || userMatches;
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: THEME.shadowMd,
          overflow: 'hidden',
          minHeight: previewData ? '600px' : 'auto'
        }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
          borderBottom: `1px solid ${THEME.border}`,
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: THEME.primaryUltraLight,
              color: THEME.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${THEME.primaryLight}`
            }}
          >
            <UploadFile sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.textPrimary, fontSize: '1.1rem' }}>
              {result
                ? 'Import Completed'
                : previewData
                ? 'Pre-Import Inspection & Verification'
                : 'Import Users from Excel'}
            </Typography>
            <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
              {result
                ? 'Accounts successfully created and assigned to dealerships'
                : previewData
                ? 'Verify dealers, Service Managers, and Service Advisors before saving'
                : 'Auto-create Service Managers & Service Advisors grouped by Dealer'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={previewLoading || importing}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Loading Spinner for Preview Inspection */}
        {previewLoading && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress sx={{ color: THEME.primary, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: THEME.textPrimary }}>
              Analyzing Excel File...
            </Typography>
            <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
              Reading dealerships, calculating Service Managers & Service Advisors...
            </Typography>
          </Box>
        )}

        {/* STEP 1: INITIAL UPLOAD / SELECT SCREEN */}
        {!previewLoading && !previewData && !result && (
          <>
            {/* Template & Format Guide Banner */}
            <Box
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2.5,
                background: '#F8FAFC',
                border: `1px solid ${THEME.border}`
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 0.75 }}>
                Master Excel Format (Fixed 4 Columns)
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                  gap: 1,
                  mb: 1.5
                }}
              >
                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#FFFFFF', borderColor: '#CBD5E1' }}>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>Col A</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>Name</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#FFFFFF', borderColor: '#CBD5E1' }}>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>Col B</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>Job Title</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#FFFFFF', borderColor: '#CBD5E1' }}>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>Col C</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>E-mail</Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 1, textAlign: 'center', bgcolor: '#FFFFFF', borderColor: '#CBD5E1' }}>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>Col D</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>Dealer Names</Typography>
                </Paper>
              </Box>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', lineHeight: 1.5 }}>
                • <strong>Service Manager</strong> (Dealer Admin): Assigned when Job Title contains <em>Service Manager</em> or <em>Manager / Admin</em>.<br />
                • <strong>Service Advisor</strong> (Dealer User): Assigned for all advisor & technician roles.<br />
                • <strong>Respective Dealership</strong>: Automatically grouped under the dealer in Column D with instant preview.
              </Typography>
            </Box>

            {/* Default Password Setting */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: THEME.textPrimary, mb: 0.75 }}>
                Default Password for Created Accounts
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={showPassword ? 'text' : 'password'}
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                placeholder="e.g. sales@focus"
                helperText="All imported users will be set to this password and can log in immediately."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* File Dropzone */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed #0DA1B8`,
                borderRadius: 3,
                p: 5,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: '#FAFAFA',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: THEME.primaryDark,
                  bgcolor: THEME.primaryUltraLight
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: THEME.primaryUltraLight,
                  color: THEME.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  border: `1px solid ${THEME.primaryLight}`
                }}
              >
                <UploadFile sx={{ fontSize: 32 }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 0.5 }}>
                Select or Drop Excel Report to Inspect
              </Typography>
              <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 1 }}>
                Supports Kabir_CitNOW Report.xlsx or any standard .xlsx/.xls file
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: THEME.primary,
                  color: THEME.primary
                }}
              >
                Browse Files
              </Button>
            </Box>
          </>
        )}

        {/* STEP 2: PRE-IMPORT INSPECTION PREVIEW (BEFORE ACTUAL IMPORT) */}
        {!previewLoading && previewData && !result && (
          <Box>
            {/* File Header Bar */}
            <Box
              sx={{
                p: 1.5,
                px: 2,
                mb: 2.5,
                borderRadius: 2,
                bgcolor: THEME.primaryUltraLight,
                border: `1px solid ${THEME.primaryLight}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Description sx={{ color: THEME.primary }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                    {previewData.filename}
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                    Ready for inspection • {previewData.total_rows} rows scanned
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setPreviewData(null);
                  setFile(null);
                }}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, borderColor: '#CBD5E1', color: THEME.textSecondary }}
              >
                Choose Another File
              </Button>
            </Box>

            {/* Metric Summary Cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
                gap: 1.5,
                mb: 2.5
              }}
            >
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#FFFFFF' }}>
                <Business sx={{ color: THEME.primary, fontSize: 24, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.textPrimary }}>
                  {previewData.total_dealers}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, display: 'block' }}>
                  Dealers Found
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#F0FDFA', borderColor: '#99F6E4' }}>
                <SupervisorAccount sx={{ color: '#0F766E', fontSize: 24, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F766E' }}>
                  {previewData.total_managers}
                </Typography>
                <Typography variant="caption" sx={{ color: '#0F766E', fontWeight: 700, display: 'block' }}>
                  Service Managers
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                <Person sx={{ color: THEME.textSecondary, fontSize: 24, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.textPrimary }}>
                  {previewData.total_advisors}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, display: 'block' }}>
                  Service Advisors
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#FFFFFF', borderColor: THEME.primaryLight }}>
                <Group sx={{ color: THEME.primary, fontSize: 24, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.primary }}>
                  {previewData.total_valid_users}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.primary, fontWeight: 700, display: 'block' }}>
                  Total Accounts
                </Typography>
              </Paper>
            </Box>

            {/* Password Configuration for Import */}
            <Box sx={{ mb: 2.5, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: `1px solid ${THEME.border}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 0.5 }}>
                Default Password for All Imported Accounts
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={showPassword ? 'text' : 'password'}
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                placeholder="sales@focus"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Filter & Dealer Accordions Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                Dealerships & Assigned Users ({filteredDealers.length})
              </Typography>
              <TextField
                size="small"
                placeholder="Filter dealer or user name..."
                value={previewSearch}
                onChange={(e) => setPreviewSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 260 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" sx={{ color: THEME.textSecondary }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* List of Dealers with Expandable Users */}
            <Box sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
              {filteredDealers.length > 0 ? (
                filteredDealers.map((dealer, dIdx) => (
                  <Accordion
                    key={dIdx}
                    expanded={expandedDealer === dealer.dealer_name}
                    onChange={() => setExpandedDealer(expandedDealer === dealer.dealer_name ? false : dealer.dealer_name)}
                    sx={{
                      mb: 1.5,
                      borderRadius: '8px !important',
                      border: `1px solid ${THEME.border}`,
                      boxShadow: 'none',
                      '&:before': { display: 'none' }
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business sx={{ color: THEME.primary, fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                            {dealer.dealer_name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={`${dealer.service_managers} Manager${dealer.service_managers === 1 ? '' : 's'}`}
                            size="small"
                            sx={{
                              bgcolor: '#CCFBF1',
                              color: '#0F766E',
                              fontWeight: 700,
                              fontSize: '0.725rem'
                            }}
                          />
                          <Chip
                            label={`${dealer.service_advisors} Advisor${dealer.service_advisors === 1 ? '' : 's'}`}
                            size="small"
                            sx={{
                              bgcolor: '#F1F5F9',
                              color: THEME.textSecondary,
                              fontWeight: 600,
                              fontSize: '0.725rem'
                            }}
                          />
                          <Chip
                            label={`${dealer.total} Total`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: '0.725rem' }}
                          />
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Divider />
                      <TableContainer sx={{ maxHeight: 200 }}>
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Name</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Excel Job Title</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Assigned Role</TableCell>
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Email</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dealer.users?.map((u, uIdx) => (
                              <TableRow key={uIdx} hover>
                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                                  {u.name}
                                </TableCell>
                                <TableCell sx={{ color: THEME.textSecondary, fontSize: '0.775rem' }}>
                                  {u.job_title || '—'}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={u.role_display}
                                    size="small"
                                    sx={{
                                      bgcolor: u.role === 'dealer_admin' ? '#CCFBF1' : '#F1F5F9',
                                      color: u.role === 'dealer_admin' ? '#0F766E' : THEME.textSecondary,
                                      fontWeight: 700,
                                      fontSize: '0.7rem',
                                      height: 22
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ fontSize: '0.775rem', color: THEME.textSecondary }}>
                                  {u.email}
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={u.is_existing ? 'Update Existing' : 'New User'}
                                    size="small"
                                    color={u.is_existing ? 'warning' : 'success'}
                                    variant="outlined"
                                    sx={{ fontWeight: 600, fontSize: '0.675rem', height: 20 }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                    No dealerships or users matching "{previewSearch}"
                  </Typography>
                </Paper>
              )}
            </Box>

            {/* Warnings if any */}
            {previewData.warnings && previewData.warnings.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {previewData.warnings.length} rows have missing or invalid email addresses and will be skipped.
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* STEP 3: FINAL RESULTS VIEW (AFTER IMPORT) */}
        {result && (
          <Box>
            <Alert
              icon={<CheckCircle fontSize="inherit" />}
              severity="success"
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Import Completed Successfully!
              </Typography>
              <Typography variant="body2">
                {result.message}
              </Typography>
            </Alert>

            {/* Quick Stat Tiles */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                mb: 3
              }}
            >
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.primary }}>
                  {result.created_count}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                  New Accounts Created
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.accent }}>
                  {result.updated_count}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                  Existing Accounts Updated
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.textPrimary }}>
                  {result.dealers_summary?.length || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                  Dealerships Grouped
                </Typography>
              </Paper>
            </Box>

            {/* Dealership Breakdown Table */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business fontSize="small" sx={{ color: THEME.primary }} /> Dealership Summary
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 280, mb: 2, borderRadius: 2 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Dealership Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Service Managers</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Service Advisors</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Total Users</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.dealers_summary && result.dealers_summary.length > 0 ? (
                    result.dealers_summary.map((ds, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>
                          {ds.dealer_name}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${ds.service_managers} Manager${ds.service_managers === 1 ? '' : 's'}`}
                            size="small"
                            sx={{
                              bgcolor: THEME.primaryUltraLight,
                              color: THEME.primary,
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${ds.service_advisors} Advisor${ds.service_advisors === 1 ? '' : 's'}`}
                            size="small"
                            sx={{
                              bgcolor: '#F1F5F9',
                              color: THEME.textSecondary,
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          {ds.total}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: THEME.textSecondary }}>
                        No dealerships processed.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Warnings / skipped rows if any */}
            {result.errors && result.errors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  startIcon={<ErrorOutline color="warning" />}
                  endIcon={showErrorsList ? <ExpandLess /> : <ExpandMore />}
                  onClick={() => setShowErrorsList(!showErrorsList)}
                  sx={{ color: THEME.warning, textTransform: 'none', fontWeight: 600 }}
                >
                  {result.errors.length} row warnings/skipped during import
                </Button>
                <Collapse in={showErrorsList}>
                  <Paper variant="outlined" sx={{ p: 1.5, mt: 1, bgcolor: '#FFFBEB', borderColor: '#FDE68A', maxHeight: 150, overflowY: 'auto' }}>
                    {result.errors.map((errItem, i) => (
                      <Typography key={i} variant="caption" sx={{ display: 'block', color: '#B45309', fontFamily: 'monospace' }}>
                        • {errItem}
                      </Typography>
                    ))}
                  </Paper>
                </Collapse>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${THEME.border}`, bgcolor: '#F8FAFC' }}>
        {/* Step 1 Actions */}
        {!previewData && !result && (
          <Button
            onClick={handleClose}
            disabled={previewLoading}
            sx={{ textTransform: 'none', color: THEME.textSecondary, fontWeight: 600 }}
          >
            Cancel
          </Button>
        )}

        {/* Step 2 Actions (Preview Confirmation) */}
        {previewData && !result && (
          <>
            <Button
              onClick={() => {
                setPreviewData(null);
                setFile(null);
              }}
              disabled={importing}
              startIcon={<ArrowBack />}
              sx={{ textTransform: 'none', color: THEME.textSecondary, fontWeight: 600 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmImport}
              disabled={importing}
              startIcon={importing ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
              sx={{
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
                px: 3.5,
                py: 1,
                borderRadius: 2,
                boxShadow: THEME.shadowMd,
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {importing
                ? `Importing ${previewData.total_valid_users} Users...`
                : `Confirm & Import ${previewData.total_valid_users} Users`}
            </Button>
          </>
        )}

        {/* Step 3 Actions (Done) */}
        {result && (
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              background: THEME.gradientPrimary,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              borderRadius: 2
            }}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
