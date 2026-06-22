# Deployment

This project is prepared for Vercel preview deployment, but it is not production-ready.

## Local Development

- Keep `NEXT_PUBLIC_INDEXING_ENABLED=false`.
- Use `CONTACT_FORM_MODE=mock` for local form testing.
- Use `CONTACT_RATE_LIMIT_PROVIDER=memory` locally.
- Do not use real secrets unless deliberately testing server-only delivery.

## Vercel Preview

- Keep indexing disabled.
- Do not use a preview hostname as the canonical production URL.
- Keep `NEXT_PUBLIC_SITE_URL` blank unless a confirmed production domain is active.
- Use `CONTACT_FORM_MODE=disabled` for public previews.
- Never rely on mock mode in preview.
- Do not enable real Resend delivery on public previews until the domain and sender are verified.

## Production Behavior

- Indexing remains disabled until explicit final approval.
- `CONTACT_FORM_MODE=mock` is prohibited.
- `CONTACT_FORM_MODE=email` requires complete Resend configuration.
- External production-compatible rate limiting is required before enabling form delivery.
- Canonical URL must come from the confirmed production domain.
- If `NEXT_PUBLIC_SITE_URL` is absent, metadata and sitemap generation fail safely without emitting a production canonical URL.

## Vercel Environment Variables

Configure secrets only in Vercel project settings. Do not commit secrets.

Current public preview variables:

```env
CONTACT_FORM_MODE=disabled
NEXT_PUBLIC_INDEXING_ENABLED=false
NEXT_PUBLIC_SITE_URL=
CONTACT_RATE_LIMIT_PROVIDER=memory
```

Future email mode variables after domain and sender verification:

```env
CONTACT_FORM_MODE=email
CONTACT_EMAIL_PROVIDER=resend
CONTACT_EMAIL_TO=grimaldoalmeida.oab@gmail.com
CONTACT_EMAIL_FROM=
CONTACT_EMAIL_REPLY_TO=
CONTACT_EMAIL_API_KEY=
CONTACT_RATE_LIMIT_PROVIDER=upstash
CONTACT_RATE_LIMIT_SALT=
CONTACT_RATE_LIMIT_UPSTASH_REST_URL=
CONTACT_RATE_LIMIT_UPSTASH_REST_TOKEN=
NEXT_PUBLIC_INDEXING_ENABLED=false
NEXT_PUBLIC_SITE_URL=
```

The intended future domain is `almeidajunioradvogado.com.br`. Treat it as a planned destination only until registration, DNS configuration, legal approval, Resend verification, canonical activation, and indexing approval are complete.

## Rollback

Set:

```env
CONTACT_FORM_MODE=disabled
```

The form will fail safely and keep WhatsApp/phone alternatives visible.

## Production Blockers

- Register `almeidajunioradvogado.com.br`.
- Configure DNS for the final domain in Vercel.
- Activate `NEXT_PUBLIC_SITE_URL=https://almeidajunioradvogado.com.br` only after the domain is live and approved.
- Resend domain verification and sender address.
- External rate-limit provider.
- Legal/privacy/content review.
- Monitoring decision.
- Explicit approval before enabling indexing.

## Steps After Domain Registration

1. Add the registered domain to Vercel and complete DNS setup.
2. Confirm the site loads on the registered domain over HTTPS.
3. Add the domain to Resend and complete all DNS verification records.
4. Create a real verified sender address on that domain; do not use a placeholder sender.
5. Configure `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_API_KEY`, and external rate-limit variables in Vercel.
6. Run the manual form test with a non-sensitive submission.
7. Set `NEXT_PUBLIC_SITE_URL` to the confirmed production URL only after canonical approval.
8. Keep `NEXT_PUBLIC_INDEXING_ENABLED=false` until final indexing approval.
