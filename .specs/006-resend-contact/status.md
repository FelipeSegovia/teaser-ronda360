Estado: done
Última tarea completada: 9 (`pnpm check` / `pnpm build`, dist sin `re_`, envío de prueba)
Siguiente: desplegar en Netlify con `RESEND_API_KEY` y `RESEND_FROM` (dominio
verificado en producción).
Notas:
- Hosting Netlify; `from` vía `RESEND_FROM` (prueba: onboarding@resend.dev).
- Un `pnpm add` inicial se ejecutó en la raíz del repo por error; se borró
  ese `package.json`/`pnpm-lock.yaml`/`node_modules` y se instaló en `landing/`.
- Envío de prueba OK hacia `delivered@resend.dev` (buzón de test de Resend), no
  hacia `site.contactEmail`.
- Rama sin clave: no se reconstruyó el HTML sin `.env`. `isConfigured()` es
  falso si la key está vacía; el diálogo ya tenía esa rama.
- `pnpm check`: 0 errores, 0 avisos, 1 hint (`document.execCommand`, RF-3 de 003).
