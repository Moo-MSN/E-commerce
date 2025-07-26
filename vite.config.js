import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  // เพิ่ม proxy เพื่อให้สามารถเรียก API จาก Firebase cloud Functions ได้
   server: {
    proxy: {
      '/api': { // เพิ่มตรงนี้เข้ามา path ที่ต่อด้วย /api จะถูกแทนที่ด้วย target
        target: 'http://127.0.0.1:5001/easy-commerce-by-moo-msn/us-central1/api',
        changeOrigin: true, // และที่การ rewrithe เป็น target/ path ที่เราใช้งาน
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
