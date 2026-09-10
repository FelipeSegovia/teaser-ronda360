# Plan: Landing de acceso anticipado — RondaControl

Diseño técnico de [`spec.md`](./spec.md). Astro 7.3.1, salida estática, estilos
con **Tailwind CSS v4**, sin frameworks de UI (regla 1 del `landing/AGENTS.md`).

---

## 1. Archivos a tocar

```
landing/
├── .env.example                        (nuevo)
├── package.json                        (dependencias + script "check"; ver §8)
├── astro.config.mjs                    (plugin de Vite de Tailwind; ver §8)
├── public/favicon.svg                  (reemplaza el de Astro)
└── src/
    ├── assets/logo.png                 (copia de landing/assets/logo.png)
    ├── config/site.ts                  (nuevo)
    ├── i18n/es.ts                      (nuevo)
    ├── lib/contact.ts                  (nuevo)
    ├── styles/global.css               (nuevo; única hoja del proyecto)
    ├── layouts/Base.astro              (nuevo)
    ├── components/
    │   ├── Loader.astro
    │   ├── Header.astro
    │   ├── FloatingCta.astro
    │   ├── ContactDialog.astro
    │   ├── Hero.astro
    │   ├── AppMockup.astro
    │   ├── Problem.astro
    │   ├── HowItWorks.astro
    │   ├── Capabilities.astro
    │   ├── AntiFraud.astro
    │   ├── FinalCta.astro
    │   └── Footer.astro
    └── pages/index.astro               (reemplaza la plantilla actual)
```

El original `landing/assets/logo.png` **no se borra**: se copia a `src/assets/`
para que pase por `astro:assets`. El repositorio no está bajo git, así que no se
mueven archivos que el usuario colocó a mano.

---

## 2. Contratos de los módulos

### `src/config/site.ts`

Punto único de edición para marca y contacto.

```ts
export const site = {
  productName: 'RondaControl',
  companyName: 'Orbital Studio',
  // TODO: confirmar el correo definitivo de Orbital Studio.
  contactEmail: 'contacto@orbitalstudio.cl',
  url: 'https://rondasegura.cl',   // TODO: confirmar dominio
} as const;
```

### `src/i18n/es.ts`

Toda la copia visible, un objeto por sección. Ningún componente escribe texto
literal — es el espíritu del punto 6 de la constitución aplicado a la landing.

```ts
export const es = {
  meta: { title: string; description: string },
  nav:  { contact: string },
  hero: { badge, title, subtitle, cta, note },
  problem:  { title, body, points: string[] },
  how:      { title, steps: { title, body }[] },
  caps:     { title, items: { title, body }[] },
  fraud:    { title, body, scenario: { step, result }[] },
  finalCta: { title, body, cta },
  dialog:   { title, body, emailLabel, emailPlaceholder, emailInvalid,
              commentLabel, commentPlaceholder, submit, sending,
              successTitle, successBody, errorTitle, errorBody,
              notConfigured, close },
  footer:   { tagline, rights, logoAlt },
} as const;
```

### `src/lib/contact.ts`

Aísla el proveedor del formulario (RF-4). Cambiarlo es editar sólo este archivo.

```ts
export type ContactInput  = { email: string; comment: string };
export type ContactReason = 'invalid-email' | 'not-configured' | 'network' | 'rejected';
export type ContactResult = { ok: true } | { ok: false; reason: ContactReason };

export function isValidEmail(value: string): boolean;
export function isConfigured(): boolean;
export function submitContact(input: ContactInput): Promise<ContactResult>;
```

Implementación por defecto: **Web3Forms**.

- `POST https://api.web3forms.com/submit`, `Content-Type: application/json`.
- Cuerpo: `{ access_key, subject, from_name, email, message, botcheck }`.
- Clave: `import.meta.env.PUBLIC_WEB3FORMS_KEY` (público por diseño; es una
  clave de envío, no un secreto de lectura).
- `isConfigured()` es `false` si la variable está vacía → el diálogo muestra el
  correo directo en lugar de un formulario roto.
- Se normaliza a `ContactResult`; el componente nunca ve la forma de la respuesta
  del proveedor. Errores de red y respuestas `success: false` se distinguen.
- `botcheck` es el honeypot: si viene lleno, se descarta.

`.env.example` documenta la variable; `.env` ya está en `.gitignore`.

---

## 3. Sistema visual

Tailwind v4 con configuración en CSS. `src/styles/global.css` es la única hoja
del proyecto y se importa una sola vez, desde `Base.astro`. Tema claro, footer
oscuro.

Los tokens de marca van en un bloque `@theme`, que en Tailwind v4 genera a la vez
las variables CSS y las utilidades correspondientes (`bg-brand`, `text-ink`,
`border-hairline`).

| Token | Valor | Utilidad | Uso |
|---|---|---|---|
| `--color-surface` | `#FFFFFF` | `bg-surface` | fondo base |
| `--color-surface-alt` | `#F4F7FB` | `bg-surface-alt` | secciones alternas |
| `--color-ink` | `#0B1220` | `text-ink` | texto principal |
| `--color-ink-soft` | `#4A5568` | `text-ink-soft` | texto secundario (7:1 sobre blanco) |
| `--color-brand` | `#1D4ED8` | `bg-brand` | CTA, enlaces, acentos (7.4:1 sobre blanco) |
| `--color-brand-dark` | `#1E3A8A` | `bg-brand-dark` | hover, degradados |
| `--color-ok` | `#047857` | `text-ok` | estado "marca válida" |
| `--color-bad` | `#B91C1C` | `text-bad` | estado "marca rechazada" |
| `--color-hairline` | `#E2E8F0` | `border-hairline` | bordes de tarjetas |
| `--color-footer` | `#0B1220` | `bg-footer` | footer |

Los diez valores hexadecimales son los mismos que se aprobaron; sólo cambia el
nombre del token para encajar en el espacio de nombres `--color-*` de Tailwind.

Estructura de `global.css`:

```css
@import "tailwindcss";

@theme {
  --color-surface:     #FFFFFF;
  --color-surface-alt: #F4F7FB;
  --color-ink:         #0B1220;
  --color-ink-soft:    #4A5568;
  --color-brand:       #1D4ED8;
  --color-brand-dark:  #1E3A8A;
  --color-ok:          #047857;
  --color-bad:         #B91C1C;
  --color-hairline:    #E2E8F0;
  --color-footer:      #0B1220;

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, sans-serif;

  --animate-scan: scan 3s ease-in-out infinite;
  --animate-halo: halo 2.4s cubic-bezier(0, 0, .2, 1) infinite;
}

@utility container-page {
  margin-inline: auto;
  max-width: 1120px;
  padding-inline: 1.5rem;
}
```

Tres decisiones que evitan tropiezos conocidos:

- **El token de borde se llama `hairline`, no `border`.** `--color-border`
  generaría la utilidad `border-border`, que se confunde a simple vista con la
  utilidad `border` de ancho.
- **Tailwind v4 eliminó el plugin `container`.** El ancho de página se declara
  con `@utility container-page`, como arriba.
- **La paleta por defecto de Tailwind se conserva** además de estos tokens: los
  grises intermedios (`slate-*`) sirven sin necesidad de inventar más nombres.

**Tipografía:** stack del sistema vía `--font-sans`. Cero fuentes externas: sin
peticiones de red, sin dependencias, sin salto de render. Escala fluida con las
utilidades `text-*` y `clamp()` donde haga falta.

**Layout:** `container-page`, grillas con `grid` y `minmax()`, y las variantes
`sm:` / `md:` / `lg:` de Tailwind en lugar de media queries a mano.

`ok` y `bad` sólo se usan en iconos y texto grande; para texto pequeño de estado
se acompaña siempre de una palabra, nunca sólo color.

---

## 4. Animaciones

Los `@keyframes` se declaran en `global.css` y se exponen como utilidades
(`animate-scan`, `animate-halo`) mediante las entradas `--animate-*` del bloque
`@theme` de §3. Las transiciones corrientes usan utilidades de Tailwind
(`transition`, `duration-*`, `ease-*`).

El interruptor de movimiento reducido **se mantiene como un bloque `@media` a
mano**, al final de `global.css`. Tailwind ofrece la variante `motion-reduce:`,
pero habría que repetirla en cada elemento animado y basta olvidar uno para
incumplir el criterio de aceptación; un interruptor global no se puede olvidar:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

| Efecto | Mecanismo |
|---|---|
| Aparición al hacer scroll | `IntersectionObserver` añade `.is-visible` a `[data-reveal]`; CSS transiciona `opacity` y `translateY(16px)`. Con `threshold: .15` y `unobserve` tras revelar. |
| Retardo escalonado en tarjetas | `--delay` por índice, `transition-delay: var(--delay)`. |
| Header al hacer scroll | `IntersectionObserver` sobre un centinela de 1 px arriba del todo → `.is-stuck` (sombra + `backdrop-filter`). Sin listener de `scroll`. |
| Botón flotante | Aparece cuando el hero sale del viewport (mismo observer). |
| Maqueta de la app | Utilidades `animate-scan` y `animate-halo`, definidas en `@theme`. |
| Botones y tarjetas | Utilidades `transition`, `duration-200`, `hover:-translate-y-0.5`, `hover:shadow-lg`. |

Las reglas de `[data-reveal]` y `.is-stuck` van en CSS plano dentro de
`global.css`, no como utilidades: el JS alterna una clase y el estilo depende de
ella, que es justo lo que Tailwind no expresa bien.

Si `IntersectionObserver` no existiera, un fallback marca todo como visible de
entrada: la página nunca queda con contenido invisible.

---

## 5. Loader (RF-1)

El riesgo real es que quede pegado. Diseño a prueba de fallos:

1. El marcado del loader va **primero en el `<body>`**, con su CSS en un
   `<style is:inline>` dentro del `<head>`. `is:inline` hace que Astro deje ese
   bloque fuera del procesamiento de Vite, así que **no depende de la hoja de
   Tailwind**: el loader pinta aunque el CSS del sitio todavía no haya llegado.
   Es la única parte del proyecto con estilos escritos a mano fuera de
   `global.css`, y es deliberado.
2. Un script en línea en el `<head>` registra el cierre por **tres vías**:
   - `window.addEventListener('load')` — camino normal;
   - `setTimeout` de 2500 ms — red de seguridad si una imagen o script falla;
   - comprobación inmediata de `document.readyState === 'complete'` para la
     página ya cacheada.
   La primera que dispara gana; las demás no hacen nada.
3. Cerrar = añadir `.is-hidden` (transición de opacidad 400 ms) y luego
   `hidden` + `pointer-events: none`.
4. Con `prefers-reduced-motion` se oculta sin transición.
5. El script es en línea y sin `type="module"`, para que corra aunque el bundle
   principal falle.

---

## 6. Diálogo de contacto (RF-2, RF-3)

`<dialog>` nativo — sin librería de modales, foco atrapado y `Esc` gratis.

- Un único `<ContactDialog />` en el layout. Header y botón flotante son
  `<button data-open-contact>`; un script delega el clic y llama `showModal()`.
- Al cerrar, `dialog.returnValue` no se usa; el foco vuelve al disparador
  guardado en una variable.
- Clic fuera: se compara `event.target === dialog` (el backdrop) y se cierra.
- El formulario usa `novalidate` y valida en JS para controlar los mensajes en
  español; `type="email"` y `required` quedan igual como respaldo semántico.
- Estados con un atributo `data-state` en el formulario
  (`idle | sending | success | error`), y el CSS decide qué se ve. El botón se
  deshabilita durante `sending` para evitar el doble envío. Los bloques se
  muestran con la variante de atributo de Tailwind, por ejemplo
  `hidden group-data-[state=success]:block`, sin CSS a mano.
- Si `isConfigured()` es `false`, el diálogo renderiza el bloque
  `notConfigured` con un `mailto:` al correo de `site.ts`.
- Accesibilidad: `aria-labelledby`, `aria-describedby`, el error del correo con
  `aria-live="polite"` y `aria-invalid` en el campo.

---

## 7. Logo en el footer (RF-7)

`src/assets/logo.png` es 424×163 **RGBA totalmente opaco**: blanco sobre negro
puro, alfa 255 en todos los píxeles. Sobre fondo claro sería un rectángulo negro.

Solución: footer con `bg-footer` y las utilidades que Tailwind ya trae —
`mix-blend-screen` en la imagen e `isolate` **en el `<footer>`**. Sin CSS a mano.

> **Corregido durante la implementación.** Este párrafo decía "`isolate` en su
> contenedor", y eso es falso: puesto en el `<div>` que envuelve al logo, aísla
> el blend del propio fondo del footer, `screen` mezcla contra nada y el logo
> vuelve a verse como un rectángulo negro. El `isolate` debe ir en el elemento
> que **tiene** el fondo.

`screen` sobre el fondo del footer deja el negro (`0`) exactamente en el color
del fondo — invisible — y el blanco (`1`) intacto. `isolation: isolate` acota el
blend al footer. Si el navegador no soportara `mix-blend-mode`, el peor caso es
un rectángulo negro sobre un fondo casi negro: apenas perceptible.

Se sirve con `<Image>` de `astro:assets` (`sharp@0.35.4` ya está instalado),
ancho mostrado 160 px, `densities={[1, 2]}`, `loading="lazy"`, y `alt` desde
`es.footer.logoAlt`.

---

## 8. Dependencias nuevas

Cuatro, todas como `devDependencies`, todas justificadas en la sección
"Decisiones técnicas" de `spec.md`. Ninguna añade runtime al sitio publicado.

```
pnpm add -D tailwindcss @tailwindcss/vite @astrojs/check typescript@^6 sharp
```

> **Corregido durante la implementación.** Eran cuatro dependencias y son cinco.
> Ver la nota sobre `sharp` al final de esta sección, y el pin de `typescript`:
> `pnpm add -D typescript` trae la 7.0.2 y `@astrojs/check@0.9.10` sólo acepta
> `^5 || ^6`.

`astro.config.mjs` queda así:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

Se instala a mano en lugar de con `astro add tailwind` para que el cambio en la
config quede explícito y revisable en el diff, en vez de generado.

`package.json` suma `"check": "astro check"`.

### Compatibilidad verificada

| Comprobación | Resultado |
|---|---|
| Astro / Vite del proyecto | `astro@7.3.1`, que trae `vite@^8.0.13` |
| Peer de `@tailwindcss/vite@4.3.3` | `vite: ^5.2.0 \|\| ^6 \|\| ^7 \|\| ^8` → compatible |
| `@astrojs/tailwind` | Deprecado; **no se usa**. Se usa el plugin de Vite oficial |
| `postinstall` de `@tailwindcss/oxide` | No tiene: usa binarios preconstruidos por plataforma y existe `oxide-darwin-arm64` |
| `allowBuilds` de `pnpm-workspace.yaml` | **No hay que tocarlo** por lo anterior |
| Detección de fuentes | Automática en Tailwind v4; los `.astro` se escanean sin configurar `content` |

**`sharp` hay que instalarlo explícitamente.** Estaba en el store de pnpm como
dependencia transitiva de Astro, y este plan dio por hecho que con eso bastaba.
No basta: pnpm no lo expone al proyecto si no es dependencia directa, y el build
falla con `MissingSharp` al optimizar el logo. Verificado en la práctica.

---

## 9. Contenido: anclaje a requirements.md

Cada afirmación de la página con su fuente, para revisarlo de un vistazo:

| Sección | Afirmación | Fuente |
|---|---|---|
| Hero | "Evidencia verificable de presencia física" | §1 |
| Problema | "Una planilla firmada no prueba que el guardia estuvo ahí" | §1 |
| Cómo funciona 1 | El supervisor define puntos y rondas por establecimiento | RF-B1, RF-C1 |
| Cómo funciona 2 | El guardia escanea el QR pegado en el punto | RF-D3, RF-B2 |
| Cómo funciona 3 | Se valida la ubicación y queda el registro | RF-E1, §6 |
| Capacidad | "QR + GPS: dos señales que no se falsifican por separado" | §1 |
| Capacidad | "A 3 metros del punto" — fijo, nunca "configurable" | RF-E1 |
| Capacidad | "Funciona sin conexión y sincroniza después, sin duplicados" | RF-F1, RF-F4 |
| Capacidad | "Varios establecimientos por empresa" | RF-B6, RF-G5 |
| Capacidad | "Mínimo diario configurable por ronda" | RF-C2 |
| Capacidad | "Cumplimiento del día por guardia" | RF-G1 |
| Capacidad | "Los datos de cada empresa son invisibles para las demás" | RF-A7 |
| Antifraude | Foto del QR + escaneo remoto → no hay marca, queda el intento | §6, RF-E7 |

Prohibiciones activas al redactar (§2 de `requirements.md`): push, botón de
pánico, chat, incidencias, tracking continuo, NFC, PDF/Excel, panel web, turnos,
precios, planes y fechas. La maqueta del hero es una ilustración en CSS/SVG y
lleva `aria-hidden="true"` — no se presenta como captura del producto.

---

## 10. Orden de implementación previsto

Se detalla en `tasks.md`. En grueso: configuración y copia → estilos base y
layout → loader → header, flotante y diálogo → secciones de contenido →
footer con el logo → repaso responsive, accesibilidad y `build`.

---

## Verificación end-to-end

1. `pnpm dev` en segundo plano; abrir la página.
2. **Loader:** recargar con caché deshabilitada (se ve y se va) y con caché (se
   va de inmediato). Simular fallo: en DevTools bloquear la imagen del logo y
   confirmar que el loader igual desaparece antes de 2,5 s.
3. **Diálogo:** abrir desde el header y desde el flotante; `Esc` cierra y el
   foco vuelve al botón; clic en el backdrop cierra; `Tab` no escapa del modal.
4. **Formulario:** `foo@` → mensaje de correo inválido, no envía. Correo válido
   sin comentario → envía. Con `PUBLIC_WEB3FORMS_KEY` vacía → aparece el bloque
   con el `mailto:`. Con red apagada en DevTools → estado de error con reintento.
5. **Responsive:** 320, 375, 768, 1440 y 1920 px; comprobar que
   `document.documentElement.scrollWidth === clientWidth` en cada uno.
6. **Movimiento reducido:** emular `prefers-reduced-motion: reduce` en DevTools;
   no debe haber transiciones ni la animación de escaneo.
7. **Logo:** inspeccionar el footer y confirmar que no hay rectángulo negro.
8. `pnpm check` (`astro check`) sin errores, y `pnpm build` && `pnpm preview`;
   repetir los pasos 2–4 sobre la build.
9. Releer la página contra la tabla de §9 y contra `requirements.md` §2.
