import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      }
    }),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname, // Works in ES Modules
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase", // Optional, keeps class names in camelCase
    },
  },
})