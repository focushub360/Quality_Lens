import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, Typography, Button, CircularProgress,
  Card, CardContent, Alert, Chip, Grid, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Tooltip, Snackbar, TextField, MenuItem, Container
} from '@mui/material';
import {
  Upload, PlayArrow, CheckCircle, Error, TableChart,
  Close, History, Refresh, Stop, Delete, Download, Translate,
  CloudUpload, Archive, Description, Warning, Pause
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate, formatDateTime } from '../../utils/dateFormatter';

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

// Persistent storage keys helper (robust to user.id, user._id, or user.username)
const getStorageKeys = (user) => {
  const uId = user ? (user.id || user._id || user.username || (user.email ? user.email.replace(/[@.]/g, '_') : null)) : null;
  const suffix = uId ? `:${uId}` : '_guest';
  return {
    batches: `bulkProcessingBatches${suffix}`,
    status: `bulkActiveStatusSnapshot${suffix}`,
    trackedId: `trackedBulkBatchId${suffix}`,
  };
};

// Batch ownership check: did this user submit this batch?
const isSubmittedByThisUser = (b, user) => {
  if (!user || !b) return false;
  const uId = String(user._id || user.id || '').trim();
  const bSubId = String(b.submitted_by_user_id || '').trim();
  if (uId && bSubId && uId === bSubId) return true;

  const uName = (user.username || '').toLowerCase().trim();
  const bSubName = (b.submitted_by_username || '').toLowerCase().trim();
  if (uName && bSubName && uName === bSubName) return true;

  const uEmail = (user.email || '').toLowerCase().trim();
  const bSubEmail = (b.submitted_by_email || '').toLowerCase().trim();
  if (uEmail && bSubEmail && uEmail === bSubEmail) return true;
  if (uEmail && bSubName && uEmail === bSubName) return true;
  if (uName && bSubEmail && uName === bSubEmail) return true;

  return false;
};

// Dealership affiliation check: ONLY for dealer admins (never for super admin)
const isBelongingToDealership = (b, user) => {
  if (!user || !b) return false;
  const isSuper = user.role === 'super_admin' || user.is_master_admin || user.role === 'master_admin';
  if (isSuper) return false; // Super Admins have no dealership scope and must only see batches they uploaded

  const userDealer = (user.dealer_id || user.showroom_name || '').toLowerCase().trim();
  if (!userDealer || userDealer === 'global' || userDealer === 'global admin' || userDealer === 'focus') return false;

  const bDealerId = (b.dealer_id || '').toLowerCase().trim();
  const bDealerName = (b.dealer_name || '').toLowerCase().trim();

  return Boolean(
    bDealerId === userDealer ||
    bDealerName === userDealer ||
    (userDealer.length > 2 && (bDealerId.includes(userDealer) || userDealer.includes(bDealerId) || bDealerName.includes(userDealer) || userDealer.includes(bDealerName)))
  );
};

// Combined helper for Bulk Upload workbench access
const isBatchForThisLogin = (b, user) => {
  if (!user || !b) return false;
  if (isSubmittedByThisUser(b, user)) return true;
  return isBelongingToDealership(b, user);
};

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

  // Pre-upload validation & duplicate detection state
  const [isValidating, setIsValidating] = useState(false);
  const [validationData, setValidationData] = useState(null);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [dupSearch, setDupSearch] = useState('');
  const [invalidLinksDialogOpen, setInvalidLinksDialogOpen] = useState(false);

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

    const attempted = (status.processed_urls || 0) + (status.failed_urls || 0);
    const remaining = status.total_urls - attempted;

    // Use realistic dual parallel worker estimate (~11s per URL) with greedy INT8 Whisper
    const secPerUrl = 11;           
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

        const attempted = (status.processed_urls || 0) + (status.failed_urls || 0);
    const total = status.total_urls || 0;
    const computedPct = total > 0 ? (attempted / total) * 100 : 0;
    const resolvedPct = (typeof status.progress_percentage === 'number' && status.progress_percentage > 0)
      ? status.progress_percentage
      : computedPct;

    if (status.status !== 'processing') {
      setLiveProgress(resolvedPct);
      liveProgressRef.current = resolvedPct;
      return;
    }

    // Use the server/computed value as floor (never go below it)
    if (resolvedPct > liveProgressRef.current) {
      liveProgressRef.current = resolvedPct;
      setLiveProgress(resolvedPct);
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
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(authUser || null);
  const [quotaInfo, setQuotaInfo] = useState(null);

  const isMounted = useRef(true);
  const pollingIntervalRef = useRef(null);

  // Sync currentUser with AuthContext whenever authUser loads or switches
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
      fetchServerBatches(authUser);
    }
  }, [authUser]);

  // Fetch daily dealer quota
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const cached = localStorage.getItem('ql_dealer_quotas_cache');
        if (cached && currentUser?.dealer_id) {
          const list = JSON.parse(cached);
          const found = list.find(d => d.dealer_id?.toLowerCase() === currentUser.dealer_id?.toLowerCase());
          if (found) {
            setQuotaInfo(found);
            return;
          }
        }
      } catch {}

      try {
        const res = await api.get('/dealer/quota-status');
        if (res.data) setQuotaInfo(res.data);
      } catch (e) {}
    };
    if (currentUser) {
      fetchQuota();
    }
  }, [currentUser]);

  useEffect(() => {
    isMounted.current = true;

    const init = async () => {
      try {
        // 1) Get current user (includes dealer_id and role)
        let me = authUser;
        if (!me || !me.username) {
          const meRes = await api.get('/users/me');
          me = meRes.data;
        }
        setCurrentUser(me);

        // ── INSTANT RESTORE (Per-User Scoped) ─────────────────────────
        try {
          const keys = getStorageKeys(me);
          const snapshot = localStorage.getItem(keys.status);
          if (snapshot) {
            const saved = JSON.parse(snapshot);
            if (saved && saved.batchId && isBatchForThisLogin(saved, me)) {
              setBatchId(saved.batchId);
              setStatus(saved);
              // Restart polling immediately if the batch was still running
              if (['processing', 'pending', 'stopping'].includes(saved.status)) {
                startPolling(saved.batchId, me);
              } else {
                fetchBatchResults(saved.batchId, saved);
              }
            } else {
              // Stale or foreign snapshot: clear it immediately
              localStorage.removeItem(keys.status);
              localStorage.removeItem(keys.trackedId);
              setBatchId(null);
              setStatus(null);
            }
          } else {
            setBatchId(null);
            setStatus(null);
          }
        } catch (e) {
          console.warn('Could not restore status snapshot', e);
        }
        // ─────────────────────────────────────────────────────────────

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
    if (!currentUser) return;
    try {
      const keys = getStorageKeys(currentUser);
      localStorage.setItem(keys.batches, JSON.stringify(activeBatches));
    } catch (err) {
      console.error('Error persisting batches to localStorage:', err);
    }
  }, [activeBatches, currentUser]);

  // Persist full status object to localStorage whenever it changes
  // so we can restore the processing card instantly on page re-visit
  useEffect(() => {
    if (status && currentUser) {
      try {
        const keys = getStorageKeys(currentUser);
        localStorage.setItem(keys.status, JSON.stringify(status));
      } catch (err) {
        console.error('Error persisting status snapshot:', err);
      }
    }
  }, [status, currentUser]);

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
        const total_urls = Number(b.total_urls || 0);
    const processed_urls = Number(b.processed_urls || b.processed || 0);
    const failed_urls = Number(b.failed_urls || 0);
    const attempted = processed_urls + failed_urls;
    const computedProgress = total_urls > 0 ? (attempted / total_urls) * 100 : 0;
    const progress_percentage = (typeof b.progress_percentage === 'number' && b.progress_percentage > 0)
      ? b.progress_percentage
      : computedProgress;

    return {
      ...b,
      batchId: batchIdVal,
      batch_id: b.batch_id || batchIdVal,
      filename,
      created_at,
      total_urls,
      processed_urls,
      failed_urls,
      progress_percentage,
      dealer_id: b.dealer_id || b.dealerId || null,
    };
  };

  const fetchServerBatches = async (me = null) => {
    try {
      const activeUser = me || currentUser || authUser;
      const keys = getStorageKeys(activeUser);
      const res = await api.get('/bulk-batches');
      const serverBatches = Array.isArray(res.data) ? res.data.map(normalizeBatch) : [];
      
      // Strict filtering: only batches belonging to this login (or dealership for non-super dealer admins)
      const finalBatches = serverBatches.filter(b => isBatchForThisLogin(b, activeUser));
      setActiveBatches(finalBatches);
      if (keys) {
        localStorage.setItem(keys.batches, JSON.stringify(finalBatches));
      }

      // 1) Look for previously tracked batch ID in localStorage that belongs to this user
      const savedTrackedId = keys ? localStorage.getItem(keys.trackedId) : null;
      let targetBatch = null;

      if (savedTrackedId) {
        targetBatch = finalBatches.find(b => String(b.batchId) === String(savedTrackedId));
      }
      
      // 2) If no tracked batch or it is not active, prioritize any ACTIVE in-flight batch submitted by THIS user
      if (!targetBatch || !['processing', 'pending', 'stopping'].includes(targetBatch.status)) {
        const myActiveBatch = finalBatches.find(b => 
          ['processing', 'pending', 'stopping'].includes(b.status) &&
          isSubmittedByThisUser(b, activeUser)
        );
        if (myActiveBatch) {
          targetBatch = myActiveBatch;
        } else if (!targetBatch) {
          const dealerActive = finalBatches.find(b => ['processing', 'pending', 'stopping'].includes(b.status));
          if (dealerActive) {
            targetBatch = dealerActive;
          }
        }
      }

      // If we have a verified target batch for this login, track and display it
      if (targetBatch && isBatchForThisLogin(targetBatch, activeUser)) {
        setBatchId(targetBatch.batchId);
        setStatus(targetBatch);
        if (keys) {
          localStorage.setItem(keys.trackedId, targetBatch.batchId);
          localStorage.setItem(keys.status, JSON.stringify(targetBatch));
        }
        if (['processing', 'pending', 'stopping'].includes(targetBatch.status)) {
          startPolling(targetBatch.batchId, activeUser);
        } else {
          fetchBatchResults(targetBatch.batchId, targetBatch);
        }
      } else {
        // No batch belongs to this login: clear state & remove stale keys!
        setBatchId(null);
        setStatus(null);
        if (keys) {
          localStorage.removeItem(keys.trackedId);
          localStorage.removeItem(keys.status);
        }
      }
    } catch (err) {
      console.warn('fetchServerBatches failed, will fallback to localStorage', err);
      loadActiveBatchesFromStorage(me);
    }
  };

  // ---------------------------
  // LocalStorage fallback loader + pruning
  // ---------------------------
  const loadActiveBatchesFromStorage = (me = null) => {
    try {
      const activeUser = me || currentUser || authUser;
      const keys = getStorageKeys(activeUser);
      if (!keys) return;

      const stored = localStorage.getItem(keys.batches);
      if (!stored) return;
      const raw = JSON.parse(stored);

      const normalized = (Array.isArray(raw) ? raw : []).map(normalizeBatch);
      const filtered = normalized.filter(b => isBatchForThisLogin(b, activeUser));

      setActiveBatches(filtered);

      const savedTrackedId = localStorage.getItem(keys.trackedId);
      let targetBatch = null;
      if (savedTrackedId) {
        targetBatch = filtered.find(b => String(b.batchId) === String(savedTrackedId));
      }
      
      if (!targetBatch) {
        targetBatch = filtered.find(b => 
          ['processing', 'pending', 'stopping'].includes(b.status) &&
          isSubmittedByThisUser(b, activeUser)
        );
      }

      if (targetBatch && isBatchForThisLogin(targetBatch, activeUser)) {
        setBatchId(targetBatch.batchId);
        setStatus(targetBatch);
        localStorage.setItem(keys.trackedId, targetBatch.batchId);
        if (['processing', 'pending', 'stopping'].includes(targetBatch.status)) {
          startPolling(targetBatch.batchId, activeUser);
        } else {
          fetchBatchResults(targetBatch.batchId, targetBatch);
        }
      } else {
        setBatchId(null);
        setStatus(null);
        localStorage.removeItem(keys.trackedId);
        localStorage.removeItem(keys.status);
      }
    } catch (err) {
      console.error('Error loading batches from storage:', err);
    }
  };

  const pruneLocalStorage = (me) => {
    try {
      const activeUser = me || currentUser || authUser;
      const keys = getStorageKeys(activeUser);
      if (!keys) return;

      const stored = JSON.parse(localStorage.getItem(keys.batches) || '[]');
      const kept = (stored || []).filter(b => isBatchForThisLogin(b, activeUser)).map(normalizeBatch);
      localStorage.setItem(keys.batches, JSON.stringify(kept));
      setActiveBatches(kept);
    } catch (err) {
      console.error('Error pruning localStorage:', err);
    }
  };

  // ---------------------------
  // File upload & start bulk
  // ---------------------------
  const runValidation = async (selectedFile) => {
    setIsValidating(true);
    setValidationData(null);
    try {
      const vFormData = new FormData();
      vFormData.append('file', selectedFile);
      const res = await api.post('/bulk-validate', vFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data) {
        setValidationData(res.data);
        if (res.data.link_format_validation?.all_invalid || res.data.total_urls === 0) {
          setError(res.data.link_format_validation?.error_message || 'Upload rejected: File contains no valid CitNow video links. Invalid links are not accepted.');
        } else if (res.data.dealer_validation?.mismatch_detected) {
          setError(res.data.dealer_validation.error_message);
        } else {
          setError('');
        }
      }
    } catch (err) {
      console.warn('Pre-validation check error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const nameLower = selectedFile.name.toLowerCase();
    if (nameLower.endsWith('.xlsx') || nameLower.endsWith('.xls')) {
      setFile(selectedFile);
      setError('');
      setValidationData(null);
      setExcelPreview({
        totalRows: 'Checking...',
        message: `File selected: ${selectedFile.name}`
      });
      await runValidation(selectedFile);
    } else {
      setError('Please upload an Excel file (.xlsx or .xls)');
    }
  };

  const handleStartClick = () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    // Block if no valid links found or all links are invalid
    if (validationData?.link_format_validation?.all_invalid || (validationData && validationData.total_urls === 0)) {
      const msg = 'Cannot proceed: Uploaded Excel file contains no valid CitNow video links. Invalid links are not accepted.';
      setError(msg);
      showSnackbarMessage(msg, 'error');
      return;
    }
    // Block if dealer mismatch detected
    if (validationData?.dealer_validation?.mismatch_detected) {
      const msg = validationData.dealer_validation.error_message || 'Dealership mismatch detected.';
      setError(msg);
      showSnackbarMessage(msg, 'error');
      return;
    }
    // If duplicates exist, open prompt dialog
    if (validationData?.duplicate_validation?.has_duplicates) {
      setDuplicateDialogOpen(true);
      return;
    }
    // Otherwise start directly
    executeBulkProcessing(false);
  };

  const executeBulkProcessing = async (skipAlreadyAnalyzed = false) => {
    setDuplicateDialogOpen(false);
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
    formData.append('skip_already_analyzed', skipAlreadyAnalyzed ? 'true' : 'false');

    try {
      const response = await api.post('/bulk-analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      const newBatchId = data.batch_id;
      setBatchId(newBatchId);
      const keys = getStorageKeys(currentUser);

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
        dealer_name: currentUser?.showroom_name || currentUser?.dealer_id || 'Dealership',
        submitted_by_user_id: currentUser?._id || currentUser?.id || null,
        submitted_by_username: currentUser?.username || 'User',
      };

      if (keys) {
        localStorage.setItem(keys.trackedId, newBatchId);
        localStorage.setItem(keys.status, JSON.stringify(initialStatus));
      }

      setStatus(initialStatus);
      saveBatchToStorage(initialStatus);

      // Refresh server list to get canonical saved batch
      await fetchServerBatches(currentUser);

      startPolling(newBatchId, currentUser);
      showSnackbarMessage(
        skipAlreadyAnalyzed 
          ? `Bulk processing started for ${data.total_urls} new items (duplicates skipped)!` 
          : 'Bulk processing started successfully!', 
        'success'
      );

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
  const startPolling = (batchIdToPoll, activeUser = null) => {
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

        const isDone = ['completed', 'failed', 'cancelled'].includes(statusData.status) ||
          (Number(statusData.total_urls) > 0 && Number(statusData.processed_urls) >= Number(statusData.total_urls));

        if (isDone) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          setLoading(false);
          fetchBatchResults(batchIdToPoll);
          // refresh server list for final status
          await fetchServerBatches(activeUser || currentUser);
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

  const fetchBatchResults = async (batchIdToFetch, currentStatusObj = null) => {
    try {
      const response = await api.get(`/bulk-results/${batchIdToFetch}`);
      const results = response.data;
      const activeStatus = currentStatusObj || status;
      if (activeStatus && activeStatus.batchId === batchIdToFetch) {
        const finalStatus = { ...activeStatus, ...results };
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

  const downloadExcel = async (batchIdToDownload) => {
    try {
      const response = await api.get(`/bulk-results/${batchIdToDownload}`);
      const results = response.data.results || [];
      
      if (results.length === 0) {
        showSnackbarMessage('No results found for this batch', 'error');
        return;
      }
      
      const headers = [
        'Dealership', 'Vehicle', 'Service Advisor', 'Video Score', 'Audio Score', 
        'Overall Score', 'Quality', 'Date', 'Status', 'Error Message',
        'Transcription', 'Summary', 'Translation'
      ];
      const csvRows = [headers.join(',')];
      
      results.forEach(r => {
        const m = r.citnow_metadata || {};
        const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
        const date = r.created_at ? formatDate(r.created_at) : '—';
        
        csvRows.push([
          escapeCsv(m.dealership),
          escapeCsv([m.vehicle, m.registration].filter(Boolean).join(' / ')),
          escapeCsv(m.service_advisor),
          (r.video_analysis?.quality_score || 0).toFixed(1),
          (r.audio_analysis?.score || 0).toFixed(1),
          (r.overall_quality?.overall_score || 0).toFixed(1),
          escapeCsv(r.overall_quality?.overall_label),
          escapeCsv(date),
          escapeCsv(r.status),
          escapeCsv(r.error_message),
          escapeCsv(r.transcription?.text),
          escapeCsv(r.summarization?.summary),
          escapeCsv(r.translation?.translated_text)
        ].join(','));
      });
      
      const csvString = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch-${batchIdToDownload}-results.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showSnackbarMessage('CSV downloaded successfully', 'success');
    } catch (err) {
      showSnackbarMessage('Failed to download CSV', 'error');
      console.error('Error downloading CSV:', err);
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
    return formatDateTime(raw);
  };

  const resumeBatchTracking = (batch) => {
    setBatchId(batch.batchId);
    setStatus(batch);
    const keys = getStorageKeys(currentUser);
    if (keys) {
      localStorage.setItem(keys.trackedId, batch.batchId);
    }
    if (['processing', 'pending', 'stopping'].includes(batch.status)) {
      startPolling(batch.batchId, currentUser);
    } else {
      fetchBatchResults(batch.batchId, batch);
    }
  };

  const clearCurrentBatch = () => {
    setBatchId(null);
    setStatus(null);
    setFile(null);
    setExcelPreview(null);
    setList([]);
    const keys = getStorageKeys(currentUser);
    if (keys) {
      localStorage.removeItem(keys.trackedId);
      localStorage.removeItem(keys.status);
    }
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
      case 'paused': return 'warning';
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
      case 'paused': return <Pause />;
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
      stopping: { bgColor: THEME.warningLight, textColor: THEME.warning },
      paused: { bgColor: '#FFFBEB', textColor: '#B45309' }
    };
    return config[status] || config.pending;
  };

  const canStopBatch = (batchStatus) => ['processing', 'pending'].includes(batchStatus);
  const canDeleteBatch = (batchStatus) => ['completed', 'failed', 'cancelled', 'stopping'].includes(batchStatus);
  const canDownloadResults = (batchStatus) => ['completed', 'processing', 'failed', 'cancelled', 'stopping'].includes(batchStatus);

  return (
    <Container maxWidth={false} sx={{
      py: 4,
      px: { xs: 2, sm: 3, md: 5 },
      width: '100%',
      maxWidth: '1440px',
      mx: 'auto'
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
          <Box sx={{ width: '100%', maxWidth: '1440px', display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Daily Quota Pill & Exceeded Banner */}
          {quotaInfo && quotaInfo.daily_limit && (
            <Card sx={{
              background: THEME.surfaceElevated,
              border: `1.5px solid ${((quotaInfo.used_today || 0) >= quotaInfo.daily_limit) ? THEME.error + '50' : THEME.border}`,
              borderRadius: 3,
              boxShadow: THEME.shadowSm,
              p: 2.5
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: THEME.textPrimary }}>
                    Dealership Quota: {currentUser?.showroom_name || currentUser?.dealer_id || 'Active Account'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                    Remaining capacity today: {Math.max(0, quotaInfo.daily_limit - (quotaInfo.used_today || 0))} / {quotaInfo.daily_limit} links
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={`Daily Quota: ${quotaInfo.used_today || 0} / ${quotaInfo.daily_limit} links today`}
                  sx={{
                    fontWeight: 700,
                    fontSize: '11px',
                    bgcolor: ((quotaInfo.used_today || 0) >= quotaInfo.daily_limit) ? '#FEF2F2' : '#F0FDF4',
                    color: ((quotaInfo.used_today || 0) >= quotaInfo.daily_limit) ? THEME.error : THEME.success,
                    border: `1px solid ${((quotaInfo.used_today || 0) >= quotaInfo.daily_limit) ? THEME.error : THEME.success}40`
                  }}
                />
              </Box>
              {((quotaInfo.used_today || 0) >= quotaInfo.daily_limit && quotaInfo.enforce_strict_stop) && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2, textAlign: 'left' }}>
                  <strong>Daily Link Quota Reached ({quotaInfo.daily_limit} / {quotaInfo.daily_limit}):</strong> Your dealership has processed its maximum allowed videos for today. Bulk uploads are temporarily paused. Contact your administrator or Master Admin for quota expansion.
                </Alert>
              )}
            </Card>
          )}

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
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>Video ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>Location Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>Vehicle ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>VIN</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>VP Display Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>Excluded from Stats</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>Vehicle Make</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>New/Used</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: THEME.textPrimary, whiteSpace: 'nowrap' }}>Date</TableCell>
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
                  <Box sx={{ mt: 3 }}>
                    {/* File selection box */}
                    <Box sx={{ p: 2, backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Description sx={{ color: THEME.primary, fontSize: 28 }} />
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="body2" sx={{ color: THEME.textPrimary, fontWeight: 700 }}>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: THEME.textSecondary }}>
                            {validationData?.total_urls ? `${validationData.total_urls} CitNow links detected` : (isValidating ? 'Validating file...' : 'Excel spreadsheet')}
                          </Typography>
                        </Box>
                      </Box>
                      {isValidating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={18} sx={{ color: THEME.primary }} />
                          <Typography variant="caption" sx={{ color: THEME.primary, fontWeight: 600 }}>
                            Validating...
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Dealership Matching Validation Banner */}
                    {validationData?.dealer_validation && (
                      <Box sx={{ mt: 1.5 }}>
                        {validationData.dealer_validation.mismatch_detected ? (
                          <Alert 
                            severity="error" 
                            variant="filled"
                            sx={{ borderRadius: 2, textAlign: 'left', boxShadow: THEME.shadowSm }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              🚫 Dealership Mismatch Detected
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {validationData.dealer_validation.error_message}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.9 }}>
                              Please select an Excel file belonging to <strong>{validationData.dealer_validation.user_dealer}</strong> to proceed.
                            </Typography>
                          </Alert>
                        ) : validationData.dealer_validation.has_dealer_column ? (
                          <Alert 
                            severity="success" 
                            sx={{ borderRadius: 2, textAlign: 'left', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#065F46' }}>
                              🏢 Dealership Verified: {validationData.dealer_validation.excel_dealers.join(', ')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#047857' }}>
                              Matches your assigned dealership account. Ready for analysis.
                            </Typography>
                          </Alert>
                        ) : null}
                      </Box>
                    )}

                    {/* Duplicate Analysis Detection Banner */}
                    {validationData?.duplicate_validation && (
                      <Box sx={{ mt: 1.5 }}>
                        {validationData.duplicate_validation.has_duplicates ? (
                          <Alert 
                            severity="warning" 
                            sx={{ 
                              borderRadius: 2, 
                              textAlign: 'left', 
                              bgcolor: '#FFFBEB', 
                              border: '1px solid rgba(245, 158, 11, 0.4)',
                              '& .MuiAlert-icon': { color: '#D97706' }
                            }}
                            action={
                              <Button 
                                color="warning" 
                                size="small" 
                                variant="contained"
                                onClick={() => setDuplicateDialogOpen(true)}
                                sx={{ 
                                  fontWeight: 700, 
                                  fontSize: '11px',
                                  textTransform: 'none',
                                  bgcolor: '#D97706',
                                  '&:hover': { bgcolor: '#B45309' }
                                }}
                              >
                                Review Duplicates
                              </Button>
                            }
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E' }}>
                              ⚠️ Duplicate Links Found: {validationData.duplicate_validation.already_analyzed_count} of {validationData.total_urls} Links Already Analyzed
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#B45309', display: 'block', mt: 0.25 }}>
                              {validationData.duplicate_validation.new_urls_count} new link(s) • {validationData.duplicate_validation.already_analyzed_count} previously analyzed link(s). Click Start to choose whether to skip or re-analyze.
                            </Typography>
                          </Alert>
                        ) : (
                          <Alert 
                            severity="info" 
                            sx={{ borderRadius: 2, textAlign: 'left', bgcolor: '#F0FDFA', border: '1px solid rgba(13, 161, 184, 0.3)' }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0E7490' }}>
                              ✅ All {validationData.total_urls} Links Are New
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#155E75' }}>
                              None of these video links have been analyzed before in QualityLens.
                            </Typography>
                          </Alert>
                        )}
                      </Box>
                    )}

                    {/* Invalid Link Format Rejection Banner */}
                    {validationData?.link_format_validation && (
                      <Box sx={{ mt: 1.5 }}>
                        {validationData.link_format_validation.all_invalid ? (
                          <Alert 
                            severity="error" 
                            variant="filled"
                            sx={{ borderRadius: 2, textAlign: 'left', boxShadow: THEME.shadowSm }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              🚫 Upload Blocked: No Valid CitNow Links Found
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              All {validationData.link_format_validation.invalid_count || validationData.total_rows} row(s) in this file contain invalid, non-CitNow, or placeholder links. Invalid links are strictly not accepted.
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.9 }}>
                              Please ensure your Excel contains genuine CitNow video URLs (e.g. https://southasia.citnow.com/...) and try again.
                            </Typography>
                          </Alert>
                        ) : validationData.link_format_validation.has_invalid ? (
                          <Alert 
                            severity="error" 
                            sx={{ 
                              borderRadius: 2, 
                              textAlign: 'left', 
                              bgcolor: '#FEF2F2', 
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              '& .MuiAlert-icon': { color: '#EF4444' }
                            }}
                            action={
                              <Button 
                                color="error" 
                                size="small" 
                                variant="outlined"
                                onClick={() => setInvalidLinksDialogOpen(true)}
                                sx={{ 
                                  fontWeight: 700, 
                                  fontSize: '11px',
                                  textTransform: 'none',
                                  borderColor: '#EF4444',
                                  color: '#DC2626',
                                  '&:hover': { bgcolor: '#FEE2E2', borderColor: '#DC2626' }
                                }}
                              >
                                View Rejected ({validationData.link_format_validation.invalid_count})
                              </Button>
                            }
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#991B1B' }}>
                              🚫 {validationData.link_format_validation.invalid_count} Invalid Link(s) Rejected (Not Accepted)
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#B91C1C', display: 'block', mt: 0.25 }}>
                              Only authentic CitNow video links are accepted. The {validationData.link_format_validation.invalid_count} rejected row(s) will be automatically excluded and will NOT consume your quota. {validationData.total_urls} valid links will proceed.
                            </Typography>
                          </Alert>
                        ) : (
                          <Alert 
                            severity="success" 
                            sx={{ borderRadius: 2, textAlign: 'left', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#065F46' }}>
                              🔗 Link Format Verified: CitNow URLs Accepted
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#047857' }}>
                              All {validationData.total_urls} links conform to genuine CitNow video formats.
                            </Typography>
                          </Alert>
                        )}
                      </Box>
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
                  borderRadius: 2.5
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: THEME.textPrimary, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Translate sx={{ color: THEME.primary }} />
                      Translation Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: THEME.textSecondary, mt: 0.5 }}>
                      Select the target language for speech translation, captions, and AI quality evaluation.
                    </Typography>
                  </Box>
                  
                  <Box sx={{ width: { xs: '100%', md: 320 } }}>
                    <TextField 
                      fullWidth 
                      select 
                      size="small"
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
                  </Box>
                </Box>
              </Paper>

              {/* Action Button */}
              <Box sx={{ textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<PlayArrow />}
                  onClick={handleStartClick}
                  disabled={
                    !file || 
                    loading || 
                    isValidating || 
                    Boolean(validationData?.dealer_validation?.mismatch_detected) || 
                    Boolean(validationData?.link_format_validation?.all_invalid) ||
                    (validationData && validationData.total_urls === 0) ||
                    (!!batchId && canStopBatch(status?.status)) || 
                    (quotaInfo && (quotaInfo.used_today || 0) >= quotaInfo.daily_limit && quotaInfo.enforce_strict_stop)
                  }
                  sx={{
                    background: (validationData?.dealer_validation?.mismatch_detected || validationData?.link_format_validation?.all_invalid || (validationData && validationData.total_urls === 0)) ? THEME.textTertiary : THEME.gradientPrimary,
                    borderRadius: 3,
                    px: 6,
                    py: 1.5,
                    fontWeight: 700,
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
                    minWidth: 220
                  }}
                >
                  {loading ? 'Processing...' : (isValidating ? 'Validating File...' : 'Start Bulk Processing')}
                </Button>

                {validationData?.dealer_validation?.mismatch_detected && (
                  <Typography variant="caption" sx={{ color: '#EF4444', display: 'block', mt: 1, fontWeight: 700 }}>
                    ⚠️ Cannot start: Please resolve dealership mismatch first.
                  </Typography>
                )}

                {validationData?.link_format_validation?.all_invalid && (
                  <Typography variant="caption" sx={{ color: '#EF4444', display: 'block', mt: 1, fontWeight: 700 }}>
                    🚫 Cannot start: No valid CitNow links found in file. Invalid links are not accepted.
                  </Typography>
                )}

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
          <Box sx={{ width: '100%', maxWidth: '1440px' }}>
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
                      label={status.status === 'paused' ? 'PAUSED FROM ADMIN SIDE' : status.status?.toUpperCase()} 
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
                        : status.status === 'paused'
                        ? {
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            fontWeight: 800,
                            border: '1.5px solid #F59E0B',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.25)'
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
                        {(() => {
                          const attempted = (status.processed_urls || 0) + (status.failed_urls || 0);
                          const total = status.total_urls || 0;
                          const computedPct = total > 0 ? (attempted / total) * 100 : 0;
                          const displayVal = liveProgress > 0 ? liveProgress : ((typeof status.progress_percentage === 'number' && status.progress_percentage > 0) ? status.progress_percentage : computedPct);
                          return displayVal.toFixed(2);
                        })()}%
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
                  {/* Circular Progress (Neat & Modern Styled) */}
                  {(() => {
                    const attempted = (status.processed_urls || 0) + (status.failed_urls || 0);
                    const total = status.total_urls || 0;
                    const computedPct = total > 0 ? (attempted / total) * 100 : 0;
                    const displayVal = liveProgress > 0 ? liveProgress : ((typeof status.progress_percentage === 'number' && status.progress_percentage > 0) ? status.progress_percentage : computedPct);
                    const formattedProgress = displayVal.toFixed(2);
                    const [intPart, decPart] = formattedProgress.split('.');
                    return (
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                        {/* Background Track Circle */}
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={144}
                          thickness={3.8}
                          sx={{ color: 'rgba(255, 255, 255, 0.08)' }}
                        />
                        {/* Animated Progress Circle (Lime Green) */}
                        <CircularProgress
                          variant="determinate"
                          value={displayVal}
                          size={144}
                          thickness={4.5}
                          sx={{
                            color: status.status === 'failed' ? THEME.error : '#A3E635',
                            position: 'absolute',
                            left: 0,
                            filter: status.status === 'failed'
                              ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))'
                              : 'drop-shadow(0 0 8px rgba(163, 230, 53, 0.35))',
                            '& .MuiCircularProgress-circle': {
                              strokeLinecap: 'round',
                              transition: 'stroke-dashoffset 0.25s ease-out',
                            },
                          }}
                        />
                        {/* Centered Percentage Display - Neat & Spacious */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                            <Typography
                              component="span"
                              sx={{
                                color: '#FFFFFF',
                                fontWeight: 800,
                                fontSize: '1.75rem',
                                lineHeight: 1,
                                letterSpacing: '-0.5px',
                              }}
                            >
                              {intPart}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontWeight: 700,
                                fontSize: '1.05rem',
                                lineHeight: 1,
                              }}
                            >
                              .{decPart}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{
                                color: status.status === 'failed' ? THEME.error : '#A3E635',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                ml: 0.3,
                                lineHeight: 1,
                              }}
                            >
                              %
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })()}

                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.35,
                      borderRadius: 6,
                      bgcolor: status.status === 'failed' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(163, 230, 53, 0.12)',
                      border: `1px solid ${status.status === 'failed' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(163, 230, 53, 0.25)'}`,
                      mb: status.status === 'processing' ? 1 : 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" sx={{ 
                      color: status.status === 'paused' ? '#FCD34D' : (status.status === 'failed' ? THEME.error : '#A3E635'), 
                      fontWeight: 800, 
                      letterSpacing: '1px', 
                      textTransform: 'uppercase',
                      fontSize: '0.72rem',
                    }}>
                      {status.status === 'completed' ? 'BATCH COMPLETE' : (status.status === 'paused' ? 'PAUSED BY ADMIN' : status.status?.toUpperCase())}
                    </Typography>
                  </Box>

                  {status.status === 'paused' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#FDE68A', fontWeight: 800, fontSize: '0.74rem' }}>
                        ⏸ Paused your activity from admin side
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.65rem' }}>
                        Progress saved · Auto-resumes when released
                      </Typography>
                    </Box>
                  )}

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
                        🔄 URL {Math.min((status.processed_urls || 0) + (status.failed_urls || 0) + 1, status.total_urls)} of {status.total_urls}
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

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: THEME.textPrimary, fontWeight: 600 }}>
                        🎥 {status.status === 'completed' ? 'Last Processed URL:' : 'Currently Processing:'}
                      </Typography>
                      {status.status === 'processing' && (
                        <Chip
                          label="⚡ Dual Parallel Workers (Worker #1 & #2 Active)"
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            bgcolor: 'rgba(16, 185, 129, 0.12)',
                            color: '#059669',
                            border: '1px solid rgba(16, 185, 129, 0.25)'
                          }}
                        />
                      )}
                    </Box>
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


                {/* Paused by Admin Banner */}
                {status.status === 'paused' && (
                  <Alert 
                    severity="warning" 
                    icon={<Pause sx={{ color: '#B45309', mt: 0.25 }} />}
                    sx={{ 
                      mt: 2,
                      mb: 2,
                      borderRadius: 2.5,
                      border: '1.5px solid #FDE68A',
                      backgroundColor: '#FFFBEB',
                      color: '#92400E',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.08)',
                      '& .MuiAlert-message': { width: '100%' }
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E', display: 'flex', alignItems: 'center', gap: 1 }}>
                        ⏸️ Paused your activity from admin side
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#B45309', fontSize: '0.85rem', lineHeight: 1.5 }}>
                        Your bulk video analysis is currently on hold by Master Admin. All progress ({status.processed_urls || 0} of {status.total_urls || 0} videos analysed) is securely saved in the database. Analysis will resume automatically from where it paused once released by admin.
                      </Typography>
                    </Box>
                  </Alert>
                )}

                {/* Status Messages */}
                {status.status === 'completed' && (
                  <Box sx={{ mt: 2 }}>
                    <Alert 
                      severity="success" 
                      sx={{ 
                        borderRadius: 2,
                        border: `1px solid ${THEME.successLight}`,
                        backgroundColor: THEME.successLight,
                        mb: 2
                      }}
                    >
                      ✅ Bulk processing completed! Processed: {status.processed_urls} | Failed: {status.failed_urls}
                    </Alert>
                  </Box>
                )}

                {(status.processed_urls > 0 || status.failed_urls > 0 || status.status === 'completed') && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => window.location.href = `/dealer/results?batchId=${status.batchId}`}
                      sx={{
                        flex: 1,
                        background: THEME.gradientPrimary,
                        color: '#fff',
                        fontWeight: 700,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: THEME.shadowLg,
                        '&:hover': {
                          background: THEME.primaryDark
                        }
                      }}
                    >
                      {status.status === 'completed' ? 'VIEW DETAILED RESULTS DASHBOARD' : 'VIEW RESULTS DASHBOARD (LIVE)'}
                    </Button>
                    <Tooltip title={status.status === 'completed' ? 'DOWNLOAD AS EXCEL (CSV)' : 'DOWNLOAD EXCEL SO FAR (LIVE)'}>
                      <IconButton
                        onClick={() => downloadExcel(status.batchId)}
                        sx={{
                          border: `1px solid ${THEME.primary}`,
                          color: THEME.primary,
                          borderRadius: 2,
                          width: 50,
                          height: 50,
                          '&:hover': {
                            backgroundColor: THEME.primaryUltraLight
                          }
                        }}
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="lg" fullWidth>
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
                        Batch: {b.batchId} | {formatDateTime(b.created_at)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: THEME.textPrimary }}>
                        Processed: {b.processed_urls || 0} / {b.total_urls || 0} 
                        {b.failed_urls > 0 && ` | Failed: ${b.failed_urls}`}
                      </Typography>
                      {b.status === 'paused' && (
                        <Box sx={{ mt: 1, p: 0.75, px: 1.25, bgcolor: '#FFFBEB', borderRadius: 1.5, border: '1px solid #FDE68A', display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                          <Pause sx={{ fontSize: 15, color: '#B45309' }} />
                          <Typography variant="caption" sx={{ color: '#92400E', fontWeight: 700 }}>
                            Paused your activity from admin side
                          </Typography>
                        </Box>
                      )}
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

      {/* Duplicate Links Decision Dialog */}
      <Dialog 
        open={duplicateDialogOpen} 
        onClose={() => setDuplicateDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning sx={{ color: '#F59E0B', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#B45309' }}>
              Previously Analyzed Links Detected ({validationData?.duplicate_validation?.already_analyzed_count || 0} Duplicates)
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setDuplicateDialogOpen(false)}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ color: THEME.textPrimary, fontWeight: 700, mb: 0.5 }}>
            We detected that <strong>{validationData?.duplicate_validation?.already_analyzed_count}</strong> of <strong>{validationData?.total_urls}</strong> links in <em>"{file?.name}"</em> have already been analyzed previously in QualityLens.
          </Typography>
          <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2 }}>
            Below is the complete list of previously analyzed records with their recorded vehicle, dealership, score, and analysis date.
          </Typography>

          {/* Search bar & count */}
          {validationData?.duplicate_validation?.already_analyzed_samples?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: THEME.textPrimary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  All Previously Analyzed Links ({(() => {
                    const samples = validationData.duplicate_validation.already_analyzed_samples || [];
                    const q = dupSearch.toLowerCase().trim();
                    if (!q) return samples.length;
                    return samples.filter(item => 
                      (item.url || '').toLowerCase().includes(q) ||
                      (item.vehicle || '').toLowerCase().includes(q) ||
                      (item.dealership || '').toLowerCase().includes(q) ||
                      (item.score || '').toString().toLowerCase().includes(q) ||
                      (item.analyzed_at || '').toLowerCase().includes(q)
                    ).length;
                  })()} shown):
                </Typography>
                <TextField
                  size="small"
                  placeholder="Filter by vehicle, dealer, date, or URL..."
                  value={dupSearch}
                  onChange={(e) => setDupSearch(e.target.value)}
                  sx={{
                    width: 280,
                    '& .MuiOutlinedInput-root': {
                      height: 32,
                      fontSize: '12px',
                      borderRadius: 2,
                      bgcolor: '#fff'
                    }
                  }}
                />
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${THEME.border}`, borderRadius: 2, maxHeight: 340 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: THEME.surface }}>
                      <TableCell sx={{ fontWeight: 800, fontSize: '11px', width: 45 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: '11px' }}>Video URL</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: '11px' }}>Vehicle / Reg</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: '11px' }}>Dealership</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: '11px' }}>Previous Score</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: '11px' }}>Analyzed Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      const samples = validationData.duplicate_validation.already_analyzed_samples || [];
                      const q = dupSearch.toLowerCase().trim();
                      const filtered = !q ? samples : samples.filter(item => 
                        (item.url || '').toLowerCase().includes(q) ||
                        (item.vehicle || '').toLowerCase().includes(q) ||
                        (item.dealership || '').toLowerCase().includes(q) ||
                        (item.score || '').toString().toLowerCase().includes(q) ||
                        (item.analyzed_at || '').toLowerCase().includes(q)
                      );

                      if (filtered.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 3, color: THEME.textTertiary, fontSize: '12px' }}>
                              No matching duplicate links found for "{dupSearch}"
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return filtered.map((item, i) => {
                        const numScore = parseFloat(item.score);
                        let chipBg = 'rgba(13, 161, 184, 0.12)';
                        let chipColor = THEME.primaryDark;
                        if (!isNaN(numScore)) {
                          if (numScore >= 7.0) {
                            chipBg = 'rgba(16, 185, 129, 0.15)';
                            chipColor = '#065F46';
                          } else if (numScore >= 5.5) {
                            chipBg = 'rgba(245, 158, 11, 0.18)';
                            chipColor = '#92400E';
                          } else {
                            chipBg = 'rgba(239, 68, 68, 0.15)';
                            chipColor = '#991B1B';
                          }
                        }

                        return (
                          <TableRow key={i} hover>
                            <TableCell sx={{ fontSize: '11px', color: THEME.textTertiary, fontWeight: 600 }}>
                              {i + 1}
                            </TableCell>
                            <TableCell sx={{ fontSize: '11px', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <Typography 
                                component="a"
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                variant="caption" 
                                sx={{ 
                                  fontFamily: 'monospace', 
                                  color: THEME.primary, 
                                  textDecoration: 'none',
                                  '&:hover': { textDecoration: 'underline' } 
                                }}
                              >
                                {item.url}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: '11px' }}>
                              <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 700, color: THEME.textPrimary }}>
                                {item.vehicle || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: '11px' }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: THEME.textSecondary, bgcolor: THEME.surface, px: 1, py: 0.25, borderRadius: 1, border: `1px solid ${THEME.borderLight}` }}>
                                {item.dealership || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: '11px' }}>
                              <Chip 
                                label={`${item.score || 'Completed'} ${item.label ? `(${item.label})` : ''}`} 
                                size="small" 
                                sx={{ height: 22, fontSize: '10.5px', fontWeight: 800, bgcolor: chipBg, color: chipColor }} 
                              />
                            </TableCell>
                            <TableCell sx={{ fontSize: '11px', fontWeight: 600, color: THEME.textPrimary }}>
                              {item.analyzed_at || '—'}
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(13, 161, 184, 0.08)', border: '1px solid rgba(13, 161, 184, 0.25)' }}>
            <Typography variant="caption" sx={{ color: THEME.primaryDark, fontWeight: 600 }}>
              💡 <strong>Smart Quota Saving:</strong> Skipping already analyzed links will process only the <strong>{validationData?.duplicate_validation?.new_urls_count} new link(s)</strong> and preserve your daily allowance for remaining videos.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, justifyContent: 'space-between' }}>
          <Button onClick={() => setDuplicateDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {validationData?.duplicate_validation?.new_urls_count > 0 && (
              <Button
                variant="contained"
                onClick={() => executeBulkProcessing(true)}
                sx={{
                  background: THEME.gradientSuccess,
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2.5,
                  borderRadius: 2
                }}
              >
                Skip Analyzed & Process {validationData.duplicate_validation.new_urls_count} New Links
              </Button>
            )}
            <Button
              variant="outlined"
              color="warning"
              onClick={() => executeBulkProcessing(false)}
              sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 2 }}
            >
              Re-Analyze All ({validationData?.total_urls} Links)
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      {/* Rejected Invalid Links Dialog */}
      <Dialog open={invalidLinksDialogOpen} onClose={() => setInvalidLinksDialogOpen(false)} maxWidth="lg" fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#B91C1C', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Error sx={{ color: '#EF4444' }} />
          Rejected Invalid Links ({validationData?.link_format_validation?.invalid_count})
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ color: THEME.textPrimary, fontWeight: 700, mb: 1 }}>
            The following items in <em>"{file?.name}"</em> do not contain authentic CitNow video links and were <strong>rejected</strong>.
          </Typography>
          <Typography variant="body2" sx={{ color: THEME.textSecondary, mb: 2 }}>
            QualityLens only accepts authentic CitNow video URLs. These rejected rows will <strong>not be accepted or processed</strong> and will <strong>not consume your daily CAPEX quota</strong>.
          </Typography>

          {validationData?.link_format_validation?.invalid_samples?.length > 0 && (
            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${THEME.border}`, borderRadius: 2, maxHeight: 300, mb: 2 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: THEME.surface }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px', width: '90px' }}>Excel Row</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px' }}>Raw Value in File</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '11px' }}>Rejection Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validationData.link_format_validation.invalid_samples.map((item, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: '#B91C1C' }}>
                        Row {item.row}
                      </TableCell>
                      <TableCell sx={{ fontSize: '11px', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', bgcolor: '#FEE2E2', px: 1, py: 0.25, borderRadius: 1, color: '#991B1B' }}>
                          {item.value || '(empty)'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '11px', color: '#B91C1C', fontWeight: 600 }}>
                        {item.reason}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#FEF2F2', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <Typography variant="caption" sx={{ color: '#991B1B', fontWeight: 600 }}>
              🛡️ <strong>Quota & Pipeline Protection:</strong> Invalid links are strictly not accepted to protect your dealership quota and guarantee accurate benchmark reporting.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button onClick={() => setInvalidLinksDialogOpen(false)} variant="contained" sx={{ bgcolor: THEME.primary, fontWeight: 700, borderRadius: 2, textTransform: 'none' }}>
            Understood
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