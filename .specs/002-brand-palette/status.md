Estado: implementada y verificada (T1–T10 completadas)
Última tarea completada: T10 — cierre de la spec
Siguiente: decidir sobre el hallazgo abierto del CTA flotante (ver abajo)

## Qué se hizo

- T1 — `@theme` reescrito en `src/styles/global.css`.
- T2 — los dos `rgb(11 18 32 / …)` pasan a `color-mix()` con `var(--color-ink)`.
- T3 — turquesa en el blob decorativo y en el punto/halo del badge del hero.
- T4 — mockup: degradado `from-brand to-ink`, escaneo y botón en turquesa.
- T5 — enlace de correo del footer en turquesa.
- T6 — los tres hex del `<style is:inline>` del loader sincronizados con `@theme`,
  con comentario que advierte que se actualizan a la par.
- T7 — los cuatro greps de residuos, vacíos.
- T8 — `astro check` 0/0/0 y `pnpm build` en verde.
- T9 — revisión visual en el navegador (detalle en `spec.md`).
- T10 — criterios de aceptación marcados con resultados medidos.

Archivos tocados: `src/styles/global.css`, `src/components/Hero.astro`,
`AppMockup.astro`, `Footer.astro`, `Loader.astro`. Ningún otro componente
necesitó cambios: ya consumían utilidades.

## Decisiones y desvíos respecto del plan

- **Sin desvíos de diseño.** El plan se ejecutó tal cual.
- **El riesgo del `dialog::backdrop` quedó descartado, por partida doble.**
  En el navegador, `getComputedStyle(dialog,'::backdrop')` devuelve
  `color(srgb 0 0.109804 0.196078 / 0.55)` y `--color-ink` **sí** se hereda
  en el pseudo-elemento. Además Lightning CSS emite un fallback estático
  `#001c328c` **antes** del `color-mix()`, así que el backdrop funciona incluso
  en navegadores que no heredan variables en la top layer. No hizo falta el
  reemplazo literal que el plan dejaba preparado.
- **Los alias `var()` en `@theme` funcionan.** El build emite
  `--color-ink:var(--color-brand-dark)` y resuelve a `#001C32`, incluido con
  modificador de opacidad (`bg-ink/55` → `#001c328c`).

## Notas de verificación

- El ancho grande se revisó a 1774 px, no a 1440 px: la ventana del navegador no
  bajaba de ahí. Por encima del breakpoint `lg` (1024 px) el layout es idéntico
  y `container-page` topa en 1120 px, así que 1440 px solo cambia el margen
  exterior. Los 320 px sí se verificaron con exactitud, en un iframe de ese
  ancho, que aplica las media queries reales.
- `prefers-reduced-motion: reduce` no se pudo alternar desde el entorno. El
  bloque `@media` quedó byte a byte idéntico al previo al cambio y está en el
  build; esta spec no tocó código de movimiento.
- La forma oscura que aparecía al pie de las primeras capturas era el
  `ASTRO-DEV-TOOLBAR` del servidor de desarrollo, no contenido de la página.

## Hallazgo abierto (no bloquea)

**El CTA flotante pierde definición sobre el footer:** `bg-brand` `#1B3561`
sobre `#001C32` da 1.43:1 de separación de borde (antes era 2.79:1, ya bajo el
umbral de 3:1 de WCAG 1.4.11). No es incumplimiento formal —el botón se
identifica por su etiqueta blanca a 12.15:1— y solo se nota en los últimos
~250 px de scroll. No se corrigió por quedar fuera del alcance "solo valores
de color": la solución natural es un anillo o borde, que es un elemento visual
nuevo. Pendiente de decisión.

## Fuera de alcance, sigue pendiente

- `public/favicon.svg` es todavía el de la plantilla de Astro. Ya venía anotado
  en `.specs/001-landing-early-access/status.md`; es tarea de identidad visual.
