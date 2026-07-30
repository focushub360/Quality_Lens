import axios from 'axios';

// Determine backend URL:
// 1. Use env var if explicitly set (dev / docker)
// 2. If running on focusengineeringapp.com (Amplify), always point to duckdns backend
// 3. Otherwise fall back to duckdns
const BACKEND_URL = 'https://qualitylensfocustech.duckdns.org';
const API_BASE = process.env.REACT_APP_API_URL || BACKEND_URL;

const api = axios.create({ baseURL: API_BASE });

// Synchronously initialize the default Authorization header if token exists in localStorage
const initialToken = localStorage.getItem('auth_token');
if (initialToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export { API_BASE };
export default api;
