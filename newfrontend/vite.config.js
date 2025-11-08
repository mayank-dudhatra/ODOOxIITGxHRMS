import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // <-- NEW: Import path module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  
  // <-- NEW: Add alias configuration block -->
  resolve: { 
    alias: {
      // Maps '@/' to the absolute path of the 'src' directory
      '@': path.resolve(process.cwd(), 'src'), 
    },
  },
  // <-- END NEW BLOCK -->
})