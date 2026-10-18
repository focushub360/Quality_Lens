// src/utils/uiExperience.js
/**
 * UI Experience Manager
 * Controls whether a user receives:
 * - 'classic': QualityLens Enterprise (Classic Admin) - Default for normal users, admins, dealers
 * - 'pro':     QualityLens Pro (Tech Edition)       - Default for tech@focus / master admin
 *
 * Can be explicitly configured per-user from the Credentials Vault.
 */

const UI_PREFERENCES_KEY = 'ql_user_ui_preferences';

export const UI_EXPERIENCE_TYPES = {
  CLASSIC: 'classic',
  PRO: 'pro'
};

export const UI_EXPERIENCE_META = {
  classic: {
    id: 'classic',
    name: 'QualityLens Enterprise',
    shortName: 'Enterprise (Classic)',
    badge: 'CLASSIC ADMIN',
    description: 'Standard clean light layout, overview KPIs & dealership monitoring',
    color: '#0DA1B8',
    bgColor: '#E0F2FE',
    textColor: '#0369A1'
  },
  pro: {
    id: 'pro',
    name: 'QualityLens Pro',
    shortName: 'Pro (Tech Edition)',
    badge: 'TECH EDITION',
    description: 'Futuristic luxury tech layout, telemetry trends & advisor benchmarks',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    textColor: '#6D28D9'
  }
};

/**
 * Retrieve all custom stored UI preferences from localStorage
 */
export const getStoredUiPreferences = () => {
  try {
    const raw = localStorage.getItem(UI_PREFERENCES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to parse UI preferences from localStorage:', err);
    return {};
  }
};

/**
 * Save custom UI preference for a user (persisted by user ID and lowercase username)
 */
export const saveUserUiPreference = (userId, username, experience) => {
  try {
    const prefs = getStoredUiPreferences();
    const expValue = experience === 'pro' || experience === 'tech' ? 'pro' : 'classic';

    if (userId) {
      prefs[String(userId)] = expValue;
    }
    if (username) {
      prefs[String(username).toLowerCase().trim()] = expValue;
    }

    localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(prefs));

    // Dispatch global event so components re-evaluate in real-time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ql_ui_preference_changed', {
          detail: {
            userId: userId ? String(userId) : null,
            username: username ? String(username).toLowerCase().trim() : null,
            experience: expValue
          }
        })
      );
    }

    return expValue;
  } catch (err) {
    console.error('Failed to save UI preference:', err);
    return experience;
  }
};

/**
 * Resolves the effective experience ('classic' | 'pro') for a user object or username
 */
export const resolveUserExperience = (userOrUsername) => {
  if (!userOrUsername) return UI_EXPERIENCE_TYPES.CLASSIC;

  let userId = null;
  let username = null;
  let backendExp = null;
  let isMasterRole = false;

  if (typeof userOrUsername === 'string') {
    username = userOrUsername.toLowerCase().trim();
  } else if (typeof userOrUsername === 'object') {
    userId = userOrUsername.id ? String(userOrUsername.id) : (userOrUsername._id ? String(userOrUsername._id) : null);
    username = userOrUsername.username ? String(userOrUsername.username).toLowerCase().trim() : null;
    backendExp = userOrUsername.ui_experience;
    isMasterRole =
      userOrUsername.is_master_admin === true ||
      userOrUsername.role === 'master_admin' ||
      username === 'tech@focus';
  }

  // 1. Check client-side custom preference override
  const prefs = getStoredUiPreferences();
  if (userId && prefs[userId]) {
    return prefs[userId] === 'pro' ? UI_EXPERIENCE_TYPES.PRO : UI_EXPERIENCE_TYPES.CLASSIC;
  }
  if (username && prefs[username]) {
    return prefs[username] === 'pro' ? UI_EXPERIENCE_TYPES.PRO : UI_EXPERIENCE_TYPES.CLASSIC;
  }

  // 2. Check backend stored preference if present
  if (backendExp) {
    const normalized = String(backendExp).toLowerCase().trim();
    if (normalized === 'pro' || normalized === 'tech') return UI_EXPERIENCE_TYPES.PRO;
    if (normalized === 'classic' || normalized === 'enterprise') return UI_EXPERIENCE_TYPES.CLASSIC;
  }

  // 3. Fallback defaults:
  // - tech@focus / master_admin -> Default New UI (Pro Tech Edition)
  // - all others (including admin, super_admin, dealer_admin, dealer_user) -> Default Old UI (Enterprise Classic)
  if (username === 'tech@focus' || isMasterRole) {
    return UI_EXPERIENCE_TYPES.PRO;
  }

  return UI_EXPERIENCE_TYPES.CLASSIC;
};

/**
 * Boolean helper: is this user on the Pro (Tech Edition) experience?
 */
export const isProTechExperience = (user) => {
  return resolveUserExperience(user) === UI_EXPERIENCE_TYPES.PRO;
};
