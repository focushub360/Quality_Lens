import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Fade,
  Container,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  TablePagination,
  MenuItem,
  InputAdornment,
  CardActionArea,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Business,
  Star,
  VideoLibrary,
  Group,
  EmojiEvents,
  Analytics,
  Timeline,
  TableChart,
  PieChart,
  BarChart,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  OpenInNew,
  Visibility,
  ArrowBack,
  DirectionsCar,
  Score,
  Mic,
  Description,
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
  FilterList,
  MoreVert,
  Badge,
  CompareArrows,
  SwapHoriz,
  ExpandMore
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Treemap,
  ComposedChart,
  LabelList,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import api from '../../services/api';
import { listUsers, createUser, updateUser, deleteUser } from '../../services/users.js';
import { listDealerUsers, getDealerUserStats } from '../../services/dealer_user.js';
// QualityLens Dashboard Theme
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
  gradientWarning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Chart color schemes
const CHART_COLORS = {
  primary: THEME.primary,
  success: THEME.success,
  warning: THEME.warning,
  error: THEME.error,
  accent: THEME.accent,
  blueGradient: ['#1C69D4', '#4D8FDF', '#7AB6FF'],
  qualityGradient: [THEME.success, THEME.primary, THEME.warning, THEME.error]
};

// Custom Chart Components
const PerformanceTrendChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={THEME.borderLight} />
      <XAxis
        dataKey="name"
        stroke={THEME.textSecondary}
        fontSize={11}
        angle={-35}
        textAnchor="end"
        height={45}
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
      <Line
        type="monotone"
        dataKey="overall"
        stroke={THEME.primary}
        strokeWidth={3}
        dot={{ fill: THEME.primary, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, fill: THEME.primary }}
        name="Overall Score"
      />
      <Line
        type="monotone"
        dataKey="video"
        stroke={THEME.accent}
        strokeWidth={2}
        strokeDasharray="3 3"
        dot={{ fill: THEME.accent, r: 3 }}
        name="Video Quality"
      />
      <Line
        type="monotone"
        dataKey="audio"
        stroke={THEME.success}
        strokeWidth={2}
        strokeDasharray="3 3"
        dot={{ fill: THEME.success, r: 3 }}
        name="Audio Quality"
      />
    </LineChart>
  </ResponsiveContainer>
);

const DealerPerformanceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="body2" sx={{ color: "#999" }}>
          No dealer performance data available
        </Typography>
      </Box>
    );
  }

  // Colors for each dealer matching exact FOCUS brand logo palette
  const DEALER_COLORS = ['#1E2265', '#0096C7', '#D91B82', '#00C9A7', '#F59E0B', '#7C4DFF'];

  // Helper to extract real live metric scores directly from database data
  const getLiveMetric = (d, key) => {
    if (d[key] != null && typeof d[key] === 'number') return Number(d[key].toFixed(1));
    if (key === 'video') return Number((d.video ?? d.video_quality ?? d.overall ?? 0).toFixed(1));
    if (key === 'audio') return Number((d.audio ?? d.audio_quality ?? d.overall ?? 0).toFixed(1));
    return Number((d.overall || 0).toFixed(1));
  };

  // Build radar data: 6 metric axes for a 6-point spider chart (Overall, Video, Audio, Stability, Lighting, Speech)
  const radarData = [
    {
      metric: 'Overall',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, getLiveMetric(d, 'overall')]))
    },
    {
      metric: 'Video',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, getLiveMetric(d, 'video')]))
    },
    {
      metric: 'Audio',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, getLiveMetric(d, 'audio')]))
    },
    {
      metric: 'Stability',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, getLiveMetric(d, 'stability')]))
    },
    {
      metric: 'Lighting',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, getLiveMetric(d, 'lighting')]))
    },
    {
      metric: 'Speech',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, getLiveMetric(d, 'speech')]))
    }
  ];

  const avgScore = (
    data.reduce((sum, d) => sum + d.overall, 0) / data.length
  ).toFixed(1);

  // Custom tooltip
  const CustomRadarTooltip = ({ active, payload, label }) => {
    const labelMap = {
      'Overall': 'Overall Score',
      'Video': 'Video Quality',
      'Audio': 'Audio Quality',
      'Stability': 'Stability',
      'Lighting': 'Lighting',
      'Speech': 'Speech & Clarity'
    };

    if (active && payload && payload.length) {
      return (
        <Box sx={{
          background: 'rgba(255,255,255,0.96)',
          borderRadius: 2,
          p: 1.5,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: `1px solid ${THEME.border}`,
          minWidth: 140
        }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 0.5 }}>
            {labelMap[label] || label}
          </Typography>
          {payload.map((entry, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 0.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontSize: '11px' }}>
                  {entry.name}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: entry.color, fontSize: '11px' }}>
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Title */}
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Dealer Performance Ranking
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
        Spider Chart — Quality Scores
      </Typography>

      {/* Summary Stats */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2.5,
        mb: 1.5,
        width: '100%',
        minHeight: 46
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.25 }}>
            <TrendingUp sx={{ fontSize: 15, color: THEME.success, mr: 0.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: THEME.success, fontSize: '0.95rem' }}>
              {Math.max(...data.map(d => d.overall)).toFixed(1)}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '10px' }}>
            TOP SCORE
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.25 }}>
            <Star sx={{ fontSize: 15, color: THEME.warning, mr: 0.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: THEME.warning, fontSize: '0.95rem' }}>
              {avgScore}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '10px' }}>
            AVG SCORE
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.25 }}>
            <Business sx={{ fontSize: 15, color: THEME.primary, mr: 0.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: THEME.primary, fontSize: '0.95rem' }}>
              {data.length}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '10px' }}>
            DEALERS
          </Typography>
        </Box>
      </Box>

      {/* Radar / Spider Chart */}
      <ResponsiveContainer width="100%" height={290}>
        <RadarChart data={radarData} outerRadius="54%" margin={{ top: 10, right: 25, bottom: 10, left: 25 }}>
          <PolarGrid stroke={THEME.border} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 10.5, fontWeight: 600, fill: THEME.textSecondary }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fontSize: 9.5, fill: THEME.textTertiary }}
            axisLine={false}
          />
          {data.map((dealer, i) => (
            <Radar
              key={dealer.name}
              name={dealer.name}
              dataKey={dealer.name}
              stroke={DEALER_COLORS[i % DEALER_COLORS.length]}
              fill={DEALER_COLORS[i % DEALER_COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
              dot={{ r: 3.5, fill: DEALER_COLORS[i % DEALER_COLORS.length] }}
            />
          ))}
          <RechartsTooltip content={<CustomRadarTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '4px' }}
            iconType="circle"
            iconSize={7}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ─── Single Dealer Detailed View ────────────────────────────────────────────
const SingleDealerDetailView = ({ dealerId, allResults, dealerRankings }) => {
  const dealerData = dealerRankings.find(d => d.id === dealerId || d.name === dealerId);
  if (!dealerData) return null;

  // Build metrics
  const metrics = [
    { name: 'Overall Score', value: dealerData.overall, color: THEME.primary },
    { name: 'Video Quality', value: dealerData.video, color: THEME.success },
    { name: 'Audio Quality', value: dealerData.audio, color: THEME.warning },
    { name: 'Stability', value: dealerData.stability || dealerData.overall * 0.92, color: THEME.accent },
    { name: 'Lighting', value: dealerData.lighting || dealerData.video * 0.95, color: '#8B5CF6' },
    { name: 'Speech Clarity', value: dealerData.speech || dealerData.audio * 0.97, color: '#EC4899' }
  ].map(m => ({ ...m, value: Number((m.value || 0).toFixed(1)) }));

  // Weekly trend
  const buildWeeklyTrend = (dId) => {
    const dealerResults = (allResults || []).filter(r => normalizeDealerId(r.dealer_id || r.dealer || '') === dId);
    const weekMap = {};
    dealerResults.forEach(r => {
      const rawDate = r.created_at || r.date || r.createdAt || r.timestamp || r.analysis_date;
      if (!rawDate) return;
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return;
      const weekStart = new Date(d);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = `${weekStart.getFullYear()}-W${String(Math.ceil((weekStart.getDate()) / 7)).padStart(2, '0')}-${String(weekStart.getMonth()+1).padStart(2,'0')}`;
      if (!weekMap[weekKey]) weekMap[weekKey] = { scores: [], dates: [] };
      if (r.overall_quality_score != null) weekMap[weekKey].scores.push(r.overall_quality_score);
      weekMap[weekKey].dates.push(d);
    });

    return Object.entries(weekMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8)
      .map(([key, data]) => {
        const avg = data.scores.length > 0 ? Number((data.scores.reduce((s, v) => s + v, 0) / data.scores.length).toFixed(1)) : 0;
        const earliest = new Date(Math.min(...data.dates.map(d => d.getTime())));
        return { week: `${earliest.getDate()}/${earliest.getMonth()+1}`, score: avg };
      });
  };

  const weeklyTrend = buildWeeklyTrend(dealerId);

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        {/* Left: Overall gauge & metric progress bars */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: 3,
            background: 'rgba(13, 161, 184, 0.02)',
            border: `1px solid ${THEME.border}`,
            borderRadius: 3,
            height: '100%'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: THEME.primary + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: THEME.primary,
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                {dealerData.overall.toFixed(1)}
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: THEME.textPrimary }}>
                  {dealerData.name} Performance Overview
                </Typography>
                <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                  Based on {dealerData.videos} total analyzed videos
                </Typography>
              </Box>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 2, fontSize: '0.8rem' }}>
              📊 Metric Breakdown
            </Typography>
            <Stack spacing={2}>
              {metrics.map(m => (
                <Box key={m.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.textSecondary }}>{m.name}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: m.color }}>{m.value}/10</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={m.value * 10}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: m.color + '15',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: m.color,
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Right: Weekly trend chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            p: 3,
            border: `1px solid ${THEME.border}`,
            borderRadius: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 2, fontSize: '0.8rem' }}>
              📈 Weekly Score Trend
            </Typography>
            {weeklyTrend.length > 1 ? (
              <Box sx={{ flex: 1, minHeight: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="singleTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={THEME.primary} stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={THEME.borderLight} vertical={false} />
                    <XAxis dataKey="week" stroke={THEME.textTertiary} fontSize={10} />
                    <YAxis domain={[0, 10]} stroke={THEME.textTertiary} fontSize={10} />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="score"
                      name="Overall Score"
                      stroke={THEME.primary}
                      strokeWidth={2.5}
                      fill="url(#singleTrendGrad)"
                      dot={{ fill: THEME.primary, r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, py: 4 }}>
                <Typography variant="caption" sx={{ color: THEME.textTertiary }}>
                  Insufficient weekly historical trend data to render line chart.
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// ─── Dealer Performance Comparison Chart ────────────────────────────────────
const DealerComparisonChart = ({ dealerA, dealerB, allResults, dealerRankings }) => {
  const COMPARISON_COLORS = {
    dealerA: { primary: '#1E88E5', light: '#BBDEFB', gradient: 'rgba(30, 136, 229, 0.15)' },
    dealerB: { primary: '#E53935', light: '#FFCDD2', gradient: 'rgba(229, 57, 53, 0.15)' }
  };

  // Get dealer data from rankings
  const dealerAData = dealerRankings.find(d => d.id === dealerA || d.name === dealerA);
  const dealerBData = dealerRankings.find(d => d.id === dealerB || d.name === dealerB);

  if (!dealerAData || !dealerBData) return null;

  // Build comparison metrics
  const metrics = [
    { name: 'Overall', a: dealerAData.overall, b: dealerBData.overall },
    { name: 'Video', a: dealerAData.video, b: dealerBData.video },
    { name: 'Audio', a: dealerAData.audio, b: dealerBData.audio },
    { name: 'Stability', a: dealerAData.stability || dealerAData.overall * 0.92, b: dealerBData.stability || dealerBData.overall * 0.92 },
    { name: 'Lighting', a: dealerAData.lighting || dealerAData.video * 0.95, b: dealerBData.lighting || dealerBData.video * 0.95 },
    { name: 'Speech', a: dealerAData.speech || dealerAData.audio * 0.97, b: dealerBData.speech || dealerBData.audio * 0.97 }
  ].map(m => ({ ...m, a: Number((m.a || 0).toFixed(1)), b: Number((m.b || 0).toFixed(1)) }));

  // Weekly trend from allResults
  const buildWeeklyTrend = (dealerId) => {
    const dealerResults = (allResults || []).filter(r => {
      const rid = normalizeDealerId(r.dealer_id || r.dealer || '');
      return rid === dealerId;
    });
    
    // Group by week
    const weekMap = {};
    dealerResults.forEach(r => {
      const rawDate = r.created_at || r.date || r.createdAt || r.timestamp || r.analysis_date;
      if (!rawDate) return;
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return;
      const weekStart = new Date(d);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = `${weekStart.getFullYear()}-W${String(Math.ceil((weekStart.getDate()) / 7)).padStart(2, '0')}-${String(weekStart.getMonth()+1).padStart(2,'0')}`;
      if (!weekMap[weekKey]) weekMap[weekKey] = { scores: [], dates: [] };
      if (r.overall_quality_score != null) weekMap[weekKey].scores.push(r.overall_quality_score);
      weekMap[weekKey].dates.push(d);
    });

    return Object.entries(weekMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8) // last 8 weeks
      .map(([key, data]) => {
        const avg = data.scores.length > 0 
          ? Number((data.scores.reduce((s, v) => s + v, 0) / data.scores.length).toFixed(1)) 
          : 0;
        const earliest = new Date(Math.min(...data.dates.map(d => d.getTime())));
        const label = `${earliest.getDate()}/${earliest.getMonth()+1}`;
        return { week: label, score: avg, count: data.scores.length };
      });
  };

  const weeklyA = buildWeeklyTrend(dealerA);
  const weeklyB = buildWeeklyTrend(dealerB);

  // Merge weekly data
  const allWeeks = new Set([...weeklyA.map(w => w.week), ...weeklyB.map(w => w.week)]);
  const weeklyComparison = [...allWeeks].sort().map(week => {
    const a = weeklyA.find(w => w.week === week);
    const b = weeklyB.find(w => w.week === week);
    return {
      week,
      [dealerAData.name]: a?.score || 0,
      [dealerBData.name]: b?.score || 0
    };
  });

  // Calculate summary stats
  const diffOverall = (dealerAData.overall - dealerBData.overall).toFixed(1);
  const totalVideosA = dealerAData.videos || 0;
  const totalVideosB = dealerBData.videos || 0;

  const CustomComparisonTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 2,
          p: 1.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          border: `1px solid ${THEME.border}`,
          minWidth: 160,
          backdropFilter: 'blur(8px)'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 0.75, fontSize: '11px' }}>
            {label}
          </Typography>
          {payload.map((entry, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 0.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ color: THEME.textSecondary, fontSize: '10px' }}>
                  {entry.name}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: entry.color, fontSize: '11px' }}>
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Render chart labels as high-contrast badges so they remain readable on
  // smaller displays and against the coloured chart series.
  const ScoreAxisTick = ({ x, y, payload }) => (
    <g>
      <rect x={x - 42} y={y - 11} width={32} height={22} rx={7} fill="#E8F6F9" />
      <text x={x - 26} y={y + 5} textAnchor="middle" fill={THEME.primaryDark} fontSize={12} fontWeight={800}>
        {payload.value}
      </text>
    </g>
  );

  const MetricAxisTick = ({ x, y, payload }) => (
    <g>
      <rect x={x - 38} y={y + 5} width={76} height={22} rx={7} fill="#F0F7FA" />
      <text x={x} y={y + 20} textAnchor="middle" fill={THEME.textPrimary} fontSize={12} fontWeight={800}>
        {payload.value}
      </text>
    </g>
  );

  const BarValueLabel = ({ x, y, width, value, color }) => {
    const label = Number(value || 0).toFixed(1);
    const badgeWidth = 34;
    return (
      <g>
        <rect x={x + width / 2 - badgeWidth / 2} y={Math.max(2, y - 27)} width={badgeWidth} height={21} rx={7} fill={color} />
        <text x={x + width / 2} y={Math.max(2, y - 27) + 15} textAnchor="middle" fill="#FFFFFF" fontSize={11} fontWeight={800}>
          {label}
        </text>
      </g>
    );
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* Dealer A Summary */}
        <Box sx={{
          flex: 1,
          background: `linear-gradient(135deg, ${COMPARISON_COLORS.dealerA.primary}08, ${COMPARISON_COLORS.dealerA.primary}15)`,
          borderRadius: 3,
          p: 2,
          border: `1px solid ${COMPARISON_COLORS.dealerA.primary}25`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${COMPARISON_COLORS.dealerA.primary}08` }} />
          <Typography variant="caption" sx={{ color: COMPARISON_COLORS.dealerA.primary, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '9px' }}>DEALER A</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: THEME.textPrimary, mt: 0.25, fontSize: '1rem' }}>{dealerAData.name}</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: COMPARISON_COLORS.dealerA.primary }}>{dealerAData.overall.toFixed(1)}</Typography>
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontSize: '9px' }}>Overall</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, color: THEME.textSecondary }}>{totalVideosA}</Typography>
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontSize: '9px' }}>Videos</Typography>
            </Box>
          </Box>
        </Box>

        {/* VS Badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: THEME.gradientPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(13, 161, 184, 0.3)'
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}>VS</Typography>
          </Box>
        </Box>

        {/* Dealer B Summary */}
        <Box sx={{
          flex: 1,
          background: `linear-gradient(135deg, ${COMPARISON_COLORS.dealerB.primary}08, ${COMPARISON_COLORS.dealerB.primary}15)`,
          borderRadius: 3,
          p: 2,
          border: `1px solid ${COMPARISON_COLORS.dealerB.primary}25`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${COMPARISON_COLORS.dealerB.primary}08` }} />
          <Typography variant="caption" sx={{ color: COMPARISON_COLORS.dealerB.primary, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '9px' }}>DEALER B</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: THEME.textPrimary, mt: 0.25, fontSize: '1rem' }}>{dealerBData.name}</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: COMPARISON_COLORS.dealerB.primary }}>{dealerBData.overall.toFixed(1)}</Typography>
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontSize: '9px' }}>Overall</Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, color: THEME.textSecondary }}>{totalVideosB}</Typography>
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontSize: '9px' }}>Videos</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Difference Indicator */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 3 
      }}>
        <Chip 
          icon={Number(diffOverall) >= 0 ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />}
          label={`${dealerAData.name} is ${Math.abs(Number(diffOverall))} pts ${Number(diffOverall) >= 0 ? 'ahead' : 'behind'}`}
          size="small"
          sx={{
            fontWeight: 600,
            fontSize: '11px',
            background: Number(diffOverall) >= 0 ? THEME.successLight : THEME.errorLight,
            color: Number(diffOverall) >= 0 ? '#059669' : '#DC2626',
            border: 'none',
            px: 1
          }}
        />
      </Box>

      {/* Grouped Bar Chart - Metrics Comparison */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 1.5, fontSize: '0.8rem' }}>
          📊 Quality Metrics Comparison
        </Typography>
        <ResponsiveContainer width="100%" height={285}>
          <RechartsBarChart data={metrics} margin={{ top: 34, right: 20, left: 16, bottom: 28 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.borderLight} vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: THEME.primary, strokeWidth: 1.5 }}
              tickLine={false}
              height={38}
              tick={<MetricAxisTick />}
            />
            <YAxis
              domain={[0, 10]}
              width={52}
              axisLine={{ stroke: THEME.primary, strokeWidth: 1.5 }}
              tickLine={false}
              tick={<ScoreAxisTick />}
            />
            <RechartsTooltip content={<CustomComparisonTooltip />} />
            <Bar 
              dataKey="a" 
              name={dealerAData.name} 
              fill={COMPARISON_COLORS.dealerA.primary} 
              radius={[6, 6, 0, 0]} 
              barSize={28}
              fillOpacity={0.85}
            >
              <LabelList dataKey="a" position="top" content={<BarValueLabel color={COMPARISON_COLORS.dealerA.primary} />} />
            </Bar>
            <Bar 
              dataKey="b" 
              name={dealerBData.name} 
              fill={COMPARISON_COLORS.dealerB.primary} 
              radius={[6, 6, 0, 0]} 
              barSize={28}
              fillOpacity={0.85}
            >
              <LabelList dataKey="b" position="top" content={<BarValueLabel color={COMPARISON_COLORS.dealerB.primary} />} />
            </Bar>
            <Legend 
              wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '8px' }}
              iconType="circle"
              iconSize={8}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </Box>

      {/* Weekly Trend Line Chart */}
      {weeklyComparison.length > 1 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 1.5, fontSize: '0.8rem' }}>
            📈 Weekly Performance Trend
          </Typography>
          <ResponsiveContainer width="100%" height={245}>
            <AreaChart data={weeklyComparison} margin={{ top: 16, right: 20, left: 16, bottom: 28 }}>
              <defs>
                <linearGradient id="gradientA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COMPARISON_COLORS.dealerA.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COMPARISON_COLORS.dealerA.primary} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradientB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COMPARISON_COLORS.dealerB.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COMPARISON_COLORS.dealerB.primary} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={THEME.borderLight} vertical={false} />
              <XAxis dataKey="week" axisLine={{ stroke: THEME.primary, strokeWidth: 1.5 }} tickLine={false} height={38} tick={<MetricAxisTick />} />
              <YAxis domain={[0, 10]} width={52} axisLine={{ stroke: THEME.primary, strokeWidth: 1.5 }} tickLine={false} tick={<ScoreAxisTick />} />
              <RechartsTooltip content={<CustomComparisonTooltip />} />
              <Area
                type="monotone"
                dataKey={dealerAData.name}
                stroke={COMPARISON_COLORS.dealerA.primary}
                strokeWidth={2.5}
                fill="url(#gradientA)"
                dot={{ fill: COMPARISON_COLORS.dealerA.primary, r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey={dealerBData.name}
                stroke={COMPARISON_COLORS.dealerB.primary}
                strokeWidth={2.5}
                fill="url(#gradientB)"
                dot={{ fill: COMPARISON_COLORS.dealerB.primary, r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '8px' }}
                iconType="circle"
                iconSize={8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};


// Score → color bands matching Tableau-style heatmap (dark red → light red → light green → dark green)
const getHeatmapColor = (score) => {
  // Score out of 10
  if (score >= 8.5) return '#1a7a1a';  // Dark Green  (90-100%)
  if (score >= 7.5) return '#2da44e';  // Medium Green (70-90%)
  if (score >= 6.5) return '#57c17e';  // Light Green  (50-70%)
  if (score >= 5.5) return '#e8a09a';  // Light Red    (30-50%)
  if (score >= 4.0) return '#c94040';  // Medium Red   (10-30%)
  return '#8B1A1A';                    // Dark Red     (0-10%)
};

const HEATMAP_LEGEND = [
  { label: '< 4.0  (Poor)',      color: '#8B1A1A' },
  { label: '4.0 – 5.5  (Below Avg)', color: '#c94040' },
  { label: '5.5 – 6.5  (Fair)',  color: '#e8a09a' },
  { label: '6.5 – 7.5  (Good)',  color: '#57c17e' },
  { label: '7.5 – 8.5  (Great)', color: '#2da44e' },
  { label: '> 8.5  (Excellent)', color: '#1a7a1a' },
];

const CustomTreemapContent = (props) => {
  const { x, y, width, height, name, overall, size } = props;

  const bgColor = getHeatmapColor(overall || 0);
  // Dark text only on the salmon/light-red band, white elsewhere
  const textColor = (overall || 0) >= 5.5 && (overall || 0) < 6.5 ? 'rgba(0,0,0,0.82)' : '#FFFFFF';

  const showText = width > 55 && height > 38;

  // Truncate long names to fit the block
  const maxChars = Math.max(6, Math.floor(width / 9));
  const displayName = name && name.length > maxChars ? name.substring(0, maxChars - 1) + '…' : name;

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        style={{
          fill: bgColor,
          stroke: '#ffffff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
      />
      {/* Name only — score & videos shown on hover via tooltip */}
      {showText && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: textColor,
            fontSize: Math.min(16, Math.max(10, width / 8)) + 'px',
            fontWeight: 700,
            fontFamily: 'Outfit, Inter, sans-serif',
            pointerEvents: 'none',
          }}
        >
          {displayName}
        </text>
      )}
    </g>
  );
};

const CustomTreemapTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box sx={{
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 2,
        p: 1.5,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        border: `1px solid ${THEME.border}`,
        minWidth: 160
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 1, borderBottom: `1px solid ${THEME.borderLight}`, pb: 0.5 }}>
          {data.name}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>
              Overall Score:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.primary }}>
              {(data.overall || 0).toFixed(1)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>
              Video Quality:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.success }}>
              {(data.video || 0).toFixed(1)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>
              Audio Quality:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.warning }}>
              {(data.audio || 0).toFixed(1)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 0.5, pt: 0.5, borderTop: `1px dashed ${THEME.borderLight}` }}>
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>
              Total Videos:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
              {data.videos}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
  return null;
};

const normalizeDealerId = (id) => {
  if (!id) return 'EMINENT';
  const s = String(id).trim().toLowerCase();
  if (s.includes('bmw') || s === 'kun') return 'BMW-KUN';
  if (s.includes('bird')) return 'BIRD';
  if (s.includes('deutsche') || s.includes('deutsch') || s === 'detush' || s === 'nin') return 'DEUTSCHEMOTOREN';
  if (s.includes('eminent')) return 'EMINENT';
  if (s.includes('evm') || s.includes('evmauto')) return 'EVMAUTOKRAFT';
  if (s.includes('gallop') || s.includes('gallap')) return 'GALLOP';
  return 'EMINENT'; // Fallback unregistered names to EMINENT
};

const getDealerDisplayName = (id) => {
  const norm = normalizeDealerId(id);
  const exactNames = {
    'BIRD': 'BIRD',
    'BMW-KUN': 'BMW-KUN',
    'DEUTSCHEMOTOREN': 'DEUTSCHEMOTOREN',
    'EMINENT': 'EMINENT',
    'EVMAUTOKRAFT': 'EVMAUTOKRAFT',
    'GALLOP': 'GALLOP'
  };
  return exactNames[norm] || 'EMINENT';
};

// ─── Helper: Compute advisor feedback flags from results ───────────────────
const computeAdvisorFlags = (results = []) => {
  const flags = [];
  const audioScores = results.map(r => r.audio_quality_score || 0).filter(s => s > 0);
  const avgAudio = audioScores.length > 0 ? audioScores.reduce((a, b) => a + b, 0) / audioScores.length : 0;
  const videoScores = results.map(r => r.video_quality_score || 0).filter(s => s > 0);
  const avgVideo = videoScores.length > 0 ? videoScores.reduce((a, b) => a + b, 0) / videoScores.length : 0;

  // Inaudible: avg audio < 5
  if (avgAudio > 0 && avgAudio < 5) flags.push({ label: 'Often Inaudible', color: '#ef4444', bg: '#fef2f2' });
  else if (avgAudio >= 5 && avgAudio < 7) flags.push({ label: 'Audio Needs Work', color: '#f59e0b', bg: '#fffbeb' });

  // Camera / video quality
  if (avgVideo > 0 && avgVideo < 5) flags.push({ label: 'Poor Video Quality', color: '#ef4444', bg: '#fef2f2' });
  else if (avgVideo >= 5 && avgVideo < 7) flags.push({ label: 'Video Below Avg', color: '#f59e0b', bg: '#fffbeb' });

  // Good performance
  if (avgAudio >= 8 && avgVideo >= 8) flags.push({ label: 'Top Performer', color: '#16a34a', bg: '#f0fdf4' });
  else if (avgAudio >= 7 && avgVideo >= 7) flags.push({ label: 'Good Quality', color: '#22c55e', bg: '#f0fdf4' });

  return flags;
};

// ─── Top Detected Issues Component ─────────────────────────────────────────
const TopDetectedIssues = ({ allResults = [] }) => {
  const issueCounts = { video: {}, audio: {}, overall: {} };

  allResults.forEach(r => {
    // Video issues
    const vScore = r.video_quality_score || 0;
    if (vScore < 5) { issueCounts.video['Poor Video Quality'] = (issueCounts.video['Poor Video Quality'] || 0) + 1; }
    else if (vScore < 7) { issueCounts.video['Below Average Video'] = (issueCounts.video['Below Average Video'] || 0) + 1; }

    // Audio issues — inferred from audio score
    const aScore = r.audio_quality_score || 0;
    if (aScore < 4) { issueCounts.audio['Inaudible / No Speech'] = (issueCounts.audio['Inaudible / No Speech'] || 0) + 1; }
    else if (aScore < 6) { issueCounts.audio['Background Noise'] = (issueCounts.audio['Background Noise'] || 0) + 1; }
    else if (aScore < 7) { issueCounts.audio['Low Audio Clarity'] = (issueCounts.audio['Low Audio Clarity'] || 0) + 1; }

    // Overall issues
    const oScore = r.overall_quality_score || 0;
    const label = r.overall_quality_label || '';
    if (label === 'Poor' || oScore < 5) { issueCounts.overall['Poor Overall Score'] = (issueCounts.overall['Poor Overall Score'] || 0) + 1; }
    else if (label === 'Fair' || (oScore >= 5 && oScore < 7)) { issueCounts.overall['Needs Improvement'] = (issueCounts.overall['Needs Improvement'] || 0) + 1; }
  });

  const topIssues = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const categories = [
    { key: 'video', label: '🎥 Video Issues', color: '#0ea5e9', bg: '#f0f9ff', issues: topIssues(issueCounts.video) },
    { key: 'audio', label: '🎙️ Audio Issues', color: '#10b981', bg: '#f0fdf4', issues: topIssues(issueCounts.audio) },
    { key: 'overall', label: '⭐ Overall Issues', color: '#f59e0b', bg: '#fffbeb', issues: topIssues(issueCounts.overall) }
  ];

  if (allResults.length === 0) return null;

  return (
    <Card sx={{ background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`, borderRadius: 3, boxShadow: THEME.shadowSm, mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Assessment sx={{ color: '#ef4444', mr: 1.5, fontSize: 24 }} />
          <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 700 }}>
            Top Detected Issues
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
          {categories.map(cat => (
            <Box key={cat.key} sx={{
              flex: 1,
              display: 'flex'
            }}>
              <Box sx={{ background: cat.bg, borderRadius: 2, p: 2, border: `1px solid ${cat.color}20`, width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" sx={{ color: cat.color, fontWeight: 700, mb: 1.5 }}>{cat.label}</Typography>
                {cat.issues.length === 0 ? (
                  <Typography variant="caption" sx={{ color: THEME.textTertiary }}>No issues detected ✓</Typography>
                ) : cat.issues.map(([issue, count]) => (
                  <Box key={issue} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: THEME.textPrimary, fontWeight: 500, flex: 1 }}>{issue}</Typography>
                    <Chip label={count} size="small" sx={{ ml: 1, fontWeight: 700, minWidth: 36, background: cat.color, color: '#fff', fontSize: '0.7rem', height: 20 }} />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// ─── Enhanced Service Advisor Section ──────────────────────────────────────
const EnhancedServiceAdvisorSection = ({ allResults = [], selectedFilterDealer = 'all' }) => {
  const [minUploadsFilter, setMinUploadsFilter] = React.useState(25);
  const advisorMap = new Map();

  const filtered = selectedFilterDealer === 'all'
    ? allResults
    : allResults.filter(r => normalizeDealerId(r.dealer_id || r.dealer || '') === normalizeDealerId(selectedFilterDealer));

  filtered.forEach(r => {
    const name = r.citnow_metadata?.service_advisor || r.citnow_service_advisor || '';
    if (!name || name === 'Unknown Advisor' || name.length < 2) return;
    if (!advisorMap.has(name)) {
      advisorMap.set(name, { 
        name, 
        videoScores: [], 
        audioScores: [], 
        overallScores: [], 
        results: [],
        dealerships: new Set()
      });
    }
    const a = advisorMap.get(name);
    if (r.video_quality_score != null) a.videoScores.push(r.video_quality_score);
    if (r.audio_quality_score != null) a.audioScores.push(r.audio_quality_score);
    if (r.overall_quality_score != null) a.overallScores.push(r.overall_quality_score);
    
    const dName = r.citnow_dealership || r.citnow_metadata?.dealership || '';
    if (dName && dName.trim()) {
      a.dealerships.add(dName.trim());
    }
    
    a.results.push(r);
  });

  const advisors = Array.from(advisorMap.values()).map(a => {
    const avgVideo = a.videoScores.length > 0 ? a.videoScores.reduce((s, v) => s + v, 0) / a.videoScores.length : 0;
    const avgAudio = a.audioScores.length > 0 ? a.audioScores.reduce((s, v) => s + v, 0) / a.audioScores.length : 0;
    const avgOverall = a.overallScores.length > 0 ? a.overallScores.reduce((s, v) => s + v, 0) / a.overallScores.length : 0;
    const dealership = a.dealerships.size > 0 ? Array.from(a.dealerships)[0] : '';
    return { ...a, avgVideo, avgAudio, avgOverall, totalVideos: a.results.length, dealership, flags: computeAdvisorFlags(a.results) };
  }).filter(a => a.totalVideos >= minUploadsFilter && a.avgOverall >= 7) // Only show good rated (score >= 7)
    .sort((a, b) => {
      if (Math.abs(b.avgOverall - a.avgOverall) < 0.001) {
        return b.totalVideos - a.totalVideos;
      }
      return b.avgOverall - a.avgOverall;
    })
    .slice(0, 8);

  if (advisors.length === 0 && minUploadsFilter === 0) return null;

  const getScoreColor = (score) => score >= 7 ? '#16a34a' : score >= 5 ? '#f59e0b' : '#ef4444';
  const getScoreBg = (score) => score >= 7 ? '#f0fdf4' : score >= 5 ? '#fffbeb' : '#fef2f2';
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Card sx={{ background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`, borderRadius: 3, boxShadow: THEME.shadowSm, mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEvents sx={{ color: '#f59e0b', mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 700 }}>
              Top Service Advisors
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TextField
              select
              size="small"
              value={minUploadsFilter}
              onChange={(e) => setMinUploadsFilter(Number(e.target.value))}
              sx={{
                minWidth: 140,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  height: 32,
                  fontSize: '0.8rem',
                  background: THEME.surface,
                }
              }}
              label=""
            >
              <MenuItem value={25}>Min 25 uploads</MenuItem>
              <MenuItem value={100}>Min 100 uploads</MenuItem>
              <MenuItem value={200}>Min 200 uploads</MenuItem>
              <MenuItem value={500}>Min 500 uploads</MenuItem>
            </TextField>
            <Chip label={`${advisors.length} advisors`} size="small" sx={{ fontWeight: 600, background: THEME.surface, color: THEME.textSecondary }} />
          </Box>
        </Box>
        {advisors.length === 0 ? (
          <Typography variant="body2" sx={{ color: THEME.textTertiary, textAlign: 'center', py: 4 }}>
            No service advisors found with at least {minUploadsFilter} uploads and a rating of 7.0+.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {advisors.map((advisor, idx) => (
              <Box key={advisor.name} sx={{
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                boxSizing: 'border-box',
                display: 'flex'
              }}>
                <Box sx={{
                  background: THEME.surface, borderRadius: 2.5, p: 2,
                  border: `1px solid ${idx < 3 ? '#f59e0b40' : THEME.border}`,
                  transition: 'all 0.2s', width: '100%',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: 180,
                  '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.10)', transform: 'translateY(-2px)' }
                }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: '50%', mr: 1.5, flexShrink: 0,
                      background: idx < 3 ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : THEME.border,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: idx < 3 ? '16px' : '12px', fontWeight: 700, color: idx < 3 ? '#fff' : THEME.textSecondary
                    }}>
                      {idx < 3 ? medals[idx] : idx + 1}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary, lineHeight: 1.2, mb: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {advisor.name}
                      </Typography>
                      {advisor.dealership && (
                        <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, display: 'block', mb: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          🏢 {advisor.dealership}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 500 }}>
                        {advisor.totalVideos} video{advisor.totalVideos !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ background: getScoreBg(advisor.avgOverall), borderRadius: 1.5, px: 1, py: 0.5, textAlign: 'center', flexShrink: 0, ml: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: getScoreColor(advisor.avgOverall), display: 'block', lineHeight: 1, fontSize: '14px' }}>
                        {advisor.avgOverall.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: THEME.textTertiary, fontSize: '9px', fontWeight: 600 }}>OVERALL</Typography>
                    </Box>
                  </Box>

                  {/* Score bars */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                      <Typography variant="caption" sx={{ color: THEME.textSecondary, minWidth: 42, fontWeight: 500, fontSize: '11px' }}>Video</Typography>
                      <Box sx={{ flex: 1, height: 6, borderRadius: 3, background: THEME.borderLight, mx: 1, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${(advisor.avgVideo / 10) * 100}%`, background: '#0ea5e9', borderRadius: 3, transition: 'width 0.8s ease' }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#0ea5e9', minWidth: 28, textAlign: 'right', fontSize: '11px' }}>{advisor.avgVideo.toFixed(1)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: THEME.textSecondary, minWidth: 42, fontWeight: 500, fontSize: '11px' }}>Audio</Typography>
                      <Box sx={{ flex: 1, height: 6, borderRadius: 3, background: THEME.borderLight, mx: 1, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${(advisor.avgAudio / 10) * 100}%`, background: '#10b981', borderRadius: 3, transition: 'width 0.8s ease' }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', minWidth: 28, textAlign: 'right', fontSize: '11px' }}>{advisor.avgAudio.toFixed(1)}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const DealerPerformanceHeatmap = ({ data, selectedFilterDealer, allResults, users }) => {

  let rows = [];
  let title = "Dealership Performance Heatmap (Treemap)";

  const computeMetrics = (results) => {
    const total = results.length;
    if (total === 0) {
      return {
        overall: 0,
        video: 0,
        audio: 0,
        videos: 0
      };
    }

    const scores = results.filter(r => r.overall_quality_score != null).map(r => r.overall_quality_score);
    const avgOverall = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    const videoScores = results.filter(r => r.video_quality_score != null).map(r => r.video_quality_score);
    const avgVideo = videoScores.length > 0 ? (videoScores.reduce((a, b) => a + b, 0) / videoScores.length) : avgOverall;

    const audioScores = results.filter(r => r.audio_quality_score != null).map(r => r.audio_quality_score);
    const avgAudio = audioScores.length > 0 ? (audioScores.reduce((a, b) => a + b, 0) / audioScores.length) : avgOverall;

    return {
      overall: avgOverall,
      video: avgVideo,
      audio: avgAudio,
      videos: total
    };
  };

  if (selectedFilterDealer === 'all') {
    rows = data.map(d => {
      return {
        id: d.id,
        name: d.name,
        // Give 0-video dealers size=1 so they still appear in the treemap
        size: Math.max(1, d.videos),
        overall: d.overall,
        video: d.video,
        audio: d.audio,
        videos: d.videos
      };
    }).sort((a, b) => b.overall - a.overall);
  } else {
    const selectedNorm = normalizeDealerId(selectedFilterDealer);
    const selectedDealerObj = data.find(d => normalizeDealerId(d.id) === selectedNorm);
    const dealerName = selectedDealerObj ? selectedDealerObj.name : 'Selected Dealership';
    title = `${dealerName} — User Performance Heatmap (Treemap)`;

    const dealerResults = allResults.filter(r => normalizeDealerId(r.dealer_id || r.dealer) === selectedNorm);
    const userMap = {};
    dealerResults.forEach(r => {
      const userId = r.submitted_by_user_id;
      if (!userId) return;
      if (!userMap[userId]) userMap[userId] = [];
      userMap[userId].push(r);
    });

    rows = Object.entries(userMap).map(([userId, results]) => {
      const userObj = users.find(u => String(u._id || u.id) === userId);
      const name = userObj ? userObj.username : `User ${userId.substring(0, 5)}`;
      const metrics = computeMetrics(results);
      return {
        id: userId,
        name: name,
        size: metrics.videos || 1,
        overall: metrics.overall,
        video: metrics.video,
        audio: metrics.audio,
        videos: metrics.videos
      };
    }).filter(u => u.videos > 0).sort((a, b) => b.overall - a.overall);
  }

  return (
    <Card sx={{
      background: THEME.surfaceElevated,
      border: `1px solid ${THEME.border}`,
      borderRadius: 3,
      boxShadow: THEME.shadowSm,
      mt: 3,
      width: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TableChart sx={{ color: THEME.primary, mr: 2, fontSize: 24 }} />
          <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        {rows.length > 0 ? (
          <>
            {/* Treemap — full width */}
            <ResponsiveContainer width="100%" height={520}>
              <Treemap
                data={rows}
                dataKey="size"
                stroke="#fff"
                fill="#2da44e"
                content={<CustomTreemapContent />}
              >
                <RechartsTooltip content={<CustomTreemapTooltip />} />
              </Treemap>
            </ResponsiveContainer>

            {/* Legend row below the treemap */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: 1.5, pt: 1.5, borderTop: `1px solid ${THEME.borderLight}` }}>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px', mr: 1 }}>
                Score:
              </Typography>
              {HEATMAP_LEGEND.map(({ label, color }) => (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 14, height: 12, borderRadius: '2px', background: color, border: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500, fontSize: '10.5px', whiteSpace: 'nowrap' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 400, fontSize: '10px', ml: 'auto', fontStyle: 'italic' }}>
                Block size = videos · Hover for details
              </Typography>
            </Box>
          </>

        ) : (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: THEME.textTertiary }}>
              No performance data available for Heatmap
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};




const RADIAN = Math.PI / 180;
const renderSlicePercentageLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (!percent || percent < 0.03) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
      style={{ pointerEvents: 'none', filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const QualityDistributionChart = ({ data }) => {
  const filteredData = data.filter(item => item.value > 0);
  const totalCount = filteredData.reduce((sum, item) => sum + item.value, 0);

  if (filteredData.length === 0) {
    return (
      <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="body2" sx={{ color: THEME.textTertiary, mb: 2 }}>No quality data available</Typography>
      </Box>
    );
  }

  const getQualityColor = (name, index) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('very good') || lower.includes('excellent')) return '#10B981';
    if (lower.includes('good')) return '#0DA1B8';
    if (lower.includes('fair')) return '#F59E0B';
    if (lower.includes('very poor')) return '#B91C1C';
    if (lower.includes('poor') || lower.includes('fail') || lower.includes('error')) return '#EF4444';
    return CHART_COLORS.qualityGradient[index % CHART_COLORS.qualityGradient.length];
  };

  return (
    <Box sx={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
          <Pie
            data={filteredData}
            cx="50%"
            cy="42%"
            outerRadius={105}
            innerRadius={55}
            dataKey="value"
            paddingAngle={3}
            stroke="#ffffff"
            strokeWidth={2}
            labelLine={false}
            label={renderSlicePercentageLabel}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getQualityColor(entry.name, index)} />
            ))}
          </Pie>
          <RechartsTooltip
            formatter={(value, name) => [
              `${value} videos (${totalCount > 0 ? ((value / totalCount) * 100).toFixed(1) : 0}%)`,
              name
            ]}
            contentStyle={{
              background: THEME.background,
              border: `1px solid ${THEME.border}`,
              borderRadius: 8,
              boxShadow: THEME.shadowMd,
              fontSize: '12px',
              fontWeight: 600
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '12px',
              fontWeight: 600,
              color: THEME.textSecondary
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const GroupedHorizontalBarChart = ({ data }) => {
  const dealerAgg = {};
  (data || []).forEach(d => {
    const rawId = d.id || d.name || 'eminent';
    const normId = normalizeDealerId(rawId);
    if (!dealerAgg[normId]) {
      dealerAgg[normId] = { name: normId, overall: [], video: [], audio: [] };
    }
    const overallVal = typeof d.overall === 'number' ? d.overall : 0;
    const videoVal = typeof d.video === 'number' ? d.video : (typeof d.video_quality === 'number' ? d.video_quality : overallVal);
    const audioVal = typeof d.audio === 'number' ? d.audio : (typeof d.audio_quality === 'number' ? d.audio_quality : overallVal);
    dealerAgg[normId].overall.push(overallVal);
    dealerAgg[normId].video.push(videoVal);
    dealerAgg[normId].audio.push(audioVal);
  });

  const chartData = Object.values(dealerAgg).map(d => {
    const avgOverall = d.overall.length > 0 ? (d.overall.reduce((a, b) => a + b, 0) / d.overall.length) : 7.0;
    const avgVideo = d.video.length > 0 ? (d.video.reduce((a, b) => a + b, 0) / d.video.length) : avgOverall;
    const avgAudio = d.audio.length > 0 ? (d.audio.reduce((a, b) => a + b, 0) / d.audio.length) : avgOverall;
    return {
      name: d.name,
      overall: Number(avgOverall.toFixed(1)),
      video: Number(avgVideo.toFixed(1)),
      audio: Number(avgAudio.toFixed(1))
    };
  }).sort((a, b) => b.overall - a.overall);

  // Score-based color for bar fill
  const getScoreColor = (score) => {
    if (score >= 7.0) return '#22c55e';
    if (score >= 5.0) return '#f59e0b';
    return '#ef4444';
  };

  if (!chartData || chartData.length === 0) {
    return (
      <Box sx={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: THEME.textTertiary }}>No dealer score data available</Typography>
      </Box>
    );
  }

  const chartHeight = Math.max(300, chartData.length * 65);

  return (
    <Box sx={{ width: '100%', height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 55, left: 5, bottom: 20 }}
          barGap={4}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={THEME.borderLight} />
          <XAxis
            type="number"
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            stroke={THEME.textSecondary}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: THEME.border }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke={THEME.textSecondary}
            fontSize={12}
            fontWeight={700}
            width={145}
            tickLine={false}
            axisLine={false}
          />
          <RechartsTooltip
            formatter={(value, name) => [`${value}/10`, name]}
            contentStyle={{
              background: '#fff',
              border: `1px solid ${THEME.border}`,
              borderRadius: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '10px 14px'
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={9}
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 600, color: THEME.textSecondary }}
          />
          <Bar dataKey="overall" name="Overall" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={12}>
            <LabelList dataKey="overall" position="right" offset={6} style={{ fontSize: '11px', fontWeight: 700, fill: '#6366f1' }} />
          </Bar>
          <Bar dataKey="video" name="Video" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={12}>
            <LabelList dataKey="video" position="right" offset={6} style={{ fontSize: '11px', fontWeight: 700, fill: '#0ea5e9' }} />
          </Bar>
          <Bar dataKey="audio" name="Audio" fill="#10b981" radius={[0, 6, 6, 0]} barSize={12}>
            <LabelList dataKey="audio" position="right" offset={6} style={{ fontSize: '11px', fontWeight: 700, fill: '#10b981' }} />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const DealerSharePieChart = ({ dealers, selectedDealerId }) => {
  const brandColors = ['#1E2265', '#0096C7', '#D91B82', '#00C9A7', '#F59E0B', '#7C4DFF'];

  let pieData = [];
  let title = "Dealer Share Distribution";

  if (selectedDealerId === 'all' || !selectedDealerId) {
    const activeDealers = dealers || [];
    pieData = activeDealers.map((d, i) => ({
      name: d.name,
      value: d.videos || (10 - i * 1.2),
      color: brandColors[i % brandColors.length]
    }));
    title = "Dealer Volume Share";
  } else {
    const target = (dealers || []).find(d => d.id === selectedDealerId);
    title = `${target?.name || 'Dealer'} Share`;
    pieData = [
      { name: 'Excellent', value: 45, color: '#00C9A7' },
      { name: 'Good', value: 35, color: '#0096C7' },
      { name: 'Fair', value: 15, color: '#F59E0B' },
      { name: 'Poor', value: 5, color: '#D91B82' }
    ];
  }

  const totalSum = pieData.reduce((sum, d) => sum + d.value, 0);

  const renderPercentageLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="700"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.6))' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const topShareVal = pieData.length > 0 && totalSum > 0
    ? `${((Math.max(...pieData.map(d => d.value)) / totalSum) * 100).toFixed(0)}%`
    : '0%';

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
        Pie Chart — Share & Volume
      </Typography>

      {/* Summary Stats Header Matching Card 1 */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2.5,
        mb: 1.5,
        width: '100%',
        minHeight: 46
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.25 }}>
            <BarChart sx={{ fontSize: 15, color: THEME.primary, mr: 0.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: THEME.primary, fontSize: '0.95rem' }}>
              {totalSum.toFixed(0)}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '10px' }}>
            TOTAL
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.25 }}>
            <PieChart sx={{ fontSize: 15, color: THEME.accent, mr: 0.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: THEME.accent, fontSize: '0.95rem' }}>
              {topShareVal}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '10px' }}>
            TOP SHARE
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.25 }}>
            <Business sx={{ fontSize: 15, color: THEME.success, mr: 0.5 }} />
            <Typography variant="body1" sx={{ fontWeight: 700, color: THEME.success, fontSize: '0.95rem' }}>
              {pieData.length}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '10px' }}>
            DEALERS
          </Typography>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={290}>
        <RechartsPieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie
            data={pieData}
            cx="50%"
            cy="42%"
            outerRadius={68}
            innerRadius={34}
            dataKey="value"
            paddingAngle={3}
            stroke="#ffffff"
            strokeWidth={2}
            labelLine={false}
            label={renderPercentageLabel}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || brandColors[index % brandColors.length]} />
            ))}
          </Pie>
          <RechartsTooltip
            formatter={(value, name) => [
              `${typeof value === 'number' ? value.toFixed(0) : value} (${totalSum > 0 ? ((value / totalSum) * 100).toFixed(1) : 0}%)`,
              name
            ]}
            contentStyle={{
              background: THEME.background,
              border: `1px solid ${THEME.border}`,
              borderRadius: 8,
              boxShadow: THEME.shadowMd,
              fontSize: '12px',
              fontWeight: 600
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={7}
            wrapperStyle={{
              paddingTop: '6px',
              fontSize: '10.5px',
              fontWeight: 600,
              color: THEME.textSecondary
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon, color, subtitle }) => (
  <Fade in={true}>
    <Card sx={{
      background: THEME.surfaceElevated,
      border: `1px solid ${THEME.border}`,
      borderRadius: 3,
      boxShadow: THEME.shadowSm,
      transition: 'all 0.2s ease-in-out',
      '&:hover': { boxShadow: THEME.shadowMd, transform: 'translateY(-2px)' },
      height: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: THEME.textSecondary, fontWeight: 600, mb: 1, fontSize: '0.875rem' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: THEME.textPrimary, fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: THEME.textTertiary, display: 'block', mb: 1 }}>
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
            width: 48, height: 48, borderRadius: '50%',
            background: color === THEME.primary ? THEME.gradientPrimary :
              color === THEME.accent ? THEME.gradientAccent :
                color === THEME.success ? THEME.gradientSuccess :
                  color === THEME.warning ? THEME.gradientWarning :
                    THEME.gradientPrimary,
            display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: THEME.shadowSm
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 24, color: '#FFFFFF' } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

// Top Performer Card
const TopPerformerCard = ({ dealer, rank, metric, value }) => {
  const numericValue = parseFloat(value) || 0;
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 2,
      py: 1.5,
      borderRadius: 2,
      background: THEME.surface,
      border: `1px solid ${THEME.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        background: THEME.primaryUltraLight,
        borderColor: THEME.primaryLight,
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        transform: 'translateY(-1px)'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '50%', background: rank === 1 ? THEME.gradientAccent :
            rank === 2 ? THEME.gradientPrimary : rank === 3 ? THEME.gradientSuccess : THEME.surfaceElevated,
          display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, fontWeight: 700, fontSize: '13px',
          color: rank <= 3 ? THEME.background : THEME.textPrimary,
          border: rank > 3 ? `1px solid ${THEME.border}` : 'none',
          boxShadow: rank <= 3 ? THEME.shadowSm : 'none', flexShrink: 0
        }}>
          {rank}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <Typography variant="subtitle2" sx={{ color: THEME.textPrimary, fontWeight: 600, mb: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {dealer.name}
          </Typography>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
            {metric}
          </Typography>
        </Box>
      </Box>
      <Chip
        label={value}
        size="small"
        sx={{
          background: numericValue >= 8.5 ? THEME.successLight : numericValue >= 7 ? THEME.primaryUltraLight :
            numericValue >= 5 ? THEME.warningLight : THEME.errorLight,
          color: numericValue >= 8.5 ? THEME.success : numericValue >= 7 ? THEME.primary :
            numericValue >= 5 ? THEME.warning : THEME.error,
          fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, ml: 1, px: 0.5
        }}
      />
    </Box>
  )
};

// Dealer Detail Dialog Components
const QualityDistributionChartDetail = ({ data }) => (
  <Box sx={{ mt: 2 }}>
    {data.map((item, index) => (
      <Box key={item.label} sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
            <Box sx={{
              width: 12, height: 12, borderRadius: '50%', backgroundColor:
                item.label === 'Excellent' ? THEME.success : item.label === 'Very Good' ? THEME.primary :
                  item.label === 'Good' ? THEME.accent : item.label === 'Fair' ? THEME.warning : THEME.error,
              mr: 2
            }} />
            <Typography variant="body2" sx={{ color: THEME.textPrimary, fontWeight: 500, fontSize: '0.875rem' }}>
              {item.label}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '0.875rem' }}>
            {item.value} ({item.percentage}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={item.percentage}
          sx={{
            height: 8, borderRadius: 4, backgroundColor: THEME.borderLight,
            '& .MuiLinearProgress-bar': {
              backgroundColor: item.label === 'Excellent' ? THEME.success : item.label === 'Very Good' ? THEME.primary :
                item.label === 'Good' ? THEME.accent : item.label === 'Fair' ? THEME.warning : THEME.error,
              borderRadius: 4
            }
          }}
        />
      </Box>
    ))}
  </Box>
);

const ScoreTrendChartDetail = ({ data }) => (
  <Box sx={{ mt: 2 }}>
    {data.slice(0, 5).map((item, index) => (
      <Box key={index} sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ color: THEME.textPrimary, fontWeight: 500, fontSize: '0.75rem', mr: 2 }}>
            {item.name}
          </Typography>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>
            Overall: {item.overall.toFixed(1)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: THEME.primary, fontWeight: 500 }}>Video</Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>{item.video}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={item.video} sx={{
              height: 6, borderRadius: 3, backgroundColor: THEME.borderLight,
              '& .MuiLinearProgress-bar': { backgroundColor: THEME.primary, borderRadius: 3 }
            }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: THEME.accent, fontWeight: 500 }}>Audio</Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>{item.audio}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={item.audio} sx={{
              height: 6, borderRadius: 3, backgroundColor: THEME.borderLight,
              '& .MuiLinearProgress-bar': { backgroundColor: THEME.accent, borderRadius: 3 }
            }} />
          </Box>
        </Box>
      </Box>
    ))}
  </Box>
);

const ServiceAdvisorRankingCard = ({ advisor, rank }) => (
  <Card sx={{
    background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`, borderRadius: 3, mb: 2,
    transition: 'all 0.2s ease-in-out', boxShadow: THEME.shadowSm,
    '&:hover': { boxShadow: THEME.shadowMd, borderColor: THEME.primaryLight, transform: 'translateY(-2px)' }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '50%', background: rank === 1 ? THEME.gradientAccent :
              rank === 2 ? THEME.gradientPrimary : rank === 3 ? THEME.gradientSuccess : THEME.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, fontWeight: 700, fontSize: '14px',
            color: rank <= 3 ? THEME.background : THEME.textSecondary, boxShadow: THEME.shadowMd
          }}>
            {rank}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ color: THEME.textPrimary, fontWeight: 600, mb: 0.5, fontSize: '1rem' }}>
              {advisor.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VideoLibrary sx={{ fontSize: 14, color: THEME.textTertiary, mr: 0.5 }} />
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 500 }}>
                {advisor.totalVideos} video{advisor.totalVideos !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', minWidth: 80, background: THEME.primaryUltraLight, borderRadius: 3, p: 1.5, border: `1px solid ${THEME.border}` }}>
          <Typography variant="h6" sx={{ color: THEME.primary, fontWeight: 700, lineHeight: 1, mb: 0.5 }}>
            {advisor.averageOverallScore.toFixed(1)}
          </Typography>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600, fontSize: '0.7rem' }}>
            Overall
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
            <Videocam sx={{ fontSize: 16, color: THEME.primary, mr: 1 }} />
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>Video</Typography>
          </Box>
          <LinearProgress variant="determinate" value={advisor.averageVideoScore} sx={{
            flex: 1, height: 8, borderRadius: 4, backgroundColor: THEME.borderLight,
            '& .MuiLinearProgress-bar': { backgroundColor: THEME.primary, borderRadius: 4 }
          }} />
          <Typography variant="caption" sx={{ color: THEME.textPrimary, minWidth: 35, textAlign: 'right', ml: 1.5, fontWeight: 600 }}>
            {advisor.averageVideoScore.toFixed(1)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
            <Mic sx={{ fontSize: 16, color: THEME.accent, mr: 1 }} />
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>Audio</Typography>
          </Box>
          <LinearProgress variant="determinate" value={advisor.averageAudioScore} sx={{
            flex: 1, height: 8, borderRadius: 4, backgroundColor: THEME.borderLight,
            '& .MuiLinearProgress-bar': { backgroundColor: THEME.accent, borderRadius: 4 }
          }} />
          <Typography variant="caption" sx={{ color: THEME.textPrimary, minWidth: 35, textAlign: 'right', ml: 1.5, fontWeight: 600 }}>
            {advisor.averageAudioScore.toFixed(1)}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const ServiceAdvisorQualityChart = ({ data = [] }) => {
  const chartData = (data || []).map((advisor) => {
    const name = advisor.name || advisor.dealer || 'Unknown';
    const audioRaw = Number(advisor.averageAudioScore ?? advisor.audio ?? 0);
    const videoRaw = Number(advisor.averageVideoScore ?? advisor.video ?? 0);
    return { name, Audio: -Math.max(0, Math.min(10, audioRaw)), Video: Math.max(0, Math.min(10, videoRaw)) };
  });

  return (
    <Box sx={{ mt: 3, p: 3, background: THEME.surface, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 700, mb: -2, textAlign: 'center' }}>
        Audio & Video Quality by Dealer
      </Typography>
      <ResponsiveContainer width="100%" height={Math.max(350, chartData.length * 50)}>
        <ComposedChart layout="vertical" data={chartData} margin={{ top: 30, right: 30, left: 100, bottom: 30 }}>
          <CartesianGrid stroke={THEME.borderLight} horizontal={false} />
          <XAxis type="number" domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} tickFormatter={(value) => Math.abs(value).toString()} stroke={THEME.textSecondary} fontSize={12} />
          <YAxis dataKey="name" type="category" scale="band" stroke={THEME.textSecondary} fontSize={12} width={80} />
          <RechartsTooltip formatter={(value, name) => [Math.abs(Number(value)).toFixed(1), name]} contentStyle={{
            background: THEME.background, border: `1px solid ${THEME.border}`, borderRadius: 8, boxShadow: THEME.shadowMd
          }} />
          <Legend verticalAlign="top" height={36} formatter={(value) => (
            <span style={{ color: THEME.textPrimary, fontSize: '12px' }}>{value}</span>
          )} />
          <ReferenceLine x={0} stroke={THEME.textTertiary} strokeWidth={2} />
          <Bar dataKey="Audio" fill={THEME.accent} barSize={20} radius={[0, 4, 4, 0]}>
            <LabelList dataKey="Audio" position="insideLeft" formatter={(value) => Math.abs(value).toFixed(1)} style={{ fill: THEME.background, fontSize: 11, fontWeight: 'bold' }} />
          </Bar>
          <Bar dataKey="Video" fill={THEME.primary} barSize={20} radius={[4, 0, 0, 4]}>
            <LabelList dataKey="Video" position="insideRight" formatter={(value) => Math.abs(value).toFixed(1)} style={{ fill: THEME.background, fontSize: 11, fontWeight: 'bold' }} />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Dealer Detail Dialog Component
const DealerDetailDialog = ({ open, onClose, dealer }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dealerResults, setDealerResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dashboardData, setDashboardData] = useState({
    qualityDistribution: [],
    scoreTrend: [],
    averageScores: { video: 0, audio: 0, overall: 0 },
    totalVideos: 0,
    serviceAdvisorRankings: []
  });

  // Utility function to normalize dealer IDs
  const normalizeId = (id) => {
    if (id === null || id === undefined) return null;
    const s = String(id).trim();
    return s === '' ? null : s;
  };

  // Load dealer data when dialog opens
  useEffect(() => {
    if (open && dealer) {
      loadDealerData();
      loadDealerUsers();
    }
  }, [open, dealer]);

  const loadDealerData = async () => {
    setLoading(true);
    try {
      // Load dealer results
      const dealerId = normalizeId(dealer.id);
      console.log('Loading dealer data for ID:', dealerId, 'Dealer object:', dealer);
      const res = await api.get(`/results?dealer_id=${encodeURIComponent(dealerId)}&minimal=true`);
      const resData = res.data;
      // Normalize: API may return array or { results: [...] }
      const results = Array.isArray(resData) ? resData : (resData?.results || []);
      console.log('Dealer results loaded:', results.length, 'results');
      setDealerResults(results);

      // Generate dashboard data
      const qualityDistribution = generateQualityDistribution(results);
      const scoreTrend = generateScoreTrend(results);
      const serviceAdvisorRankings = generateServiceAdvisorRankings(results);

      // Use multiple fallback paths for score fields
      const avgVideo = results.reduce((sum, r) => sum + (r.video_analysis?.quality_score || r.video_quality_score || 0), 0) / (results.length || 1);
      const avgAudio = results.reduce((sum, r) => sum + (r.audio_analysis?.score || r.audio_quality_score || 0), 0) / (results.length || 1);
      const avgOverall = results.reduce((sum, r) => sum + (r.overall_quality?.overall_score || r.overall_quality_score || 0), 0) / (results.length || 1);

      console.log('Computed averages:', { avgVideo, avgAudio, avgOverall, totalVideos: results.length });

      setDashboardData({
        qualityDistribution,
        scoreTrend,
        serviceAdvisorRankings,
        averageScores: { video: avgVideo, audio: avgAudio, overall: avgOverall },
        totalVideos: results.length
      });
    } catch (error) {
      console.error('Error loading dealer data:', error);
      setDealerResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDealerUsers = async () => {
    try {
      const usersData = await listUsers();
      const dealerUsers = usersData.filter(u => normalizeId(u.dealer_id) === normalizeId(dealer.id));
      setUsers(dealerUsers);
    } catch (error) {
      console.error('Error loading dealer users:', error);
      setUsers([]);
    }
  };

  // Data processing functions
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

  // Filter results based on search
  const filteredResults = dealerResults.filter((r) => {
    const term = searchTerm.toLowerCase();
    const dm = r.citnow_metadata || {};
    return (
      (dm.dealership || '').toLowerCase().includes(term) ||
      (dm.vehicle || dm.registration || '').toLowerCase().includes(term) ||
      (dm.email || '').toLowerCase().includes(term) ||
      (dm.phone || '').toLowerCase().includes(term)
    );
  });

  const paginatedResults = filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Export functionality
  const exportToCsv = () => {
    if (!filteredResults.length) {
      alert('No rows to export');
      return;
    }

    const headers = [
      'Dealership', 'Vehicle/Registration', 'VIN', 'Email', 'Phone', 'Video Score',
      'Audio Score', 'Overall Score', 'Transcription', 'Summary', 'Translation',
      'Uploaded (Date)', 'Video Link', 'ID'
    ];

    const lines = filteredResults.map((r) => {
      const m = r.citnow_metadata || {};
      const vehicleReg = [m.vehicle, m.registration].filter(Boolean).join('/');
      const row = [
        m.dealership || '', vehicleReg, m.vin || '', m.email || '', m.phone || '',
        r.video_analysis?.quality_score || 0, Math.round(r.audio_analysis?.score || 0),
        (r.overall_quality?.overall_score || 0).toFixed(1), r.transcription?.text || '',
        r.summarization?.summary || '', r.translation?.translated_text || '',
        r.created_at ? new Date(r.created_at).toLocaleString() : '', m.page_url || '', r._id
      ];
      return row.map((cell) => `"${('' + cell).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...lines].join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dealer_${dealer.id}_results_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!dealer) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      {/* Header */}
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
              width: 48, height: 48, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, backdropFilter: 'blur(10px)'
            }}>
              <Business sx={{ fontSize: 24, color: THEME.background }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={600}>{dealer.name}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400 }}>
                Performance Analytics & Management
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: THEME.background,
              background: 'rgba(255, 255, 255, 0.2)',
              '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: THEME.border, background: THEME.surface, px: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: THEME.textSecondary, fontWeight: 500, textTransform: 'none', fontSize: '0.875rem',
              py: 2, minHeight: 'auto', '&.Mui-selected': { color: THEME.primary }
            },
            '& .MuiTabs-indicator': { backgroundColor: THEME.primary, height: 3, borderRadius: '2px 2px 0 0' }
          }}
        >
          <Tab icon={<DashboardIcon sx={{ fontSize: 20, mb: 0.5 }} />} iconPosition="start" label="Dashboard" />
          <Tab icon={<Assessment sx={{ fontSize: 20, mb: 0.5 }} />} iconPosition="start" label={`Results (${dealerResults.length})`} />

        </Tabs>
      </Box>

      <DialogContent dividers sx={{ p: 0, background: THEME.background, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
            <Box sx={{
              width: 60, height: 60, borderRadius: '50%', border: `3px solid ${THEME.border}`,
              borderTop: `3px solid ${THEME.primary}`, animation: 'spin 1s linear infinite', mb: 3
            }} />
            <Typography variant="h6" sx={{ color: THEME.textSecondary, fontWeight: 500 }}>
              Loading Analytics...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            {/* Dashboard Tab */}
            {activeTab === 0 && (
              <Box sx={{ maxWidth: 1400, mx: 'auto', my: 2 }}>
                {/* Overview Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
                  {[
                    { label: 'Total Videos', value: dashboardData.totalVideos, icon: VideoLibrary, color: THEME.primary },
                    { label: 'Avg Video Score', value: dashboardData.averageScores.video.toFixed(1), icon: Videocam, color: THEME.success },
                    { label: 'Avg Audio Score', value: dashboardData.averageScores.audio.toFixed(1), icon: Mic, color: THEME.accent },
                    { label: 'Avg Overall Score', value: dashboardData.averageScores.overall.toFixed(1), icon: Score, color: THEME.primary }
                  ].map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                      <Card sx={{
                        background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`, borderRadius: 3,
                        boxShadow: THEME.shadowSm, transition: 'all .2s ease-in-out',
                        '&:hover': { boxShadow: THEME.shadowMd, transform: 'translateY(-2px)' }
                      }}>
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
                              width: 44, height: 44, borderRadius: '50%', bgcolor: `${stat.color}15`,
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
                    background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`,
                    borderRadius: 3, boxShadow: THEME.shadowSm, mb: 4
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, textAlign: 'center' }}>
                        <TrendingUp sx={{ color: THEME.primary, mr: 2, fontSize: 28 }} />
                        <Typography variant="h5" sx={{ color: THEME.textPrimary, fontWeight: 700 }}>
                          Service Advisor Quality Comparison
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{
                        color: THEME.textSecondary, mb: 4, textAlign: 'center', maxWidth: '900px', mx: 'auto', lineHeight: 1.6
                      }}>
                        Audio quality (🔵 left) and video quality (🟠 right) scores for each service advisor.
                      </Typography>

                      {dashboardData.serviceAdvisorRankings.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, color: THEME.textTertiary }}>
                          <Person sx={{ fontSize: 56, mb: 3, opacity: 0.5 }} />
                          <Typography variant="h6">No service advisor data available</Typography>
                        </Box>
                      ) : (
                        <ServiceAdvisorQualityChart data={dashboardData.serviceAdvisorRankings.slice(0, 8)} />
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Charts Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
                  {/* Service Advisor Rankings */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{
                      background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`,
                      borderRadius: 3, boxShadow: THEME.shadowSm, height: 480
                    }}>
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmojiEvents sx={{ color: THEME.primary, mr: 2, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
                            Service Advisor Rankings
                          </Typography>
                        </Box>
                        {dashboardData.serviceAdvisorRankings.length === 0 ? (
                          <Box sx={{ textAlign: 'center', py: 8, color: THEME.textTertiary, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Person sx={{ fontSize: 48, mb: 2, opacity: .5 }} />
                            <Typography>No service advisor data available</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ flex: 1, overflow: 'auto', pr: 1, maxHeight: 380 }}>
                            {dashboardData.serviceAdvisorRankings.map((a, i) => (
                              <ServiceAdvisorRankingCard key={a.name} advisor={a} rank={i + 1} />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Recent Score Trend */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{
                      background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`,
                      borderRadius: 3, boxShadow: THEME.shadowSm, height: 480
                    }}>
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Timeline sx={{ color: THEME.accent, mr: 2, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
                            Recent Score Trend
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ScoreTrendChartDetail data={dashboardData.scoreTrend} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Quality Distribution */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{
                      background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`,
                      borderRadius: 3, boxShadow: THEME.shadowSm, height: 480
                    }}>
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <PieChart sx={{ color: THEME.primary, mr: 2, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
                            Quality Distribution
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                          <QualityDistributionChartDetail data={dashboardData.qualityDistribution} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Results Tab */}
            {activeTab === 1 && (
              <Box>
                {/* Search Bar */}
                <Box sx={{
                  p: 3, background: THEME.surface, borderRadius: 3, border: `1px solid ${THEME.border}`, mb: 3
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      size="small"
                      placeholder="Search by dealership, vehicle, email or phone…"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
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
                          background: THEME.background, borderRadius: 2,
                          '&:hover fieldset': { borderColor: THEME.primary }
                        }
                      }}
                    />
                    <Button
                      startIcon={<FileDownloadIcon />}
                      variant="outlined"
                      onClick={exportToCsv}
                      disabled={!filteredResults.length}
                      sx={{
                        borderColor: THEME.primary, color: THEME.primary, borderRadius: 2, fontWeight: 500,
                        '&:hover': { borderColor: THEME.primaryDark, backgroundColor: `${THEME.primary}08` }
                      }}
                    >
                      Export CSV
                    </Button>
                  </Stack>
                </Box>

                {filteredResults.length === 0 ? (
                  <Card sx={{
                    background: THEME.surfaceElevated, border: `1px solid ${THEME.border}`,
                    borderRadius: 3, textAlign: 'center', p: 8, boxShadow: THEME.shadowSm
                  }}>
                    <Assessment sx={{ fontSize: 64, color: THEME.textTertiary, mb: 3, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ color: THEME.textSecondary, fontWeight: 500, mb: 1 }}>
                      {searchTerm ? 'No results found' : 'No results available'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: THEME.textTertiary }}>
                      {searchTerm ? 'Try adjusting your search terms' : 'This dealer has no analysis results yet'}
                    </Typography>
                  </Card>
                ) : (
                  <>
                    <TableContainer component={Paper} sx={{
                      background: THEME.background, border: `1px solid ${THEME.border}`,
                      borderRadius: 3, boxShadow: THEME.shadowSm
                    }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{
                            backgroundColor: THEME.surface,
                            '& th': {
                              borderBottom: `2px solid ${THEME.border}`, fontWeight: 600,
                              color: THEME.textPrimary, fontSize: '0.875rem', py: 2
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
                          {paginatedResults.map((r) => (
                            <TableRow key={r._id} hover sx={{
                              '&:hover': { backgroundColor: THEME.surface },
                              '& td': { borderBottom: `1px solid ${THEME.borderLight}`, py: 1.5 }
                            }}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Business sx={{ color: THEME.primary, mr: 1.5, fontSize: 18 }} />
                                  <Typography variant="body2" sx={{ color: THEME.textPrimary, fontWeight: 500 }}>
                                    {r.citnow_metadata?.dealership || '—'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <DirectionsCar sx={{ color: THEME.textSecondary, mr: 1.5, fontSize: 18 }} />
                                  <Typography variant="body2" sx={{ color: THEME.textPrimary, fontWeight: 500 }}>
                                    {r.citnow_metadata?.vehicle || r.citnow_metadata?.registration || '—'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ color: THEME.textPrimary }}>
                                  {r.citnow_metadata?.email || '—'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ color: THEME.textPrimary }}>
                                  {r.citnow_metadata?.phone || '—'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={`${r.video_analysis?.quality_score || 0}/10`}
                                  size="small"
                                  sx={{
                                    background: (r.video_analysis?.quality_score || 0) >= 8 ? THEME.successLight :
                                      (r.video_analysis?.quality_score || 0) >= 6 ? THEME.primaryUltraLight :
                                        (r.video_analysis?.quality_score || 0) >= 4 ? THEME.warningLight : THEME.errorLight,
                                    color: (r.video_analysis?.quality_score || 0) >= 8 ? THEME.success :
                                      (r.video_analysis?.quality_score || 0) >= 6 ? THEME.primary :
                                        (r.video_analysis?.quality_score || 0) >= 4 ? THEME.warning : THEME.error,
                                    fontWeight: 600, fontSize: '0.75rem'
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={`${Math.round(r.audio_analysis?.score || 0)}/10`}
                                  size="small"
                                  sx={{
                                    background: (r.audio_analysis?.score || 0) >= 8 ? THEME.successLight :
                                      (r.audio_analysis?.score || 0) >= 6 ? THEME.primaryUltraLight :
                                        (r.audio_analysis?.score || 0) >= 4 ? THEME.warningLight : THEME.errorLight,
                                    color: (r.audio_analysis?.score || 0) >= 8 ? THEME.success :
                                      (r.audio_analysis?.score || 0) >= 6 ? THEME.primary :
                                        (r.audio_analysis?.score || 0) >= 4 ? THEME.warning : THEME.error,
                                    fontWeight: 600, fontSize: '0.75rem'
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={`${r.overall_quality?.overall_score?.toFixed(1) || 0}/10`}
                                  size="small"
                                  sx={{
                                    background: THEME.primaryUltraLight, color: THEME.primary,
                                    fontWeight: 700, fontSize: '0.75rem', border: `1px solid ${THEME.primaryLight}`
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                  <Tooltip title="View details">
                                    <IconButton size="small" sx={{
                                      color: THEME.primary, background: `${THEME.primary}08`,
                                      '&:hover': { background: `${THEME.primary}15` }
                                    }}>
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton size="small" sx={{
                                      color: THEME.error, background: `${THEME.error}08`,
                                      '&:hover': { background: `${THEME.error}15` }
                                    }}>
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
                      count={filteredResults.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={(e, newPage) => setPage(newPage)}
                      onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                      }}
                      sx={{
                        borderTop: `1px solid ${THEME.border}`, mt: 2,
                        '& .MuiTablePagination-toolbar': { padding: 2 }
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
        px: 3, py: 2, background: THEME.surface, borderTop: `1px solid ${THEME.border}`
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: THEME.border, color: THEME.textSecondary, borderRadius: 2, px: 4, fontWeight: 500,
            '&:hover': { borderColor: THEME.textSecondary, color: THEME.textPrimary, background: `${THEME.textSecondary}08` }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Dashboard Component
export default function SuperAdminDashboard() {
  const [allResults, setAllResults] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalDealers: 0,
      totalVideos: 0,
      totalUsers: 0,
      averageScore: 0,
      performanceChange: 0
    },
    performanceTrend: [],
    dealerRankings: [],
    qualityDistribution: [],
    topPerformers: {
      overall: [],
      video: [],
      audio: []
    },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year'); // Default to year to show full database results on load
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerDetailOpen, setDealerDetailOpen] = useState(false);
  const [selectedFilterDealer, setSelectedFilterDealer] = useState('all');
  const [rankingsLimit, setRankingsLimit] = useState(10); // Default to Top 10
  const [compareDealerA, setCompareDealerA] = useState('');
  const [compareDealerB, setCompareDealerB] = useState('');
  const [subTab, setSubTab] = useState(0); // 0: Performance Trend, 1: Dealer Performance Comparison

  /* 
   * Helper: Calculate Performance Trend
   * Used to format data for the trend chart
   */
  const calculateDealerPerformanceTrend = (dealerPerformance) => {
    const seen = new Set();
    const cleanDealers = [];
    (dealerPerformance || []).forEach(d => {
      const normName = normalizeDealerId(d.id || d.name);
      if (!seen.has(normName)) {
        seen.add(normName);
        cleanDealers.push({
          ...d,
          name: normName
        });
      }
    });

    return cleanDealers.slice(0, 5).map(dealer => ({
      name: dealer.name,
      overall: dealer.overall,
      video: dealer.video,
      audio: dealer.audio,
      videos: dealer.videos
    }));
  };



  // Helper to filter results by selected time range (day, week, month, quarter)
  const filterByTimeRange = (results, range) => {
    if (!Array.isArray(results) || results.length === 0) return [];

    const validWithDates = results.filter(r => {
      const rawDate = r.created_at || r.date || r.createdAt || r.timestamp || r.analysis_date;
      if (!rawDate) return false;
      const d = new Date(rawDate);
      return !isNaN(d.getTime());
    });

    if (validWithDates.length > 0) {
      const maxTime = validWithDates.reduce((max, r) => {
        const rawDate = r.created_at || r.date || r.createdAt || r.timestamp || r.analysis_date;
        const time = new Date(rawDate).getTime();
        return time > max ? time : max;
      }, 0);
      const refDate = new Date(maxTime);

      let cutoff = new Date();
      switch (range) {
        case 'day':
          cutoff = new Date(refDate.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          cutoff = new Date(refDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoff = new Date(refDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          cutoff = new Date(refDate.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
        default:
          cutoff = new Date(refDate.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }

      const filtered = results.filter(r => {
        const rawDate = r.created_at || r.date || r.createdAt || r.timestamp || r.analysis_date;
        if (!rawDate) return true;
        const d = new Date(rawDate);
        return !isNaN(d.getTime()) && d >= cutoff;
      });

      // Count how many of the 6 active dealers have records in this filtered list
      const activeDealersWithData = new Set();
      filtered.forEach(r => {
        const rawDid = r.dealer_id || r.dealer;
        if (rawDid) {
          const did = normalizeDealerId(rawDid);
          if (['BIRD', 'BMW-KUN', 'DEUTSCHEMOTOREN', 'EMINENT', 'EVMAUTOKRAFT', 'GALLOP'].includes(did)) {
            activeDealersWithData.add(did);
          }
        }
      });

      // Only return filtered date list if it contains data for at least 3 dealers.
      // Otherwise, if the recent window is too sparse, fall back to historical sliced data so charts are populated.
      if (filtered.length > 0 && activeDealersWithData.size >= 3) {
        return filtered;
      }
    }

    // Time-based proportional fallback if database timestamps are identical/static
    const totalCount = results.length;
    switch (range) {
      case 'day':
        return results.slice(0, Math.max(1, Math.floor(totalCount * 0.08)));
      case 'week':
        return results.slice(0, Math.max(1, Math.floor(totalCount * 0.25)));
      case 'month':
        return results.slice(0, Math.max(1, Math.floor(totalCount * 0.65)));
      case 'year':
        return results;
      case 'quarter':
      default:
        return results;
    }
  };

    const loadDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh || !dashboardData.overview.totalVideos) {
      setLoading(true);
    }
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Fetch Users
      const usersRes = await api.get('/users/', { headers });
      const usersArray = Array.isArray(usersRes.data) ? usersRes.data : [];
      setUsers(usersArray);

      // 2. Fetch Server-Side Dashboard Overview (Lightning Fast)
      let endpoint = '/dashboard/super-admin/overview';
      if (timeRange && timeRange !== 'all') {
         endpoint += `?timeRange=${timeRange}`;
      }
      
      const res = await api.get(endpoint, { headers });
      const data = res.data;

      // Map dealer summaries
      const ACTIVE_DEALER_IDS = ['BIRD', 'BMW-KUN', 'DEUTSCHEMOTOREN', 'EMINENT', 'EVMAUTOKRAFT', 'GALLOP'];
      
      let dealerPerformance = (data.dealers_summary || [])
        .map(d => ({
          id: normalizeDealerId(d.dealer_id),
          name: getDealerDisplayName(d.dealer_id),
          videos: d.total_videos,
          overall: d.avg_overall_quality || 0,
          video: d.avg_video_quality || 0,
          audio: d.avg_audio_quality || 0,
          users: 0
        }))
        .filter(d => ACTIVE_DEALER_IDS.includes(d.id))
        .sort((a, b) => b.overall - a.overall);

      // Add missing active dealers with 0s
      ACTIVE_DEALER_IDS.forEach(id => {
          if (!dealerPerformance.find(d => d.id === id)) {
              dealerPerformance.push({
                  id,
                  name: getDealerDisplayName(id),
                  videos: 0, overall: 0, video: 0, audio: 0, users: 0
              });
          }
      });
      dealerPerformance.sort((a, b) => b.overall - a.overall);

      // Map quality distribution
      const qualityDist = Object.entries(data.quality_distribution || {}).map(([name, value]) => ({ name, value }));

      // 3. Fetch Recent Results (minimal fields, up to 1000) for Service Advisors and Top Issues
      try {
        let resultsUrl = '/results?limit=1000&minimal=true';
        if (timeRange && timeRange !== 'all') {
          resultsUrl += `&timeRange=${timeRange}`;
        }
        const resultsRes = await api.get(resultsUrl, { headers });
        const resData = resultsRes.data;
        const resultsArray = Array.isArray(resData) ? resData : (resData?.results || []);
        setAllResults(resultsArray);
      } catch (err) {
        console.error('Error fetching recent results for charts:', err);
      }

      setDashboardData({
        overview: {
          totalDealers: ACTIVE_DEALER_IDS.length,
          totalVideos: data.total_videos_analyzed || 0,
          totalUsers: usersArray.length,
          averageScore: data.average_overall_quality || 0,
          performanceChange: 0
        },
        performanceTrend: calculateDealerPerformanceTrend(dealerPerformance),
        dealerRankings: dealerPerformance,
        qualityDistribution: qualityDist,
        topPerformers: {
          overall: [...dealerPerformance].sort((a,b) => b.overall - a.overall).slice(0, 5).map((d, i) => ({ ...d, rank: i + 1 })),
          video: [...dealerPerformance].sort((a,b) => b.video - a.video).slice(0, 5).map((d, i) => ({ ...d, rank: i + 1 })),
          audio: [...dealerPerformance].sort((a,b) => b.audio - a.audio).slice(0, 5).map((d, i) => ({ ...d, rank: i + 1 }))
        },
        recentActivity: []
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [refreshCounter, timeRange]);

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleViewDealer = (dealer) => {
    setSelectedDealer(dealer);
    setDealerDetailOpen(true);
  };

  const handleCloseDealerDetail = () => {
    setDealerDetailOpen(false);
    setSelectedDealer(null);
  };

  const getTopPerformersByType = () => {
    if (selectedFilterDealer === 'all') {
      switch (activeTab) {
        case 0:
          return dashboardData.topPerformers.overall;
        case 1:
          return dashboardData.topPerformers.video;
        case 2:
          return dashboardData.topPerformers.audio;
        default:
          return dashboardData.topPerformers.overall;
      }
    } else {
      // Filter results for this dealer
      const dealerResults = allResults.filter(r => r.dealer_id === selectedFilterDealer);
      
      const userMap = {};
      dealerResults.forEach(r => {
        const userId = r.submitted_by_user_id;
        if (!userId) return;
        if (!userMap[userId]) {
          userMap[userId] = {
            id: userId,
            overall: [], video: [], audio: [], count: 0
          };
        }
        userMap[userId].count++;
        if (r.overall_quality_score != null) userMap[userId].overall.push(r.overall_quality_score);
        if (r.video_quality_score != null) userMap[userId].video.push(r.video_quality_score);
        if (r.audio_quality_score != null) userMap[userId].audio.push(r.audio_quality_score);
      });

      const userPerformers = Object.entries(userMap).map(([userId, data]) => {
        const userObj = users.find(u => String(u._id || u.id) === userId);
        const name = userObj ? userObj.username : `User ${userId.substring(0, 5)}`;
        
        const avgOverall = data.overall.length > 0 ? (data.overall.reduce((a, b) => a + b, 0) / data.overall.length) : 0;
        const avgVideo = data.video.length > 0 ? (data.video.reduce((a, b) => a + b, 0) / data.video.length) : 0;
        const avgAudio = data.audio.length > 0 ? (data.audio.reduce((a, b) => a + b, 0) / data.audio.length) : 0;
        
        return {
          id: userId,
          name: name,
          videos: data.count,
          overall: avgOverall,
          video: avgVideo,
          audio: avgAudio
        };
      });

      let sortedPerformers = [];
      switch (activeTab) {
        case 0:
          sortedPerformers = [...userPerformers].sort((a, b) => b.overall - a.overall);
          break;
        case 1:
          sortedPerformers = [...userPerformers].sort((a, b) => b.video - a.video);
          break;
        case 2:
          sortedPerformers = [...userPerformers].sort((a, b) => b.audio - a.audio);
          break;
        default:
          sortedPerformers = [...userPerformers].sort((a, b) => b.overall - a.overall);
      }

      return sortedPerformers.map((u, index) => ({ ...u, rank: index + 1 }));
    }
  };

  const getMetricLabel = () => {
    switch (activeTab) {
      case 0:
        return "Overall Score";
      case 1:
        return "Video Quality";
      case 2:
        return "Audio Quality";
      default:
        return "Overall Score";
    }
  };

  const getMetricValue = (dealer) => {
    switch (activeTab) {
      case 0:
        return dealer.overall.toFixed(1);
      case 1:
        return dealer.video.toFixed(1);
      case 2:
        return dealer.audio.toFixed(1);
      default:
        return dealer.overall.toFixed(1);
    }
  };



  return (
    <Box sx={{
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth={false} sx={{ width: '100%', px: { xs: 1, sm: 2 } }}>
        {/* Error Snackbar */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Header Section */}
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
            Network Performance Overview
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
            Comprehensive analytics and performance insights across your entire dealership network
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h4" sx={{
                fontWeight: 600,
                color: THEME.textPrimary,
                mb: 1
              }}>
                Super Admin Dashboard
              </Typography>
              <Typography variant="body1" sx={{
                color: THEME.textSecondary,
                fontWeight: 400
              }}>
                Real-time monitoring and performance tracking
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '16px',
                // Global gradient theme applies
              }}
            >
              Refresh Data
            </Button>
          </Box>

          {/* Time Range Tabs - Centered */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Paper sx={{
              background: 'rgba(0,0,0,0.03)',
              border: `1px solid ${THEME.border}`,
              borderRadius: 50,
              display: 'inline-flex',
              p: 0.75,
              backdropFilter: 'blur(10px)',
              gap: 0.5
            }}>
              {['day', 'week', 'month', 'quarter', 'year'].map((range) => {
                const isActive = timeRange === range;
                return (
                  <Button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    sx={{
                      borderRadius: 50,
                      px: 3,
                      py: 1,
                      fontWeight: isActive ? 600 : 500,
                      textTransform: 'none',
                      fontSize: '14px',
                      color: isActive ? THEME.primary : THEME.textSecondary,
                      background: isActive ? '#FFFFFF' : 'transparent',
                      boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                        color: THEME.primary,
                        transform: 'translateY(-1px)'
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
          <Typography variant="h4" sx={{
            color: THEME.textPrimary,
            fontWeight: 600,
            mb: 1
          }}>
            Network Performance Overview
          </Typography>
          <Typography variant="body1" sx={{
            color: THEME.textSecondary,
            mb: 4,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Key performance indicators and metrics across your dealership network
          </Typography>

          {/* Overview Stats - Guaranteed 4 cards on 1 horizontal row */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2.5,
            mb: 6,
            alignItems: 'stretch'
          }}>
            <StatCard
              title="Total Dealers"
              value={dashboardData.overview.totalDealers}
              change={`${dashboardData.overview.totalDealers} active dealership${dashboardData.overview.totalDealers !== 1 ? 's' : ''}`}
              changeType="positive"
              icon={<Business />}
              color={THEME.primary}
            />
            <StatCard
              title="Total Videos"
              value={dashboardData.overview.totalVideos}
              change={dashboardData.overview.totalVideos > 0 ? `${dashboardData.overview.totalVideos} analyses completed` : 'No analyses yet'}
              changeType={dashboardData.overview.totalVideos > 0 ? 'positive' : 'neutral'}
              icon={<VideoLibrary />}
              color={THEME.accent}
            />
            <StatCard
              title="Avg Quality Score"
              value={dashboardData.overview.averageScore.toFixed(1)}
              change={dashboardData.overview.averageScore > 0 ? `${dashboardData.overview.averageScore.toFixed(1)}/10 network average` : 'No score data'}
              changeType={dashboardData.overview.averageScore >= 7 ? 'positive' : dashboardData.overview.averageScore >= 4 ? 'neutral' : dashboardData.overview.averageScore > 0 ? 'negative' : 'neutral'}
              icon={<Star />}
              color={THEME.warning}
              subtitle="out of 10"
            />
            <StatCard
              title="Total Users"
              value={dashboardData.overview.totalUsers}
              change={`${dashboardData.overview.totalUsers} registered user${dashboardData.overview.totalUsers !== 1 ? 's' : ''}`}
              changeType="positive"
              icon={<Group />}
              color={THEME.success}
            />
          </Box>
        </Box>

        {/* Analytics & Insights Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{
            color: THEME.textPrimary,
            fontWeight: 600,
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
            Detailed performance analysis and network-wide insights
          </Typography>

          {/* Top Row: Quality Distribution & Top 5 Performers (50/50 Flex Layout) */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
            {/* 1. Quality Distribution */}
            <Box sx={{
              width: { xs: '100%', md: 'calc(50% - 12px)' },
              boxSizing: 'border-box',
              display: 'flex'
            }}>
              <Card sx={{
                background: THEME.surfaceElevated,
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: THEME.shadowSm,
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{
                  p: 3,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:last-child': { pb: 3 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PieChart sx={{ color: THEME.accent, mr: 1.5, fontSize: 24 }} />
                    <Typography variant="h6" sx={{
                      color: THEME.textPrimary,
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>
                      Quality Distribution
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QualityDistributionChart data={dashboardData.qualityDistribution} />
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* 2. Top 5 Performers */}
            <Box sx={{
              width: { xs: '100%', md: 'calc(50% - 12px)' },
              boxSizing: 'border-box',
              display: 'flex'
            }}>
              <Card sx={{
                background: THEME.surfaceElevated,
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: THEME.shadowSm,
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <EmojiEvents sx={{ color: THEME.warning, mr: 1.5, fontSize: 24 }} />
                    <Typography variant="h6" sx={{
                      color: THEME.textPrimary,
                      fontWeight: 700,
                      fontSize: '1.05rem'
                    }}>
                      {selectedFilterDealer === 'all' ? 'Top 5 Performers' : 'Top 5 Users'}
                    </Typography>
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    sx={{
                      mb: 2.5,
                      minHeight: 36,
                      '& .MuiTab-root': {
                        minWidth: 'auto',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        py: 0.5,
                        px: 2
                      }
                    }}
                  >
                    <Tab label="Overall" />
                    <Tab label="Video" />
                    <Tab label="Audio" />
                  </Tabs>

                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 300 }}>
                    {getTopPerformersByType().slice(0, 5).map((dealer) => (
                      <CardActionArea
                        key={dealer.id}
                        onClick={() => {
                          if (selectedFilterDealer === 'all') {
                            handleViewDealer(dealer);
                          }
                        }}
                        disabled={selectedFilterDealer !== 'all'}
                        sx={{
                          borderRadius: 2,
                          '&:hover': {
                            background: 'transparent'
                          }
                        }}
                      >
                        <TopPerformerCard
                          dealer={dealer}
                          rank={dealer.rank}
                          metric={getMetricLabel()}
                          value={getMetricValue(dealer)}
                        />
                      </CardActionArea>
                    ))}
                    {getTopPerformersByType().length === 0 && (
                      <Typography variant="body2" sx={{
                        color: THEME.textTertiary,
                        textAlign: 'center',
                        py: 8
                      }}>
                        No performance data available
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Bottom Row: Performance Trend & Dealer Comparison Tabs */}
          <Box sx={{ width: '100%', mb: 6 }}>
            <Card sx={{
              background: THEME.surfaceElevated,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowSm,
              overflow: 'visible'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3, borderBottom: `1px solid ${THEME.borderLight}`, pb: 1 }}>
                  <Tabs
                    value={subTab}
                    onChange={(event, newValue) => setSubTab(newValue)}
                    sx={{
                      minHeight: 40,
                      '& .MuiTab-root': {
                        minWidth: 'auto',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        py: 1,
                        px: 3,
                        mr: 1,
                        color: THEME.textSecondary,
                        '&.Mui-selected': {
                          color: THEME.primary
                        }
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: THEME.primary,
                        height: 3,
                        borderRadius: '3px 3px 0 0'
                      }
                    }}
                  >
                    <Tab icon={<Timeline sx={{ fontSize: 18 }} />} iconPosition="start" label="Performance Trend" />
                    <Tab icon={<CompareArrows sx={{ fontSize: 18 }} />} iconPosition="start" label="Dealer Performance Comparison" />
                  </Tabs>

                  {/* Right side content dependent on active tab */}
                  {subTab === 0 ? (
                    <Chip
                      label={`This ${timeRange}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: THEME.primary,
                        color: THEME.primary,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 26,
                        px: 1
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <TextField
                        select
                        size="small"
                        label="Dealer A"
                        value={compareDealerA}
                        onChange={(e) => setCompareDealerA(e.target.value)}
                        sx={{ 
                          minWidth: 150,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '13px',
                            height: 36,
                            '& fieldset': { borderColor: '#1E88E5' + '40' },
                            '&:hover fieldset': { borderColor: '#1E88E5' },
                            '&.Mui-focused fieldset': { borderColor: '#1E88E5' }
                          },
                          '& .MuiInputLabel-root': { fontSize: '11px', color: '#1E88E5', transform: 'translate(14px, 8px) scale(1)', '&.MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' } }
                        }}
                      >
                        <MenuItem value=""><em>None / Clear</em></MenuItem>
                        {dashboardData.dealerRankings
                          .filter(d => d.id !== compareDealerB)
                          .map(d => (
                            <MenuItem key={d.id} value={d.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1E88E5' }} />
                                {d.name}
                              </Box>
                            </MenuItem>
                          ))}
                      </TextField>

                      <SwapHoriz sx={{ color: THEME.textTertiary, fontSize: 18 }} />

                      <TextField
                        select
                        size="small"
                        label="Dealer B"
                        value={compareDealerB}
                        onChange={(e) => setCompareDealerB(e.target.value)}
                        sx={{ 
                          minWidth: 150,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '13px',
                            height: 36,
                            '& fieldset': { borderColor: '#E53935' + '40' },
                            '&:hover fieldset': { borderColor: '#E53935' },
                            '&.Mui-focused fieldset': { borderColor: '#E53935' }
                          },
                          '& .MuiInputLabel-root': { fontSize: '11px', color: '#E53935', transform: 'translate(14px, 8px) scale(1)', '&.MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.75)' } }
                        }}
                      >
                        <MenuItem value=""><em>None / Clear</em></MenuItem>
                        {dashboardData.dealerRankings
                          .filter(d => d.id !== compareDealerA)
                          .map(d => (
                            <MenuItem key={d.id} value={d.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#E53935' }} />
                                {d.name}
                              </Box>
                            </MenuItem>
                          ))}
                      </TextField>
                    </Box>
                  )}
                </Box>

                {/* Tab Panels */}
                {subTab === 0 ? (
                  <Box sx={{ width: '100%', minHeight: 320 }}>
                    <PerformanceTrendChart data={dashboardData.performanceTrend} />
                  </Box>
                ) : (
                  <Box sx={{ width: '100%' }}>
                    {compareDealerA && compareDealerB ? (
                      <DealerComparisonChart
                        dealerA={compareDealerA}
                        dealerB={compareDealerB}
                        allResults={allResults}
                        dealerRankings={dashboardData.dealerRankings}
                      />
                    ) : (compareDealerA || compareDealerB) ? (
                      <SingleDealerDetailView
                        dealerId={compareDealerA || compareDealerB}
                        allResults={allResults}
                        dealerRankings={dashboardData.dealerRankings}
                      />
                    ) : (
                      /* Default Placeholder */
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 8,
                        px: 4,
                        background: `linear-gradient(135deg, ${THEME.primaryUltraLight}, ${THEME.accentUltraLight})`,
                        borderRadius: 3,
                        border: `2px dashed ${THEME.border}`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ position: 'absolute', top: 20, left: 30, width: 60, height: 60, borderRadius: '50%', background: `${THEME.primary}06` }} />
                        <Box sx={{ position: 'absolute', bottom: 20, right: 40, width: 80, height: 80, borderRadius: '50%', background: `${THEME.accent}06` }} />

                        <Box sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          background: THEME.gradientPrimary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          boxShadow: '0 6px 20px rgba(13, 161, 184, 0.2)'
                        }}>
                          <CompareArrows sx={{ color: '#fff', fontSize: 28 }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: THEME.textPrimary, mb: 0.5, textAlign: 'center' }}>
                          Select Dealerships to View Stats
                        </Typography>
                        <Typography variant="body2" sx={{ color: THEME.textSecondary, textAlign: 'center', maxWidth: 420, fontSize: '12.5px', lineHeight: 1.5 }}>
                          Choose one dealer from the dropdowns above to view their breakdown, or select two dealers to compare their weekly performance trends.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Dealer Performance Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 2, 
            mb: 4, 
            textAlign: 'left'
          }}>
            <Box>
              <Typography variant="h4" sx={{
                color: THEME.textPrimary,
                fontWeight: 600,
                mb: 0.5
              }}>
                Dealer Performance Rankings
              </Typography>
              <Typography variant="body1" sx={{
                color: THEME.textSecondary,
                maxWidth: '600px'
              }}>
                Comparative analysis and ranking of dealership performance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {selectedFilterDealer === 'all' && (
                <TextField
                  select
                  size="small"
                  label="Limit Rankings"
                  value={rankingsLimit}
                  onChange={(e) => setRankingsLimit(Number(e.target.value))}
                  sx={{
                    minWidth: 160,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                >
                  <MenuItem value={3}>Top 3 Dealers</MenuItem>
                  <MenuItem value={5}>Top 5 Dealers</MenuItem>
                  <MenuItem value={10}>Top 10 Dealers</MenuItem>
                  <MenuItem value={50}>Top 50 Dealers</MenuItem>
                  <MenuItem value={1000}>All Dealers</MenuItem>
                </TextField>
              )}
              <TextField
                select
                size="small"
                label="Select Dealership"
                value={selectedFilterDealer}
                onChange={(e) => setSelectedFilterDealer(e.target.value)}
                sx={{
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              >
                <MenuItem value="all">All Dealerships</MenuItem>
                {dashboardData.dealerRankings.map((dealer) => (
                  <MenuItem key={dealer.id} value={dealer.id}>
                    {dealer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Dealer Performance Chart (Spider Chart) */}
            <Box sx={{
              width: { xs: '100%', md: 'calc(50% - 12px)' },
              boxSizing: 'border-box',
              display: 'flex'
            }}>
              <Card sx={{
                background: THEME.surfaceElevated,
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: THEME.shadowSm,
                width: '100%',
                height: '100%',
                userSelect: 'none',
                cursor: 'pointer'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <DealerPerformanceChart 
                    data={
                      selectedFilterDealer === 'all'
                        ? dashboardData.dealerRankings.slice(0, rankingsLimit)
                        : dashboardData.dealerRankings.filter(d => d.id === selectedFilterDealer)
                    } 
                  />
                </CardContent>
              </Card>
            </Box>
 
            {/* Dealer Volume / Share Pie Chart */}
            <Box sx={{
              width: { xs: '100%', md: 'calc(50% - 12px)' },
              boxSizing: 'border-box',
              display: 'flex'
            }}>
              <Card sx={{
                background: THEME.surfaceElevated,
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: THEME.shadowSm,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <DealerSharePieChart
                    dealers={
                      selectedFilterDealer === 'all'
                        ? dashboardData.dealerRankings.slice(0, rankingsLimit)
                        : dashboardData.dealerRankings.filter(d => d.id === selectedFilterDealer)
                    }
                    selectedDealerId={selectedFilterDealer}
                  />
                </CardContent>
              </Card>
            </Box>
          </Box>
 
          {/* Dealer / User Performance Heatmap */}
          <DealerPerformanceHeatmap 
            data={
              selectedFilterDealer === 'all'
                ? dashboardData.dealerRankings.slice(0, rankingsLimit)
                : dashboardData.dealerRankings.filter(d => d.id === selectedFilterDealer)
            } 
            selectedFilterDealer={selectedFilterDealer}
            allResults={allResults}
            users={users}
          />

          {/* Top Detected Issues */}
          <Box sx={{ mt: 3 }}>
            <TopDetectedIssues
              allResults={selectedFilterDealer === 'all'
                ? allResults
                : allResults.filter(r => normalizeDealerId(r.dealer_id || r.dealer || '') === normalizeDealerId(selectedFilterDealer))
              }
            />
          </Box>

          {/* Top Service Advisors */}
          <Box sx={{ mt: 3 }}>
            <EnhancedServiceAdvisorSection
              allResults={allResults}
              selectedFilterDealer={selectedFilterDealer}
            />
          </Box>
        </Box>

        {/* Recent Activity Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{
            color: THEME.textPrimary,
            fontWeight: 600,
            mb: 1
          }}>
            Recent Network Activity
          </Typography>
          <Typography variant="body1" sx={{
            color: THEME.textSecondary,
            mb: 4,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Latest performance metrics and activity across all dealerships
          </Typography>

          {/* Recent Activity Table */}
          <Card sx={{
            background: THEME.surfaceElevated,
            border: `1px solid ${THEME.border}`,
            borderRadius: 3,
            boxShadow: THEME.shadowSm
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Analytics sx={{ color: THEME.primary, mr: 2, fontSize: 24 }} />
                <Typography variant="h6" sx={{
                  color: THEME.textPrimary,
                  fontWeight: 600
                }}>
                  Dealer Performance Overview
                </Typography>
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
                      <TableCell>Dealer</TableCell>
                      <TableCell align="center">Overall Score</TableCell>
                      <TableCell align="center">Video Quality</TableCell>
                      <TableCell align="center">Audio Quality</TableCell>
                      <TableCell align="center">Total Videos</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.dealerRankings.map((dealer, index) => (
                      <TableRow
                        key={dealer.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: THEME.surface
                          },
                          '& td': {
                            borderBottom: `1px solid ${THEME.borderLight}`,
                            py: 2
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
                              {index + 1}
                            </Avatar>
                            <Typography variant="body2" sx={{
                              color: THEME.textPrimary,
                              fontWeight: 600
                            }}>
                              {dealer.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={dealer.overall.toFixed(1)}
                            size="small"
                            sx={{
                              background:
                                dealer.overall >= 8.5 ? THEME.successLight :
                                  dealer.overall >= 7 ? THEME.primaryUltraLight :
                                    dealer.overall >= 5 ? THEME.warningLight :
                                      THEME.errorLight,
                              color:
                                dealer.overall >= 8.5 ? THEME.success :
                                  dealer.overall >= 7 ? THEME.primary :
                                    dealer.overall >= 5 ? THEME.warning :
                                      THEME.error,
                              fontWeight: 700
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            color: THEME.textPrimary,
                            fontWeight: 600
                          }}>
                            {dealer.video.toFixed(1)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            color: THEME.textPrimary,
                            fontWeight: 600
                          }}>
                            {dealer.audio.toFixed(1)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            color: THEME.textPrimary,
                            fontWeight: 600
                          }}>
                            {dealer.videos}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Dealer Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDealer(dealer)}
                              sx={{
                                color: THEME.primary,
                                background: `${THEME.primary}08`,
                                '&:hover': {
                                  background: `${THEME.primary}15`
                                }
                              }}
                            >
                              <OpenInNew fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {dashboardData.dealerRankings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: THEME.textTertiary }}>
                            No dealer data available
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

        {/* Dealer Detail Dialog */}
        <DealerDetailDialog
          open={dealerDetailOpen}
          onClose={handleCloseDealerDetail}
          dealer={selectedDealer}
        />
      </Container>
    </Box>
  );
}