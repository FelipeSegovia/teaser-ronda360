# Plan: Paleta de marca definitiva

> Diseño técnico de [`spec.md`](./spec.md). No introduce contenido, estructura
> ni comportamiento nuevos: solo valores de color y los ajustes mínimos para
> que esos valores sigan viviendo en `@theme`.

---

## 1. Estado de partida

El grep de la paleta anterior sobre `src/` deja exactamente seis lugares con
hex literales:

| Archivo | Línea | Valor | Rol actual |
|---|---|---|---|
| `src/styles/global.css` | 12 | `#0B1220` | `--color-ink` |
| `src/styles/global.css` | 14 | `#1D4ED8` | `--color-brand` |
| `src/styles/global.css` | 15 | `#1E3A8A` | `--color-brand-dark` |
| `src/styles/global.css` | 18 | `#E2E8F0` | `--color-hairline` |
| `src/styles/global.css` | 19 | `#0B1220` | `--color-footer` |
| `src/components/Loader.astro` | 42, 43, 52 | `#e2e8f0`, `#1d4ed8` ×2 | anillo y punto del loader |

Más tres usos indirectos de la paleta vieja que no son hex:

| Archivo | Línea | Valor | Por qué hay que tocarlo |
|---|---|---|---|
| `src/styles/global.css` | 82 | `rgb(11 18 32 / 0.06)` | sombra del header pegado; es `#0B1220` en decimal |
| `src/styles/global.css` | 96 | `rgb(11 18 32 / 0.55)` | backdrop del `<dialog>`; ídem |
| `src/components/AppMockup.astro` | 12 | `from-slate-800` | color por defecto de Tailwind (RF-6) |

Todo lo demás ya consume utilidades (`bg-brand`, `text-ink-soft`,
`border-hairline`…), así que **cambiar `@theme` repinta la landing entera**.
Los cambios en componentes son solo los del reparto del turquesa (RF-3) y el
`from-slate-800`.

---

## 2. Bloque `@theme` resultante

`src/styles/global.css`, líneas 9–20. Cada hex de marca aparece **una sola vez**
(RF-1); los tokens semánticos que repiten un color lo hacen por `var()`, que
Tailwind v4 resuelve sin problema porque `@theme` emite las variables en `:root`.

```css
@theme {
  --color-surface:     #FFFFFF;
  --color-surface-alt: #F4F7FB;

  /* Marca. Los tres únicos hex de paleta del proyecto. */
  --color-brand:       #1B3561;  /* secundario — azul profundo: acción */
  --color-brand-dark:  #001C32;  /* primario  — azul noche: profundidad */
  --color-accent:      #27D3BC;  /* terciario — turquesa: acento */

  /* Semánticos derivados: no declaran hex, referencian. */
  --color-ink:         var(--color-brand-dark);
  --color-footer:      var(--color-brand-dark);

  --color-ink-soft:    #4A5A72;  /* gris con tinte navy (RF-5) */
  --color-hairline:    #D9E1EA;  /* borde con tinte navy (RF-5) */

  --color-ok:          #047857;  /* señal de estado — no cambia (RF-4) */
  --color-bad:         #B91C1C;  /* señal de estado — no cambia (RF-4) */

  /* --font-sans y --animate-* quedan igual. */
}
```

### Por qué los nombres de token no cambian

`--color-brand` sigue siendo el color de acción y `--color-brand-dark` el de su
hover, exactamente como hoy. Lo que cambia es qué color de la paleta ocupa cada
rol. Mantener los nombres deja en cero el diff de los cinco componentes que usan
`bg-brand` / `hover:bg-brand-dark` (Header, Hero, FinalCta, FloatingCta,
ContactDialog) y evita un renombrado masivo que la spec no pide.

`--color-accent` es el token nuevo que exige RF-1 para el terciario.

`--color-ink` y `--color-footer` se vuelven alias de `--color-brand-dark`. Se
conservan como tokens —en vez de reemplazar sus usos por `bg-brand-dark`—
porque nombran roles distintos (texto, fondo del footer) y porque `bg-ink/55`,
`border-ink` y `bg-footer` ya están repartidos por los componentes.

### Verificación de contraste (calculada, no estimada)

| Par | Ratio | Umbral | Resultado |
|---|---|---|---|
| Blanco sobre `--color-brand` `#1B3561` | **12.15:1** | 4.5 | ✅ AA y AAA |
| Blanco sobre `--color-brand-dark` `#001C32` | **17.33:1** | 4.5 | ✅ |
| `--color-ink-soft` `#4A5A72` sobre blanco | **7.01:1** | 4.5 | ✅ AA y AAA |
| `--color-ink-soft` sobre `--color-surface-alt` `#F4F7FB` | **6.52:1** | 4.5 | ✅ |
| `--color-accent` `#27D3BC` sobre `--color-footer` `#001C32` | **9.18:1** | 4.5 | ✅ |
| Blanco sobre `--color-accent` | **1.89:1** | 4.5 | ❌ — de ahí RF-3 |

`--color-surface-alt` `#F4F7FB` no se toca: ya es un azul muy claro coherente
con la paleta y no figura entre los valores prohibidos por RF-6.

---

## 3. Reparto del terciario (RF-3)

Los cinco puntos donde entra el turquesa, y el sexto en el loader:

| Archivo | Elemento | Cambio |
|---|---|---|
| `Hero.astro:10` | segundo blob decorativo del fondo | `bg-brand/5` → `bg-accent/10` |
| `Hero.astro:16-18` | punto y halo del badge | `bg-brand` → `bg-accent` (×2) |
| `AppMockup.astro:35` | línea de escaneo | `bg-brand shadow-brand` → `bg-accent shadow-accent` |
| `AppMockup.astro:60` | botón de la app | `bg-brand` → `bg-accent` |
| `Footer.astro:44` | enlace de correo | `text-white … hover:text-white/80` → `text-accent … hover:text-accent/80` |
| `Loader.astro:52` | punto del loader | `#1d4ed8` → `#27D3BC` |

Todos son fondos decorativos o texto sobre oscuro. **Ninguno lleva texto blanco
encima**, que es la prohibición de RF-3.

El halo y el punto del badge del hero quedan en turquesa sobre fondo casi blanco
(1.89:1): es admisible porque son puramente decorativos (`aria-hidden="true"`,
sin significado propio) y la información del badge la lleva el texto, que sigue
en `text-brand` (12.15:1). El borde y el fondo del badge siguen en
`border-brand/20 bg-brand/5`.

### Dónde NO entra el turquesa

- Ningún CTA (Header, Hero, FinalCta, FloatingCta, ContactDialog): quedan en
  `bg-brand` con `hover:bg-brand-dark` y texto blanco.
- Ningún anillo de foco: `focus-visible:ring-brand` en todos lados. Un anillo
  turquesa sobre fondo blanco daría 1.89:1 y fallaría el criterio 1.4.11 de
  contraste no textual.
- Ni el badge "1.4 m" ni el halo verde del mockup (`bg-ok`), ni el aspa ni los
  textos de rechazo (`text-bad`): son señales de estado (RF-4).

---

## 4. Cambios restantes, archivo por archivo

### `src/styles/global.css`

1. Bloque `@theme` según §2.
2. Línea 82 — sombra del header pegado:
   `0 8px 24px rgb(11 18 32 / 0.06)` → `0 8px 24px color-mix(in srgb, var(--color-ink) 6%, transparent)`.
3. Línea 96 — `dialog::backdrop`:
   `rgb(11 18 32 / 0.55)` → `color-mix(in srgb, var(--color-ink) 55%, transparent)`.

   > **A verificar en el navegador.** El `::backdrop` de un `<dialog>` vive en la
   > top layer; heredar variables del elemento originante es comportamiento
   > relativamente reciente. `ContactDialog.astro` ya usa la utilidad
   > `backdrop:bg-ink/55`, que compila a un `color-mix()` con `var(--color-ink)`,
   > así que el mecanismo ya está en uso y funcionando. Si en la revisión visual
   > el backdrop sale transparente, el reemplazo es `rgb(0 28 50 / 0.55)` con un
   > comentario explicando la duplicación del hex primario.

### `src/components/AppMockup.astro`

- Línea 12: `bg-gradient-to-b from-slate-800 to-ink` → `bg-gradient-to-b from-brand to-ink`.
  El degradado pasa de gris a un navy real (`#1B3561` → `#001C32`), que es el
  "cuerpo del mockup" que pide RF-2, y no introduce ningún token nuevo.

### `src/components/Loader.astro`

El `<style is:inline>` es la excepción tolerada de RF-1: pinta antes que la hoja
de Tailwind, así que no puede usar tokens. Sus tres hex deben coincidir con
`@theme`:

| Línea | Antes | Después | Espejo en `@theme` |
|---|---|---|---|
| 42 | `border: 3px solid #e2e8f0` | `#D9E1EA` | `--color-hairline` |
| 43 | `border-top-color: #1d4ed8` | `#1B3561` | `--color-brand` |
| 52 | `background: #1d4ed8` | `#27D3BC` | `--color-accent` |

Se añade un comentario en el bloque advirtiendo que estos tres valores duplican
`@theme` a propósito y hay que actualizarlos a la par.

### Sin cambios

`Problem.astro`, `HowItWorks.astro`, `Capabilities.astro`, `AntiFraud.astro`,
`FinalCta.astro`, `Header.astro`, `FloatingCta.astro`, `ContactDialog.astro`,
`Base.astro`, `index.astro`, `i18n/es.ts`, `config/site.ts`, `lib/contact.ts`.
Todos consumen utilidades y se repintan solos.

---

## 5. Verificación

### Grep (criterio RF-6)

```sh
grep -rn -E '1D4ED8|1E3A8A|0B1220|E2E8F0' -i src/
grep -rn -E '(bg|text|border|from|via|to|ring|shadow|fill|stroke|divide|outline|placeholder|decoration)-slate-' src/
grep -rn -E 'rgb\(11 18 32' src/
```

Los tres deben salir vacíos.

> Ojo: un `grep -rn 'slate-'` a secas da falsos positivos con `-translate-y-1`,
> que aparece en cuatro componentes. Por eso el patrón lleva el prefijo de
> utilidad.

### Hex fuera de `@theme` y del loader

```sh
grep -rn -E '#[0-9a-fA-F]{3,8}\b' src/ | grep -v 'styles/global.css' | grep -v 'Loader.astro'
```

Debe salir vacío (los `#contenido`, `#hero`, `#contact-dialog` son selectores y
anclas, no colores; el patrón exige dígitos hex, así que no los captura —
`#hero` sí contiene solo letras no-hex y queda fuera).

### Build

```sh
pnpm check   # astro check
pnpm build   # astro build
```

### Revisión visual

Con `astro dev --background`, a **320 px** y a **1440 px**:

1. Hero: badge con punto turquesa, blobs de fondo, CTA azul con texto blanco.
2. Mockup: degradado navy, línea de escaneo turquesa, badge "1.4 m" **verde**,
   botón inferior turquesa.
3. Los cinco CTA en estado normal / `:hover` / `:focus-visible` — el anillo debe
   verse azul y separado del botón.
4. Diálogo de contacto: backdrop oscurecido (ver la nota de §4), campos, anillo
   de foco, mensaje de error en rojo, estado de éxito con el check verde.
5. Header tras hacer scroll: fondo translúcido, hairline inferior y sombra.
6. Footer: logo legible sobre el nuevo fondo (`mix-blend-screen` sobre
   `#001C32`), enlace de correo turquesa.
7. Bloque antifraude: el resultado rechazado sigue en rojo.
8. Con `prefers-reduced-motion: reduce` forzado: todo visible, sin animación.

---

## 6. Riesgos

| Riesgo | Mitigación |
|---|---|
| `var()` dentro de `dialog::backdrop` no resuelve en algún navegador | Nota en §4 con el reemplazo literal listo |
| El logo de Orbital Studio pierde legibilidad sobre `#001C32` | `mix-blend-screen` con negro opaco es invariante al fondo; se confirma igual en el punto 6 de la revisión visual |
| Los tres hex del loader se desincronizan de `@theme` en el futuro | Comentario explícito en ambos lados |
| El turquesa del badge del hero se lea como "estado" y no como decoración | El verde `--color-ok` sigue siendo el único estado positivo, y solo aparece en el mockup |

## 7. Fuera de alcance (recordatorio de la spec)

`public/favicon.svg` (sigue el de la plantilla de Astro), `assets/logo.png`,
cualquier cambio de copy o layout, y modo oscuro.
