import axios from 'axios';

// Primary domain: https://qualitylens.focusengineeringapp.com
// Backend API hosted on EC2 (qualitylensfocustech.duckdns.org / EC2 proxy)
const PRIMARY_DOMAIN = 'https://qualitylens.focusengineeringapp.com';
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
