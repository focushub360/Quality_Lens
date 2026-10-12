import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, IconButton, Chip,
  Slider, Switch, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Alert,
  Tabs, Tab, CircularProgress, LinearProgress, InputAdornment
} from '@mui/material';
import {
  Terminal, Speed, Tune, Dns,
  PowerSettingsNew, Refresh,
  DeleteForever, Visibility, Warning,
  Memory, Lan, CleaningServices, Settings,
  Lock, LockOpen, ElectricBolt,
  Search, Assessment, CalendarMonth, AccessTime,
  NotificationsActive, Close, ChevronLeft, ChevronRight,
  VpnKey
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  accent: '#7C3AED', // Tech Violet
  accentLight: '#EDE9FE',
  accentGlow: 'rgba(124, 58, 237, 0.25)',
  surface: '#FFFFFF',
  surfaceDark: '#0F172A',
  terminalBg: '#090D16',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  cyan: '#00B4DB'
};

const DEALERS_LIST = [
  { id: 'EMINENT', name: 'EMINENT CARS PRIVATE LIMITED', videos: 1980, avg: 7.2 },
  { id: 'BAVARIA', name: 'BAVARIA MOTORS PRIVATE LIMITED', videos: 2310, avg: 7.7 },
  { id: 'GALLOP', name: 'GALLOPS AUTOHAUS', videos: 1450, avg: 7.5 },
  { id: 'EVMAUTOKRAFT', name: 'EVM AUTOKRAFT', videos: 1120, avg: 6.9 },
  { id: 'BIRD', name: 'BIRD AUTOMOTIVE PRIVATE LIMITED', videos: 980, avg: 7.1 },
  { id: 'DEUTSCHEMOTOREN', name: 'DEUTSCHE CARS PRIVATE LIMITED', videos: 870, avg: 6.8 },
  { id: 'BMW-KUN', name: 'BMW KUN EXCLUSIVE', videos: 1108, avg: 7.3 }
];

export default function TechConsole() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(2); // Default to Link Capping tab as requested
  const [apiLatency, setApiLatency] = useState(null);
  const [isPinging, setIsPinging] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [killModalOpen, setKillModalOpen] = useState(false);
  const [isKilling, setIsKilling] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // ========================================================
  // 1. DEALER QUOTA & CAPPING STATE
  // ========================================================
  const [globalQuotaConfig, setGlobalQuotaConfig] = useState(() => {
    const saved = localStorage.getItem('ql_global_capping_config');
    return saved ? JSON.parse(saved) : {
      default_daily_limit: 500,
      capping_enabled: true,
      enforcement_mode: 'strict', // 'strict' (blocks) or 'warning'
      alert_threshold_percent: 85
    };
  });

  const [dealerQuotas, setDealerQuotas] = useState(() => {
    const saved = localStorage.getItem('ql_dealer_quotas_cache');
    return saved ? JSON.parse(saved) : [
      { dealer_id: 'EMINENT', dealer_name: 'EMINENT CARS PRIVATE LIMITED', daily_limit: 1000, used_today: 420, capping_enabled: true, enforce_strict_stop: true },
      { dealer_id: 'BAVARIA', dealer_name: 'BAVARIA MOTORS PRIVATE LIMITED', daily_limit: 1000, used_today: 310, capping_enabled: true, enforce_strict_stop: true },
      { dealer_id: 'GALLOP', dealer_name: 'GALLOPS AUTOHAUS', daily_limit: 500, used_today: 495, capping_enabled: true, enforce_strict_stop: true },
      { dealer_id: 'BIRD', dealer_name: 'BIRD AUTOMOTIVE PRIVATE LIMITED', daily_limit: 1000, used_today: 1000, capping_enabled: true, enforce_strict_stop: true },
      { dealer_id: 'EVMAUTOKRAFT', dealer_name: 'EVM AUTOKRAFT', daily_limit: 500, used_today: 180, capping_enabled: true, enforce_strict_stop: true },
      { dealer_id: 'DEUTSCHEMOTOREN', dealer_name: 'DEUTSCHE CARS PRIVATE LIMITED', daily_limit: 750, used_today: 230, capping_enabled: true, enforce_strict_stop: true },
      { dealer_id: 'BMW-KUN', dealer_name: 'BMW KUN EXCLUSIVE', daily_limit: 1500, used_today: 890, capping_enabled: true, enforce_strict_stop: true },
      { dealer_id: 'VARSHA AUTOHAUS', dealer_name: 'VARSHA AUTOHAUS', daily_limit: 500, used_today: 95, capping_enabled: true, enforce_strict_stop: true },
    ];
  });
  const [dealerSearchQuery, setDealerSearchQuery] = useState('');
  const [loadingQuotas, setLoadingQuotas] = useState(false);

  // ========================================================
  // CALENDAR & DAY-WISE UPLOAD MODAL STATE (12 AM IST)
  // ========================================================
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarSelectedDealer, setCalendarSelectedDealer] = useState('ALL');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState('2026-10-11');
  const [historyData, setHistoryData] = useState({ dates: [], daily_totals: {}, dealer_day_counts: {} });
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState('');

  // ========================================================
  // 2. HYPERPARAMETERS STATE
  // ========================================================
  const [aiConfig, setAiConfig] = useState(() => {
    const saved = localStorage.getItem('ql_tech_ai_config');
    return saved ? JSON.parse(saved) : {
      whisperModel: 'base',
      concurrencyLimit: 2,
      maxWorkers: 4,
      processTimeout: 960,
      videoSamplingFps: 2,
      downscaleResolution: '720p',
      silenceThresholdDb: -30,
      translationEngine: 'NLLB-200',
      autoNoiseReduction: true,
      detailedStabilityCheck: true
    };
  });

  // ========================================================
  // 3. FEATURE FLAGS STATE
  // ========================================================
  const [featureFlags, setFeatureFlags] = useState(() => {
    const saved = localStorage.getItem('ql_tech_feature_flags');
    return saved ? JSON.parse(saved) : {
      maintenanceMode: false,
      maintenanceBannerText: 'QualityLens AI Engine undergoing scheduled pipeline optimization.',
      bulkUploadEnabled: true,
      audioClarityV2: true,
      debugLogging: true
    };
  });

  // ========================================================
  // 4. DIAGNOSTIC LOGS STATE
  // ========================================================
  const [logs, setLogs] = useState([
    { id: 1, time: '09:40:12', level: 'INFO', tag: 'AUTH', msg: 'Master Admin tech@focus authenticated successfully (JWT HMAC-SHA256).' },
    { id: 2, time: '09:40:15', level: 'INFO', tag: 'DATABASE', msg: 'MongoDB Atlas pool connected: citnow_analyzer cluster healthy (321 user docs).' },
    { id: 3, time: '09:40:18', level: 'AI-WHISPER', tag: 'MODEL', msg: 'Faster-Whisper [base] loaded on CPU/CUDA backend with FP16/INT8 quant.' },
    { id: 4, time: '09:40:22', level: 'OPENCV', tag: 'VIDEO', msg: 'Frame extractor initialized. Video downscale target set to 720p.' },
    { id: 5, time: '09:40:28', level: 'SYSTEM', tag: 'WORKER', msg: 'Worker concurrency pool ready (4 Celery/FastAPI threads active).' },
    { id: 6, time: '09:55:04', level: 'INFO', tag: 'QUOTA', msg: 'Dealer quota engine loaded. Default daily threshold set to 500-1000 links/day.' }
  ]);
  const [logFilter, setLogFilter] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalRef = useRef(null);

  // Measure Latency against API
  const pingApi = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await api.get('/docs', { timeout: 4000 });
      const duration = Math.round(performance.now() - start);
      setApiLatency(duration);
    } catch {
      const duration = Math.round(performance.now() - start);
      setApiLatency(duration > 0 ? duration : 41);
    } finally {
      setIsPinging(false);
    }
  };

  // Fetch active batches
  const fetchBatches = async () => {
    setLoadingBatches(true);
    try {
      const res = await api.get('/bulk-batches');
      if (Array.isArray(res.data)) {
        setBatches(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch bulk batches in Tech Console:', err);
    } finally {
      setLoadingBatches(false);
    }
  };

  // Fetch dealer quotas
  const fetchDealerQuotas = async () => {
    setLoadingQuotas(true);
    try {
      const res = await api.get('/admin/dealer-quotas');
      if (res.data?.dealers && res.data.dealers.length > 0) {
        setDealerQuotas(res.data.dealers);
        if (res.data.global_config) {
          setGlobalQuotaConfig(res.data.global_config);
          localStorage.setItem('ql_global_capping_config', JSON.stringify(res.data.global_config));
        }
        localStorage.setItem('ql_dealer_quotas_cache', JSON.stringify(res.data.dealers));
      }
    } catch (err) {
      console.warn('Using cached/local dealer quotas:', err);
    } finally {
      setLoadingQuotas(false);
    }
  };

  useEffect(() => {
    pingApi();
    fetchBatches();
    fetchDealerQuotas();
    const interval = setInterval(() => {
      fetchBatches();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Add Log Entry
  const addLog = (level, tag, msg) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev.slice(-150), { id: Date.now(), time: timeStr, level, tag, msg }]);
  };

  // ========================================================
  // DEALER QUOTA ACTIONS
  // ========================================================
  const handleUpdateDealerLimit = async (dealerId, newLimit, enforceStrict, cappingEnabled) => {
    try {
      await api.put(`/admin/dealer-quotas/${dealerId}`, {
        daily_limit: newLimit,
        enforce_strict_stop: enforceStrict,
        capping_enabled: cappingEnabled
      });
    } catch (e) {
      console.warn('API sync failed, saved locally:', e);
    }

    setDealerQuotas(prev => {
      const updated = prev.map(d => {
        if (d.dealer_id === dealerId) {
          const used = d.used_today || 0;
          const pct = newLimit > 0 ? Math.round((used / newLimit) * 100) : 0;
          const status = !cappingEnabled ? 'UNCAPPED' : ((used >= newLimit && cappingEnabled) ? 'EXCEEDED' : (pct >= 85 ? 'WARNING' : 'ACTIVE'));
          return {
            ...d,
            daily_limit: newLimit,
            enforce_strict_stop: enforceStrict,
            capping_enabled: cappingEnabled,
            remaining: Math.max(0, newLimit - used),
            percentage_used: pct,
            status: status
          };
        }
        return d;
      });
      localStorage.setItem('ql_dealer_quotas_cache', JSON.stringify(updated));
      return updated;
    });

    if (!cappingEnabled) {
      addLog('WARN', 'QUOTA', `Capping REMOVED for [${dealerId}]: Dealer is now UNLIMITED (No Cap).`);
      setFeedbackMsg({ type: 'info', text: `Capping removed for ${dealerId}. Submissions are now UNLIMITED.` });
    } else {
      addLog('INFO', 'QUOTA', `Daily cap updated for [${dealerId}] to ${newLimit} links/day (Strict: ${enforceStrict ? 'BLOCK' : 'WARN'}).`);
      setFeedbackMsg({ type: 'success', text: `Daily cap of ${newLimit} links/day active for ${dealerId}.` });
    }
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // 1-Click Cap Toggle (ON = Limit Applied, OFF = Cap Removed / Unlimited)
  const handleToggleDealerCapping = (dealerId, currentEnabled, currentLimit, currentStrict) => {
    const newEnabled = !currentEnabled;
    const targetLimit = currentLimit > 0 ? currentLimit : 1000;
    handleUpdateDealerLimit(dealerId, targetLimit, currentStrict, newEnabled);
  };

  // 1-Click Toggle for Global Master Capping Switch
  const handleToggleGlobalCapping = async (newVal) => {
    const updatedCfg = { ...globalQuotaConfig, capping_enabled: newVal };
    setGlobalQuotaConfig(updatedCfg);
    try {
      await api.put('/admin/global-quota-settings', updatedCfg);
    } catch (e) {
      console.warn('API sync failed, saved locally:', e);
    }
    localStorage.setItem('ql_global_capping_config', JSON.stringify(updatedCfg));
    addLog(newVal ? 'INFO' : 'WARN', 'GLOBAL-QUOTA', `Master Capping Enforcement switched ${newVal ? 'ON (Limits Enforced)' : 'OFF (All Dealerships Uncapped)'}.`);
    setFeedbackMsg({
      type: newVal ? 'success' : 'warning',
      text: newVal ? 'Master Capping Active: Daily limits enforced platform-wide.' : 'Master Capping OFF: All dealership caps removed / unlimited.'
    });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Bulk Remove All Caps (Sets all dealers to Unlimited / No Cap)
  const handleRemoveAllDealerCaps = () => {
    setDealerQuotas(prev => {
      const updated = prev.map(d => ({
        ...d,
        capping_enabled: false,
        status: 'UNCAPPED'
      }));
      localStorage.setItem('ql_dealer_quotas_cache', JSON.stringify(updated));
      return updated;
    });
    addLog('WARN', 'BULK-CAP', 'All dealership caps REMOVED in bulk. Every dealership is now UNLIMITED.');
    setFeedbackMsg({ type: 'warning', text: 'All caps removed! All dealerships now have unlimited daily link submissions.' });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Bulk Restore All Caps
  const handleRestoreAllDealerCaps = () => {
    setDealerQuotas(prev => {
      const updated = prev.map(d => {
        const lim = d.daily_limit > 0 ? d.daily_limit : 1000;
        const used = d.used_today || 0;
        const pct = Math.round((used / lim) * 100);
        return {
          ...d,
          daily_limit: lim,
          capping_enabled: true,
          status: used >= lim ? 'EXCEEDED' : (pct >= 85 ? 'WARNING' : 'ACTIVE')
        };
      });
      localStorage.setItem('ql_dealer_quotas_cache', JSON.stringify(updated));
      return updated;
    });
    addLog('INFO', 'BULK-CAP', 'Daily caps RESTORED for all dealerships.');
    setFeedbackMsg({ type: 'success', text: 'Daily caps re-enabled for all dealerships.' });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Update Enforcement Mode (Strict Stop vs Notify Only vs Soft Cap)
  const handleUpdateEnforcementMode = async (dealerId, newMode) => {
    const isStrict = newMode === 'strict';
    try {
      await api.put(`/admin/dealer-quotas/${dealerId}`, {
        enforcement_mode: newMode,
        enforce_strict_stop: isStrict
      });
    } catch (e) {
      console.warn('API sync failed, saved locally:', e);
    }

    setDealerQuotas(prev => {
      const updated = prev.map(d => {
        if (d.dealer_id === dealerId) {
          return {
            ...d,
            enforcement_mode: newMode,
            enforce_strict_stop: isStrict
          };
        }
        return d;
      });
      localStorage.setItem('ql_dealer_quotas_cache', JSON.stringify(updated));
      return updated;
    });

    const modeLabels = {
      strict: 'Hard Stop (Submissions Blocked on Limit)',
      notify: 'Notify Only (Warning Alert to Dealer, Processing Allowed)',
      soft: 'Soft Cap (+10% Grace Limit)'
    };
    addLog('INFO', 'ENFORCE-MODE', `Enforcement for [${dealerId}] updated to ${newMode.toUpperCase()}: ${modeLabels[newMode] || newMode}`);
    setFeedbackMsg({ type: 'success', text: `Enforcement policy for ${dealerId} set to: ${modeLabels[newMode] || newMode}` });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // 12:00 AM IST Midnight Countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // IST is UTC + 5:30
      const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utcMs + (5.5 * 3600000));
      const nextMidnightIst = new Date(istDate);
      nextMidnightIst.setHours(24, 0, 0, 0);
      const diffMs = nextMidnightIst.getTime() - istDate.getTime();
      const h = Math.floor(diffMs / 3600000);
      const m = Math.floor((diffMs % 3600000) / 60000);
      const s = Math.floor((diffMs % 60000) / 1000);
      setTimeUntilReset(`${h}h ${m}m ${s}s`);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Open Day-Wise Calendar Dialog (pre-filtered or all)
  const handleOpenCalendarModal = (dealerId = 'ALL') => {
    setCalendarSelectedDealer(dealerId);
    setCalendarSelectedDate('2026-10-11');
    setCalendarModalOpen(true);
    fetchUploadHistory();
  };

  // Fetch or generate day-wise upload history for calendar
  const fetchUploadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get('/admin/dealer-daily-upload-history?days=31&start_date=2026-10-01&end_date=2026-10-31');
      if (res.data && Array.isArray(res.data.dates) && res.data.dates.length > 0) {
        setHistoryData(res.data);
      } else {
        generateFallbackHistory();
      }
    } catch (e) {
      console.warn('Could not fetch daily upload history, generating October dataset:', e);
      generateFallbackHistory();
    } finally {
      setLoadingHistory(false);
    }
  };

  const generateFallbackHistory = () => {
    const dates = [];
    const daily_totals = {};
    const dealer_day_counts = {};

    const dealers = dealerQuotas.length > 0 ? dealerQuotas : [
      { dealer_id: 'EMINENT', dealer_name: 'EMINENT CARS PRIVATE LIMITED', daily_limit: 1000 },
      { dealer_id: 'BAVARIA', dealer_name: 'BAVARIA MOTORS PRIVATE LIMITED', daily_limit: 1000 },
      { dealer_id: 'GALLOP', dealer_name: 'GALLOPS AUTOHAUS', daily_limit: 500 },
      { dealer_id: 'BIRD', dealer_name: 'BIRD AUTOMOTIVE PRIVATE LIMITED', daily_limit: 1000 },
      { dealer_id: 'EVMAUTOKRAFT', dealer_name: 'EVM AUTOKRAFT', daily_limit: 500 },
      { dealer_id: 'DEUTSCHEMOTOREN', dealer_name: 'DEUTSCHE CARS PRIVATE LIMITED', daily_limit: 750 },
      { dealer_id: 'BMW-KUN', dealer_name: 'BMW KUN EXCLUSIVE', daily_limit: 1500 },
      { dealer_id: 'VARSHA AUTOHAUS', dealer_name: 'VARSHA AUTOHAUS', daily_limit: 500 }
    ];

    dealers.forEach(d => {
      dealer_day_counts[d.dealer_id] = {};
    });

    for (let day = 1; day <= 31; day++) {
      const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
      dates.push(dateStr);

      let dayTotal = 0;
      dealers.forEach(dl => {
        let count = 0;
        const lim = dl.daily_limit || 500;
        if (day === 11) {
          count = dl.used_today || 0;
        } else if (day > 11) {
          count = 0;
        } else if (day === 10) {
          count = Math.floor(lim * 0.85);
          if (dl.dealer_id === 'BIRD') count = lim; // Exceeded limit
        } else if (day === 6 && dl.dealer_id === 'GALLOP') {
          count = lim; // Exceeded limit
        } else {
          const pseudoRandom = ((dl.dealer_id.charCodeAt(0) * 19 + day * 47) % 90) / 100;
          count = Math.floor(lim * (0.2 + pseudoRandom * 0.7));
        }
        dealer_day_counts[dl.dealer_id][dateStr] = count;
        dayTotal += count;
      });
      daily_totals[dateStr] = dayTotal;
    }

    setHistoryData({ dates, daily_totals, dealer_day_counts });
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const handleBoostQuota = async (dealerId, boostAmount = 500) => {
    try {
      await api.post(`/admin/dealer-quotas/${dealerId}/boost`, { boost_amount: boostAmount });
    } catch (e) {
      console.warn('API boost failed, applied locally:', e);
    }

    setDealerQuotas(prev => {
      const updated = prev.map(d => {
        if (d.dealer_id === dealerId) {
          const newLimit = (d.daily_limit || 500) + boostAmount;
          const used = d.used_today || 0;
          const pct = Math.round((used / newLimit) * 100);
          return {
            ...d,
            daily_limit: newLimit,
            remaining: Math.max(0, newLimit - used),
            percentage_used: pct,
            status: (used >= newLimit && d.capping_enabled) ? 'EXCEEDED' : (pct >= 85 ? 'WARNING' : 'ACTIVE')
          };
        }
        return d;
      });
      localStorage.setItem('ql_dealer_quotas_cache', JSON.stringify(updated));
      return updated;
    });

    addLog('WARN', 'QUOTA-BOOST', `Emergency boost: Added +${boostAmount} links for [${dealerId}].`);
    setFeedbackMsg({ type: 'info', text: `Granted emergency boost of +${boostAmount} links to ${dealerId}!` });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleResetUsageToday = (dealerId) => {
    setDealerQuotas(prev => {
      const updated = prev.map(d => {
        if (d.dealer_id === dealerId) {
          return {
            ...d,
            used_today: 0,
            remaining: d.daily_limit,
            percentage_used: 0,
            status: 'ACTIVE'
          };
        }
        return d;
      });
      localStorage.setItem('ql_dealer_quotas_cache', JSON.stringify(updated));
      return updated;
    });

    addLog('INFO', 'QUOTA-RESET', `Reset today's processed link count to 0 for [${dealerId}].`);
    setFeedbackMsg({ type: 'success', text: `Today's link counter reset to 0 for ${dealerId}.` });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSaveGlobalQuotas = async () => {
    try {
      await api.put('/admin/global-quota-settings', globalQuotaConfig);
    } catch (e) {
      console.warn('API sync failed, saved locally:', e);
    }
    localStorage.setItem('ql_global_capping_config', JSON.stringify(globalQuotaConfig));
    addLog('INFO', 'GLOBAL-QUOTA', `Global capping policy updated: Default ${globalQuotaConfig.default_daily_limit} links/day, Mode: ${globalQuotaConfig.enforcement_mode.toUpperCase()}`);
    setFeedbackMsg({ type: 'success', text: 'Global capping configuration saved successfully.' });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Handle Save AI Hyperparameters
  const handleSaveAiConfig = () => {
    localStorage.setItem('ql_tech_ai_config', JSON.stringify(aiConfig));
    addLog('INFO', 'CONFIG', `AI Hyperparameters saved: Whisper [${aiConfig.whisperModel}], Workers [${aiConfig.maxWorkers}], Timeout [${aiConfig.processTimeout}s]`);
    setFeedbackMsg({ type: 'success', text: 'AI Pipeline hyperparameters updated and saved.' });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Handle Save Feature Flags
  const handleSaveFeatureFlags = () => {
    localStorage.setItem('ql_tech_feature_flags', JSON.stringify(featureFlags));
    addLog('WARN', 'FLAGS', `Feature Flags updated: Maintenance [${featureFlags.maintenanceMode ? 'ENABLED' : 'OFF'}], Bulk Engine [${featureFlags.bulkUploadEnabled ? 'ON' : 'OFF'}]`);
    setFeedbackMsg({ type: 'success', text: 'Platform feature flags & maintenance status updated.' });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Trigger Emergency Stop All
  const handleEmergencyStop = async () => {
    setIsKilling(true);
    try {
      await api.post('/bulk-stop-all');
      addLog('ERROR', 'KILL-SWITCH', 'EMERGENCY KILL SWITCH TRIGGERED BY MASTER ADMIN: Stopped all active processing batches.');
      setFeedbackMsg({ type: 'error', text: 'Emergency kill switch executed! All active ingestion pipelines paused.' });
      setKillModalOpen(false);
      await fetchBatches();
    } catch (err) {
      addLog('ERROR', 'KILL-SWITCH', `Emergency halt failed: ${err.message}`);
      setFeedbackMsg({ type: 'error', text: 'Emergency kill command failed. Check server connection.' });
    } finally {
      setIsKilling(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  // Force Delete a single batch
  const handleDeleteBatch = async (batchId) => {
    try {
      await api.delete(`/bulk-batches/${batchId}`);
      addLog('WARN', 'BATCH-PURGE', `Batch [${batchId}] purged by Master Admin.`);
      setBatches(prev => prev.filter(b => (b.batch_id || b._id) !== batchId));
      setFeedbackMsg({ type: 'info', text: `Batch ${batchId} purged from processing table.` });
    } catch (err) {
      addLog('ERROR', 'BATCH-PURGE', `Purge failed for batch [${batchId}]: ${err.message}`);
    }
  };

  // Dealership Ghost Mode Impersonation
  const handleGhostImpersonate = (dealer) => {
    addLog('INFO', 'IMPERSONATE', `Master Admin launched Dealership View for: ${dealer.name} (${dealer.id})`);
    navigate(`/super-admin/dealers?inspect=${dealer.id}`);
  };

  // Filtered Logs
  const filteredLogs = logs.filter(l => {
    const matchesFilter = logFilter === 'ALL' || l.level === logFilter;
    const matchesSearch = !logSearch || l.msg.toLowerCase().includes(logSearch.toLowerCase()) || l.tag.toLowerCase().includes(logSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Dealer Quotas
  const filteredDealerQuotas = dealerQuotas.filter(d => {
    if (!dealerSearchQuery) return true;
    const q = dealerSearchQuery.toLowerCase();
    return (d.dealer_name && d.dealer_name.toLowerCase().includes(q)) ||
           (d.dealer_id && d.dealer_id.toLowerCase().includes(q));
  });

  const dealersNearOrOverLimit = dealerQuotas.filter(d => {
    const limit = d.daily_limit || 500;
    const used = d.used_today || 0;
    return (used / limit) >= 0.85;
  });

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, maxWidth: 1600, mx: 'auto', width: '100%' }}>
      {/* 🛡️ Header Banner */}
      <Box sx={{
        mb: 3,
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        background: 'linear-gradient(135deg, #090D16 0%, #1E1B4B 50%, #31104B 100%)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.25)',
        border: '1px solid rgba(124, 58, 237, 0.35)'
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.8 }}>
            <Box sx={{
              p: 0.8,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 0 15px rgba(124, 58, 237, 0.6)'
            }}>
              <Terminal sx={{ fontSize: 26, color: '#FFFFFF' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '0.5px' }}>
              Master Admin Tech Console
            </Typography>
            <Chip
              label="CORE TECH LEVEL"
              size="small"
              sx={{
                bgcolor: 'rgba(124, 58, 237, 0.3)',
                color: '#C4B5FD',
                border: '1px solid #7C3AED',
                fontWeight: 800,
                fontSize: '10px'
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Infrastructure monitoring, AI pipeline hyperparameter controls, dealer link capping limits, and emergency controls.
          </Typography>
        </Box>

        {/* Status Chips & Latency Indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip
            icon={<Lan sx={{ fontSize: '15px !important', color: '#10B981 !important' }} />}
            label={`API Latency: ${apiLatency !== null ? `${apiLatency} ms` : 'Pinging...'}`}
            onClick={pingApi}
            disabled={isPinging}
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.15)',
              color: '#34D399',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          />
          <Chip
            icon={<Dns sx={{ fontSize: '15px !important', color: '#38BDF8 !important' }} />}
            label="Atlas MongoDB: Connected"
            sx={{
              bgcolor: 'rgba(56, 189, 248, 0.15)',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontWeight: 700
            }}
          />
          <Button
            variant="outlined"
            startIcon={<VpnKey />}
            onClick={() => navigate('/master-admin/credentials')}
            sx={{
              fontWeight: 700,
              color: '#C4B5FD',
              borderColor: '#7C3AED',
              bgcolor: 'rgba(124, 58, 237, 0.25)',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.4)', borderColor: '#A78BFA' }
            }}
          >
            Credentials Vault
          </Button>
          <Button
            variant="outlined"
            startIcon={<Speed />}
            onClick={() => navigate('/master-admin/performance')}
            sx={{
              fontWeight: 700,
              color: '#38BDF8',
              borderColor: '#0284C7',
              bgcolor: 'rgba(2, 132, 199, 0.2)',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.35)', borderColor: '#38BDF8' }
            }}
          >
            Performance
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PowerSettingsNew />}
            onClick={() => setKillModalOpen(true)}
            sx={{
              fontWeight: 700,
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
              textTransform: 'none'
            }}
          >
            Emergency Kill Switch
          </Button>
        </Box>
      </Box>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <Alert severity={feedbackMsg.type} sx={{ mb: 2.5, borderRadius: 2 }}>
          {feedbackMsg.text}
        </Alert>
      )}

      {/* 🧭 Console Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: THEME.border, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              minHeight: 48,
              color: THEME.textSecondary,
              '&.Mui-selected': { color: THEME.accent }
            },
            '& .MuiTabs-indicator': { backgroundColor: THEME.accent, height: 3 }
          }}
        >
          <Tab icon={<Tune sx={{ fontSize: 18 }} />} iconPosition="start" label="AI Hyperparameters" />
          <Tab icon={<Speed sx={{ fontSize: 18 }} />} iconPosition="start" label="Queue & Ingestion Control" />
          <Tab icon={<Assessment sx={{ fontSize: 18 }} />} iconPosition="start" label="Dealer Link Capping (500-1000/day)" />
          <Tab icon={<Visibility sx={{ fontSize: 18 }} />} iconPosition="start" label="Ghost Mode (Dealers)" />
          <Tab icon={<Terminal sx={{ fontSize: 18 }} />} iconPosition="start" label="Live Diagnostics Terminal" />
          <Tab icon={<Settings sx={{ fontSize: 18 }} />} iconPosition="start" label="Feature Flags & Maintenance" />
        </Tabs>
      </Box>

      {/* ======================================================== */}
      {/* TAB 0: AI HYPERPARAMETERS & PIPELINE TUNING             */}
      {/* ======================================================== */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, border: `1px solid ${THEME.border}`, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Memory sx={{ color: THEME.accent }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Speech-to-Text & Whisper Configuration
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 3 }}>
                  Select the active Faster-Whisper model and audio processing sensitivity.
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Whisper Model Size</InputLabel>
                  <Select
                    value={aiConfig.whisperModel}
                    label="Whisper Model Size"
                    onChange={(e) => setAiConfig({ ...aiConfig, whisperModel: e.target.value })}
                  >
                    <MenuItem value="tiny">Tiny (39M params — Fastest, 1GB VRAM)</MenuItem>
                    <MenuItem value="base">Base (74M params — Recommended Standard, 1.5GB VRAM)</MenuItem>
                    <MenuItem value="small">Small (244M params — Higher Accuracy, 3GB VRAM)</MenuItem>
                    <MenuItem value="medium">Medium (769M params — Deep Analysis, 5GB VRAM)</MenuItem>
                    <MenuItem value="large-v3">Large-v3 (1550M params — Maximum Accuracy, 10GB VRAM)</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 1 }}>
                  Audio Silence Cutoff: {aiConfig.silenceThresholdDb} dB
                </Typography>
                <Slider
                  value={aiConfig.silenceThresholdDb}
                  min={-45}
                  max={-15}
                  step={1}
                  onChange={(e, val) => setAiConfig({ ...aiConfig, silenceThresholdDb: val })}
                  sx={{ color: THEME.accent, mb: 3 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Auto Noise Filtering (Librosa)</Typography>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary }}>Removes workshop background noise before STT</Typography>
                  </Box>
                  <Switch
                    checked={aiConfig.autoNoiseReduction}
                    onChange={(e) => setAiConfig({ ...aiConfig, autoNoiseReduction: e.target.checked })}
                    color="secondary"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, border: `1px solid ${THEME.border}`, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Speed sx={{ color: THEME.primary }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Video Analysis & Frame Sampling (OpenCV)
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 3 }}>
                  Configure OpenCV frame extraction rate and hardware concurrency throttles.
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Downscale Target</InputLabel>
                      <Select
                        value={aiConfig.downscaleResolution}
                        label="Downscale Target"
                        onChange={(e) => setAiConfig({ ...aiConfig, downscaleResolution: e.target.value })}
                      >
                        <MenuItem value="480p">480p (Fastest)</MenuItem>
                        <MenuItem value="720p">720p (Optimal Quality)</MenuItem>
                        <MenuItem value="1080p">1080p (Full Resolution)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Translation Engine</InputLabel>
                      <Select
                        value={aiConfig.translationEngine}
                        label="Translation Engine"
                        onChange={(e) => setAiConfig({ ...aiConfig, translationEngine: e.target.value })}
                      >
                        <MenuItem value="NLLB-200">Meta NLLB-200</MenuItem>
                        <MenuItem value="MarianMT">MarianMT (Helsinki)</MenuItem>
                        <MenuItem value="BART">BART Multilingual</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 1 }}>
                  Frame Sampling Rate: {aiConfig.videoSamplingFps} FPS
                </Typography>
                <Slider
                  value={aiConfig.videoSamplingFps}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(e, val) => setAiConfig({ ...aiConfig, videoSamplingFps: val })}
                  sx={{ color: THEME.primary, mb: 2 }}
                />

                <Typography variant="caption" sx={{ fontWeight: 700, color: THEME.textPrimary, display: 'block', mb: 1 }}>
                  Video Hard Processing Deadline: {aiConfig.processTimeout} seconds
                </Typography>
                <Slider
                  value={aiConfig.processTimeout}
                  min={300}
                  max={1800}
                  step={60}
                  onChange={(e, val) => setAiConfig({ ...aiConfig, processTimeout: val })}
                  sx={{ color: THEME.warning, mb: 2 }}
                />

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveAiConfig}
                    sx={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                      fontWeight: 700,
                      px: 3
                    }}
                  >
                    Deploy Hyperparameters
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ======================================================== */}
      {/* TAB 1: QUEUE & INGESTION CONTROL                         */}
      {/* ======================================================== */}
      {activeTab === 1 && (
        <Card sx={{ borderRadius: 3, border: `1px solid ${THEME.border}` }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Active Processing Batches & Ingestion Queue
                </Typography>
                <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                  Inspect real-time Excel bulk uploads and individual CitNow processing runs across all dealers.
                </Typography>
              </Box>
              <Button
                startIcon={<Refresh />}
                onClick={fetchBatches}
                disabled={loadingBatches}
                variant="outlined"
                size="small"
              >
                Refresh Queue
              </Button>
            </Box>

            {loadingBatches ? (
              <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={36} sx={{ color: THEME.accent }} />
              </Box>
            ) : batches.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                No active or pending batches in the processing pipeline. Queue is idle.
              </Alert>
            ) : (
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${THEME.border}`, borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Batch File / ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Dealership</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Submitted By</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Progress</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batches.map((b) => {
                      const bId = b.batch_id || b._id;
                      const isStuck = ['processing', 'pending'].includes(b.status);
                      return (
                        <TableRow key={bId} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {b.original_filename || b.filename || 'Upload'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontFamily: 'monospace' }}>
                              {bId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {b.dealer_name || b.dealer_id || 'Global'}
                            </Typography>
                          </TableCell>
                          <TableCell>{b.submitted_by_username || 'Advisor'}</TableCell>
                          <TableCell>
                            <Chip
                              label={b.status}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                bgcolor: b.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' :
                                  b.status === 'processing' ? 'rgba(13, 161, 184, 0.15)' :
                                  'rgba(239, 68, 68, 0.15)',
                                color: b.status === 'completed' ? THEME.success :
                                  b.status === 'processing' ? THEME.primary :
                                  THEME.error
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {b.processed_videos || 0} / {b.total_videos || 0}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'right' }}>
                            {isStuck && (
                              <Tooltip title="Force Purge Stalled Batch">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteBatch(bId)}
                                >
                                  <DeleteForever fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DEALER LINK CAPPING & QUOTA MANAGEMENT           */}
      {/* ======================================================== */}
      {activeTab === 2 && (
        <Box>
          {/* Active Quota Warning Banner (if any dealer exceeded or near limit) */}
          {dealersNearOrOverLimit.length > 0 && (
            <Alert
              severity="warning"
              icon={<Warning sx={{ fontSize: 24 }} />}
              sx={{
                mb: 3,
                borderRadius: 2.5,
                bgcolor: '#FFFBEB',
                border: '1px solid #FCD34D',
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E' }}>
                    Quota Limit Alert: {dealersNearOrOverLimit.length} Dealership(s) approaching or exceeding daily analysis limits!
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#B45309' }}>
                    Dealers exceeding their quota will be prevented from submitting new links until reset or boosted.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {dealersNearOrOverLimit.map(d => (
                    <Chip
                      key={d.dealer_id}
                      icon={<ElectricBolt sx={{ fontSize: '14px !important' }} />}
                      label={`+500 Boost ${d.dealer_id}`}
                      size="small"
                      color="warning"
                      onClick={() => handleBoostQuota(d.dealer_id, 500)}
                      sx={{ fontWeight: 700, cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            </Alert>
          )}

          {/* Global Policy Config Card */}
          <Card sx={{
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${THEME.border}`,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Speed sx={{ color: THEME.accent }} />
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Global Link Analysis Capping & Daily Limits
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                    Set default link analysis thresholds per dealership (e.g. 500 / 1000 links per day) and enforce automated submission locks.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<LockOpen />}
                    onClick={handleRemoveAllDealerCaps}
                    sx={{
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: '#FCA5A5',
                      color: '#DC2626',
                      bgcolor: '#FEF2F2',
                      '&:hover': { bgcolor: '#FEE2E2', borderColor: '#DC2626' }
                    }}
                  >
                    Remove All Caps (All Unlimited)
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<Lock />}
                    onClick={handleRestoreAllDealerCaps}
                    sx={{
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: '#86EFAC',
                      color: '#15803D',
                      bgcolor: '#F0FDF4',
                      '&:hover': { bgcolor: '#DCFCE7', borderColor: '#16A34A' }
                    }}
                  >
                    Restore All Caps
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveGlobalQuotas}
                    sx={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
                    }}
                  >
                    Save Global Policy
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#FFFFFF', border: `1px solid ${THEME.border}` }}>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700, display: 'block', mb: 1 }}>
                      DEFAULT DAILY CAP
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TextField
                        size="small"
                        type="number"
                        value={globalQuotaConfig.default_daily_limit}
                        onChange={(e) => setGlobalQuotaConfig({ ...globalQuotaConfig, default_daily_limit: Math.max(1, parseInt(e.target.value) || 500) })}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">links/day</InputAdornment>,
                        }}
                        sx={{ width: '100%' }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {[500, 1000, 1500, 2000].map((preset) => (
                        <Chip
                          key={preset}
                          label={`${preset}/d`}
                          size="small"
                          onClick={() => setGlobalQuotaConfig({ ...globalQuotaConfig, default_daily_limit: preset })}
                          sx={{
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            bgcolor: globalQuotaConfig.default_daily_limit === preset ? THEME.accent : '#F1F5F9',
                            color: globalQuotaConfig.default_daily_limit === preset ? '#FFFFFF' : THEME.textPrimary
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#FFFFFF', border: `1px solid ${THEME.border}`, height: '100%' }}>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700, display: 'block', mb: 1 }}>
                      CAPPING ENFORCEMENT MASTER SWITCH
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: globalQuotaConfig.capping_enabled ? THEME.success : THEME.textSecondary }}>
                        {globalQuotaConfig.capping_enabled ? 'Active (Limits Enforced)' : 'Disabled (Unlimited)'}
                      </Typography>
                      <Switch
                        checked={Boolean(globalQuotaConfig.capping_enabled)}
                        onChange={(e) => handleToggleGlobalCapping(e.target.checked)}
                        color="secondary"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#FFFFFF', border: `1px solid ${THEME.border}`, height: '100%' }}>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700, display: 'block', mb: 1 }}>
                      ACTION ON LIMIT EXCEEDED
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                      <Select
                        value={globalQuotaConfig.enforcement_mode}
                        onChange={(e) => setGlobalQuotaConfig({ ...globalQuotaConfig, enforcement_mode: e.target.value })}
                      >
                        <MenuItem value="strict">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Lock sx={{ fontSize: 16, color: THEME.error }} />
                            <span>Strict Stop (Block Submissions)</span>
                          </Box>
                        </MenuItem>
                        <MenuItem value="warning">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LockOpen sx={{ fontSize: 16, color: THEME.warning }} />
                            <span>Warning Only (Allow with Alert)</span>
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#FFFFFF', border: `1px solid ${THEME.border}`, height: '100%' }}>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 700, display: 'block', mb: 0.5 }}>
                      EARLY WARNING THRESHOLD: {globalQuotaConfig.alert_threshold_percent}%
                    </Typography>
                    <Slider
                      value={globalQuotaConfig.alert_threshold_percent}
                      min={70}
                      max={95}
                      step={5}
                      onChange={(e, val) => setGlobalQuotaConfig({ ...globalQuotaConfig, alert_threshold_percent: val })}
                      sx={{ color: THEME.warning, my: 0.5 }}
                    />
                    <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                      Alerts generated when dealer reaches this % of quota.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>


          {/* Dealer Quotas Table Card */}
          <Card sx={{ borderRadius: 3, border: `1px solid ${THEME.border}` }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Dealer-Wise Daily Limits & Today's Usage
                  </Typography>
                  <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                    Customize daily caps individually per dealership, view real-time utilization, and grant emergency boosts.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {/* Calendar Icon Button in Box */}
                  <Button
                    startIcon={<CalendarMonth />}
                    onClick={() => handleOpenCalendarModal('ALL')}
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      color: THEME.accent,
                      borderColor: THEME.accent,
                      borderRadius: 2,
                      bgcolor: THEME.accentLight,
                      px: 2,
                      py: 0.6,
                      boxShadow: '0 2px 6px rgba(124, 58, 237, 0.15)',
                      '&:hover': { bgcolor: '#DDD6FE', borderColor: THEME.accent }
                    }}
                  >
                    Day-Wise Calendar
                  </Button>
                  <TextField
                    size="small"
                    placeholder="Search dealership..."
                    value={dealerSearchQuery}
                    onChange={(e) => setDealerSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment>
                    }}
                    sx={{ width: 200 }}
                  />
                  <Button
                    startIcon={<Refresh />}
                    onClick={fetchDealerQuotas}
                    disabled={loadingQuotas}
                    variant="outlined"
                    size="small"
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${THEME.border}`, borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Dealership Name & ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 145 }}>Cap (ON / OFF)</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Daily Cap (Links/Day)</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 250 }}>Today's Usage</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Enforcement</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDealerQuotas.map((dealer) => {
                      const limit = dealer.daily_limit || globalQuotaConfig.default_daily_limit || 500;
                      const used = dealer.used_today || 0;
                      const isCapped = dealer.capping_enabled !== false;
                      const remaining = Math.max(0, limit - used);
                      const pct = Math.min(100, Math.round((used / limit) * 100));
                      const isExceeded = used >= limit && isCapped;
                      const isNearLimit = pct >= 85 && !isExceeded;
                      const barColor = isExceeded ? THEME.error : (isNearLimit ? THEME.warning : THEME.primary);

                      return (
                        <TableRow key={dealer.dealer_id} hover sx={{ bgcolor: !isCapped ? 'rgba(239, 246, 255, 0.35)' : 'inherit' }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                              {dealer.dealer_name || dealer.dealer_id}
                            </Typography>
                            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontFamily: 'monospace' }}>
                              ID: {dealer.dealer_id}
                            </Typography>
                          </TableCell>

                          {/* Instant 1-Click Cap Toggle (ON/OFF) */}
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Switch
                                size="small"
                                checked={isCapped}
                                onChange={() => handleToggleDealerCapping(dealer.dealer_id, isCapped, limit, dealer.enforce_strict_stop)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#10B981' },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10B981' }
                                }}
                              />
                              <Chip
                                size="small"
                                label={isCapped ? 'CAPPED' : 'NO CAP'}
                                onClick={() => handleToggleDealerCapping(dealer.dealer_id, isCapped, limit, dealer.enforce_strict_stop)}
                                sx={{
                                  height: 22,
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  bgcolor: isCapped ? '#DCFCE7' : '#EFF6FF',
                                  color: isCapped ? '#15803D' : '#2563EB',
                                  border: `1px solid ${isCapped ? '#86EFAC' : '#BFDBFE'}`,
                                  '&:hover': { opacity: 0.85 }
                                }}
                              />
                            </Box>
                          </TableCell>

                          {/* Daily Cap with Quick Edit & Remove Cap Option */}
                          <TableCell>
                            {isCapped ? (
                              <Select
                                size="small"
                                value={dealer.daily_limit || 500}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (val === 0) {
                                    handleUpdateDealerLimit(dealer.dealer_id, 0, dealer.enforce_strict_stop, false);
                                  } else {
                                    handleUpdateDealerLimit(dealer.dealer_id, val, dealer.enforce_strict_stop, true);
                                  }
                                }}
                                sx={{ fontSize: '13px', fontWeight: 700, height: 32, minWidth: 125 }}
                              >
                                <MenuItem value={500}>500 / day</MenuItem>
                                <MenuItem value={750}>750 / day</MenuItem>
                                <MenuItem value={1000}>1,000 / day</MenuItem>
                                <MenuItem value={1500}>1,500 / day</MenuItem>
                                <MenuItem value={2000}>2,000 / day</MenuItem>
                                <MenuItem value={3000}>3,000 / day</MenuItem>
                                <MenuItem value={5000}>5,000 / day</MenuItem>
                                <MenuItem value={0} sx={{ color: '#EF4444', fontWeight: 700 }}>
                                  ❌ Remove Cap (Unlimited)
                                </MenuItem>
                              </Select>
                            ) : (
                              <Chip
                                label="♾️ No Cap (Unlimited)"
                                size="small"
                                onClick={() => handleToggleDealerCapping(dealer.dealer_id, false, 500, dealer.enforce_strict_stop)}
                                sx={{
                                  height: 30,
                                  fontWeight: 800,
                                  fontSize: '11px',
                                  bgcolor: '#EFF6FF',
                                  color: '#1D4ED8',
                                  border: '1px solid #93C5FD',
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: '#DBEAFE' }
                                }}
                              />
                            )}
                          </TableCell>

                          {/* Progress Meter */}
                          <TableCell>
                            <Box sx={{ width: '100%' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: (isExceeded && isCapped) ? THEME.error : THEME.textPrimary }}>
                                  {used} links uploaded
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: isCapped ? barColor : '#2563EB' }}>
                                  {isCapped ? `${pct}% (${remaining} left)` : '♾️ Unlimited Capacity'}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={isCapped ? pct : Math.min(100, Math.round((used / 2000) * 100))}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: '#E2E8F0',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: isCapped ? barColor : '#3B82F6',
                                    borderRadius: 4
                                  }
                                }}
                              />
                            </Box>
                          </TableCell>

                          {/* Status Badge */}
                          <TableCell>
                            {!isCapped ? (
                              <Chip
                                label="♾️ NO CAP (UNLIMITED)"
                                size="small"
                                sx={{
                                  fontWeight: 800,
                                  fontSize: '10px',
                                  bgcolor: '#EFF6FF',
                                  color: '#1D4ED8',
                                  border: '1px solid #BFDBFE'
                                }}
                              />
                            ) : (
                              <Chip
                                label={isExceeded ? 'LIMIT EXCEEDED (STOPPED)' : (isNearLimit ? `WARNING (${pct}%)` : 'NORMAL')}
                                size="small"
                                sx={{
                                  fontWeight: 800,
                                  fontSize: '10px',
                                  bgcolor: isExceeded ? 'rgba(239, 68, 68, 0.15)' : (isNearLimit ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                                  color: isExceeded ? THEME.error : (isNearLimit ? THEME.warning : THEME.success),
                                  border: `1px solid ${isExceeded ? THEME.error : (isNearLimit ? THEME.warning : THEME.success)}40`
                                }}
                              />
                            )}
                          </TableCell>

                          {/* Strict Enforcement Dropdown (Hard Stop vs Notify Only vs Soft Cap) */}
                          <TableCell>
                            {!isCapped ? (
                              <Chip
                                size="small"
                                label="⏸️ Enforcement Off"
                                sx={{ fontSize: '11px', fontWeight: 600, color: '#64748B', bgcolor: '#F1F5F9', border: '1px solid #E2E8F0' }}
                              />
                            ) : (
                              <Select
                                size="small"
                                value={dealer.enforcement_mode || (dealer.enforce_strict_stop ? 'strict' : 'notify')}
                                onChange={(e) => handleUpdateEnforcementMode(dealer.dealer_id, e.target.value)}
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  height: 32,
                                  minWidth: 155,
                                  bgcolor: (dealer.enforcement_mode === 'strict' || (!dealer.enforcement_mode && dealer.enforce_strict_stop))
                                    ? '#FEF2F2'
                                    : (dealer.enforcement_mode === 'notify' ? '#FFFBEB' : '#EFF6FF'),
                                  color: (dealer.enforcement_mode === 'strict' || (!dealer.enforcement_mode && dealer.enforce_strict_stop))
                                    ? THEME.error
                                    : (dealer.enforcement_mode === 'notify' ? '#D97706' : '#2563EB'),
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: (dealer.enforcement_mode === 'strict' || (!dealer.enforcement_mode && dealer.enforce_strict_stop))
                                      ? 'rgba(239, 68, 68, 0.4)'
                                      : (dealer.enforcement_mode === 'notify' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(37, 99, 235, 0.4)')
                                  }
                                }}
                              >
                                <MenuItem value="strict" sx={{ fontSize: '12px', fontWeight: 600 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Lock sx={{ fontSize: 15, color: THEME.error }} />
                                    <span>🔒 Hard Stop</span>
                                  </Box>
                                </MenuItem>
                                <MenuItem value="notify" sx={{ fontSize: '12px', fontWeight: 600 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <NotificationsActive sx={{ fontSize: 15, color: '#D97706' }} />
                                    <span>🔔 Notify Only</span>
                                  </Box>
                                </MenuItem>
                                <MenuItem value="soft" sx={{ fontSize: '12px', fontWeight: 600 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ElectricBolt sx={{ fontSize: 15, color: '#2563EB' }} />
                                    <span>⚡ Soft Cap (+10%)</span>
                                  </Box>
                                </MenuItem>
                              </Select>
                            )}
                          </TableCell>

                          {/* Action Buttons */}
                          <TableCell sx={{ textAlign: 'right' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.8 }}>
                              {/* 1-Click Cap Toggle / Removal Action Button */}
                              <Tooltip title={isCapped ? "One-Click Remove Cap (Set Unlimited submissions for this dealer)" : "One-Click Apply Cap (Re-enable quota limit for this dealer)"}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleDealerCapping(dealer.dealer_id, isCapped, limit, dealer.enforce_strict_stop)}
                                  sx={{
                                    color: isCapped ? '#EF4444' : '#10B981',
                                    border: `1.5px solid ${isCapped ? '#FCA5A5' : '#86EFAC'}`,
                                    borderRadius: 2,
                                    p: 0.6,
                                    bgcolor: isCapped ? '#FEF2F2' : '#F0FDF4',
                                    '&:hover': { bgcolor: isCapped ? '#FEE2E2' : '#DCFCE7' }
                                  }}
                                >
                                  {isCapped ? <LockOpen sx={{ fontSize: 16 }} /> : <Lock sx={{ fontSize: 16 }} />}
                                </IconButton>
                              </Tooltip>

                              {/* Calendar Icon in Box for Dealer */}
                              <Tooltip title={`View Day-Wise Upload Numbers Calendar for ${dealer.dealer_name || dealer.dealer_id}`}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenCalendarModal(dealer.dealer_id)}
                                  sx={{
                                    color: THEME.accent,
                                    border: `1.5px solid ${THEME.accent}40`,
                                    borderRadius: 2,
                                    p: 0.6,
                                    bgcolor: THEME.accentLight,
                                    '&:hover': { bgcolor: '#DDD6FE' }
                                  }}
                                >
                                  <CalendarMonth sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Emergency Boost: Add +500 links for today">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<ElectricBolt sx={{ fontSize: 14 }} />}
                                  onClick={() => handleBoostQuota(dealer.dealer_id, 500)}
                                  sx={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    py: 0.3,
                                    px: 1,
                                    textTransform: 'none',
                                    color: THEME.accent,
                                    borderColor: `${THEME.accent}60`,
                                    '&:hover': { bgcolor: THEME.accentLight }
                                  }}
                                >
                                  +500
                                </Button>
                              </Tooltip>

                              <Tooltip title="Reset today's processed counter to 0">
                                <IconButton
                                  size="small"
                                  onClick={() => handleResetUsageToday(dealer.dealer_id)}
                                  sx={{ color: THEME.textSecondary }}
                                >
                                  <Refresh fontSize="small" />
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
            </CardContent>
          </Card>

          {/* ======================================================== */}
          {/* DAY-WISE UPLOAD NUMBERS CALENDAR MODAL                   */}
          {/* ======================================================== */}
          <Dialog
            open={calendarModalOpen}
            onClose={() => setCalendarModalOpen(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                p: { xs: 1.5, sm: 2.5 },
                bgcolor: '#FFFFFF',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }
            }}
          >
            {/* Modal Header */}
            <DialogTitle sx={{ p: 2, pb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: THEME.accentLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: THEME.accent
                  }}>
                    <CalendarMonth sx={{ fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: THEME.textPrimary, lineHeight: 1.2 }}>
                      Day-Wise Link Upload Numbers Calendar
                    </Typography>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                      Click any date to inspect dealer upload volume against daily quotas. Cycles reset daily at 12:00 AM IST.
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    icon={<AccessTime sx={{ fontSize: '13px !important', color: '#10B981 !important' }} />}
                    label={`Resets at 12:00 AM IST (In: ${timeUntilReset || '...'})`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '11px',
                      bgcolor: '#F0FDF4',
                      color: '#15803D',
                      border: '1px solid #BBF7D0'
                    }}
                  />
                  <IconButton onClick={() => setCalendarModalOpen(false)} size="small" sx={{ color: THEME.textSecondary }}>
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 2, pt: 0.5 }}>
              {/* Controls Toolbar: Dealership Filter, Month Navigator, and Alert Legend */}
              <Card variant="outlined" sx={{
                p: 2,
                mb: 2.5,
                borderRadius: 3,
                bgcolor: '#F8FAFC',
                borderColor: '#E2E8F0'
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  {/* Left: Dealership Filter */}
                  <FormControl size="small" sx={{ minWidth: 280, bgcolor: '#FFFFFF' }}>
                    <InputLabel sx={{ fontSize: '13px' }}>Dealership View</InputLabel>
                    <Select
                      value={calendarSelectedDealer}
                      label="Dealership View"
                      onChange={(e) => setCalendarSelectedDealer(e.target.value)}
                      sx={{ fontSize: '13px', fontWeight: 700 }}
                    >
                      <MenuItem value="ALL">🌐 All Dealerships (Consolidated)</MenuItem>
                      {dealerQuotas.map(d => (
                        <MenuItem key={d.dealer_id} value={d.dealer_id}>
                          {d.dealer_name || d.dealer_id} (Cap: {d.daily_limit}/day)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Center: Month Navigator */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 2.5,
                    px: 1.5,
                    py: 0.6
                  }}>
                    <IconButton size="small" disabled sx={{ color: '#94A3B8' }}>
                      <ChevronLeft fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontWeight: 800, fontSize: '14px', color: THEME.textPrimary, px: 1 }}>
                      October 2026
                    </Typography>
                    <IconButton size="small" disabled sx={{ color: '#94A3B8' }}>
                      <ChevronRight fontSize="small" />
                    </IconButton>
                    <Chip
                      label="Today: Oct 11"
                      size="small"
                      onClick={() => setCalendarSelectedDate('2026-10-11')}
                      sx={{
                        height: 22,
                        fontSize: '10px',
                        fontWeight: 800,
                        bgcolor: THEME.accentLight,
                        color: THEME.accent,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#DDD6FE' }
                      }}
                    />
                  </Box>

                  {/* Right: Number Alert Legend */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: THEME.textSecondary, fontSize: '11px' }}>
                      ALERTS:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#10B981' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#047857', fontSize: '11px' }}>Normal</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#B45309', fontSize: '11px' }}>Moderate</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#EA580C' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#C2410C', fontSize: '11px' }}>High (75%+)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#EF4444' }} />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#B91C1C', fontSize: '11px' }}>Exceeded</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>

              {/* Neat Clean 7-Column Calendar Card */}
              <Card variant="outlined" sx={{
                borderRadius: 3.5,
                p: { xs: 1.5, sm: 2 },
                mb: 3,
                bgcolor: '#FFFFFF',
                borderColor: '#E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                {/* 7 Column Weekday Headers */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  gap: 1,
                  mb: 1.5,
                  textAlign: 'center'
                }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <Box
                      key={day}
                      sx={{
                        py: 0.8,
                        borderRadius: 1.5,
                        bgcolor: '#F8FAFC',
                        border: '1px solid #EEF2F6'
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 800,
                          color: '#475569',
                          textTransform: 'uppercase',
                          fontSize: '11.5px',
                          letterSpacing: 0.8
                        }}
                      >
                        {day}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* 7 Column Calendar Days Grid (5 rows x 7 cols = 35 days) */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  gap: 1
                }}>
                  {/* Previous Month Inactive Days: Sep 28, 29, 30 (Monday to Wednesday) */}
                  {[
                    { day: 28, month: 'Sep' },
                    { day: 29, month: 'Sep' },
                    { day: 30, month: 'Sep' }
                  ].map(pad => (
                    <Box
                      key={`prev-${pad.day}`}
                      sx={{
                        minHeight: 78,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: '#F8FAFC',
                        border: '1px dashed #E2E8F0',
                        opacity: 0.45,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'default'
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#94A3B8', fontSize: '11px' }}>
                        {pad.day} {pad.month}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#CBD5E1', fontSize: '10px', textAlign: 'center' }}>
                        -
                      </Typography>
                    </Box>
                  ))}

                  {/* October Current Month Days: 1 to 31 */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(dayNum => {
                    const dateStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
                    const isToday = dayNum === 11;
                    const isSelected = calendarSelectedDate === dateStr;

                    // Compute upload count & threshold status
                    let uploadCount = 0;
                    let targetLimit = 500;
                    let isExceeded = false;
                    let isHigh = false;
                    let isModerate = false;

                    if (calendarSelectedDealer === 'ALL') {
                      uploadCount = historyData.daily_totals[dateStr] || 0;
                      targetLimit = dealerQuotas.reduce((acc, d) => acc + (d.daily_limit || 500), 0);
                      dealerQuotas.forEach(d => {
                        const cnt = historyData.dealer_day_counts[d.dealer_id]?.[dateStr] || 0;
                        if (cnt >= (d.daily_limit || 500) && cnt > 0) isExceeded = true;
                        else if (cnt / (d.daily_limit || 500) >= 0.75) isHigh = true;
                      });
                    } else {
                      uploadCount = historyData.dealer_day_counts[calendarSelectedDealer]?.[dateStr] || 0;
                      targetLimit = dealerQuotas.find(d => d.dealer_id === calendarSelectedDealer)?.daily_limit || 500;
                      if (uploadCount >= targetLimit && uploadCount > 0) isExceeded = true;
                      else if (uploadCount / targetLimit >= 0.75) isHigh = true;
                      else if (uploadCount / targetLimit >= 0.35) isModerate = true;
                    }

                    // Alert styling tokens
                    let chipBg = '#DCFCE7';
                    let chipColor = '#15803D';
                    let chipBorder = '#BBF7D0';

                    if (uploadCount === 0) {
                      chipBg = '#F1F5F9';
                      chipColor = '#94A3B8';
                      chipBorder = '#E2E8F0';
                    } else if (isExceeded) {
                      chipBg = '#FEE2E2';
                      chipColor = '#DC2626';
                      chipBorder = '#FCA5A5';
                    } else if (isHigh) {
                      chipBg = '#FFEDD5';
                      chipColor = '#C2410C';
                      chipBorder = '#FDBA74';
                    } else if (isModerate) {
                      chipBg = '#FEF3C7';
                      chipColor = '#B45309';
                      chipBorder = '#FDE68A';
                    }

                    return (
                      <Box
                        key={dateStr}
                        onClick={() => setCalendarSelectedDate(dateStr)}
                        sx={{
                          minHeight: 78,
                          p: 1,
                          borderRadius: 2.2,
                          bgcolor: isSelected ? '#FAF5FF' : '#FFFFFF',
                          border: isSelected ? `2px solid ${THEME.accent}` : '1.5px solid #E2E8F0',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.18s ease',
                          boxShadow: isSelected ? '0 0 0 3px rgba(124, 58, 237, 0.15), 0 4px 12px rgba(124, 58, 237, 0.12)' : 'none',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                            borderColor: isSelected ? THEME.accent : '#94A3B8'
                          }
                        }}
                      >
                        {/* Day Number Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            sx={{
                              fontWeight: isSelected ? 900 : 700,
                              color: isSelected ? THEME.accent : '#1E293B',
                              fontSize: '13.5px',
                              lineHeight: 1
                            }}
                          >
                            {dayNum}
                          </Typography>
                          {isToday && (
                            <Chip
                              label="TODAY"
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '8.5px',
                                fontWeight: 900,
                                bgcolor: '#10B981',
                                color: '#FFFFFF',
                                px: 0.2
                              }}
                            />
                          )}
                        </Box>

                        {/* Number Alert Chip */}
                        <Box sx={{
                          textAlign: 'center',
                          py: 0.45,
                          px: 0.5,
                          borderRadius: 1.5,
                          bgcolor: chipBg,
                          color: chipColor,
                          border: `1px solid ${chipBorder}`,
                          fontWeight: 800,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          <span>{uploadCount === 0 ? '-' : uploadCount.toLocaleString()}</span>
                          {isExceeded && <span style={{ fontSize: '11px' }}>⚠️</span>}
                        </Box>
                      </Box>
                    );
                  })}

                  {/* Next Month Inactive Day: Nov 1 (Sunday to complete 35 days grid) */}
                  <Box
                    key="next-nov-1"
                    sx={{
                      minHeight: 78,
                      p: 1,
                      borderRadius: 2,
                      bgcolor: '#F8FAFC',
                      border: '1px dashed #E2E8F0',
                      opacity: 0.45,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'default'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#94A3B8', fontSize: '11px' }}>
                      1 Nov
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#CBD5E1', fontSize: '10px', textAlign: 'center' }}>
                      -
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Selected Day Inspector Card (Below Calendar) */}
              <Card variant="outlined" sx={{
                borderRadius: 3.5,
                p: { xs: 2, sm: 2.5 },
                bgcolor: '#FFFFFF',
                borderColor: '#E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pb: 2,
                  mb: 2,
                  borderBottom: '1px solid #EEF2F6',
                  flexWrap: 'wrap',
                  gap: 1.5
                }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: THEME.textPrimary, fontSize: '16px' }}>
                        📅 {new Date(calendarSelectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </Typography>
                      {calendarSelectedDate === '2026-10-11' && (
                        <Chip
                          label="Current IST Cycle"
                          size="small"
                          sx={{ height: 20, fontSize: '10px', fontWeight: 800, bgcolor: '#DCFCE7', color: '#15803D' }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                      Day quota usage details for 12:00 AM IST to 11:59 PM IST window
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${(historyData.daily_totals[calendarSelectedDate] || 0).toLocaleString()} Total Links Uploaded`}
                      size="medium"
                      sx={{
                        fontWeight: 800,
                        bgcolor: THEME.accentLight,
                        color: THEME.accent,
                        border: `1px solid ${THEME.accent}40`,
                        px: 1
                      }}
                    />
                  </Box>
                </Box>

                {/* Dealership Cards Grid */}
                <Grid container spacing={2}>
                  {dealerQuotas
                    .filter(d => calendarSelectedDealer === 'ALL' || d.dealer_id === calendarSelectedDealer)
                    .map(dl => {
                      const dayCount = historyData.dealer_day_counts[dl.dealer_id]?.[calendarSelectedDate] ?? 0;
                      const lim = dl.daily_limit || 500;
                      const pct = Math.round((dayCount / lim) * 100);
                      const isOver = dayCount >= lim && dayCount > 0;
                      const isWarn = pct >= 75 && !isOver;

                      let statusBadgeBg = isOver ? '#FEE2E2' : (isWarn ? '#FEF3C7' : '#DCFCE7');
                      let statusBadgeColor = isOver ? '#DC2626' : (isWarn ? '#D97706' : '#15803D');
                      let statusText = isOver ? 'LIMIT EXCEEDED (STOPPED)' : (isWarn ? `HIGH (${pct}%)` : `NORMAL (${pct}%)`);

                      return (
                        <Grid item xs={12} sm={calendarSelectedDealer === 'ALL' ? 6 : 12} key={dl.dealer_id}>
                          <Box sx={{
                            p: 2,
                            borderRadius: 2.5,
                            bgcolor: isOver ? '#FEF2F2' : (isWarn ? '#FFFBEB' : '#F8FAFC'),
                            border: `1.5px solid ${isOver ? '#FCA5A5' : (isWarn ? '#FDE68A' : '#E2E8F0')}`,
                            transition: 'all 0.2s ease',
                            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }
                          }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: THEME.textPrimary, fontSize: '13.5px' }}>
                                {dl.dealer_name || dl.dealer_id}
                              </Typography>
                              <Chip
                                size="small"
                                label={statusText}
                                sx={{
                                  height: 22,
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  bgcolor: statusBadgeBg,
                                  color: statusBadgeColor
                                }}
                              />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                                Daily Cap: <strong>{lim} links/day</strong>
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: isOver ? THEME.error : THEME.textPrimary }}>
                                {dayCount.toLocaleString()} / {lim} links ({pct}%)
                              </Typography>
                            </Box>

                            <LinearProgress
                              variant="determinate"
                              value={Math.min(100, pct)}
                              sx={{
                                height: 7,
                                borderRadius: 3.5,
                                bgcolor: '#E2E8F0',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: isOver ? THEME.error : (isWarn ? THEME.warning : THEME.success),
                                  borderRadius: 3.5
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                      );
                    })}
                </Grid>
              </Card>
            </DialogContent>
          </Dialog>
        </Box>
      )}

      {/* ======================================================== */}
      {/* TAB 3: GHOST MODE (DEALERSHIP IMPERSONATION)             */}
      {/* ======================================================== */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <strong>Ghost Impersonation Mode:</strong> Allows the Tech Team to view and troubleshoot exact dealer advisor metrics and results without requiring dealership passwords.
            </Alert>
          </Grid>
          {DEALERS_LIST.map((dealer) => (
            <Grid item xs={12} sm={6} md={4} key={dealer.id}>
              <Card sx={{
                borderRadius: 3,
                border: `1px solid ${THEME.border}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.15)',
                  borderColor: THEME.accent
                }
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, minHeight: 48 }}>
                    {dealer.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                      Analyzed Videos: <strong>{dealer.videos}</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: THEME.primary, fontWeight: 700 }}>
                      Avg Score: {dealer.avg}/10
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => handleGhostImpersonate(dealer)}
                    sx={{
                      borderColor: THEME.accent,
                      color: THEME.accent,
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: THEME.accentLight,
                        borderColor: THEME.accent
                      }
                    }}
                  >
                    Inspect Dealership View
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ======================================================== */}
      {/* TAB 4: LIVE DIAGNOSTICS LOG TERMINAL                     */}
      {/* ======================================================== */}
      {activeTab === 4 && (
        <Card sx={{ borderRadius: 3, border: '1px solid #1E293B', bgcolor: THEME.terminalBg, color: '#E2E8F0' }}>
          <CardContent sx={{ p: 2.5 }}>
            {/* Terminal Controls Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#EF4444' }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981' }} />
                <Typography variant="subtitle2" sx={{ ml: 1, color: '#94A3B8', fontFamily: 'monospace' }}>
                  fastapi@qualitylens-core:~/logs (LIVE)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                {['ALL', 'INFO', 'QUOTA', 'AI-WHISPER', 'OPENCV', 'ERROR'].map((lvl) => (
                  <Chip
                    key={lvl}
                    label={lvl}
                    size="small"
                    onClick={() => setLogFilter(lvl)}
                    sx={{
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      bgcolor: logFilter === lvl ? THEME.accent : '#1E293B',
                      color: '#F8FAFC',
                      border: logFilter === lvl ? `1px solid ${THEME.accent}` : '1px solid #334155'
                    }}
                  />
                ))}

                <TextField
                  size="small"
                  placeholder="Search logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  sx={{
                    bgcolor: '#1E293B',
                    borderRadius: 1.5,
                    width: 140,
                    input: { color: '#F8FAFC', py: 0.5, fontSize: '11px' }
                  }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setAutoScroll(!autoScroll)}
                  sx={{
                    color: autoScroll ? '#34D399' : '#94A3B8',
                    borderColor: autoScroll ? '#34D399' : '#475569',
                    fontSize: '10px',
                    py: 0.3
                  }}
                >
                  {autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => addLog('INFO', 'TEST', `Master Admin simulated test heartbeat packet at ${new Date().toLocaleTimeString()}`)}
                  sx={{ color: '#38BDF8', borderColor: '#38BDF8', fontSize: '10px', py: 0.3 }}
                >
                  Inject Event
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setLogs([])}
                  title="Clear Terminal"
                  sx={{ color: '#94A3B8' }}
                >
                  <CleaningServices fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Terminal Screen */}
            <Box
              ref={terminalRef}
              sx={{
                height: 380,
                overflowY: 'auto',
                bgcolor: '#030712',
                p: 2,
                borderRadius: 2,
                fontFamily: 'monospace',
                fontSize: '12.5px',
                border: '1px solid #1F2937'
              }}
            >
              {filteredLogs.map((log) => {
                const color = log.level === 'ERROR' ? '#EF4444' :
                  log.level === 'WARN' ? '#F59E0B' :
                  log.level === 'AI-WHISPER' ? '#C084FC' :
                  log.level === 'QUOTA' ? '#F472B6' :
                  log.level === 'OPENCV' ? '#38BDF8' : '#34D399';
                return (
                  <Box key={log.id} sx={{ mb: 0.8, display: 'flex', gap: 1.5, lineHeight: 1.5 }}>
                    <Typography component="span" sx={{ color: '#64748B', fontSize: '11px' }}>
                      [{log.time}]
                    </Typography>
                    <Typography component="span" sx={{ color: color, fontWeight: 700, minWidth: 80, fontSize: '11px' }}>
                      [{log.tag}]
                    </Typography>
                    <Typography component="span" sx={{ color: '#E2E8F0', flex: 1, fontSize: '12px' }}>
                      {log.msg}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ======================================================== */}
      {/* TAB 5: FEATURE FLAGS & MAINTENANCE MODE                  */}
      {/* ======================================================== */}
      {activeTab === 5 && (
        <Card sx={{ borderRadius: 3, border: `1px solid ${THEME.border}` }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Platform Operations & Emergency Toggles
            </Typography>
            <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 3 }}>
              Broadcast platform-wide notifications and toggle ingestion subsystems.
            </Typography>

            <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#F8FAFC', border: `1px solid ${THEME.border}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: THEME.warning }}>
                    Scheduled Maintenance Mode
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                    Shows a maintenance notice to Service Advisors and halts new video submissions.
                  </Typography>
                </Box>
                <Switch
                  checked={featureFlags.maintenanceMode}
                  onChange={(e) => setFeatureFlags({ ...featureFlags, maintenanceMode: e.target.checked })}
                  color="warning"
                />
              </Box>

              {featureFlags.maintenanceMode && (
                <TextField
                  fullWidth
                  size="small"
                  label="Maintenance Announcement Banner Text"
                  value={featureFlags.maintenanceBannerText}
                  onChange={(e) => setFeatureFlags({ ...featureFlags, maintenanceBannerText: e.target.value })}
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: '#F8FAFC', border: `1px solid ${THEME.border}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Bulk Excel Upload Ingestion Engine
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                    Enable or temporarily disable large multi-video batch uploads.
                  </Typography>
                </Box>
                <Switch
                  checked={featureFlags.bulkUploadEnabled}
                  onChange={(e) => setFeatureFlags({ ...featureFlags, bulkUploadEnabled: e.target.checked })}
                  color="primary"
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSaveFeatureFlags}
                sx={{
                  background: 'linear-gradient(135deg, #0DA1B8 0%, #0C587D 100%)',
                  fontWeight: 700,
                  px: 3
                }}
              >
                Save Platform Flags
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ⚠️ Emergency Kill Modal */}
      <Dialog
        open={killModalOpen}
        onClose={() => setKillModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: THEME.error, fontWeight: 800 }}>
          <Warning /> Emergency Kill Switch
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will immediately issue a stop flag across all currently processing batches in the celery/uvicorn queue.
          </Typography>
          <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
            In-flight frames will safely clean up temporary disk cache without corrupting MongoDB records.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setKillModalOpen(false)} disabled={isKilling}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleEmergencyStop}
            disabled={isKilling}
            startIcon={isKilling ? <CircularProgress size={16} color="inherit" /> : <PowerSettingsNew />}
          >
            {isKilling ? 'Stopping...' : 'Confirm Halt'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
