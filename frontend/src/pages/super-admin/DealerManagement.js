import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  Stack,
  TablePagination,
  Tabs,
  Tab,
  MenuItem,
  Alert,
  Divider,
  Fade,
  Container,
  Avatar,
  LinearProgress,
  InputAdornment,
  CardActionArea,
  alpha,
  Badge,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  ArrowBack,
  Business,
  DirectionsCar,
  Score,
  Mic,
  Description,
  Refresh,
  Email,
  Phone,
  Videocam,
  FileDownload as FileDownloadIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Person,
  Add,
  Edit,
  Assessment,
  Dashboard as DashboardIcon,
  Analytics,
  AccountTree,
  PieChart,
  Timeline,
  Speed,
  TrendingUp,
  Group,
  VideoLibrary,
  Star,
  EmojiEvents,
  FilterList,
  MoreVert,
} from '@mui/icons-material';
import { listUsers, createUser, updateUser, deleteUser } from '../../services/users';
import { listDealerUsers, getDealerUserStats, deleteDealership, updateDealerStatus } from '../../services/dealer_user';

import api from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,

  Legend,
  LabelList,
  ReferenceLine

} from 'recharts';

// QualityLens Branding Theme
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
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Chart Components with Modern Design
const QualityDistributionChart = ({ data }) => (
  <Box sx={{ mt: 2 }}>
    {data.map((item, index) => (
      <Box key={item.label} sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
            <Box sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor:
                item.label === 'Excellent' ? THEME.success :
                  item.label === 'Very Good' ? THEME.primary :
                    item.label === 'Good' ? THEME.accent :
                      item.label === 'Fair' ? THEME.warning :
                        THEME.error,
              mr: 2
            }} />
            <Typography variant="body2" sx={{
              color: THEME.textPrimary,
              fontWeight: 500,
              fontSize: '0.875rem'
            }}>
              {item.label}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{
            color: THEME.textSecondary,
            fontWeight: 600,
            fontSize: '0.875rem'
          }}>
            {item.value} ({item.percentage}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={item.percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: THEME.borderLight,
            '& .MuiLinearProgress-bar': {
              backgroundColor:
                item.label === 'Excellent' ? THEME.success :
                  item.label === 'Very Good' ? THEME.primary :
                    item.label === 'Good' ? THEME.accent :
                      item.label === 'Fair' ? THEME.warning :
                        THEME.error,
              borderRadius: 4
            }
          }}
        />
      </Box>
    ))}
  </Box>
);

const ScoreTrendChart = ({ data }) => (
  <Box sx={{ mt: 2 }}>
    {data.slice(0, 5).map((item, index) => ( // Only show first 5 items
      <Box key={index} sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{
            color: THEME.textPrimary,
            fontWeight: 500,
            fontSize: '0.75rem', mr: 2
          }}>
            {item.name}
          </Typography>
          <Typography variant="caption" sx={{
            color: THEME.textSecondary,
            fontWeight: 500
          }}>
            Overall: {item.overall.toFixed(1)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: THEME.primary, fontWeight: 500 }}>
                Video
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                {item.video}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.video}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: THEME.borderLight,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: THEME.primary,
                  borderRadius: 3
                }
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: THEME.accent, fontWeight: 500 }}>
                Audio
              </Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                {item.audio}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.audio}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: THEME.borderLight,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: THEME.accent,
                  borderRadius: 3
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
);

// Utility Functions
const normalizeId = (id) => {
  if (id === null || id === undefined) return null;
  const s = String(id).trim();
  if (s === '') return null;
  const lower = s.toLowerCase();
  if (lower === 'bmw' || lower === 'bmw-kun' || lower === 'kun') return 'BMW-KUN';
  if (lower === 'bird') return 'BIRD';
  if (lower === 'deutschemotoren' || lower === 'deutsche' || lower === 'nin') return 'DEUTSCHEMOTOREN';
  if (lower === 'eminent') return 'EMINENT';
  if (lower === 'evmautokraft' || lower === 'evm') return 'EVMAUTOKRAFT';
  return s.toUpperCase();
};

const ROLE_OPTS = [
  { value: 'dealer_admin', label: 'Dealer Admin' },
  { value: 'dealer_user', label: 'Dealer User' }
];

// Enhanced Service Advisor Card
const ServiceAdvisorRankingCard = ({ advisor, rank }) => (
  <Card sx={{
    background: THEME.surfaceElevated,
    border: `1px solid ${THEME.border}`,
    borderRadius: 3,
    mb: 2,
    transition: 'all 0.2s ease-in-out',
    boxShadow: THEME.shadowSm,
    '&:hover': {
      boxShadow: THEME.shadowMd,
      borderColor: THEME.primaryLight,
      transform: 'translateY(-2px)'
    }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {/* Rank Badge */}
          <Box sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background:
              rank === 1 ? THEME.gradientAccent :
                rank === 2 ? THEME.gradientPrimary :
                  rank === 3 ? THEME.gradientSuccess :
                    THEME.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            fontWeight: 700,
            fontSize: '14px',
            color: rank <= 3 ? THEME.background : THEME.textSecondary,
            boxShadow: THEME.shadowMd
          }}>
            {rank}
          </Box>

          {/* Advisor Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{
              color: THEME.textPrimary,
              fontWeight: 600,
              mb: 0.5,
              fontSize: '1rem'
            }}>
              {advisor.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VideoLibrary sx={{ fontSize: 14, color: THEME.textTertiary, mr: 0.5 }} />
              <Typography variant="caption" sx={{
                color: THEME.textTertiary,
                fontWeight: 500
              }}>
                {advisor.totalVideos} video{advisor.totalVideos !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Overall Score */}
        <Box sx={{
          textAlign: 'center',
          minWidth: 80,
          background: THEME.primaryUltraLight,
          borderRadius: 3,
          p: 1.5,
          border: `1px solid ${THEME.border}`
        }}>
          <Typography variant="h6" sx={{
            color: THEME.primary,
            fontWeight: 700,
            lineHeight: 1,
            mb: 0.5
          }}>
            {advisor.averageOverallScore.toFixed(1)}
          </Typography>
          <Typography variant="caption" sx={{
            color: THEME.textSecondary,
            fontWeight: 600,
            fontSize: '0.7rem'
          }}>
            Overall
          </Typography>
        </Box>
      </Box>

      {/* Progress Bars */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
            <Videocam sx={{ fontSize: 16, color: THEME.primary, mr: 1 }} />
            <Typography variant="caption" sx={{
              color: THEME.textSecondary,
              fontWeight: 500
            }}>
              Video
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={advisor.averageVideoScore}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: THEME.borderLight,
              '& .MuiLinearProgress-bar': {
                backgroundColor: THEME.primary,
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" sx={{
            color: THEME.textPrimary,
            minWidth: 35,
            textAlign: 'right',
            ml: 1.5,
            fontWeight: 600
          }}>
            {advisor.averageVideoScore.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
            <Mic sx={{ fontSize: 16, color: THEME.accent, mr: 1 }} />
            <Typography variant="caption" sx={{
              color: THEME.textSecondary,
              fontWeight: 500
            }}>
              Audio
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={advisor.averageAudioScore}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: THEME.borderLight,
              '& .MuiLinearProgress-bar': {
                backgroundColor: THEME.accent,
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" sx={{
            color: THEME.textPrimary,
            minWidth: 35,
            textAlign: 'right',
            ml: 1.5,
            fontWeight: 600
          }}>
            {advisor.averageAudioScore.toFixed(1)}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
// Add this component after the ScoreTrendChart component
const ServiceAdvisorQualityChart = ({ data = [] }) => {
  // Map and clamp data to 0-10 range
  const chartData = (data || []).map((advisor) => {
    const name = advisor.name || advisor.dealer || 'Unknown';
    const audioRaw = Number(advisor.averageAudioScore ?? advisor.audio ?? 0);
    const videoRaw = Number(advisor.averageVideoScore ?? advisor.video ?? 0);

    return {
      name,
      Audio: -Math.max(0, Math.min(10, audioRaw)), // negative for left extension
      Video: Math.max(0, Math.min(10, videoRaw))   // positive for right extension
    };
  });

  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        background: THEME.surface,
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      {/* Title with more space below */}
      <Typography
        variant="h6"
        sx={{
          color: THEME.textPrimary,
          fontWeight: 700,
          mb: -2, // Increased from mb: 3 to mb: 4 for more space
          textAlign: 'center'
        }}
      >
        Audio & Video Quality by Dealer
      </Typography>

      <ResponsiveContainer width="100%" height={Math.max(350, chartData.length * 50)}>
        <ComposedChart
          layout="vertical"
          data={chartData}
          margin={{ top: 30, right: 220, left: 80, bottom: 20 }}
          alignItems="center"
        >
          {/* Vertical gridlines only */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />

          {/* Single X-axis for both sides */}
          <XAxis
            type="number"
            domain={[-10, 10]}
            orientation="top"
            ticks={[-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10]}
            tickFormatter={(v) => Math.abs(v)}
            tick={{ fill: '#666', fontSize: 10, fontWeight: 600 }}
            stroke="#999"
          />

          {/* Y-axis with dealer names on left */}
          <YAxis
            dataKey="name"
            type="category"
            width={150}
            tick={{ fill: '#333', fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Center vertical separator line */}
          <ReferenceLine x={0} stroke="#666" strokeWidth={2} />

          {/* Tooltip */}
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            formatter={(val, key) => [
              `${Math.abs(Number(val)).toFixed(1)} / 10`,
              key === 'Audio' ? 'Audio Quality' : 'Video Quality'
            ]}
            contentStyle={{
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: '8px 12px'
            }}
          />

          {/* AUDIO: Blue bars extending LEFT from center */}
          <Bar
            dataKey="Audio"
            fill="#1976d2"
            barSize={20}
          // Rounded corners on the left side
          >
            <LabelList
              dataKey="Audio"
              position="insideLeft"
              formatter={(v) => Math.abs(Number(v)).toFixed(1)}
              style={{ fill: '#fff', fontSize: 11, fontWeight: 700 }}
            />
          </Bar>

          {/* VIDEO: Orange bars extending RIGHT from center */}
          <Bar
            dataKey="Video"
            fill="#f57c00"
            barSize={20}
          // Rounded corners on the right side
          >
            <LabelList
              dataKey="Video"
              position="insideRight"
              formatter={(v) => Number(v).toFixed(1)}
              style={{ fill: '#fff', fontSize: 11, fontWeight: 700 }}
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      {/* Centered and minimized legend */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3, // Reduced from gap: 4 to gap: 3
        mt: 2
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box sx={{
            width: 14, // Reduced from 16 to 14
            height: 14, // Reduced from 16 to 14
            bgcolor: '#1976d2',
            borderRadius: 1
          }} />
          <Typography variant="body2" sx={{
            fontWeight: 600,
            color: '#1976d2',
            fontSize: '0.8rem' // Slightly smaller font
          }}>
            Audio Quality â†
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box sx={{
            width: 14, // Reduced from 16 to 14
            height: 14, // Reduced from 16 to 14
            bgcolor: '#f57c00',
            borderRadius: 1
          }} />
          <Typography variant="body2" sx={{
            fontWeight: 600,
            color: '#f57c00',
            fontSize: '0.8rem' // Slightly smaller font
          }}>
            â†’ Video Quality
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};





export default function DealerManagement() {
  const [dealers, setDealers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerResults, setDealerResults] = useState([]);
  const [dealerUsers, setDealerUsers] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  // Search + pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);

  // Create Dealer Form
  const [createDealerOpen, setCreateDealerOpen] = useState(false);
  const [createDealerError, setCreateDealerError] = useState('');
  const [createDealerForm, setCreateDealerForm] = useState({
    dealer_id: '', showroom_name: ''
  });

  const handleCreateDealerSubmit = async () => {
    setCreateDealerError('');
    if (!createDealerForm.dealer_id || !createDealerForm.showroom_name) {
      setCreateDealerError('Dealer ID and Showroom Name are required');
      return;
    }
    
    try {
      const generatedUsername = `${createDealerForm.dealer_id.replace(/\s+/g, '_').toLowerCase()}_admin`;
      const generatedEmail = `admin@${createDealerForm.dealer_id.replace(/\s+/g, '').toLowerCase()}.com`;
      
      await createUser({
        username: generatedUsername,
        email: generatedEmail,
        password: 'ChangeMe@123',
        role: 'dealer_admin',
        dealer_id: createDealerForm.dealer_id,
        showroom_name: createDealerForm.showroom_name
      });
      setCreateDealerOpen(false);
      setCreateDealerForm({ dealer_id: '', showroom_name: '' });
      setRefreshCounter(prev => prev + 1);
    } catch (error) {
      console.error('Error creating dealer:', error);
      setCreateDealerError(error.response?.data?.error || 'Failed to create dealer');
    }
  };

  // User form
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '', email: '', role: 'dealer_admin', password: '', dealer_id: ''
  });
  const [userError, setUserError] = useState('');

  // Security Delete Dealership State
  const [deleteDealerDialogOpen, setDeleteDealerDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState('');
  const [deleteAdminPassword, setDeleteAdminPassword] = useState('');
  const [deleteDealerError, setDeleteDealerError] = useState('');
  const [isDeletingDealer, setIsDeletingDealer] = useState(false);

  const handleConfirmDeleteDealer = async () => {
    setDeleteDealerError('');
    if (!deleteConfirmId || deleteConfirmId.trim().toUpperCase() !== selectedDealer?.toUpperCase()) {
      setDeleteDealerError(`Dealer ID confirmation does not match '${selectedDealer?.toUpperCase()}'.`);
      return;
    }
    if (!deleteAdminPassword) {
      setDeleteDealerError('Please enter your Super Admin password.');
      return;
    }
    try {
      setIsDeletingDealer(true);
      await deleteDealership(selectedDealer, deleteConfirmId.trim(), deleteAdminPassword);
      alert(`Dealership '${selectedDealer}' and all associated user accounts have been permanently deleted.`);
      setDeleteDealerDialogOpen(false);
      setDialogOpen(false);
      setDeleteConfirmId('');
      setDeleteAdminPassword('');
      loadData();
    } catch (err) {
      console.error('Error deleting dealer:', err);
      setDeleteDealerError(err.response?.data?.detail || err.response?.data?.error || 'Failed to delete dealership.');
    } finally {
      setIsDeletingDealer(false);
    }
  };

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    qualityDistribution: [],
    scoreTrend: [],
    averageScores: { video: 0, audio: 0, overall: 0 },
    totalVideos: 0,
    serviceAdvisorRankings: []
  });

  // Data functions
  const loadData = async () => {
    setLoading(true);
    try {
      const usersData = await listUsers();
      setUsers(usersData);

      // Build dealer map from users (this always works)
      const dealerMap = new Map();
      usersData.forEach((user) => {
        const did = normalizeId(user.dealer_id);
        if (!did) return;
        if (!dealerMap.has(did)) {
          dealerMap.set(did, {
            dealer_id: did,
            users: [],
            total_videos: 0,
            avg_overall_quality: 0
          });
        }
        if (dealerMap.has(did)) {
          dealerMap.get(did).users.push(user);
        } else {
          // Create if not exists (handled above but safe here)
        }
      });

      // Calculate branches per dealer
      dealerMap.forEach(dealer => {
        const branches = new Set();
        dealer.users.forEach(u => {
          if (u.branch_name) branches.add(u.branch_name);
        });
        dealer.branches_count = branches.size;
        dealer.branches_list = Array.from(branches);
      });

      // Try to enrich with dashboard stats (may fail if no analysis data yet)
      try {
        const dashboardRes = await api.get('/dashboard/super-admin/overview');
        const dashboardDealers = dashboardRes.data?.dealers_summary || [];

        dashboardDealers.forEach((dd) => {
          const did = normalizeId(dd.dealer_id);
          if (!did) return;
          if (dealerMap.has(did)) {
            const dealer = dealerMap.get(did);
            dealer.total_videos = dd.total_videos ?? dealer.total_videos ?? 0;
            dealer.avg_overall_quality = dd.avg_overall_quality ?? dealer.avg_overall_quality ?? 0;
          }
        });
      } catch (dashError) {
        console.warn('Could not load dashboard stats (will show dealers without stats):', dashError);
      }

      const dealersArray = Array.from(dealerMap.values());
      dealersArray.sort((a, b) => a.dealer_id.localeCompare(b.dealer_id));
      setDealers(dealersArray);
    } catch (error) {
      console.error('Error loading dealers:', error);
      setDealers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshCounter]);

  const generateQualityDistribution = (results) => {
    const distribution = { 'Excellent': 0, 'Very Good': 0, 'Good': 0, 'Fair': 0, 'Poor': 0 };
    results.forEach(result => {
      const label = result.overall_quality?.overall_label || 'Good';
      distribution[label] = (distribution[label] || 0) + 1;
    });
    return Object.entries(distribution).map(([label, value]) => ({
      label, value, percentage: results.length > 0 ? (value / results.length * 100).toFixed(1) : 0
    }));
  };

  const generateScoreTrend = (results) => {
    const sortedResults = [...results].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return sortedResults.slice(-10).map((result, index) => ({
      name: `Video ${index + 1}`,
      video: result.video_analysis?.quality_score || 0,
      audio: Math.round(result.audio_analysis?.score || 0),
      overall: (result.overall_quality?.overall_score || 0) * 10
    }));
  };

  const generateServiceAdvisorRankings = (results) => {
    const advisorMap = new Map();
    results.forEach(result => {
      const advisorName = result.citnow_metadata?.service_advisor || 'Unknown Advisor';
      if (!advisorMap.has(advisorName)) {
        advisorMap.set(advisorName, {
          name: advisorName,
          videoScores: [], audioScores: [], totalVideos: 0,
          averageVideoScore: 0, averageAudioScore: 0, averageOverallScore: 0
        });
      }
      const advisor = advisorMap.get(advisorName);
      advisor.videoScores.push(result.video_analysis?.quality_score || 0);
      advisor.audioScores.push(Math.round(result.audio_analysis?.score || 0));
      advisor.totalVideos++;
    });

    const advisors = Array.from(advisorMap.values()).map(advisor => {
      const avgVideo = advisor.videoScores.reduce((a, b) => a + b, 0) / advisor.videoScores.length;
      const avgAudio = advisor.audioScores.reduce((a, b) => a + b, 0) / advisor.audioScores.length;
      const avgOverall = (avgVideo * 0.1 + avgAudio * 0.1) / 2;
      return { ...advisor, averageVideoScore: avgVideo, averageAudioScore: avgAudio, averageOverallScore: avgOverall };
    });

    return advisors.sort((a, b) => b.averageOverallScore - a.averageOverallScore);
  };


  const [userStats, setUserStats] = useState({});

  const fetchUserStats = async (dealerId) => {
    if (!dealerId) return;

    try {
      const statsData = await getDealerUserStats(dealerId);
      const statsMap = {};
      statsData.forEach(user => {
        statsMap[user.user_id] = user.videos_analyzed;
      });
      setUserStats(statsMap);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleViewDealer = async (dealerId) => {
    const did = normalizeId(dealerId);
    setSelectedDealer(did);
    setLoadingResults(true);
    setDialogOpen(true);
    setTabValue(0);
    setSearchTerm('');
    setUserSearchTerm('');
    setPage(0);
    setUserPage(0);

    try {
      const res = await api.get(`/results?dealer_id=${encodeURIComponent(did)}`);
      const resData = res.data;
      // Normalize: API may return array or { results: [...] }
      const results = Array.isArray(resData) ? resData : (resData?.results || []);
      console.log('DealerManagement results for', did, ':', results.length);
      setDealerResults(results);

      const qualityDistribution = generateQualityDistribution(results);
      const scoreTrend = generateScoreTrend(results);
      const serviceAdvisorRankings = generateServiceAdvisorRankings(results);

      // Use multiple fallback paths for score fields
      const avgVideo = results.reduce((sum, r) => sum + (r.video_analysis?.quality_score || r.video_quality_score || 0), 0) / (results.length || 1);
      const avgAudio = results.reduce((sum, r) => sum + (r.audio_analysis?.score || r.audio_quality_score || 0), 0) / (results.length || 1);
      const avgOverall = results.reduce((sum, r) => sum + (r.overall_quality?.overall_score || r.overall_quality_score || 0), 0) / (results.length || 1);

      setDashboardData({
        qualityDistribution, scoreTrend, serviceAdvisorRankings,
        averageScores: { video: avgVideo, audio: avgAudio, overall: avgOverall },
        totalVideos: results.length
      });

      // Fetch dealer users and their stats
      const dealerUsersData = await listDealerUsers(did);
      setDealerUsers(dealerUsersData);

      // Fetch video counts for each user
      await fetchUserStats(did);

    } catch (error) {
      console.error('Error loading dealer data:', error);
      setDealerResults([]);
      setDealerUsers([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleCloseDialogs = () => {
    setDialogOpen(false);
    setResultDialogOpen(false);
    setSelectedDealer(null);
    setSelectedResult(null);
    setDealerResults([]);
    setDealerUsers([]);
    setSearchTerm('');
    setUserSearchTerm('');
    setPage(0);
    setUserPage(0);
    setUserFormOpen(false);
    setEditingUser(null);
    setUserForm({ username: '', email: '', role: 'dealer_admin', password: '', dealer_id: '' });
    setUserError('');
  };

  // Other handler functions remain the same as original
  const handleViewResultDetails = (result) => {
    setSelectedResult(result);
    setResultDialogOpen(true);
  };

  const handleDeleteResult = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/results/${id}`);
      setDealerResults((rs) => rs.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete.');
    }
  };

  const handleCreateUser = async () => {
    setUserError('');
    if (!userForm.username || !userForm.email || !userForm.password) {
      setUserError('Username, email, and password are required');
      return;
    }
    try {
      const createData = { ...userForm, dealer_id: selectedDealer };
      await createUser(createData);
      setUserFormOpen(false);
      const usersData = await listUsers();
      const dealerUsersData = usersData.filter(u => normalizeId(u.dealer_id) === selectedDealer);
      setDealerUsers(dealerUsersData);
      setUserForm({ username: '', email: '', role: 'dealer_admin', password: '', dealer_id: '' });
      setEditingUser(null);
    } catch (error) {
      console.error('Error creating user:', error);
      setUserError(error.response?.data?.error || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setUserError('');
    if (!userForm.username || !userForm.email) {
      setUserError('Username and email are required');
      return;
    }
    try {
      const updateData = { ...userForm, dealer_id: selectedDealer };
      if (!updateData.password) delete updateData.password;
      await updateUser(editingUser._id || editingUser.id, updateData);
      setUserFormOpen(false);
      const usersData = await listUsers();
      const dealerUsersData = usersData.filter(u => normalizeId(u.dealer_id) === selectedDealer);
      setDealerUsers(dealerUsersData);
      setUserForm({ username: '', email: '', role: 'dealer_admin', password: '', dealer_id: '' });
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setUserError(error.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        const usersData = await listUsers();
        const dealerUsersData = usersData.filter(u => normalizeId(u.dealer_id) === selectedDealer);
        setDealerUsers(dealerUsersData);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'dealer_admin',
      password: '',
      dealer_id: user.dealer_id || '',
      is_active: user.is_active !== false && user.status !== 'inactive'
    });
    setUserFormOpen(true);
  };

  const handleSubmitUser = () => {
    setUserError('');

    // Basic validation
    if (!userForm.username || !userForm.email) {
      setUserError('Username and email are required');
      return;
    }

    // Username length validation
    if (userForm.username.length < 3) {
      setUserError('Username must be at least 3 characters long');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userForm.email)) {
      setUserError('Please enter a valid email address');
      return;
    }

    // Password validation for new users
    if (!editingUser && (!userForm.password || userForm.password.length < 6)) {
      setUserError('Password must be at least 6 characters long');
      return;
    }

    // Check if username already exists
    const existingUsername = users.find(u =>
      u.username.toLowerCase() === userForm.username.toLowerCase() &&
      u._id !== editingUser?._id
    );
    if (existingUsername) {
      setUserError('Username already exists. Please choose a different username.');
      return;
    }

    // Check if email already exists
    const existingEmail = users.find(u =>
      u.email.toLowerCase() === userForm.email.toLowerCase() &&
      u._id !== editingUser?._id
    );
    if (existingEmail) {
      setUserError('Email address already exists. Please use a different email.');
      return;
    }

    // If all validations pass, proceed with create/update
    if (editingUser) {
      handleUpdateUser();
    } else {
      handleCreateUser();
    }
  };

  const exportToCsv = () => {
    if (!filteredDealerResults.length) {
      alert('No rows to export');
      return;
    }

    const headers = [
      'Dealership',
      'Vehicle/Registration',
      'VIN',
      'Email',
      'Phone',
      'Video Score',
      'Audio Score',
      'Overall Score',
      'Transcription',
      'Summary',
      'Translation',
      'Uploaded (Date)',
      'Video Link',
      'ID'
    ];

    const lines = filteredDealerResults.map((r) => {
      const m = r.citnow_metadata || {};
      const vehicleReg = [m.vehicle, m.registration].filter(Boolean).join('/');
      const vin = m.vin || '';
      const email = m.email || '';
      const phone = m.phone || '';
      const vidScore = r.video_analysis?.quality_score || 0;
      const audScore = Math.round(r.audio_analysis?.score || 0);
      const overall = (r.overall_quality?.overall_score || 0).toFixed(1);
      const transcription = r.transcription?.text || '';
      const summary = r.summarization?.summary || '';
      const translation = r.translation?.translated_text || '';
      const uploadedDate = r.created_at ? new Date(r.created_at).toLocaleString() : '';
      const videoLink = m.page_url || '';
      const id = r._id;

      const row = [
        m.dealership || '',
        vehicleReg,
        vin,
        email,
        phone,
        vidScore,
        audScore,
        overall,
        transcription,
        summary,
        translation,
        uploadedDate,
        videoLink,
        id
      ];

      return row.map((cell) => `"${('' + cell).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...lines].join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealer_${selectedDealer}_results_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtering and pagination
  const filteredDealerResults = dealerResults.filter((r) => {
    const term = searchTerm.toLowerCase();
    const dm = r.citnow_metadata || {};
    return (
      (dm.dealership || '').toLowerCase().includes(term) ||
      (dm.vehicle || dm.registration || '').toLowerCase().includes(term) ||
      (dm.email || '').toLowerCase().includes(term) ||
      (dm.phone || '').toLowerCase().includes(term)
    );
  });

  const paginatedDealerResults = filteredDealerResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const filteredDealerUsers = dealerUsers.filter((u) => {
    const term = userSearchTerm.toLowerCase();
    return (u.username || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term);
  });
  const paginatedDealerUsers = filteredDealerUsers.slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: THEME.background,
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Modern Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: THEME.textPrimary,
              mb: 2,
              background: THEME.gradientPrimary,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Dealer Network
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: THEME.textSecondary,
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Manage your dealership network with comprehensive analytics and performance insights
          </Typography>
        </Box>

        {/* Stats Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{
              background: THEME.surfaceElevated,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowSm,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { boxShadow: THEME.shadowMd }
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: THEME.primaryUltraLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Business sx={{ fontSize: 28, color: THEME.primary }} />
                </Box>
                <Typography variant="h3" sx={{
                  color: THEME.textPrimary,
                  fontWeight: 700,
                  mb: 1
                }}>
                  {dealers.length}
                </Typography>
                <Typography variant="body1" sx={{
                  color: THEME.textSecondary,
                  fontWeight: 500
                }}>
                  Active Dealers
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{
              background: THEME.surfaceElevated,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowSm,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { boxShadow: THEME.shadowMd }
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: THEME.successLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <TrendingUp sx={{ fontSize: 28, color: THEME.success }} />
                </Box>
                <Typography variant="h3" sx={{
                  color: THEME.textPrimary,
                  fontWeight: 700,
                  mb: 1
                }}>
                  {users.length}
                </Typography>
                <Typography variant="body1" sx={{
                  color: THEME.textSecondary,
                  fontWeight: 500
                }}>
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{
              background: THEME.surfaceElevated,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowSm,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { boxShadow: THEME.shadowMd }
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: THEME.accentUltraLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <VideoLibrary sx={{ fontSize: 28, color: THEME.accent }} />
                </Box>
                <Typography variant="h3" sx={{
                  color: THEME.textPrimary,
                  fontWeight: 700,
                  mb: 1
                }}>
                  {dealers.reduce((sum, dealer) => sum + (dealer.total_videos || 0), 0)}
                </Typography>
                <Typography variant="body1" sx={{
                  color: THEME.textSecondary,
                  fontWeight: 500
                }}>
                  Total Videos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{
              background: THEME.surfaceElevated,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowSm,
              transition: 'all 0.2s ease-in-out',
              '&:hover': { boxShadow: THEME.shadowMd }
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: THEME.primaryUltraLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Star sx={{ fontSize: 28, color: THEME.primary }} />
                </Box>
                <Typography variant="h3" sx={{
                  color: THEME.textPrimary,
                  fontWeight: 700,
                  mb: 1
                }}>
                  {dealers.length > 0 ? (dealers.reduce((sum, dealer) => sum + (dealer.avg_overall_quality || 0), 0) / dealers.length).toFixed(1) : '0.0'}
                </Typography>
                <Typography variant="body1" sx={{
                  color: THEME.textSecondary,
                  fontWeight: 500
                }}>
                  Avg Quality Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{
            color: THEME.textPrimary,
            fontWeight: 600
          }}>
            Dealership Network
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDealerOpen(true)}
              sx={{
                background: THEME.gradientPrimary,
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '16px',
                boxShadow: THEME.shadowMd,
                '&:hover': {
                  boxShadow: THEME.shadowLg,
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Create Dealer
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => setRefreshCounter(prev => prev + 1)}
              disabled={loading}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '16px',
                borderColor: THEME.primary,
                color: THEME.primary,
                '&:hover': {
                  background: THEME.primaryUltraLight,
                  borderColor: THEME.primaryDark,
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Refresh Data
            </Button>
          </Box>
        </Box>

        {/* Centered Dealers Grid */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: `3px solid ${THEME.border}`,
              borderTop: `3px solid ${THEME.primary}`,
              animation: 'spin 1s linear infinite',
              mx: 'auto',
              mb: 3
            }} />
            <Typography variant="h6" sx={{
              color: THEME.textSecondary,
              fontWeight: 500
            }}>
              Loading dealerships...
            </Typography>
          </Box>
        ) : dealers.length === 0 ? (
          <Card sx={{
            background: THEME.surfaceElevated,
            border: `1px solid ${THEME.border}`,
            borderRadius: 3,
            textAlign: 'center',
            p: 8,
            boxShadow: THEME.shadowSm
          }}>
            <Business sx={{
              fontSize: 80,
              color: THEME.textTertiary,
              mb: 3,
              opacity: 0.5
            }} />
            <Typography variant="h4" sx={{
              color: THEME.textPrimary,
              fontWeight: 600,
              mb: 2
            }}>
              No Dealerships Found
            </Typography>
            <Typography variant="body1" sx={{
              color: THEME.textSecondary,
              mb: 4,
              maxWidth: '400px',
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Create users with dealer_id assignments to manage dealership network operations
            </Typography>
          </Card>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            alignItems: 'stretch'
          }}>
            {dealers.map((dealer, index) => (
              <Fade key={dealer.dealer_id} in={true} timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card sx={{
                  background: THEME.surfaceElevated,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: 3,
                  height: '520px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: THEME.shadowSm,
                  '&:hover': {
                    boxShadow: THEME.shadowLg,
                    borderColor: THEME.primaryLight,
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <CardActionArea onClick={() => handleViewDealer(dealer.dealer_id)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                    <CardContent sx={{ p: 3.5, height: '100%', display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                      {/* Header Section (Fixed Height) */}
                      <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 56 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: THEME.gradientPrimary,
                            fontWeight: 600,
                            fontSize: '18px',
                            mr: 2,
                            boxShadow: THEME.shadowMd,
                            flexShrink: 0
                          }}
                        >
                          <Business sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="h6" noWrap sx={{
                            color: THEME.textPrimary,
                            fontWeight: 700,
                            mb: 0.5,
                            lineHeight: 1.2,
                            fontSize: '1.1rem'
                          }}>
                            {dealer.dealer_id}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                            <Switch
                              size="small"
                              checked={dealer.users.length > 0 ? dealer.users.some(u => u.is_active !== false && u.status !== 'inactive') : true}
                              onChange={async (e) => {
                                e.stopPropagation();
                                const newStatus = e.target.checked;
                                try {
                                  await updateDealerStatus(dealer.dealer_id, newStatus);
                                  loadData();
                                } catch (err) {
                                  console.error(err);
                                  alert('Failed to update dealership status');
                                }
                              }}
                              color="success"
                            />
                            <Chip
                              label={(dealer.users.length > 0 ? dealer.users.some(u => u.is_active !== false && u.status !== 'inactive') : true) ? 'Active' : 'Inactive'}
                              size="small"
                              sx={{
                                background: (dealer.users.length > 0 ? dealer.users.some(u => u.is_active !== false && u.status !== 'inactive') : true)
                                  ? THEME.successLight
                                  : THEME.errorLight,
                                color: (dealer.users.length > 0 ? dealer.users.some(u => u.is_active !== false && u.status !== 'inactive') : true)
                                  ? THEME.success
                                  : THEME.error,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: '20px'
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: THEME.borderLight, my: 2 }} />

                      {/* Stats Section (Fixed Height) */}
                      <Box sx={{ minHeight: 105, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VideoLibrary sx={{ fontSize: 20, color: THEME.primary, mr: 2 }} />
                            <Box>
                              <Typography variant="caption" sx={{
                                color: THEME.textSecondary,
                                fontWeight: 500,
                                fontSize: '0.75rem'
                              }}>
                                TOTAL VIDEOS
                              </Typography>
                              <Typography variant="h5" sx={{
                                color: THEME.textPrimary,
                                fontWeight: 700
                              }}>
                                {dealer.total_videos || 0}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Score sx={{ fontSize: 20, color: THEME.accent, mr: 2 }} />
                            <Box>
                              <Typography variant="caption" sx={{
                                color: THEME.textSecondary,
                                fontWeight: 500,
                                fontSize: '0.75rem'
                              }}>
                                AVG QUALITY
                              </Typography>
                              <Typography variant="h5" sx={{
                                color: THEME.textPrimary,
                                fontWeight: 700
                              }}>
                                {dealer.avg_overall_quality ? dealer.avg_overall_quality.toFixed(1) : '0.0'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: THEME.borderLight, my: 2 }} />

                      {/* Users Section (Fixed Height) */}
                      <Box sx={{ minHeight: 75, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Group sx={{ fontSize: 18, color: THEME.textSecondary, mr: 1.5 }} />
                          <Typography variant="subtitle2" sx={{
                            color: THEME.textPrimary,
                            fontWeight: 600,
                            fontSize: '0.825rem'
                          }}>
                            ASSIGNED USERS ({dealer.users.length})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center' }}>
                          {dealer.users.length === 0 ? (
                            <Typography variant="body2" sx={{
                              color: THEME.textTertiary,
                              fontStyle: 'italic',
                              fontSize: '0.85rem'
                            }}>
                              No users assigned
                            </Typography>
                          ) : (
                            <>
                              {dealer.users.slice(0, 2).map((user) => (
                                <Chip
                                  key={user._id || user.id}
                                  label={user.username}
                                  size="small"
                                  sx={{
                                    background: user.role === 'super_admin' ? THEME.accent : THEME.primary,
                                    color: THEME.background,
                                    fontWeight: 600,
                                    fontSize: '0.68rem',
                                    height: '22px'
                                  }}
                                />
                              ))}
                              {dealer.users.length > 2 && (
                                <Chip
                                  label={`+${dealer.users.length - 2} more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: THEME.textTertiary,
                                    color: THEME.textTertiary,
                                    fontSize: '0.68rem',
                                    height: '22px'
                                  }}
                                />
                              )}
                            </>
                          )}
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: THEME.borderLight, my: 2 }} />

                      {/* Branches Section (Fixed Height) */}
                      <Box sx={{ minHeight: 55, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccountTree sx={{ fontSize: 18, color: THEME.textSecondary, mr: 1.5 }} />
                          <Typography variant="subtitle2" sx={{
                            color: THEME.textPrimary,
                            fontWeight: 600,
                            fontSize: '0.825rem'
                          }}>
                            BRANCHES ({dealer.branches_count || 0})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center' }}>
                          {(!dealer.branches_list || dealer.branches_list.length === 0) ? (
                            <Typography variant="body2" sx={{
                              color: THEME.textTertiary,
                              fontStyle: 'italic',
                              fontSize: '0.85rem'
                            }}>
                              No branches found
                            </Typography>
                          ) : (
                            <>
                              {dealer.branches_list.slice(0, 2).map((branch, idx) => (
                                <Chip
                                  key={branch + idx}
                                  label={branch}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: THEME.primaryLight,
                                    color: THEME.textSecondary,
                                    fontWeight: 600,
                                    fontSize: '0.68rem',
                                    height: '22px',
                                    background: THEME.surface
                                  }}
                                />
                              ))}
                              {dealer.branches_list.length > 2 && (
                                <Chip
                                  label={`+${dealer.branches_list.length - 2} more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: THEME.textTertiary,
                                    color: THEME.textTertiary,
                                    fontSize: '0.68rem',
                                    height: '22px'
                                  }}
                                />
                              )}
                            </>
                          )}
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Analytics />}
                        sx={{
                          mt: 2,
                          background: THEME.gradientPrimary,
                          borderRadius: 3,
                          py: 1.2,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '15px',
                          boxShadow: THEME.shadowMd,
                          '&:hover': {
                            boxShadow: THEME.shadowLg,
                            transform: 'translateY(-1px)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        View Analytics
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Fade>
            ))}
          </Box>
        )}
        {/* Enhanced Main Dealer Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialogs}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: '95vh',
              height: '95vh',
              background: THEME.background,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowXl,
              overflow: 'hidden'
            }
          }}
        >
          {/* Modern Header */}
          <DialogTitle sx={{
            background: THEME.gradientPrimary,
            color: THEME.background,
            fontWeight: 600,
            py: 3,
            position: 'relative',
            boxShadow: THEME.shadowMd
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <Business sx={{ fontSize: 24, color: THEME.background }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {selectedDealer}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.85rem' }}>
                        Login Access:
                      </Typography>
                      <Switch
                        size="small"
                        checked={dealerUsers.length > 0 ? dealerUsers.some(u => u.is_active !== false && u.status !== 'inactive') : true}
                        onChange={async (e) => {
                          const newStatus = e.target.checked;
                          try {
                            await updateDealerStatus(selectedDealer, newStatus);
                            const updatedUsers = await listDealerUsers(selectedDealer);
                            setDealerUsers(updatedUsers);
                            loadData();
                          } catch (err) {
                            console.error(err);
                            alert('Failed to update dealership status');
                          }
                        }}
                        color="success"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#FFF',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#2E7D32',
                          }
                        }}
                      />
                    </Box>
                    <Chip
                      label={(dealerUsers.length > 0 ? dealerUsers.some(u => u.is_active !== false && u.status !== 'inactive') : true) ? 'ACTIVE' : 'INACTIVE'}
                      size="small"
                      sx={{
                        background: (dealerUsers.length > 0 ? dealerUsers.some(u => u.is_active !== false && u.status !== 'inactive') : true)
                          ? 'rgba(16, 185, 129, 0.2)' 
                          : 'rgba(239, 68, 68, 0.2)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        fontWeight: 700,
                        fontSize: '0.675rem',
                        height: '20px'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setDeleteConfirmId('');
                    setDeleteAdminPassword('');
                    setDeleteDealerError('');
                    setDeleteDealerDialogOpen(true);
                  }}
                  sx={{
                    background: '#DC2626',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2,
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
                    '&:hover': {
                      background: '#B91C1C'
                    }
                  }}
                >
                  Delete Dealership
                </Button>
                <IconButton
                  onClick={handleCloseDialogs}
                  sx={{
                    color: THEME.background,
                    background: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          {/* Enhanced Tabs */}
          <Box sx={{
            borderBottom: 1,
            borderColor: THEME.border,
            background: THEME.surface,
            px: 3
          }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: THEME.textSecondary,
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  py: 2,
                  minHeight: 'auto',
                  '&.Mui-selected': {
                    color: THEME.primary,
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: THEME.primary,
                  height: 3,
                  borderRadius: '2px 2px 0 0'
                }
              }}
            >
              <Tab
                icon={<DashboardIcon sx={{ fontSize: 20, mb: 0.5 }} />}
                iconPosition="start"
                label={`Dashboard`}
              />
              <Tab
                icon={<Assessment sx={{ fontSize: 20, mb: 0.5 }} />}
                iconPosition="start"
                label={`Results (${dealerResults.length})`}
              />
              <Tab
                icon={<Person sx={{ fontSize: 20, mb: 0.5 }} />}
                iconPosition="start"
                label={`Users (${dealerUsers.length})`}
              />
            </Tabs>
          </Box>

          <DialogContent dividers sx={{
            p: 0,
            background: THEME.background,
            overflow: 'hidden'
          }}>
            {loadingResults ? (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '400px'
              }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: `3px solid ${THEME.border}`,
                  borderTop: `3px solid ${THEME.primary}`,
                  animation: 'spin 1s linear infinite',
                  mb: 3
                }} />
                <Typography variant="h6" sx={{
                  color: THEME.textSecondary,
                  fontWeight: 500
                }}>
                  Loading Analytics...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
                {/* Dashboard Tab */}
                {tabValue === 0 && (
                  <Box                 // CENTRE EVERYTHING THAT FOLLOWS
                    sx={{
                      maxWidth: 1400,  // design width â€“ tweak to taste
                      mx: 'auto',      // margin-left / right auto â†’ centre
                      my: 2
                    }}
                  >
                    {/* â”€â”€â”€â”€â”€â”€â”€ 1. Overview cards â”€â”€â”€â”€â”€â”€â”€ */}
                    <Grid
                      container
                      spacing={3}
                      sx={{ mb: 4 }}
                      justifyContent="center"      // horizontally centre row
                    >
                      {[
                        {
                          label: 'Total Videos',
                          value: dashboardData.totalVideos,
                          icon: VideoLibrary,
                          color: THEME.primary
                        },
                        {
                          label: 'Avg Video Score',
                          value: dashboardData.averageScores.video.toFixed(1),
                          icon: Videocam,
                          color: THEME.success
                        },
                        {
                          label: 'Avg Audio Score',
                          value: dashboardData.averageScores.audio.toFixed(1),
                          icon: Mic,
                          color: THEME.accent
                        },
                        {
                          label: 'Avg Overall Score',
                          value: dashboardData.averageScores.overall.toFixed(1),
                          icon: Score,
                          color: THEME.primary
                        }
                      ].map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.label}>
                          <Card
                            sx={{
                              background: THEME.surfaceElevated,
                              border: `1px solid ${THEME.border}`,
                              borderRadius: 3,
                              boxShadow: THEME.shadowSm,
                              transition: 'all .2s ease-in-out',
                              '&:hover': {
                                boxShadow: THEME.shadowMd,
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                  <Typography variant="h4" sx={{ color: THEME.textPrimary, fontWeight: 700, mb: .5 }}>
                                    {stat.value}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontWeight: 500, fontSize: '.875rem' }}>
                                    {stat.label}
                                  </Typography>
                                </Box>
                                <Box sx={{
                                  width: 44, height: 44, borderRadius: '50%',
                                  bgcolor: `${stat.color}15`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                  <stat.icon sx={{ fontSize: 20, color: stat.color }} />
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Service Advisor Quality Comparison */}
                    <Grid item xs={12}>
                      <Card sx={{
                        background: THEME.surfaceElevated,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: 3,
                        boxShadow: THEME.shadowSm,
                        mb: 4
                      }}>
                        <CardContent sx={{ p: 4 }}> {/* Increased padding from p: 3 to p: 4 */}
                          {/* Header with centered alignment */}
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', // Center the header content
                            mb: 3, // Increased from mb: 2 to mb: 3
                            textAlign: 'center'
                          }}>
                            <TrendingUp sx={{
                              color: THEME.primary,
                              mr: 2,
                              fontSize: 28 // Slightly larger icon
                            }} />
                            <Typography variant="h5" sx={{ // Changed from h6 to h5 for more prominence
                              color: THEME.textPrimary,
                              fontWeight: 700 // Increased from 600 to 700
                            }}>
                              Service Advisor Quality Comparison
                            </Typography>
                          </Box>

                          {/* Description with centered alignment */}
                          <Typography variant="body1" sx={{ // Changed from body2 to body1
                            color: THEME.textSecondary,
                            mb: 4, // Increased from mb: 3 to mb: 4
                            textAlign: 'center', // Center the text
                            maxWidth: '900px', // Slightly wider
                            mx: 'auto', // Center the text block
                            lineHeight: 1.6
                          }}>
                            Audio quality (ðŸ”µ left) and video quality (ðŸŸ  right) scores for each service advisor.
                            Bars extend from the center to show relative performance in each category.
                          </Typography>

                          {dashboardData.serviceAdvisorRankings.length === 0 ? (
                            <Box sx={{
                              textAlign: 'center',
                              py: 8, // Increased from py: 6 to py: 8
                              color: THEME.textTertiary
                            }}>
                              <Person sx={{
                                fontSize: 56, // Increased from 48 to 56
                                mb: 3, // Increased from mb: 2 to mb: 3
                                opacity: 0.5
                              }} />
                              <Typography variant="h6">No service advisor data available</Typography>
                            </Box>
                          ) : (
                            <ServiceAdvisorQualityChart
                              data={dashboardData.serviceAdvisorRankings.slice(0, 8)} // Show top 8 advisors
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* â”€â”€â”€â”€â”€â”€â”€ 2. Charts grid â”€â”€â”€â”€â”€â”€â”€ */}
                    {/* Three Column Layout */}
                    <Grid
                      container
                      spacing={3}
                      sx={{ mb: 4 }}
                      justifyContent="center"
                    >
                      {/* Left Column - Service Advisor Rankings */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{
                          background: THEME.surfaceElevated,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm,
                          height: 480 // Fixed standard height
                        }}>
                          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <EmojiEvents sx={{ color: THEME.primary, mr: 2, fontSize: 24 }} />
                              <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
                                Service Advisor Rankings
                              </Typography>
                            </Box>

                            {dashboardData.serviceAdvisorRankings.length === 0 ? (
                              <Box sx={{
                                textAlign: 'center',
                                py: 8,
                                color: THEME.textTertiary,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                              }}>
                                <Person sx={{ fontSize: 48, mb: 2, opacity: .5 }} />
                                <Typography>No service advisor data available</Typography>
                              </Box>
                            ) : (
                              <Box sx={{
                                flex: 1,
                                overflow: 'auto',
                                pr: 1,
                                maxHeight: 380
                              }}>
                                {dashboardData.serviceAdvisorRankings.map((a, i) => (
                                  <ServiceAdvisorRankingCard key={a.name} advisor={a} rank={i + 1} />
                                ))}
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Center Column - Recent Score Trend */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{
                          background: THEME.surfaceElevated,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm,
                          height: 480 // Fixed standard height
                        }}>
                          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <Timeline sx={{ color: THEME.accent, mr: 2, fontSize: 24 }} />
                              <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
                                Recent Score Trend
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', justifyItems: 'center' }}>
                              <ScoreTrendChart data={dashboardData.scoreTrend} />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Right Column - Quality Distribution */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{
                          background: THEME.surfaceElevated,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm,
                          height: 480 // Fixed standard height
                        }}>
                          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <PieChart sx={{ color: THEME.primary, mr: 2, fontSize: 24 }} />
                              <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
                                Quality Distribution
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                              <QualityDistributionChart data={dashboardData.qualityDistribution} />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {/* Results Tab */}
                {tabValue === 1 && (
                  <Box>
                    {/* Enhanced Search Bar */}
                    <Box sx={{
                      p: 3,
                      background: THEME.surface,
                      borderRadius: 3,
                      border: `1px solid ${THEME.border}`,
                      mb: 3
                    }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                          size="small"
                          placeholder="Search by dealership, vehicle, email or phoneâ€¦"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: THEME.textTertiary }} />
                              </InputAdornment>
                            )
                          }}
                          sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                              background: THEME.background,
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: THEME.primary,
                              },
                            }
                          }}
                        />
                        <Button
                          startIcon={<FileDownloadIcon />}
                          variant="outlined"
                          onClick={exportToCsv}
                          disabled={!filteredDealerResults.length}
                          sx={{
                            borderColor: THEME.primary,
                            color: THEME.primary,
                            borderRadius: 2,
                            fontWeight: 500,
                            '&:hover': {
                              borderColor: THEME.primaryDark,
                              backgroundColor: `${THEME.primary}08`
                            }
                          }}
                        >
                          Export CSV
                        </Button>
                      </Stack>
                    </Box>

                    {filteredDealerResults.length === 0 ? (
                      <Card sx={{
                        background: THEME.surfaceElevated,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: 3,
                        textAlign: 'center',
                        p: 8,
                        boxShadow: THEME.shadowSm
                      }}>
                        <Assessment sx={{
                          fontSize: 64,
                          color: THEME.textTertiary,
                          mb: 3,
                          opacity: 0.5
                        }} />
                        <Typography variant="h6" sx={{
                          color: THEME.textSecondary,
                          fontWeight: 500,
                          mb: 1
                        }}>
                          {searchTerm ? 'No results found' : 'No results available'}
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: THEME.textTertiary
                        }}>
                          {searchTerm ? 'Try adjusting your search terms' : 'This dealer has no analysis results yet'}
                        </Typography>
                      </Card>
                    ) : (
                      <>
                        <TableContainer component={Paper} sx={{
                          background: THEME.background,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm
                        }}>
                          <Table>
                            <TableHead>
                              <TableRow sx={{
                                backgroundColor: THEME.surface,
                                '& th': {
                                  borderBottom: `2px solid ${THEME.border}`,
                                  fontWeight: 600,
                                  color: THEME.textPrimary,
                                  fontSize: '0.875rem',
                                  py: 2
                                }
                              }}>
                                <TableCell>Dealership</TableCell>
                                <TableCell>Vehicle</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Video</TableCell>
                                <TableCell>Audio</TableCell>
                                <TableCell>Overall</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paginatedDealerResults.map((r) => (
                                <TableRow
                                  key={r._id}
                                  hover
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: THEME.surface
                                    },
                                    '& td': {
                                      borderBottom: `1px solid ${THEME.borderLight}`,
                                      py: 1.5
                                    }
                                  }}
                                >
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Business sx={{
                                        color: THEME.primary,
                                        mr: 1.5,
                                        fontSize: 18
                                      }} />
                                      <Typography variant="body2" sx={{
                                        color: THEME.textPrimary,
                                        fontWeight: 500
                                      }}>
                                        {r.citnow_metadata?.dealership || 'â€”'}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <DirectionsCar sx={{
                                        color: THEME.textSecondary,
                                        mr: 1.5,
                                        fontSize: 18
                                      }} />
                                      <Typography variant="body2" sx={{
                                        color: THEME.textPrimary,
                                        fontWeight: 500
                                      }}>
                                        {r.citnow_metadata?.vehicle || r.citnow_metadata?.registration || 'â€”'}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ color: THEME.textPrimary }}>
                                      {r.citnow_metadata?.email || 'â€”'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ color: THEME.textPrimary }}>
                                      {r.citnow_metadata?.phone || 'â€”'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={`${r.video_analysis?.quality_score || 0}/10`}
                                      size="small"
                                      sx={{
                                        background:
                                          (r.video_analysis?.quality_score || 0) >= 8 ? THEME.successLight :
                                            (r.video_analysis?.quality_score || 0) >= 6 ? THEME.primaryUltraLight :
                                              (r.video_analysis?.quality_score || 0) >= 4 ? THEME.warningLight :
                                                THEME.errorLight,
                                        color:
                                          (r.video_analysis?.quality_score || 0) >= 8 ? THEME.success :
                                            (r.video_analysis?.quality_score || 0) >= 6 ? THEME.primary :
                                              (r.video_analysis?.quality_score || 0) >= 4 ? THEME.warning :
                                                THEME.error,
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={`${Math.round(r.audio_analysis?.score || 0)}/10`}
                                      size="small"
                                      sx={{
                                        background:
                                          (r.audio_analysis?.score || 0) >= 8 ? THEME.successLight :
                                            (r.audio_analysis?.score || 0) >= 6 ? THEME.primaryUltraLight :
                                              (r.audio_analysis?.score || 0) >= 4 ? THEME.warningLight :
                                                THEME.errorLight,
                                        color:
                                          (r.audio_analysis?.score || 0) >= 8 ? THEME.success :
                                            (r.audio_analysis?.score || 0) >= 6 ? THEME.primary :
                                              (r.audio_analysis?.score || 0) >= 4 ? THEME.warning :
                                                THEME.error,
                                        fontWeight: 600,
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={`${r.overall_quality?.overall_score?.toFixed(1) || 0}/10`}
                                      size="small"
                                      sx={{
                                        background: THEME.primaryUltraLight,
                                        color: THEME.primary,
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        border: `1px solid ${THEME.primaryLight}`
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                      <Tooltip title="View details">
                                        <IconButton
                                          size="small"
                                          sx={{
                                            color: THEME.primary,
                                            background: `${THEME.primary}08`,
                                            '&:hover': {
                                              background: `${THEME.primary}15`
                                            }
                                          }}
                                          onClick={() => handleViewResultDetails(r)}
                                        >
                                          <Visibility fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete">
                                        <IconButton
                                          size="small"
                                          sx={{
                                            color: THEME.error,
                                            background: `${THEME.error}08`,
                                            '&:hover': {
                                              background: `${THEME.error}15`
                                            }
                                          }}
                                          onClick={() => handleDeleteResult(r._id)}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, 50]}
                          component="div"
                          count={filteredDealerResults.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={(e, newPage) => setPage(newPage)}
                          onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                          }}
                          sx={{
                            borderTop: `1px solid ${THEME.border}`,
                            mt: 2,
                            '& .MuiTablePagination-toolbar': {
                              padding: 2
                            }
                          }}
                        />
                      </>
                    )}
                  </Box>
                )}

                {/* Users Tab */}
                {tabValue === 2 && (
                  <Box>
                    {/* Users Action Bar */}
                    <Box sx={{
                      p: 3,
                      background: THEME.surface,
                      borderRadius: 3,
                      border: `1px solid ${THEME.border}`,
                      mb: 3
                    }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                          size="small"
                          placeholder="Search users by username or emailâ€¦"
                          value={userSearchTerm}
                          onChange={(e) => {
                            setUserSearchTerm(e.target.value);
                            setUserPage(0);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: THEME.textTertiary }} />
                              </InputAdornment>
                            )
                          }}
                          sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                              background: THEME.background,
                              borderRadius: 2,
                              '&:hover fieldset': {
                                borderColor: THEME.primary,
                              },
                            }
                          }}
                        />
                        <Button
                          startIcon={<Add />}
                          variant="contained"
                          onClick={() => {
                            setEditingUser(null);
                            setUserForm({ username: '', email: '', role: 'dealer_admin', password: '', dealer_id: selectedDealer });
                            setUserFormOpen(true);
                          }}
                          sx={{
                            background: THEME.gradientPrimary,
                            borderRadius: 2,
                            px: 3,
                            fontWeight: 600,
                            boxShadow: THEME.shadowMd,
                            '&:hover': {
                              boxShadow: THEME.shadowLg,
                              transform: 'translateY(-1px)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          Add User
                        </Button>
                      </Stack>
                    </Box>

                    {filteredDealerUsers.length === 0 ? (
                      <Card sx={{
                        background: THEME.surfaceElevated,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: 3,
                        textAlign: 'center',
                        p: 8,
                        boxShadow: THEME.shadowSm
                      }}>
                        <Person sx={{
                          fontSize: 64,
                          color: THEME.textTertiary,
                          mb: 3,
                          opacity: 0.5
                        }} />
                        <Typography variant="h6" sx={{
                          color: THEME.textSecondary,
                          fontWeight: 500,
                          mb: 1
                        }}>
                          {userSearchTerm ? 'No users found' : 'No users assigned'}
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: THEME.textTertiary,
                          mb: 3
                        }}>
                          {userSearchTerm ? 'Try adjusting your search terms' : 'Get started by adding the first user'}
                        </Typography>
                        <Button
                          startIcon={<Add />}
                          variant="contained"
                          onClick={() => {
                            setEditingUser(null);
                            setUserForm({ username: '', email: '', role: "dealer_admin", password: '', dealer_id: selectedDealer });
                            setUserFormOpen(true);
                          }}
                          sx={{
                            background: THEME.gradientPrimary,
                            borderRadius: 2,
                            fontWeight: 600
                          }}
                        >
                          Add First User
                        </Button>
                      </Card>
                    ) : (
                      <>
                        <TableContainer component={Paper} sx={{
                          background: THEME.background,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm
                        }}>
                          <Table>
                            <TableHead>
                              <TableRow sx={{
                                backgroundColor: THEME.surface,
                                '& th': {
                                  borderBottom: `2px solid ${THEME.border}`,
                                  fontWeight: 600,
                                  color: THEME.textPrimary,
                                  fontSize: '0.875rem',
                                  py: 2
                                }
                              }}>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Videos Analyzed</TableCell>
                                <TableCell>Dealer ID</TableCell>
                                <TableCell>Status (Login Control)</TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paginatedDealerUsers.map((user) => {
                                const userId = user._id || user.id;
                                const videosAnalyzed = userStats[userId] || 0;
                                const isActive = user.is_active !== false && user.status !== 'inactive';

                                return (
                                  <TableRow
                                    key={userId}
                                    hover
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: THEME.surface
                                      },
                                      '& td': {
                                        borderBottom: `1px solid ${THEME.borderLight}`,
                                        py: 1.5
                                      }
                                    }}
                                  >
                                    <TableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar
                                          sx={{
                                            width: 32,
                                            height: 32,
                                            background: THEME.gradientPrimary,
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            mr: 2
                                          }}
                                        >
                                          {(user.username || 'U').charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                          <Typography variant="body2" sx={{
                                            color: THEME.textPrimary,
                                            fontWeight: 600
                                          }}>
                                            {user.username}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ color: THEME.textPrimary }}>
                                        {user.email}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Chip
                                        label={user.role === 'dealer_admin' ? 'Dealer Admin' : 'User'}
                                        size="small"
                                        sx={{
                                          background: user.role === 'dealer_admin' ? THEME.accent : THEME.primary,
                                          color: THEME.background,
                                          fontWeight: 600,
                                          fontSize: '0.75rem'
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <VideoLibrary sx={{
                                          fontSize: 16,
                                          color: THEME.primary,
                                          mr: 1
                                        }} />
                                        <Typography variant="body2" sx={{
                                          color: THEME.textPrimary,
                                          fontWeight: 600,
                                          fontFamily: 'monospace'
                                        }}>
                                          {videosAnalyzed}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" fontFamily="monospace" sx={{
                                        color: THEME.textPrimary,
                                        fontWeight: 500
                                      }}>
                                        {user.dealer_id || '—'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Tooltip title={isActive ? "Click to deactivate user (disables login)" : "Click to activate user (enables login)"}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Switch
                                            size="small"
                                            checked={isActive}
                                            onChange={async () => {
                                              try {
                                                await updateUser(userId, { is_active: !isActive, status: !isActive ? 'active' : 'inactive' });
                                                const uList = await listDealerUsers(selectedDealer);
                                                setDealerUsers(Array.isArray(uList) ? uList : []);
                                              } catch (err) {
                                                console.error('Error toggling user status:', err);
                                              }
                                            }}
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
                                    </TableCell>
                                    <TableCell align="center">
                                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                        <Tooltip title="Edit user">
                                          <IconButton
                                            size="small"
                                            sx={{
                                              color: THEME.primary,
                                              background: `${THEME.primary}08`,
                                              '&:hover': {
                                                background: `${THEME.primary}15`
                                              }
                                            }}
                                            onClick={() => handleEditUser(user)}
                                          >
                                            <Edit fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete user">
                                          <IconButton
                                            size="small"
                                            sx={{
                                              color: THEME.error,
                                              background: `${THEME.error}08`,
                                              '&:hover': {
                                                background: `${THEME.error}15`
                                              }
                                            }}
                                            onClick={() => handleDeleteUser(userId)}
                                          >
                                            <DeleteIcon fontSize="small" />
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

                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, 50]}
                          component="div"
                          count={filteredDealerUsers.length}
                          rowsPerPage={userRowsPerPage}
                          page={userPage}
                          onPageChange={(e, newPage) => setUserPage(newPage)}
                          onRowsPerPageChange={(e) => {
                            setUserRowsPerPage(parseInt(e.target.value, 10));
                            setUserPage(0);
                          }}
                          sx={{
                            borderTop: `1px solid ${THEME.border}`,
                            mt: 2,
                            '& .MuiTablePagination-toolbar': {
                              padding: 2
                            }
                          }}
                        />
                      </>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{
            px: 3,
            py: 2,
            background: THEME.surface,
            borderTop: `1px solid ${THEME.border}`
          }}>
            <Button
              onClick={handleCloseDialogs}
              variant="outlined"
              sx={{
                borderColor: THEME.border,
                color: THEME.textSecondary,
                borderRadius: 2,
                px: 4,
                fontWeight: 500,
                '&:hover': {
                  borderColor: THEME.textSecondary,
                  color: THEME.textPrimary,
                  background: `${THEME.textSecondary}08`
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced User Form Dialog */}
        <Dialog
          open={userFormOpen}
          onClose={() => {
            setUserFormOpen(false);
            setEditingUser(null);
            setUserForm({ username: '', email: '', role: 'dealer_admin', password: '', dealer_id: '' });
            setUserError('');
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: THEME.background,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowXl
            }
          }}
        >
          <DialogTitle sx={{
            background: THEME.gradientPrimary,
            color: THEME.background,
            fontWeight: 600,
            py: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 2, fontSize: 24 }} />
              {editingUser ? 'Edit User' : 'Create New User'}
            </Box>
          </DialogTitle>

          <DialogContent sx={{ mt: 2, p: 3 }}>
            {userError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontWeight: 500
                  }
                }}
                onClose={() => setUserError('')}
              >
                {userError}
              </Alert>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Username"
              value={userForm.username}
              onChange={(e) => {
                const username = e.target.value;
                setUserForm({ ...userForm, username });

                // Check if username already exists (excluding current user being edited)
                if (username && username.length >= 3) {
                  const existingUser = users.find(u =>
                    u.username.toLowerCase() === username.toLowerCase() &&
                    u._id !== editingUser?._id
                  );
                  if (existingUser) {
                    setUserError('Username already exists. Please choose a different username.');
                  } else if (userError === 'Username already exists. Please choose a different username.') {
                    setUserError('');
                  }
                }
              }}
              error={userError.includes('Username already exists')}
              helperText={
                userError.includes('Username already exists')
                  ? userError
                  : "Username must be at least 3 characters long"
              }
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: THEME.primary,
                  },
                },
                '& .MuiInputLabel-root': {
                  color: THEME.textSecondary,
                }
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => {
                const email = e.target.value;
                setUserForm({ ...userForm, email });

                // Check if email already exists (excluding current user being edited)
                if (email) {
                  const existingUser = users.find(u =>
                    u.email.toLowerCase() === email.toLowerCase() &&
                    u._id !== editingUser?._id
                  );
                  if (existingUser) {
                    setUserError('Email address already exists. Please use a different email.');
                  } else if (userError === 'Email address already exists. Please use a different email.') {
                    setUserError('');
                  }
                }
              }}
              error={userError.includes('Email address already exists')}
              helperText={
                userError.includes('Email address already exists')
                  ? userError
                  : "Enter a valid email address"
              }
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: THEME.primary,
                  },
                }
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              value={userForm.password}
              onChange={(e) => {
                const password = e.target.value;
                setUserForm({ ...userForm, password });

                // Validate password length for new users
                if (!editingUser && password && password.length < 6) {
                  setUserError('Password must be at least 6 characters long');
                } else if (userError === 'Password must be at least 6 characters long') {
                  setUserError('');
                }
              }}
              error={userError.includes('Password must be at least 6 characters')}
              helperText={
                editingUser
                  ? "Leave blank to keep current password"
                  : userError.includes('Password must be at least 6 characters')
                    ? userError
                    : "Password must be at least 6 characters long"
              }
              required={!editingUser}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: THEME.primary,
                  },
                }
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              select
              label="Role"
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: THEME.primary,
                  },
                }
              }}
            >
              {ROLE_OPTS.map(r => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Dealer ID"
              value={selectedDealer || ''}
              disabled
              helperText="Automatically assigned to this dealer"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: THEME.surface,
                }
              }}
            />

            <Box sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              border: `1px solid ${THEME.borderLight}`,
              backgroundColor: THEME.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={userForm.is_active !== false}
                    onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })}
                    color="success"
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: THEME.textPrimary }}>
                      Account Status: {userForm.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                      {userForm.is_active !== false ? 'User can log in under this dealer' : 'Login disabled for this user'}
                    </Typography>
                  </Box>
                }
              />
              <Chip
                label={userForm.is_active !== false ? 'Active' : 'Inactive'}
                color={userForm.is_active !== false ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => {
                setUserFormOpen(false);
                setEditingUser(null);
                setUserForm({ username: '', email: '', role: 'dealer_admin', password: '', dealer_id: '' });
                setUserError('');
              }}
              variant="outlined"
              sx={{
                borderColor: THEME.border,
                color: THEME.textSecondary,
                borderRadius: 2,
                px: 3,
                fontWeight: 500,
                '&:hover': {
                  borderColor: THEME.textSecondary,
                  color: THEME.textPrimary
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitUser}
              disabled={!!userError} // Disable button if there are validation errors
              sx={{
                background: userError ? THEME.textTertiary : THEME.gradientPrimary,
                borderRadius: 2,
                px: 4,
                fontWeight: 600,
                boxShadow: THEME.shadowMd,
                '&:hover:not(:disabled)': {
                  boxShadow: THEME.shadowLg,
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease-in-out',
                '&:disabled': {
                  cursor: 'not-allowed',
                  opacity: 0.6
                }
              }}
            >
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* HIGH-SECURITY DELETE DEALERSHIP AUTHORIZATION DIALOG */}
        <Dialog
          open={deleteDealerDialogOpen}
          onClose={() => setDeleteDealerDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              border: `2px solid ${THEME.error}`,
              boxShadow: THEME.shadowXl,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
            color: '#FFFFFF',
            fontWeight: 700,
            py: 2.5
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DeleteIcon sx={{ fontSize: 26 }} />
              <Typography variant="h6" fontWeight={700} fontSize="1.1rem">
                Delete Dealership Security Confirmation
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3, pt: 3 }}>
            {deleteDealerError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setDeleteDealerError('')}>
                {deleteDealerError}
              </Alert>
            )}
            <Typography variant="body2" sx={{ color: THEME.textPrimary, mb: 2.5, lineHeight: 1.6, fontWeight: 500 }}>
              ⚠️ <strong>WARNING:</strong> You are about to permanently delete dealership <strong>{selectedDealer}</strong> and all associated user accounts, branches, and analysis records.
            </Typography>

            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ color: THEME.textPrimary, fontWeight: 700, mb: 0.8, display: 'block' }}>
                1. Type Dealership ID to confirm: <span style={{ color: '#DC2626', fontFamily: 'monospace' }}>{selectedDealer?.toUpperCase()}</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder={`Type "${selectedDealer?.toUpperCase()}"`}
                value={deleteConfirmId}
                onChange={(e) => setDeleteConfirmId(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontFamily: 'monospace' } }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: THEME.textPrimary, fontWeight: 700, mb: 0.8, display: 'block' }}>
                2. Super Admin Password:
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="password"
                placeholder="Enter Super Admin Password"
                value={deleteAdminPassword}
                onChange={(e) => setDeleteAdminPassword(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, background: THEME.surface, borderTop: `1px solid ${THEME.border}` }}>
            <Button
              onClick={() => setDeleteDealerDialogOpen(false)}
              variant="outlined"
              sx={{ borderColor: THEME.border, color: THEME.textSecondary, borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmDeleteDealer}
              disabled={isDeletingDealer || deleteConfirmId.trim().toUpperCase() !== selectedDealer?.toUpperCase() || !deleteAdminPassword}
              sx={{
                background: '#DC2626',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 3,
                borderRadius: 2,
                '&:hover': { background: '#B91C1C' },
                '&:disabled': { opacity: 0.5 }
              }}
            >
              {isDeletingDealer ? <CircularProgress size={20} color="inherit" /> : 'Confirm Deletion'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* Enhanced Analysis Report Dialog */}
        <Dialog
          open={resultDialogOpen}
          onClose={() => setResultDialogOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: '95vh',
              background: THEME.background,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowXl,
            }
          }}
        >
          {/* Modern Header */}
          <DialogTitle sx={{
            background: THEME.gradientPrimary,
            color: THEME.background,
            fontWeight: 600,
            py: 3,
            position: 'relative'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ fontSize: 28, mr: 2, opacity: 0.9 }} />
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    Analysis Report
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Detailed performance assessment
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={() => setResultDialogOpen(false)}
                sx={{
                  color: THEME.background,
                  background: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers sx={{
            background: THEME.background,
            p: 0,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {selectedResult && (
              <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                {/* Modern Header Section */}
                <Box sx={{ p: 4, borderBottom: `1px solid ${THEME.border}` }}>


                  {/* Service Information Cards */}
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <Card sx={{
                        background: THEME.surfaceElevated,
                        border: `1px solid ${THEME.border}`,
                        borderRadius: 3,
                        boxShadow: THEME.shadowSm
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <DirectionsCar sx={{
                              fontSize: 28,
                              color: THEME.primary,
                              mr: 2
                            }} />
                            <Typography variant="h6" sx={{
                              color: THEME.textPrimary,
                              fontWeight: 600
                            }}>
                              Service Information
                            </Typography>
                          </Box>

                          <Grid container spacing={2}>
                            {[
                              {
                                label: 'Dealership',
                                value: selectedResult.citnow_metadata?.dealership,
                                icon: Business
                              },
                              {
                                label: 'Vehicle',
                                value: selectedResult.citnow_metadata?.vehicle || selectedResult.citnow_metadata?.registration,
                                icon: DirectionsCar
                              },
                              {
                                label: 'Service Advisor',
                                value: selectedResult.citnow_metadata?.service_advisor,
                                icon: Person
                              },
                              {
                                label: 'VIN',
                                value: selectedResult.citnow_metadata?.vin,
                                icon: Badge,
                                monospace: true
                              },
                              {
                                label: 'Email',
                                value: selectedResult.citnow_metadata?.email,
                                icon: Email
                              },
                              {
                                label: 'Phone',
                                value: selectedResult.citnow_metadata?.phone,
                                icon: Phone
                              }
                            ].map((item, index) => (
                              <Grid item xs={12} sm={6} md={4} key={item.label}>
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 2,
                                  background: THEME.surface,
                                  borderRadius: 2,
                                  border: `1px solid ${THEME.borderLight}`
                                }}>
                                  <item.icon sx={{
                                    fontSize: 20,
                                    color: THEME.primary,
                                    mr: 2
                                  }} />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="caption" sx={{
                                      color: THEME.textSecondary,
                                      fontWeight: 500,
                                      display: 'block',
                                      mb: 0.5
                                    }}>
                                      {item.label}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                      color: THEME.textPrimary,
                                      fontWeight: 600,
                                      fontFamily: item.monospace ? 'monospace' : 'inherit'
                                    }}>
                                      {item.value || 'N/A'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>

                          {/* Video Link */}
                          <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${THEME.borderLight}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Videocam sx={{
                                  fontSize: 24,
                                  color: THEME.primary,
                                  mr: 2
                                }} />
                                <Box>
                                  <Typography variant="body1" sx={{
                                    color: THEME.textPrimary,
                                    fontWeight: 600,
                                    mb: 0.5
                                  }}>
                                    Video Recording
                                  </Typography>
                                  <Typography variant="body2" sx={{
                                    color: THEME.textSecondary
                                  }}>
                                    {selectedResult.citnow_metadata?.page_url ?
                                      'Watch the original video recording' :
                                      'No video URL available'
                                    }
                                  </Typography>
                                </Box>
                              </Box>
                              {selectedResult.citnow_metadata?.page_url ? (
                                <Button
                                  variant="contained"
                                  href={selectedResult.citnow_metadata.page_url}
                                  target="_blank"
                                  startIcon={<Videocam />}
                                  sx={{
                                    background: THEME.gradientPrimary,
                                    borderRadius: 2,
                                    px: 3,
                                    fontWeight: 600,
                                    boxShadow: THEME.shadowMd,
                                    '&:hover': {
                                      boxShadow: THEME.shadowLg,
                                      transform: 'translateY(-1px)'
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                  }}
                                >
                                  Watch Video
                                </Button>
                              ) : (
                                <Chip
                                  label="Not Available"
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    borderColor: THEME.textTertiary,
                                    color: THEME.textTertiary
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                {/* Quality Assessment Section */}
                <Box sx={{ p: 4 }}>
                  <Box sx={{ p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{
                        color: THEME.textPrimary,
                        fontWeight: 600,
                        mb: 3
                      }}>
                        Quality Assessment
                      </Typography>

                      {/* Video & Audio Quality Side by Side */}
                      <Box sx={{
                        display: 'flex',
                        gap: 3,
                        mb: 4,
                        flexDirection: { xs: 'column', md: 'row' }
                      }}>
                        {/* Video Quality - Left Side */}
                        <Card sx={{
                          background: THEME.surfaceElevated,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm,
                          flex: 1,
                          minWidth: { md: 0 }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            {/* Video Header */}
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 3,
                              gap: 2
                            }}>
                              <Box sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                background: THEME.primaryUltraLight,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <Videocam sx={{ fontSize: 24, color: THEME.primary }} />
                              </Box>
                              <Box>
                                <Typography variant="h4" sx={{
                                  color: THEME.textPrimary,
                                  fontWeight: 700,
                                  lineHeight: 1.2
                                }}>
                                  {selectedResult.video_analysis?.quality_score || 0}/10
                                </Typography>
                                <Typography variant="body2" sx={{
                                  color: THEME.textSecondary,
                                  fontWeight: 500
                                }}>
                                  Video Quality
                                </Typography>
                              </Box>
                              <Chip
                                label={selectedResult.video_analysis?.quality_label || 'N/A'}
                                size="small"
                                sx={{
                                  background:
                                    selectedResult.video_analysis?.quality_label === 'Excellent' ? THEME.successLight :
                                      selectedResult.video_analysis?.quality_label === 'Good' ? THEME.primaryUltraLight :
                                        selectedResult.video_analysis?.quality_label === 'Fair' ? THEME.warningLight :
                                          THEME.errorLight,
                                  color:
                                    selectedResult.video_analysis?.quality_label === 'Excellent' ? THEME.success :
                                      selectedResult.video_analysis?.quality_label === 'Good' ? THEME.primary :
                                        selectedResult.video_analysis?.quality_label === 'Fair' ? THEME.warning :
                                          THEME.error,
                                  fontWeight: 600,
                                  ml: 'auto'
                                }}
                              />
                            </Box>

                            {/* Video Detailed Metrics */}
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="subtitle2" sx={{
                                color: THEME.textSecondary,
                                mb: 2,
                                fontWeight: 600
                              }}>
                                VIDEO METRICS
                              </Typography>

                              <Grid container spacing={2}>
                                {/* Resolution & Basic Info */}
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    Resolution:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                                    {selectedResult.video_analysis?.detailed_analysis?.resolution || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    Duration:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                                    {selectedResult.video_analysis?.detailed_analysis?.duration || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    Frame Rate:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                                    {selectedResult.video_analysis?.detailed_analysis?.frame_rate || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    Stability:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                                    {selectedResult.video_analysis?.shake_level || 'N/A'}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>

                            {/* Quality Scores */}
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="subtitle2" sx={{
                                color: THEME.textSecondary,
                                mb: 2,
                                fontWeight: 600
                              }}>
                                QUALITY SCORES
                              </Typography>

                              <Grid container spacing={1}>
                                <Grid item xs={6}>
                                  <Box sx={{ textAlign: 'center', p: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.primary }}>
                                      {selectedResult.video_analysis?.detailed_analysis?.sharpness?.replace('%', '') || '0'}%
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                                      Sharpness
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box sx={{ textAlign: 'center', p: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.primary }}>
                                      {selectedResult.video_analysis?.detailed_analysis?.brightness?.replace('%', '') || '0'}%
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                                      Brightness
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box sx={{ textAlign: 'center', p: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.primary }}>
                                      {selectedResult.video_analysis?.detailed_analysis?.contrast?.replace('%', '') || '0'}%
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                                      Contrast
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box sx={{ textAlign: 'center', p: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.primary }}>
                                      {selectedResult.video_analysis?.detailed_analysis?.color_vibrancy?.replace('%', '') || '0'}%
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                                      Color
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>

                            {/* Video Issues */}
                            {selectedResult.video_analysis?.issues?.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" sx={{
                                  color: THEME.textSecondary,
                                  mb: 1,
                                  fontWeight: 600
                                }}>
                                  DETECTED ISSUES
                                </Typography>
                                <Box sx={{ pl: 1 }}>
                                  {selectedResult.video_analysis.issues.map((issue, index) => (
                                    <Typography key={index} variant="body2" sx={{
                                      color: THEME.warning,
                                      mb: 0.5,
                                      fontSize: '0.8rem',
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: 1
                                    }}>
                                      <Box component="span" sx={{ fontSize: '0.6rem', mt: '0.2rem' }}>â€¢</Box>
                                      {issue}
                                    </Typography>
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                        </Card>

                        {/* Audio Quality - Right Side */}
                        <Card sx={{
                          background: THEME.surfaceElevated,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm,
                          flex: 1,
                          minWidth: { md: 0 }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            {/* Audio Header */}
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 3,
                              gap: 2
                            }}>
                              <Box sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                background: THEME.accentUltraLight,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <Mic sx={{ fontSize: 24, color: THEME.accent }} />
                              </Box>
                              <Box>
                                <Typography variant="h4" sx={{
                                  color: THEME.textPrimary,
                                  fontWeight: 700,
                                  lineHeight: 1.2
                                }}>
                                  {Math.round(selectedResult.audio_analysis?.score || 0)}/10
                                </Typography>
                                <Typography variant="body2" sx={{
                                  color: THEME.textSecondary,
                                  fontWeight: 500
                                }}>
                                  Audio Quality
                                </Typography>
                              </Box>
                              <Chip
                                label={
                                  selectedResult.audio_analysis?.clarity_level ||
                                  selectedResult.audio_analysis?.prediction ||
                                  'N/A'
                                }
                                size="small"
                                sx={{
                                  background:
                                    selectedResult.audio_analysis?.clarity_level === 'Excellent' ? THEME.successLight :
                                      selectedResult.audio_analysis?.clarity_level === 'Very Good' ? THEME.successLight :
                                        selectedResult.audio_analysis?.clarity_level === 'Good' ? THEME.primaryUltraLight :
                                          selectedResult.audio_analysis?.clarity_level === 'Fair' ? THEME.warningLight :
                                            selectedResult.audio_analysis?.clarity_level === 'Poor' ? THEME.errorLight :
                                              THEME.errorLight,
                                  color:
                                    selectedResult.audio_analysis?.clarity_level === 'Excellent' ? THEME.success :
                                      selectedResult.audio_analysis?.clarity_level === 'Very Good' ? THEME.success :
                                        selectedResult.audio_analysis?.clarity_level === 'Good' ? THEME.primary :
                                          selectedResult.audio_analysis?.clarity_level === 'Fair' ? THEME.warning :
                                            selectedResult.audio_analysis?.clarity_level === 'Poor' ? THEME.error :
                                              THEME.error,
                                  fontWeight: 600,
                                  ml: 'auto'
                                }}
                              />
                            </Box>

                            {/* Audio Detailed Metrics */}
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="subtitle2" sx={{
                                color: THEME.textSecondary,
                                mb: 2,
                                fontWeight: 600
                              }}>
                                AUDIO METRICS
                              </Typography>

                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    Volume Level:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                                    {selectedResult.audio_analysis?.detailed_analysis?.volume_level || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    Noise Level:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                                    {selectedResult.audio_analysis?.detailed_analysis?.noise_level || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    Speech Clarity:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                                    {selectedResult.audio_analysis?.detailed_analysis?.speech_clarity || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                    Background Noise:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: THEME.textSecondary, fontSize: '0.8rem' }}>
                                    {selectedResult.audio_analysis?.detailed_analysis?.background_noise || 'N/A'}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>

                            {/* Audio Component Scores */}
                            {selectedResult.audio_analysis?.component_scores && (
                              <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{
                                  color: THEME.textSecondary,
                                  mb: 2,
                                  fontWeight: 600
                                }}>
                                  COMPONENT SCORES
                                </Typography>

                                <Grid container spacing={1}>
                                  {Object.entries(selectedResult.audio_analysis.component_scores).map(([key, value]) => (
                                    <Grid item xs={6} key={key}>
                                      <Box sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.accent }}>
                                          {Math.round(value)}%
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                                          {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>
                            )}

                            {/* Audio Issues */}
                            {selectedResult.audio_analysis?.issues?.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2" sx={{
                                  color: THEME.textSecondary,
                                  mb: 1,
                                  fontWeight: 600
                                }}>
                                  DETECTED ISSUES
                                </Typography>
                                <Box sx={{ pl: 1 }}>
                                  {selectedResult.audio_analysis.issues.map((issue, index) => (
                                    <Typography key={index} variant="body2" sx={{
                                      color: THEME.warning,
                                      mb: 0.5,
                                      fontSize: '0.8rem',
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: 1
                                    }}>
                                      <Box component="span" sx={{ fontSize: '0.6rem', mt: '0.2rem' }}>â€¢</Box>
                                      {issue}
                                    </Typography>
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Box>

                      {/* Overall Quality Card */}
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Card sx={{
                            background: THEME.surfaceElevated,
                            border: `1px solid ${THEME.border}`,
                            borderRadius: 3,
                            boxShadow: THEME.shadowSm
                          }}>
                            <CardContent sx={{ p: 3, textAlign: 'center' }}>
                              <Box sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: THEME.successUltraLight,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2
                              }}>
                                <Assessment sx={{ fontSize: 28, color: THEME.success }} />
                              </Box>
                              <Typography variant="h3" sx={{
                                color: THEME.textPrimary,
                                fontWeight: 700,
                                mb: 1
                              }}>
                                {selectedResult.overall_quality?.overall_score || 0}/10
                              </Typography>
                              <Typography variant="body2" sx={{
                                color: THEME.textSecondary,
                                fontWeight: 800,
                                mb: 2
                              }}>
                                OVERALL QUALITY
                              </Typography>
                              <Chip
                                label={selectedResult.overall_quality?.overall_label || 'N/A'}
                                size="small"
                                sx={{
                                  background:
                                    selectedResult.overall_quality?.overall_label === 'Excellent' ? THEME.successLight :
                                      selectedResult.overall_quality?.overall_label === 'Very Good' ? THEME.successLight :
                                        selectedResult.overall_quality?.overall_label === 'Good' ? THEME.primaryUltraLight :
                                          selectedResult.overall_quality?.overall_label === 'Fair' ? THEME.warningLight :
                                            selectedResult.overall_quality?.overall_label === 'Poor' ? THEME.errorLight :
                                              THEME.errorLight,
                                  color:
                                    selectedResult.overall_quality?.overall_label === 'Excellent' ? THEME.success :
                                      selectedResult.overall_quality?.overall_label === 'Very Good' ? THEME.success :
                                        selectedResult.overall_quality?.overall_label === 'Good' ? THEME.primary :
                                          selectedResult.overall_quality?.overall_label === 'Fair' ? THEME.warning :
                                            selectedResult.overall_quality?.overall_label === 'Poor' ? THEME.error :
                                              THEME.error,
                                  fontWeight: 600
                                }}
                              />

                              {/* Breakdown */}
                              {selectedResult.overall_quality?.breakdown && (
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 4 }}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                                      Audio
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: THEME.accent, fontWeight: 600 }}>
                                      {selectedResult.overall_quality.breakdown.audio_quality}/10
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                                      Video
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: THEME.primary, fontWeight: 600 }}>
                                      {selectedResult.overall_quality.breakdown.video_quality}/10
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Content Analysis Section */}
                  <Box>
                    <Typography variant="h5" sx={{
                      color: THEME.textPrimary,
                      fontWeight: 600,
                      mb: 3
                    }}>
                      Content Analysis
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Transcription */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{
                          background: THEME.surfaceElevated,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm,
                          height: '100%'
                        }}>
                          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Description sx={{
                                color: THEME.primary,
                                mr: 2,
                                fontSize: 20
                              }} />
                              <Typography variant="h6" sx={{
                                color: THEME.textPrimary,
                                fontWeight: 600
                              }}>
                                Transcription
                              </Typography>
                            </Box>
                            <Paper sx={{
                              p: 2,
                              background: THEME.surface,
                              border: `1px solid ${THEME.borderLight}`,
                              borderRadius: 2,
                              flex: 1,
                              overflow: 'auto',
                              maxHeight: 300
                            }}>
                              <Typography variant="body2" sx={{
                                color: THEME.textPrimary,
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                fontSize: '0.875rem'
                              }}>
                                {selectedResult.transcription?.text || 'No transcription available'}
                              </Typography>
                            </Paper>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Summary */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{
                          background: THEME.surfaceElevated,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm,
                          height: '100%'
                        }}>
                          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Description sx={{
                                color: THEME.accent,
                                mr: 2,
                                fontSize: 20
                              }} />
                              <Typography variant="h6" sx={{
                                color: THEME.textPrimary,
                                fontWeight: 600
                              }}>
                                Summary
                              </Typography>
                            </Box>
                            <Paper sx={{
                              p: 2,
                              background: THEME.surface,
                              border: `1px solid ${THEME.borderLight}`,
                              borderRadius: 2,
                              flex: 1,
                              overflow: 'auto',
                              maxHeight: 300
                            }}>
                              <Typography variant="body2" sx={{
                                color: THEME.textPrimary,
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                fontSize: '0.875rem'
                              }}>
                                {selectedResult.summarization?.summary || 'No summary available'}
                              </Typography>
                            </Paper>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Translation */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{
                          background: THEME.surfaceElevated,
                          border: `1px solid ${THEME.border}`,
                          borderRadius: 3,
                          boxShadow: THEME.shadowSm,
                          height: '100%'
                        }}>
                          <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Description sx={{
                                color: THEME.success,
                                mr: 2,
                                fontSize: 20
                              }} />
                              <Typography variant="h6" sx={{
                                color: THEME.textPrimary,
                                fontWeight: 600
                              }}>
                                Translation
                              </Typography>
                            </Box>
                            <Paper sx={{
                              p: 2,
                              background: THEME.surface,
                              border: `1px solid ${THEME.borderLight}`,
                              borderRadius: 2,
                              flex: 1,
                              overflow: 'auto',
                              maxHeight: 300
                            }}>
                              <Typography variant="body2" sx={{
                                color: THEME.textPrimary,
                                whiteSpace: 'pre-wrap',
                                lineHeight: 1.6,
                                fontSize: '0.875rem'
                              }}>
                                {selectedResult.translation?.translated_text || 'No translation available'}
                              </Typography>
                            </Paper>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{
            px: 3,
            py: 2,
            background: THEME.surface,
            borderTop: `1px solid ${THEME.border}`
          }}>
            <Button
              onClick={() => setResultDialogOpen(false)}
              variant="outlined"
              sx={{
                borderColor: THEME.border,
                color: THEME.textSecondary,
                borderRadius: 2,
                px: 4,
                fontWeight: 500,
                '&:hover': {
                  borderColor: THEME.textSecondary,
                  color: THEME.textPrimary,
                  background: `${THEME.textSecondary}08`
                }
              }}
            >
              Close Report
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Dealer Dialog */}
        <Dialog
          open={createDealerOpen}
          onClose={() => setCreateDealerOpen(false)}
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
            Create New Dealership
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {createDealerError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setCreateDealerError('')}>
                {createDealerError}
              </Alert>
            )}

            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Dealer ID"
                value={createDealerForm.dealer_id}
                onChange={(e) => setCreateDealerForm({ ...createDealerForm, dealer_id: e.target.value })}
                required
                helperText="Unique identifier for this dealership (e.g., 'bmw-kun')"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: THEME.textSecondary }} />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth
                label="Showroom Name"
                value={createDealerForm.showroom_name}
                onChange={(e) => setCreateDealerForm({ ...createDealerForm, showroom_name: e.target.value })}
                required
                helperText="Full name of the dealership"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: THEME.textSecondary }} />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, bgcolor: THEME.surface, borderTop: `1px solid ${THEME.border}` }}>
            <Button 
              onClick={() => setCreateDealerOpen(false)}
              sx={{ color: THEME.textSecondary, fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDealerSubmit}
              variant="contained"
              disabled={!createDealerForm.dealer_id || !createDealerForm.showroom_name}
              sx={{
                background: THEME.gradientPrimary,
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                boxShadow: THEME.shadowSm,
                '&:hover': {
                  boxShadow: THEME.shadowMd,
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Create Dealer
            </Button>
          </DialogActions>
        </Dialog>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Container>
    </Box>

  );

}