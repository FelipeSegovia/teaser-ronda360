# Plan: Desbloquear el camino de conversión

> Diseño técnico de [`spec.md`](./spec.md). RF-1 está aplazado: no se configura
> la clave de Web3Forms, así que este plan construye **solo el camino
> degradado** y los arreglos funcionales que sobreviven al rediseño.

---

## 1. La causa raíz: las dos ramas se hornean y se revelan por JS

`ContactDialog.astro` renderiza **ambas** ramas del diálogo con `hidden` y deja
que el script del cliente descubra cuál mostrar (`:141-145`). Verificado en
`dist/index.html`:

```
data-when-unconfigured class="mt-3 hidden"
data-when-configured   class="hidden"
id="contact-email"     → presente (1 coincidencia)
```

De ahí salen **dos de los requisitos de la spec, que son el mismo defecto**:

- **RF-4.** `emailInput?.focus()` (`:156`) apunta a `#contact-email`, que existe
  en el DOM pero está dentro de un contenedor oculto. `focus()` sobre un
  elemento no renderizado falla en silencio, el foco se queda en el diálogo y
  `showModal()` lo entrega al primer elemento accionable: el botón **"Cerrar"**.
- **RF-5.** `aria-describedby="contact-dialog-body"` (`:18`) referencia un `<p>`
  que vive dentro de `[data-when-configured]`, oculto en esta build.

**El sitio es estático y no tiene adapter** (`astro.config` sin `output` ni
`adapter`), así que `import.meta.env.PUBLIC_WEB3FORMS_KEY` se inlinea **en
build**. La rama es decidible en el frontmatter.

> **Decisión de diseño.** Decidir la rama en el frontmatter y renderizar **solo
> una**. No es una optimización: elimina la causa de RF-4 y RF-5 en vez de
> parchear sus síntomas, borra el riesgo de ids duplicados al dar título propio
> a cada rama (RF-2), y quita del HTML público un formulario que nunca se usa.
> El comportamiento observable no cambia — hoy el resultado ya es determinista
> en build; solo dejaba de serlo en apariencia.

---

## 2. Cambios archivo por archivo

### `src/lib/contact.ts` — exportar el asunto

`:71` compone `Acceso anticipado a ${site.productName}` para el envío del
formulario y esa cadena se tira en la rama degradada (RF-3). Se extrae:

```ts
/** Asunto compartido por el envío del formulario y el mailto de respaldo. */
export function contactSubject(): string {
  return `Acceso anticipado a ${site.productName}`;
}
```

`submitContact` pasa a usarla. Es el único cambio del archivo: **no se toca la
lógica de envío**, que está fuera del alcance de esta spec.

### `src/components/ContactDialog.astro` — el grueso

**Frontmatter:**

```ts
const configured = isConfigured();
const mailtoHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent(contactSubject())}`;
```

**Estructura resultante** (solo se renderiza una rama):

| Elemento | Rama sin configurar | Rama con formulario |
|---|---|---|
| `<h2 id="contact-dialog-title">` | `d.notConfiguredTitle` (RF-2) | `d.title` |
| `aria-describedby` | id del párrafo **de esa rama** (RF-5) | ídem |
| Acción primaria | `<a href={mailtoHref}>` a ancho completo (RF-3) | `<button type="submit">` |
| Acción secundaria | "Copiar correo" (RF-3) | — |
| Foco inicial | la acción primaria (RF-4) | `#contact-email` |

- La acción primaria de la rama degradada reutiliza las clases del CTA
  (`w-full rounded-xl bg-brand … text-white`) para que sea un botón de verdad,
  no un enlace de 186×18 px.
- **"Copiar correo"**: `navigator.clipboard.writeText(site.contactEmail)`, con
  respaldo por `document.execCommand('copy')` sobre un `<textarea>` efímero para
  contextos sin API de portapapeles. El resultado se anuncia en un
  `<p role="status" aria-live="polite">` con `d.copied` o `d.copyFailed`, y
  vuelve al estado inicial a los ~3 s.
- El script simplifica: desaparece la selección de rama (`:141-145`) porque ya
  no hay dos ramas. El `emailInput?.focus()` de `:202` —foco al correo inválido
  tras enviar— **se conserva**: ese sí opera sobre un input visible.

### `src/i18n/es.ts` — copy nuevo y unificado

| Clave | Antes | Después | RF |
|---|---|---|---|
| `dialog.notConfiguredTitle` | "El formulario todavía no está activo" | Título desde lo que el visitante **sí puede hacer**, p. ej. **"Escríbenos y te sumamos"** | RF-2 |
| `dialog.notConfiguredBody` | "Escríbenos directamente a" | Reescrito como cuerpo propio de la rama, sin confesar la avería | RF-2 |
| `dialog.copyEmail` | — | "Copiar correo" | RF-3 |
| `dialog.copied` | — | "Correo copiado" | RF-3 |
| `dialog.copyFailed` | — | "No se pudo copiar. Selecciónalo y cópialo a mano." | RF-3 |
| `nav.contact` | "Contáctanos" | **"Acceso anticipado"** | RF-6 |
| `nav.contactAria` | "Abrir el formulario de contacto" | **"Súmate al acceso anticipado"** — hoy promete un formulario que en esta build no existe | RF-6 |
| `finalCta.cta` | "Dejar mi correo" | **"Quiero el acceso anticipado"** | RF-6 |
| `hero.cta` | "Quiero el acceso anticipado" | sin cambio — es la raíz a la que se alinean las demás | RF-6 |

### `src/components/Header.astro` — enlace de la marca

`:8` — `href="#contenido"` → **`href="#hero"`** (RF-7).

> **Por qué `#hero` y no `/`.** La convención es que un logotipo lleve a `/`,
> pero en un sitio de una sola página eso recarga y vuelve a disparar el loader
> (hasta 2,5 s) para volver al mismo sitio. `#hero` desplaza suavemente al
> inicio con el `scroll-smooth` que ya está en `<html>`. Si la landing gana una
> segunda página, esto pasa a `/`; queda anotado en `status.md`.

`#contenido` sigue siendo el destino del *skip link* de `Base.astro`, que es su
uso correcto y no se toca.

### `src/components/FinalCta.astro` y `FloatingCta.astro` — etiquetas

Solo consumen las claves de `es.ts` cambiadas en RF-6. Sin cambios de marcado.

### Objetivos táctiles (RF-8)

| Archivo | Elemento | Antes | Cambio |
|---|---|---|---|
| `Footer.astro:41` | enlace de correo | 186×18 | `+ inline-flex min-h-11 items-center`, conservando `text-accent underline underline-offset-4` |
| `ContactDialog.astro:36` | botón "Cerrar" | 36×36 | `h-9 w-9` → `h-11 w-11`; el `<svg>` sigue en `h-5 w-5` para que el icono no crezca |

Ninguno cambia color ni mundo visual: solo crece la caja pulsable. El botón
"Cerrar" es `absolute top-4 right-4`, así que crecer 8 px no desplaza nada; sí
hay que revisar que no invada el `pr-10` del título a 320 px.

---

## 3. Fuera de este plan, y por qué

- **La rama del formulario** no se rediseña. Solo hereda el foco correcto y su
  propio `aria-describedby`. Queda sin verificar en local (RF-1 aplazado).
- **`site.contactEmail`** sigue siendo TODO. Ningún archivo escribe la dirección
  literal: footer, `mailto:` y botón de copiar la leen de `site.ts`, así que
  confirmarla es editar una línea.
- **Todo lo visual del critique** —mockup, diagrama de 3 metros, Capabilities,
  CTA flotante en móvil— es de la spec del rediseño.

### Objetivos táctiles que siguen fuera

El CTA del header (118×**40**) y la marca del header (143×**32**) también quedan
bajo 44 px, pero corregirlos obliga a crecer el `h-16` del header y con él la
composición de la cabecera. Eso es materia de la spec del rediseño.

---

## 4. Verificación

### Automática

```sh
pnpm check   # astro check
pnpm build
grep -rn "contacto@orbitalstudio" src/   # debe salir vacío salvo site.ts
grep -c 'id="contact-email"' dist/index.html   # debe ser 0 sin clave configurada
```

### En el navegador

1. Abrir el diálogo desde los **cuatro** disparadores: el título ya no se
   contradice con su cuerpo.
2. `document.activeElement` al abrir **no** es el botón "Cerrar".
3. `aria-describedby` resuelve a un elemento visible:
   `getComputedStyle(document.getElementById(d.getAttribute('aria-describedby'))).display !== 'none'`.
4. El enlace primario abre el cliente de correo **con el asunto ya escrito**.
5. "Copiar correo" copia y confirma en pantalla; probar también el respaldo
   forzando `navigator.clipboard = undefined`.
6. Medir ambos objetivos táctiles: enlace del footer y botón "Cerrar",
   `getBoundingClientRect()` con alto ≥ 44 (y ancho ≥ 44 en "Cerrar").
7. Clic en la marca del header: el héroe queda visible, sin recarga.
8. Las cuatro etiquetas comparten raíz.

### Riesgos

| Riesgo | Mitigación |
|---|---|
| `navigator.clipboard` no existe fuera de contextos seguros | Respaldo por `execCommand` y mensaje de fallo explícito |
| Hornear una sola rama deja el formulario sin probar nunca | Asumido y declarado: RF-1 aplazado. Al configurar la clave, el build cambia de rama solo |
| `min-h-11` altera el ritmo vertical del footer | Verificación visual del footer a 320 y 1440 px |
| "Cerrar" a 44 px invade el `pr-10` del título del diálogo a 320 px | Verificación visual del diálogo a 320 px; si choca, subir el `pr` del `<h2>` |
