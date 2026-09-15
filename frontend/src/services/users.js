import api from './api';

export async function listUsers() {
  const res = await api.get('/users/');
  return res.data;
}

export async function createUser(payload) {
  const res = await api.post('/users/', payload);
  return res.data;
}

export async function updateUser(userId, payload) {
  const res = await api.put(`/users/${userId}`, payload);
  return res.data;
}

export async function deleteUser(userId) {
  await api.delete(`/users/${userId}`);
}

export async function updateUserProfile(payload) {
  const res = await api.put('/users/me', payload);
  return res.data;
}

export async function importUsersFromExcel(file, defaultPassword = 'sales@focus') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('default_password', defaultPassword);
  const res = await api.post('/users/import-excel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}



