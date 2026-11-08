import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Permite despliegue directo en GitHub Pages o subdirectorios sin errores de ruta
  base: './',
});

