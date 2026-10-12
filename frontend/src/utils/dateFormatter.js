/**
 * Date and Timestamp Formatting Utility
 * Enforces strict DD/MM/YYYY format across all application views.
 */

export function parseFlexibleDate(input) {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  // If numeric timestamp
  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed || trimmed === '—' || trimmed === '-' || trimmed.toLowerCase() === 'never' || trimmed.toLowerCase() === 'recent') {
      return null;
    }

    // Check if numeric string timestamp
    if (/^\d{10,}$/.test(trimmed)) {
      const d = new Date(Number(trimmed));
      if (!isNaN(d.getTime())) return d;
    }

    // Standard ISO / RFC parse
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    // Check if format is MM/DD/YYYY or DD/MM/YYYY
    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?/i);
    if (slashMatch) {
      let [, part1, part2, yearStr, hourStr, minStr, secStr, ampm] = slashMatch;
      let year = parseInt(yearStr, 10);
      if (year < 100) year += 2000;
      let p1 = parseInt(part1, 10);
      let p2 = parseInt(part2, 10);

      // If p1 > 12, p1 must be day, p2 is month
      let day, month;
      if (p1 > 12) {
        day = p1;
        month = p2;
      } else {
        month = p1;
        day = p2;
      }

      let hours = hourStr ? parseInt(hourStr, 10) : 0;
      const minutes = minStr ? parseInt(minStr, 10) : 0;
      const seconds = secStr ? parseInt(secStr, 10) : 0;
      if (ampm) {
        if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
      }

      const d = new Date(year, month - 1, day, hours, minutes, seconds);
      if (!isNaN(d.getTime())) return d;
    }
  }

  return null;
}

/**
 * Formats a date strictly as DD/MM/YYYY
 * e.g. "11/10/2026"
 */
export function formatDate(input, fallback = '—') {
  const d = parseFlexibleDate(input);
  if (!d) return (typeof input === 'string' && input) ? input : fallback;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formats a timestamp strictly as DD/MM/YYYY, hh:mm AM/PM
 * e.g. "11/10/2026, 8:39 AM"
 */
export function formatDateTime(input, { includeSeconds = false, fallback = '—' } = {}) {
  const d = parseFlexibleDate(input);
  if (!d) return (typeof input === 'string' && input) ? input : fallback;

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  if (includeSeconds) {
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
}

export default {
  formatDate,
  formatDateTime,
  parseFlexibleDate
};
