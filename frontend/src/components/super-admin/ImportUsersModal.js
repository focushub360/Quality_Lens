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
  Collapse
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
  Business
} from '@mui/icons-material';
import { importUsersFromExcel } from '../../services/users';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showErrorsList, setShowErrorsList] = useState(false);
  const fileInputRef = useRef(null);

  const resetState = () => {
    setFile(null);
    setDefaultPassword('sales@focus');
    setShowPassword(false);
    setLoading(false);
    setError('');
    setResult(null);
    setShowErrorsList(false);
  };

  const handleClose = () => {
    if (loading) return;
    const hadSuccess = Boolean(result && result.success);
    resetState();
    onClose();
    if (hadSuccess && onSuccess) {
      onSuccess();
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }
    setError('');
    setFile(selected);
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
    setError('');
    setFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select an Excel file to import.');
      return;
    }
    if (!defaultPassword) {
      setError('Default password cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await importUsersFromExcel(file, defaultPassword);
      setResult(data);
    } catch (err) {
      console.error('Import error:', err);
      const detail = err.response?.data?.detail || err.response?.data?.error || err.message || 'Import failed.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

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
          overflow: 'hidden'
        }
      }}
    >
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
              Import Users from Excel
            </Typography>
            <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
              Auto-create Service Managers & Service Advisors grouped by Dealer
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" disabled={loading}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {!result ? (
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
                • <strong>Service Manager</strong> (Dealer Admin): Assigned automatically when Job Title contains <em>Service Manager</em> or <em>Manager / Admin</em>.<br />
                • <strong>Service Advisor</strong> (Dealer User): Assigned automatically for all advisor and technician job titles.<br />
                • <strong>Respective Dealership</strong>: Each user will be linked to the dealership specified in Column D.
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
                helperText="All imported users will be able to log in immediately with this default password."
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
                border: `2px dashed ${file ? THEME.primary : '#CBD5E1'}`,
                borderRadius: 3,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: file ? THEME.primaryUltraLight : '#FAFAFA',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: THEME.primary,
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
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: file ? '#CCFBF1' : '#F1F5F9',
                  color: file ? THEME.primary : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5
                }}
              >
                {file ? <Description sx={{ fontSize: 32 }} /> : <UploadFile sx={{ fontSize: 32 }} />}
              </Box>

              {file ? (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                    {(file.size / 1024).toFixed(1)} KB • Click or drag to replace
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: THEME.textPrimary, mb: 0.5 }}>
                    Click to browse or drag & drop your Excel report here
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                    Supports .xlsx, .xls spreadsheets
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        ) : (
          /* Results View */
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
              <Business fontSize="small" sx={{ color: THEME.primary }} /> Dealership Breakdown
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

            {/* Warnings or Skipped Rows if any */}
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
        {!result ? (
          <>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{ textTransform: 'none', color: THEME.textSecondary, fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !file}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <UploadFile />}
              sx={{
                background: THEME.gradientPrimary,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
                boxShadow: THEME.shadowSm,
                '&:hover': {
                  boxShadow: THEME.shadowMd
                }
              }}
            >
              {loading ? 'Processing Excel...' : 'Upload & Import'}
            </Button>
          </>
        ) : (
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
