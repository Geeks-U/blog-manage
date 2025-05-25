import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    visualizer({
      open: true,          // 打包后自动打开可视化报告
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) {
              return 'vendor_vue'
            }
            if (id.includes('lodash')) {
              return 'vendor_lodash'
            }
            return 'vendor_others'
          }
        }
      }
    }
  }
})
