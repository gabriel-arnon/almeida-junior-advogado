# Almeida Junior Advogado

## Project Rules

- Always use the singular brand name: `Almeida Junior Advogado`.
- Never use the pluralized version of the brand name.
- Confirmed lawyer information:
  - Grimaldo de Almeida Junior
  - OAB/SP 424.479
  - Phone and WhatsApp: +55 13 97410-9024
  - Email: grimaldoalmeida.oab@gmail.com
  - Instagram: @drgrimaldoalmeida
- All public copy must be in Brazilian Portuguese.
- The site is an individual lawyer landing page, not a law firm website.

## Legal Advertising Constraints

Do not add:

- Guarantees, promises, or predictions of results.
- Comparisons with other lawyers.
- Awards, credentials, committees, or academic titles that are not confirmed.
- Client testimonials about case results.
- Case-success statistics.
- Settlement or compensation amounts.
- Fee discounts.
- "Consulta gratuita", "so paga se ganhar", "contrate agora", or similar language.
- False urgency, scarcity, countdown timers, invasive pop-ups, or chatbots.
- Official OAB marks, symbols, or branding.

Every case must be described as requiring individual analysis.

## Contact Form Rules

- Keep the form limited to name, phone/WhatsApp, city, issue category, short description, privacy acknowledgment, and hidden technical fields.
- Never request CPF, RG, passwords, tokens, full account/card numbers, security codes, bank statements, document uploads, or file uploads.
- The form must never report success unless the configured delivery mode accepted the request.
- Development mock mode is allowed only in local development and automated tests.
- Vercel preview deployments must use `CONTACT_FORM_MODE=disabled` until a real domain, verified sender, and external rate limiting are configured and approved.
- Production and preview deployments must never silently fall back to mock.
- Delivery failures must preserve visitor-entered form data and offer WhatsApp/phone alternatives.
- Do not log submitted personal information or case descriptions.
- Do not send submitted content to analytics.
- Keep all email provider credentials and rate-limit credentials server-only.
- Do not import server-only configuration into client components.
- `/api/health` must expose only coarse status and never email addresses, secrets, visitor data, provider bodies, or stack traces.

## Domain And Indexing

- The intended future domain is `almeidajunioradvogado.com.br`, but it is documentation-only until registered and verified.
- Do not hardcode the future domain as active runtime configuration.
- Do not use temporary Vercel preview URLs as canonical production URLs.
- Keep `NEXT_PUBLIC_SITE_URL` blank until the confirmed production domain is active and approved.
- Keep indexing disabled until explicit final approval.

## Rate Limiting

- The in-memory rate-limit provider is for local development and tests only.
- It is not production-ready for serverless deployment.
- Future production rate limiting should use an external provider behind the same abstraction.
- Current external provider option is Upstash Redis REST over HTTPS; do not add vendor packages unless needed.
