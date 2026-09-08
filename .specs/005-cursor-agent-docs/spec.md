# Spec: Documentación de IA de la landing en Cursor

## Objetivo

La landing deja de tener como fuente de instrucciones de agente el cuerpo
largo de `landing/CLAUDE.md`. La fuente de verdad pasa a ser
`landing/AGENTS.md`, con el mismo contenido normativo que hoy tiene
`landing/CLAUDE.md` (stack Astro, fidelidad de copy, idioma, SDD).
`landing/CLAUDE.md` queda como puntero corto hacia `AGENTS.md`.

El alcance es **solo `landing/`**. No se migra el `CLAUDE.md` de la raíz
(app móvil).

## Requisitos funcionales

### RF-1 — `AGENTS.md` canónico

- `landing/AGENTS.md` lleva título `# AGENTS.md`.
- El cuerpo conserva las reglas de `landing/CLAUDE.md` vigentes al momento de
  esta spec: reglas no negociables (stack, fidelidad, idioma), contexto de
  negocio con `@../docs/business-context.md` y `@../docs/requirements.md`, SDD
  en `landing/.specs/`, reglas de flujo, numeración, comandos de Astro y
  enlaces a la documentación de Astro.
- Se permite un ajuste mínimo de redacción (encabezado y, si hace falta, una
  línea que identifique el archivo como el que consume Cursor). No se añaden
  reglas nuevas de stack ni de producto.

### RF-2 — `CLAUDE.md` como puntero

- `landing/CLAUDE.md` no duplica el cuerpo largo.
- Indica que las instrucciones canónicas están en `AGENTS.md` y no las
  reproduce.

### RF-3 — Referencias de la spec 001

- `landing/.specs/001-landing-early-access/spec.md`, `plan.md` y `tasks.md`
  apuntan a `AGENTS.md` (o `landing/AGENTS.md`) donde hoy citan `CLAUDE.md` /
  `landing/CLAUDE.md`.

## Fuera de alcance

- `CLAUDE.md` de la raíz del repositorio.
- `docs/requirements.md` (la mención a `CLAUDE.md` es de la app móvil).
- `docs/constitution.md`.
- Specs `002`, `003` y `004` de la landing (no citan `CLAUDE.md`).
- `landing/.specs/_templates/`.
- `landing/PRODUCT.md`.
- `landing/.claude/settings.local.json` y `landing/.cursor/hooks.json`.
- Project Rules (`.cursor/rules/*.mdc`) y Agent Skills.

## Criterios de aceptación

- [x] `landing/AGENTS.md` es la fuente de verdad: título correcto y reglas de
      stack, SDD e idioma equivalentes a las de `CLAUDE.md` previo a esta spec.
- [x] `landing/CLAUDE.md` es un puntero corto a `AGENTS.md`, sin el cuerpo
      normativo duplicado.
- [x] Las tres menciones en `001-landing-early-access` apuntan a `AGENTS.md`.
- [x] El `CLAUDE.md` de la raíz y `docs/constitution.md` no se modifican.
