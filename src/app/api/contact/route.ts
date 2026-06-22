import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  contactFailureMessage,
  contactSuccessMessage,
  contactUnavailableMessage
} from "@/lib/contact-messages";
import type { ContactApiFailure, ContactApiResponse, ContactFormInput } from "@/lib/contact-schema";
import { validateContactRequest } from "@/lib/contact-schema";
import { getContactDeliveryProvider } from "@/lib/contact-delivery";
import { validateServerEnv } from "@/lib/env-config";
import { logContactEvent } from "@/lib/observability";
import {
  getPrivacySafeRequestKey,
  getRateLimitProvider,
  logUnreliableRateLimitKey
} from "@/lib/rate-limit";

const MAX_BODY_BYTES = 20 * 1024;

function jsonResponse(payload: ContactApiResponse, init?: ResponseInit) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers || {})
    }
  });
}

function fieldErrorsFromIssues(
  issues: Array<{ path: PropertyKey[]; message: string }>
): ContactApiFailure["fieldErrors"] {
  const fieldErrors: ContactApiFailure["fieldErrors"] = {};

  for (const issue of issues) {
    const path = issue.path[0];
    const field = typeof path === "string" ? (path as keyof ContactFormInput) : undefined;
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}

async function parseJsonSafely(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return { ok: false as const, reason: "request_too_large" as const };
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return { ok: false as const, reason: "request_too_large" as const };
  }

  try {
    return { ok: true as const, data: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, reason: "invalid_json" as const };
  }
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const contentType = request.headers.get("content-type") || "";
  const env = validateServerEnv(process.env);

  if (!env.ok) {
    logContactEvent({
      event: "contact_configuration_invalid",
      requestId,
      status: "environment"
    });
    return jsonResponse(
      {
        ok: false,
        code: "delivery_unavailable",
        message: contactUnavailableMessage
      },
      { status: 503 }
    );
  }

  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(
      {
        ok: false,
        code: "invalid_content_type",
        message: "Não foi possível processar a solicitação."
      },
      { status: 415 }
    );
  }

  const parsedJson = await parseJsonSafely(request);
  if (!parsedJson.ok) {
    return jsonResponse(
      {
        ok: false,
        code: parsedJson.reason,
        message:
          parsedJson.reason === "request_too_large"
            ? "A solicitação enviada é muito grande."
            : "Não foi possível processar a solicitação."
      },
      { status: parsedJson.reason === "request_too_large" ? 413 : 400 }
    );
  }

  const validated = validateContactRequest(parsedJson.data);

  if (!validated.success) {
    return jsonResponse(
      {
        ok: false,
        code: "invalid_input",
        message: "Revise os campos destacados e tente novamente.",
        fieldErrors: fieldErrorsFromIssues(validated.error.issues)
      },
      { status: 400 }
    );
  }

  if (validated.data.company) {
    return jsonResponse(
      {
        ok: false,
        code: "invalid_input",
        message: contactFailureMessage
      },
      { status: 400 }
    );
  }

  const requestKey = getPrivacySafeRequestKey(request);
  if (!requestKey.reliable) {
    logUnreliableRateLimitKey(requestId);
  }

  const rateLimit = await getRateLimitProvider().check(requestKey.key);
  if (!rateLimit.allowed) {
    logContactEvent({
      event: "contact_rate_limited",
      requestId,
      status: "limited"
    });
    return jsonResponse(
      {
        ok: false,
        code: "rate_limited",
        message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente."
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds)
        }
      }
    );
  }

  const delivery = await getContactDeliveryProvider().deliver(validated.data, requestId);

  if (!delivery.ok) {
    const unavailable = delivery.reason === "disabled" || delivery.reason === "configuration";
    return jsonResponse(
      {
        ok: false,
        code: unavailable ? "delivery_unavailable" : "delivery_failed",
        message: unavailable ? contactUnavailableMessage : contactFailureMessage
      },
      { status: unavailable ? 503 : 502 }
    );
  }

  return jsonResponse(
    {
      ok: true,
      requestId,
      message: contactSuccessMessage
    },
    { status: 202 }
  );
}
