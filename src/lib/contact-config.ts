/**
 * Configuración del formulario que **solo** puede vivir en servidor.
 *
 * No importar este módulo desde un `<script>` de cliente: Vite inlinearía
 * `RESEND_API_KEY` en el bundle.
 */
import { site } from '../config/site';
import { isValidEmail } from './contact';

export function isConfigured(): boolean {
  const key = import.meta.env.RESEND_API_KEY;
  return typeof key === 'string' && key.trim().length > 0;
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }
  return value;
}

/**
 * Netlify inyecta env vars literales: comillas y `Name <email>` no se
 * interpretan como en un `.env`. Devolvemos siempre `Producto <correo>`
 * o `null` si no hay un email usable.
 */
export function resendFrom(): string | null {
  const raw = import.meta.env.RESEND_FROM;
  if (typeof raw !== 'string') return null;

  const unquoted = stripWrappingQuotes(raw.trim());
  if (!unquoted) return null;

  const angled = /^(.*)<([^>]+)>$/.exec(unquoted);
  const email = (angled ? angled[2] : unquoted).trim();
  if (!isValidEmail(email)) return null;

  return `${site.productName} <${email}>`;
}
