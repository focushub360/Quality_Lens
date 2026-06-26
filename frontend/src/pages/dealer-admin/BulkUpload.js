import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, Button, LinearProgress, CircularProgress,
  Card, CardContent, Alert, Chip, Grid, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Tooltip, Snackbar, TextField, MenuItem, Container
} from '@mui/material';
import {
  Upload, PlayArrow, CheckCircle, Error, TableChart,
  Close, History, Refresh, Stop, Delete, Download, Translate,
  CloudUpload, Dashboard, Archive, Description
} from '@mui/icons-material';
import api from '../../services/api';

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
  successLight: '#F0FDF4',
  warning: '#F59E0B',
  warningLight: '#FFFBE8',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  gradientPrimary: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
  gradientAccent: 'linear-gradient(135deg, #0DA1B8 0%, #0C587D 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

// Persistent storage keys
const STORAGE_KEY = 'bulkProcessingBatches';
const STATUS_SNAPSHOT_KEY = 'bulkActiveStatusSnapshot';

// Language options
const LANGS = [
  { code: "auto", name: "Auto Detect", icon: "🔍" },
  { code: "en", name: "English", icon: "🇺🇸" },
  { code: "as", name: "Assamese", icon: "🇮🇳" },
  { code: "bn", name: "Bengali", icon: "🇮🇳" },
  { code: "gu", name: "Gujarati", icon: "🇮🇳" },
  { code: "hi", name: "Hindi", icon: "🇮🇳" },
  { code: "kn", name: "Kannada", icon: "🇮🇳" },
  { code: "ml", name: "Malayalam", icon: "🇮🇳" },
  { code: "mr", name: "Marathi", icon: "🇮🇳" },
  { code: "ne", name: "Nepali", icon: "🇳🇵" },
  { code: "or", name: "Odia", icon: "🇮🇳" },
  { code: "pa", name: "Punjabi", icon: "🇮🇳" },
  { code: "sa", name: "Sanskrit", icon: "🇮🇳" },
  { code: "ta", name: "Tamil", icon: "🇮🇳" },
  { code: "te", name: "Telugu", icon: "🇮🇳" },
  { code: "ur", name: "Urdu", icon: "🇵🇰" },
];
export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [excelPreview, setExcelPreview] = useState(null);
  const [activeBatches, setActiveBatches] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [stopDialog, setStopDialog] = useState({ open: false, batchId: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, batchId: null });
  const [isLoading, setIsLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [liveProgress, setLiveProgress] = useState(0);

  // Dynamic Time Remaining Estimator
  const formatDuration = (secs) => {
    if (secs <= 0) return '0s';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // Live clock — ticks every second so the countdown is real
  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => {
    if (!status || status.status !== 'processing') return;
    const tick = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [status?.status]);

  const getTimeInfo = () => {
    if (!status || status.status !== 'processing') return { remaining: '', elapsed: '' };

    const startTime = status.started_at ? new Date(status.started_at).getTime() : null;
    const now = nowTs; // live-ticking value

    // Elapsed seconds since batch started
    const elapsedSec = startTime ? Math.floor((now - startTime) / 1000) : 0;
    const elapsedStr = elapsedSec > 0 ? formatDuration(elapsedSec) : '—';

    // Use attempted (success + failed) to estimate rate, never stuck at 0
    const attempted = (status.processed_urls || 0) + (status.failed_urls || 0);
    const remaining = status.total_urls - attempted;

    if (!startTime || attempted === 0) {
      // No data yet — rough estimate: assume 30s per video
      return { remaining: formatDuration(remaining * 30), elapsed: elapsedStr };
    }

    const secPerUrl = elapsedSec / attempted;           // real measured rate
    const remainingSec = Math.ceil(secPerUrl * remaining);
    return {
      remaining: remainingSec > 0 ? formatDuration(remainingSec) : 'almost done',
      elapsed: elapsedStr,
      secPerUrl: secPerUrl.toFixed(1),
    };
  };


  // liveProgress ref to ensure we never display a backward jump
  const liveProgressRef = useRef(0);

  // Interpolation logic: uses ATTEMPTED (processed + failed) as base so
  // progress always moves forward even when all videos are failing.
  useEffect(() => {
    if (!status) {
      setLiveProgress(0);
      liveProgressRef.current = 0;
      return;
    }

    if (status.status !== 'processing') {
      const finalPct = status.progress_percentage || 0;
      setLiveProgress(finalPct);
      liveProgressRef.current = finalPct;
      return;
    }

    // Use the server value as floor (never go below it)
    const serverPct = status.progress_percentage || 0;
    if (serverPct > liveProgressRef.current) {
      liveProgressRef.current = serverPct;
      setLiveProgress(serverPct);
    }

    let activeUrl = status.current_url;
    let itemStartTime = Date.now();

    const interval = setInterval(() => {
      if (status.current_url !== activeUrl) {
        activeUrl = status.current_url;
        itemStartTime = Date.now();
      }

      const elapsed = Date.now() - itemStartTime;
      const estimatedDuration = 25000; // 25s per video
      const itemProgressRatio = Math.min(elapsed / estimatedDuration, 0.95);

      // Count both successful AND failed as attempted
      const attempted = (status.processed_urls || 0) + (status.failed_urls || 0);
      const baseProgress = (attempted / status.total_urls) * 100;
      const nextItemWeight = (1 / status.total_urls) * 100;
      const estimatedLive = baseProgress + (nextItemWeight * itemProgressRatio);
      const capped = Math.min(estimatedLive, 99.99);

      // Only move forward — never decrease
      if (capped > liveProgressRef.current) {
        liveProgressRef.current = capped;
        setLiveProgress(capped);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [status]);


  const [targetLanguage, setTargetLanguage] = useState('en');
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const isMounted = useRef(true);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;

    // ── INSTANT RESTORE ──────────────────────────────────────────
    // Before the async server fetch even starts, restore the last
    // known status from localStorage so the processing card shows
    // up immediately when the user navigates back to this page.
    try {
      const snapshot = localStorage.getItem(STATUS_SNAPSHOT_KEY);
      if (snapshot) {
        const saved = JSON.parse(snapshot);
        if (saved && saved.batchId) {
          setBatchId(saved.batchId);
          setStatus(saved);
          // Restart polling immediately if the batch was still running
          if (['processing', 'pending', 'stopping'].includes(saved.status)) {
            startPolling(saved.batchId);
          }
        }
      }
    } catch (e) {
      console.warn('Could not restore status snapshot', e);
    }
    // ─────────────────────────────────────────────────────────────

    const init = async () => {
      try {
        // 1) Get current user (includes dealer_id and role)
        const meRes = await api.get('/users/me');
        const me = meRes.data;
        setCurrentUser(me);

        // 2) Get server-side batches (server will filter by dealer for dealer_admin)
        await fetchServerBatches(me);

      } catch (err) {
        // If server calls fail, fallback to localStorage
        console.warn('Could not fetch user or server batches, falling back to local storage', err);
        loadActiveBatchesFromStorage(null); // no currentUser available
      }
    };

    init();

    return () => {
      isMounted.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If activeBatches changes, persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeBatches));
    } catch (err) {
      console.error('Error persisting batches to localStorage:', err);
    }
  }, [activeBatches]);

  // Persist full status object to localStorage whenever it changes
  // so we can restore the processing card instantly on page re-visit
  useEffect(() => {
    if (status) {
      try {
        localStorage.setItem(STATUS_SNAPSHOT_KEY, JSON.stringify(status));
      } catch (err) {
        console.error('Error persisting status snapshot:', err);
      }
    }
  }, [status]);

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ---------------------------
  // Server fetch & normalization
  // ---------------------------
  const normalizeBatch = (b) => {
    // Support both snake_case and camelCase from various endpoints/caches
    const batchIdVal = b.batchId || b.batch_id || b.batch_id?.toString() || (b.batchId ? b.batchId.toString() : undefined);
    const filename = b.filename || b.original_filename || 'Unknown file';
    let created_at = b.created_at || b.createdAt || null;
    if (created_at && !(typeof created_at === 'string')) {
      // convert Date-ish object to ISO (Mongo returns datetime objects)
      try { created_at = new Date(created_at).toISOString(); } catch { created_at = null; }
    }
    return {
      ...b,
      batchId: batchIdVal,
      batch_id: b.batch_id || batchIdVal,
      filename,
      created_at,
      total_urls: Number(b.total_urls || 0),
      processed_urls: Number(b.processed_urls || b.processed || 0),
      failed_urls: Number(b.failed_urls || 0),
      dealer_id: b.dealer_id || b.dealerId || null,
    };
  };

  const fetchServerBatches = async (me = null) => {
    try {
      const res = await api.get('/bulk-batches');
      const serverBatches = Array.isArray(res.data) ? res.data.map(normalizeBatch) : [];
      // If we have current user and they are dealer_admin, server already filtered; but be safe and filter again client-side
      const filtered = me && me.role === 'dealer_admin' && me.dealer_id
        ? serverBatches.filter(b => String(b.dealer_id) === String(me.dealer_id))
        : serverBatches;
      setActiveBatches(filtered);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      // Look for previously tracked batch ID in localStorage
      const savedTrackedId = localStorage.getItem('trackedBulkBatchId');
      let targetBatch = null;
      if (savedTrackedId) {
        targetBatch = filtered.find(b => String(b.batchId) === String(savedTrackedId));
      }
      
      // Fallback to first active batch if no saved tracked batch, or if it wasn't found
      if (!targetBatch) {
        targetBatch = filtered.find(b => ['processing', 'pending', 'stopping'].includes(b.status));
      }

      if (targetBatch) {
        setBatchId(targetBatch.batchId);
        setStatus(targetBatch);
        localStorage.setItem('trackedBulkBatchId', targetBatch.batchId);
        if (['processing', 'pending', 'stopping'].includes(targetBatch.status)) {
          startPolling(targetBatch.batchId);
        }
      }
    } catch (err) {
      console.warn('fetchServerBatches failed, will fallback to localStorage', err);
      // fallback to local storage; if currentUser known, pass it so we can filter
      loadActiveBatchesFromStorage(me);
    }
  };

  // ---------------------------
  // LocalStorage fallback loader + pruning
  // ---------------------------
  const loadActiveBatchesFromStorage = (me = null) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const raw = JSON.parse(stored);

      const normalized = (Array.isArray(raw) ? raw : []).map(normalizeBatch);

      // Filter stale entries:
      const filtered = normalized.filter(b => {
        // require dealer info (drop legacy entries lacking dealer_id)
        if (!b.dealer_id) return false;
        if (me && me.role === 'dealer_admin') {
          return String(b.dealer_id) === String(me.dealer_id);
        }
        return true;
      });

      setActiveBatches(filtered);

      // Look for previously tracked batch ID in localStorage
      const savedTrackedId = localStorage.getItem('trackedBulkBatchId');
      let targetBatch = null;
      if (savedTrackedId) {
        targetBatch = filtered.find(b => String(b.batchId) === String(savedTrackedId));
      }
      
      if (!targetBatch) {
        targetBatch = filtered.find(b => ['processing', 'pending', 'stopping'].includes(b.status));
      }

      if (targetBatch) {
        setBatchId(targetBatch.batchId);
        setStatus(targetBatch);
        localStorage.setItem('trackedBulkBatchId', targetBatch.batchId);
        if (['processing', 'pending', 'stopping'].includes(targetBatch.status)) {
          startPolling(targetBatch.batchId);
        }
      }
    } catch (err) {
      console.error('Error loading batches from storage:', err);
    }
  };

  const pruneLocalStorage = (me) => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const kept = (stored || []).filter(b => {
        const dealerId = b.dealer_id || b.dealerId || null;
        if (!dealerId) return false;
        if (me && me.role === 'dealer_admin') {
          return String(dealerId) === String(me.dealer_id);
        }
        return true;
      }).map(normalizeBatch);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(kept));
      setActiveBatches(kept);
    } catch (err) {
      console.error('Error pruning localStorage:', err);
    }
  };

  // ---------------------------
  // File upload & start bulk
  // ---------------------------
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const nameLower = selectedFile.name.toLowerCase();
    if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) {
      setFile(selectedFile);
      setError('');
      setExcelPreview({
        totalRows: 'Ready for processing',
        message: `File selected: ${selectedFile.name}`
      });
    } else {
      setError('Please upload an Excel file (.xlsx or .xls)');
    }
  };

  const startBulkProcessing = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_language', targetLanguage);

    try {
      const response = await api.post('/bulk-analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      const newBatchId = data.batch_id;
      setBatchId(newBatchId);
      localStorage.setItem('trackedBulkBatchId', newBatchId);

      const initialStatus = {
        batchId: newBatchId,
        status: 'processing',
        total_urls: data.total_urls,
        processed_urls: 0,
        target_language: targetLanguage,
        failed_urls: 0,
        progress_percentage: 0,
        filename: file.name,
        created_at: new Date().toISOString(),
        dealer_id: currentUser?.dealer_id || null,
      };

      setStatus(initialStatus);
      saveBatchToStorage(initialStatus);

      // Refresh server list to get canonical saved batch (and enforce RBAC)
      await fetchServerBatches(currentUser);

      startPolling(newBatchId);
      showSnackbarMessage('Bulk processing started successfully!', 'success');

    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Failed to start bulk processing';
      setError(msg);
      showSnackbarMessage(msg, 'error');
      console.error('startBulkProcessing error:', err);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // ---------------------------
  // Polling / status / results - unchanged except normalization
  // ---------------------------
  const startPolling = (batchIdToPoll) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      if (!isMounted.current) return;
      try {
        const response = await api.get(`/bulk-status/${batchIdToPoll}`);
        const statusData = response.data;
        const updatedStatus = { ...normalizeBatch(statusData), batchId: batchIdToPoll };

        setStatus(prev => ({ ...prev, ...updatedStatus }));
        saveBatchToStorage(updatedStatus);

        if (['completed', 'failed', 'cancelled'].includes(statusData.status)) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setLoading(false);
          fetchBatchResults(batchIdToPoll);
          // refresh server list for final status
          await fetchServerBatches(currentUser);
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          removeBatchFromStorage(batchIdToPoll);
          if (batchId === batchIdToPoll) {
            clearCurrentBatch();
          }
          showSnackbarMessage('Batch was deleted on server', 'warning');
        } else {
          console.error('Error polling status:', err);
        }
      }
    }, 5000);
  };

  const fetchBatchResults = async (batchIdToFetch) => {
    try {
      const response = await api.get(`/bulk-results/${batchIdToFetch}`);
      const results = response.data;
      if (status && status.batchId === batchIdToFetch) {
        const finalStatus = { ...status, ...results };
        saveBatchToStorage(finalStatus);
        setStatus(finalStatus);
      }
      if (results?.results) setList(results.results);
    } catch (err) {
      console.error('Error fetching batch results:', err);
    }
  };

  // ---------------------------
  // Stop / delete / download - same as before but refresh server list where relevant
  // ---------------------------
  const stopBatchProcessing = async (batchIdToStop) => {
    try {
      const response = await api.post(`/bulk-cancel/${batchIdToStop}`);
      if (response.status === 200) {
        showSnackbarMessage('Batch processing stop requested', 'success');
        setStopDialog({ open: false, batchId: null });
        if (status && status.batchId === batchIdToStop) {
          const updatedStatus = { ...status, status: 'stopping' };
          setStatus(updatedStatus);
          saveBatchToStorage(updatedStatus);
        }
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setLoading(false);
        await fetchServerBatches(currentUser);
      } else {
        throw new Error('Failed to stop batch');
      }
    } catch (err) {
      showSnackbarMessage('Failed to stop batch', 'error');
      console.error('Error stopping batch:', err);
    }
  };

  const deleteBatch = async (batchIdToDelete) => {
    try {
      const response = await api.delete(`/bulk-job/${batchIdToDelete}`);
      if (response.status === 200) {
        showSnackbarMessage('Batch deleted successfully', 'success');
        setDeleteDialog({ open: false, batchId: null });
        removeBatchFromStorage(batchIdToDelete);
        if (batchId === batchIdToDelete) clearCurrentBatch();
        await fetchServerBatches(currentUser);
      } else {
        throw new Error('Failed to delete batch');
      }
    } catch (err) {
      showSnackbarMessage('Failed to delete batch', 'error');
      console.error('Error deleting batch:', err);
    }
  };

  const downloadResults = async (batchIdToDownload) => {
    try {
      const response = await api.get(`/bulk-results/${batchIdToDownload}`);
      const data = response.data;
      const blob = new Blob([JSON.stringify(data.results || [], null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch-${batchIdToDownload}-results.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showSnackbarMessage('Results downloaded successfully', 'success');
    } catch (err) {
      showSnackbarMessage('Failed to download results', 'error');
      console.error('Error downloading results:', err);
    }
  };

  const downloadStructuredZip = async (batchIdToDownload) => {
    try {
      const response = await api.get(`/bulk-download/${batchIdToDownload}/structured`, { responseType: 'blob' });
      const disposition = response.headers['content-disposition'] || '';
      const match = disposition.match(/filename="?(.+)"?/);
      const filename = match ? match[1] : `batch_${batchIdToDownload}_reports.zip`;
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showSnackbarMessage('Structured ZIP downloaded', 'success');
    } catch (err) {
      console.error('Error downloading structured ZIP:', err);
      showSnackbarMessage('Failed to download structured ZIP', 'error');
    }
  };

  // ---------------------------
  // LocalStorage helpers (normalized shapes)
  // ---------------------------
  const saveBatchToStorage = (batchData) => {
    setActiveBatches(prev => {
      try {
        const batches = [...prev];
        const idx = batches.findIndex(b => b.batchId === batchData.batchId);
        if (idx >= 0) batches[idx] = { ...batches[idx], ...normalizeBatch(batchData) };
        else batches.push(normalizeBatch(batchData));
        return batches;
      } catch (err) {
        console.error('Error saving batch to storage:', err);
        return prev;
      }
    });
  };

  const removeBatchFromStorage = (batchIdToRemove) => {
    setActiveBatches(prev => {
      try {
        const batches = prev.filter(b => b.batchId !== batchIdToRemove);
        return batches;
      } catch (err) {
        console.error('Error removing batch from storage:', err);
        return prev;
      }
    });
  };

  // ---------------------------
  // UI helpers
  // ---------------------------
  const formatBatchDate = (b) => {
    const raw = b.created_at || b.createdAt || b.createdAtString || null;
    if (!raw) return 'Unknown date';
    const d = new Date(raw);
    return isNaN(d.getTime()) ? 'Unknown date' : d.toLocaleString();
  };

  const resumeBatchTracking = (batch) => {
    setBatchId(batch.batchId);
    setStatus(batch);
    localStorage.setItem('trackedBulkBatchId', batch.batchId);
    if (['processing', 'pending', 'stopping'].includes(batch.status)) {
      startPolling(batch.batchId);
    }
  };

  const clearCurrentBatch = () => {
    setBatchId(null);
    setStatus(null);
    setFile(null);
    setExcelPreview(null);
    setList([]);
    localStorage.removeItem('trackedBulkBatchId');
    localStorage.removeItem(STATUS_SNAPSHOT_KEY);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const filteredList = list.filter(item => {
    const meta = item.citnow_metadata || {};
    const searchLower = searchTerm.toLowerCase();
    return (
      (meta.dealership || '').toLowerCase().includes(searchLower) ||
      (meta.vehicle || '').toLowerCase().includes(searchLower) ||
      (meta.service_advisor || '').toLowerCase().includes(searchLower) ||
      (meta.vin || '').toLowerCase().includes(searchLower) ||
      (meta.registration || '').toLowerCase().includes(searchLower) ||
      (meta.email || '').toLowerCase().includes(searchLower) ||
      (meta.phone || '').toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (s) => {
    switch (s) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'processing': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'warning';
      case 'stopping': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (s) => {
    switch (s) {
      case 'completed': return <CheckCircle />;
      case 'failed': return <Error />;
      case 'processing': return <PlayArrow />;
      case 'pending': return <Upload />;
      case 'cancelled': return <Stop />;
      case 'stopping': return <Stop />;
      default: return <Upload />;
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: { bgColor: THEME.surface, textColor: THEME.textTertiary },
      processing: { bgColor: THEME.primaryUltraLight, textColor: THEME.primary },
      completed: { bgColor: THEME.successLight, textColor: THEME.success },
      failed: { bgColor: THEME.errorLight, textColor: THEME.error },
      cancelled: { bgColor: THEME.warningLight, textColor: THEME.warning },
      stopping: { bgColor: THEME.warningLight, textColor: THEME.warning }
    };
    return config[status] || config.pending;
  };

  const canStopBatch = (batchStatus) => ['processing', 'pending'].includes(batchStatus);
  const canDeleteBatch = (batchStatus) => ['completed', 'failed', 'cancelled', 'stopping'].includes(batchStatus);
  const canDownloadResults = (batchStatus) => batchStatus === 'completed';

  return (
    <Container maxWidth="xl" sx={{
    py: 4,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
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
          Bulk Video Analysis
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
          Upload Excel files with multiple video URLs for batch processing. 
          Track progress in real-time and download comprehensive analysis reports.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            startIcon={<History />} 
            onClick={() => setShowHistory(true)} 
            variant="outlined"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1,
              fontWeight: 600,
              borderColor: THEME.primary,
              color: THEME.primary,
              '&:hover': {
                backgroundColor: THEME.primaryUltraLight,
                borderColor: THEME.primaryDark
              }
            }}
          >
            View History ({activeBatches.length})
          </Button>

          {status && (
            <Button 
              startIcon={<Upload />} 
              onClick={clearCurrentBatch} 
              variant="contained"
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1,
                fontWeight: 600,
                background: THEME.gradientPrimary,
                color: '#fff',
                boxShadow: THEME.shadowMd,
                '&:hover': {
                  boxShadow: THEME.shadowLg,
                  background: THEME.gradientPrimary
                }
              }}
            >
              New Upload
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
        {!status ? (
          <Box sx={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Excel Format Guide */}
          <Card sx={{
            background: THEME.surfaceElevated,
            border: `1px solid ${THEME.border}`,
            borderRadius: 3,
            boxShadow: THEME.shadowMd
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TableChart sx={{ color: THEME.primary }} />
                Expected Excel Format
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: THEME.surface }}>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>Video ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>Location Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>Vehicle ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>VIN</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>VP Display Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>Excluded from Stats</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>Vehicle Make</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>New/Used</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME.textPrimary }}>date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: THEME.textSecondary }}>823723</TableCell>
                      <TableCell sx={{ color: THEME.textSecondary }}>Eminent Cars Private Limited</TableCell>
                      <TableCell sx={{ color: THEME.textSecondary }}>HP 47B 1213</TableCell>
                      <TableCell sx={{ color: THEME.textSecondary }}>NA</TableCell>
                      <TableCell sx={{ color: THEME.textSecondary }}>Pre Delivery</TableCell>
                      <TableCell sx={{ color: THEME.textSecondary }}>0</TableCell>
                      <TableCell sx={{ color: THEME.textSecondary }}>BMW</TableCell>
                      <TableCell sx={{ color: THEME.textSecondary }}></TableCell>
                      <TableCell sx={{ color: THEME.textSecondary, whiteSpace: 'nowrap' }}>08-06-2026 20:31</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="body2" sx={{ color: THEME.textTertiary, mt: 2, fontStyle: 'italic' }}>
                💡 The system automatically detects columns containing Video IDs or full CitNow URLs. Ensure your Excel file has at least one column with valid IDs or URLs.
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{
            background: THEME.surfaceElevated,
            border: `1px solid ${THEME.border}`,
            borderRadius: 3,
            boxShadow: THEME.shadowMd,
            height: '100%'
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* File Upload Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  mb: 4, 
                  border: `2px dashed ${THEME.border}`,
                  borderRadius: 3,
                  backgroundColor: THEME.surface,
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: THEME.primary,
                    backgroundColor: THEME.primaryUltraLight
                  }
                }}
              >
                <CloudUpload sx={{ fontSize: 48, color: THEME.primary, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
                  Upload Excel File
                </Typography>
                <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 3, lineHeight: 1.6 }}>
                  Upload an Excel file containing video URLs for batch processing. 
                  The system will automatically detect and process QualityLens URLs.
                </Typography>

                <Button 
                  variant="outlined" 
                  component="label" 
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: THEME.primary,
                    color: THEME.primary,
                    '&:hover': {
                      backgroundColor: THEME.primaryUltraLight,
                      borderColor: THEME.primaryDark
                    }
                  }}
                  disabled={!!batchId && canStopBatch(status?.status)}
                >
                  Choose Excel File
                  <input type="file" hidden accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" onChange={handleFileUpload}
                    disabled={!!batchId && canStopBatch(status?.status)} />
                </Button>

                {file && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: THEME.successLight, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: THEME.success, fontWeight: 600 }}>
                      ✅ Selected: {file.name}
                    </Typography>
                    {excelPreview && (
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mt: 1 }}>
                        {excelPreview.message}
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>

              {/* Translation Settings */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 4,
                  backgroundColor: THEME.surface,
                  border: `1px solid ${THEME.borderLight}`,
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: THEME.textPrimary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Translate sx={{ color: THEME.primary }} />
                  Translation Settings
                </Typography>
                
                <TextField 
                  fullWidth 
                  select 
                  label="Target Language" 
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: THEME.background,
                    }
                  }}
                >
                  {LANGS.filter(l => l.code !== 'auto').map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="body1">{lang.icon}</Typography>
                        <Typography>{lang.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Paper>

              {/* Action Button */}
              <Box sx={{ textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<PlayArrow />}
                  onClick={startBulkProcessing}
                  disabled={!file || loading || (!!batchId && canStopBatch(status?.status))}
                  sx={{
                    background: THEME.gradientPrimary,
                    borderRadius: 3,
                    px: 6,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '16px',
                    boxShadow: THEME.shadowMd,
                    '&:hover': {
                      boxShadow: THEME.shadowLg,
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: THEME.textTertiary,
                      transform: 'none'
                    },
                    transition: 'all 0.2s ease-in-out',
                    minWidth: 200
                  }}
                >
                  {loading ? 'Processing...' : 'Start Bulk Processing'}
                </Button>

                {batchId && (
                  <Button 
                    variant="outlined" 
                    onClick={clearCurrentBatch} 
                    disabled={loading}
                    sx={{ ml: 2, borderRadius: 3, fontWeight: 600 }}
                  >
                    New Upload
                  </Button>
                )}
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3,
                    borderRadius: 2,
                    border: `1px solid ${THEME.errorLight}`,
                    backgroundColor: THEME.errorLight
                  }}
                >
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
        ) : (
          <Box sx={{ width: '100%', maxWidth: 650 }}>
            <Card sx={{
              background: THEME.surfaceElevated,
              border: `1px solid ${THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowMd,
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600, mb: 1 }}>
                      Processing Status
                    </Typography>
                    <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                      Batch ID: {status.batchId}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      icon={getStatusIcon(status.status)} 
                      label={status.status?.toUpperCase()} 
                      sx={
                        status.status === 'processing'
                        ? {
                            backgroundColor: 'rgba(0,212,255,0.1)',
                            color: '#00d4ff',
                            fontWeight: 800,
                            border: '1px solid rgba(0,212,255,0.5)',
                            boxShadow: '0 0 10px rgba(0,212,255,0.4), inset 0 0 5px rgba(0,212,255,0.2)',
                            animation: 'neonPulse 1.5s ease-in-out infinite alternate',
                            '@keyframes neonPulse': {
                              'from': { boxShadow: '0 0 5px rgba(0,212,255,0.2), inset 0 0 2px rgba(0,212,255,0.1)' },
                              'to': { boxShadow: '0 0 15px rgba(0,212,255,0.6), inset 0 0 8px rgba(0,212,255,0.3)' }
                            }
                          }
                        : {
                            backgroundColor: getStatusConfig(status.status).bgColor,
                            color: getStatusConfig(status.status).textColor,
                            fontWeight: 600,
                            border: `1px solid ${getStatusConfig(status.status).textColor}20`
                          }
                      }
                    />
                    
                    {canStopBatch(status.status) && (
                      <Tooltip title="Stop Processing">
                        <IconButton 
                          sx={{ 
                            color: THEME.error,
                            backgroundColor: `${THEME.error}08`,
                            '&:hover': { backgroundColor: `${THEME.error}15` }
                          }}
                          onClick={() => setStopDialog({ open: true, batchId: status.batchId })}
                        >
                          <Stop />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {canDownloadResults(status.status) && (
                      <>
                        <Tooltip title="Download JSON Results">
                          <IconButton 
                            sx={{ 
                              color: THEME.primary,
                              backgroundColor: `${THEME.primary}08`,
                              '&:hover': { backgroundColor: `${THEME.primary}15` }
                            }}
                            onClick={() => downloadResults(status.batchId)}
                          >
                            <Description />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Structured ZIP">
                          <IconButton 
                            sx={{ 
                              color: THEME.primary,
                              backgroundColor: `${THEME.primary}08`,
                              '&:hover': { backgroundColor: `${THEME.primary}15` }
                            }}
                            onClick={() => downloadStructuredZip(status.batchId)}
                          >
                            <Archive />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    
                    {canDeleteBatch(status.status) && (
                      <Tooltip title="Delete Batch">
                        <IconButton 
                          sx={{ 
                            color: THEME.error,
                            backgroundColor: `${THEME.error}08`,
                            '&:hover': { backgroundColor: `${THEME.error}15` }
                          }}
                          onClick={() => setDeleteDialog({ open: true, batchId: status.batchId })}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* Progress Stats */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 1 }}>Total URLs</Typography>
                      <Typography variant="h4" sx={{ color: THEME.textPrimary, fontWeight: 700 }}>
                        {status.total_urls}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 1 }}>Processed</Typography>
                      <Typography variant="h4" sx={{ color: THEME.primary, fontWeight: 700 }}>
                        {status.processed_urls}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 1 }}>Failed</Typography>
                      <Typography variant="h4" sx={{ color: THEME.error, fontWeight: 700 }}>
                        {status.failed_urls}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 1 }}>Progress</Typography>
                      <Typography variant="h4" sx={{ color: THEME.success, fontWeight: 700 }}>
                        {liveProgress.toFixed(2)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Circular Progress (Modern Styled like NewAnalysis) */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4, 
                  mb: 3,
                  background: '#0a0a0a',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  border: '1px solid #222'
                }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                    {/* Background Circle */}
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={120}
                      thickness={4}
                      sx={{ color: '#222' }}
                    />
                    {/* Progress Circle (Lime Green) */}
                    <CircularProgress
                      variant="determinate"
                      value={liveProgress}
                      size={120}
                      thickness={5}
                      sx={{
                        color: status.status === 'failed' ? THEME.error : '#A3E635',
                        position: 'absolute',
                        left: 0,
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                          transition: 'stroke-dashoffset 0.1s linear',
                        },
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h4" component="div" fontWeight="800" sx={{ color: '#FFFFFF' }}>
                        {liveProgress.toFixed(2)}<Box component="span" sx={{ fontSize: '1rem', ml: 0.5 }}>%</Box>
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ 
                    color: status.status === 'failed' ? THEME.error : '#A3E635', 
                    fontWeight: 700, 
                    letterSpacing: '1px', 
                    textTransform: 'uppercase',
                    mb: status.status === 'processing' ? 1 : 0
                  }}>
                    {status.status === 'completed' ? 'BATCH COMPLETE' : status.status?.toUpperCase()}
                  </Typography>
                  {status.status === 'processing' && (() => {
                    const { remaining, elapsed, secPerUrl } = getTimeInfo();
                    return (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.72rem' }}>
                          ⏱ {remaining} remaining
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, fontSize: '0.65rem' }}>
                          {elapsed} elapsed{secPerUrl ? ` · ~${secPerUrl}s/url` : ''}
                        </Typography>
                      </Box>
                    );
                  })()}
                </Box>


                {/* Current URL - Enhanced with URL number */}
                {status.current_url && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: THEME.surface,
                      border: `1px solid ${THEME.border}`,
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Animated processing indicator line */}
                    {status.status === 'processing' && (
                      <Box sx={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                        background: `linear-gradient(90deg, transparent 0%, ${THEME.primary} 50%, transparent 100%)`,
                        animation: 'scanLine 2s linear infinite',
                        '@keyframes scanLine': {
                          '0%': { transform: 'translateX(-100%)' },
                          '100%': { transform: 'translateX(100%)' }
                        }
                      }} />
                    )}

                    {/* URL number badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Box sx={{
                        background: THEME.gradientPrimary,
                        color: '#fff',
                        borderRadius: '20px',
                        px: 1.5, py: 0.3,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap'
                      }}>
                        🔄 URL {status.processed_urls + status.failed_urls + 1} of {status.total_urls}
                      </Box>
                      {status.failed_urls > 0 && (
                        <Box sx={{
                          background: THEME.error,
                          color: '#fff',
                          borderRadius: '20px',
                          px: 1.5, py: 0.3,
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}>
                          ⚠️ {status.failed_urls} Failed
                        </Box>
                      )}
                      {status.processed_urls > 0 && (
                        <Box sx={{
                          background: THEME.success,
                          color: '#fff',
                          borderRadius: '20px',
                          px: 1.5, py: 0.3,
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}>
                          ✓ {status.processed_urls} Done
                        </Box>
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ color: THEME.textPrimary, fontWeight: 600, mb: 0.5 }}>
                      🎥 Currently Processing:
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: THEME.primary,
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      fontSize: '0.8rem'
                    }}>
                      {status.current_url}
                    </Typography>
                  </Paper>
                )}


                {/* Status Messages */}
                {status.status === 'completed' && (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      border: `1px solid ${THEME.successLight}`,
                      backgroundColor: THEME.successLight
                    }}
                  >
                    ✅ Bulk processing completed! Processed: {status.processed_urls} | Failed: {status.failed_urls}
                  </Alert>
                )}
                
                {status.status === 'failed' && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      border: `1px solid ${THEME.errorLight}`,
                      backgroundColor: THEME.errorLight
                    }}
                  >
                    ❌ Processing failed. Please check the server logs for details.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      {/* History Dialog */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
              📋 Processing History
            </Typography>
            <IconButton 
              onClick={() => setShowHistory(false)}
              sx={{ color: THEME.textSecondary }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {activeBatches.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ color: THEME.textTertiary }}>
                No processing history found
              </Typography>
            </Box>
          ) : (
            <Box>
              {activeBatches.map((b) => (
                <Card 
                  key={b.batchId} 
                  sx={{ 
                    mb: 2, 
                    p: 3,
                    border: `1px solid ${THEME.border}`,
                    borderRadius: 2,
                    backgroundColor: THEME.surfaceElevated
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: THEME.textPrimary, fontWeight: 600, mb: 1 }}>
                        {b.filename || 'Unknown file'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 1 }}>
                        Batch: {b.batchId} | {new Date(b.created_at).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: THEME.textPrimary }}>
                        Processed: {b.processed_urls || 0} / {b.total_urls || 0} 
                        {b.failed_urls > 0 && ` | Failed: ${b.failed_urls}`}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        icon={getStatusIcon(b.status)} 
                        label={b.status?.toUpperCase()} 
                        size="small"
                        sx={{
                          backgroundColor: getStatusConfig(b.status).bgColor,
                          color: getStatusConfig(b.status).textColor,
                          fontWeight: 600,
                          border: `1px solid ${getStatusConfig(b.status).textColor}20`
                        }}
                      />
                      
                      {['processing','pending'].includes(b.status) && (
                        <Button 
                          size="small" 
                          startIcon={<Refresh />} 
                          onClick={() => { resumeBatchTracking(b); setShowHistory(false); }}
                          sx={{ fontWeight: 600 }}
                        >
                          Track
                        </Button>
                      )}
                      
                      {canDownloadResults(b.status) && (
                        <Tooltip title="Download Results">
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: THEME.primary,
                              backgroundColor: `${THEME.primary}08`,
                              '&:hover': { backgroundColor: `${THEME.primary}15` }
                            }}
                            onClick={() => downloadResults(b.batchId)}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {canDeleteBatch(b.status) && (
                        <Tooltip title="Delete Batch">
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: THEME.error,
                              backgroundColor: `${THEME.error}08`,
                              '&:hover': { backgroundColor: `${THEME.error}15` }
                            }}
                            onClick={() => setDeleteDialog({ open: true, batchId: b.batchId })}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={() => setShowHistory(false)}
            sx={{ fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stop Dialog */}
      <Dialog 
        open={stopDialog.open} 
        onClose={() => setStopDialog({ open: false, batchId: null })}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
          Stop Batch Processing?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: THEME.textSecondary }}>
            Are you sure you want to stop this batch? Current progress will be saved and you can resume later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setStopDialog({ open: false, batchId: null })}
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={() => stopBatchProcessing(stopDialog.batchId)}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Stop Processing
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, batchId: null })}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
          Delete Batch?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: THEME.textSecondary }}>
            Are you sure you want to delete this batch and all its results? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, batchId: null })}
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={() => deleteBatch(deleteDialog.batchId)}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Delete Batch
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}