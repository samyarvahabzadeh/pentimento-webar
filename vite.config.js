import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    https: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
