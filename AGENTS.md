# AGENTS.md

Fuente canónica de instrucciones de agente para `landing/`. Cursor lee este
archivo; Claude Code llega al mismo contenido vía el puntero en `CLAUDE.md`.

## Descripción general

Landing para promocionar una app para que los **guardias de seguridad** registren
las rondas que hacen a diario y sus **supervisores** les den seguimiento.

El supervisor define las rondas —qué puntos de control incluye cada una— y exige
un **mínimo de rondas diarias**. El guardia recorre esos puntos desde la app;
cada punto se valida por **geolocalización (GPS)**.

El repositorio todavía no tiene código: solo documentación y plantillas de specs.

## Reglas no negociables (landing)

Este subproyecto es un sitio Astro **prerenderizado** (HTML estático),
independiente del stack de la app móvil (Expo/RN, offline-first, GPS) — esas
reglas viven en `../docs/constitution.md` y no aplican aquí. El formulario de
contacto corre on-demand en Netlify (`@astrojs/netlify` + Astro Actions +
`resend`) para no exponer `RESEND_API_KEY`. Para `landing/` rigen estas en su
lugar:

1. **Stack.** Astro + TypeScript en modo `strict` (ya configurado en
   `tsconfig.json`). Cero frameworks de UI adicionales (React, Vue, Svelte).
   Dependencias actuales ajenas a Astro/Tailwind: `resend` (envío de correo
   del formulario) y `@astrojs/netlify` (Action en Functions). Cualquier
   dependencia nueva se justifica por escrito en el PR que la introduce.
2. **Fidelidad de contenido.** Ninguna afirmación sobre la funcionalidad del
   producto (rondas, puntos de control, GPS, mínimo diario, etc.) puede
   contradecir `../docs/business-context.md` ni `../docs/requirements.md`.
3. **Idioma.** Identificadores y commits en inglés; comentarios y documentación
   en español; todo texto visible al usuario en español.

## Contexto de negocio

@../docs/business-context.md describe el flujo de negocio y @../docs/requirements.md los requerimientos funcionales y no funcionales del producto que este sitio promociona. Léelos antes de proponer cambios de alcance o diseño de contenido.

## Metodología: Spec-Driven Development (SDD)

Este proyecto sigue SDD para features que tocan más de un archivo o capa
(DB, API, UI). Los bugfixes simples y cambios triviales de una línea
no requieren este flujo.

### Ubicación de los documentos

Cada feature vive en `landing/.specs/<numero>-<nombre-corto>/` con:

- `spec.md` — qué debe hacer, qué queda fuera de alcance, criterios de aceptación
- `plan.md` — diseño técnico: archivos a tocar, contratos, algoritmo
- `tasks.md` — lista numerada y ordenada de tareas ejecutables
- `status.md` — estado actual y qué sigue (para retomar entre sesiones)

Plantilla base: `landing/.specs/_templates/` (independiente de `../.specs/` en
la raíz, que es para la app móvil).

### Reglas de flujo (IMPORTANTE)

1. **Nunca escribas código de una feature nueva sin spec.md aprobado.**
   Si no existe, propón uno primero y espera confirmación antes de seguir.
2. **No pases de spec a plan, ni de plan a tasks, sin que yo lo apruebe.**
   Genera el documento y detente — no continúes automáticamente a la siguiente fase.
3. **Sigue tasks.md en orden.** No te adelantes a tareas futuras ni reordenes
   sin avisar primero.
4. **Actualiza status.md** después de cada tarea completada: qué se hizo,
   qué sigue, y cualquier decisión o desvío del plan original.
5. **Si el plan resulta inviable durante la implementación**, detente y
   avísame en vez de improvisar una solución distinta silenciosamente.

### Convención de numeración

Las specs de `landing/` se numeran secuencialmente y de forma independiente a
las de la raíz: `001-`, `002-`, etc. Antes de crear una nueva, revisa
`landing/.specs/` para usar el siguiente número disponible.

## Comandos de desarrollo

Para ver la landing sin el emulador de Edge Functions de Netlify: `pnpm local`.
`pnpm dev` sigue con el adapter y esa emulación.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentación

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
