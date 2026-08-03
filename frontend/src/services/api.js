import axios from 'axios';

// Primary Production Domain: https://qualitylens.focusengineeringapp.com
// Production Backend SSL Endpoint: https://api.focusengineeringapp.com
const EC2_BACKEND_URL = 'https://api.focusengineeringapp.com';
const API_BASE = process.env.REACT_APP_API_URL || EC2_BACKEND_URL;

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
