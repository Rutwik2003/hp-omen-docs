import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cspNoncePlugin } from './vite-plugin-csp-nonce';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // CSP nonce injection for development (production uses Vercel Edge Middleware)
    cspNoncePlugin(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }
          // Router
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // Animation library
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Helmet for SEO
          if (id.includes('react-helmet')) {
            return 'helmet';
          }
          // DND library
          if (id.includes('@hello-pangea/dnd')) {
            return 'dnd';
          }
        },
      },
    },
  },
  base: '/',
});
