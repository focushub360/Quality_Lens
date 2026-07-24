import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  InputAdornment,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
  Toolbar,
  Autocomplete,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Search,
  FilterList,
  Person,
  Business,
  Email as EmailIcon,
  Security,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { listUsers, createUser, updateUser, deleteUser } from '../../services/users';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#F0FDFA',
  accent: '#00B4DB',
  accentLight: '#E0F2FE',
  accentUltraLight: '#F8FAFC',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  gradientPrimary: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
  gradientAccent: 'linear-gradient(135deg, #0DA1B8 0%, #0C587D 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  hover: '#F0FDFA'
};

const ROLE_OPTS = [
  { value: 'dealer_admin', label: 'Dealer Admin' }
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'dealer_admin',
    password: '',
    dealer_id: '',
    showroom_name: '',
    is_active: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('username');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [availableDealers, setAvailableDealers] = useState([]);

  const handleToggleStatus = async (user) => {
    const userId = user._id || user.id;
    const currentActive = user.is_active !== false && user.status !== 'inactive';
    try {
      await updateUser(userId, { is_active: !currentActive, status: !currentActive ? 'active' : 'inactive' });
      load();
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update status');
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await listUsers();
      const userList = Array.isArray(data) ? data : [];
      
      const REGISTERED_ACTIVE_DEALERS = [
        { id: 'BIRD', name: 'BIRD' },
        { id: 'BMW-KUN', name: 'BMW-KUN' },
        { id: 'DEUTSCHEMOTOREN', name: 'DEUTSCHEMOTOREN' },
        { id: 'EMINENT', name: 'EMINENT' },
        { id: 'EVMAUTOKRAFT', name: 'EVMAUTOKRAFT' }
      ];
      setAvailableDealers(REGISTERED_ACTIVE_DEALERS);

      const dealerAdmins = userList.filter(user => user.role === 'dealer_admin');
      setUsers(dealerAdmins);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!open) {
      setForm({ username: '', email: '', role: 'dealer_admin', password: '', dealer_id: '', showroom_name: '', is_active: true });
      setEditingUser(null);
      setError('');
    }
  }, [open]);

  const handleCreate = async () => {
    setError('');
    if (!form.username || !form.email || !form.password || !form.showroom_name) {
      setError('Username, email, password, and showroom name are required');
      return;
    }
    if (form.role === 'dealer_admin' && !form.dealer_id) {
      setError('Dealer ID is required for Dealer Admins to link data');
      return;
    }
    try {
      await createUser(form);
      setOpen(false);
      load();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.error || 'Failed to create user');
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setError('');

    if (!form.username || !form.email || !form.showroom_name) {
      setError('Username, email, and showroom name are required');
      return;
    }

    try {
      const updateData = { ...form };
      if (!updateData.password) {
        delete updateData.password;
      }
      if (updateData.dealer_id === '') {
        updateData.dealer_id = null;
      }

      await updateUser(editingUser._id || editingUser.id, updateData);
      setOpen(false);
      load();
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this administrator?')) {
      try {
        await deleteUser(id);
        load();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'dealer_admin',
      password: user.plain_password || '',
      dealer_id: user.dealer_id || '',
      showroom_name: user.showroom_name || '',
      is_active: user.is_active !== false && user.status !== 'inactive'
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editingUser) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.dealer_id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[orderBy] || '';
    const bValue = b[orderBy] || '';

    if (order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return THEME.warning;
      case 'dealer_admin': return THEME.primary;
      default: return THEME.textSecondary;
    }
  };

  const isEditMode = Boolean(editingUser);
  const dialogTitle = isEditMode ? 'Edit Administrator' : 'Create New Administrator';
  const submitButtonText = isEditMode ? 'Update' : 'Create';

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDFA 100%)',
      py: 2.5,
      px: { xs: 2, md: 3 },
      width: '100%'
    }}>
      <Container maxWidth={false} disableGutters>
        <Box sx={{ mb: 3 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 1.5
          }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: THEME.textPrimary,
                  mb: 0.5,
                  fontSize: '1.65rem',
                  background: THEME.gradientPrimary,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Administrator Management
              </Typography>
              <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.875rem' }}>
                Manage system administrators and dealer admins
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="medium"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{
                borderRadius: 2.5,
                px: 2.5,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                background: THEME.gradientPrimary,
                boxShadow: THEME.shadowMd,
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(13, 161, 184, 0.4)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              New Administrator
            </Button>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            border: `1px solid ${THEME.border}`,
            borderRadius: 3,
            overflow: 'hidden',
            background: '#FFFFFF'
          }}
        >
          <Box sx={{
            background: 'linear-gradient(135deg, rgba(13, 161, 184, 0.05) 0%, rgba(12, 88, 125, 0.05) 100%)',
            p: 3
          }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search by username, email, or dealer ID..."
                size="medium"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(page); // Fixed the reference
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: THEME.primary }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#FFFFFF',
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: THEME.primary
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: THEME.primary,
                      borderWidth: 2
                    }
                  }
                }}
              />

              <TextField
                select
                size="medium"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
                sx={{
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#FFFFFF',
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: THEME.primary
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList sx={{ color: THEME.primary }} />
                    </InputAdornment>
                  )
                }}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="dealer_admin">Dealer Admin</MenuItem>
              </TextField>
            </Stack>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <CircularProgress sx={{ color: THEME.primary }} />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: `1px solid ${THEME.border}` }}>
            <Person sx={{ fontSize: 64, color: THEME.border, mb: 2 }} />
            <Typography variant="h6" sx={{ color: THEME.textSecondary, mb: 1 }}>
              {searchQuery || roleFilter !== 'all' ? 'No users found' : 'No administrators yet'}
            </Typography>
            <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 3 }}>
              {searchQuery || roleFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first administrator to get started'}
            </Typography>
            {!searchQuery && roleFilter === 'all' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpen(true)}
                sx={{ background: THEME.gradientPrimary }}
              >
                Create Administrator
              </Button>
            )}
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              overflow: 'hidden',
              background: '#FFFFFF'
            }}
          >
            <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
              <Table size="small" sx={{ width: '100%', tableLayout: 'auto' }}>
                <TableHead>
                  <TableRow sx={{
                    background: 'linear-gradient(135deg, rgba(13, 161, 184, 0.08) 0%, rgba(12, 88, 125, 0.08) 100%)',
                    '& th': { py: 1.2, px: 1.2 }
                  }}>
                    <TableCell sx={{ width: '20%' }}>
                      <TableSortLabel
                        active={orderBy === 'username'}
                        direction={orderBy === 'username' ? order : 'asc'}
                        onClick={() => handleRequestSort('username')}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          Username
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: '25%' }}>
                      <TableSortLabel
                        active={orderBy === 'email'}
                        direction={orderBy === 'email' ? order : 'asc'}
                        onClick={() => handleRequestSort('email')}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          Email
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: '12%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        Role
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: '13%' }}>
                      <TableSortLabel
                        active={orderBy === 'showroom_name'}
                        direction={orderBy === 'showroom_name' ? order : 'asc'}
                        onClick={() => handleRequestSort('showroom_name')}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          Showroom Name
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: '12%' }}>
                      <TableSortLabel
                        active={orderBy === 'dealer_id'}
                        direction={orderBy === 'dealer_id' ? order : 'asc'}
                        onClick={() => handleRequestSort('dealer_id')}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          Dealer ID
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: '12%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        Status (Login)
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ width: '6%', pr: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        Actions
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => {
                      const isActiveUser = user.is_active !== false && user.status !== 'inactive';
                      return (
                        <TableRow
                          key={user._id || user.id}
                          hover
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(13, 161, 184, 0.04)'
                            },
                            borderBottom: `1px solid ${THEME.borderLight}`,
                            '& td': { py: 1.2, px: 1.5 }
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                              <Box
                                sx={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: '50%',
                                  background: THEME.gradientPrimary,
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.875rem',
                                  boxShadow: '0 2px 6px rgba(13, 161, 184, 0.2)',
                                  flexShrink: 0
                                }}
                              >
                                {user.username.charAt(0).toUpperCase()}
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: THEME.textPrimary, fontSize: '0.85rem' }}>
                                {user.username}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.825rem' }}>
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Dealer Admin"
                              size="small"
                              sx={{
                                bgcolor: `${THEME.primary}15`,
                                color: THEME.primary,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 22
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: THEME.textPrimary, fontSize: '0.85rem' }}>
                              {user.showroom_name || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{
                              fontFamily: 'monospace',
                              color: user.dealer_id ? THEME.textPrimary : THEME.textSecondary,
                              fontSize: '0.825rem',
                              fontWeight: 600
                            }}>
                              {user.dealer_id ? (user.dealer_id.toLowerCase().includes('bmw') ? 'BMW-KUN' : user.dealer_id.toUpperCase()) : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={isActiveUser ? "Click to Deactivate (Disables Login)" : "Click to Activate (Enables Login)"}>
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
                                <Switch
                                  size="small"
                                  checked={isActiveUser}
                                  onChange={() => handleToggleStatus(user)}
                                  color="success"
                                />
                                <Chip
                                  label={isActiveUser ? 'Active' : 'Inactive'}
                                  size="small"
                                  color={isActiveUser ? 'success' : 'error'}
                                  variant="outlined"
                                  sx={{ fontWeight: 700, fontSize: '0.675rem', height: 20 }}
                                />
                              </Box>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right" sx={{ pr: 2, whiteSpace: 'nowrap' }}>
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <Tooltip title="Edit user profile">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(user)}
                                  sx={{
                                    color: THEME.primary,
                                    '&:hover': { bgcolor: `${THEME.primary}10` }
                                  }}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Paper>
        )}

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 3, boxShadow: THEME.shadowMd }
          }}
        >
          <DialogTitle sx={{
            bgcolor: THEME.surface,
            borderBottom: `1px solid ${THEME.border}`,
            fontWeight: 600,
            color: THEME.textPrimary
          }}>
            {dialogTitle}
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: THEME.textSecondary }} />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: THEME.textSecondary }} />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                label="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                helperText={isEditMode && !form.password ? "Leave blank to keep current password" : "Required for new users"}
                required={!isEditMode && !form.password}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <TextField
                fullWidth
                select
                label="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Security sx={{ color: THEME.textSecondary }} />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {ROLE_OPTS.map(r => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                freeSolo
                options={availableDealers}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option.toUpperCase();
                  return option.id.toUpperCase();
                }}
                value={availableDealers.find(d => d.id.toLowerCase() === (form.dealer_id || '').toLowerCase()) || (form.dealer_id ? form.dealer_id.toUpperCase() : '')}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    const uppercaseVal = newValue.toUpperCase();
                    setForm({ ...form, dealer_id: uppercaseVal, showroom_name: form.showroom_name || uppercaseVal });
                  } else if (newValue && newValue.id) {
                    setForm({ ...form, dealer_id: newValue.id, showroom_name: newValue.name || newValue.id });
                  } else {
                    setForm({ ...form, dealer_id: '' });
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue) {
                    setForm({ ...form, dealer_id: newInputValue.toUpperCase() });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Dealer ID"
                    required={form.role === 'dealer_admin'}
                    helperText={form.role === 'dealer_admin' ? "Select existing dealer or type a new ID to create one" : "Optional: Assign to specific dealership"}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start" sx={{ pl: 1 }}>
                            <Business sx={{ color: THEME.textSecondary }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )}
              />
              <TextField
                fullWidth
                label="Showroom Name"
                value={form.showroom_name}
                onChange={(e) => setForm({ ...form, showroom_name: e.target.value })}
                required
                helperText="Enter the dealership/showroom name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: THEME.textSecondary }} />
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              <Box sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${THEME.borderLight}`,
                backgroundColor: THEME.surface,
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between'
              }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_active !== false}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      color="success"
                    />
                  }
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: THEME.textPrimary }}>
                        Account Status: {form.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                        {form.is_active !== false ? 'User can log in and perform dealer tasks' : 'Login disabled for this user under dealership'}
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  label={form.is_active !== false ? 'Active' : 'Inactive'}
                  color={form.is_active !== false ? 'success' : 'error'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, bgcolor: THEME.surface }}>
            <Button
              onClick={() => setOpen(false)}
              sx={{ color: THEME.textSecondary, fontWeight: 500 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                background: THEME.gradientPrimary,
                '&:hover': { opacity: 0.9 },
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 4
              }}
            >
              {submitButtonText}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
