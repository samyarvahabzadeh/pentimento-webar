import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pentimento-webar/',
  server: {
    host: true,
    https: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
