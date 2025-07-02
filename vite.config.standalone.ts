import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Standalone AppointmentIQ build configuration
export default defineConfig({
  // Build for standalone AppointmentIQ deployment
  build: {
    outDir: 'dist-standalone',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'standalone.html'),
      },
    },
  },
  server: {
    host: "::",
    port: 8081, // Different port for standalone dev
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Environment variables for standalone mode
    'process.env.VITE_STANDALONE_MODE': '"true"',
    'process.env.VITE_APP_TITLE': '"AppointmentIQ"',
  },
});