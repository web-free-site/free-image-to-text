import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { readdirSync, statSync, existsSync } from 'node:fs';

function collectHtmlInputs() {
  const inputs: Record<string, string> = {
    main: resolve(__dirname, 'index.html'),
  };

  const addTree = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) {
        const index = resolve(full, 'index.html');
        if (existsSync(index)) {
          const rel = full.replace(__dirname + '/', '').replace(/\\/g, '/');
          inputs[rel] = index;
        }
        addTree(full);
      }
    }
  };

  const htmlPages = [
    'fr/convertir-image-en-texte',
    'jpg-to-text',
    'screenshot-to-text',
    'pdf-to-text',
    'extract-text-from-image',
    'privacy',
    'terms',
    'about',
    'contact',
  ];
  for (const folder of htmlPages) {
    const index = resolve(__dirname, folder, 'index.html');
    if (existsSync(index)) inputs[folder] = index;
  }

  const notFound = resolve(__dirname, '404.html');
  if (existsSync(notFound)) inputs['404'] = notFound;

  return inputs;
}

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      input: collectHtmlInputs(),
    },
  },
});
