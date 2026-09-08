# Tasks

Orden de ejecución. No adelantar ni reordenar sin avisar.

1. [x] Instalar `resend` y `@astrojs/netlify` con pnpm. Registrar la
       justificación en el comentario de `astro.config.mjs` y en AGENTS.md
       (regla 1: dependencia nueva).
2. [x] Añadir `adapter: netlify()` en `astro.config.mjs` sin forzar SSR de
       todas las páginas.
3. [x] Actualizar `.env.example` (`RESEND_API_KEY`, `RESEND_FROM`) y
       `AGENTS.md` (sitio estático + Action en Netlify).
4. [x] Crear `src/lib/contact-config.ts` con `isConfigured()` leyendo
       `RESEND_API_KEY`. Solo lo importa el frontmatter (servidor).
5. [x] Crear `src/actions/index.ts` según el contrato del plan.md (validación,
       honeypot, Resend `{ data, error }`, `replyTo`, cuerpo HTML+text).
6. [x] Reescribir `src/lib/contact.ts`: quitar Web3Forms; `submitContact`
       llama `actions.contact.send`. Sin secretos de env en este archivo.
7. [x] Quitar `contactFormKey` de `src/config/site.ts`.
8. [x] Actualizar `ContactDialog.astro`: importar `isConfigured` desde
       `contact-config`; comentarios sin Web3Forms.
9. [x] `pnpm check` y `pnpm build` en verde. Comprobar que `dist/` / chunks
       de cliente no contienen `re_`. Verificar ramas con/sin clave.

Tras cada tarea: actualizar `status.md`.
