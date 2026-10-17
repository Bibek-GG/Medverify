import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.port === '5173' ? '/api' : 'http://localhost:8000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getMedicines = async (search = '', skip = 0, limit = 50) => {
  const response = await api.get('/medicines', {
    params: { search, skip, limit }
  });
  return response.data;
};

export const getMedicine = async (productId) => {
  const response = await api.get(`/medicines/${encodeURIComponent(productId)}`);
  return response.data;
};

export const verifyMedicine = async (verificationData) => {
  const response = await api.post('/verify', verificationData);
  return response.data;
};

export const verifyImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/verify/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
  });
  return response.data;
};

export const submitReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

export const getReport = async (reportId) => {
  const response = await api.get(`/reports/${encodeURIComponent(reportId)}`);
  return response.data;
};

export const getHistory = async (params = {}) => {
  const response = await api.get('/history', { params });
  return response.data;
};

export const getHistoryItem = async (scanId) => {
  const response = await api.get(`/history/${scanId}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export default api;
