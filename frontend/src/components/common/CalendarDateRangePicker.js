import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Popover,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import {
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  ArrowDropDown,
  Close,
  Check,
  FiberManualRecord,
  Today as TodayIcon
} from '@mui/icons-material';

const THEME = {
  primary: '#0DA1B8',
  primaryDark: '#0C587D',
  primaryLight: '#3BC5D9',
  primaryUltraLight: '#F0FDFA',
  accent: '#00B4DB',
  accentLight: '#E0F2FE',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  gradientPrimary: 'linear-gradient(135deg, #0083B0 0%, #00B4DB 100%)',
  shadowLg: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Helpers for date calculations
function formatYMD(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseYMD(str) {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return new Date(str);
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return formatYMD(d1) === formatYMD(d2);
}

function isDateInRange(target, start, end) {
  if (!target || !start || !end) return false;
  const t = new Date(target).setHours(0, 0, 0, 0);
  const s = new Date(start).setHours(0, 0, 0, 0);
  const e = new Date(end).setHours(0, 0, 0, 0);
  return t >= s && t <= e;
}

export default function CalendarDateRangePicker({
  startDate,
  endDate,
  dateFilterPreset = 'All Time',
  onApply,
  onClear,
  activityMap = {},
  disabled = false
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  // Temporary selection state while popover is open
  const [tempStart, setTempStart] = useState(startDate ? parseYMD(startDate) : null);
  const [tempEnd, setTempEnd] = useState(endDate ? parseYMD(endDate) : null);
  const [tempPreset, setTempPreset] = useState(dateFilterPreset || 'All Time');
  const [hoverDate, setHoverDate] = useState(null);

  // Calendar month/year navigation state
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(() => (tempStart ? tempStart.getFullYear() : today.getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (tempStart ? tempStart.getMonth() : today.getMonth()));

  // Keep state synced when props change externally
  useEffect(() => {
    if (startDate) setTempStart(parseYMD(startDate));
    else setTempStart(null);

    if (endDate) setTempEnd(parseYMD(endDate));
    else setTempEnd(null);

    setTempPreset(dateFilterPreset || 'All Time');
  }, [startDate, endDate, dateFilterPreset]);

  // When opening popover, reset view to selected date or current date
  const handleOpen = (e) => {
    if (disabled) return;
    setAnchorEl(e.currentTarget);
    const refDate = tempStart || today;
    setViewYear(refDate.getFullYear());
    setViewMonth(refDate.getMonth());
    setTempStart(startDate ? parseYMD(startDate) : null);
    setTempEnd(endDate ? parseYMD(endDate) : null);
    setTempPreset(dateFilterPreset || 'All Time');
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoverDate(null);
  };

  // Month navigation handlers
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const goToTodayMonth = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // Day click logic
  const handleDateClick = (dayDate) => {
    if (!tempStart || (tempStart && tempEnd)) {
      // First click: start a new range
      setTempStart(dayDate);
      setTempEnd(null);
      setTempPreset('Custom');
    } else if (tempStart && !tempEnd) {
      // Second click: finish the range
      if (dayDate < tempStart) {
        setTempEnd(tempStart);
        setTempStart(dayDate);
      } else {
        setTempEnd(dayDate);
      }
      setTempPreset('Custom');
    }
  };

  // Quick Preset Selection
  const applyPreset = (presetKey) => {
    setTempPreset(presetKey);
    const now = new Date();
    const tDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (presetKey === 'All Time') {
      setTempStart(null);
      setTempEnd(null);
      return;
    }

    if (presetKey === 'Today') {
      setTempStart(tDay);
      setTempEnd(tDay);
      setViewYear(tDay.getFullYear());
      setViewMonth(tDay.getMonth());
      return;
    }

    if (presetKey === 'Yesterday') {
      const yDay = new Date(tDay);
      yDay.setDate(yDay.getDate() - 1);
      setTempStart(yDay);
      setTempEnd(yDay);
      setViewYear(yDay.getFullYear());
      setViewMonth(yDay.getMonth());
      return;
    }

    if (presetKey === 'Last 7 Days') {
      const s = new Date(tDay);
      s.setDate(s.getDate() - 6);
      setTempStart(s);
      setTempEnd(tDay);
      setViewYear(tDay.getFullYear());
      setViewMonth(tDay.getMonth());
      return;
    }

    if (presetKey === 'This Month') {
      const s = new Date(tDay.getFullYear(), tDay.getMonth(), 1);
      setTempStart(s);
      setTempEnd(tDay);
      setViewYear(tDay.getFullYear());
      setViewMonth(tDay.getMonth());
      return;
    }

    if (presetKey === 'Last 30 Days') {
      const s = new Date(tDay);
      s.setDate(s.getDate() - 29);
      setTempStart(s);
      setTempEnd(tDay);
      setViewYear(tDay.getFullYear());
      setViewMonth(tDay.getMonth());
      return;
    }
  };

  // Apply final selection
  const handleApply = () => {
    handleClose();
    if (tempPreset === 'All Time' || (!tempStart && !tempEnd)) {
      onClear?.();
      return;
    }

    const finalStart = tempStart || tempEnd;
    const finalEnd = tempEnd || tempStart;
    const sStr = formatYMD(finalStart);
    const eStr = formatYMD(finalEnd);

    onApply?.({
      startDate: sStr,
      endDate: eStr,
      preset: tempPreset,
      label: formatDisplayLabel(tempPreset, finalStart, finalEnd)
    });
  };

  const handleReset = () => {
    setTempStart(null);
    setTempEnd(null);
    setTempPreset('All Time');
    handleClose();
    onClear?.();
  };

  // Display label for trigger button
  function formatDisplayLabel(preset, s, e) {
    if (preset && preset !== 'Custom' && preset !== 'All Time') {
      return preset;
    }
    if (!s && !e) return 'All Time';
    const sFormatted = s ? s.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const eFormatted = e ? e.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    if (s && e && isSameDay(s, e)) return sFormatted;
    if (s && e) return `${sFormatted} – ${eFormatted}`;
    return sFormatted || eFormatted;
  }

  const triggerLabel = useMemo(() => {
    if (dateFilterPreset && dateFilterPreset !== 'Custom') {
      return dateFilterPreset === 'All Time' ? 'All Time' : dateFilterPreset;
    }
    if (startDate || endDate) {
      const s = parseYMD(startDate);
      const e = parseYMD(endDate);
      return formatDisplayLabel('Custom', s, e);
    }
    return 'All Time';
  }, [dateFilterPreset, startDate, endDate]);

  // Generate calendar days for current view
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    // Leading padding days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, prevMonthDays - i);
      cells.push({ date: d, isCurrentMonth: false });
    }

    // Days of current month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      cells.push({ date: d, isCurrentMonth: true });
    }

    // Trailing padding days to fill 7 columns (up to 35 or 42 total cells)
    const totalRemaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= totalRemaining; day++) {
      const d = new Date(viewYear, viewMonth + 1, day);
      cells.push({ date: d, isCurrentMonth: false });
    }

    return cells;
  }, [viewYear, viewMonth]);

  // Calculate month uploads total for summary badge
  const monthUploadTotal = useMemo(() => {
    let sum = 0;
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    Object.keys(activityMap || {}).forEach(k => {
      if (k.startsWith(prefix)) {
        sum += (activityMap[k]?.count || 0);
      }
    });
    return sum;
  }, [viewYear, viewMonth, activityMap]);

  return (
    <Box sx={{ display: 'inline-block' }}>
      {/* ─── Trigger Button ─── */}
      <Box
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.8,
          minWidth: 165,
          height: 40,
          background: THEME.surfaceElevated,
          borderRadius: 2,
          border: `1px solid ${triggerLabel !== 'All Time' ? THEME.primary : THEME.border}`,
          cursor: disabled ? 'default' : 'pointer',
          boxShadow: triggerLabel !== 'All Time' ? `0 0 0 2px ${THEME.primary}20` : 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: THEME.primary,
            backgroundColor: THEME.surface
          }
        }}
      >
        <CalendarMonth
          sx={{
            fontSize: 18,
            color: triggerLabel !== 'All Time' ? THEME.primary : THEME.textSecondary
          }}
        />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="caption"
            sx={{
              color: THEME.textTertiary,
              fontSize: '0.68rem',
              lineHeight: 1,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Date Range
          </Typography>
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: THEME.textPrimary,
              fontWeight: triggerLabel !== 'All Time' ? 700 : 500,
              fontSize: '0.84rem'
            }}
          >
            {triggerLabel}
          </Typography>
        </Box>

        {triggerLabel !== 'All Time' ? (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            sx={{
              p: 0.3,
              color: THEME.textTertiary,
              '&:hover': { color: THEME.error, bgcolor: THEME.errorLight }
            }}
          >
            <Close sx={{ fontSize: 14 }} />
          </IconButton>
        ) : (
          <ArrowDropDown sx={{ color: THEME.textTertiary, fontSize: 20 }} />
        )}
      </Box>

      {/* ─── Calendar Popover ─── */}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: THEME.shadowLg,
            border: `1px solid ${THEME.border}`,
            background: THEME.surfaceElevated,
            overflow: 'hidden',
            width: { xs: 320, sm: 620 },
            maxWidth: '96vw'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
          {/* Left Column: Quick Presets Sidebar */}
          <Box
            sx={{
              width: { xs: '100%', sm: 180 },
              background: THEME.surface,
              borderRight: { xs: 'none', sm: `1px solid ${THEME.border}` },
              borderBottom: { xs: `1px solid ${THEME.border}`, sm: 'none' },
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: THEME.textTertiary,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  display: 'block',
                  mb: 1.5,
                  px: 1
                }}
              >
                Date Presets
              </Typography>
              <Stack spacing={0.6}>
                {[
                  { key: 'All Time', label: 'All Time' },
                  { key: 'Today', label: 'Today' },
                  { key: 'Yesterday', label: 'Yesterday' },
                  { key: 'Last 7 Days', label: 'Last 7 Days' },
                  { key: 'This Month', label: 'This Month' },
                  { key: 'Last 30 Days', label: 'Last 30 Days' },
                  { key: 'Custom', label: 'Custom Range' }
                ].map(({ key, label }) => {
                  const isActive = tempPreset === key;
                  return (
                    <Button
                      key={key}
                      size="small"
                      onClick={() => applyPreset(key)}
                      sx={{
                        justifyContent: 'flex-start',
                        py: 0.8,
                        px: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '0.82rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? THEME.primary : THEME.textPrimary,
                        backgroundColor: isActive ? THEME.primaryUltraLight : 'transparent',
                        border: isActive ? `1px solid ${THEME.primary}40` : '1px solid transparent',
                        '&:hover': {
                          backgroundColor: isActive ? THEME.primaryUltraLight : 'rgba(0,0,0,0.03)'
                        }
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Stack>
            </Box>

            {/* Upload Activity Summary in Sidebar */}
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                background: THEME.surfaceElevated,
                borderRadius: 2,
                border: `1px solid ${THEME.borderLight}`
              }}
            >
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 600 }}>
                {MONTH_NAMES[viewMonth]} Uploads
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: monthUploadTotal > 0 ? THEME.success : THEME.textTertiary
                  }}
                />
                <Typography variant="body2" fontWeight="700" sx={{ color: THEME.textPrimary }}>
                  {monthUploadTotal} video{monthUploadTotal === 1 ? '' : 's'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Column: Month Calendar View */}
          <Box sx={{ flex: 1, p: 2.5 }}>
            {/* Calendar Month Navigation Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" fontWeight="700" sx={{ color: THEME.textPrimary }}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </Typography>
                <Chip
                  label="Today"
                  size="small"
                  onClick={goToTodayMonth}
                  icon={<TodayIcon sx={{ fontSize: '13px !important' }} />}
                  sx={{
                    height: 22,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: THEME.surface,
                    border: `1px solid ${THEME.border}`,
                    '&:hover': { background: THEME.primaryUltraLight, borderColor: THEME.primary }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" onClick={goToPrevMonth} sx={{ border: `1px solid ${THEME.border}` }}>
                  <ChevronLeft sx={{ fontSize: 18 }} />
                </IconButton>
                <IconButton size="small" onClick={goToNextMonth} sx={{ border: `1px solid ${THEME.border}` }}>
                  <ChevronRight sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Weekdays Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                textAlign: 'center',
                mb: 1
              }}
            >
              {WEEKDAY_NAMES.map(dayName => (
                <Typography
                  key={dayName}
                  variant="caption"
                  sx={{
                    color: THEME.textTertiary,
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}
                >
                  {dayName}
                </Typography>
              ))}
            </Box>

            {/* Days Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                rowGap: '4px',
                columnGap: '2px'
              }}
            >
              {calendarCells.map(({ date, isCurrentMonth }, idx) => {
                const dateKey = formatYMD(date);
                const activity = activityMap[dateKey] || { count: 0, avgScore: 0 };
                const isSelectedStart = tempStart && isSameDay(date, tempStart);
                const isSelectedEnd = tempEnd && isSameDay(date, tempEnd);
                const hoverEnd = (!tempEnd && hoverDate) ? hoverDate : null;
                const effectiveStart = (hoverEnd && hoverEnd < tempStart) ? hoverEnd : tempStart;
                const effectiveEnd = (hoverEnd && hoverEnd > tempStart) ? hoverEnd : tempEnd;
                const inRange = isDateInRange(date, effectiveStart, effectiveEnd);
                const isCurrentToday = isSameDay(date, today);

                // Activity tier color-coding:
                // High Uploads: >= 4 (Green)
                // Moderate Uploads: 1 to 3 (Yellow/Amber)
                // Zero Uploads: 0 (Gray/Neutral)
                const isHighActivity = activity.count >= 4;
                const isMediumActivity = activity.count >= 1 && activity.count < 4;
                const hasUploads = activity.count > 0;

                const activityColor = isHighActivity
                  ? THEME.success
                  : isMediumActivity
                  ? THEME.warning
                  : THEME.textTertiary;

                // Range background styles
                let cellBg = 'transparent';
                let textColor = isCurrentMonth ? THEME.textPrimary : THEME.textTertiary;
                let borderRadius = '8px';

                if (isSelectedStart || isSelectedEnd) {
                  cellBg = THEME.gradientPrimary;
                  textColor = '#FFFFFF';
                  borderRadius = isSelectedStart && tempEnd && !isSelectedEnd ? '8px 0 0 8px' : '8px';
                  if (isSelectedEnd && tempStart && !isSelectedStart) borderRadius = '0 8px 8px 0';
                } else if (inRange) {
                  cellBg = THEME.primaryUltraLight;
                  textColor = THEME.primaryDark;
                  borderRadius = '0';
                }

                const tooltipTitle = (
                  <Box sx={{ p: 0.5, textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight="700" sx={{ display: 'block', color: '#FFFFFF' }}>
                      {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.3 }}>
                      <FiberManualRecord sx={{ fontSize: 10, color: activityColor }} />
                      <Typography variant="caption" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                        {activity.count > 0 ? `${activity.count} video${activity.count > 1 ? 's' : ''} uploaded` : 'No uploads'}
                      </Typography>
                    </Box>
                    {activity.count > 0 && activity.avgScore > 0 && (
                      <Typography variant="caption" sx={{ display: 'block', color: '#3BC5D9', mt: 0.2 }}>
                        Avg Score: {Number(activity.avgScore).toFixed(1)}/10
                      </Typography>
                    )}
                  </Box>
                );

                return (
                  <Tooltip key={idx} title={tooltipTitle} arrow placement="top">
                    <Box
                      onClick={() => handleDateClick(date)}
                      onMouseEnter={() => setHoverDate(date)}
                      onMouseLeave={() => setHoverDate(null)}
                      sx={{
                        height: 44,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                        background: cellBg,
                        borderRadius: borderRadius,
                        transition: 'all 0.15s ease',
                        border: isCurrentToday && !isSelectedStart && !isSelectedEnd ? `1.5px solid ${THEME.primary}` : '1.5px solid transparent',
                        '&:hover': {
                          background: isSelectedStart || isSelectedEnd ? THEME.gradientPrimary : THEME.accentLight,
                          transform: 'scale(1.05)',
                          zIndex: 2
                        }
                      }}
                    >
                      {/* Day Number */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.82rem',
                          fontWeight: (isSelectedStart || isSelectedEnd || isCurrentToday) ? 700 : 500,
                          color: textColor,
                          lineHeight: 1
                        }}
                      >
                        {date.getDate()}
                      </Typography>

                      {/* Day Upload Activity Indicator (Color Coded Green / Red / Amber) */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', mt: '3px' }}>
                        {hasUploads ? (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              px: 0.4,
                              height: 12,
                              borderRadius: '6px',
                              background: isSelectedStart || isSelectedEnd
                                ? 'rgba(255, 255, 255, 0.3)'
                                : isHighActivity
                                ? THEME.successLight
                                : THEME.warningLight,
                              border: `1px solid ${
                                isSelectedStart || isSelectedEnd
                                  ? '#FFFFFF'
                                  : isHighActivity
                                  ? THEME.success
                                  : THEME.warning
                              }`
                            }}
                          >
                            <Box
                              sx={{
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                background: isSelectedStart || isSelectedEnd ? '#FFFFFF' : activityColor,
                                mr: 0.3
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                lineHeight: 1,
                                color: isSelectedStart || isSelectedEnd ? '#FFFFFF' : activityColor
                              }}
                            >
                              {activity.count}
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 3,
                              height: 3,
                              borderRadius: '50%',
                              background: isSelectedStart || isSelectedEnd ? '#FFFFFF' : THEME.borderLight
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>

            {/* Activity Heatmap Color Code Legend */}
            <Box
              sx={{
                mt: 2.5,
                pt: 1.5,
                borderTop: `1px solid ${THEME.borderLight}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 700 }}>
                Upload Volume:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: THEME.success }} />
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                    High (≥4)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: THEME.warning }} />
                  <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
                    Medium (1–3)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                  <Typography variant="caption" sx={{ color: THEME.textTertiary, fontWeight: 500 }}>
                    No Uploads (0)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Popover Action Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            background: THEME.surface,
            borderTop: `1px solid ${THEME.border}`
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: THEME.textSecondary, fontWeight: 600 }}>
              {tempStart && tempEnd ? (
                <>
                  Selected: <strong>{formatDisplayLabel('Custom', tempStart, tempEnd)}</strong>
                </>
              ) : tempStart ? (
                <>
                  Select end date (Start: <strong>{formatDisplayLabel('Custom', tempStart, null)}</strong>)
                </>
              ) : (
                'Viewing all records'
              )}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="text"
              onClick={handleReset}
              sx={{ color: THEME.textSecondary, fontWeight: 600, textTransform: 'none' }}
            >
              Reset
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleClose}
              sx={{
                borderColor: THEME.border,
                color: THEME.textPrimary,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleApply}
              startIcon={<Check sx={{ fontSize: 16 }} />}
              sx={{
                background: THEME.gradientPrimary,
                fontWeight: 700,
                textTransform: 'none',
                px: 2
              }}
            >
              Apply Range
            </Button>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
}
