import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    css: {
      lightningcss: {
        errorRecovery: true
      }
    },
    define: {
      'import.meta.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL || 'http://localhost:8000')
    }
  }
})