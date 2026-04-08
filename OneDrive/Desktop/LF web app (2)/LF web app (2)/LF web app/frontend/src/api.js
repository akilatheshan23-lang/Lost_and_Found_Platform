import axios from 'axios';

const rawApiBase =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE ||
  '';

const normalizeApiBase = (value) => {
  const base = String(value || '').trim();
  if (!base) return '';

  // Accept shorthand like ':5000' and treat it as localhost.
  if (/^:\d+$/.test(base)) {
    return `http://localhost${base}`;
  }

  return base;
};

const API_BASE = normalizeApiBase(rawApiBase);

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
