import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: false,
      useFsEvents: true,
    },
    hmr: {
      overlay: true,
      port: 6007,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});