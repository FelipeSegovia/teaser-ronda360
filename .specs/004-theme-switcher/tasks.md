# Tasks: Selector de tema claro / oscuro / sistema

> **Ejecutada completa el 2026-09-08.** Resultados en `status.md`.
>
> Lista ejecutable derivada de [`plan.md`](./plan.md). Se ejecutan **en orden**.
> Tras cada tarea completada se actualiza `status.md`.
>
> **T1 y T2 son inseparables en la práctica.** T1 deja la landing capaz de
> pintarse oscura, pero hasta T2 los CTA quedan con texto blanco sobre turquesa
> (1.89:1). No dar por buena una revisión visual entre ambas.
>
> Hasta T7 no hay control en pantalla: para probar, alternar el tema del sistema
> operativo o poner `data-theme` a mano en las herramientas del navegador.

---

## T1 — Paleta oscura y remapeo

**Archivo:** `src/styles/global.css`

- [x] **No tocar el bloque `@theme`**: es el tema claro de la spec 002 y queda
      intacto.
- [x] Declarar la paleta oscura **una sola vez** en `:root`:
      `--dark-surface: #16273A`, `--dark-surface-alt: #1C3049`,
      `--dark-ink: #E6EDF5`, `--dark-ink-soft: #A8B8CC`,
      `--dark-hairline: #2A3F58`, `--dark-brand: #27D3BC`,
      `--dark-on-brand: #001C32`, `--dark-ok: #34D399`, `--dark-bad: #F87171`.
- [x] `--color-footer` **no cambia**: sigue `#001C32` en ambos temas (RF-8).
- [x] Escribir los **dos** bloques de remapeo:
      `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }`
      y `:root[data-theme="dark"] { … }`.
- [x] Declarar `color-scheme`: `light dark` en `:root`, `light` en
      `[data-theme="light"]`, `dark` en `[data-theme="dark"]` (RF-6).
- [x] Comentar por qué el remapeo aparece dos veces y por qué se descartó
      `light-dark()`.

**Hecho cuando:** alternando el tema del sistema, la landing cambia de fondo y
de color de texto sin tocar ningún componente.

---

## T2 — `--color-on-brand` y el texto de los CTA

- [x] `src/styles/global.css` — añadir `--color-on-brand` a `@theme`
      (`#FFFFFF`) y a los dos bloques de remapeo (`var(--dark-on-brand)`).
- [x] Sustituir `text-white` → `text-on-brand` **solo** en elementos que van
      sobre `bg-brand`: los CTA de `Hero`, `FinalCta`, `FloatingCta`,
      `ContactDialog` (botón de envío y acción primaria del `mailto`) y
      `Header`; el cuadro del logotipo del header; los números de paso de
      `HowItWorks`; el *skip link* de `Base.astro`.
- [x] **No tocar** el `text-white` de `Footer.astro` (el footer sigue oscuro en
      ambos temas) ni el de `AppMockup.astro` (es una pantalla de teléfono,
      siempre oscura).

**Hecho cuando:** en oscuro los CTA son turquesa con texto navy; en claro siguen
azul con texto blanco, sin ningún cambio visible respecto de hoy.

---

## T3 — Sin destello de tema equivocado

**Archivo:** `src/layouts/Base.astro`

- [x] Añadir al **principio del `<head>`** un `<script is:inline>` **sin**
      `type="module"` que lea `localStorage.getItem('tema')` y ponga
      `data-theme` en `<html>` solo si vale `light` o `dark`.
- [x] Envolver en `try/catch`: `localStorage` lanza en modo privado de Safari.
- [x] Sin valor guardado **no se escribe atributo**: manda
      `prefers-color-scheme`, que es el estado "sistema" y el defecto.

**Hecho cuando:** una recarga dura en tema oscuro no muestra ni un fotograma
claro.

---

## T4 — El loader respeta el tema

**Archivo:** `src/components/Loader.astro`, bloque `<style is:inline>`

- [x] Hoy `background: #ffffff` es fijo y destellaría a pantalla completa en
      oscuro. Añadir las **mismas dos condiciones** de T1 para el fondo, el
      anillo y el punto.
- [x] Actualizar el comentario que la spec 002 dejó ahí para que nombre también
      los valores oscuros y siga advirtiendo que duplican `@theme` a propósito.

**Hecho cuando:** el loader aparece oscuro en tema oscuro y claro en claro, sin
destello en ninguno.

---

## T5 — El límite del footer deja de depender del fondo

**Archivo:** `src/components/Footer.astro`

- [x] Añadir `border-t border-hairline` al `<footer>`.
- [x] Motivo: en oscuro el footer da **1.14:1** contra la superficie y se
      fundiría con la página. El hairline da 1.41:1 y marca el límite solo.
- [x] **No cambiar** el fondo del footer: debe seguir oscuro en ambos temas o el
      logotipo se ve como un rectángulo negro (RF-8).

---

## T6 — Textos del control

**Archivo:** `src/i18n/es.ts`

- [x] Añadir un grupo `theme` con: nombre accesible del control, y las tres
      etiquetas **"Claro"**, **"Oscuro"**, **"Sistema"**.
- [x] Cero literales en componentes (RF-9).

---

## T7 — Componente del selector

**Archivo nuevo:** `src/components/ThemeToggle.astro`

- [x] Botón de icono de **44×44** que abre un `popover` nativo (Esc y cierre al
      hacer clic fuera, sin JS propio).
- [x] Dentro, `role="radiogroup"` con tres opciones y `aria-checked`, que expone
      cuál está activo (RF-7).
- [x] El icono refleja el tema activo.
- [x] Al elegir: escribir en `localStorage` (`light` / `dark`), o **borrar la
      clave** al elegir "Sistema", y ajustar `data-theme` en `<html>`.
- [x] Escuchar `matchMedia('(prefers-color-scheme: dark)')` para que en estado
      "sistema" el cambio del SO se refleje **sin recargar** (RF-1).
- [x] Alcanzable por teclado, con nombre accesible desde `es.ts`.
- [x] Si `popover` fallara, degradar a `<details>`.

---

## T8 — Montar el control en el header

**Archivo:** `src/components/Header.astro`

- [x] Insertar `<ThemeToggle />` entre la marca y el CTA.
- [x] Colapsar el nombre de la marca a **solo su icono bajo `sm`**, dejando el
      texto visible desde `sm` en adelante.
- [x] Cuenta a 320 px, contra los **272 px** útiles:
      hoy 143 + 16 + 136 = **295** ❌ → con el cambio 32 + 16 + 44 + 16 + 136 = **244** ✅.
- [x] **No rehacer la composición del header** más allá de esto: el resto está
      diferido al rediseño.

**Hecho cuando:** a 320 px el header entra en una línea, sin desbordamiento.

---

## T9 — Comprobaciones automáticas

- [x] `pnpm check` en verde.
- [x] `pnpm build` en verde.
- [x] `grep -rn 'dark:' src/` → **vacío**: el tema va por tokens, no por variantes.
- [x] `grep -rn 'text-white' src/` → solo `Footer.astro` y `AppMockup.astro`.

---

## T10 — Verificación en el navegador

En **los dos temas**, a **320 px** y **1440 px**:

- [x] Sistema en claro y sin elección previa → landing **clara** (es el requisito
      explícito de RF-1).
- [x] Sistema en oscuro y sin elección → landing oscura.
- [x] Forzar claro con el sistema en oscuro, y forzar oscuro con el sistema en
      claro.
- [x] La elección sobrevive a recargar y a cerrar y reabrir el navegador.
- [x] En "sistema", cambiar la preferencia del SO con la página abierta cambia
      el tema **sin recargar**.
- [x] **Sin destello**: recarga dura en oscuro, mirando el primer pintado y el
      loader.
- [x] Re-medir en oscuro los pares de las specs 002 y 003: CTA con su texto,
      texto secundario sobre fondo y sobre banda, enlace del footer, texto del
      badge del héroe, chip verde del mockup, anillos de foco.
- [x] Diálogo de contacto: campos, `::backdrop`, anillos de foco y objetivos
      táctiles correctos en ambos temas.
- [x] Logotipo de Orbital Studio legible en el footer en ambos temas, y el
      límite superior del footer visible.
- [x] Header a 320 px con el control: sin desbordamiento ni envolturas.
- [x] Control alcanzable por teclado, con nombre accesible y estado activo
      expuesto.
- [x] `prefers-reduced-motion: reduce` en ambos temas.
- [x] Recordar quitar el `astro-dev-toolbar` antes de juzgar capturas.

---

## T11 — Cerrar la spec

- [x] Marcar los criterios de aceptación de `spec.md` con resultados medidos.
- [x] Registrar en `status.md` si el CTA flotante sobre el footer quedó
      efectivamente en 9.18:1 en oscuro, **y recordar que en claro sigue en
      1.43:1** (hallazgo abierto de la spec 002, no resuelto por esta).
- [x] Dejar anotado que **los cinco problemas prioritarios del critique siguen
      abiertos**: esta spec no los toca.
