import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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