# Spec: Desbloquear el camino de conversión

## Objetivo

Hoy la landing **no puede capturar un solo correo**, que es su única razón de
existir. `PUBLIC_WEB3FORMS_KEY` está vacía, así que los cuatro CTA abren un
diálogo que se titula "Súmate al acceso anticipado" y cuya línea siguiente dice
"El formulario todavía no está activo".

Origen: `/impeccable critique` del 2026-09-08, problema **[P0]**
(`.impeccable/critique/2026-09-08T13-03-23Z__src-pages-index-astro.md`).

Esta spec cubre **solo lo funcional y de contenido**: lo que sobrevive intacto
a un cambio de mundo visual. Los problemas visuales del critique (mockup,
diagrama de 3 metros, estructura de Capabilities, CTA flotante en móvil) van a
la spec del rediseño, no aquí.

## Requisitos funcionales

### RF-1 — El formulario operativo es la solución real `[APLAZADO]`

> **Aplazado por decisión del usuario (2026-09-08).** No se configura
> `PUBLIC_WEB3FORMS_KEY` en esta spec.
>
> **Consecuencia asumida: al terminar la 003, la landing sigue sin poder
> capturar un solo correo.** El mejor resultado posible de esta spec es que el
> callejón sin salida se convierta en un camino de correo digno — no que la
> conversión funcione. Eso solo lo desbloquea la clave.

- Con `PUBLIC_WEB3FORMS_KEY` configurada, el diálogo muestra el formulario y
  el problema desaparece.
- El resto de la spec es el camino degradado, que debe dejar de ser un callejón
  sin salida aunque la clave nunca llegue. **Ese camino es ahora el alcance
  completo de la 003.**
- La rama del formulario no se toca más allá de lo que exigen RF-4 y RF-5, y
  queda sin verificar en local por no haber clave.

### RF-2 — La rama sin configurar deja de contradecirse

- El diálogo no puede titularse "Súmate al acceso anticipado" y decir a
  continuación que el formulario no está activo.
- Esa rama lleva su propio título, redactado desde lo que el visitante **sí
  puede hacer**, no desde lo que el sistema no tiene.
- El texto nuevo vive en `src/i18n/es.ts`; ningún componente escribe literales.

### RF-3 — El correo es una acción, no un enlace suelto

- La dirección se presenta como acción primaria de ancho completo, no como
  texto subrayado de 186×18 px (medido).
- El `mailto:` lleva `?subject=` con el asunto que `contact.ts:71` ya compone
  para la rama del formulario (`Acceso anticipado a Ronda360`). Hoy esa
  afordancia se construye y se tira.
- Se ofrece una acción secundaria **"Copiar correo"**, porque en escritorio sin
  cliente de correo configurado el `mailto:` no hace absolutamente nada.
- "Copiar correo" confirma el resultado en pantalla; sin confirmación el
  visitante no sabe si funcionó.

### RF-4 — El foco aterriza en la acción, no en la salida

- Al abrir el diálogo, `emailInput?.focus()` apunta hoy a un input que está
  dentro de la rama oculta. El foco cae entonces en el botón **"Cerrar"**: lo
  primero que el producto ofrece en el momento de conversión es la salida.
- El foco inicial debe ir al primer elemento accionable de la rama que
  realmente se está mostrando.

### RF-5 — `aria-describedby` deja de apuntar a contenido oculto

- `ContactDialog.astro:18` referencia `#contact-dialog-body`, un párrafo que
  vive dentro de `[data-when-configured]`, que está `hidden` en esta rama.
- El diálogo queda descrito por un texto que describe un formulario ausente.
- Cada rama debe describirse con su propio texto visible, o no describirse.

### RF-6 — Una sola acción, un solo nombre

- Cuatro disparadores llevan tres etiquetas para la misma acción: "Contáctanos"
  (header), "Quiero el acceso anticipado" (hero), "Dejar mi correo" (final),
  "Contáctanos" (flotante). En el viewport final se ven tres a la vez.
- Se unifican alrededor de la promesa, no del mecanismo. Se admite abreviar en
  header y flotante por espacio, conservando la misma raíz.

### RF-7 — La marca del header no salta el héroe

- `Header.astro:8` enlaza el logotipo a `#contenido`, así que en un sitio de una
  sola página hacer clic en la marca salta **más allá** del héroe.
- Debe llevar al inicio de la página.

### RF-8 — Objetivos táctiles bajo el mínimo

Dos elementos quedan bajo los 44 px de alto (medidos en el navegador):

- **Enlace de correo del footer**: 186×18 px, a 320 y a 1456 px.
- **Botón "Cerrar" del diálogo**: 36×36 px. *(Incorporado al alcance por
  decisión del usuario el 2026-09-08; originalmente estaba fuera.)*

Ambos deben alcanzar los 44 px sin cambiar el mundo visual de su contenedor.

> **Sigue fuera de alcance, registrado para no perderlo.** El CTA del header
> mide 118×**40** px y la marca del header 143×**32** px en escritorio: también
> bajo el mínimo, pero tocarlos altera la altura del header (`h-16`) y con ella
> la composición, que es materia de la spec del rediseño.

## Fuera de alcance

Van a la spec del rediseño (pendiente de `init` + `new-work`):

- El mockup del héroe con barras de esqueleto de carga y el contraste del chip.
- El diagrama a escala de los 3 metros en `AntiFraud`.
- La reestructuración de `Capabilities` en tres pares y su reubicación.
- El CTA flotante que tapa texto a 320 y 390 px, y su 1,43:1 sobre el footer.
- Longitud de línea, legibilidad del logotipo en el footer, paso "ok" en verde,
  duración del loader.

También fuera:

- Resolver el TODO del dominio en `src/config/site.ts`.
- La objeción de precisión GPS que `requirements.md` D-3 marca como riesgo del
  proyecto: es decisión de producto, no de landing.

## Dependencias

Ambas quedan **aplazadas por decisión del usuario**; la spec se ejecuta igual y
las absorbe así:

- **`PUBLIC_WEB3FORMS_KEY`** — sin configurar. La rama del formulario queda sin
  verificar en local. Ver RF-1.
- **`site.contactEmail`** — `src/config/site.ts:9` sigue marcándolo como TODO.
  Mitigación: **nada en esta spec escribe la dirección literalmente**. Todo
  —enlace del footer, `mailto:` del diálogo, botón de copiar— se construye desde
  `site.contactEmail`, así que confirmarla después es editar una línea y nada
  más. El riesgo residual es que hasta entonces el camino desbloqueado lleve a
  un buzón equivocado.

## Criterios de aceptación

- [x] Ninguna rama del diálogo se contradice entre su título y su cuerpo. —
      La rama sin configurar titula **"Escríbenos y te sumamos"**; ya no anuncia
      el acceso anticipado para retractarse en la línea siguiente.
- [x] El `mailto:` de la rama sin configurar abre con el asunto ya escrito. —
      `mailto:contacto@orbitalstudio.cl?subject=Acceso%20anticipado%20a%20Ronda%20Segura`.
- [x] Existe "Copiar correo" y confirma en pantalla que copió. — Verificado con
      **clic real del sistema**: "Correo copiado" en verde. El respaldo por
      `execCommand` también, forzando `navigator.clipboard = undefined`.
- [x] Al abrir el diálogo, el foco no cae en "Cerrar" en ninguna de las dos ramas.
      — Los **cuatro** disparadores dejan el foco en "Escribir correo", a 1456 y
      a 320 px.
- [x] `aria-describedby` no referencia ningún elemento dentro de un contenedor
      `hidden`. — Resuelve a `#contact-dialog-body` con `display: block`.
- [x] Los cuatro disparadores comparten una sola raíz de etiqueta. — "Quiero el
      acceso anticipado" (hero, CTA final) y "Acceso anticipado" (header,
      flotante), con `aria-label` "Súmate al acceso anticipado".
- [x] Hacer clic en la marca del header deja el héroe visible. — De `scrollY`
      2000 a 64, sin recarga.
- [x] El enlace de correo del footer alcanza 44 px de alto. — 186×**44**.
- [x] El botón "Cerrar" del diálogo alcanza 44×44 px. — 44×44, con 44 px de
      holgura entre el texto del título y el botón a 320 px.
- [x] Todo texto nuevo sale de `src/i18n/es.ts`; cero literales en componentes.
- [x] `astro check` (0 errores, 0 avisos) y `pnpm build` en verde. — Queda **1
      hint**: la deprecación de `document.execCommand`, que es justamente el
      respaldo deliberado de RF-3.
- [x] Ningún componente contiene la dirección literal: todos la leen de
      `site.contactEmail`. — `grep` fuera de `config/site.ts`: 0 coincidencias.
- [~] Con la clave configurada, un envío de prueba llega al buzón. **No
      verificable**: RF-1 aplazado.

## Regresión introducida y asumida

**El botón del header envuelve a dos líneas a 320 px.** Unificar la etiqueta
(RF-6) llevó el botón de "Contáctanos" (118×40) a "Acceso anticipado"
(**136×60**), medido en el navegador.

- La altura del header **no cambia**: sigue en 64 px, así que no rompe la
  composición.
- Efecto lateral favorable: a 60 px de alto, ese botón ahora **supera** el
  objetivo táctil de 44 px que antes incumplía.
- No se corrigió porque toda solución pasa por estrechar el `h-16` o el
  logotipo, y la composición de la cabecera a 320 px ya estaba señalada como
  defecto preexistente y diferida a la spec del rediseño.

## Hallazgo abierto

**Dos `mailto:` con comportamiento distinto.** El del diálogo lleva `?subject=`;
el del footer, no. RF-3 solo alcanza al diálogo, así que el footer quedó fuera.
Es una línea reutilizando `contactSubject()`; pendiente de decisión.
