import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the same build works on a project page (/vedicmyth/)
  // and on a root domain later.
  base: './',
  build: { target: 'es2020' },
});
