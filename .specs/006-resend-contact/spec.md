# Spec: Envío de contacto con Resend

## Objetivo

La landing **aún no captura correos**: el formulario existe, pero el envío
dependía de `PUBLIC_WEB3FORMS_KEY` (nunca configurada; spec 003 RF-1 aplazado).
El visitante solo ve el camino degradado (`mailto:` / copiar correo).

Esta spec desbloquea el camino real: el formulario envía un correo a
`site.contactEmail` mediante **Resend**, con la API key **solo en servidor**.
La UI del diálogo (campos, estados, honeypot, rama sin configurar) no se
rediseña.

## Requisitos funcionales

### RF-1 — El formulario envía por Resend cuando hay API key

- Con `RESEND_API_KEY` definida, el diálogo muestra el formulario (misma rama
  que ya existe).
- Un envío válido genera un correo a `site.contactEmail` con el asunto que ya
  compone `contactSubject()` (`Acceso anticipado a ${productName}`).
- El remitente (`from`) se lee de `RESEND_FROM`, no está hardcodeado. En
  desarrollo puede ser la dirección de prueba de Resend; en producción debe
  ser un dominio verificado.
- `replyTo` es el correo del visitante, para poder responderle desde el buzón.
- El cuerpo incluye el correo, el comentario (o que no hubo) y que el origen
  es la landing.

### RF-2 — La API key nunca viaja al navegador

- `RESEND_API_KEY` no lleva prefijo `PUBLIC_` y no se importa desde scripts de
  cliente ni desde módulos que el cliente bundlea.
- `PUBLIC_WEB3FORMS_KEY` y Web3Forms dejan de usarse.

### RF-3 — Sin clave, el camino degradado se conserva

- Sin `RESEND_API_KEY`, el diálogo sigue ofreciendo `mailto:` y copiar correo
  (spec 003). La página no se rompe.

### RF-4 — Validación y spam

- El correo se valida en el cliente (como hoy) y otra vez en el servidor.
- El honeypot del diálogo se conserva: si está marcado, no se llama a Resend
  y el visitante ve éxito.

### RF-5 — Errores visibles

- Si Resend rechaza el envío o falta configuración en servidor, el diálogo
  muestra el estado de error actual (título, cuerpo y `mailto:` de respaldo).
- Identificadores y código en inglés; copy visible en español, vía `es.ts`.

## Fuera de alcance

- React Email, plantillas hosted, adjuntos, programación de envíos, webhooks,
  audiencias o gestión de dominios en Resend.
- Cambiar `site.contactEmail` o el dominio público del producto.
- Rediseño visual del diálogo o de la landing.
- Documentar el despliegue Netlify más allá de las variables de entorno y el
  adapter.

## Dependencias

- Cuenta Resend y `RESEND_API_KEY` (ya en `.env` local; hay que replicarla en
  Netlify, sin pegarla en el repo).
- Dominio verificado en Resend **solo para producción**. En local/pruebas se
  admite `RESEND_FROM` de test.
- Hosting: **Netlify** (`@astrojs/netlify`).

## Criterios de aceptación

- [x] Con `RESEND_API_KEY` y `RESEND_FROM`, el diálogo muestra el formulario.
      — `dist/index.html` incluye `#contact-email`.
- [x] Un envío de prueba llega (o aparece en el dashboard de Resend) con
      asunto, reply-to del visitante y cuerpo con correo y comentario.
      — SDK OK hacia `delivered@resend.dev`. El camino UI usa el mismo contrato
      en `src/actions/index.ts` (`replyTo`, asunto, HTML+text).
- [~] Sin `RESEND_API_KEY`, el diálogo muestra mailto/copiar, no el formulario.
      — Misma rama de 003; no se reconstruyó `dist/` sin `.env` en esta sesión.
- [x] El JS del cliente en `dist/` no contiene el prefijo de clave `re_`.
- [x] No queda rastro operativo de Web3Forms en `src/` (salvo specs históricas).
- [x] `pnpm check` y `pnpm build` en verde.
- [x] Todo texto nuevo visible sale de `src/i18n/es.ts` (si hace falta copy).
      — No hizo falta copy nuevo.
