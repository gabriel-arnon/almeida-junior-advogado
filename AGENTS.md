# Almeida Junior Advogado

## Commands

- Use npm; `package-lock.json` is the lockfile. Install with `npm install` locally or `npm ci` in clean/CI contexts.
- Dev server: `npm run dev` opens the Next app at `http://localhost:3000`.
- Standard verification order from README/CI: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`.
- Focused Playwright runs use the same config, for example `npx playwright test tests/e2e/contact-form.spec.ts` or `npx playwright test -g "contact"`.
- Playwright global setup starts Next dev on `http://127.0.0.1:3100`, forces safe mock env values, and temporarily renames `.env.local` to `test-results/playwright.env.local.backup`; let teardown finish or restore that file if a run is interrupted.

## Structure

- Next.js App Router entrypoints live in `src/app`: `/`, `/politica-de-privacidade`, `/aviso-legal`, `/api/contact`, `/api/health`, `robots.ts`, and `sitemap.ts`.
- The home page composition is `src/app/page.tsx`; section components are under `src/components/sections`.
- Public copy and confirmed business facts are centralized in `src/content/*`, especially `src/content/site.ts`; update content there before duplicating literals in components.
- Server env validation is in `src/lib/env-config.ts`; server-only access is wrapped by `src/lib/server-env.ts` and imports `server-only`.
- Use the `@/*` path alias for `src/*` imports.

## Brand And Copy

- Always use the singular brand name `Almeida Junior Advogado`; do not pluralize it or present the site as a law firm.
- Confirmed public facts: lawyer `Grimaldo de Almeida Junior`, `OAB/SP 424.479`, phone/WhatsApp `+55 13 97410-9024`, email `grimaldoalmeida.oab@gmail.com`, Instagram `@drgrimaldoalmeida`.
- All public copy must be Brazilian Portuguese.
- Every legal matter must be framed as requiring individual analysis.

## Legal Advertising

- Do not add guarantees, result predictions, comparisons with other lawyers, unverified credentials, testimonials about case results, case-success statistics, compensation amounts, fee discounts, or OAB marks/branding.
- Avoid prohibited conversion language such as `consulta gratuita`, `so paga se ganhar`, `contrate agora`, false urgency, scarcity, countdown timers, invasive pop-ups, or chatbots.

## Contact Form

- Keep form fields limited to name, phone/WhatsApp, city, issue category, short description, privacy acknowledgment, and hidden technical fields.
- Never request CPF, RG, passwords, tokens, full account/card numbers, security codes, bank statements, document uploads, or file uploads.
- The form must not report success unless the configured delivery provider accepted the request; delivery failures must preserve entered data and show WhatsApp/phone alternatives.
- Do not log submitted personal data or case descriptions, and do not send submitted content to analytics.
- Keep email and rate-limit credentials server-only; never import `server-env.ts` into client components.
- `/api/health` must expose only coarse status, never email addresses, secrets, visitor data, provider bodies, or stack traces.

## Env And Deployment

- `.env.example` is the safe template. Local form testing uses `CONTACT_FORM_MODE=mock`; public Vercel previews must use `CONTACT_FORM_MODE=disabled`.
- `CONTACT_FORM_MODE=mock` is only valid for local development and automated tests; preview/production must never silently fall back to mock.
- Real email delivery currently means `CONTACT_FORM_MODE=email` with `CONTACT_EMAIL_PROVIDER=resend`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`, and `CONTACT_EMAIL_API_KEY`; incomplete config must fail safely.
- `almeidajunioradvogado.com.br` is a planned future domain only. Keep `NEXT_PUBLIC_SITE_URL` blank and `NEXT_PUBLIC_INDEXING_ENABLED=false` until the domain, legal/privacy/content, email, analytics, monitoring, and indexing approvals are complete.
- `CONTACT_RATE_LIMIT_PROVIDER=memory` is local/test only and not serverless-production-ready. Production email mode requires `CONTACT_RATE_LIMIT_PROVIDER=upstash` with REST URL, token, and a secret salt; the implementation intentionally uses HTTPS fetch, not an Upstash package.
