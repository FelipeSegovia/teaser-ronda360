/**
 * Todo el texto visible del sitio, en un solo lugar.
 *
 * Ningún componente escribe texto literal. Cada afirmación sobre el producto
 * está anclada a `../../../docs/requirements.md`; ver la tabla del §9 del
 * plan.md antes de cambiar cualquier frase de esta lista.
 */
export const es = {
  meta: {
    title: 'Ronda360 — Evidencia real de las rondas de tus guardias',
    description:
      'Control de rondas que combina el escaneo del QR del punto con la ' +
      'validación de ubicación a 3 metros. Funciona sin conexión. En ' +
      'desarrollo: súmate al acceso anticipado.',
  },

  nav: {
    skipToContent: 'Saltar al contenido',
    contact: 'Acceso anticipado',
    contactAria: 'Súmate al acceso anticipado',
  },

  loader: {
    label: 'Cargando',
  },

  hero: {
    badge: 'En desarrollo · Acceso anticipado',
    title: 'La evidencia de que tu guardia estuvo ahí',
    subtitle:
      'Ronda360 combina el escaneo del QR pegado en el punto con la ' +
      'ubicación del teléfono. Son dos señales que no se pueden falsificar ' +
      'por separado.',
    cta: 'Quiero el acceso anticipado',
    note: 'Sin compromiso. Te escribimos sólo cuando haya algo que probar.',
  },

  problem: {
    title: 'Una firma en una planilla no prueba nada',
    body:
      'Hoy la ronda deja como evidencia una planilla firmada o un mensaje al ' +
      'grupo. Ninguna de las dos demuestra que el guardia estuvo físicamente ' +
      'en el punto, ni a qué hora pasó.',
    points: [
      'La planilla se completa al final del turno, de memoria.',
      'El mensaje se puede enviar desde cualquier lugar.',
      'Cuando el cliente pregunta qué pasó a las tres de la mañana, no hay con qué responderle.',
    ],
  },

  how: {
    title: 'Cómo funciona',
    subtitle: 'Tres pasos, y el tercero es el que cambia todo.',
    steps: [
      {
        title: 'El supervisor arma la ronda',
        body:
          'Crea los puntos de control del establecimiento, captura la ' +
          'coordenada de cada uno estando en el lugar y define la secuencia. ' +
          'La app genera el código QR imprimible de cada punto.',
      },
      {
        title: 'El guardia escanea el punto',
        body:
          'Al llegar, abre la app y escanea el QR pegado en el punto. Sin ' +
          'planillas, sin llamadas: un gesto de dos segundos.',
      },
      {
        title: 'La ubicación confirma la marca',
        body:
          'La app compara la posición del teléfono con la coordenada del ' +
          'punto. Dentro de 3 metros, la marca queda registrada con su hora. ' +
          'Fuera de ese rango, no hay marca.',
      },
    ],
  },

  caps: {
    title: 'Lo que hace distinto a Ronda360',
    items: [
      {
        title: 'QR y ubicación, juntos',
        body:
          'El código prueba que tuvo el punto a la vista. La ubicación prueba ' +
          'que estaba ahí. Por separado, cualquiera de las dos se burla; ' +
          'juntas, no.',
      },
      {
        title: 'Tres metros, sin excepciones',
        body:
          'El rango de validación es fijo. No se amplía punto por punto para ' +
          'que una marca dudosa pase igual.',
      },
      {
        title: 'Funciona sin señal',
        body:
          'Sótanos, estacionamientos y pasillos sin cobertura. La ronda ' +
          'completa se ejecuta sin conexión y se sincroniza al recuperar ' +
          'señal, sin perder ni duplicar marcajes.',
      },
      {
        title: 'Varios establecimientos',
        body:
          'Un supervisor administra todos los establecimientos a su cargo y ' +
          've de un vistazo cuál cumplió y cuál no, sin entrar uno por uno.',
      },
      {
        title: 'El mínimo diario lo defines tú',
        body:
          'Cuántas veces al día debe completarse cada ronda es configuración ' +
          'del supervisor, ronda por ronda. No viene fijado de fábrica.',
      },
      {
        title: 'Cada empresa, aislada',
        body:
          'Varias empresas de seguridad usan la app en paralelo. Los ' +
          'establecimientos, guardias y marcajes de una son invisibles para ' +
          'las demás.',
      },
    ],
  },

  fraud: {
    title: 'El atajo que todos conocen, cerrado',
    body:
      'Un guardia le saca una foto al QR y lo escanea más tarde, cómodo, ' +
      'desde otro lugar. Es el fraude que define este producto.',
    steps: [
      {
        step: 'Fotografía el QR del punto',
        result: 'El código es válido',
        tone: 'ok',
      },
      {
        step: 'Lo escanea desde otro lugar',
        result: 'Está a 240 metros del punto',
        tone: 'bad',
      },
      {
        step: 'La app resuelve',
        result: 'No hay marca, y el intento queda registrado',
        tone: 'bad',
      },
    ],
    footnote:
      'Y si intenta el camino inverso —quedarse lejos y simular la ubicación ' +
      'con una app—, Ronda360 lo detecta y tampoco activa la marca.',
  },

  finalCta: {
    title: '¿Te sirve algo así?',
    body:
      'Ronda360 está en desarrollo. Si administras guardias o rondas, ' +
      'déjanos tu correo: queremos saber cuánta gente lo necesita antes de ' +
      'construirlo completo, y quienes se sumen ahora lo van a probar primero.',
    cta: 'Quiero el acceso anticipado',
  },

  dialog: {
    title: 'Súmate al acceso anticipado',
    body:
      'Déjanos tu correo y te avisamos cuando haya una versión para probar. ' +
      'Si quieres, cuéntanos cómo son tus rondas hoy.',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@empresa.cl',
    emailInvalid: 'Escribe un correo válido, por ejemplo nombre@empresa.cl.',
    commentLabel: 'Comentario',
    commentOptional: 'opcional',
    commentPlaceholder:
      'Cuántos establecimientos y guardias manejas, o lo que quieras contarnos.',
    submit: 'Enviar',
    sending: 'Enviando…',
    successTitle: 'Listo, recibimos tu correo',
    successBody:
      'Te escribimos cuando haya una versión para probar. Nada más que eso.',
    errorTitle: 'No pudimos enviar tu correo',
    errorBody: 'Puede ser un problema de conexión. Intenta de nuevo o escríbenos a',
    retry: 'Reintentar',
    notConfiguredTitle: 'Escríbenos y te sumamos',
    notConfiguredBody:
      'Déjanos tu correo y te avisamos cuando haya una versión para probar. ' +
      'Si quieres, cuéntanos cómo son tus rondas hoy. Escríbenos a',
    openMail: 'Escribir correo',
    copyEmail: 'Copiar correo',
    copied: 'Correo copiado',
    copyFailed: 'No se pudo copiar. Selecciónalo y cópialo a mano.',
    close: 'Cerrar',
    honeypotLabel: 'No completes este campo',
  },

  theme: {
    label: 'Tema de la página',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
  },

  footer: {
    tagline: 'Ronda360 es un producto de Orbital Studio.',
    contactIntro: 'Escríbenos a',
    rights: 'Todos los derechos reservados.',
    logoAlt: 'Orbital Studio',
  },
} as const;
