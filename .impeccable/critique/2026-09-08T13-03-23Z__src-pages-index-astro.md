---
target: landing de Ronda360
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:/Users/fsegovia/Documents/Projects_Freelancer/checkpoint-tracking-new/landing/src/pages/index.astro"
target_fingerprint: "sha256:a84368d6d5e70972a81fd5672ed00bfaf29ec38e3be239c982b35b39ad4e0356"
target_path: /Users/fsegovia/Documents/Projects_Freelancer/checkpoint-tracking-new/landing/src/pages/index.astro
timestamp: 2026-09-08T13-03-23Z
slug: src-pages-index-astro
---
Method: dual-agent (A: revisión de diseño · B: detector + evidencia de navegador)

# Critique — Landing de Ronda360

`src/pages/index.astro` · Modo Persuade · primera corrida

## Design Health Score

| # | Heurística | Puntaje | Problema clave |
|---|---|---|---|
| 1 | Visibilidad del estado | 2/4 | Ninguno de los 4 CTA avisa que el formulario está inactivo; se descubre tras el clic. |
| 2 | Correspondencia con el mundo real | 3/4 | Español de oficio excelente. Resta que es.ts:179 confiesa en lenguaje de sistema en el momento decisivo. |
| 3 | Control y libertad | 3/4 | <dialog> nativo correcto. Resta que el CTA flotante no se descarta y tapa texto en móvil. |
| 4 | Consistencia y estándares | 2/4 | Cuatro disparadores, tres etiquetas, una sola acción. |
| 5 | Prevención de errores | 2/4 | mailto sin ?subject=; la dirección es un TODO en site.ts:10. |
| 6 | Reconocer antes que recordar | 2/4 | "240 metros" sin reexponer el umbral de 3 m en pantalla. |
| 7 | Flexibilidad y eficiencia | n/a | Superficie Persuade de una acción. |
| 8 | Estética y minimalismo | 2/4 | Misma tarjeta para 12 ítems en tres secciones. |
| 9 | Recuperación de errores | 2/4 | El "error" dominante ofrece solo un enlace de texto. |
| 10 | Ayuda y documentación | n/a | La página entera es la explicación. |
| Total | | 18/32 | Aceptable (56%) |

## Veredicto de especificidad

Es una plantilla. El copy está escrito desde el oficio y la ingeniería es cuidadosa, pero la composición es un landing SaaS intercambiable. Cambiando es.ts por el de otro producto no habría que tocar una línea de layout.

Evidencia central: el radio de 3 metros —la razón de existir del producto— se afirma en prosa cuatro veces y se dibuja cero. Y AppMockup.astro:43-44 dibuja la lectura de distancia como dos barras grises de esqueleto de carga: el único vistazo al producto es un estado de loading.

Escaneo determinista: 16 hallazgos, 10 falsos positivos (62%).
- CLI: 4 hallazgos, los 4 falsos positivos (side-tab y border-accent-on-rounded sobre las esquinas en L del visor de cámara en AppMockup.astro:15-17; spans vacíos de 24x24 con dos bordes adyacentes, border-white, bajo aria-hidden). El detector runtime no marcó ninguno.
- Runtime: 12 hallazgos, 6 falsos positivos (nested-cards x6: el ancestro es una banda de sección a sangre, no una tarjeta).
- Reales y accionables: line-length ~85 y ~96 caracteres en AntiFraud; dark-glow de la línea de escaneo; pulsing-dot del loader (CSS real, elemento oculto al medir).

Overlays: la inyección funcionó (preflight aprobado, detect.js ejecutado, 12 hallazgos leídos), pero la pestaña se cerró al terminar: no hay overlay visible ahora. El detector se detectó a sí mismo en un hallazgo (dark-glow #ffba00 = su propio anillo de resalte), descartado del recuento.

## Impresión general

El copy hace todo el trabajo de persuasión y el diseño no lo acompaña. La página sabe qué decir y no sabe cómo mostrarlo. La mayor oportunidad no es estética sino de negocio: hoy la página no puede capturar un solo correo.

## Qué funciona

1. El copy está escrito desde el oficio, no rellenado. "Sótanos, estacionamientos y pasillos sin cobertura" demuestra conocimiento del terreno; "El rango de validación es fijo. No se amplía punto por punto" se adelanta al cinismo real del comprador.
2. Ingeniería de modos de falla poco común: tres vías de cierre del loader, revelado garantizado sin IntersectionObserver, interruptor global de movimiento reducido.
3. Fundamentos accesibles medidos: un solo h1, cero saltos de nivel en 16 encabezados, lang, meta description, alt no vacío, cero elementos interactivos sin nombre accesible (14 revisados).

## Problemas prioritarios

### [P0] La única conversión del sitio es un callejón sin salida
PUBLIC_WEB3FORMS_KEY vacía: los cuatro CTA abren un modal titulado "Súmate al acceso anticipado" cuya línea siguiente dice "El formulario todavía no está activo", con un mailto inline sin asunto de 186x18 px. La dirección es un TODO. En escritorio sin cliente de correo el clic no hace nada.
Arreglo: configurar la clave de Web3Forms (5 minutos, prioridad cero). Mientras tanto: título honesto para esa rama, dirección como botón primario, mailto con ?subject= reutilizando el asunto de contact.ts:71, acción "Copiar correo", y mover el foco a esa acción (hoy emailInput?.focus() apunta a un input oculto y el foco cae en "Cerrar").
Comando: /impeccable harden

### [P1] El mockup del héroe es un esqueleto de carga
AppMockup.astro:43-44 dibuja el contenido de la tarjeta de distancia como barras de placeholder; :53 dibuja el botón como losa sin etiqueta.
Arreglo: cadenas reales (nombre del punto, hora, "1,4 m", "Marcar punto"); subir la lectura de distancia a segundo elemento más fuerte.
Dato corregido: el chip verde tiene 5,48:1 de texto blanco sobre #047857 y cumple AA. Lo que queda bajo es el contraste del chip contra el fondo del degradado (2,22:1 a 3,16:1 según altura). El arreglo va al borde del chip, no al color del texto.
Comando: /impeccable polish

### [P1] La regla de 3 metros nunca se dibuja
El mecanismo central existe solo como prosa; "Tres metros, sin excepciones" pesa igual que "Varios establecimientos".
Arreglo: dar a AntiFraud un diagrama real (pin, círculo de 3 m a escala, punto verde dentro a 1,4 m, punto rojo fuera a 240 m, ambas distancias rotuladas en el mismo cuadro). Resuelve el fallo de memoria de trabajo y es el único activo no levantable de una plantilla.
Comando: /impeccable bolder

### [P2] Capabilities son seis tarjetas planas, y están en el lugar equivocado
Seis pares uniformes, ~700 px de texto de igual peso, justo antes del pico emocional.
Arreglo: tres pares rotulados (La evidencia / En terreno / La operación), promover el primero, y mover la sección después de AntiFraud.
Comando: /impeccable layout

### [P2] El CTA flotante tapa el texto en móvil, y cuatro disparadores llevan tres nombres
165 px a 320 px de ancho (52% de pantalla), opaco, no descartable; verificado tapando la nota al pie de AntiFraud a 320 px y el texto del mínimo diario a 390 px. Tres botones simultáneos para una acción en el viewport final.
Arreglo: bajo 640 px, píldora solo-icono o barra inferior con padding compensatorio y env(safe-area-inset-bottom); unificar etiquetas; suprimir el flotante mientras FinalCta esté en pantalla.
Comando: /impeccable adapt (y /impeccable clarify para las etiquetas)

## Banderas rojas por persona

Jordan (primerizo): el h1 dice "tu guardia" pero nada sobre el pliegue aclara si es para empresa de seguridad, administrador o guardia; el calificador está al fondo. "Contáctanos" se lee como datos de contacto y abre un registro. El mockup es aria-hidden y sin leyenda: no se sabe si es la app real.

Riley (probador): no hay formulario; tabula y cae en "Cerrar"; el correo es un TODO. "Tres metros, sin excepciones" no responde la objeción del GPS de consumo (±5-10 m), que requirements.md D-3 marca como riesgo conocido del proyecto. aria-describedby apunta a un párrafo dentro de la rama hidden.

Casey (móvil): a 320 px la marca del header envuelve a dos líneas. La página mide 6.872 px de alto a 320 px. Objetivos táctiles bajo 44 px: correo del footer 186x18, "Cerrar" 36x36, CTA del header 118x40 (los tres CTA principales sí pasan). El final es un modal que dice que el formulario no está activo.

## Observaciones menores

- AntiFraud.astro:29 pinta el paso "ok" en casi-negro; verde haría legible la reversión.
- Longitud de línea ~85 y ~96 caracteres en AntiFraud (max-w-3xl demasiado ancho para 18 px).
- ~150 px de vacío sobre el badge del héroe a 885 px de alto.
- Header.astro:8 enlaza la marca a #contenido, saltando más allá del héroe.
- La bajada "STUDIO" del logo queda ilegible sobre el navy con mix-blend-screen.
- El loader retiene hasta 2,5 s una página estática sin nada que cargar.
- Heredado de la spec 002 y abierto: CTA flotante a 1,43:1 de separación sobre el footer.
- "¿Te sirve algo así?" licencia explícitamente el "no" al pedir.

## Preguntas para considerar

1. ¿Y si el héroe fuera el diagrama, con el rechazo animándose sobre el pliegue?
2. ¿Y si el visitante pudiera intentar el fraude arrastrando el punto del guardia?
3. ¿Por qué la petición está detrás de un modal en vez de un campo inline?
4. ¿Y si la página llevara el lenguaje visual del producto (RNF-5: alto contraste, panel de instrumentos) en vez del de SaaS?
5. La página nunca muestra el pago del supervisor. El comprador es él: ¿dónde está su pantalla?
