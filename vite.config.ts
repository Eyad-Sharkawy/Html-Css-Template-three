import { defineConfig } from 'vite';

export default defineConfig({
  // Static site at project root with existing index.html
  server: {
    open: true,
  },
  preview: {
    port: 4173,
  },
});


