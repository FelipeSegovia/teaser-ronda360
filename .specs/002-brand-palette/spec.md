# Spec: Paleta de marca definitiva

## Objetivo

Adoptar la paleta de marca definitiva en la landing, reemplazando los azules
provisorios de Tailwind que se usaron al construir la spec 001.

| Rol | Hex | Nombre |
|---|---|---|
| Primario | `#001C32` | azul noche |
| Secundario | `#1B3561` | azul profundo |
| Terciario | `#27D3BC` | turquesa |

El resultado buscado es que la landing pinte con estos tres colores **sin
perder contraste accesible ni la legibilidad de las señales de estado**.

Este cambio no altera contenido, textos, estructura ni comportamiento: solo
valores de color.

## Requisitos funcionales

### RF-1 — Los tres colores viven en `@theme`, no en los componentes

- Los tres valores se declaran una sola vez, en el bloque `@theme` de
  `src/styles/global.css`, y todo lo demás los consume vía utilidades de
  Tailwind (`bg-brand`, `text-accent`, ...).
- El terciario necesita un token propio (`--color-accent`); sin él quedaría
  hardcodeado en cada componente, que es justo lo que `@theme` evita.
- Ningún componente introduce hex nuevos. La única excepción tolerada es el
  `<style is:inline>` de `Loader.astro`, que por diseño pinta antes que la hoja
  de Tailwind y por eso no puede usar tokens; sus valores deben coincidir con
  los de `@theme`.

### RF-2 — Reparto de roles

- **Secundario `#1B3561`** — color de acción: botones de CTA, enlaces, bordes y
  anillos de foco. Los CTA llevan texto blanco.
- **Primario `#001C32`** — color de profundidad: texto principal, hover de los
  CTA, fondo del footer y cuerpo del mockup del teléfono.
- **Terciario `#27D3BC`** — acento. Entra solo donde tiene fondo oscuro detrás
  o donde es puramente decorativo.

### RF-3 — El turquesa no es color de botón

- No se usa como fondo de ningún elemento que lleve texto blanco encima: el par
  da 1.9:1 y no cumple WCAG AA.
- Los puntos donde sí entra: el punto y el halo del badge del hero, un blob
  decorativo del fondo del hero, la línea de escaneo y el botón del mockup, el
  enlace de correo del footer y el punto del loader.

### RF-4 — Las señales de estado se mantienen

- El verde de "marca válida" (`#047857`) y el rojo de "marca rechazada"
  (`#B91C1C`) no cambian.
- Son código de color universal de estado, no colores de marca: reemplazarlos
  por el turquesa haría que el mockup y el bloque antifraude dejaran de leerse
  de un vistazo.

### RF-5 — Neutros coherentes con la paleta

- El gris de texto secundario y el color de los bordes pasan de un slate neutro
  a un gris con tinte navy, para que no desentonen contra el azul noche.
- El gris de texto secundario debe seguir cumpliendo AA sobre fondo blanco.

### RF-6 — Sin restos de la paleta anterior

- No queda ninguna referencia a `#1D4ED8`, `#1E3A8A`, `#0B1220`, `#E2E8F0` ni a
  colores de la paleta por defecto de Tailwind (`slate-*`) en `src/`.

## Fuera de alcance

- `public/favicon.svg`: sigue siendo el de la plantilla de Astro. Ya estaba
  anotado como pendiente en `.specs/001-landing-early-access/status.md`; es una
  tarea de identidad visual aparte, no de paleta.
- `assets/logo.png` de Orbital Studio: es blanco sobre negro opaco y se integra
  por `mix-blend-screen`; funciona igual sobre el nuevo fondo del footer.
- Cualquier cambio de contenido, copy, layout, tipografía o comportamiento.
- Modo oscuro: la landing no lo tiene y esta spec no lo introduce.

## Criterios de aceptación

- [x] Los tres colores de marca aparecen declarados en `@theme` y en ningún
      otro lugar (salvo el `<style is:inline>` del loader).
- [x] Texto blanco sobre el fondo de CTA cumple AA (≥ 4.5:1). — **12.15:1**,
      medido sobre los cinco CTA renderizados.
- [x] El texto secundario cumple AA sobre fondo blanco. — **7.01:1** sobre
      blanco y **6.52:1** sobre `surface-alt`.
- [x] El enlace de correo del footer cumple AA sobre el fondo del footer. — **9.18:1**.
- [x] Ningún elemento con texto blanco tiene fondo turquesa. — verificado
      recorriendo el DOM renderizado: cero coincidencias.
- [x] El badge de "válido" del mockup sigue en verde y el resultado rechazado
      del bloque antifraude sigue en rojo. — `rgb(4,120,87)` y `rgb(185,28,28)`.
- [x] `grep` de los hex de la paleta anterior y de `slate-` en `src/` no
      devuelve resultados.
- [x] `astro check` (0 errores, 0 avisos) y `pnpm build` en verde.
- [x] Revisión visual en el navegador de: hero, mockup, botones en estado
      normal / hover / `focus-visible`, diálogo de contacto con su backdrop,
      header pegado tras hacer scroll y footer.
- [x] Sin regresiones a 320 px ni a 1440 px. — 320 px verificado en un iframe
      de ese ancho (media queries reales), `scrollWidth == 320`, sin
      desbordamiento horizontal. El ancho alto se revisó a 1774 px: por encima
      del breakpoint `lg` (1024 px) el layout es idéntico y `container-page`
      topa en 1120 px, así que 1440 px no difiere salvo en el margen exterior.
- [~] `prefers-reduced-motion: reduce`. — No se pudo alternar el ajuste del
      sistema desde el entorno de trabajo. Sí se verificó que el bloque
      `@media (prefers-reduced-motion: reduce)` queda **byte a byte idéntico**
      al previo al cambio y presente en el build. Esta spec no tocó código de
      animación ni de movimiento, solo valores de color.

## Hallazgo abierto (no bloquea la spec)

**El CTA flotante pierde definición sobre el footer.** `bg-brand` `#1B3561`
sobre `--color-footer` `#001C32` da **1.43:1** de separación de borde. Antes del
cambio (`#1D4ED8` sobre `#0B1220`) era 2.79:1: ya estaba por debajo de los 3:1
de la regla 1.4.11 de WCAG, y ahora está peor.

No es un incumplimiento formal de AA: la regla 1.4.11 exime a los controles
identificables por otros medios, y este botón lleva su etiqueta en blanco a
12.15:1, perfectamente legible. Es una pérdida estética, visible solo en los
últimos ~250 px de scroll, cuando el botón se superpone al footer.

No se corrigió porque salía del alcance declarado ("solo valores de color"):
la solución natural —un anillo o borde que separe el botón de cualquier fondo—
agrega un elemento visual que esta spec no autoriza. Queda a decisión del
supervisor del proyecto si se aborda aquí o en una spec aparte.
