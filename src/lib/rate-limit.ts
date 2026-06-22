import { createHash } from "node:crypto";
import type { ServerEnv } from "@/lib/env-config";
import { isProductionCompatibleRateLimitConfigured, validateServerEnv } from "@/lib/env-config";
import { logContactEvent } from "@/lib/observability";

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export interface RateLimitProvider {
  check(key: string): Promise<RateLimitResult>;
}

type Bucket = {
  count: number;
  resetAt: number;
};

export class MemoryRateLimitProvider implements RateLimitProvider {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly windowSeconds: number,
    private readonly maxRequests: number
  ) {}

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = this.windowSeconds * 1000;
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    if (existing.count >= this.maxRequests) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
      };
    }

    existing.count += 1;
    return { allowed: true };
  }
}

export class UpstashRateLimitProvider implements RateLimitProvider {
  constructor(private readonly env: ServerEnv) {}

  async check(key: string): Promise<RateLimitResult> {
    if (!isProductionCompatibleRateLimitConfigured(this.env)) {
      return { allowed: false, retryAfterSeconds: 60 };
    }

    const url = `${this.env.CONTACT_RATE_LIMIT_UPSTASH_REST_URL}/pipeline`;
    const resetSeconds = this.env.CONTACT_RATE_LIMIT_WINDOW_SECONDS;
    const maxRequests = this.env.CONTACT_RATE_LIMIT_MAX_REQUESTS;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.env.CONTACT_RATE_LIMIT_UPSTASH_REST_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify([
          ["INCR", `contact:${key}`],
          ["EXPIRE", `contact:${key}`, String(resetSeconds)]
        ]),
        signal: controller.signal
      });

      if (!response.ok) {
        return { allowed: false, retryAfterSeconds: 60 };
      }

      const result = (await response.json()) as Array<{ result?: number }>;
      const count = Number(result[0]?.result || 0);

      if (count > maxRequests) {
        return { allowed: false, retryAfterSeconds: resetSeconds };
      }

      return { allowed: true };
    } catch {
      return { allowed: false, retryAfterSeconds: 60 };
    } finally {
      clearTimeout(timeout);
    }
  }
}

const memoryProviders = new Map<string, MemoryRateLimitProvider>();

export function createRateLimitProvider(env: ServerEnv): RateLimitProvider {
  if (env.CONTACT_RATE_LIMIT_PROVIDER === "upstash") {
    return new UpstashRateLimitProvider(env);
  }

  const key = `${env.CONTACT_RATE_LIMIT_WINDOW_SECONDS}:${env.CONTACT_RATE_LIMIT_MAX_REQUESTS}`;
  const existing = memoryProviders.get(key);

  if (existing) {
    return existing;
  }

  const provider = new MemoryRateLimitProvider(
    env.CONTACT_RATE_LIMIT_WINDOW_SECONDS,
    env.CONTACT_RATE_LIMIT_MAX_REQUESTS
  );
  memoryProviders.set(key, provider);
  return provider;
}

export function getRateLimitProvider() {
  const validated = validateServerEnv(process.env);

  if (!validated.ok || !validated.env) {
    const fallbackEnv: ServerEnv = {
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
    return createRateLimitProvider(fallbackEnv);
  }

  return createRateLimitProvider(validated.env);
}

export function getPrivacySafeRequestKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent")?.slice(0, 120) || "unknown-agent";
  const rawAddress = forwardedFor || realIp;
  const reliable = Boolean(rawAddress);
  const rawKey = rawAddress || "unavailable-client-address";
  const validated = validateServerEnv(process.env);
  const salt =
    validated.ok && validated.env.CONTACT_RATE_LIMIT_SALT
      ? validated.env.CONTACT_RATE_LIMIT_SALT
      : "local-contact-rate-limit";

  return {
    key: createHash("sha256").update(`${salt}:${rawKey}:${userAgent}`).digest("hex").slice(0, 32),
    reliable
  };
}

export function logUnreliableRateLimitKey(requestId: string) {
  logContactEvent({
    event: "contact_rate_limit_unavailable",
    requestId,
    status: "client_address_unavailable"
  });
}
