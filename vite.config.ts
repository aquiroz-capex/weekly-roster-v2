import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/weekly-roster-v2/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});


