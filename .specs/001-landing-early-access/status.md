Estado: done (pendiente de datos del usuario)
Última tarea completada: 19 (verificación final)
Siguiente: nada bloqueante. Ver "Pendientes del usuario" más abajo.

## Verificación ejecutada

- `astro check`: 19 archivos, 0 errores, 0 avisos.
- `pnpm build`: en verde. Salida de 88 KB; CSS de 33 KB.
- Loader: las tres vías de cierre sobreviven al build y el script queda como
  `<script>` sin `type="module"`, como exigía el plan §5.
- Diálogo: probados los cuatro estados (idle, sending, success, error), el
  rechazo de `foo@`, el cierre con Esc y la devolución del foco al botón que lo
  abrió.
- Rama sin clave configurada: verificada en el navegador; muestra el correo
  directo en lugar de un formulario roto.
- Anchos 320, 375, 485 y 1440 px sin scroll horizontal. Los únicos elementos que
  exceden el viewport son los dos blobs decorativos del hero, recortados por el
  `overflow-hidden` de la sección.
- Footer: el logo se integra sin rectángulo negro.

## Desvíos respecto del plan

1. **`sharp` hubo que instalarlo.** El plan §8 daba por hecho que bastaba con
   que estuviera en el store de pnpm. No alcanza: pnpm no lo expone al proyecto
   si no es dependencia directa, y `astro:assets` falla con `MissingSharp`. Se
   agregó `sharp` a devDependencies. Son cinco dependencias nuevas, no cuatro.

2. **`typescript` quedó fijado en `^6.0.3`.** `pnpm add -D typescript` instala la
   7.0.2 y `@astrojs/check@0.9.10` sólo acepta `^5 || ^6`.

3. **`isolate` va en el `<footer>`, no en el contenedor de la imagen.** Primero
   se puso en el `<div>` que envuelve al logo, y eso aísla el blend del propio
   fondo del footer: `mix-blend-screen` mezclaba contra nada y el logo volvía a
   verse como un rectángulo negro. El plan §7 decía "isolation: isolate en el
   contenedor"; la redacción era ambigua y en la práctica debe ir en el elemento
   que tiene el fondo.

## Pendientes del usuario

- Correo definitivo de Orbital Studio → `src/config/site.ts` (hoy
  `contacto@orbitalstudio.cl`, marcado con TODO).
- Clave del servicio de formularios → copiar `.env.example` a `.env` y completar
  `PUBLIC_WEB3FORMS_KEY`. Sin ella el diálogo muestra el correo directo.
- Dominio definitivo → `site.url`.
- Favicon: sigue el de la plantilla de Astro. Quedó fuera del alcance de la spec.
