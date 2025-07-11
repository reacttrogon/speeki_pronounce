// 1. UPDATE vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/speeki_pronounce/', 
  plugins: [react()],
  // ADD THIS: Ensure assets are copied correctly
  assetsInclude: ['**/*.otf', '**/*.woff', '**/*.woff2', '**/*.ttf'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep fonts in a fonts directory
          if (assetInfo.name && /\.(woff|woff2|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  }
})