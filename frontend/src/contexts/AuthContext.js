import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { setAuthToken, API_BASE } from '../services/api';
import { updateUserProfile } from '../services/users';

export const AuthContext = createContext(null);
export const useAuth = () => React.useContext(AuthContext);

// Removed local API_BASE definition to use the centralized one from api.js

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true to check persistence

  const isAuthenticated = !!token;
  const role = user?.role;

  // Initialize: Check for existing token and fetch user
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        try {
          setAuthToken(savedToken);
          const me = await axios.get(`${API_BASE}/users/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          setUser(me.data);
          setToken(savedToken);
        } catch (error) {
          console.error("Session restoration failed:", error);
          localStorage.removeItem('auth_token');
          setToken(null);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.append('username', username);
      form.append('password', password);

      const res = await axios.post(`${API_BASE}/token`, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const access = res.data?.access_token;
      if (!access) throw new Error('Invalid token response');

      localStorage.setItem('auth_token', access);
      setToken(access);
      setAuthToken(access);

      const me = await axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      setUser(me.data);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }, []);

  // UPDATED: Use the imported function instead of direct axios call
  const updateProfile = useCallback(async (profileData) => {
    try {
      const updatedUser = await updateUserProfile(profileData);

      setUser(prevUser => ({
        ...prevUser,
        ...profileData, // Ensure we keep what we sent
        ...updatedUser  // Overlay with backend response
      }));

      return updatedUser;
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to update profile';
      throw new Error(errorMessage);
    }
  }, []); 

  useEffect(() => {
    // Whenever token changes, update global axios header
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      isAuthenticated,
      loading,
      login,
      logout,
      updateProfile,
      API_BASE,
    }),
    [token, user, role, isAuthenticated, loading, login, logout, updateProfile]
  );

  // Don't render children until we've finished checking for an existing session
  if (loading && !user && token) {
    return null; // Or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
