import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:5100';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/Users': backendTarget,
      '/api': backendTarget,
      '/uploads': backendTarget,
      '/health': backendTarget,
    },
  },
});
