import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        minifyInternalExports: true,
        manualChunks(id) {
          if (id.includes('@tanstack/react-query')) {
            return 'react-query-chunk'
          }

          if (id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-chunk'
          }

          if (id.includes('react-day-picker')) {
            return 'react-day-picker-chunk'
          }

          if (id.includes('react-dropzone')) {
            return 'react-dropzone-chunk'
          }

          if (
            id.includes('@reduxjs/toolkit') ||
            id.includes('react-redux') ||
            id.includes('redux-persist')
          ) {
            return 'redux-chunk'
          }

          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18next-chunk'
          }

          if (
            id.includes('react-hook-form') ||
            id.includes('@hookform/resolvers') ||
            id.includes('zod')
          ) {
            return 'form-chunk'
          }

          if (id.includes('date-fns')) {
            return 'date-fns'
          }
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
      },
    },
    chunkSizeWarningLimit: 500,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
