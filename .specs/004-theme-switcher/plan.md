# Plan: Selector de tema claro / oscuro / sistema

> Diseño técnico de [`spec.md`](./spec.md). Extiende el mundo visual de la spec
> 002; **no lo reemplaza**. Todos los ratios de este documento están calculados,
> no estimados.

---

## 1. Mecanismo: atributo `data-theme` + remapeo de tokens

Tailwind v4 emite las variables de `@theme` en `:root` y las utilidades las leen
con `var()` (verificado en el build: `.bg-brand{background-color:var(--color-brand)}`).
Por eso **basta redefinir las variables** para repintar la landing entera, sin
tocar un solo componente ni añadir variantes `dark:`.

```css
/* @theme queda como está (spec 002) = tema CLARO. */

/* Paleta oscura: los valores se declaran UNA vez. */
:root {
  --dark-surface:     #16273A;
  --dark-surface-alt: #1C3049;
  --dark-ink:         #E6EDF5;
  --dark-ink-soft:    #A8B8CC;
  --dark-hairline:    #2A3F58;
  --dark-brand:       #27D3BC;  /* el turquesa pasa a ser el color de acción */
  --dark-on-brand:    #001C32;  /* y su texto deja de ser blanco */
  --dark-ok:          #34D399;
  --dark-bad:         #F87171;
}

/* El remapeo aparece dos veces, una por cada forma de estar en oscuro. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* ...remapeo... */ }
}
:root[data-theme="dark"] { /* ...remapeo... */ }
```

Los tres estados salen exactamente de esa estructura:

| Atributo | Sistema claro | Sistema oscuro |
|---|---|---|
| ausente (**por defecto**) | **claro** | oscuro |
| `data-theme="light"` | claro | **claro** (el `:not()` bloquea la media query) |
| `data-theme="dark"` | **oscuro** | oscuro |

Cumple RF-1 al pie: sin elección y con el sistema en claro, la landing es clara.

> **`light-dark()` evaluado y descartado.** Habría permitido un solo valor por
> token, pero las utilidades con opacidad (`bg-ink/55`, `bg-accent/10`, ya en
> uso) compilan a `color-mix(in oklab, var(--color-x) 55%, transparent)`, y el
> comportamiento de `color-mix()` sobre un `light-dark()` sin resolver no está
> verificado aquí. Un fallo ahí sería silencioso. El remapeo duplica una lista
> de asignaciones, nunca los valores.

`color-scheme` (RF-6) se declara en el mismo sitio: `light dark` por defecto,
y fijo cuando hay elección explícita. Es lo que hace que los `input` del
diálogo, el `::backdrop` y las barras de desplazamiento se rendericen acordes.

---

## 2. Lo que los números obligan a cambiar

### El color de acción NO puede seguir siendo `#1B3561`

| Par | Ratio | Veredicto |
|---|---|---|
| Blanco sobre `#1B3561` | 12.15 | el **texto** se leería bien… |
| `#1B3561` contra superficie `#16273A` | **1.42** | …pero el **botón** es invisible |

En oscuro el CTA sería una losa que no se distingue del fondo. **El turquesa
pasa a ser el color de acción**, con texto navy:

| Par | Ratio | |
|---|---|---|
| Texto `#001C32` sobre turquesa `#27D3BC` | **9.18** | ✅ |
| Turquesa contra superficie (borde del botón) | **8.03** | ✅ |

Es la inversión que el critique pedía, y aquí la impone la aritmética, no el
gusto. **Solo aplica al tema oscuro**: en claro el turquesa sigue dando 1.89:1
sobre blanco y sigue sin poder llevar texto (spec 002, RF-3, intacta).

### Token nuevo: `--color-on-brand`

Los cinco CTA llevan `text-white` escrito en el marcado. En oscuro el texto debe
ser navy. Sin un token, cada CTA necesitaría una variante `dark:` — justo lo que
`@theme` existe para evitar.

`--color-on-brand`: `#FFFFFF` en claro, `#001C32` en oscuro. Reemplaza
`text-white` en: los 5 CTA, el cuadro del logotipo del header, los números de
paso de `HowItWorks` y el *skip link*.

**No se toca** el `text-white` del footer (que sigue oscuro en ambos temas) ni
el del mockup (que es una pantalla de teléfono, siempre oscura).

### Las señales de estado cambian de valor, no de significado

| Señal | Claro | Ratio | Oscuro | Ratio |
|---|---|---|---|---|
| Válido | `#047857` | 5.48 sobre blanco | `#34D399` | **7.88** |
| Rechazado | `#B91C1C` | 6.47 sobre blanco | `#F87171` | **5.48** |

Los valores actuales sobre fondo oscuro dan **3.14** y **2.66**: incumplen AA.
Verde sigue siendo verde y rojo sigue siendo rojo (spec 002, RF-4).

---

## 3. Problema detectado: el footer se funde con la página

`--color-footer` debe seguir oscuro en ambos temas porque el logotipo de Orbital
Studio es blanco sobre negro opaco y se integra con `mix-blend-screen` (RF-8).
Pero en tema oscuro la página también es oscura:

| Superficie oscura candidata | Separación contra footer `#001C32` |
|---|---|
| `#0E1C2B` | 1.01 |
| `#16273A` (**elegida**) | 1.14 |
| `#1E3350` | 1.36 |

Ninguna da una separación cómoda sin aclarar tanto la página que deje de
parecer oscura. **Solución: no confiar en el fondo.** El footer recibe un
`border-t border-hairline` explícito en ambos temas, que en oscuro da 1.41:1
contra la superficie y marca el límite sin depender del salto de luminancia.

Se elige `#16273A` porque mantiene 12.85:1 de texto principal y es el mejor
compromiso entre seguir leyéndose oscura y separarse del footer.

> **Efecto lateral favorable.** El CTA flotante sobre el footer —hallazgo
> abierto de la spec 002, con 1.43:1— pasa en oscuro a **9.18:1**, porque el
> botón es turquesa. En tema claro el problema sigue exactamente igual.

---

## 4. Sin destello de tema equivocado (RF-2)

Script `is:inline` y **sin `type="module"`** al principio del `<head>` de
`Base.astro`, siguiendo el precedente de `Loader.astro`:

```html
<script is:inline>
  (function () {
    try {
      var t = localStorage.getItem('tema');
      if (t === 'light' || t === 'dark') {
        document.documentElement.setAttribute('data-theme', t);
      }
    } catch (e) {}
  })();
</script>
```

`try/catch` porque `localStorage` lanza en modo privado de Safari. Sin elección
guardada no se escribe atributo, y manda `prefers-color-scheme`: es el estado
"sistema" y es el defecto.

### El loader (RF-3)

`Loader.astro` pinta **antes** que Tailwind y por eso duplica sus hex a
propósito (spec 002, RF-1). Hoy tiene `background: #ffffff` fijo: en oscuro
destellaría a pantalla completa. Su bloque `is:inline` recibe las mismas dos
condiciones que §1, con los valores oscuros duplicados y el comentario de la
spec 002 actualizado para nombrarlos.

---

## 5. Dónde vive el control (RF-7)

A 320 px `container-page` deja **272 px** útiles. Medido hoy: marca 143 + CTA
136 + separación 16 = **295 px** → los dos envuelven a dos líneas.

Un `<select>` con "Sistema" mide ~90 px y no cabe. **Solo cabe un botón de icono
de 44×44**, que abre un menú con las tres opciones.

**Decisión: botón de icono en el header + `popover` nativo.** Requiere colapsar
el nombre de la marca a su icono bajo `sm`:

| | ancho a 320 px |
|---|---|
| Hoy | 143 + 16 + 136 = 295 ❌ |
| Con la marca en solo icono + control | 32 + 16 + 44 + 16 + 136 = **244** ✅ |

Colapsar el nombre **alivia** el apretujamiento preexistente del header en vez
de agravarlo: hoy la marca ya envuelve a dos líneas y se ve rota.

- La API `popover` da Esc y cierre al hacer clic fuera sin JS propio.
- Dentro: `role="radiogroup"` con tres opciones y `aria-checked`, que expone
  cuál está activo (RF-7).
- El icono refleja el tema activo. Nombre accesible y etiquetas desde `es.ts`.

> Alternativa considerada y descartada: llevarlo al footer. Con el defecto en
> "sistema" el control es una vía de escape poco usada, así que el footer sería
> defendible — pero un visitante que llegue en el tema equivocado tendría que
> recorrer 6.872 px para arreglarlo.

---

## 6. Archivos

| Archivo | Cambio |
|---|---|
| `src/styles/global.css` | Paleta oscura, los dos bloques de remapeo, `color-scheme`, token `--color-on-brand` |
| `src/layouts/Base.astro` | Script anti-destello en el `<head>` |
| `src/components/Loader.astro` | Fondo, anillo y punto según tema, en su bloque `is:inline` |
| `src/components/ThemeToggle.astro` | **Nuevo**: botón de icono + popover con tres opciones |
| `src/components/Header.astro` | Monta el control; marca en solo icono bajo `sm` |
| `src/components/Footer.astro` | `border-t border-hairline` explícito |
| `Hero/FinalCta/FloatingCta/ContactDialog/HowItWorks` | `text-white` → `text-on-brand` en los elementos sobre `bg-brand` |
| `src/i18n/es.ts` | Etiquetas del control y su nombre accesible |

---

## 7. Verificación

```sh
pnpm check && pnpm build
grep -rn 'dark:' src/            # debe salir vacío: el tema va por tokens
```

En el navegador, **en los dos temas**, a 320 y 1440 px:

1. Sistema en claro y sin elección → landing **clara**. Sistema en oscuro → oscura.
2. Forzar claro con el sistema en oscuro, y al revés.
3. Recargar y reabrir: la elección persiste.
4. En "sistema", cambiar la preferencia del SO con la página abierta cambia el
   tema **sin recargar** (`matchMedia('(prefers-color-scheme: dark)')` con listener).
5. **Sin destello**: recarga dura en oscuro, mirando el primer pintado y el loader.
6. Repetir las mediciones de contraste de las specs 002 y 003 en tema oscuro.
7. Diálogo: campos, `::backdrop` y anillos de foco correctos en ambos.
8. El logotipo del footer legible en ambos; el límite del footer visible.
9. Header a 320 px con el control: sin desbordamiento ni envolturas.
10. `prefers-reduced-motion: reduce` en ambos temas.

### Riesgos

| Riesgo | Mitigación |
|---|---|
| El remapeo se escribe dos veces y se desincroniza | Los valores viven una sola vez en `--dark-*`; solo se repite la lista de asignaciones |
| El loader queda fuera de sincronía con `@theme` | Comentario explícito en ambos lados, como en la spec 002 |
| `popover` no soportado | Baseline desde 2024; si falla, degradar a `<details>` |
| Colapsar la marca a icono se lee como pérdida de identidad | Solo bajo `sm`, donde hoy ya envuelve a dos líneas |
| Duplicar temas duplica la superficie de error de contraste | El punto 6 exige medir, no extrapolar |
