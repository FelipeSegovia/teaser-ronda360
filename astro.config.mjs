// @ts-check
import netlify from '@astrojs/netlify';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Páginas prerenderizadas (HTML estático). El adapter existe para la Action
// de contacto (Resend): la API key no puede ir al cliente. Netlify es el
// hosting acordado en landing/.specs/006-resend-contact/.
//
// `pnpm local` mantiene el adapter (hace falta para las Actions) pero apaga
// la emulación de Edge Functions: el Deno local de Netlify falla con
// `--allow-scripts` y tira un UnhandledRejection.
const isLocal = process.env.ASTRO_LOCAL === '1';

export default defineConfig({
  adapter: netlify(
    isLocal
      ? {
          devFeatures: {
            environmentVariables: false,
            images: true,
            edgeFunctions: false,
          },
        }
      : undefined,
  ),
  vite: {
    plugins: [tailwindcss()],
  },
});
