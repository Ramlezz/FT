import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      {
        name: 'copy-static-site-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) return;
          const distDir = path.resolve(__dirname, 'dist');
          const folders = ['css', 'js', 'assets', 'data'];
          for (const folder of folders) {
            const src = path.resolve(__dirname, folder);
            const dest = path.resolve(distDir, folder);
            if (fs.existsSync(src)) {
              fs.cpSync(src, dest, { recursive: true, force: true });
            }
          }
          const pdfSrc = path.resolve(__dirname, 'rapport_ft_connect_m2rt.pdf');
          const pdfDest = path.resolve(distDir, 'rapport_ft_connect_m2rt.pdf');
          if (fs.existsSync(pdfSrc)) {
            fs.copyFileSync(pdfSrc, pdfDest);
          }
        },
      },
    ],
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
