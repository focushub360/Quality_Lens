// src/pages/SupportPage.js
import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Divider,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  MenuBook,
  School,
  VideoLibrary,
  Send,
  HelpOutline
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  surface: '#F8FAFC',
  success: '#10B981'
};

export default function SupportPage() {
  const { user, role } = useContext(AuthContext);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || '',
    branch: user?.branch_name || user?.showroom_name || '',
    sendTo: '',
    category: '',
    subject: '',
    resultId: '',
    description: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getRecipientOptions = () => {
    if (role === 'super_admin') return [{ value: 'system_dev', label: 'System Development Team' }];
    if (role === 'dealer_admin') return [{ value: 'super_admin', label: 'Super Admin / QualityLens Support' }];
    if (role === 'branch_admin') return [
      { value: 'dealer_admin', label: 'Service Manager' },
      { value: 'super_admin', label: 'Super Admin' }
    ];
    // Default for advisor/dealer_user
    return [
      { value: 'dealer_admin', label: 'Service Manager' },
      { value: 'branch_admin', label: 'Branch Admin' },
      { value: 'super_admin', label: 'Super Admin' }
    ];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 1, color: THEME.textPrimary }}>
        Submit Support Query
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
        Escalate your issue to the appropriate higher-hierarchy login for resolution.
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${THEME.border}`, boxShadow: 'none' }}>
        {success && (
          <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
            Support request sent to {getRecipientOptions().find(o => o.value === form.sendTo)?.label || 'Administrator'} successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Row 1: Escalated Authority (Primary focus) */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Send Request To (Escalation Level)"
                name="sendTo"
                required
                value={form.sendTo}
                onChange={handleChange}
                helperText="Specify which higher-hierarchy authority should resolve this query."
                variant="outlined"
              >
                <MenuItem value="">Select Hierarchical Level</MenuItem>
                {getRecipientOptions().map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Row 2: User Contact Details - Grouped */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch / Showroom"
                name="branch"
                required
                value={form.branch}
                onChange={handleChange}
              />
            </Grid>

            {/* Row 3: Issue Category (Full Width for high visibility) */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Support Issue Category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                helperText="Categorizing your issue helps it reach the right technical expert faster."
              >
                <MenuItem value="">Choose a Category</MenuItem>
                <MenuItem value="Technical Issue">Technical Issue (System Bug)</MenuItem>
                <MenuItem value="Analysis Quality">Analysis Quality (Inaccurate Scores)</MenuItem>
                <MenuItem value="Transcription Error">Transcription / AI Error</MenuItem>
                <MenuItem value="Account Access">Account / Access Issue</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            {/* Row 4: Reference Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Result ID (Optional)"
                name="resultId"
                value={form.resultId}
                onChange={handleChange}
                placeholder="e.g. PRO-9921"
                helperText="Link a specific video analysis ID."
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Query Subject Line"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder="Summarise the core issue..."
                helperText="Clearly state the problem in one line."
              />
            </Grid>

            {/* Row 5: Detailed Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Detailed Description of Issue"
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                placeholder="Provide a step-by-step description of the problem you are facing..."
                helperText="The more detail you provide, the faster we can investigate."
              />
            </Grid>

            {/* Submission Section */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pt: 2,
                borderTop: `1px solid ${THEME.border}`
              }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send />}
                  sx={{ 
                    px: 8, 
                    py: 1.8, 
                    borderRadius: 2, 
                    bgcolor: THEME.primary,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(28, 105, 212, 0.25)',
                    '&:hover': { 
                      bgcolor: THEME.primaryDark,
                      boxShadow: '0 6px 16px rgba(28, 105, 212, 0.4)'
                    }
                  }}
                >
                  Send Support Query
                </Button>
                <Typography variant="body2" color="textSecondary" fontWeight={500}>
                  <Box component="span" sx={{ color: 'red', mr: 0.5 }}>*</Box> 
                  Indicates a required field for resolution.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
