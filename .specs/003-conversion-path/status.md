Estado: implementada y verificada (T1–T10 completadas)
Última tarea completada: T10 — cierre de la spec
Siguiente: decidir sobre los dos puntos abiertos (ver abajo)

## Qué se hizo

- T1 — `contactSubject()` extraído en `src/lib/contact.ts`; el envío del
  formulario y el `mailto:` de respaldo comparten el asunto.
- T2 — copy nuevo y etiquetas unificadas en `src/i18n/es.ts`.
- T3 — **la tarea estructural**: la rama del diálogo se decide en el frontmatter
  y solo una llega al HTML.
- T4 — el correo como acción primaria de ancho completo, más "Copiar correo"
  con respaldo por `execCommand` y confirmación en un `role="status"`.
- T5 — el foco aterriza en la acción, no en "Cerrar".
- T6 — objetivos táctiles: enlace del footer y botón "Cerrar" a 44 px.
- T7 — la marca del header apunta a `#hero`.
- T8 — `astro check` 0 errores / 0 avisos / 1 hint, `pnpm build` en verde,
  los cuatro greps correctos.
- T9 — verificación en el navegador a 1456 y a 320 px.
- T10 — criterios marcados con resultados medidos.

Archivos tocados: `src/lib/contact.ts`, `src/i18n/es.ts`,
`src/components/ContactDialog.astro`, `Header.astro`, `Footer.astro`.
`FinalCta.astro` y `FloatingCta.astro` no necesitaron cambios: solo consumen
las claves de `es.ts`.

## Desvíos respecto del plan

- **Clave `openMail` añadida a `es.ts`**, no prevista en la tabla de copy del
  plan: la acción primaria necesitaba etiqueta. Se eligió "Escribir correo"
  (corta, cabe a cualquier ancho) en vez de la dirección, que a 320 px no entra
  en el botón.
- **T3, T4 y T5 se ejecutaron como una sola reescritura** de
  `ContactDialog.astro`: son inseparables en el mismo archivo. Cada criterio se
  verificó por separado.
- **`break-all` → `break-words`** en el correo del cuerpo. Con `break-all` la
  dirección se partía a mitad de palabra a 320 px; con `break-words` cabe
  entera en una línea.

## Notas de verificación

- **El primer intento de probar "Copiar correo" dio falso negativo.** Con
  `btn.click()` sintético fallan los dos caminos: ni `clipboard.writeText` ni
  `execCommand` tienen *user activation*, y además `document.hasFocus()` era
  `false`. Con clic real del sistema ambos funcionan.
- **Leer el portapapeles con `navigator.clipboard.readText()` congeló el
  renderer** al disparar el prompt de permisos del navegador. No volver a
  hacerlo: para verificar el copiado basta observar el mensaje de estado.
- El mensaje de estado se autolimpia a los 3 s, más rápido que el intervalo
  entre llamadas de herramienta; se capturó con un `MutationObserver`.

## Regresión introducida y asumida

- **El botón del header envuelve a dos líneas a 320 px**: de 118×40
  ("Contáctanos") a 136×60 ("Acceso anticipado"). La altura del header sigue en
  64 px y no rompe nada; de hecho ese botón ahora supera el objetivo táctil de
  44 px que antes incumplía. Corregirlo exige tocar el `h-16` o el logotipo, y
  la composición de la cabecera a 320 px ya estaba diferida a la spec del
  rediseño.

## Puntos abiertos

1. **Dos `mailto:` distintos**: el del diálogo lleva `?subject=`, el del footer
   no. RF-3 solo alcanzaba al diálogo. Es una línea reutilizando
   `contactSubject()`.
2. **`PUBLIC_WEB3FORMS_KEY` sigue sin configurar** (RF-1 aplazado). **La landing
   todavía no captura correos.** Al ponerla, el build cambia de rama solo y el
   formulario aparece sin tocar código.
3. **`site.contactEmail` sigue siendo un TODO.** Mitigado: ningún archivo
   escribe la dirección literal.

## Siguiente en el proyecto

- Spec 004: rediseño al mundo oscuro de panel de instrumentos, que **declara
  superada la spec 002** (el reparto de roles de color se calculó para fondo
  claro). Bloqueada por `init` (capturar `PRODUCT.md`) y luego `new-work`.
- Absorberá del critique: mockup real, diagrama de 3 metros, reestructuración de
  Capabilities, CTA flotante en móvil, longitud de línea, y la composición del
  header a 320 px.
