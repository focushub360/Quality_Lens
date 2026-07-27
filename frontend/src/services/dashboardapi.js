// services/dashboardApi.js

import api from './api';

export const dashboardApi = {
  // Get all results and process on frontend
  getDealerDashboard: async (timeRange = 'week') => {
    try {
      // Pass timeRange to the backend to utilize server-side date indexing and filtering
      const response = await api.get(`/results?limit=1000&minimal=true&timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching results for dashboard:', error);
      throw error;
    }
  },

  // Keep other specific endpoints if needed
  getRecentAnalyses: async (limit = 10) => {
    try {
      const response = await api.get(`/results?limit=${limit}&minimal=true`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
      return [];
    }
  }
};  