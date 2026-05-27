import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  let base = '/Xion-PharmaCore-Pro/';
  try {
    // Check if we are building or running in the Google AI Studio environment
    const isAiStudio = process.env.DISABLE_HMR === 'true' || process.env.PORT === '3000';
    
    if (isAiStudio) {
      // In Google AI Studio dev/preview environment, standard relative base path works best
      base = './';
    } else {
      // In production/GitHub Pages builds, use the absolute repo subpath `/Xion-PharmaCore-Pro/`
      base = '/Xion-PharmaCore-Pro/';
    }
  } catch (e) {
    console.error('Error resolving base in vite.config.ts:', e);
    base = '/Xion-PharmaCore-Pro/';
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
