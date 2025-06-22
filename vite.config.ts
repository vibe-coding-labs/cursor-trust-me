import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cursor-trust-me/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // 确保静态资源正确引用
    assetsDir: 'assets',
    // 优化输出
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
