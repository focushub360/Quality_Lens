// src/services/dealerUsers.js
import api from './api';

/*
  Dealer Users service
  These functions help dealer_admin manage only their own team's users.
  It uses the same /users backend endpoints but keeps everything scoped to their dealer_id.
*/

// 🔹 Get all users under a specific dealer
export const listDealerUsers = async (dealerId) => {
  try {
    if (!dealerId) {
      throw new Error('Dealer ID is required');
    }

    //console.log(`🔄 [listDealerUsers] Fetching users for dealer: "${dealerId}"`);
    const res = await api.get(`/users/by-dealer/${dealerId}`);
    //console.log(`✅ [listDealerUsers] Found ${res.data.length} users for dealer "${dealerId}"`);
    return res.data;
  } catch (err) {
    //console.error('❌ [listDealerUsers] Error fetching dealer users:', err);
    //console.error('❌ [listDealerUsers] Error response:', err.response?.data);
    throw err;
  }
};
// 🔹 Get user statistics including video counts
export const getDealerUserStats = async (dealerId) => {
  try {
    console.log(`📡 Fetching user stats for dealer: ${dealerId}`);
    const res = await api.get(`/dashboard/dealer/${dealerId}/user-stats`);
    console.log('📡 Raw API response:', res.data);
    console.log('📡 Type of response:', typeof res.data);
    console.log('📡 Is array?', Array.isArray(res.data));

    const data = res.data;

    // ALWAYS return an array
    if (Array.isArray(data)) {
      return data;
    }

    // If it's an object but not an array, check for common structures
    if (data && typeof data === 'object') {
      if (data.users && Array.isArray(data.users)) {
        return data.users;
      }
      // Try to convert object values to array
      const values = Object.values(data);
      if (values.length > 0) {
        return values;
      }
    }

    // Fallback to empty array
    return [];

  } catch (err) {
    console.error('❌ Error fetching dealer user stats:', err);
    // Don't throw - return empty array instead
    return [];
  }
};

// ... rest of your functions remain the same
export const createDealerUser = async (userData) => {
  try {
    const payload = {
      ...userData,
      ...userData,
      role: userData.role || 'dealer_user',
    };
    const res = await api.post('/users/', payload);
    return res.data;
  } catch (err) {
    //console.error('Error creating dealer user:', err);
    throw err;
  }
};

export const updateDealerUser = async (id, data) => {
  try {
    const payload = { ...data };
    if (!payload.password) {
      delete payload.password; // don't send empty passwords on update
    }
    const res = await api.put(`/users/${id}`, payload);
    return res.data;
  } catch (err) {
    //console.error('Error updating dealer user:', err);
    throw err;
  }
};

export const deleteDealerUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    //console.error('Error deleting dealer user:', err);
    throw err;
  }
};

// 🔹 Delete Dealership (Super Admin Security Authorization)
export const deleteDealership = async (dealerId, dealerIdConfirm, adminPassword) => {
  try {
    const res = await api.post(`/dealers/${dealerId}/delete`, {
      dealer_id_confirm: dealerIdConfirm,
      admin_password: adminPassword
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// 🔹 Update Dealership Active/Inactive Status
export const updateDealerStatus = async (dealerId, isActive) => {
  try {
    const res = await api.put(`/dealers/${dealerId}/status`, {
      is_active: isActive
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const listMyDealerUsers = async () => {
  try {
    console.log(`🔄 [listMyDealerUsers] Fetching users for current dealer`);
    const res = await api.get('/users/');
    console.log(`✅ [listMyDealerUsers] Found ${res.data.length} users`);
    return res.data;
  } catch (err) {
    console.error('❌ [listMyDealerUsers] Error fetching dealer users:', err);
    throw err;
  }
};
