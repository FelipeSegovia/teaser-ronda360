# Plan: Envío de contacto con Resend

> Diseño técnico de [`spec.md`](./spec.md). El diálogo no se rediseña: solo
> cambia el canal de envío y el criterio de «formulario configurado».

---

## 1. Por qué hace falta un adapter

Web3Forms se llamaba **desde el navegador** con una clave `PUBLIC_`. Resend
exige `RESEND_API_KEY` secreta: si el cliente la importa, Vite la inlinea.

Astro es estático por defecto y [no ejecuta Actions sin adapter](https://resend.com/docs/send-with-astro).
Hosting acordado: **Netlify**. Las páginas siguen prerenderizadas; solo la
Action corre on-demand.

`isConfigured()` **no** puede vivir en el mismo módulo que el script del
diálogo. Ese script ya importa `contact.ts`; meter `import.meta.env.RESEND_API_KEY`
ahí filtraría la clave. Queda en un módulo **solo de servidor**.

---

## 2. Archivos a tocar

| Archivo | Cambio |
|---|---|
| `package.json` / lockfile | `resend`, `@astrojs/netlify` (justificados: envío + hosting) |
| `astro.config.mjs` | `adapter: netlify()` |
| `src/actions/index.ts` | **nuevo** — Action `contact.send` |
| `src/lib/contact-config.ts` | **nuevo** — `isConfigured()` lee `RESEND_API_KEY` (servidor) |
| `src/lib/contact.ts` | `submitContact` → `astro:actions`; sin Web3Forms ni env secretos |
| `src/config/site.ts` | quitar `contactFormKey` |
| `src/components/ContactDialog.astro` | comentarios; `isConfigured` desde `contact-config` |
| `.env.example` | `RESEND_API_KEY`, `RESEND_FROM` |
| `AGENTS.md` | stack: estático + Action en Netlify |

`.env` no se commitea. En Netlify: las mismas dos variables.

---

## 3. Contrato de la Action

```ts
// src/actions/index.ts
export const server = {
  contact: {
    send: defineAction({
      input: z.object({
        email: z.string(),
        comment: z.string(),
        botcheck: z.boolean().optional(),
      }),
      handler: async (input) => { /* ... */ },
    }),
  },
};
```

Algoritmo:

1. Si `botcheck === true` → `{ ok: true }` sin llamar a Resend.
2. Si el email no pasa `isValidEmail` → `ActionError` `BAD_REQUEST`.
3. Si falta `RESEND_API_KEY` o `RESEND_FROM` → `ActionError` `INTERNAL_SERVER_ERROR`.
4. `resend.emails.send({ from, to: [site.contactEmail], replyTo: email, subject: contactSubject(), html, text })`.
5. Si `error` → `ActionError` `BAD_REQUEST` con `error.message`.
6. Si `data` → `{ ok: true }`.

Cliente (`submitContact`): `actions.contact.send({ email, comment })`. Mapea
error de red → `network`; error de Action / Resend → `rejected`.

El honeypot **también** se corta en el cliente (como hoy) para no disparar la
Action. El servidor es el respaldo.

---

## 4. Cuerpo del correo

- Asunto: `contactSubject()`.
- HTML y text: correo del interesado, comentario o «(sin comentario)», origen
  «Landing Ronda360».
- `from`: `import.meta.env.RESEND_FROM` (ejemplo de prueba:
  `Ronda360 <onboarding@resend.dev>`).
- `to`: `site.contactEmail`.
- `replyTo`: email recortado del visitante.

SDK: `import { Resend } from 'resend'`; `await`; `{ data, error }`; camelCase.

---

## 5. Verificación

```sh
pnpm check
pnpm build
# el bundle del cliente no debe contener "re_"
```

En el navegador: con clave, formulario y envío de prueba; sin clave, mailto.
En Netlify: env vars + Function de la Action.
