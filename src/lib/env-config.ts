import { z } from "zod";

export type ContactFormMode = "mock" | "email" | "disabled";
export type RateLimitProviderMode = "memory" | "upstash";

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  CONTACT_FORM_MODE: z.enum(["mock", "email", "disabled"]).default("disabled"),
  CONTACT_EMAIL_PROVIDER: z.enum(["resend", ""]).optional().default(""),
  CONTACT_EMAIL_TO: z.string().email().optional(),
  CONTACT_EMAIL_FROM: z.string().email().optional().or(z.literal("")),
  CONTACT_EMAIL_REPLY_TO: z.string().email().optional().or(z.literal("")),
  CONTACT_EMAIL_API_KEY: z.string().min(1).optional(),
  CONTACT_VISITOR_CONFIRMATION_ENABLED: z.enum(["true", "false"]).default("false"),
  CONTACT_RATE_LIMIT_PROVIDER: z.enum(["memory", "upstash"]).default("memory"),
  CONTACT_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(900),
  CONTACT_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(5),
  CONTACT_RATE_LIMIT_SALT: z.string().min(16).optional(),
  CONTACT_RATE_LIMIT_UPSTASH_REST_URL: z.string().url().optional(),
  CONTACT_RATE_LIMIT_UPSTASH_REST_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_INDEXING_ENABLED: z.enum(["true", "false"]).default("false")
});

export type ServerEnv = z.infer<typeof baseEnvSchema>;

export type EnvValidationResult =
  | { ok: true; env: ServerEnv }
  | { ok: false; issues: string[]; env?: Partial<ServerEnv> };

function hasEmailConfig(env: ServerEnv) {
  return Boolean(
    env.CONTACT_EMAIL_PROVIDER === "resend" &&
      env.CONTACT_EMAIL_TO &&
      env.CONTACT_EMAIL_FROM &&
      env.CONTACT_EMAIL_API_KEY
  );
}

function hasExternalRateLimitConfig(env: ServerEnv) {
  return Boolean(
    env.CONTACT_RATE_LIMIT_PROVIDER === "upstash" &&
      env.CONTACT_RATE_LIMIT_SALT &&
      env.CONTACT_RATE_LIMIT_UPSTASH_REST_URL &&
      env.CONTACT_RATE_LIMIT_UPSTASH_REST_TOKEN
  );
}

function isLocalOrTest(env: ServerEnv) {
  return !env.VERCEL_ENV && (env.NODE_ENV === "development" || env.NODE_ENV === "test");
}

export function validateServerEnv(source: NodeJS.ProcessEnv): EnvValidationResult {
  const parsed = baseEnvSchema.safeParse(source);

  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) => issue.message)
    };
  }

  const env = parsed.data;
  const issues: string[] = [];

  if (env.CONTACT_FORM_MODE === "mock" && !isLocalOrTest(env)) {
    issues.push("CONTACT_FORM_MODE=mock is allowed only in local development and automated tests.");
  }

  if (env.VERCEL_ENV === "preview" && env.CONTACT_FORM_MODE !== "disabled") {
    issues.push("Vercel preview deployments must use CONTACT_FORM_MODE=disabled.");
  }

  if (env.CONTACT_FORM_MODE === "email" && !hasEmailConfig(env)) {
    issues.push("CONTACT_FORM_MODE=email requires complete Resend email configuration.");
  }

  if (
    env.NODE_ENV === "production" &&
    env.CONTACT_FORM_MODE === "email" &&
    !hasExternalRateLimitConfig(env)
  ) {
    issues.push("Production email mode requires an external production-compatible rate limiter.");
  }

  if (
    env.NODE_ENV === "production" &&
    env.CONTACT_FORM_MODE !== "disabled" &&
    env.CONTACT_RATE_LIMIT_PROVIDER === "memory"
  ) {
    issues.push("CONTACT_RATE_LIMIT_PROVIDER=memory is not production-ready.");
  }

  if (env.CONTACT_RATE_LIMIT_PROVIDER === "upstash" && !hasExternalRateLimitConfig(env)) {
    issues.push("CONTACT_RATE_LIMIT_PROVIDER=upstash requires URL, token, and salt.");
  }

  if (issues.length) {
    return { ok: false, issues, env };
  }

  return { ok: true, env };
}

export function getContactMode(env: ServerEnv): ContactFormMode {
  return env.CONTACT_FORM_MODE;
}

export function isEmailConfigured(env: ServerEnv) {
  return hasEmailConfig(env);
}

export function isProductionCompatibleRateLimitConfigured(env: ServerEnv) {
  return hasExternalRateLimitConfig(env);
}
