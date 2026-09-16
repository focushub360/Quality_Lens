import React, { useState, useRef, useContext } from 'react';
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
  Divider,
  Tabs,
  Tab
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
  Business,
  SupervisorAccount,
  ArrowBack,
  Search,
  CheckCircleOutline,
  HighlightOff
} from '@mui/icons-material';
import { importUsersFromExcel, previewUsersFromExcel } from '../../services/users';
import { AuthContext } from '../../contexts/AuthContext';

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
  const { user: authUser } = useContext(AuthContext);
  const isDealerAdmin = authUser?.role === 'dealer_admin';

  const [file, setFile] = useState(null);
  const [defaultPassword, setDefaultPassword] = useState('sales@focus');
  const [showPassword, setShowPassword] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [activeTab, setActiveTab] = useState('eligible'); // 'eligible' or 'excluded'
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
    setActiveTab('eligible');
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
    setActiveTab('eligible');
    setPreviewLoading(true);

    try {
      const data = await previewUsersFromExcel(selectedFile);
      setPreviewData(data);
      // Auto-expand first eligible dealer if available
      if (data.eligible_summary?.dealers && data.eligible_summary.dealers.length > 0) {
        setExpandedDealer(data.eligible_summary.dealers[0].dealer_name);
      } else if (data.excluded_summary?.dealers && data.excluded_summary.dealers.length > 0) {
        setExpandedDealer(data.excluded_summary.dealers[0].dealer_name);
        setActiveTab('excluded');
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
    if (e.target) e.target.value = '';
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

  const eligibleSummary = previewData?.eligible_summary || { total_dealers: 0, total_users: 0, total_managers: 0, total_advisors: 0, dealers: [] };
  const excludedSummary = previewData?.excluded_summary || { total_dealers: 0, total_users: 0, dealers: [] };

  // Filter current tab dealers based on search
  const currentDealersList = activeTab === 'eligible' ? eligibleSummary.dealers : excludedSummary.dealers;

  const filteredDealers = (currentDealersList || []).filter(dealer => {
    if (!previewSearch) return true;
    const q = previewSearch.toLowerCase();
    const dealerMatches = dealer.dealer_name.toLowerCase().includes(q);
    const userMatches = dealer.users?.some(u =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.job_title && u.job_title.toLowerCase().includes(q))
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
          minHeight: previewData ? '620px' : 'auto'
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
                ? 'Pre-Import Inspection & Dealer Verification'
                : 'Import Users from Excel'}
            </Typography>
            <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
              {result
                ? 'Accounts successfully imported into registered dealerships'
                : previewData
                ? (isDealerAdmin ? 'Review eligible Service Advisors for your dealership' : 'Review matched existing dealers vs. uncreated excluded dealers')
                : (isDealerAdmin ? `Auto-create Service Advisors for ${authUser?.showroom_name || authUser?.dealer_id || 'your workshop'}` : 'Auto-create Service Managers & Service Advisors for existing dealerships')}
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
              Analyzing Excel File & Matching Dealerships...
            </Typography>
            <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
              Cross-referencing spreadsheet against registered dealerships in the database...
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
              {isDealerAdmin ? (
                <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', lineHeight: 1.6 }}>
                  • <strong>Workshop Scope</strong>: System automatically matches rows belonging to <strong>{authUser?.showroom_name || authUser?.dealer_id}</strong>.<br />
                  • <strong>Service Advisor</strong>: All eligible staff from your dealership are set up as <strong>Service Advisors</strong>.<br />
                  • <strong>Other Dealerships Excluded</strong>: Rows belonging to other dealerships in the file are quarantined in the Excluded tab.<br />
                  • <strong>Safe & Non-Destructive</strong>: Only your dealership's workshop accounts are created or updated.
                </Typography>
              ) : (
                <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block', lineHeight: 1.5 }}>
                  • <strong>Existing Dealers Only</strong>: System matches rows against existing created dealerships. If a dealership has not been created yet in Dealer Management, it is excluded until created.<br />
                  • <strong>Service Manager</strong>: Assigned automatically when Job Title contains <em>Service Manager</em> or <em>Manager / Admin / Lead</em>.<br />
                  • <strong>Service Advisor</strong>: Assigned automatically for all advisor and technician roles.<br />
                  • <strong>Clean & Reliable</strong>: Multi-dealer composite strings or invalid entries are safely quarantined.
                </Typography>
              )}
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

        {/* STEP 2: PRE-IMPORT INSPECTION PREVIEW */}
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
                    {previewData.total_rows} total rows scanned • {eligibleSummary.total_users} eligible for existing dealers • {excludedSummary.total_users} excluded
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
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#FFFFFF', borderColor: '#10B981' }}>
                <CheckCircleOutline sx={{ color: '#10B981', fontSize: 24, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981' }}>
                  {eligibleSummary.total_users}
                </Typography>
                <Typography variant="caption" sx={{ color: '#047857', fontWeight: 700, display: 'block' }}>
                  Eligible to Import
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#F0FDFA', borderColor: '#99F6E4' }}>
                <SupervisorAccount sx={{ color: '#0F766E', fontSize: 24, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F766E' }}>
                  {eligibleSummary.total_managers}
                </Typography>
                <Typography variant="caption" sx={{ color: '#0F766E', fontWeight: 700, display: 'block' }}>
                  Service Managers
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                <Business sx={{ color: THEME.primary, fontSize: 24, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.textPrimary }}>
                  {eligibleSummary.total_dealers}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, display: 'block' }}>
                  Existing Dealers Matched
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#FFFBEB', borderColor: '#FDE68A' }}>
                <HighlightOff sx={{ color: '#D97706', fontSize: 24, mb: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#D97706' }}>
                  {excludedSummary.total_users}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 700, display: 'block' }}>
                  Excluded (Dealer Not Found)
                </Typography>
              </Paper>
            </Box>

            {/* Password Configuration for Import */}
            <Box sx={{ mb: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: `1px solid ${THEME.border}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 0.5 }}>
                Default Password for Imported Accounts
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

            {/* Tabs for Eligible vs Excluded */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(e, val) => setActiveTab(val)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  value="eligible"
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleOutline fontSize="small" sx={{ color: '#10B981' }} />
                      <span>Eligible to Import ({eligibleSummary.total_users})</span>
                    </Box>
                  }
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                />
                <Tab
                  value="excluded"
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HighlightOff fontSize="small" sx={{ color: '#D97706' }} />
                      <span>Excluded / Not Created ({excludedSummary.total_users})</span>
                    </Box>
                  }
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                />
              </Tabs>
            </Box>

            {/* Tab 1: Eligible Notice */}
            {activeTab === 'eligible' && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2, py: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  These {eligibleSummary.total_users} users match {eligibleSummary.total_dealers} existing registered dealerships in your system and will be imported.
                </Typography>
              </Alert>
            )}

            {/* Tab 2: Excluded Notice */}
            {activeTab === 'excluded' && (
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, py: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  These {excludedSummary.total_users} users are EXCLUDED and will NOT be imported.
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#92400E' }}>
                  Their dealership has not been created yet in <strong>Dealer Management</strong>, or contains multiple combined dealerships. To import them later, create the dealership name in Dealer Management and re-upload this report.
                </Typography>
              </Alert>
            )}

            {/* Filter Search Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                {activeTab === 'eligible' ? 'Registered Dealerships Matched' : 'Excluded Dealerships'} ({filteredDealers.length})
              </Typography>
              <TextField
                size="small"
                placeholder="Filter by dealer or user..."
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

            {/* List of Dealers Accordions */}
            <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 0.5 }}>
              {filteredDealers.length > 0 ? (
                filteredDealers.map((dealer, dIdx) => (
                  <Accordion
                    key={dIdx}
                    expanded={expandedDealer === dealer.dealer_name}
                    onChange={() => setExpandedDealer(expandedDealer === dealer.dealer_name ? false : dealer.dealer_name)}
                    sx={{
                      mb: 1.5,
                      borderRadius: '8px !important',
                      border: `1px solid ${activeTab === 'eligible' ? THEME.border : '#FDE68A'}`,
                      bgcolor: activeTab === 'eligible' ? '#FFFFFF' : '#FFFDF5',
                      boxShadow: 'none',
                      '&:before': { display: 'none' }
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business sx={{ color: activeTab === 'eligible' ? THEME.primary : '#D97706', fontSize: 20 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                            {dealer.dealer_name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {activeTab === 'eligible' ? (
                            <>
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
                            </>
                          ) : (
                            <Chip
                              label={`${dealer.total} Excluded`}
                              size="small"
                              sx={{
                                bgcolor: '#FEF3C7',
                                color: '#B45309',
                                fontWeight: 700,
                                fontSize: '0.725rem'
                              }}
                            />
                          )}
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
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Job Title in Excel</TableCell>
                              {activeTab === 'eligible' ? (
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Role</TableCell>
                              ) : (
                                <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Exclusion Reason</TableCell>
                              )}
                              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Email</TableCell>
                              {activeTab === 'eligible' && (
                                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Action</TableCell>
                              )}
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
                                {activeTab === 'eligible' ? (
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
                                ) : (
                                  <TableCell sx={{ fontSize: '0.75rem', color: '#B45309' }}>
                                    {u.reason || dealer.reason || 'Unregistered Dealership'}
                                  </TableCell>
                                )}
                                <TableCell sx={{ fontSize: '0.775rem', color: THEME.textSecondary }}>
                                  {u.email}
                                </TableCell>
                                {activeTab === 'eligible' && (
                                  <TableCell align="center">
                                    <Chip
                                      label={u.is_existing ? 'Update Existing' : 'New User'}
                                      size="small"
                                      color={u.is_existing ? 'warning' : 'success'}
                                      variant="outlined"
                                      sx={{ fontWeight: 600, fontSize: '0.675rem', height: 20 }}
                                    />
                                  </TableCell>
                                )}
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
                    No dealerships matching "{previewSearch}"
                  </Typography>
                </Paper>
              )}
            </Box>
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
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1.5,
                mb: 3
              }}
            >
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.primary }}>
                  {result.created_count}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, display: 'block' }}>
                  New Users Created
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.accent }}>
                  {result.updated_count}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, display: 'block' }}>
                  Existing Updated
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: THEME.textPrimary }}>
                  {result.dealers_summary?.length || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, display: 'block' }}>
                  Dealers Populated
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#FFFBEB' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#D97706' }}>
                  {result.excluded_count || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 600, display: 'block' }}>
                  Rows Excluded
                </Typography>
              </Paper>
            </Box>

            {/* Dealership Breakdown Table */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Business fontSize="small" sx={{ color: THEME.primary }} /> Dealership Summary
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 260, mb: 2, borderRadius: 2 }}>
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

            {/* Warnings or skipped items */}
            {result.errors && result.errors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  startIcon={<ErrorOutline color="warning" />}
                  endIcon={showErrorsList ? <ExpandLess /> : <ExpandMore />}
                  onClick={() => setShowErrorsList(!showErrorsList)}
                  sx={{ color: THEME.warning, textTransform: 'none', fontWeight: 600 }}
                >
                  {result.errors.length} excluded row details
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
        {!previewData && !result && (
          <Button
            onClick={handleClose}
            disabled={previewLoading}
            sx={{ textTransform: 'none', color: THEME.textSecondary, fontWeight: 600 }}
          >
            Cancel
          </Button>
        )}

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
              disabled={importing || eligibleSummary.total_users === 0}
              startIcon={importing ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
              sx={{
                background: eligibleSummary.total_users > 0
                  ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                  : '#94A3B8',
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
                ? `Importing ${eligibleSummary.total_users} Users...`
                : eligibleSummary.total_users > 0
                ? `Confirm & Import ${eligibleSummary.total_users} Eligible Users`
                : 'No Registered Dealers Matched'}
            </Button>
          </>
        )}

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
