# Spec: Landing de acceso anticipado — Ronda Segura

## Objetivo

Medir cuánta gente del rubro de la seguridad privada se interesaría en **Ronda
Segura** antes de invertir en su desarrollo completo.

El instrumento es un sitio estático de una sola página, en español, que explica
el producto y captura el correo de quien quiera sumarse al acceso anticipado.
El resultado que se busca no es tráfico ni ventas: es **una lista contable de
correos de gente interesada**.

- Producto: **Ronda Segura**
- Empresa: **Orbital Studio** (marca de la casa, en el footer)
- Estado del producto: **en desarrollo**. La landing lo dice explícitamente.

## Requisitos funcionales

### RF-1 — Loader de entrada

- Se muestra mientras carga la página y desaparece al terminar.
- Desaparece **siempre**: un fallo al cargar una imagen o un script no puede
  dejarlo pegado en pantalla.
- No introduce una espera artificial perceptible para quien ya tiene la página
  en caché.

### RF-2 — Botón "Contáctanos" en dos lugares

- En el encabezado fijo, visible en todo momento.
- Como botón flotante, visible al hacer scroll.
- Ambos abren el mismo diálogo de contacto (RF-3).
- El botón flotante no tapa contenido en pantallas de 320 px de ancho.

### RF-3 — Diálogo de contacto

- Campos: **correo electrónico (requerido)** y **comentario (opcional)**.
- El correo se valida antes de enviar; un correo inválido no se envía y se
  explica el motivo.
- Estados visibles y distinguibles: inactivo, enviando, éxito, error.
- Tras un envío exitoso se agradece y se indica qué pasa después.
- Ante un error se ofrece reintentar y se muestra el correo de contacto como
  alternativa.
- Se cierra con `Esc`, con el botón de cerrar y al hacer clic fuera.
- El foco entra al diálogo al abrirlo y vuelve al botón que lo abrió al cerrarlo.

### RF-4 — Envío de los datos

- El sitio es estático: el envío va a un servicio externo de formularios.
- El proveedor **no está decidido**. La integración vive detrás de una única
  función, de modo que cambiarlo sea editar un solo archivo.
- La clave del servicio se lee de una variable de entorno, nunca escrita en el
  código fuente.
- Sin clave configurada, el formulario no rompe la página: informa que el
  contacto no está disponible y ofrece el correo directo.

### RF-5 — Contenido de la página

Secciones, en orden:

1. **Encabezado** — nombre del producto y botón "Contáctanos".
2. **Hero** — titular de acceso anticipado, subtítulo con la propuesta de valor
   (evidencia verificable de presencia física), CTA principal, y una maqueta
   abstracta de la app.
3. **El problema** — una planilla firmada o un mensaje no prueban que el
   guardia estuvo físicamente en el punto.
4. **Cómo funciona** — tres pasos: el supervisor define puntos y rondas · el
   guardia escanea el QR del punto · se valida la ubicación GPS y queda la
   evidencia.
5. **Capacidades** — QR + GPS combinados, operación sin conexión, varios
   establecimientos por empresa, mínimo diario configurable, seguimiento del
   cumplimiento, aislamiento de datos entre empresas.
6. **Antifraude** — la sección diferencial: fotografiar el QR y escanearlo desde
   otro lugar no activa la marca, y el intento queda registrado.
7. **CTA final** — invitación al acceso anticipado con el formulario a la vista.
8. **Footer oscuro** — logo de Orbital Studio, correo de contacto y año.

### RF-6 — Diseño y animaciones

- Estilo claro y profesional, con el footer oscuro.
- Animaciones de aparición al hacer scroll y transiciones suaves en botones y
  tarjetas.
- Todas las animaciones se desactivan con `prefers-reduced-motion: reduce`.
- Responsive de 320 px a 1920 px, sin scroll horizontal en ningún ancho.
- El sistema visual se expresa con utilidades de Tailwind sobre tokens de marca
  propios. Es una decisión de implementación: el resultado visual buscado no
  cambia respecto de lo descrito arriba.

### RF-7 — Logo de Orbital Studio

- El archivo disponible (`assets/logo.png`, 424×163) tiene las letras en blanco
  sobre **negro opaco**, sin transparencia.
- En el footer debe verse integrado, **nunca como un rectángulo negro** pegado
  sobre el fondo.
- Lleva texto alternativo.

## Fidelidad de contenido

Toda afirmación sobre el producto se ancla a `../../../docs/requirements.md`.
Reglas que la copia debe respetar:

- **Sin capturas de pantalla inventadas.** La app no existe todavía. Las
  maquetas son ilustraciones abstractas y no se presentan como fotos del
  producto.
- **No se menciona nada declarado fuera del MVP** (§2 de `requirements.md`): sin
  notificaciones push, botón de pánico, chat, reporte de incidencias, tracking
  continuo, NFC/Bluetooth, exportación a PDF/Excel, panel web, ni turnos.
- **No se prometen precios, planes, contratos ni fechas de lanzamiento.**
- El radio de validación es **fijo en 3 metros** (RF-E1). La línea de
  `business-context.md` que lo llama "configurado" está desactualizada; manda
  `requirements.md`.
- Lo configurable por el supervisor es el **mínimo diario de rondas** (RF-C2).
- El modo sin conexión se describe como en RF-F1…F6: la ronda completa funciona
  sin red y sincroniza al recuperar señal, sin duplicados.
- El aislamiento entre empresas (RF-A7) se puede mencionar como capacidad, sin
  afirmaciones de certificaciones ni cumplimiento normativo.

## Fuera de alcance

- Blog, casos de éxito, testimonios o logos de clientes.
- Precios, planes y comparativas con la competencia.
- Multi-idioma: sólo español.
- Analítica de terceros y cookies.
- Panel para administrar los correos capturados; se leen desde el servicio.
- Autenticación, descarga de la app o enlaces a tiendas.
- `sitemap.xml`, `robots.txt`, Open Graph avanzado y despliegue: se definen aparte.
- Frameworks de UI (React, Vue, Svelte) — regla 1 del AGENTS.md.

## Decisiones técnicas

La regla 1 de `landing/AGENTS.md` exige justificar por escrito toda dependencia
nueva. Estas son las de esta spec, y no hay más.

### Tailwind CSS v4  (`tailwindcss`, `@tailwindcss/vite`)

Capa de estilos del sitio. La regla 1 veta *frameworks de UI* —React, Vue,
Svelte—; Tailwind es un framework de CSS y no entra en esa prohibición.

Se adopta para no mantener a mano un sistema de diseño completo (escala
tipográfica, espaciado, breakpoints, estados) en un sitio que igual lo necesita.
No añade runtime en el navegador: compila a CSS estático y el HTML resultante
sigue siendo el mismo sitio estático de siempre.

Los tokens de marca se declaran en un bloque `@theme`, de modo que la paleta
vive en un solo lugar y genera a la vez las variables CSS y las utilidades.

Se usa el plugin oficial de Vite; la integración `@astrojs/tailwind` está
deprecada y no se usa.

### `@astrojs/check` + `typescript`

Herramientas de desarrollo, no llegan al sitio publicado. La regla 1 exige
TypeScript en modo `strict`, y sin comprobador ese `strict` no se verifica
nunca: `astro check` es lo que lo hace cumplir en los archivos `.astro`.

## Criterios de aceptación

- [ ] El botón "Contáctanos" abre el diálogo tanto desde el encabezado como
      desde el botón flotante.
- [ ] El formulario exige un correo válido y acepta el comentario vacío.
- [ ] Se ven los cuatro estados del envío: inactivo, enviando, éxito y error.
- [ ] Sin la variable de entorno configurada, la página carga y el diálogo
      ofrece el correo de contacto en lugar de fallar.
- [ ] El loader desaparece siempre, incluso si falla la carga de una imagen.
- [ ] El diálogo se cierra con `Esc` y devuelve el foco al botón que lo abrió.
- [ ] Todo el texto visible está en español y vive en un único archivo de copia.
- [ ] El correo de contacto y los nombres de marca están en un único archivo de
      configuración.
- [ ] `pnpm build` termina sin errores y `astro check` no reporta errores de tipos.
- [ ] Se ve correctamente a 320 px, 375 px, 768 px, 1440 px y 1920 px, sin
      scroll horizontal.
- [ ] El logo del footer no se ve como un rectángulo negro.
- [ ] Con `prefers-reduced-motion: reduce` activo no hay animaciones.
- [ ] Ninguna afirmación de la página contradice `../../../docs/requirements.md`.

## Pendiente de definición

| # | Tema | Estado |
|---|---|---|
| 1 | Correo de contacto definitivo de Orbital Studio | Se usa un marcador en el archivo de configuración hasta que se confirme. |
| 2 | Proveedor del servicio de formularios y su clave | Se elige después; RF-4 mantiene la integración aislada para que el cambio sea de un archivo. |
| 3 | Dominio y plataforma de despliegue | Fuera de alcance de esta spec. |
