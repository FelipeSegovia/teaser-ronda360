# Plan: Documentación de IA de la landing en Cursor

> Diseño técnico de [`spec.md`](./spec.md). Solo archivos markdown en
> `landing/`. Sin reglas nuevas de stack ni de producto.

---

## 1. Archivos a tocar

```
landing/
├── AGENTS.md                                          (reescribir)
├── CLAUDE.md                                          (reducir a puntero)
└── .specs/
    ├── 005-cursor-agent-docs/
    │   ├── spec.md                                    (este flujo)
    │   ├── plan.md
    │   ├── tasks.md
    │   └── status.md
    └── 001-landing-early-access/
        ├── spec.md                                    (3 menciones)
        ├── plan.md                                    (1 mención)
        └── tasks.md                                   (1 mención)
```

No se tocan: `CLAUDE.md` de la raíz, `docs/*`, specs 002–004, templates,
`PRODUCT.md`, hooks.

## 2. `AGENTS.md`

Copiar el cuerpo vigente de `landing/CLAUDE.md` (el archivo largo, antes del
puntero). Cambios permitidos:

- Título `# AGENTS.md`.
- Una línea breve: este archivo es la fuente canónica para Cursor; Claude Code
  llega vía `CLAUDE.md`.

Conservar `@../docs/business-context.md` y `@../docs/requirements.md`.

## 3. `CLAUDE.md` puntero

Pocas líneas: qué es `landing/`, que las instrucciones canónicas están en
`AGENTS.md`, y que no se duplique el cuerpo aquí (Cursor carga ambos archivos).

## 4. Spec 001

Sustituciones literales:

| Archivo | Hoy | Destino |
|---|---|---|
| `001/.../spec.md` | `regla 1 del CLAUDE.md` | `regla 1 del AGENTS.md` |
| `001/.../spec.md` | `landing/CLAUDE.md` | `landing/AGENTS.md` |
| `001/.../plan.md` | `landing/CLAUDE.md` | `landing/AGENTS.md` |
| `001/.../tasks.md` | `landing/CLAUDE.md` | `landing/AGENTS.md` |

## 5. Verificación

- Grep en `landing/` (fuera de `node_modules`) de `CLAUDE.md`: solo el puntero
  y, si acaso, esta spec 005 hablando del archivo.
- `CLAUDE.md` de la raíz y `docs/constitution.md` sin diff.
