# Tasks: Landing de acceso anticipado — RondaControl

Ejecutar en orden. Tras cada tarea completada se actualiza
[`status.md`](./status.md) (regla 4 del `landing/AGENTS.md`).

Referencias: [`spec.md`](./spec.md) · [`plan.md`](./plan.md)

---

## Bloque A — Base del proyecto

1. [x] **Instalar dependencias y configurar Tailwind** (plan §8)
   - `pnpm add -D tailwindcss @tailwindcss/vite @astrojs/check typescript`
   - `astro.config.mjs`: añadir `vite: { plugins: [tailwindcss()] }`
   - `package.json`: añadir `"check": "astro check"`
   - *Verificar:* `pnpm build` termina sin errores.

2. [x] **Configuración y copia**
   - `src/config/site.ts` — `productName`, `companyName`, `contactEmail`
     (con `TODO` del correo definitivo), `url`
   - `src/i18n/es.ts` — todos los textos, con la forma acordada en plan §2
   - `.env.example` — documenta `PUBLIC_WEB3FORMS_KEY`
   - *Verificar:* `pnpm check` sin errores de tipos.

3. [x] **`src/styles/global.css`** (plan §3 y §4)
   - `@import "tailwindcss"` + bloque `@theme` con los diez tokens de marca,
     `--font-sans` y los dos `--animate-*`
   - `@utility container-page`
   - `@keyframes scan` y `@keyframes halo`
   - Reglas de `[data-reveal]` y `.is-stuck`
   - Bloque `@media (prefers-reduced-motion: reduce)` global
   - *Verificar:* una utilidad de prueba (`bg-brand`) se aplica en el navegador.

## Bloque B — Estructura y loader

4. [x] **`src/layouts/Base.astro`**
   - `<html lang="es">`, metadatos desde `es.meta`, favicon, importa `global.css`
   - Slots para el contenido, más `<Loader />`, `<Header />`,
     `<FloatingCta />`, `<ContactDialog />` y `<Footer />`

5. [x] **`src/components/Loader.astro`** (plan §5) — el punto más delicado
   - Marcado primero en el `<body>`; CSS en `<style is:inline>` en el `<head>`
   - Cierre por tres vías: `readyState === 'complete'`, evento `load`,
     y `setTimeout` de 2500 ms; la primera que dispara gana
   - Script en línea **sin** `type="module"`
   - *Verificar:* bloquear la imagen del logo en DevTools y confirmar que el
     loader igual desaparece antes de 2,5 s.

6. [x] **Script de revelado al hacer scroll**
   - `IntersectionObserver` sobre `[data-reveal]`, `threshold: .15`, `unobserve`
     tras revelar; centinela de 1 px para `.is-stuck` del header
   - Fallback: si no existe `IntersectionObserver`, todo visible de entrada

## Bloque C — Captura de contacto (el objetivo del sitio)

7. [x] **`src/lib/contact.ts`** (plan §2)
   - `isValidEmail`, `isConfigured`, `submitContact` con el contrato acordado
   - Web3Forms por defecto, clave desde `import.meta.env.PUBLIC_WEB3FORMS_KEY`
   - Normaliza todo a `ContactResult`; distingue `network` de `rejected`

8. [x] **`src/components/ContactDialog.astro`** (plan §6)
   - `<dialog>` nativo, `showModal()`, cierre por `Esc`, botón y backdrop
   - Campos: correo requerido, comentario opcional, honeypot `botcheck`
   - `data-state` con los cuatro estados; botón deshabilitado en `sending`
   - Rama `notConfigured` con `mailto:` al correo de `site.ts`
   - Accesibilidad: `aria-labelledby`, `aria-describedby`, `aria-live`,
     `aria-invalid`, y devolución del foco al disparador

9. [x] **`Header.astro` y `FloatingCta.astro`** (RF-2)
   - Ambos con `<button data-open-contact>`; un único script delega el clic
   - El flotante aparece cuando el hero sale del viewport
   - *Verificar:* el flotante no tapa contenido a 320 px.

## Bloque D — Contenido

10. [x] **`Hero.astro` + `AppMockup.astro`**
    - Maqueta abstracta en CSS/SVG con `aria-hidden="true"`; nunca presentada
      como captura del producto
    - Animaciones `animate-scan` y `animate-halo`

11. [x] **`Problem.astro`** y **`HowItWorks.astro`** (tres pasos)

12. [x] **`Capabilities.astro`** — seis tarjetas
    - Cuidado: 3 m **fijos**, y lo configurable es el mínimo diario

13. [x] **`AntiFraud.astro`** — la sección diferencial
    - Foto del QR + escaneo remoto → no hay marca y queda el intento registrado

14. [x] **`FinalCta.astro`** — formulario de acceso anticipado a la vista

15. [x] **`Footer.astro`** (plan §7)
    - Copiar `landing/assets/logo.png` a `src/assets/logo.png` (**no** mover:
      el proyecto no está bajo git)
    - `<Image>` de `astro:assets`, 160 px, `densities={[1, 2]}`, `loading="lazy"`
    - `bg-footer` + `isolate` en el contenedor + `mix-blend-screen` en la imagen
    - *Verificar:* no se ve un rectángulo negro.

16. [x] **`src/pages/index.astro`** — reemplaza la plantilla de Astro y compone
    las secciones dentro de `Base.astro`

## Bloque E — Cierre

17. [x] **Repaso de contenido contra `requirements.md`**
    - Recorrer la tabla de plan §9 afirmación por afirmación
    - Confirmar que no se coló nada de lo declarado fuera del MVP (§2):
      push, botón de pánico, chat, incidencias, tracking continuo, NFC,
      PDF/Excel, panel web, turnos, precios, planes ni fechas

18. [x] **Repaso responsive y de accesibilidad**
    - 320, 375, 768, 1440 y 1920 px; en cada uno
      `document.documentElement.scrollWidth === clientWidth`
    - Recorrido completo con `Tab`; foco visible en todo elemento interactivo
    - Emular `prefers-reduced-motion: reduce`: sin transiciones ni escaneo

19. [x] **Verificación final**
    - `pnpm check` y `pnpm build` en verde
    - `pnpm preview` y repetir las pruebas del loader y del diálogo sobre la build
    - Recorrer los 13 criterios de aceptación de `spec.md` uno por uno

---

## Pendientes del usuario (no bloquean, pero quedan con `TODO`)

- Correo de contacto definitivo de Orbital Studio → `src/config/site.ts`
- Clave del servicio de formularios → `PUBLIC_WEB3FORMS_KEY` en `.env`
- Dominio definitivo → `site.url`
