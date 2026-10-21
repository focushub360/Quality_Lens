import axios from 'axios';

// Primary Production Domain: https://qualitylens.focusengineeringapp.com
// Production Backend SSL Endpoint: https://api.focusengineeringapp.com
const EC2_BACKEND_URL = 'https://api.focusengineeringapp.com';
let API_BASE = process.env.REACT_APP_API_URL || EC2_BACKEND_URL;

// Guard against legacy, stale, or offline endpoints baked into older builds
if (!API_BASE || API_BASE.includes('duckdns') || API_BASE.includes('kdns') || API_BASE.includes('3.110.138.205')) {
  API_BASE = EC2_BACKEND_URL;
}

const api = axios.create({ baseURL: API_BASE });

// Synchronously initialize the default Authorization header if token exists in localStorage
const initialToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
if (initialToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
  clearApiCache();
};

// -------------------------------------------------------------
// High-Speed In-Memory & Session API Cache (0ms Instant Switching)
// -------------------------------------------------------------
const memoryCache = new Map();
const inFlightRequests = new Map();

// URLs that should NOT be cached (real-time polling, status checks, live telemetries, user profile)
const NO_CACHE_PATTERNS = [
  '/status',
  '/analyze',
  '/tasks',
  '/live-activity',
  '/stream',
  '/bulk-batches',
  '/users/me',
  '/quota-status'
];

/**
 * Generates a unique cache key for a request, scoped to the authenticated user token
 */
function getCacheKey(config) {
  const url = config.url || '';
  const params = config.params ? JSON.stringify(config.params) : '';
  const authHeader = config.headers?.Authorization || api.defaults.headers.common['Authorization'] || '';
  return `${authHeader}:${config.baseURL || ''}:${url}?${params}`;
}

/**
 * Checks if a URL should bypass cache
 */
function shouldBypassCache(config) {
  if (config.method && config.method.toLowerCase() !== 'get') return true;
  if (config.skipCache || config.forceRefresh) return true;
  const url = (config.url || '').toLowerCase();
  return NO_CACHE_PATTERNS.some(p => url.includes(p));
}

// Request Interceptor: Return cached response or share in-flight promise
api.interceptors.request.use((config) => {
  if (shouldBypassCache(config)) {
    return config;
  }

  const cacheKey = getCacheKey(config);
  const ttl = config.cacheTTL || 90000; // 90 seconds default TTL for instant tab switching

  // 1. Check memory cache
  const cached = memoryCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < ttl)) {
    // Return cached response via Axios custom adapter mechanism
    config.adapter = () => {
      return Promise.resolve({
        data: JSON.parse(JSON.stringify(cached.data)),
        status: 200,
        statusText: 'OK (Memory Cache)',
        headers: { ...cached.headers, 'x-cache': 'HIT' },
        config,
        request: {}
      });
    };
    return config;
  }

  // 2. Request deduplication (if identical query is currently in flight)
  if (inFlightRequests.has(cacheKey)) {
    config.adapter = () => inFlightRequests.get(cacheKey);
    return config;
  }

  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Cache GET results, clear cache on mutations
api.interceptors.response.use((response) => {
  const config = response.config;
  const method = (config.method || 'get').toLowerCase();

  // If mutation succeeded, invalidate relevant caches
  if (['post', 'put', 'delete', 'patch'].includes(method)) {
    clearApiCache();
    return response;
  }

  // Save to cache if applicable
  if (!shouldBypassCache(config) && response.status === 200) {
    const cacheKey = getCacheKey(config);
    memoryCache.set(cacheKey, {
      data: response.data,
      headers: response.headers,
      timestamp: Date.now()
    });
    inFlightRequests.delete(cacheKey);
  }

  return response;
}, (error) => {
  if (error.config) {
    const cacheKey = getCacheKey(error.config);
    inFlightRequests.delete(cacheKey);
  }
  return Promise.reject(error);
});

/**
 * Invalidate API cache (all or matching a pattern)
 */
export const clearApiCache = (pattern = null) => {
  if (!pattern) {
    memoryCache.clear();
    inFlightRequests.clear();
  } else {
    for (const key of memoryCache.keys()) {
      if (key.includes(pattern)) {
        memoryCache.delete(key);
      }
    }
    for (const key of inFlightRequests.keys()) {
      if (key.includes(pattern)) {
        inFlightRequests.delete(key);
      }
    }
  }
};

export { API_BASE };
export default api;
