import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Lisandrocba.github.io es un sitio de usuario: GitHub Pages lo sirve en la raíz (https://lisandrocba.github.io/)
export default defineConfig({
  plugins: [react()],
})
