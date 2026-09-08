# Tasks: Paleta de marca definitiva

> **Ejecutada completa el 2026-09-08.** Resultados en `status.md`.
>
> Lista ejecutable derivada de [`plan.md`](./plan.md). Se ejecutan **en orden**.
> Las tareas 1–2 repintan la landing entera; de la 3 en adelante son ajustes
> puntuales. Después de cada tarea completada se actualiza `status.md`.

---

## T1 — Reescribir el bloque `@theme`

**Archivo:** `src/styles/global.css` (líneas 9–20)

- [x] Reemplazar `--color-brand` por `#1B3561` (secundario, color de acción).
- [x] Reemplazar `--color-brand-dark` por `#001C32` (primario, profundidad).
- [x] Añadir `--color-accent: #27D3BC` (terciario).
- [x] Convertir `--color-ink` en `var(--color-brand-dark)`.
- [x] Convertir `--color-footer` en `var(--color-brand-dark)`.
- [x] Reemplazar `--color-ink-soft` por `#4A5A72`.
- [x] Reemplazar `--color-hairline` por `#D9E1EA`.
- [x] Dejar `--color-ok`, `--color-bad`, `--color-surface`, `--color-surface-alt`,
      `--font-sans` y los `--animate-*` intactos.
- [x] Actualizar el comentario del bloque: qué rol de la paleta ocupa cada token.

**Hecho cuando:** `pnpm check` pasa y `pnpm dev` levanta con la landing ya
repintada en azules de marca.

---

## T2 — Sustituir los dos `rgb()` literales de `global.css`

**Archivo:** `src/styles/global.css`

- [x] Línea ~82, `.site-header.is-stuck`: `rgb(11 18 32 / 0.06)` →
      `color-mix(in srgb, var(--color-ink) 6%, transparent)`.
- [x] Línea ~96, `dialog::backdrop`: `rgb(11 18 32 / 0.55)` →
      `color-mix(in srgb, var(--color-ink) 55%, transparent)`.

**Hecho cuando:** no queda ningún `rgb(11 18 32` en `src/`.

> Si en T9 el backdrop del diálogo se ve transparente, volver aquí y usar
> `rgb(0 28 50 / 0.55)` con el comentario que explica la duplicación
> (ver `plan.md` §4). No improvisar otra solución.

---

## T3 — Turquesa en el hero

**Archivo:** `src/components/Hero.astro`

- [x] Línea ~10 (segundo blob decorativo): `bg-brand/5` → `bg-accent/10`.
- [x] Líneas ~16–18 (halo y punto del badge): los dos `bg-brand` → `bg-accent`.
- [x] **No tocar** el `border-brand/20 bg-brand/5 text-brand` del badge ni el CTA.

**Hecho cuando:** el badge muestra un punto turquesa palpitante y el texto del
badge sigue en azul profundo.

---

## T4 — Turquesa y degradado navy en el mockup

**Archivo:** `src/components/AppMockup.astro`

- [x] Línea ~12: `from-slate-800 to-ink` → `from-brand to-ink`.
- [x] Línea ~35 (línea de escaneo): `bg-brand` → `bg-accent` y
      `shadow-brand` → `shadow-accent`.
- [x] Línea ~60 (botón de la app): `bg-brand` → `bg-accent`.
- [x] **No tocar** los `bg-ok` del halo, el punto y el badge "1.4 m" (RF-4).

**Hecho cuando:** el mockup tiene cuerpo navy degradado, escaneo y botón
turquesa, y el indicador de distancia sigue en verde.

---

## T5 — Enlace de correo del footer en turquesa

**Archivo:** `src/components/Footer.astro` (línea ~44)

- [x] `text-white` → `text-accent` y `hover:text-white/80` → `hover:text-accent/80`.
- [x] **No tocar** el `text-white` del tagline ni el `text-white/50` del copyright.

**Hecho cuando:** el correo se lee turquesa sobre el footer azul noche (9.18:1).

---

## T6 — Sincronizar los hex del loader

**Archivo:** `src/components/Loader.astro`, bloque `<style is:inline>`

- [x] Línea ~42: `border: 3px solid #e2e8f0` → `#D9E1EA`.
- [x] Línea ~43: `border-top-color: #1d4ed8` → `#1B3561`.
- [x] Línea ~52: `background: #1d4ed8` → `#27D3BC`.
- [x] Añadir un comentario en el bloque: estos tres valores duplican `@theme`
      a propósito (el loader pinta antes que Tailwind) y se actualizan a la par.

**Hecho cuando:** el loader gira con anillo azul profundo y punto turquesa.

---

## T7 — Grep de residuos de la paleta anterior

- [x] `grep -rn -E '1D4ED8|1E3A8A|0B1220|E2E8F0' -i src/` → vacío.
- [x] `grep -rn -E '(bg|text|border|from|via|to|ring|shadow|fill|stroke|divide|outline|placeholder|decoration)-slate-' src/` → vacío.
- [x] `grep -rn -E 'rgb\(11 18 32' src/` → vacío.
- [x] `grep -rn -E '#[0-9a-fA-F]{3,8}\b' src/ | grep -v 'styles/global.css' | grep -v 'Loader.astro'` → vacío.

**Hecho cuando:** los cuatro greps no devuelven nada. Cubre RF-6 y el criterio
"los tres colores solo en `@theme`" de RF-1.

---

## T8 — `astro check` y `pnpm build`

- [x] `pnpm check` en verde.
- [x] `pnpm build` en verde.

---

## T9 — Revisión visual en el navegador

Con `astro dev --background`, revisar a **320 px** y a **1440 px**:

- [x] Hero: badge, blobs, CTA en normal / hover / `focus-visible`.
- [x] Mockup: degradado, escaneo turquesa, badge "1.4 m" verde, botón turquesa.
- [x] Los cinco CTA (Header, Hero, FinalCta, FloatingCta, ContactDialog) con su
      anillo de foco azul visible y separado.
- [x] Diálogo de contacto: **backdrop oscurecido** (si sale transparente → T2),
      campos, error en rojo, éxito con check verde.
- [x] Header tras scroll: fondo translúcido, hairline y sombra.
- [x] Footer: logo legible sobre `#001C32`, correo turquesa.
- [x] Bloque antifraude: resultado rechazado sigue en rojo.
- [x] Con `prefers-reduced-motion: reduce`: todo visible, sin animación.

**Hecho cuando:** ninguna regresión en los ocho puntos.

---

## T10 — Cerrar la spec

- [x] Marcar los criterios de aceptación de `spec.md` con los resultados reales.
- [x] Actualizar `status.md`: feature completada, desvíos del plan si los hubo,
      y dejar anotado que `public/favicon.svg` sigue pendiente (fuera de alcance).
