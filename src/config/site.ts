/**
 * Punto único de edición para marca, contacto y dominio.
 * Ningún componente escribe estos valores literalmente.
 */
export const site = {
  productName: 'Ronda360',
  /** Nombre en el asunto del correo de contacto (formulario y mailto). */
  contactBrandName: 'Ronda360',
  companyName: 'Orbital Studio',

  // TODO: confirmar el correo corporativo definitivo de Orbital Studio.
  contactEmail: 'contacto@orbitalstudio.cl',

  // TODO: confirmar el dominio definitivo antes de publicar.
  url: 'https://ronda360.cl',
} as const;
