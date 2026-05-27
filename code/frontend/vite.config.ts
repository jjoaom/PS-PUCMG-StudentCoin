import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    strictPort: true,
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/dist/**', '**/android**'],
    },
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
})