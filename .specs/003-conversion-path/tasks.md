# Tasks: Desbloquear el camino de conversión

> **Ejecutada completa el 2026-09-08.** Resultados en `status.md`.
>
> Lista ejecutable derivada de [`plan.md`](./plan.md). Se ejecutan **en orden**:
> T1 y T2 desbloquean a las demás. Tras cada tarea completada se actualiza
> `status.md`.
>
> **RF-1 está aplazado.** No se configura `PUBLIC_WEB3FORMS_KEY`. Al terminar
> esta lista la landing sigue sin capturar correos: lo que se arregla es que el
> callejón sin salida pase a ser un camino de correo digno.

---

## T1 — Extraer el asunto compartido

**Archivo:** `src/lib/contact.ts`

- [x] Añadir y exportar:
      `export function contactSubject(): string { return \`Acceso anticipado a ${site.productName}\`; }`
      con un comentario que diga que la comparten el envío y el `mailto:` de respaldo.
- [x] Sustituir el literal de `:71` (`subject:`) por la llamada a `contactSubject()`.
- [x] **No tocar** nada más del archivo: la lógica de envío está fuera de alcance.

**Hecho cuando:** `pnpm check` pasa y el asunto se compone en un solo lugar.

---

## T2 — Copy nuevo y etiquetas unificadas

**Archivo:** `src/i18n/es.ts`

- [x] `dialog.notConfiguredTitle`: pasa a **"Escríbenos y te sumamos"** — título
      desde lo que el visitante sí puede hacer (RF-2).
- [x] `dialog.notConfiguredBody`: reescribir como cuerpo propio de esa rama, sin
      confesar la avería (RF-2).
- [x] Añadir `dialog.copyEmail` = "Copiar correo".
- [x] Añadir `dialog.copied` = "Correo copiado".
- [x] Añadir `dialog.copyFailed` = "No se pudo copiar. Selecciónalo y cópialo a mano."
- [x] `nav.contact`: "Contáctanos" → **"Acceso anticipado"** (RF-6).
- [x] `nav.contactAria`: "Abrir el formulario de contacto" → **"Súmate al acceso
      anticipado"** — hoy promete un formulario que en esta build no existe (RF-6).
- [x] `finalCta.cta`: "Dejar mi correo" → **"Quiero el acceso anticipado"** (RF-6).
- [x] **No tocar** `hero.cta`: es la raíz a la que se alinean las demás.

**Hecho cuando:** los cuatro disparadores comparten raíz de etiqueta sin haber
tocado el marcado de `Header.astro`, `FinalCta.astro` ni `FloatingCta.astro`
—solo consumen estas claves— y `pnpm check` pasa.

---

## T3 — Decidir la rama en build y renderizar una sola

**Archivo:** `src/components/ContactDialog.astro` — **la tarea estructural**

- [x] En el frontmatter: `const configured = isConfigured();` y
      `const mailtoHref = \`mailto:${site.contactEmail}?subject=${encodeURIComponent(contactSubject())}\`;`
- [x] Renderizar **solo una** de las dos ramas según `configured`. Eliminar los
      `hidden` de `[data-when-unconfigured]` / `[data-when-configured]`.
- [x] Dar a cada rama su propio texto de título en el `<h2 id="contact-dialog-title">`
      (`d.notConfiguredTitle` o `d.title`) — sin duplicar el `id` (RF-2).
- [x] Apuntar `aria-describedby` al párrafo **de la rama renderizada** (RF-5).
- [x] En el script: eliminar la selección de rama de `:141-145`, que deja de
      tener sentido.
- [x] **Conservar** el `emailInput?.focus()` de `:202` — ese opera sobre un input
      visible tras un correo inválido.

**Hecho cuando:** `grep -c 'id="contact-email"' dist/index.html` devuelve **0**
sin clave configurada, y el diálogo abre mostrando la rama correcta sin parpadeo.

---

## T4 — El correo como acción, no como enlace

**Archivo:** `src/components/ContactDialog.astro` (RF-3)

- [x] Acción primaria: `<a href={mailtoHref}>` con las clases del CTA
      (`w-full rounded-xl bg-brand px-6 py-3 font-semibold text-white …`), no un
      enlace de texto.
- [x] Acción secundaria **"Copiar correo"**: `navigator.clipboard.writeText(site.contactEmail)`.
- [x] Respaldo para contextos sin API de portapapeles: `document.execCommand('copy')`
      sobre un `<textarea>` efímero.
- [x] Confirmación en un `<p role="status" aria-live="polite">` con `d.copied` o
      `d.copyFailed`, que vuelve al estado inicial a los ~3 s.
- [x] La dirección se lee **siempre** de `site.contactEmail`; cero literales.

**Hecho cuando:** el enlace abre el cliente de correo con el asunto ya escrito y
"Copiar correo" confirma en pantalla.

---

## T5 — El foco aterriza en la acción

**Archivo:** `src/components/ContactDialog.astro` (RF-4)

- [x] Al abrir, enfocar el primer elemento accionable de la rama renderizada:
      `#contact-email` si hay formulario, el enlace primario si no.
- [x] El foco **no** debe quedar en "Cerrar" en ninguna de las dos ramas.

**Hecho cuando:** con el diálogo abierto, `document.activeElement` no es el botón
de cerrar.

---

## T6 — Objetivos táctiles

- [x] `Footer.astro:41` — añadir `inline-flex min-h-11 items-center`, conservando
      `text-accent underline underline-offset-4` (RF-8).
- [x] `ContactDialog.astro:36` — botón "Cerrar": `h-9 w-9` → `h-11 w-11`,
      dejando el `<svg>` en `h-5 w-5` para que el icono no crezca (RF-8).
- [x] Revisar a 320 px que "Cerrar" a 44 px no invada el `pr-10` del título; si
      choca, subir el `pr` del `<h2>`.
- [x] **No tocar** el CTA ni la marca del header: crecerlos altera el `h-16` y es
      materia de la spec del rediseño.

**Hecho cuando:** ambos miden ≥ 44 px en el navegador.

---

## T7 — La marca del header no salta el héroe

**Archivo:** `src/components/Header.astro:8` (RF-7)

- [x] `href="#contenido"` → `href="#hero"`.
- [x] **No tocar** el *skip link* de `Base.astro`, que apunta a `#contenido` y es
      su uso correcto.

**Hecho cuando:** clic en la marca deja el héroe visible, sin recarga.

---

## T8 — Comprobaciones automáticas

- [x] `pnpm check` en verde.
- [x] `pnpm build` en verde.
- [x] `grep -rn "contacto@orbitalstudio" src/` → solo `src/config/site.ts`.
- [x] `grep -c 'id="contact-email"' dist/index.html` → `0`.

---

## T9 — Verificación en el navegador

Con `astro dev --background`, a **320 px** y a **1440 px**:

- [x] Abrir el diálogo desde los **cuatro** disparadores: el título no se
      contradice con su cuerpo en ninguno.
- [x] `document.activeElement` al abrir no es "Cerrar".
- [x] `aria-describedby` resuelve a un elemento **visible**
      (`display !== 'none'`).
- [x] El enlace primario abre el cliente de correo con el asunto ya escrito.
- [x] "Copiar correo" copia y confirma; probar el respaldo forzando
      `navigator.clipboard = undefined`.
- [x] Enlace del footer y botón "Cerrar": `getBoundingClientRect()` ≥ 44 px.
- [x] Clic en la marca del header: el héroe queda visible.
- [x] Footer sin regresión de ritmo vertical tras el `min-h-11`.
- [x] Recordar quitar el `astro-dev-toolbar` antes de juzgar capturas.

**Hecho cuando:** los nueve puntos pasan y el servidor queda detenido.

---

## T10 — Cerrar la spec

- [x] Marcar los criterios de aceptación de `spec.md` con resultados reales.
- [x] Dejar explícito que el criterio del envío de prueba **no se verificó**
      (RF-1 aplazado).
- [x] Actualizar `status.md`: qué se hizo, desvíos y lo que sigue pendiente
      (clave de Web3Forms, correo por confirmar, spec del rediseño).
