# Rate Limiting

The rate-limit interface is provider-based.

## Providers

`memory`

- For local development and automated tests.
- Not production-ready.
- Not reliable for serverless deployments.

`upstash`

- Uses Upstash Redis REST over HTTPS.
- Does not require a vendor package.
- Server-only credentials.
- Uses a hashed request key derived from client address, user agent, and a server-side salt.

## Upstash Variables

```env
CONTACT_RATE_LIMIT_PROVIDER=upstash
CONTACT_RATE_LIMIT_WINDOW_SECONDS=900
CONTACT_RATE_LIMIT_MAX_REQUESTS=5
CONTACT_RATE_LIMIT_SALT=
CONTACT_RATE_LIMIT_UPSTASH_REST_URL=
CONTACT_RATE_LIMIT_UPSTASH_REST_TOKEN=
```

`CONTACT_RATE_LIMIT_SALT` must be a secret value and must not be exposed to the browser.

## Client Address Policy

The app uses forwarded request headers when available and never stores raw IP addresses permanently. If reliable client-address information is unavailable, the request key falls back to a less precise hashed key and logs only a privacy-safe operational event.

## Responses

Rate-limited requests receive a generic message and a `Retry-After` header when possible. Implementation details are not exposed.
