/**
 * Punto único de edición para marca, contacto y dominio.
 * Ningún componente escribe estos valores literalmente.
 */
export const site = {
  productName: 'RondaControl',
  /** Nombre en el asunto del correo de contacto (formulario y mailto). */
  contactBrandName: 'RondaControl',
  companyName: 'Orbital Studio',

  // TODO: confirmar el correo corporativo definitivo de Orbital Studio.
  contactEmail: 'contacto@orbitalstudio.cl',

  // TODO: confirmar el dominio definitivo antes de publicar.
  url: 'https://rondacontrol.cl',
} as const;
