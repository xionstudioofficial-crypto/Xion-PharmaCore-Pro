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
    
    // Check if we are building or running in the Google AI Studio environment
    const isAiStudio = process.env.DISABLE_HMR === 'true' || process.env.PORT === '3000';
    
    // Check if we are running in GitHub Actions (deploy workflow)
    const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

    if (isAiStudio) {
      // In Google AI Studio dev/preview environment, standard relative base path works best
      base = './';
    } else if (isGitHubActions && process.env.GITHUB_REPOSITORY) {
      // If built automatically by GitHub Actions, extract the repo name for GitHub Pages subdirectory
      const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
      if (repoName) {
        base = `/${repoName}/`;
      }
    } else if (pkg.homepage) {
      // If built manually/externally, resolve path from homepage field in package.json
      if (pkg.homepage.startsWith('http://') || pkg.homepage.startsWith('https://')) {
        const url = new URL(pkg.homepage);
        // If it still points to a template run.app domain but we're building outside AI Studio, fallback to relative
        if (pkg.homepage.includes('run.app')) {
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
