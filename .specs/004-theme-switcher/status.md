Estado: implementada y verificada (T1–T11 completadas)
Última tarea completada: T11 — cierre de la spec
Siguiente: decidir sobre los puntos abiertos (ver abajo)

## Qué se hizo

Selector de tema claro / oscuro / sistema, con el sistema por defecto.

- T1 — paleta oscura y los dos bloques de remapeo en `global.css`, más
  `color-scheme`.
- T2 — token `--color-on-brand` y sustitución de `text-white` en los elementos
  sobre `bg-brand`.
- T3 — script bloqueante en `<head>` contra el destello de tema equivocado.
- T4 — el loader respeta el tema en su bloque `is:inline`.
- T5 — `border-t border-hairline` en el footer.
- T6 — textos del control en `es.ts`.
- T7 — `ThemeToggle.astro`: botón de 44×44 con `popover` nativo y
  `role="radiogroup"`.
- T8 — montado en el header, con la marca en solo icono bajo `sm`.
- T9 — `astro check` 0/0/1, `pnpm build` en verde, cero variantes `dark:`.
- T10 — verificación en navegador contra el **build**, en ambos temas y a
  320/1440 px.
- T11 — criterios marcados con resultados medidos.

Archivos: `global.css`, `Base.astro`, `Loader.astro`, `Footer.astro`,
`Header.astro`, `AppMockup.astro`, `ContactDialog.astro`, `es.ts`, los CTA, y
`ThemeToggle.astro` (nuevo).

## Desvíos respecto del plan

- **Token `--dark-brand-hover: #5CE0CE` añadido.** El plan no lo previó: mapear
  `--color-brand-dark` a la superficie habría hecho **desaparecer el botón al
  pasar el cursor**. En claro el hover oscurece; en oscuro aclara.
- **Separación valor/rol más amplia de lo planeado**: `--color-night`,
  `--color-deep`, `--color-ok-strong`, `--color-bad-strong`. Fue la única forma
  de que el footer, el mockup y el velo no siguieran al tema.
- **`[data-always-dark]` no estaba en el plan.** Nació al ver el mockup
  invertido en la primera revisión visual.

## Defectos encontrados al ejecutar, los tres de la misma familia

Tokens cuyo **rol** se invierte con el tema, usados donde hacía falta un
**valor** fijo:

1. El footer se habría vuelto turquesa (alias con `--color-brand-dark`).
2. El mockup se invertía a un teléfono claro y menta (`bg-ink`, `from-brand`).
3. El velo del diálogo se habría aclarado (`--color-ink`), igual que la sombra
   del header pegado.

Lección para el futuro: **antes de remapear un token, revisar quién lo usa como
alias.** La cadena de alias que introdujo la spec 002 fue cómoda entonces y
peligrosa ahora.

## Notas de verificación

- **Se verificó contra el `dist` servido, no contra el servidor de desarrollo.**
  Tras muchas ediciones el HMR servía CSS obsoleto y daba lecturas falsas.
- **Varias lecturas de `getComputedStyle` fueron artefactos**: con la pestaña en
  segundo plano Chrome no produce fotogramas y las transiciones de 150 ms no
  avanzan, así que los CTA parecían atascados en el color del tema anterior. Con
  las transiciones desactivadas los cuatro conmutaban perfecto, y las capturas
  —que fuerzan pintado— lo confirmaron.
- Dos greps míos dieron falsos positivos: el de `type="module"` capturó un
  `<script>` vecino, y el de las reglas del loader buscaba la forma minificada
  `[data-theme=dark]` cuando el bloque `is:inline` se sirve sin minificar.

## Puntos abiertos

1. **La landing sigue sin capturar correos**: `PUBLIC_WEB3FORMS_KEY` sin
   configurar (spec 003, RF-1 aplazado).
2. **`site.contactEmail` y el dominio siguen siendo TODO** en `config/site.ts`.
3. **CTA flotante sobre el footer**: 9.18:1 en oscuro, **1.43:1 en claro**.
4. **Objetivos táctiles del header**: CTA 40 px, marca 32 px. Diferido.
5. **Los cinco problemas prioritarios del critique siguen abiertos.** El mockup
   con barras de esqueleto, los 3 metros nunca dibujados, Capabilities plana, el
   CTA flotante en móvil y la composición de plantilla. Ninguna de las specs 003
   ni 004 los toca.
6. **Estado del control entre pestañas**: si se cambia el tema en otra pestaña,
   el control de esta muestra el estado anterior hasta recargar. No estaba en los
   criterios; se resolvería escuchando el evento `storage`.
