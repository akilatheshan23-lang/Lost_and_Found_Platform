import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Dev quality-of-life:
  // - Lets the frontend call `/api/*` without needing VITE_API_URL.
  // - Avoids CORS headaches when the backend runs on 5000.
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
