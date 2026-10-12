// src/pages/dealer-admin/AccountProfile.js
import React, { useEffect, useMemo, useState, useContext, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Avatar,
  Paper,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CameraAlt,
  Save,
  Person,
  Delete
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';
import { formatDateTime } from '../../utils/dateFormatter';

// Similar theme to the rest of the app
const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  surface: '#F8FAFC',
};

export default function AccountProfile() {
  const { user, updateProfile } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(user?.profile_image || null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Sync preview image if user profile image changes
  useEffect(() => {
    if (user?.profile_image) {
      setPreviewImage(user.profile_image);
    }
  }, [user?.profile_image]);
  
  const initialName = useMemo(() => {
    const raw = (user?.username || '').trim();
    const parts = raw.split(/\s+/).filter(Boolean);
    return {
      first: parts[0] || '',
      last: parts.slice(1).join(' ') || '',
    };
  }, [user?.username]);

  const [form, setForm] = useState({
    title: 'Mr',
    firstName: initialName.first,
    lastName: initialName.last,
    email: user?.email || '',
    biography: '',
    replyEmail: 'email@company.com',
    preferredService: 'India Standard - Workshop',
    language: 'English - United Kingdom',
    timeZone: 'Asia/Kolkata'
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      firstName: initialName.first,
      lastName: initialName.last,
      email: user?.email || prev.email,
    }));
  }, [initialName, user?.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removePhoto = () => {
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    const newUsername = `${form.firstName || ''} ${form.lastName || ''}`.trim().replace(/\s+/g, ' ');
    if (!newUsername) {
      setError('Please enter your name.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await updateProfile({ 
        username: newUsername,
        profile_image: previewImage 
      });
      setSuccess('Profile updated.');
    } catch (e) {
      setError(e?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" variant="filled">{error}</Alert>
      </Snackbar>

      <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: THEME.textPrimary }}>
        Edit Profile
      </Typography>
      
      <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${THEME.border}`, boxShadow: 'none' }}>
        {/* Section: Account Details */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Account Details
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          You can update your profile using the form below. We'll use some of these details on customer facing pages, so please make sure they are accurate—we don't want any mistakes!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
             <TextField
              fullWidth
              label="E-mail"
              name="email"
              value={form.email}
              disabled
              helperText={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption">
                    E-mail address is a protected field. If you require your e-mail address to be updated, then please raise a support request.
                  </Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Biography"
              name="biography"
              value={form.biography}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself..."
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Section: Reply To */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Reply To
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Specify a Reply To e-mail address to mask your e-mail address from customers. Instead we'll show the e-mail address you set here on video pages and emails. You'll still receive emails from us that you'd normally get such as notifications and reports.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="E-mail Mask"
              name="replyEmail"
              value={form.replyEmail}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Section: Profile Photo */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Profile Photo
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
           <Avatar 
             src={previewImage} 
             sx={{ width: 80, height: 80, bgcolor: THEME.surface, color: THEME.textTertiary, border: `1px solid ${THEME.border}` }}
           >
              {!previewImage && <Person sx={{ fontSize: 50 }} />}
           </Avatar>
           <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                Please make sure your photo is no larger than 25MB and it's a GIF, JPEG or PNG. You can crop it afterwards.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outlined"
                  onClick={triggerFileInput}
                  startIcon={<CameraAlt />}
                  sx={{ textTransform: 'none', borderRadius: 2, borderColor: THEME.primary, color: THEME.primary, '&:hover': { borderColor: THEME.primaryDark, bgcolor: 'rgba(28, 105, 212, 0.04)' } }}
                >
                  Select a Photo
                </Button>
                {previewImage && (
                  <Button
                    variant="text"
                    onClick={removePhoto}
                    startIcon={<Delete />}
                    color="error"
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
           </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Section: Account Preferences */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Account Preferences
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Preferred Service"
              name="preferredService"
              value={form.preferredService}
              onChange={handleChange}
              helperText="You can set a preferred service, meaning that when you open a page they'll be selected automatically."
            >
              <MenuItem value="India Standard - Workshop">India Standard - Workshop</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Language"
              name="language"
              value={form.language}
              onChange={handleChange}
              helperText="Your preferred language to browse the Dashboard."
            >
              <MenuItem value="English - United Kingdom">English - United Kingdom</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Time Zone"
              name="timeZone"
              value={form.timeZone}
              onChange={handleChange}
              helperText={`Local Time: ${formatDateTime(new Date())}`}
            >
              <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
            sx={{ 
              px: 6, 
              py: 1.5, 
              borderRadius: 2, 
              bgcolor: THEME.primary,
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { bgcolor: THEME.primaryDark }
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
