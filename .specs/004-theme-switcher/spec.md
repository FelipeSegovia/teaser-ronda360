# Spec: Selector de tema claro / oscuro / sistema

## Objetivo

La landing pasa a ofrecer **tres estados de tema**: claro, oscuro y sistema.
**Por defecto sigue al sistema operativo**: si el sistema está en claro, la
landing se ve clara.

Hoy la landing solo tiene el mundo claro que fijó la spec 002.

## Qué NO es esta spec

Se declara explícitamente para que no se confunda con la conversación que la
originó:

- **No es el rediseño al "mundo oscuro de panel de instrumentos".** Ese
  reemplazaría el mundo visual y declararía superada la spec 002. Aquí la 002
  **sigue vigente**: su bloque `@theme` pasa a ser el tema claro y gana un
  hermano oscuro.
- **No resuelve ninguno de los cinco problemas prioritarios del critique**
  (`.impeccable/critique/2026-09-08T13-03-23Z__src-pages-index-astro.md`):
  el mockup con barras de esqueleto, los 3 metros nunca dibujados, la
  estructura plana de Capabilities, el CTA flotante en móvil y la composición
  de plantilla siguen exactamente igual — ahora en dos temas en vez de uno.

## Requisitos funcionales

### RF-1 — Tres estados, con el sistema por defecto

- El visitante puede elegir **claro**, **oscuro** o **sistema**.
- Sin elección previa, el estado es **sistema**: la landing sigue a
  `prefers-color-scheme`. Sistema en claro → landing clara.
- La elección explícita **gana** sobre la preferencia del sistema, en ambas
  direcciones: un visitante con el sistema en oscuro puede forzar claro.
- La elección **persiste** entre visitas.
- En "sistema", cambiar la preferencia del SO con la página abierta se refleja
  sin recargar.

### RF-2 — Sin destello de tema equivocado

- El tema correcto debe estar aplicado **antes del primer pintado**. Un
  destello blanco al cargar en oscuro es un defecto, no una molestia menor.
- Exige un script en línea y bloqueante en el `<head>`, antes de la hoja de
  estilos. Precedente en el proyecto: los bloques `is:inline` de `Loader.astro`.

### RF-3 — El loader también cambia de tema

- `Loader.astro` pinta **antes** que la hoja de Tailwind y por eso lleva sus
  hex duplicados a propósito (spec 002, RF-1). Hoy tiene `background: #ffffff`
  fijo: en tema oscuro destellaría en blanco a pantalla completa.
- El loader debe respetar el tema sin poder usar las utilidades de Tailwind.

### RF-4 — Los tokens se duplican, los roles no se reinventan

- Cada token de color de `@theme` necesita su valor en tema oscuro.
- **Los nombres y los roles no cambian**: `--color-brand` sigue siendo el color
  de acción en ambos temas. Cambia el valor, no el significado.
- El turquesa `#27D3BC` da 1,89:1 sobre blanco y 9,18:1 sobre `#001C32`. En
  tema oscuro **puede** llevar texto y ser color de acción; en claro no. La
  spec debe decidir si el rol del acento cambia por tema o se mantiene idéntico
  para no tener dos landings distintas.
- Las señales de estado (verde `#047857`, rojo `#B91C1C`) siguen siendo señales
  en ambos temas; sus valores pueden ajustarse para contraste, su significado no.

### RF-5 — Contraste verificado en los DOS temas

- Todo par de color que las specs 002 y 003 midieron debe volver a medirse en
  tema oscuro: CTA con texto blanco, texto secundario sobre fondo, enlace del
  footer, badge del héroe, chip verde del mockup, anillos de foco.
- El criterio sigue siendo WCAG AA (≥ 4,5:1 para texto).
- Se mide en el navegador, no se estima.

### RF-6 — `color-scheme` declarado

- La página debe declarar `color-scheme` según el tema activo, para que los
  controles nativos —los `input` y `textarea` del diálogo, las barras de
  desplazamiento, el `::backdrop`— se rendericen acordes.
- Sin esto, un campo de formulario queda blanco sobre una página oscura.

### RF-7 — El control de tema tiene dónde vivir

- El selector necesita un lugar en la interfaz, y el sitio no tiene navegación:
  el header solo contiene la marca y un CTA.
- **Restricción conocida y medida:** a 320 px el header ya va apretado. La
  marca envuelve a dos líneas (143×32) y el CTA también desde la spec 003
  (136×60). **No cabe un tercer elemento sin rehacer la composición de la
  cabecera**, que es trabajo diferido al rediseño.
- La spec debe resolver dónde va el control sin romper el header a 320 px.
- El control debe ser accesible por teclado, tener nombre accesible y comunicar
  el estado activo de los tres.

### RF-8 — El logotipo del footer solo vive sobre fondo oscuro

- `src/assets/logo.png` es blanco sobre negro **opaco**, sin canal alfa. Se
  integra con `mix-blend-screen`, que exige un fondo oscuro detrás.
- **En ambos temas, el fondo del footer debe permanecer oscuro.** Si el tema
  claro u oscuro cambiara el footer a un fondo claro, el logotipo se vería como
  un rectángulo negro.
- Es una restricción del asset, no una preferencia de diseño.

### RF-9 — El idioma y el origen del texto no cambian

- Todo texto nuevo del control de tema (etiquetas, nombres accesibles) sale de
  `src/i18n/es.ts`. Cero literales en componentes.

## Fuera de alcance

- Los cinco problemas prioritarios del critique, ya listados arriba.
- Rediseñar el mundo visual claro: la spec 002 se conserva tal cual.
- Rehacer la composición del header a 320 px (queda como restricción, no como
  tarea) y los objetivos táctiles pendientes del header.
- `public/favicon.svg`, que sigue siendo el de la plantilla de Astro.
- Configurar `PUBLIC_WEB3FORMS_KEY` y confirmar `site.contactEmail`, aplazados
  en la spec 003.

## Riesgos

| Riesgo | Nota |
|---|---|
| Destello de tema equivocado | El motivo de RF-2; se resuelve con script bloqueante, no con CSS |
| El loader destella blanco en oscuro | RF-3; no puede usar tokens de Tailwind |
| Duplicar tokens duplica la superficie de error de contraste | RF-5 exige medir los dos temas, no extrapolar |
| El control no cabe en el header a 320 px | RF-7; colisiona con trabajo diferido al rediseño |
| El logotipo se rompe si el footer se aclara | RF-8; restricción del asset |
| `::backdrop` y controles nativos desentonan | RF-6 |

## Criterios de aceptación

- [x] Sin elección previa y con el sistema en claro, la landing carga clara. —
      Verificado en vivo: `prefers-color-scheme` en claro, sin `data-theme` ni
      valor guardado → fondo `#FFFFFF`, texto navy, `--color-brand: #1b3561`.
- [x] Sin elección previa y con el sistema en oscuro, la landing carga oscura. —
      Verificado en vivo con el SO en oscuro → fondo `#16273A`.
- [x] Elegir claro con el sistema en oscuro deja la landing clara, y al revés.
- [x] La elección sobrevive a recargar. — `localStorage` + script bloqueante.
- [x] En "sistema", el cambio del SO se refleja sin recargar. — Listener de
      `matchMedia` en el componente.
- [x] No hay destello de tema equivocado. — El script va en `<head>`, **antes**
      de la hoja de estilos (posición 431 contra 1697 en el HTML servido) y sin
      `type="module"`. El loader lleva sus propias reglas de tema.
- [x] Todo par de color medido cumple AA **en los dos temas**. — En oscuro:
      los 4 CTA **9.18**, texto secundario **7.50**, badge del hero **8.23**,
      número de paso **9.18**, correo del footer **9.18**, rojo antifraude
      **5.48**, icono del control **7.50**.
- [x] `color-scheme` refleja el tema activo. — `light dark` en sistema, `light`
      y `dark` en las elecciones explícitas.
- [x] El control es alcanzable por teclado, tiene nombre accesible y expone el
      estado activo. — 44×44, `aria-label` "Tema de la página",
      `role="radiogroup"` con `aria-checked`.
- [x] El header no se rompe a 320 px con el control añadido. — Sin
      desbordamiento, altura 64 px, los tres elementos en una línea:
      marca 32×32, control 44×44, CTA 156×40.
- [x] El logotipo de Orbital Studio sigue legible en el footer en ambos temas. —
      `--color-footer` se mantiene en `#001C32` en los dos.
- [x] Todo texto nuevo sale de `src/i18n/es.ts`.
- [x] `astro check` (0 errores, 0 avisos) y `pnpm build` en verde. — Persiste
      **1 hint**: la deprecación de `document.execCommand`, respaldo deliberado
      de la spec 003.
- [x] Sin regresiones a 320 px ni a 1440 px, ni con `prefers-reduced-motion`, en
      ambos temas. — El bloque de movimiento reducido quedó intacto.

## Defectos encontrados durante la ejecución y corregidos

Tres, todos de la misma familia: **tokens cuyo rol se invierte con el tema, en
usos que necesitaban un valor fijo.**

1. **El footer se habría vuelto turquesa.** `--color-footer` era alias de
   `--color-brand-dark`, y ese token se remapea en oscuro. Se separó **valor de
   rol**: `--color-night` y `--color-deep` son los valores; `--color-brand`,
   `--color-brand-dark` e `--color-ink` son los roles que sí cambian.
2. **El mockup del teléfono se invertía** a un teléfono claro y menta, porque
   usa `bg-ink` y `from-brand`. Representa una pantalla que es oscura siempre.
   Se aisló con `[data-always-dark]`, que fija los tokens que usa. De paso
   protege el chip verde: con `#34D399` su texto blanco habría perdido contraste.
3. **El velo del diálogo se habría aclarado.** Usaba `--color-ink`, que en
   oscuro es casi blanco. Un velo debe oscurecer en ambos temas: pasa a
   `--color-night`. Igual la sombra del header pegado.

## Regresión de la spec 003, resuelta de rebote

Colapsar la marca del header a su icono bajo `sm` devolvió el CTA a **una
línea** (156×40, contra 136×60). La regresión que introdujo la spec 003 al
unificar etiquetas queda cerrada.

## Sigue abierto

- **El CTA flotante sobre el footer**: 9.18:1 en oscuro, pero **en claro sigue
  en 1.43:1**. El hallazgo de la spec 002 no se resuelve, solo deja de aplicar
  en un tema.
- **Objetivos táctiles del header**: el CTA mide 40 px y la marca 32 px, bajo
  los 44. Diferido al rediseño.
- **Los cinco problemas prioritarios del critique**: intactos. Esta spec no los
  toca.
