# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Visitante principal de la landing: el dueño o gerente de una empresa de
seguridad** — una empresa que vende servicios de guardias a terceros.
Administra varios establecimientos de distintos clientes y necesita **probarle
a cada cliente** que sus guardias hicieron la ronda. Es quien decide y paga.

No es el usuario del producto. Dentro de la app hay dos roles, ambos empleados
o contratistas de esa empresa:

- **Supervisor** — define establecimientos, puntos de control y rondas, fija el
  mínimo diario, da de alta guardias y revisa el cumplimiento.
- **Guardia** — recorre los puntos y los marca desde el teléfono.

Escala objetivo: **sin acotar todavía**. El MVP se dirige a la vez a
operaciones chicas (un establecimiento, pocos guardias) y a empresas medianas
(varios establecimientos, decenas de guardias). Decisión abierta: acotarlo
cambiaría qué argumento encabeza la landing.

## Product Purpose

**Ronda Segura** produce evidencia verificable de presencia física de un guardia
en cada punto de control de su ronda diaria.

Hoy la ronda deja como prueba una planilla firmada o un mensaje al grupo.
Ninguna de las dos demuestra que el guardia estuvo en el punto ni a qué hora.
Cuando el cliente de la empresa de seguridad pregunta qué pasó a las tres de la
mañana, no hay con qué responderle.

Éxito para el comprador: poder responder esa pregunta con un registro que su
cliente acepte.

**Estado: el producto no existe todavía.** La landing es de captación
pre-lanzamiento y su única conversión es un correo para acceso anticipado.

## Positioning

El mecanismo que un producto vecino no podría copiar sin construir lo mismo:
**dos señales que el guardia no puede falsificar por separado.**

- El **escaneo del QR** pegado en el punto prueba que tuvo el código a la vista.
- La **ubicación GPS** del dispositivo prueba que estaba ahí en ese momento.

El fraude que el sistema existe para impedir, y que define el producto:
fotografiar el QR y escanearlo después desde otro lugar. El código es válido,
pero la distancia falla, y no hay marca.

Refuerzos del posicionamiento, todos confirmados en `../docs/requirements.md`:

- **Radio fijo de 3 metros**, no configurable por punto. No se amplía para que
  una marca dudosa pase igual.
- **Rechazo de ubicación simulada** (*mock location*), que cubre el fraude
  inverso.
- **El servidor revalida** cada marcaje: el cliente no es la autoridad.
- **Operación completa sin conexión**, porque los puntos están en sótanos,
  estacionamientos y pasillos sin cobertura.
- **Aislamiento total entre empresas**: los datos de una son invisibles para las
  demás.

## Operating Context

- El producto es una **app móvil** (Expo + React Native), con dos roles en una
  sola app. No hay panel web para el supervisor en el MVP.
- Los puntos de control son **lugares físicos con un QR impreso pegado encima**.
  El supervisor los crea capturando la coordenada GPS estando en el lugar.
- La ronda se ejecuta **a la intemperie y de noche**, frecuentemente **sin
  señal**. La app escribe primero en SQLite local y sincroniza después.
- El supervisor **razona por edificio**: "quién trabaja en este establecimiento".
  De ahí la asignación en dos niveles (establecimiento y luego ronda).
- El comprador le rinde cuentas a un tercero —su propio cliente—, así que la
  evidencia tiene que ser presentable fuera de la empresa.

## Capabilities and Constraints

Confirmadas en `../docs/requirements.md` (MVP):

- Autenticación con dos roles; un usuario tiene exactamente un rol.
- Varias empresas en paralelo, con aislamiento impuesto en el servidor.
- Varios establecimientos por empresa; puntos, rondas y guardias cuelgan de uno.
- QR imprimible por punto, con código único global, aleatorio y rotable.
- Mínimo diario configurable por ronda; nunca hardcodeado.
- Validación acumulativa al escanear: código reconocido → permiso de ubicación →
  lectura fresca → no simulada → precisión suficiente → distancia ≤ 3 m.
- Los intentos rechazados se registran y el supervisor los ve.
- Sincronización idempotente por `id` generado en el cliente.

Fuera del MVP, declarado explícitamente: notificaciones push, reporte de
incidencias, tracking continuo, NFC/Bluetooth, exportación a PDF/Excel,
facturación, marca blanca, panel web, turnos y horarios, mensajería, mapas
offline.

**Riesgo abierto que la landing afirma sin haberlo validado `[D-3]`.** Con un
radio de 3 m, un teléfono que reporta ±5–10 m de precisión no puede probar que
está dentro. `requirements.md` D-3 lo marca como riesgo real del MVP y propone
calibrar con una prueba de campo **que todavía no se ha hecho**. La landing
afirma "Tres metros, sin excepciones" sin método que lo respalde. Cualquier
trabajo futuro debe tratar esto como una afirmación pendiente de prueba, no
como un hecho establecido.

Decisiones de producto aún abiertas, registradas sin resolver: si el orden de
los puntos es obligatorio (D-1), qué cuenta como "día" para el mínimo diario
(D-2), qué pasa con un QR válido ajeno a la ronda en curso (D-4), si un punto
puede marcarse dos veces en una sesión (D-5), tolerancia de desfase de reloj
(D-7), y cómo se da de alta una empresa nueva (D-8).

## Brand Commitments

- **Producto: "Ronda Segura".** **Empresa: "Orbital Studio".** La landing es de
  Orbital Studio y promociona a Ronda Segura.
- **Todo el texto visible va en español (Chile).** Es regla no negociable del
  proyecto y debe salir exclusivamente de `src/i18n/es.ts`; cero literales en
  componentes. Identificadores y commits en inglés.
- **Ninguna afirmación sobre la funcionalidad puede contradecir**
  `../docs/business-context.md` ni `../docs/requirements.md`. El copy actual
  está anclado a esos documentos frase por frase.
- **`src/assets/logo.png`** es el logotipo de Orbital Studio: blanco sobre negro
  **opaco**, sin canal alfa. Sobre fondo claro se ve como un rectángulo negro,
  así que se integra con `mix-blend-screen` sobre fondo oscuro. Es una
  restricción real de composición, no una preferencia.
- **Voz confirmada por el copy existente**: concreta y de oficio, nombra la
  situación real ("sótanos, estacionamientos y pasillos sin cobertura", "las
  tres de la mañana") y se adelanta al cinismo del comprador en lugar de
  prometer de más. Sin superlativos ni jerga de marketing.
- Dominio previsto `rondasegura.cl` y correo `contacto@orbitalstudio.cl`, **los
  dos sin confirmar** (marcados TODO en `src/config/site.ts`).

## Evidence on Hand

**Ninguna. Esta sección existe para impedir que se invente.**

Confirmado con el usuario el 2026-09-08. Hoy no existe:

- ninguna app funcionando, ni siquiera un prototipo parcial;
- ningún cliente ni establecimiento piloto;
- ninguna prueba de campo del GPS;
- ninguna fotografía de un punto de control, un QR pegado o un guardia real;
- ningún testimonio, caso de estudio, cifra de uso, cliente nombrable ni prensa.

Lo único real disponible es `src/assets/logo.png` (logotipo de Orbital Studio) y
la documentación de producto en `../docs/`.

**Consecuencia que el trabajo futuro debe asumir:** la landing tiene que
persuadir sin una sola captura real. La ilustración del teléfono en el héroe es
inventada y está marcada `aria-hidden`; no es una captura del producto y no
puede presentarse como tal. No se fabrican testimonios, logos de clientes,
métricas, número de empresas usuarias ni capturas de pantalla.

`public/favicon.svg` sigue siendo el de la plantilla de Astro: no hay identidad
visual propia todavía.

## Product Principles

1. **La evidencia es el producto.** Todo lo que se afirme tiene que poder
   sostenerse ante el cliente del comprador, que es quien de verdad pregunta.
2. **No prometer lo que no se puede probar.** Vale tanto para el producto —el
   radio de 3 m sigue sin validación de campo— como para la landing, que hoy no
   tiene ninguna evidencia real que mostrar.
3. **Hablarle al oficio, no al mercado.** La credibilidad de este producto viene
   de demostrar que se conoce el terreno: los sótanos sin señal, la planilla que
   se llena de memoria al final del turno.
4. **La regla no se ablanda.** El radio fijo y el aislamiento entre empresas no
   son features configurables: son la razón de que la evidencia valga algo.
5. **Funciona donde no hay red.** Cualquier promesa que dependa de conexión
   contradice el lugar donde el producto se usa.

## Accessibility & Inclusion

- **WCAG AA es el estándar de trabajo vigente** en la landing y se verifica
  midiendo, no a ojo: las specs 002 y 003 comprobaron contrastes de texto y
  objetivos táctiles de 44 px en el navegador.
- Todo el texto visible en español, exclusivamente desde `src/i18n/es.ts`.
- La landing respeta `prefers-reduced-motion` con un interruptor global, y
  garantiza que el contenido nunca queda invisible si falla
  `IntersectionObserver`.
- **Objetivos táctiles pendientes**, registrados y no resueltos: el CTA del
  header (118×40) y la marca del header (143×32) siguen bajo los 44 px.
  Corregirlos exige rehacer la composición de la cabecera.
- La app (fuera del alcance de esta landing) exige por RNF-5 alto contraste y
  objetivos táctiles amplios, porque se usa a la intemperie y de noche.
