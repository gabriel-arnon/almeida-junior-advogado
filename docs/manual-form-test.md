# Manual Form Test

Run these checks before any preview handoff. Public Vercel previews should use `CONTACT_FORM_MODE=disabled` while there is no registered custom domain or verified sender.

## Local Mock

1. Set `CONTACT_FORM_MODE=mock` locally only.
2. Start the app.
3. Submit a valid request with non-sensitive test content.
4. Confirm the success message appears.
5. Confirm the form clears.

## Validation

1. Submit an empty form.
2. Confirm field-level errors appear.
3. Test invalid phone.
4. Test description below 30 characters.
5. Test description above 1,000 characters.
6. Confirm the privacy acknowledgment is required.

## Disabled Delivery

1. Set `CONTACT_FORM_MODE=disabled`.
2. Submit a valid request.
3. Confirm the form does not clear.
4. Confirm the error message offers WhatsApp and phone.
5. Confirm it does not claim the request was received.

## Public Preview

1. Set `CONTACT_FORM_MODE=disabled`.
2. Keep `NEXT_PUBLIC_SITE_URL` blank.
3. Confirm `/robots.txt` blocks indexing.
4. Confirm no canonical URL points to a temporary Vercel hostname.
5. Submit a valid request and confirm it fails safely with WhatsApp/phone alternatives.

## Future Real Resend Delivery

1. Register and verify the sender domain in Resend.
2. Configure Vercel environment variables after verification.
3. Submit a non-sensitive test request.
4. Confirm the internal recipient receives the email.
5. Confirm email formatting and escaped content.

## UX And Accessibility

- Test on mobile.
- Test keyboard-only form completion.
- Confirm focus reaches the first invalid field.
- Confirm loading state prevents duplicate submission.
- Confirm WhatsApp and phone fallback links work.

## Privacy Checks

- Confirm no personal data appears in the browser URL.
- Confirm no form payload appears in server logs.
- Confirm no raw provider error appears in the visitor response.
- Confirm no file upload or document collection exists.
