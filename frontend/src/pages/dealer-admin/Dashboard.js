import React, { useEffect, useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Container,
  Alert,
  Snackbar,
  ContentCopy,
  Link,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  VideoLibrary,
  Group,
  EmojiEvents,
  Timeline,
  PieChart,
  BarChart,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  OpenInNew,
  Mic,
  Videocam,
  Assessment,
  Schedule,
  Person
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend, ComposedChart, LabelList, ReferenceLine } from 'recharts';
import { dashboardApi } from '../../services/dashboardapi';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';


export default function DealerAdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalVideos: 0,
      averageScore: 0,
      serviceAdvisors: 0,
      completionRate: 0
    },
    dailyPerformance: [],
    serviceAdvisors: [],
    qualityBreakdown: [],
    recentVideos: [],
    performanceTrend: []
  });
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [error, setError] = useState(null);
  const { user: authUser } = useContext(AuthContext);
  const [dealerInfo, setDealerInfo] = useState({

    name: 'Loading...',
    location: 'Loading...'
  });

  const theme = useTheme();
  
  const THEME = {
    primary: '#0DA1B8',
    primaryDark: '#0C587D',
    primaryLight: '#3BC5D9',
    primaryUltraLight: theme.palette.mode === 'dark' ? 'rgba(13, 161, 184, 0.1)' : '#F0FDFA',
    accent: '#00B4DB',
    accentLight: '#E0F2FE',
    accentUltraLight: theme.palette.mode === 'dark' ? 'rgba(0, 180, 219, 0.1)' : '#F8FAFC',
    background: theme.palette.background.default,
    surface: theme.palette.background.paper,
    surfaceElevated: theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF',
    border: theme.palette.mode === 'dark' ? '#334155' : '#E2E8F0',
    borderLight: theme.palette.mode === 'dark' ? '#1E293B' : '#F1F5F9',
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    textTertiary: theme.palette.mode === 'dark' ? '#64748B' : '#94A3B8',
    success: theme.palette.success.main,
    successLight: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : '#D1FAE5',
    warning: theme.palette.warning.main,
    warningLight: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : '#FEF3C7',
    error: theme.palette.error.main,
    errorLight: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#FEE2E2',
    gradientPrimary: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    gradientAccent: 'linear-gradient(135deg, #0DA1B8 0%, #0C587D 100%)',
    gradientSuccess: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  };

  const CHART_COLORS = {
    primary: THEME.primary,
    success: THEME.success,
    warning: THEME.warning,
    error: THEME.error,
    accent: THEME.accent,
    qualityGradient: [THEME.success, THEME.primary, THEME.warning, THEME.error]
  };

  const DealerStatCard = ({ title, value, change, changeType, icon, color, subtitle, onClick }) => (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      borderRadius: 4,
      boxShadow: '0 10px 30px -10px rgba(28, 105, 212, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'visible',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`
      },
      '&:hover': {
        boxShadow: `0 20px 40px -12px ${color}30`,
        transform: 'translateY(-4px)',
        cursor: onClick ? 'pointer' : 'default',
        '&::before': {
          background: `linear-gradient(90deg, transparent, ${color}80, transparent)`
        }
      },
      height: '100%'
    }} onClick={onClick}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{
              color: THEME.textSecondary,
              fontWeight: 600,
              mb: 1,
              fontSize: '0.875rem'
            }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{
              color: THEME.textPrimary,
              fontWeight: 700,
              mb: 1,
              lineHeight: 1.2
            }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{
                color: THEME.textTertiary,
                display: 'block',
                mb: 1
              }}>
                {subtitle}
              </Typography>
            )}
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {changeType === 'positive' ? (
                  <ArrowUpward sx={{ fontSize: 16, color: THEME.success, mr: 0.5 }} />
                ) : changeType === 'negative' ? (
                  <ArrowDownward sx={{ fontSize: 16, color: THEME.error, mr: 0.5 }} />
                ) : null}
                <Typography variant="caption" sx={{
                  color: changeType === 'positive' ? THEME.success
                    : changeType === 'negative' ? THEME.error
                      : THEME.textTertiary,
                  fontWeight: 600
                }}>
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {React.cloneElement(icon, {
              sx: { fontSize: 24, color: color }
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
  // Add this component near your other chart components in dealer-admin dashboard
  // Modern Pie Chart for Advisor Distribution
  const ServiceAdvisorPieChart = ({ data = [] }) => {
    // Process data for Pie Chart (use video count)
    const chartData = (data || []).map((advisor) => ({
      name: advisor.name || 'Unknown',
      value: Number(advisor.videos || 0)
    })).sort((a, b) => b.value - a.value);

    // Modern color palette
    const PIE_COLORS = [
      THEME.primary,
      THEME.accent,
      THEME.success,
      '#6366F1', // Indigo
      '#8B5CF6', // Violet
      '#EC4899', // Pink
      '#F97316', // Orange
      '#14B8A6', // Teal
    ];

    return (
      <Box sx={{ mt: 3, height: 400, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={PIE_COLORS[index % PIE_COLORS.length]} 
                  stroke="none"
                />
              ))}
            </Pie>
            <RechartsTooltip 
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${THEME.border}`,
                borderRadius: 12,
                boxShadow: THEME.shadowLg
              }}
              formatter={(value, name) => [`${value} Videos`, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              formatter={(value, entry) => (
                <span style={{ color: THEME.textPrimary, fontWeight: 500, fontSize: '13px' }}>
                  {value}
                </span>
              )}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
        {/* Center Label */}
        <Box sx={{
          position: 'absolute',
          top: '44%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <Typography variant="h4" sx={{ color: THEME.primary, fontWeight: 800, lineHeight: 1 }}>
            {chartData.reduce((acc, curr) => acc + curr.value, 0)}
          </Typography>
          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
            Total Videos
          </Typography>
        </Box>
      </Box>
    );
  };


  // Service Advisor Card
  const ServiceAdvisorCard = ({ advisor, rank }) => (
    <Card sx={{
      background: THEME.surfaceElevated,
      border: `1px solid ${THEME.border}`,
      borderRadius: 2,
      boxShadow: THEME.shadowSm,
      mb: 1.5,
      height: '100%',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: THEME.shadowMd,
        transform: 'translateY(-2px)'
      }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* Rank Badge */}
            <Box sx={{
              width: 32,
              height: 32,
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
              flexShrink: 0,
              boxShadow: THEME.shadowMd
            }}>
              {rank}
            </Box>

            {/* Advisor Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  {advisor.videos} video{advisor.videos !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Overall Score */}
          <Box sx={{ textAlign: 'center', minWidth: 70, background: THEME.primaryUltraLight, borderRadius: 3, p: 1.5, border: `1px solid ${THEME.border}` }}>
            <Typography variant="h6" sx={{ color: THEME.primary, fontWeight: 700, lineHeight: 1, mb: 0.5 }}>
              {advisor.score.toFixed(1)}
            </Typography>
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '0.7rem' }}>
              Overall
            </Typography>
          </Box>
        </Box>

        {/* Progress Bars */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80 }}>
              <Videocam sx={{ fontSize: 16, color: THEME.primary, mr: 1 }} />
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>Video</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={advisor.videoScore * 10}
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
              fontWeight: 600,
              fontSize: '0.8rem'
            }}>
              {advisor.videoScore.toFixed(1)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80 }}>
              <Mic sx={{ fontSize: 16, color: THEME.accent, mr: 1 }} />
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>Audio</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={advisor.audioScore * 10}
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
              fontWeight: 600,
              fontSize: '0.8rem'
            }}>
              {advisor.audioScore.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Daily Performance Line Chart
  const DailyPerformanceChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={THEME.borderLight} />
        <XAxis
          dataKey="name"
          stroke={THEME.textSecondary}
          fontSize={12}
        />
        <YAxis
          stroke={THEME.textSecondary}
          fontSize={12}
          domain={[0, 10]}
        />
        <RechartsTooltip
          contentStyle={{
            background: THEME.background,
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            boxShadow: THEME.shadowMd
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke={THEME.primary}
          strokeWidth={3}
          dot={{ fill: THEME.primary, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: THEME.primary }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const ServiceAdvisorPerformanceChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={THEME.borderLight} />
        <XAxis
          dataKey="name"
          stroke={THEME.textSecondary}
          fontSize={11}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke={THEME.textSecondary}
          fontSize={12}
          domain={[0, 10]}
        />
        <RechartsTooltip
          contentStyle={{
            background: THEME.background,
            border: `1px solid ${THEME.border}`,
            borderRadius: 8,
            boxShadow: THEME.shadowMd
          }}
          formatter={(value, name) => {
            const labelMap = {
              'overall': 'Overall Score',
              'video': 'Video Quality',
              'audio': 'Audio Quality'
            };
            return [`${value}/10`, labelMap[name] || name];
          }}
        />
        <Legend />
        <Bar
          dataKey="overall"
          fill={THEME.primary}
          radius={[4, 4, 0, 0]}
          name="Overall Score"
        />
        <Bar
          dataKey="video"
          fill={THEME.accent}
          radius={[4, 4, 0, 0]}
          name="Video Quality"
        />
        <Bar
          dataKey="audio"
          fill={THEME.success}
          radius={[4, 4, 0, 0]}
          name="Audio Quality"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );

  const QualityBreakdownChart = ({ data }) => (
    <Box sx={{ height: 300, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS.qualityGradient[index % CHART_COLORS.qualityGradient.length]} />
            ))}
          </Pie>
          <RechartsTooltip 
             contentStyle={{ borderRadius: 12, border: `1px solid ${THEME.border}`, boxShadow: THEME.shadowMd }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );

  const MultidimensionalTrendChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.borderLight} />
        <XAxis dataKey="name" stroke={THEME.textTertiary} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 10]} stroke={THEME.textTertiary} fontSize={12} tickLine={false} axisLine={false} />
        <RechartsTooltip
          contentStyle={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${THEME.border}`,
            borderRadius: 12,
            boxShadow: THEME.shadowLg
          }}
        />
        <Legend verticalAlign="top" align="right" iconType="circle" />
        <Line type="monotone" dataKey="score" name="Overall" stroke={THEME.primary} strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="video" name="Video" stroke={THEME.accent} strokeWidth={2} strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="audio" name="Audio" stroke={THEME.success} strokeWidth={2} strokeDasharray="5 5" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
    const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let endpoint = '/dashboard/dealer/overview';
      if (timeRange && timeRange !== 'all') {
         endpoint += `?timeRange=${timeRange}`;
      }

      const response = await api.get(endpoint, { headers });
      const data = response.data;

      // Update dealer info
      setDealerInfo({
        name: authUser?.showroom_name || 'Your Dealership',
        location: 'Your Location',
        id: data.dealer_id || 'current'
      });
      
      const completionRate = data.total_videos_analyzed > 0 
          ? Math.round(((data.total_videos_analyzed - data.low_quality_video_count) / data.total_videos_analyzed) * 100)
          : 0;

      const qualityBreakdown = Object.entries(data.quality_distribution || {}).map(([name, value]) => ({ name, value }));

      setDashboardData({
        overview: {
          totalVideos: data.total_videos_analyzed || 0,
          averageScore: data.average_overall_quality || 0,
          serviceAdvisors: (data.serviceAdvisors || []).length,
          completionRate: completionRate
        },
        dailyPerformance: data.dailyPerformance || [],
        serviceAdvisors: data.serviceAdvisors || [],
        qualityBreakdown: qualityBreakdown,
        recentVideos: (data.recent_analyses || []).map((video, index) => ({
          id: video._id || video.id || `video-${index}`,
          vehicle: video.citnow_vehicle || video.vehicle || 'Unknown Vehicle',
          advisor: video.citnow_service_advisor || video.advisor || 'Unknown Advisor',
          score: typeof video.overall_quality_score === 'number'
            ? video.overall_quality_score.toFixed(1)
            : (typeof video.score === 'number' ? video.score.toFixed(1) : (video.score || '0.0')),
          date: video.created_at ? new Date(video.created_at).toLocaleDateString() : (video.date || 'N/A'),
          status: video.status === 'completed' ? 'Completed' : (video.status || 'In Progress')
        })),
        performanceTrend: data.serviceAdvisors || []
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };
  // Data processing functions
  const filterByTimeRange = (results, timeRange) => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    return results.filter(result => {
      const resultDate = new Date(result.created_at);
      return resultDate >= startDate && resultDate <= now;
    });
  };

  const calculateOverview = (filteredResults) => {
    const totalVideos = filteredResults.length;

    const validScores = filteredResults
      .filter(r => r.overall_quality_score != null)
      .map(r => r.overall_quality_score);

    const averageScore = validScores.length > 0
      ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
      : 0;

    const lowQualityVideos = filteredResults.filter(r =>
      ['Poor', 'Very Poor', 'Analysis Failed', 'Error'].includes(r.video_quality_label)
    ).length;

    const serviceAdvisors = new Set(
      filteredResults
        .filter(r => r.citnow_service_advisor)
        .map(r => r.citnow_service_advisor)
    ).size;

    const completionRate = totalVideos > 0
      ? Math.round(((totalVideos - lowQualityVideos) / totalVideos) * 100)
      : 0;

    return {
      totalVideos,
      averageScore: Math.round(averageScore * 10) / 10,
      serviceAdvisors,
      completionRate
    };
  };

  const calculateAdvisorPerformance = (filteredResults) => {
    const advisorMap = {};

    filteredResults.forEach(result => {
      const advisorName = result.citnow_service_advisor || 'Unknown Advisor';

      if (!advisorMap[advisorName]) {
        advisorMap[advisorName] = {
          name: advisorName,
          videos: 0,
          scores: [],
          videoScores: [],
          audioScores: []
        };
      }

      advisorMap[advisorName].videos++;

      if (result.overall_quality_score != null) {
        advisorMap[advisorName].scores.push(result.overall_quality_score);
      }
      if (result.video_quality_score != null) {
        advisorMap[advisorName].videoScores.push(result.video_quality_score);
      }
      if (result.audio_quality_score != null) {
        advisorMap[advisorName].audioScores.push(result.audio_quality_score);
      }
    });

    return Object.values(advisorMap).map(advisor => {
      const avgScore = advisor.scores.length > 0
        ? advisor.scores.reduce((sum, score) => sum + score, 0) / advisor.scores.length
        : 0;

      const avgVideoScore = advisor.videoScores.length > 0
        ? advisor.videoScores.reduce((sum, score) => sum + score, 0) / advisor.videoScores.length
        : 0;

      const avgAudioScore = advisor.audioScores.length > 0
        ? advisor.audioScores.reduce((sum, score) => sum + score, 0) / advisor.audioScores.length
        : 0;

      return {
        name: advisor.name,
        videos: advisor.videos,
        score: Math.round(avgScore * 10) / 10,
        videoScore: Math.round(avgVideoScore * 10) / 10,
        audioScore: Math.round(avgAudioScore * 10) / 10,
        overall: Math.round(avgScore * 10) / 10,
        video: Math.round(avgVideoScore * 10) / 10,
        audio: Math.round(avgAudioScore * 10) / 10
      };
    }).sort((a, b) => b.score - a.score);
  };

  const calculateQualityBreakdown = (filteredResults) => {
    const qualityCounts = {
      'Excellent': 0,
      'Very Good': 0,
      'Good': 0,
      'Fair': 0,
      'Poor': 0
    };

    filteredResults.forEach(result => {
      const label = result.overall_quality_label;
      if (label && qualityCounts.hasOwnProperty(label)) {
        qualityCounts[label]++;
      }
    });

    return Object.entries(qualityCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const calculateDailyPerformance = (filteredResults, timeRange) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyData = {};

    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 7;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dayKey = date.toDateString();
      const dayName = dayNames[date.getDay()];

      dailyData[dayKey] = {
        name: dayName,
        scores: [],
        videoScores: [],
        audioScores: [],
        count: 0
      };
    }

    filteredResults.forEach(result => {
      const resultDate = new Date(result.created_at);
      const dayKey = resultDate.toDateString();

      if (dailyData[dayKey]) {
        dailyData[dayKey].count++;
        if (result.overall_quality_score != null) {
          dailyData[dayKey].scores.push(result.overall_quality_score);
        }
        if (result.video_quality_score != null) {
          dailyData[dayKey].videoScores.push(result.video_quality_score);
        }
        if (result.audio_quality_score != null) {
          dailyData[dayKey].audioScores.push(result.audio_quality_score);
        }
      }
    });

    return Object.values(dailyData).map(day => ({
      name: day.name,
      score: day.scores.length > 0
        ? Math.round((day.scores.reduce((sum, score) => sum + score, 0) / day.scores.length) * 10) / 10
        : 0,
      video: day.videoScores.length > 0
        ? Math.round((day.videoScores.reduce((sum, score) => sum + score, 0) / day.videoScores.length) * 10) / 10
        : 0,
      audio: day.audioScores.length > 0
        ? Math.round((day.audioScores.reduce((sum, score) => sum + score, 0) / day.audioScores.length) * 10) / 10
        : 0,
      videos: day.count
    }));
  };

  // Main function to process all dashboard data

  const processDashboardData = (allResults, timeRange) => {
    // Ensure allResults is an array
    if (!Array.isArray(allResults)) {
      console.warn('processDashboardData: allResults is not an array:', allResults);
      allResults = [];
    }

    const filteredResults = filterByTimeRange(allResults, timeRange);

    return {
      overview: calculateOverview(filteredResults),
      serviceAdvisors: calculateAdvisorPerformance(filteredResults),
      qualityBreakdown: calculateQualityBreakdown(filteredResults),
      dailyPerformance: calculateDailyPerformance(filteredResults, timeRange),
      recentVideos: allResults.slice(0, 8).map((video, index) => ({
        id: video._id || `video-${index}`,
        vehicle: video.citnow_vehicle || 'Unknown Vehicle',
        advisor: video.citnow_service_advisor || 'Unknown Advisor',
        score: (video.overall_quality_score || 0).toFixed(1),
        date: new Date(video.created_at).toLocaleDateString(),
        status: video.status === 'completed' ? 'Completed' : 'In Progress'
      })),
      performanceTrend: calculateDailyPerformance(filteredResults, timeRange)
    };
  };

  useEffect(() => {
    loadDashboardData();
  }, [refreshCounter, timeRange]);

  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleViewDetails = (section) => {
    console.log(`View details for: ${section}`);
    // Implement navigation logic here
  };

  const handleViewAnalysis = (videoId) => {
    console.log(`View analysis: ${videoId}`);
    // Implement navigation to analysis detail page
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Calculate REAL trends by comparing current period vs previous period
  const calculateTrends = () => {
    if (!allResults || allResults.length === 0) {
      return {
        totalVideosChange: 'No data yet',
        totalVideosChangeType: 'neutral',
        averageScoreChange: 'No data yet',
        averageScoreChangeType: 'neutral'
      };
    }

    const now = new Date();
    let periodMs;
    let periodLabel;

    switch (timeRange) {
      case 'today':
        periodMs = 24 * 60 * 60 * 1000;
        periodLabel = 'vs yesterday';
        break;
      case 'week':
        periodMs = 7 * 24 * 60 * 60 * 1000;
        periodLabel = 'vs last week';
        break;
      case 'month':
        periodMs = 30 * 24 * 60 * 60 * 1000;
        periodLabel = 'vs last month';
        break;
      case 'quarter':
        periodMs = 90 * 24 * 60 * 60 * 1000;
        periodLabel = 'vs last quarter';
        break;
      default:
        periodMs = 7 * 24 * 60 * 60 * 1000;
        periodLabel = 'vs last week';
    }

    const currentStart = new Date(now.getTime() - periodMs);
    const previousStart = new Date(currentStart.getTime() - periodMs);

    const currentResults = allResults.filter(r => {
      const d = new Date(r.created_at);
      return d >= currentStart && d <= now;
    });

    const previousResults = allResults.filter(r => {
      const d = new Date(r.created_at);
      return d >= previousStart && d < currentStart;
    });

    // Video count trend
    const currentCount = currentResults.length;
    const previousCount = previousResults.length;
    const countDiff = currentCount - previousCount;

    let totalVideosChange;
    let totalVideosChangeType;
    if (previousCount === 0 && currentCount > 0) {
      totalVideosChange = `${currentCount} new ${periodLabel}`;
      totalVideosChangeType = 'positive';
    } else if (countDiff > 0) {
      totalVideosChange = `+${countDiff} ${periodLabel}`;
      totalVideosChangeType = 'positive';
    } else if (countDiff < 0) {
      totalVideosChange = `${countDiff} ${periodLabel}`;
      totalVideosChangeType = 'negative';
    } else {
      totalVideosChange = `No change ${periodLabel}`;
      totalVideosChangeType = 'neutral';
    }

    // Average score trend
    const currentScores = currentResults
      .filter(r => r.overall_quality_score != null)
      .map(r => r.overall_quality_score);
    const previousScores = previousResults
      .filter(r => r.overall_quality_score != null)
      .map(r => r.overall_quality_score);

    const currentAvg = currentScores.length > 0
      ? currentScores.reduce((a, b) => a + b, 0) / currentScores.length : 0;
    const previousAvg = previousScores.length > 0
      ? previousScores.reduce((a, b) => a + b, 0) / previousScores.length : 0;
    const scoreDiff = Math.round((currentAvg - previousAvg) * 10) / 10;

    let averageScoreChange;
    let averageScoreChangeType;
    if (previousScores.length === 0 && currentScores.length > 0) {
      averageScoreChange = `${currentAvg.toFixed(1)} avg ${periodLabel}`;
      averageScoreChangeType = 'positive';
    } else if (scoreDiff > 0) {
      averageScoreChange = `+${scoreDiff.toFixed(1)} ${periodLabel}`;
      averageScoreChangeType = 'positive';
    } else if (scoreDiff < 0) {
      averageScoreChange = `${scoreDiff.toFixed(1)} ${periodLabel}`;
      averageScoreChangeType = 'negative';
    } else {
      averageScoreChange = `No change ${periodLabel}`;
      averageScoreChangeType = 'neutral';
    }

    return {
      totalVideosChange,
      totalVideosChangeType,
      averageScoreChange,
      averageScoreChangeType
    };
  };

  const trends = calculateTrends();



  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: { xs: 1, sm: 2 },
        backgroundColor: '#F5FAFF',
        backgroundImage: `radial-gradient(circle at 0% 0%, ${THEME.primaryUltraLight} 0, transparent 55%),
                          radial-gradient(circle at 100% 0%, ${THEME.accentUltraLight} 0, transparent 55%)`,
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.75), rgba(255,255,255,0.9))',
          opacity: theme.palette.mode === 'dark' ? 0.02 : 0.3,
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="xl">
        {/* Error Snackbar */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              letterSpacing: '-1.5px',
              color: THEME.textPrimary,
              mb: 1.5,
              background: THEME.gradientPrimary,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 12px rgba(28,105,212,0.15))'
            }}
          >
            Dealer Performance
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: THEME.textSecondary,
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              mb: 3
            }}
          >
            Monitor your dealership's performance metrics, track service advisor progress,
            and optimize customer service quality in real-time.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                background: THEME.gradientPrimary,
                borderRadius: 3,
                px: 4,
                py: 1.2,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 8px 20px -6px rgba(28, 105, 212, 0.5)',
                '&:hover': {
                  boxShadow: '0 12px 25px -6px rgba(28, 105, 212, 0.6)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Refresh Data
            </Button>
          </Box>

          {/* Time Range Tabs - Centered */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Paper sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: 50,
              display: 'inline-flex',
              p: 0.75,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
              gap: 0.5
            }}>
              {['today', 'week', 'month', 'quarter'].map((range) => {
                const isActive = timeRange === range;
                return (
                  <Button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    sx={{
                      borderRadius: 50,
                      px: 4,
                      py: 1,
                      fontWeight: isActive ? 700 : 600,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      color: isActive ? THEME.primary : THEME.textSecondary,
                      background: isActive ? '#FFFFFF' : 'transparent',
                      boxShadow: isActive ? '0 4px 12px rgba(28, 105, 212, 0.12)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
                        color: THEME.primary,
                      }
                    }}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </Button>
                );
              })}
            </Paper>
          </Box>
        </Box>

        {/* Performance Overview Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{
            color: THEME.textPrimary,
            fontWeight: 800,
            letterSpacing: '-1px',
            mb: 1
          }}>
            Performance Overview
          </Typography>
          <Typography variant="body1" sx={{
            color: THEME.textSecondary,
            mb: 4,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Key metrics and performance indicators for your dealership
          </Typography>

          {/* Overview Stats - Dealer Focused */}
          <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <DealerStatCard
                title="Total Videos"
                value={dashboardData.overview.totalVideos}
                change={trends.totalVideosChange}
                changeType={trends.totalVideosChangeType || 'positive'}
                icon={<VideoLibrary />}
                color={THEME.primary}
                onClick={() => handleViewDetails('videos')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DealerStatCard
                title="Average Quality Score"
                value={dashboardData.overview.averageScore.toFixed(1)}
                change={trends.averageScoreChange}
                changeType={trends.averageScoreChangeType || 'positive'}
                icon={<Star />}
                color={THEME.warning}
                subtitle="out of 10"
                onClick={() => handleViewDetails('quality')}
              />
            </Grid>


          </Grid>
        </Box>

        {/* Analytics & Insights Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{
            color: THEME.textPrimary,
            fontWeight: 800,
            letterSpacing: '-1px',
            mb: 1
          }}>
            Analytics & Insights
          </Typography>
          <Typography variant="body1" sx={{
            color: THEME.textSecondary,
            mb: 4,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Detailed performance analysis and team insights
          </Typography>

          {/* CitNOW Brand Colors */}
          {(() => {
            const CN = {
              navy: '#1C3FAA',
              navyLight: '#EEF2FF',
              gold: '#F5B800',
              goldLight: '#FFFBEB',
              orange: '#FF6600',
              orangeLight: '#FFF0E6',
              grid: '#E8EDF5',
            };
            return (
              <Grid container spacing={3} sx={{ mt: 1 }}>

                {/* Chart 1: Quality Score Trend — Navy Blue */}
                <Grid item xs={12} sm={6} sx={{ minWidth: 0, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                  <Card sx={{ background: '#fff', border: `1.5px solid ${CN.navyLight}`, borderRadius: 3, boxShadow: '0 4px 20px rgba(28,63,170,0.08)', height: 430, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 2.5, pb: '20px !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, position: 'relative', minHeight: 32 }}>
                        <Box sx={{ width: 5, height: 28, borderRadius: 2, bgcolor: CN.navy, position: 'absolute', left: 0 }} />
                        <Typography variant="h6" sx={{ color: CN.navy, fontWeight: 700, textAlign: 'center' }}>Quality Score Trend</Typography>
                        <Chip label={timeRange} size="small" sx={{ position: 'absolute', right: 0, bgcolor: CN.navyLight, color: CN.navy, fontWeight: 700, textTransform: 'capitalize', border: `1px solid ${CN.navy}30` }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2.5, textAlign: 'center' }}>
                        Daily average quality ratings for overall, video, and audio (out of 10)
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 3, mb: 2.5, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Overall Avg</Typography>
                          <Typography variant="h5" sx={{ color: CN.navy, fontWeight: 800, lineHeight: 1.2 }}>
                            {dashboardData.overview.averageScore.toFixed(1)}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Avg Video</Typography>
                          <Typography variant="h5" sx={{ color: CN.gold, fontWeight: 800, lineHeight: 1.2 }}>
                            {(dashboardData.dailyPerformance.reduce((acc, d) => acc + (d.video || 0), 0) / Math.max(dashboardData.dailyPerformance.filter(d => d.video > 0).length, 1)).toFixed(1)}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Avg Audio</Typography>
                          <Typography variant="h5" sx={{ color: THEME.success, fontWeight: 800, lineHeight: 1.2 }}>
                            {(dashboardData.dailyPerformance.reduce((acc, d) => acc + (d.audio || 0), 0) / Math.max(dashboardData.dailyPerformance.filter(d => d.audio > 0).length, 1)).toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={dashboardData.dailyPerformance} margin={{ top: 12, right: 24, left: -20, bottom: 12 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CN.grid} />
                          <XAxis dataKey="name" stroke={THEME.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 10]} stroke={THEME.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: 10, border: `1px solid ${CN.navy}30`, boxShadow: '0 8px 24px rgba(28,63,170,0.12)' }} 
                            formatter={(v, n) => [`${v}/10`, n === 'score' ? 'Overall Quality' : n === 'video' ? 'Video Quality' : 'Audio Quality']} 
                          />
                          <Legend iconType="circle" verticalAlign="top" height={36}/>
                          <Line type="monotone" dataKey="score" name="Overall Quality" stroke={CN.navy} strokeWidth={3} dot={{ r: 4, fill: CN.navy, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: CN.orange }} />
                          <Line type="monotone" dataKey="video" name="Video Quality" stroke={CN.gold} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: CN.gold, stroke: '#fff', strokeWidth: 1 }} />
                          <Line type="monotone" dataKey="audio" name="Audio Quality" stroke={THEME.success} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: THEME.success, stroke: '#fff', strokeWidth: 1 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Chart 2: Videos Uploaded Trend — Golden Yellow */}
                <Grid item xs={12} sm={6} sx={{ minWidth: 0, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                  <Card sx={{ background: '#fff', border: `1.5px solid ${CN.goldLight}`, borderRadius: 3, boxShadow: '0 4px 20px rgba(245,184,0,0.10)', height: 430, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 2.5, pb: '20px !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, position: 'relative', minHeight: 32 }}>
                        <Box sx={{ width: 5, height: 28, borderRadius: 2, bgcolor: CN.gold, position: 'absolute', left: 0 }} />
                        <Typography variant="h6" sx={{ color: '#7A5A00', fontWeight: 700, textAlign: 'center' }}>Videos Uploaded Trend</Typography>
                        <Chip label={timeRange} size="small" sx={{ position: 'absolute', right: 0, bgcolor: CN.goldLight, color: '#7A5A00', fontWeight: 700, textTransform: 'capitalize', border: `1px solid ${CN.gold}60` }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2.5, textAlign: 'center' }}>
                        Number of videos submitted for analysis per day
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 4, mb: 2.5, alignItems: 'center', justifyContent: 'center' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Total Videos</Typography>
                          <Typography variant="h5" sx={{ color: CN.gold, fontWeight: 800, lineHeight: 1.2 }}>
                            {dashboardData.overview.totalVideos}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Busiest Day</Typography>
                          <Typography variant="h5" sx={{ color: CN.navy, fontWeight: 800, lineHeight: 1.2 }}>
                            {Math.max(...(dashboardData.dailyPerformance.map(d => d.videos) || [0]), 0)}
                          </Typography>
                        </Box>
                      </Box>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsBarChart data={dashboardData.dailyPerformance} margin={{ top: 12, right: 24, left: -20, bottom: 12 }} barSize={28}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CN.grid} />
                          <XAxis dataKey="name" stroke={THEME.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke={THEME.textTertiary} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                          <RechartsTooltip contentStyle={{ borderRadius: 10, border: `1px solid ${CN.gold}40`, boxShadow: '0 8px 24px rgba(245,184,0,0.15)' }} formatter={(v) => [v, 'Videos']} />
                          <Bar dataKey="videos" fill={CN.gold} radius={[6, 6, 0, 0]} name="Videos" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Chart 3: Advisor Performance Trend — Orange */}
                <Grid item xs={12} sm={6} sx={{ minWidth: 0, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                  <Card sx={{ background: '#fff', border: `1.5px solid ${CN.orangeLight}`, borderRadius: 3, boxShadow: '0 4px 20px rgba(255,102,0,0.08)', height: 430, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 2.5, pb: '20px !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, position: 'relative', minHeight: 32 }}>
                        <Box sx={{ width: 5, height: 28, borderRadius: 2, bgcolor: CN.orange, position: 'absolute', left: 0 }} />
                        <Typography variant="h6" sx={{ color: '#7A2E00', fontWeight: 700, textAlign: 'center' }}>Advisor Performance Trend</Typography>
                        <Chip label="Top 6" size="small" sx={{ position: 'absolute', right: 0, bgcolor: CN.orangeLight, color: '#7A2E00', fontWeight: 700, border: `1px solid ${CN.orange}50` }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2.5, textAlign: 'center' }}>
                        Overall quality score per service advisor (top 6 by rank)
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 4, mb: 2.5, alignItems: 'center', justifyContent: 'center' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Advisors</Typography>
                          <Typography variant="h5" sx={{ color: CN.orange, fontWeight: 800, lineHeight: 1.2 }}>
                            {dashboardData.serviceAdvisors.length}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Top Score</Typography>
                          <Typography variant="h5" sx={{ color: CN.navy, fontWeight: 800, lineHeight: 1.2 }}>
                            {(dashboardData.serviceAdvisors[0]?.score || 0).toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                      <ResponsiveContainer width="100%" height={200}>
                        <RechartsBarChart
                          data={dashboardData.serviceAdvisors.slice(0, 6).map(a => ({ name: a.name.split(',')[0].split(' ')[0], score: a.score }))}
                          margin={{ top: 12, right: 24, left: -20, bottom: 12 }}
                          barSize={22}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CN.grid} />
                          <XAxis dataKey="name" stroke={THEME.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 10]} stroke={THEME.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                          <RechartsTooltip contentStyle={{ borderRadius: 10, border: `1px solid ${CN.orange}30`, boxShadow: '0 8px 24px rgba(255,102,0,0.12)' }} formatter={(v, n) => [`${v}/10`, n]} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="score" name="Overall Score" fill={CN.orange} radius={[5, 5, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Chart 4: Audio vs Video — Navy + Gold (logo gradient pair) */}
                <Grid item xs={12} sm={6} sx={{ minWidth: 0, flexBasis: { xs: '100%', sm: 'calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                  <Card sx={{ background: '#fff', border: `1.5px solid #EEF2FF`, borderRadius: 3, boxShadow: '0 4px 20px rgba(28,63,170,0.07)', height: 430, width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 2.5, pb: '20px !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, position: 'relative', minHeight: 32 }}>
                        <Box sx={{ width: 5, height: 28, borderRadius: 2, background: `linear-gradient(180deg, ${CN.gold} 0%, ${CN.orange} 100%)`, position: 'absolute', left: 0 }} />
                        <Typography variant="h6" sx={{ color: CN.navy, fontWeight: 700, textAlign: 'center' }}>Audio / Video Improvement</Typography>
                        <Chip label={timeRange} size="small" sx={{ position: 'absolute', right: 0, bgcolor: CN.navyLight, color: CN.navy, fontWeight: 700, textTransform: 'capitalize', border: `1px solid ${CN.navy}30` }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2.5, textAlign: 'center' }}>
                        Compare audio quality vs video quality over each day
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 4, mb: 2.5, alignItems: 'center', justifyContent: 'center' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Avg Audio</Typography>
                          <Typography variant="h5" sx={{ color: CN.navy, fontWeight: 800, lineHeight: 1.2 }}>
                            {(dashboardData.dailyPerformance.reduce((acc, d) => acc + (d.audio || 0), 0) / Math.max(dashboardData.dailyPerformance.filter(d => d.audio > 0).length, 1)).toFixed(1)}
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                          <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>Avg Video</Typography>
                          <Typography variant="h5" sx={{ color: CN.gold, fontWeight: 800, lineHeight: 1.2 }}>
                            {(dashboardData.dailyPerformance.reduce((acc, d) => acc + (d.video || 0), 0) / Math.max(dashboardData.dailyPerformance.filter(d => d.video > 0).length, 1)).toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={dashboardData.dailyPerformance} margin={{ top: 12, right: 24, left: -20, bottom: 12 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CN.grid} />
                          <XAxis dataKey="name" stroke={THEME.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis domain={[0, 10]} stroke={THEME.textTertiary} fontSize={11} tickLine={false} axisLine={false} />
                          <RechartsTooltip contentStyle={{ borderRadius: 10, border: `1px solid ${CN.navy}20`, boxShadow: '0 8px 24px rgba(28,63,170,0.10)' }} formatter={(v, n) => [`${v}/10`, n]} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                          <Line type="monotone" dataKey="audio" name="Audio" stroke={CN.navy} strokeWidth={3} dot={{ r: 4, fill: CN.navy, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="video" name="Video" stroke={CN.gold} strokeWidth={3} strokeDasharray="6 3" dot={{ r: 4, fill: CN.gold, stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            );
          })()}

        </Box>

        {/* Recent Activity Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{
            color: THEME.textPrimary,
            fontWeight: 600,
            mb: 1
          }}>
            Recent Activity
          </Typography>
          <Typography variant="body1" sx={{
            color: THEME.textSecondary,
            mb: 4,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Latest video analyses and service records
          </Typography>

          {/* Recent Videos Table */}
          <Card sx={{
            background: THEME.surfaceElevated,
            border: `1px solid ${THEME.border}`,
            borderRadius: 3,
            boxShadow: THEME.shadowSm
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ color: THEME.primary, mr: 2, fontSize: 24 }} />
                  <Typography variant="h6" sx={{
                    color: THEME.textPrimary,
                    fontWeight: 600
                  }}>
                    Recent Video Analyses
                  </Typography>
                </Box>

              </Box>

              <TableContainer>
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
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Service Advisor</TableCell>
                      <TableCell align="center">Quality Score</TableCell>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Status</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentVideos.map((video) => (
                      <TableRow
                        key={video.id}
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
                          <Typography variant="body2" sx={{
                            color: THEME.textPrimary,
                            fontWeight: 600
                          }}>
                            {video.vehicle}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{
                            color: THEME.textPrimary
                          }}>
                            {video.advisor}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={video.score}
                            size="small"
                            sx={{
                              background:
                                parseFloat(video.score) >= 8.5 ? THEME.successLight :
                                  parseFloat(video.score) >= 7 ? THEME.primaryUltraLight :
                                    parseFloat(video.score) >= 5 ? THEME.warningLight :
                                      THEME.errorLight,
                              color:
                                parseFloat(video.score) >= 8.5 ? THEME.success :
                                  parseFloat(video.score) >= 7 ? THEME.primary :
                                    parseFloat(video.score) >= 5 ? THEME.warning :
                                      THEME.error,
                              fontWeight: 700
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            color: THEME.textPrimary
                          }}>
                            {video.date}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={video.status}
                            size="small"
                            variant={video.status === 'Completed' ? 'filled' : 'outlined'}
                            color={video.status === 'Completed' ? 'success' : 'warning'}
                          />
                        </TableCell>

                      </TableRow>
                    ))}
                    {dashboardData.recentVideos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: THEME.textTertiary }}>
                            No recent video analyses found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

      </Container>
    </Box>
  );
}
