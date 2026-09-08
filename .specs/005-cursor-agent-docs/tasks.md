# Tasks: Documentación de IA de la landing en Cursor

Lista ejecutable derivada de [`plan.md`](./plan.md). Se ejecutan **en orden**.
Tras cada tarea completada se actualiza `status.md`.

Referencias: [`spec.md`](./spec.md) · [`plan.md`](./plan.md)

---

## T1 — `landing/AGENTS.md` canónico

**Archivo:** `landing/AGENTS.md`

- [x] Título `# AGENTS.md`.
- [x] Cuerpo copiado de `landing/CLAUDE.md` previo al puntero: descripción,
      reglas no negociables, contexto de negocio con `@../docs/…`, SDD,
      comandos de Astro, documentación.
- [x] Ajuste mínimo: una línea que identifique el archivo como fuente canónica
      para Cursor.

**Hecho cuando:** el archivo deja de titularse `# CLAUDE.md` y conserva las
tres reglas no negociables y el flujo SDD.

---

## T2 — `landing/CLAUDE.md` puntero

**Archivo:** `landing/CLAUDE.md`

- [x] Reemplazar el cuerpo largo por un puntero corto a `AGENTS.md`.
- [x] No reproducir stack, SDD ni comandos.

**Hecho cuando:** el archivo no contiene las reglas numeradas 1–3 ni la
sección de metodología SDD.

---

## T3 — Referencias en spec 001

**Archivos:** `landing/.specs/001-landing-early-access/{spec,plan,tasks}.md`

- [x] `spec.md`: `CLAUDE.md` → `AGENTS.md` en las dos menciones de la regla 1.
- [x] `plan.md`: `landing/CLAUDE.md` → `landing/AGENTS.md`.
- [x] `tasks.md`: `landing/CLAUDE.md` → `landing/AGENTS.md`.

**Hecho cuando:** grep de `CLAUDE.md` en `001-landing-early-access/` no da
hits.

---

## T4 — Cierre

- [x] Grep en `landing/` (excluyendo `node_modules` y `.specs/005-cursor-agent-docs`) confirma que el único `CLAUDE.md` restante es el puntero.
- [x] Raíz `CLAUDE.md` y `docs/constitution.md` sin cambios.
- [x] Criterios de [`spec.md`](./spec.md) marcados.
