# Publication Checklist

This project is not production-ready.

## Legal And Content

- Confirm all public copy is in Brazilian Portuguese.
- Confirm the site uses only `Almeida Junior Advogado`.
- Confirm no prohibited legal advertising claims are present.
- Confirm all credentials and professional statements are verified.
- Confirm final legal review is complete.

## Privacy And LGPD

- Confirm Privacy Policy is reviewed before publication.
- Confirm no sensitive first-contact fields are requested.
- Confirm the form does not log personal data into analytics or server logs.
- Confirm no database or persistent lead storage is required.
- Confirm retention wording is approved.
- Confirm optional visitor confirmation email is appropriate only if a visitor email field is added later.

## Contact Delivery

- Use `CONTACT_FORM_MODE=disabled` for public previews while there is no registered and verified sender domain.
- Set `CONTACT_FORM_MODE=email` only after email configuration is complete.
- Confirm `CONTACT_EMAIL_PROVIDER`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`, and `CONTACT_EMAIL_API_KEY`.
- Confirm Resend domain verification and sender DNS records.
- Confirm incomplete email configuration fails safely.
- Confirm `CONTACT_FORM_MODE=mock` is not used in production.
- Confirm WhatsApp and phone fallback copy is visible on failure.

## SEO And Indexing

- Register and verify the intended future domain, `almeidajunioradvogado.com.br`.
- Confirm the active domain before setting `NEXT_PUBLIC_SITE_URL`.
- Confirm no Vercel preview URL is used as canonical.
- Confirm Open Graph metadata.
- Confirm sitemap and robots output after canonical activation.
- Set `NEXT_PUBLIC_INDEXING_ENABLED=true` only after approval.

## Accessibility And Performance

- Run lint, typecheck, build, and Playwright.
- Inspect in browser.
- Run Lighthouse.
- Manually review keyboard navigation, visible focus, labels, heading order, touch targets, and contrast.

## Integrations

- Confirm external production-ready rate-limit provider.
- Confirm `CONTACT_RATE_LIMIT_PROVIDER=upstash` with server-only URL, token, and salt before enabling production form delivery.
- Confirm `/api/health` does not expose secrets, email addresses, visitor data, provider details, or stack traces.
- Confirm GA4/GTM IDs and event policy only if analytics are later implemented.
- Confirm production monitoring.
