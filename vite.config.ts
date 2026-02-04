import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
          // Markdown and syntax highlighting
          if (id.includes('node_modules/react-markdown') ||
            id.includes('node_modules/react-syntax-highlighter') ||
            id.includes('node_modules/remark') ||
            id.includes('node_modules/rehype') ||
            id.includes('node_modules/hast') ||
            id.includes('node_modules/mdast') ||
            id.includes('node_modules/unist') ||
            id.includes('node_modules/micromark') ||
            id.includes('node_modules/highlight.js')) {
            return 'markdown';
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
