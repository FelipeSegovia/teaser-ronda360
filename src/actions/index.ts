import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { Resend } from 'resend';

import { site } from '../config/site';
import { contactSubject, isValidEmail } from '../lib/contact';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function emailBodies(email: string, comment: string): { html: string; text: string } {
  const note = comment || '(sin comentario)';
  const origin = `Landing ${site.productName}`;
  const text = [
    `Origen: ${origin}`,
    `Correo: ${email}`,
    `Comentario: ${note}`,
  ].join('\n');
  const html = `<p><strong>Origen:</strong> ${escapeHtml(origin)}</p>
<p><strong>Correo:</strong> ${escapeHtml(email)}</p>
<p><strong>Comentario:</strong> ${escapeHtml(note)}</p>`;
  return { html, text };
}

export const server = {
  contact: {
    send: defineAction({
      input: z.object({
        email: z.string(),
        comment: z.string(),
        botcheck: z.boolean().optional(),
      }),
      handler: async ({ email, comment, botcheck }) => {
        if (botcheck) return { ok: true as const };

        const trimmedEmail = email.trim();
        const trimmedComment = comment.trim();

        if (!isValidEmail(trimmedEmail)) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'invalid-email',
          });
        }

        const apiKey = import.meta.env.RESEND_API_KEY?.trim() ?? '';
        const from = import.meta.env.RESEND_FROM?.trim() ?? '';
        if (!apiKey || !from) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'not-configured',
          });
        }

        const resend = new Resend(apiKey);
        const { html, text } = emailBodies(trimmedEmail, trimmedComment);
        const { data, error } = await resend.emails.send({
          from,
          to: [site.contactEmail],
          replyTo: trimmedEmail,
          subject: contactSubject(),
          html,
          text,
        });

        if (error) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }

        return { ok: true as const, id: data?.id };
      },
    }),
  },
};
