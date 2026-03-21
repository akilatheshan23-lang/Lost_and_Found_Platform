import axios from "axios";

// If VITE_API_URL is not set, we fall back to relative `/api` calls.
// With Vite dev server proxy (vite.config.js), `/api` will be forwarded to http://localhost:5000.
const baseURL = import.meta.env.VITE_API_URL || "";

export const http = axios.create({
  baseURL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
