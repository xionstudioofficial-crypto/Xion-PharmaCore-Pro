import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  let base = './';
  try {
    const pkgPath = path.resolve(__dirname, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (pkg.homepage) {
      const isAiStudioUrl = pkg.homepage.includes('run.app');
      
      // If building in GitHub Actions or if the homepage points to the default AI Studio run.app preview url,
      // fail-safe to a relative path './' so it works out-of-the-box on GitHub Pages.
      if (isAiStudioUrl && (process.env.GITHUB_ACTIONS === 'true' || process.env.NODE_ENV === 'production')) {
        base = './';
      } else if (pkg.homepage.startsWith('http://') || pkg.homepage.startsWith('https://')) {
        const url = new URL(pkg.homepage);
        // If it's a template preview and we're not inside the server dev container, use relative base
        if (isAiStudioUrl && !process.env.PORT) {
          base = './';
        } else {
          base = url.pathname;
        }
      } else {
        base = pkg.homepage;
      }
      
      if (!base.endsWith('/')) {
        base += '/';
      }
    }
  } catch (e) {
    console.error('Error reading homepage from package.json in vite.config.ts:', e);
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
