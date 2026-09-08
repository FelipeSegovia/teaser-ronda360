/**
 * Configuración del formulario que **solo** puede vivir en servidor.
 *
 * No importar este módulo desde un `<script>` de cliente: Vite inlinearía
 * `RESEND_API_KEY` en el bundle.
 */
export function isConfigured(): boolean {
  const key = import.meta.env.RESEND_API_KEY;
  return typeof key === 'string' && key.trim().length > 0;
}
