// services/dashboardApi.js

import api from './api';

export const dashboardApi = {
  // Get all results and process on frontend
  getDealerDashboard: async (timeRange = 'week') => {
    try {
      // Get larger limit to have enough data for calculations
      const response = await api.get(`/results?limit=1000&minimal=true`);
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