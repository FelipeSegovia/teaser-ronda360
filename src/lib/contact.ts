import { actions } from 'astro:actions';

import { site } from '../config/site';

/**
 * Envío del formulario de contacto (RF-4 de 001; RF-1 de 006).
 *
 * El cliente solo ve `ContactResult`. Resend vive en `src/actions/index.ts`.
 * Este archivo no lee `RESEND_API_KEY` para que Vite no la meta en el bundle.
 */

export type ContactInput = {
  email: string;
  comment: string;
};

export type ContactReason =
  /** El correo no pasó la validación local; no se llegó a enviar. */
  | 'invalid-email'
  /** Falta la clave del servicio: el formulario no está operativo. */
  | 'not-configured'
  /** No se pudo alcanzar el servicio (sin red, DNS, CORS, timeout). */
  | 'network'
  /** El servicio respondió, pero rechazó el envío. */
  | 'rejected';

export type ContactResult = { ok: true } | { ok: false; reason: ContactReason };

/**
 * Validación deliberadamente laxa: exige la forma mínima de un correo sin
 * pretender decidir si existe. Rechazar de más aquí es perder un interesado,
 * que es justo lo que este sitio intenta no hacer.
 */
export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 6 || trimmed.length > 254) return false;
  if (/\s/.test(trimmed)) return false;
  return /^[^@]+@[^@.]+(\.[^@.]+)+$/.test(trimmed);
}

/**
 * Asunto del contacto. Lo comparten el envío del formulario y el `mailto:` de
 * respaldo del diálogo, para que el correo llegue igual de identificado por
 * cualquiera de los dos caminos.
 */
export function contactSubject(): string {
  return `Acceso anticipado a ${site.productName}`;
}

export async function submitContact(input: ContactInput): Promise<ContactResult> {
  const email = input.email.trim();
  const comment = input.comment.trim();

  if (!isValidEmail(email)) return { ok: false, reason: 'invalid-email' };

  try {
    const { error } = await actions.contact.send({ email, comment });
    if (error) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        return { ok: false, reason: 'not-configured' };
      }
      return { ok: false, reason: 'rejected' };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
