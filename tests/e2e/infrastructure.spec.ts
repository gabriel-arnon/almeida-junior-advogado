import { expect, test } from "@playwright/test";
import { createContactDeliveryProvider } from "@/lib/contact-delivery";
import type { ValidatedContactRequest } from "@/lib/contact-schema";
import { validateServerEnv, type ServerEnv } from "@/lib/env-config";
import { absoluteUrl } from "@/lib/utils";
import sitemap from "@/app/sitemap";
import { createRateLimitProvider } from "@/lib/rate-limit";

const validRequest: ValidatedContactRequest = {
  fullName: "Maria de Souza",
  phone: "(13) 97410-9024",
  normalizedPhone: "+5513974109024",
  city: "Santos",
  issueCategory: "Cobranças ou descontos indevidos",
  description:
    "Houve uma cobrança bancária não reconhecida e preciso de orientação sobre quais informações separar para análise.",
  privacyAccepted: true,
  company: "",
  sourcePage: "/",
  utm: {}
};

const baseEnv: ServerEnv = {
  NODE_ENV: "development",
  CONTACT_FORM_MODE: "disabled",
  CONTACT_EMAIL_PROVIDER: "",
  CONTACT_EMAIL_FROM: "",
  CONTACT_EMAIL_REPLY_TO: "",
  CONTACT_VISITOR_CONFIRMATION_ENABLED: "false",
  CONTACT_RATE_LIMIT_PROVIDER: "memory",
  CONTACT_RATE_LIMIT_WINDOW_SECONDS: 900,
  CONTACT_RATE_LIMIT_MAX_REQUESTS: 5,
  NEXT_PUBLIC_INDEXING_ENABLED: "false"
};

const emailEnv: ServerEnv = {
  ...baseEnv,
  CONTACT_FORM_MODE: "email",
  CONTACT_EMAIL_PROVIDER: "resend",
  CONTACT_EMAIL_TO: "grimaldoalmeida.oab@gmail.com",
  CONTACT_EMAIL_FROM: "site@example.com",
  CONTACT_EMAIL_API_KEY: "test-secret"
};

test("environment validation follows active mode rules", () => {
  expect(validateServerEnv({ ...process.env, NODE_ENV: "production", CONTACT_FORM_MODE: "mock" }).ok).toBe(
    false
  );
  expect(
    validateServerEnv({
      ...process.env,
      NODE_ENV: "production",
      CONTACT_FORM_MODE: "disabled",
      CONTACT_RATE_LIMIT_PROVIDER: "memory"
    }).ok
  ).toBe(true);
  expect(
    validateServerEnv({
      ...process.env,
      NODE_ENV: "development",
      CONTACT_FORM_MODE: "email",
      CONTACT_EMAIL_PROVIDER: "resend"
    }).ok
  ).toBe(false);
  expect(
    validateServerEnv({
      ...process.env,
      NODE_ENV: "production",
      VERCEL_ENV: "preview",
      CONTACT_FORM_MODE: "mock"
    }).ok
  ).toBe(false);
  expect(
    validateServerEnv({
      ...process.env,
      NODE_ENV: "production",
      VERCEL_ENV: "preview",
      CONTACT_FORM_MODE: "disabled"
    }).ok
  ).toBe(true);
});

test("mock delivery cannot report success in production mode", async () => {
  const provider = createContactDeliveryProvider("mock", "production");
  const result = await provider.deliver(validRequest, "test-request");

  expect(result.ok).toBe(false);
});

test("disabled delivery rejects safely", async () => {
  const provider = createContactDeliveryProvider("disabled", baseEnv);
  const result = await provider.deliver(validRequest, "test-request");

  expect(result.ok).toBe(false);
  expect(result.provider).toBe("disabled");
});

test("email mode with missing configuration fails safely", async () => {
  const provider = createContactDeliveryProvider("email", {
    ...baseEnv,
    CONTACT_FORM_MODE: "email",
    CONTACT_EMAIL_PROVIDER: "resend"
  });
  const result = await provider.deliver(validRequest, "test-request");

  expect(result.ok).toBe(false);
  expect(JSON.stringify(result)).not.toContain("test-secret");
});

test("resend success with mocked HTTP response", async () => {
  const originalFetch = globalThis.fetch;
  const calls: unknown[] = [];
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    calls.push(JSON.parse(String(init?.body)));
    return new Response(JSON.stringify({ id: "email-test" }), { status: 200 });
  }) as typeof fetch;

  try {
    const provider = createContactDeliveryProvider("email", emailEnv);
    const result = await provider.deliver(validRequest, "test-request");

    expect(result.ok).toBe(true);
    expect(calls).toHaveLength(1);
    expect(JSON.stringify(calls[0])).toContain("test-request");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("resend failure and timeout do not expose provider detail", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ message: "provider-secret-detail" }), { status: 500 })) as typeof fetch;

  try {
    const provider = createContactDeliveryProvider("email", emailEnv);
    const result = await provider.deliver(validRequest, "test-request");

    expect(result.ok).toBe(false);
    expect(JSON.stringify(result)).not.toContain("provider-secret-detail");
  } finally {
    globalThis.fetch = originalFetch;
  }

  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    await new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
    });
    return new Response(null, { status: 200 });
  }) as typeof fetch;

  try {
    const provider = createContactDeliveryProvider("email", emailEnv);
    const result = await provider.deliver(validRequest, "test-request");

    expect(result.ok).toBe(false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("external rate-limit adapter allows and limits with mocked HTTP API", async () => {
  const originalFetch = globalThis.fetch;
  const env: ServerEnv = {
    ...baseEnv,
    CONTACT_RATE_LIMIT_PROVIDER: "upstash",
    CONTACT_RATE_LIMIT_SALT: "test-rate-limit-salt",
    CONTACT_RATE_LIMIT_UPSTASH_REST_URL: "https://example-upstash.test",
    CONTACT_RATE_LIMIT_UPSTASH_REST_TOKEN: "test-token",
    CONTACT_RATE_LIMIT_MAX_REQUESTS: 1,
    CONTACT_RATE_LIMIT_WINDOW_SECONDS: 60
  };

  globalThis.fetch = (async () =>
    new Response(JSON.stringify([{ result: 1 }, { result: 1 }]), { status: 200 })) as typeof fetch;

  try {
    await expect(createRateLimitProvider(env).check("abc")).resolves.toEqual({ allowed: true });

    globalThis.fetch = (async () =>
      new Response(JSON.stringify([{ result: 2 }, { result: 1 }]), { status: 200 })) as typeof fetch;
    await expect(createRateLimitProvider(env).check("abc")).resolves.toEqual({
      allowed: false,
      retryAfterSeconds: 60
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("canonical URL uses configured public site URL", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

  try {
    expect(absoluteUrl("/aviso-legal")).toBe("https://example.com/aviso-legal");
  } finally {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = original;
    }
  }
});

test("canonical URL is omitted when no public site URL is configured", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;

  try {
    expect(absoluteUrl("/aviso-legal")).toBeUndefined();
    expect(sitemap()).toEqual([]);
  } finally {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = original;
    }
  }
});

test("health endpoint is privacy-safe", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = await response.json();
  const serialized = JSON.stringify(body);

  expect(response.status()).toBe(200);
  expect(body.status).toBe("ok");
  expect(serialized).not.toContain("grimaldoalmeida");
  expect(serialized).not.toContain("CONTACT_EMAIL_API_KEY");
  expect(serialized).not.toContain("test-secret");
});
