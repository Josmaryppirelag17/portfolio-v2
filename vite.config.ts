import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        input: {
          // Entrada principal en Español (ruta raíz "/")
          main: path.resolve(__dirname, 'index.html'),
          // Entrada en Inglés (ruta "/en/")
          en: path.resolve(__dirname, 'en/index.html'),
        },
      },
    },
  };
});

