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
  CardActionArea
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
  Badge
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
  ReferenceLine
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
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
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

  // Colors for each dealer
  const DEALER_COLORS = ['#1C69D4', '#00C853', '#FFC400', '#FF5252', '#7C4DFF', '#00BCD4'];

  // Build radar data: axes are the metric categories
  const radarData = [
    {
      metric: 'Overall Score',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, d.overall || 0]))
    },
    {
      metric: 'Video Quality',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, d.video ?? d.video_quality ?? d.overall ?? 0]))
    },
    {
      metric: 'Audio Quality',
      fullMark: 10,
      ...Object.fromEntries(data.map(d => [d.name, d.audio ?? d.audio_quality ?? d.overall ?? 0]))
    }
  ];

  const avgScore = (
    data.reduce((sum, d) => sum + d.overall, 0) / data.length
  ).toFixed(1);

  // Custom tooltip
  const CustomRadarTooltip = ({ active, payload, label }) => {
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
            {label}
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
        gap: 3,
        mb: 2,
        width: '100%'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
            <TrendingUp sx={{ fontSize: 16, color: THEME.success, mr: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.success }}>
              {Math.max(...data.map(d => d.overall)).toFixed(1)}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
            TOP SCORE
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
            <Star sx={{ fontSize: 16, color: THEME.warning, mr: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.warning }}>
              {avgScore}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
            AVG SCORE
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
            <Business sx={{ fontSize: 16, color: THEME.primary, mr: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: THEME.primary }}>
              {data.length}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
            DEALERS
          </Typography>
        </Box>
      </Box>

      {/* Radar / Spider Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={radarData} outerRadius="75%">
          <PolarGrid stroke={THEME.border} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 11, fontWeight: 600, fill: THEME.textSecondary }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fontSize: 10, fill: THEME.textTertiary }}
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
              dot={{ r: 4, fill: DEALER_COLORS[i % DEALER_COLORS.length] }}
            />
          ))}
          <RechartsTooltip content={<CustomRadarTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
            iconType="circle"
            iconSize={8}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};



const DealerPerformanceHeatmap = ({ data, selectedFilterDealer, allResults, users }) => {
  const getCellColor = (val) => {
    if (val >= 8.5) return { bg: '#E8F5E9', text: '#2E7D32' };
    if (val >= 7.0) return { bg: '#E3F2FD', text: '#1565C0' };
    if (val >= 5.5) return { bg: '#FFF3E0', text: '#EF6C00' };
    return { bg: '#FFEBEE', text: '#C62828' };
  };

  let rows = [];
  let title = "Dealership Performance Heatmap";

  if (selectedFilterDealer === 'all') {
    rows = data.map(d => ({
      id: d.id,
      name: d.name,
      overall: d.overall,
      video: d.video,
      audio: d.audio,
      videos: d.videos
    }));
  } else {
    const selectedDealerObj = data.find(d => d.id === selectedFilterDealer);
    const dealerName = selectedDealerObj ? selectedDealerObj.name : 'Selected Dealership';
    title = `${dealerName} — User Performance Heatmap`;

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

    rows = Object.entries(userMap).map(([userId, data]) => {
      const userObj = users.find(u => String(u._id || u.id) === userId);
      const name = userObj ? userObj.username : `User ${userId.substring(0, 5)}`;
      
      const avgOverall = data.overall.length > 0 ? (data.overall.reduce((a, b) => a + b, 0) / data.overall.length) : 0;
      const avgVideo = data.video.length > 0 ? (data.video.reduce((a, b) => a + b, 0) / data.video.length) : 0;
      const avgAudio = data.audio.length > 0 ? (data.audio.reduce((a, b) => a + b, 0) / data.audio.length) : 0;
      
      return {
        id: userId,
        name: name,
        overall: avgOverall,
        video: avgVideo,
        audio: avgAudio,
        videos: data.count
      };
    }).sort((a, b) => b.overall - a.overall);
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
        <TableContainer sx={{ borderRadius: 2, border: `1px solid ${THEME.borderLight}`, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: THEME.surface,
                '& th': {
                  fontWeight: 600,
                  color: THEME.textPrimary,
                  fontSize: '0.875rem',
                  py: 1.5
                }
              }}>
                <TableCell>{selectedFilterDealer === 'all' ? 'Dealership' : 'User / Advisor'}</TableCell>
                <TableCell align="center">Overall Score</TableCell>
                <TableCell align="center">Video Quality</TableCell>
                <TableCell align="center">Audio Quality</TableCell>
                <TableCell align="center">Total Videos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const overallStyle = getCellColor(row.overall);
                const videoStyle = getCellColor(row.video);
                const audioStyle = getCellColor(row.audio);

                return (
                  <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: THEME.surface } }}>
                    <TableCell sx={{ fontWeight: 600, py: 1.5, color: THEME.textPrimary }}>{row.name}</TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        backgroundColor: overallStyle.bg, 
                        color: overallStyle.text, 
                        fontWeight: 700,
                        py: 1.5,
                        transition: 'background-color 0.2s'
                      }}
                    >
                      {row.overall.toFixed(1)}
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        backgroundColor: videoStyle.bg, 
                        color: videoStyle.text, 
                        fontWeight: 700,
                        py: 1.5,
                        transition: 'background-color 0.2s'
                      }}
                    >
                      {row.video.toFixed(1)}
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{ 
                        backgroundColor: audioStyle.bg, 
                        color: audioStyle.text, 
                        fontWeight: 700,
                        py: 1.5,
                        transition: 'background-color 0.2s'
                      }}
                    >
                      {row.audio.toFixed(1)}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500, py: 1.5, color: THEME.textSecondary }}>{row.videos}</TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: THEME.textTertiary }}>
                      No performance data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};



const QualityDistributionChart = ({ data }) => {
  const filteredData = data.filter(item => item.value > 0);

  if (filteredData.length === 0) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="body2" sx={{ color: THEME.textTertiary, mb: 2 }}>No quality data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
            outerRadius={80}
            innerRadius={40}
            dataKey="value"
            paddingAngle={2}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS.qualityGradient[index % CHART_COLORS.qualityGradient.length]} />
            ))}
          </Pie>
          <RechartsTooltip
            formatter={(value, name) => [`${value} videos`, name]}
            contentStyle={{
              background: THEME.background,
              border: `1px solid ${THEME.border}`,
              borderRadius: 8,
              boxShadow: THEME.shadowMd,
              fontSize: '12px'
            }}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ paddingLeft: '10px', fontSize: '11px', width: '120px' }}
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
      borderBottom: `1px solid ${THEME.border}`,
      transition: 'all 0.2s ease-in-out',
      '&:last-child': { borderBottom: 'none' },
      '&:hover': { background: THEME.primaryUltraLight }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '50%', background: rank === 1 ? THEME.gradientAccent :
            rank === 2 ? THEME.gradientPrimary : rank === 3 ? THEME.gradientSuccess : THEME.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, fontWeight: 700, fontSize: '14px',
          color: rank <= 3 ? THEME.background : THEME.textSecondary, boxShadow: THEME.shadowMd, flexShrink: 0
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
          fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, ml: 1
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
      const res = await api.get(`/results?dealer_id=${encodeURIComponent(dealerId)}`);
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
  const [timeRange, setTimeRange] = useState('week');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [dealerDetailOpen, setDealerDetailOpen] = useState(false);
  const [selectedFilterDealer, setSelectedFilterDealer] = useState('all');

  /* 
   * Helper: Calculate Performance Trend
   * Used to format data for the trend chart
   */
  const calculateDealerPerformanceTrend = (dealerPerformance) => {
    const topDealers = dealerPerformance.slice(0, 7);

    return topDealers.map(dealer => ({
      name: dealer.name.length > 10 ? dealer.name.substring(0, 10) + '...' : dealer.name,
      overall: dealer.overall,
      video: dealer.video,
      audio: dealer.audio,
      videos: dealer.videos
    }));
  };



  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load users first (always works)
      const usersData = await listUsers();
      const usersArray = Array.isArray(usersData) ? usersData : [];
      setUsers(usersArray);

      // Map Dealer IDs to Names using User Data
      const dealerNames = {};
      const dealerIds = new Set();
      usersArray.forEach(u => {
        if (u.dealer_id) {
          dealerIds.add(u.dealer_id);
          if (u.showroom_name) {
            dealerNames[u.dealer_id] = u.showroom_name;
          }
        }
      });

      // Try to load overview stats (may fail if no analysis data yet)
      let overview = {
        dealers_summary: [],
        total_videos_analyzed: 0,
        average_overall_quality: 0,
        quality_distribution: {}
      };

      try {
        const overviewRes = await api.get(`/dashboard/super-admin/overview?timeRange=${timeRange}`);
        overview = overviewRes.data;
        console.log('Overview data:', overview);
      } catch (overviewError) {
        console.warn('Could not load overview stats:', overviewError);
      }

      // Also fetch all results for live trend calculations
      let resultsArray = [];
      try {
        const resultsRes = await api.get(`/results?limit=1000&timeRange=${timeRange}`);
        const resData = resultsRes.data;
        resultsArray = Array.isArray(resData) ? resData : (resData?.results || []);
      } catch (resError) {
        console.warn('Could not load results for trends:', resError);
      }
      setAllResults(resultsArray);

      // Use results data as fallback if overview returned 0
      const totalVideos = overview.total_videos_analyzed || resultsArray.length || 0;
      const validScores = resultsArray
        .filter(r => r.overall_quality_score != null)
        .map(r => r.overall_quality_score);
      const avgFromResults = validScores.length > 0
        ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10 : 0;
      const avgScore = overview.average_overall_quality || avgFromResults || 0;

      // Transform Dealer Performance Data
      const dealerPerformance = (overview.dealers_summary || []).map(d => ({
        id: d.dealer_id,
        name: dealerNames[d.dealer_id] || d.dealer_id || 'Unknown Dealer',
        videos: d.total_videos,
        overall: d.avg_overall_quality,
        video: d.avg_video_quality ?? d.avg_overall_quality,
        audio: d.avg_audio_quality ?? d.avg_overall_quality,
        users: 0
      })).sort((a, b) => b.overall - a.overall);

      // If overview didn't return dealer summaries, compute from results
      if (dealerPerformance.length === 0 && resultsArray.length > 0) {
        const dealerMap = {};
        resultsArray.forEach(r => {
          const did = r.dealer_id;
          if (!did) return;
          if (!dealerMap[did]) dealerMap[did] = { overall: [], video: [], audio: [], count: 0 };
          dealerMap[did].count++;
          if (r.overall_quality_score != null) dealerMap[did].overall.push(r.overall_quality_score);
          if (r.video_quality_score != null) dealerMap[did].video.push(r.video_quality_score);
          if (r.audio_quality_score != null) dealerMap[did].audio.push(r.audio_quality_score);
        });
        Object.entries(dealerMap).forEach(([did, data]) => {
          const avgOverall = data.overall.length > 0
            ? Math.round((data.overall.reduce((a, b) => a + b, 0) / data.overall.length) * 10) / 10 : 0;
          const avgVideo = data.video.length > 0
            ? Math.round((data.video.reduce((a, b) => a + b, 0) / data.video.length) * 10) / 10 : 0;
          const avgAudio = data.audio.length > 0
            ? Math.round((data.audio.reduce((a, b) => a + b, 0) / data.audio.length) * 10) / 10 : 0;
          dealerPerformance.push({
            id: did,
            name: dealerNames[did] || did,
            videos: data.count,
            overall: avgOverall,
            video: avgVideo,
            audio: avgAudio,
            users: 0
          });
        });
        dealerPerformance.sort((a, b) => b.overall - a.overall);
      }

      // Transform Quality Distribution
      let qualityDist = Object.entries(overview.quality_distribution || {}).map(([name, value]) => ({
        name,
        value
      }));

      // Fallback: compute from results if empty
      if (qualityDist.length === 0 && resultsArray.length > 0) {
        const distMap = {};
        resultsArray.forEach(r => {
          const label = r.overall_quality_label;
          if (label) distMap[label] = (distMap[label] || 0) + 1;
        });
        qualityDist = Object.entries(distMap).map(([name, value]) => ({ name, value }));
      }

      setDashboardData({
        overview: {
          totalDealers: dealerIds.size || overview.dealers_summary?.length || 0,
          totalVideos: totalVideos,
          totalUsers: usersArray.length,
          averageScore: avgScore,
          performanceChange: 0
        },
        performanceTrend: calculateDealerPerformanceTrend(dealerPerformance),
        dealerRankings: dealerPerformance,
        qualityDistribution: qualityDist,
        topPerformers: {
          overall: dealerPerformance.slice(0, 5).map((d, i) => ({ ...d, rank: i + 1 })),
          video: dealerPerformance.slice(0, 5).map((d, i) => ({ ...d, rank: i + 1 })),
          audio: dealerPerformance.slice(0, 5).map((d, i) => ({ ...d, rank: i + 1 }))
        },
        recentActivity: []
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [refreshCounter, timeRange]);

  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
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
              {['day', 'week', 'month', 'quarter'].map((range) => {
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

          {/* Overview Stats */}
          <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Dealers"
                value={dashboardData.overview.totalDealers}
                change={`${dashboardData.overview.totalDealers} active dealership${dashboardData.overview.totalDealers !== 1 ? 's' : ''}`}
                changeType="positive"
                icon={<Business />}
                color={THEME.primary}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Videos"
                value={dashboardData.overview.totalVideos}
                change={dashboardData.overview.totalVideos > 0 ? `${dashboardData.overview.totalVideos} analyses completed` : 'No analyses yet'}
                changeType={dashboardData.overview.totalVideos > 0 ? 'positive' : 'neutral'}
                icon={<VideoLibrary />}
                color={THEME.accent}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Avg Quality Score"
                value={dashboardData.overview.averageScore.toFixed(1)}
                change={dashboardData.overview.averageScore > 0 ? `${dashboardData.overview.averageScore.toFixed(1)}/10 network average` : 'No score data'}
                changeType={dashboardData.overview.averageScore >= 7 ? 'positive' : dashboardData.overview.averageScore >= 4 ? 'neutral' : dashboardData.overview.averageScore > 0 ? 'negative' : 'neutral'}
                icon={<Star />}
                color={THEME.warning}
                subtitle="out of 10"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={dashboardData.overview.totalUsers}
                change={`${dashboardData.overview.totalUsers} registered user${dashboardData.overview.totalUsers !== 1 ? 's' : ''}`}
                changeType="positive"
                icon={<Group />}
                color={THEME.success}
              />
            </Grid>
          </Grid>
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

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
            {/* Performance Trend */}
            <Grid item xs={12} lg={8}>
              <Card sx={{
                background: THEME.surfaceElevated,
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: THEME.shadowSm,
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Timeline sx={{ color: THEME.primary, mr: 2, fontSize: 24 }} />
                      <Typography variant="h6" sx={{
                        color: THEME.textPrimary,
                        fontWeight: 600
                      }}>
                        Network Performance Trend
                      </Typography>
                    </Box>
                    <Chip
                      label={`This ${timeRange}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: THEME.primary,
                        color: THEME.primary,
                        fontWeight: 500
                      }}
                    />
                  </Box>
                  <PerformanceTrendChart data={dashboardData.performanceTrend} />
                </CardContent>
              </Card>
            </Grid>

            {/* Quality Distribution */}
            <Grid item xs={12} lg={4}>
              <Card sx={{
                background: THEME.surfaceElevated,
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: THEME.shadowSm,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minWidth: '500px'
              }}>
                <CardContent sx={{
                  p: 3,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  '&:last-child': { pb: 3 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PieChart sx={{ color: THEME.accent, mr: 2, fontSize: 24 }} />
                    <Typography variant="h6" sx={{
                      color: THEME.textPrimary,
                      fontWeight: 600
                    }}>
                      Quality Distribution
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
                    <QualityDistributionChart data={dashboardData.qualityDistribution} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
            <TextField
              select
              size="small"
              label="Select Dealership"
              value={selectedFilterDealer}
              onChange={(e) => setSelectedFilterDealer(e.target.value)}
              sx={{
                minWidth: 240,
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

          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {/* Dealer Performance Chart */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Card sx={{
                background: THEME.surfaceElevated,
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: THEME.shadowSm,
                height: '100%',
                userSelect: 'none',
                cursor: 'pointer'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <DealerPerformanceChart 
                    data={
                      selectedFilterDealer === 'all'
                        ? dashboardData.dealerRankings
                        : dashboardData.dealerRankings.filter(d => d.id === selectedFilterDealer)
                    } 
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Top Performers */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Card sx={{
                background: THEME.surfaceElevated,
                border: `1px solid ${THEME.border}`,
                borderRadius: 3,
                boxShadow: THEME.shadowSm,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <EmojiEvents sx={{ color: THEME.warning, mr: 2, fontSize: 24 }} />
                    <Typography variant="h6" sx={{
                      color: THEME.textPrimary,
                      fontWeight: 600
                    }}>
                      {selectedFilterDealer === 'all' ? 'Top 5 Performers' : 'Top 5 Users'}
                    </Typography>
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    sx={{
                      mb: 3,
                      '& .MuiTab-root': {
                        minWidth: 'auto',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        textTransform: 'none'
                      }
                    }}
                  >
                    <Tab label="Overall" />
                    <Tab label="Video" />
                    <Tab label="Audio" />
                  </Tabs>

                  <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto' }}>
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
                          borderRadius: 0,
                          '&:hover': {
                            background: THEME.primaryUltraLight
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
                        py: 4
                      }}>
                        No performance data available
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Dealer / User Performance Heatmap */}
          <DealerPerformanceHeatmap 
            data={dashboardData.dealerRankings} 
            selectedFilterDealer={selectedFilterDealer} 
            allResults={allResults} 
            users={users} 
          />
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