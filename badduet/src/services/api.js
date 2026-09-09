import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Сервис веществ
export const substancesService = {
  search: async (query) => {
    const response = await api.get('/substances/search', { params: { q: query } });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/substances/${id}`);
    return response.data;
  },
  
  getPopular: async () => {
    const response = await api.get('/substances/popular');
    return response.data;
  },
};

// Сервис проверок совместимости
export const compatibilityService = {
  check: async (substanceIds) => {
    const response = await api.post('/compatibility/check', { substance_ids: substanceIds });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await api.get('/compatibility/history');
    return response.data;
  },
};

// Сервис AI-чата
export const chatService = {
  sendMessage: async (message, context) => {
    const response = await api.post('/chat/message', { message, context });
    return response.data;
  },
};

// Сервис сканирования штрих-кодов
export const barcodeService = {
  scan: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post('/barcode/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Сервис рекламы и партнеров
export const adsService = {
  getBanners: async () => {
    const response = await api.get('/ads/banners');
    return response.data;
  },
  
  getBadMonth: async () => {
    const response = await api.get('/ads/bad-month');
    return response.data;
  },
};

export default api;
