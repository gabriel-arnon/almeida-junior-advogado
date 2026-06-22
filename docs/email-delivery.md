# Email Delivery

The only real email provider currently supported is Resend.

Real Resend delivery is not enabled for the current public preview setup. Public previews should use `CONTACT_FORM_MODE=disabled` until the production domain and sender address are registered, verified, and approved.

## Configuration

```env
CONTACT_FORM_MODE=email
CONTACT_EMAIL_PROVIDER=resend
CONTACT_EMAIL_TO=grimaldoalmeida.oab@gmail.com
CONTACT_EMAIL_FROM=
CONTACT_EMAIL_REPLY_TO=
CONTACT_EMAIL_API_KEY=
```

`CONTACT_EMAIL_FROM` must be a verified sender address from a domain configured in Resend. Do not hardcode a fake sender domain.

The intended future domain is `almeidajunioradvogado.com.br`, but it must not be treated as active until registration and DNS verification are complete.

## Resend Domain Verification

1. Register the intended production domain.
2. Add the domain in Resend.
3. Configure the DNS records Resend provides.
4. Wait for verification.
5. Set `CONTACT_EMAIL_FROM` to an address on the verified domain.
6. Run a real delivery test only after verification.

## Delivery Rules

- Internal email delivery is the source of truth for form success.
- If internal delivery fails, the visitor must see a neutral failure message.
- Visitor confirmation email is not sent because the form does not collect visitor email.
- Provider response bodies are not exposed to visitors.
- API keys, headers, and provider error details are not logged.
- Visitor-controlled content is escaped before HTML email rendering.

## Manual Real-Email Test

1. Use a preview deployment with indexing disabled.
2. Configure Resend variables and external rate limiting.
3. Submit a valid non-sensitive test request.
4. Confirm the internal recipient receives the message.
5. Confirm no personal data appears in URLs, browser console errors, or public responses.

## Failure Test

Set `CONTACT_FORM_MODE=disabled` or remove one required email variable. Submit the form and confirm it does not claim the request was received.
