import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => ({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@mos/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    // Only configure proxy during local dev, avoid Vercel build crashes
    ...(command === 'serve' && {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    }),
  },
  build: {
    outDir: 'dist',
  },
}));
