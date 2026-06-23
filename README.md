# Almeida Junior Advogado

Landing page for Grimaldo de Almeida Junior, OAB/SP 424.479.

The project uses Next.js App Router, TypeScript strict mode, Tailwind CSS, React Hook Form, Zod, ESLint, and Playwright.

## Current Scope

Included:

- Static mobile-first landing page.
- Portuguese routes: `/`, `/politica-de-privacidade`, `/aviso-legal`.
- Typed content structure.
- Design tokens and temporary replaceable brand mark.
- Provisional Privacy Policy and Legal Notice pages.
- Metadata foundation, sitemap, robots, Open Graph, and development/preview `noindex`.
- Functional contact form with client and server validation.
- `POST /api/contact` with honeypot, request-size checks, privacy-safe throttling key, and adapter-based delivery.

Not included:

- Database or persistent lead storage.
- CRM, chatbot, analytics dispatch, file uploads, document collection, or production monitoring.

## Setup

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Contact Form Modes

`CONTACT_FORM_MODE=mock`

- Local development and automated tests only.
- Does not log personal information or the case description.
- Logs only a generated request ID and delivery status.
- Must never be used on Vercel preview or production deployments.

`CONTACT_FORM_MODE=email`

- Uses the configured email adapter.
- Current provider value: `resend`.
- Requires `CONTACT_EMAIL_PROVIDER=resend`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`, and `CONTACT_EMAIL_API_KEY`.
- Incomplete configuration fails safely and does not report success.
- Internal Resend delivery is the source of truth for success.
- Visitor confirmation email is not sent because the form does not collect visitor email.

`CONTACT_FORM_MODE=disabled`

- Rejects submission safely.
- The visitor sees a neutral error and WhatsApp/phone alternatives.

The form never reports success unless the API accepts the request through the configured delivery mode.

## Environment

Copy `.env.example` to `.env.local` when needed. Indexing is disabled by default:

```text
NEXT_PUBLIC_INDEXING_ENABLED=false
```

Local development:

```text
CONTACT_FORM_MODE=mock
```

Public Vercel previews:

```text
CONTACT_FORM_MODE=disabled
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_INDEXING_ENABLED=false
```

`NEXT_PUBLIC_SITE_URL` should stay blank until the final production domain is registered, verified, and approved. The intended future domain is `almeidajunioradvogado.com.br`, but it is documentation-only for now; temporary Vercel URLs must not become canonical URLs.

Production email configuration example:

```text
CONTACT_FORM_MODE=email
CONTACT_EMAIL_PROVIDER=resend
CONTACT_EMAIL_TO=grimaldoalmeida.oab@gmail.com
CONTACT_EMAIL_FROM=
CONTACT_EMAIL_REPLY_TO=
CONTACT_EMAIL_API_KEY=
```

Do not commit secrets.

## Privacy And Security Notes

- Submitted content is not stored in a database.
- No personal data is sent to analytics.
- The API does not include submitted personal data in URLs, query strings, or server logs.
- Visitor-controlled content is escaped before email rendering.
- The in-memory rate limiter is for development/tests only and is not production-ready for serverless deployment.
- Production-compatible rate limiting should use `CONTACT_RATE_LIMIT_PROVIDER=upstash` with server-only Upstash REST credentials.
- Visitor confirmation email is prepared behind `CONTACT_VISITOR_CONFIRMATION_ENABLED`, but the current form does not collect a visitor email address.

## Health Check

`GET /api/health` returns only coarse operational status, deployment environment, contact-delivery enabled/disabled state, production-compatible rate-limit state, and configuration validity. It does not expose email addresses, secrets, provider credentials, visitor data, stack traces, or infrastructure details.

## Deployment Docs

- [Deployment](docs/deployment.md)
- [Email Delivery](docs/email-delivery.md)
- [Rate Limiting](docs/rate-limiting.md)
- [Manual Form Test](docs/manual-form-test.md)

## Manual Test Procedure

1. Start the app with `CONTACT_FORM_MODE=mock`.
2. Submit a valid form and confirm the success message appears.
3. Submit invalid values and confirm field-level errors appear.
4. Temporarily set `CONTACT_FORM_MODE=disabled` and confirm the form fails honestly while preserving entered data.
5. Confirm WhatsApp and phone alternatives remain visible.

## Validation

```powershell
npm run lint
npm run typecheck
npm run build
npx playwright test
```

## CI

GitHub Actions runs on pushes to `main` and pull requests targeting `main`. The workflow installs dependencies with `npm ci`, installs Playwright Chromium, then runs lint, typecheck, build, and Playwright tests with `CONTACT_FORM_MODE=mock`, indexing disabled, and no email provider or Resend credentials.

Accessibility validation combines automated checks, browser inspection, Lighthouse, and manual review. Playwright alone is not treated as full contrast validation.

Do not enable production indexing until final legal, privacy, content, domain, email, analytics, and monitoring checks are complete.
