import React, { useEffect, useState, useContext } from 'react';
import {
  Box, Typography, Button, TextField, IconButton, MenuItem, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Alert, Snackbar, Container, Grid, Divider,
  Switch, FormControlLabel, Tooltip
} from '@mui/material';
import {
  Add, Delete, PersonOutline, CheckCircle, ArrowBack, Event
} from '@mui/icons-material';
import { listMyDealerUsers, createDealerUser, updateDealerUser, deleteDealerUser } from '../../services/dealer_user';
import { AuthContext } from '../../contexts/AuthContext';

// QualityLens Theme aligned colors
const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  secondaryBtn: '#94A3B8',
  success: '#10B981',
  error: '#D32F2F',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
};

const DEALER_USER_BASE_URL = 'https://focus-user.focusengineeringapp.com';

// Allowed job titles per hierarchy level (by user role being created)
const JOB_TITLES_BY_ROLE = {
  super_admin: ['General Manager', 'Sales Executive', 'Service Advisor', 'Technician', 'Other'],
  dealer_admin: ['General Manager', 'Sales Executive', 'Service Advisor', 'Technician', 'Other'],
  branch_admin: ['Sales Executive', 'Service Advisor', 'Technician', 'Other'],
  dealer_user: ['Service Advisor', 'Technician', 'Other'],
};

// Roles a creator can assign — hierarchy enforcement
const CREATABLE_ROLES = {
  dealer_admin: [
    { value: 'branch_admin', label: 'Branch Admin' },
    { value: 'dealer_user', label: 'User' },
  ],
  branch_admin: [
    { value: 'dealer_user', label: 'User' },
  ],
};

const ROLE_LABELS = {
  dealer_admin: 'Dealer Admin',
  branch_admin: 'Branch Admin',
  dealer_user: 'User',
};

export default function DealerUsers() {
  const { user: authUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // View State: 'list' | 'edit' | 'create'
  const [viewState, setViewState] = useState('list');
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState({
    title: 'Mr',
    username: '',
    email: '',
    password: '',
    role: 'dealer_user',
    dealer_id: authUser?.dealer_id || '',
    branch_id: authUser?.branch_id || '',
    branch_name: authUser?.branch_name || '',
    job_title: '',
    phone_number: ''
  });

  const allowedJobTitles = JOB_TITLES_BY_ROLE[form.role] || JOB_TITLES_BY_ROLE.dealer_user;

  const showSuccessMsg = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listMyDealerUsers();
      const safeData = Array.isArray(data) ? data : [];
      let filtered = [];

      const myId = authUser?._id || authUser?.id;
      if (authUser?.role === 'dealer_admin') {
        // dealer_admin sees branch_admin and dealer_user they created
        filtered = safeData.filter(u =>
          u.created_by_user_id === myId &&
          (u.role === 'branch_admin' || u.role === 'dealer_user')
        );
      } else if (authUser?.role === 'branch_admin') {
        // branch_admin sees only dealer_user they created in their branch
        filtered = safeData.filter(u =>
          u.created_by_user_id === myId &&
          u.role === 'dealer_user' &&
          u.branch_id === authUser.branch_id
        );
      }
      setUsers(filtered);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.dealer_id) {
      load();
    }
    // eslint-disable-next-line
  }, [authUser]);

  const handleToggleStatus = async (user) => {
    const userId = user._id || user.id;
    const currentActive = user.is_active !== false && user.status !== 'inactive';
    try {
      await updateDealerUser(userId, { is_active: !currentActive, status: !currentActive ? 'active' : 'inactive' });
      showSuccessMsg(`User login status updated to ${!currentActive ? 'ACTIVE' : 'INACTIVE'}`);
      load();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update login status.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      title: 'Mr',
      username: user.username,
      email: user.email,
      password: user.plain_password || '',
      role: user.role,
      dealer_id: user.dealer_id,
      branch_id: user.branch_id || '',
      branch_name: user.branch_name || '',
      job_title: user.job_title && allowedJobTitles.includes(user.job_title)
        ? user.job_title
        : '',
      phone_number: user.phone_number || '',
      is_active: user.is_active !== false && user.status !== 'inactive'
    });
    setViewState('edit');
  };

  const handleCreateNew = () => {
    setEditingUser(null);
    // Default to the lowest role the creator can assign
    const defaultRole = authUser?.role === 'dealer_admin' ? 'branch_admin' : 'dealer_user';
    setForm({
      title: 'Mr',
      username: '',
      email: '',
      password: '',
      role: defaultRole,
      dealer_id: authUser?.dealer_id || '',
      branch_id: authUser?.branch_id || '',
      branch_name: authUser?.branch_name || '',
      job_title: '',
      phone_number: '',
      is_active: true
    });
    setViewState('create');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to mark this user as a Leaver/Delete?')) return;
    try {
      await deleteDealerUser(id);
      await load();
      showSuccessMsg('User successfully removed.');
      if (viewState === 'edit') setViewState('list');
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const validateForm = () => {
    if (!form.username.trim()) return 'Name is required';
    if (!form.email.trim()) return 'Email is required';
    if (viewState === 'create' && (!form.password || form.password.length < 6)) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    try {
      if (editingUser) {
        const updated = { ...form };
        if (!updated.password) delete updated.password;
        await updateDealerUser(editingUser._id || editingUser.id, updated);
        showSuccessMsg('Profile updated successfully!');
      } else {
        await createDealerUser(form);
        showSuccessMsg('User created successfully!');
      }
      setViewState('list');
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to save user.');
    }
  };

  // ----- RENDER METHODS -----

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 2, background: THEME.background }}>
      <Container maxWidth="lg">
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled">{successMessage}</Alert>
        </Snackbar>

        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {viewState !== 'list' ? (
            <Box>
              <Button 
                startIcon={<ArrowBack />} 
                onClick={() => setViewState('list')}
                sx={{ mb: 2, color: THEME.textSecondary, textTransform: 'none' }}
              >
                Back to User List
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Box sx={{ background: THEME.primary, color: 'white', p: 2, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {authUser?.branch_name ? `${authUser.branch_name} - Workshop's Users` : "Dealer Standard - Workshop's Users"}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {viewState === 'list' && (
          <Box>
            <Button
              variant="contained"
              startIcon={<PersonOutline />}
              onClick={handleCreateNew}
              sx={{ 
                background: THEME.success, 
                mb: 3, 
                '&:hover': { background: '#059669' },
                textTransform: 'none',
                fontWeight: 600,
                px: 3
              }}
            >
              Create New User
            </Button>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${THEME.border}` }}>
              <Table>
                <TableHead sx={{ background: '#F1F5F9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>Login Access</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: THEME.textPrimary }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: THEME.textSecondary }}>
                        No users have been created yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map(user => (
                      <TableRow key={user._id || user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1, border: `2px solid #E2E8F0`, borderRadius: '50%', display: 'flex', mr: 2 }}>
                              <PersonOutline sx={{ color: '#94A3B8' }} />
                            </Box>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ color: '#1E293B', fontWeight: 500 }}>
                                  {user.username}
                                </Typography>
                                <Chip
                                  label={ROLE_LABELS[user.role] || user.role}
                                  size="small"
                                  sx={{
                                    fontSize: '0.65rem',
                                    height: 18,
                                    background: user.role === 'branch_admin' ? '#EDE9FE' : '#E0F2FE',
                                    color: user.role === 'branch_admin' ? '#6D28D9' : '#0369A1',
                                    fontWeight: 600
                                  }}
                                />
                              </Box>
                              {user.job_title && (
                                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                  {user.job_title}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: THEME.textSecondary, fontSize: '0.9rem' }}>
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const isActive = user.is_active !== false && user.status !== 'inactive';
                            return (
                              <Tooltip title={isActive ? "Click to disable login for this user" : "Click to enable login for this user"}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Switch
                                    size="small"
                                    checked={isActive}
                                    onChange={() => handleToggleStatus(user)}
                                    color="success"
                                  />
                                  <Chip
                                    label={isActive ? 'Active' : 'Inactive'}
                                    size="small"
                                    color={isActive ? 'success' : 'error'}
                                    variant="outlined"
                                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                  />
                                </Box>
                              </Tooltip>
                            );
                          })()}
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Button 
                            variant="contained" 
                            disableElevation
                            onClick={() => handleEdit(user)}
                            sx={{ 
                              background: THEME.secondaryBtn, 
                              color: 'white',
                              minWidth: '100px',
                              textTransform: 'none',
                              mr: 1,
                              '&:hover': { background: '#64748B' }
                            }}
                          >
                            View Details
                          </Button>
                          <IconButton 
                            onClick={() => handleDelete(user._id || user.id)}
                            sx={{ 
                              background: THEME.error, 
                              color: 'white',
                              borderRadius: 1,
                              '&:hover': { background: '#B91C1C' }
                            }}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {(viewState === 'edit' || viewState === 'create') && (
          <Box>
            {/* Header Match */}
            <Box sx={{ background: THEME.primary, color: 'white', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {viewState === 'edit' ? `${form.username} - QualityLens Dashboard` : 'Create New User Profile'}
              </Typography>
            </Box>

            {/* Leaver Section (Only on edit) */}
            {viewState === 'edit' && (
              <Paper elevation={0} sx={{ p: 4, mb: 4, border: `1px solid ${THEME.border}`, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: THEME.textPrimary, mb: 1, fontWeight: 600 }}>
                  Has {form.username} left the company?
                </Typography>
                <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 3 }}>
                  If this user has left, you can mark their account as "Leaver". This will stop them accessing the service.<br/><br/>
                  When a user is marked as a Leaver their videos are not deleted and still appear in reports.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => handleDelete(editingUser._id || editingUser.id)}
                  sx={{ 
                    background: THEME.error, 
                    textTransform: 'none', 
                    fontWeight: 600,
                    px: 3,
                    '&:hover': { background: '#B91C1C' }
                  }}
                >
                  Mark as Leaver
                </Button>
              </Paper>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ color: THEME.textPrimary, fontWeight: 700, mb: 1 }}>
                  Account Details
                </Typography>
                <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 4 }}>
                  You can update this profile using the form below. We'll use some of these details on customer facing pages, so please make sure they are accurate—we don't want any mistakes!
                </Typography>

                <Grid container spacing={3}>
                  {/* Role selector — only shown when creating, for dealer_admin */}
                  {viewState === 'create' && authUser?.role === 'dealer_admin' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Role *"
                        select
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value, job_title: '' })}
                        InputProps={{ sx: { background: THEME.surface } }}
                      >
                        {(CREATABLE_ROLES[authUser?.role] || []).map((r) => (
                          <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      select
                      value={form.job_title}
                      onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                      InputProps={{ sx: { background: THEME.surface } }}
                    >
                      {allowedJobTitles.map((title) => (
                        <MenuItem key={title || 'Other'} value={title === 'Other' ? '' : title}>
                          {title}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {/* Placeholder for spacer */}
                  </Grid>



                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Full Name *"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      InputProps={{ sx: { background: THEME.surface } }}
                    />
                  </Grid>



                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label={viewState === 'create' ? "Password *" : "Password (leave blank to keep)"}
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      InputProps={{ sx: { background: THEME.surface } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${THEME.border}`,
                      backgroundColor: THEME.surface,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
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
                              {form.is_active !== false ? 'User is allowed to log in and upload videos' : 'Login disabled for this user'}
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
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Sidebar form area */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mt: { xs: 0, md: 8 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Biography (0/450)</Typography>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={4} 
                    disabled
                    placeholder="Coming soon..."
                    helperText="We will automatically append the phone number onto the end of this biography."
                    InputProps={{ sx: { background: THEME.surface } }}
                    sx={{ mb: 3 }}
                  />



                  {/* Information Box */}
                  <Box sx={{ mt: 4, background: '#F1F5F9', p: 3, borderRadius: 2, border: `1px solid ${THEME.border}` }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: THEME.textPrimary }}>
                      Information
                    </Typography>
                    <Box component="ul" sx={{ color: THEME.textPrimary, m: 0, pl: 2, '& li': { mb: 1, fontSize: '0.9rem' } }}>
                      <li>This user is offline.</li>
                      {editingUser?.created_at && (
                        <li>Created on {new Date(editingUser.created_at).toLocaleDateString()}.</li>
                      )}
                      <li>Last logged in on {new Date().toLocaleDateString()}.</li>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Action Footer */}
            <Box sx={{ mt: 5, pt: 3, borderTop: `1px solid ${THEME.border}`, display: 'flex', justifyContent: 'flex-start' }}>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                sx={{ 
                  background: THEME.success, 
                  textTransform: 'none', 
                  fontWeight: 600,
                  px: 4,
                  '&:hover': { background: '#059669' }
                }}
              >
                {viewState === 'create' ? 'Save New User' : 'Update Profile'}
              </Button>
            </Box>
          </Box>
        )}

      </Container>
    </Box>
  );
}
