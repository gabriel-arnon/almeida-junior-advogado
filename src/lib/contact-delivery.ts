import { escapeHtml, textOnly } from "@/lib/email-sanitize";
import type { ServerEnv } from "@/lib/env-config";
import { getContactMode, isEmailConfigured, validateServerEnv } from "@/lib/env-config";
import { logContactEvent } from "@/lib/observability";
import type { ValidatedContactRequest } from "@/lib/contact-schema";

export type DeliveryResult =
  | { ok: true; provider: string; visitorConfirmationSent?: boolean }
  | { ok: false; provider: string; reason: "disabled" | "configuration" | "provider_error" };

export interface ContactDeliveryProvider {
  deliver(input: ValidatedContactRequest, requestId: string): Promise<DeliveryResult>;
}

type EmailPayload = {
  to: string;
  from: string;
  reply_to?: string;
  subject: string;
  text: string;
  html: string;
};

function makeInternalEmail(
  input: ValidatedContactRequest,
  requestId: string,
  env: ServerEnv
): EmailPayload | null {
  if (!env.CONTACT_EMAIL_TO || !env.CONTACT_EMAIL_FROM) {
    return null;
  }

  const submittedAt = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo"
  });
  const utmLines = Object.entries(input.utm || {})
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${textOnly(String(value))}`);
  const text = [
    `ID da solicitação: ${requestId}`,
    `Data e hora: ${submittedAt}`,
    `Nome: ${textOnly(input.fullName)}`,
    `Telefone/WhatsApp: ${textOnly(input.phone)}`,
    `Telefone normalizado: ${input.normalizedPhone}`,
    `Cidade: ${textOnly(input.city)}`,
    `Categoria: ${textOnly(input.issueCategory)}`,
    "Descrição:",
    textOnly(input.description),
    `Ciência do aviso de privacidade: ${input.privacyAccepted ? "sim" : "não"}`,
    `Página de origem: ${textOnly(input.sourcePage || "/")}`,
    utmLines.length ? `Campanha:\n${utmLines.join("\n")}` : "Campanha: não informada"
  ].join("\n\n");

  const html = `<div>
  <p><strong>ID da solicitação:</strong> ${escapeHtml(requestId)}</p>
  <p><strong>Data e hora:</strong> ${escapeHtml(submittedAt)}</p>
  <p><strong>Nome:</strong> ${escapeHtml(input.fullName)}</p>
  <p><strong>Telefone/WhatsApp:</strong> ${escapeHtml(input.phone)}</p>
  <p><strong>Telefone normalizado:</strong> ${escapeHtml(input.normalizedPhone)}</p>
  <p><strong>Cidade:</strong> ${escapeHtml(input.city)}</p>
  <p><strong>Categoria:</strong> ${escapeHtml(input.issueCategory)}</p>
  <p><strong>Descrição:</strong></p>
  <p>${escapeHtml(input.description).replace(/\n/g, "<br />")}</p>
  <p><strong>Ciência do aviso de privacidade:</strong> ${input.privacyAccepted ? "sim" : "não"}</p>
  <p><strong>Página de origem:</strong> ${escapeHtml(input.sourcePage || "/")}</p>
  <p><strong>Campanha:</strong> ${utmLines.length ? escapeHtml(utmLines.join(" | ")) : "não informada"}</p>
</div>`;

  return {
    to: env.CONTACT_EMAIL_TO,
    from: env.CONTACT_EMAIL_FROM,
    reply_to: env.CONTACT_EMAIL_REPLY_TO || undefined,
    subject: `Nova solicitação pelo site — ${input.issueCategory}`,
    text,
    html
  };
}

async function sendWithResend(payload: EmailPayload, env: ServerEnv) {
  if (!env.CONTACT_EMAIL_API_KEY) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CONTACT_EMAIL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    return response.ok;
  } finally {
    clearTimeout(timeout);
  }
}

class MockDeliveryProvider implements ContactDeliveryProvider {
  constructor(private readonly nodeEnv: string | undefined) {}

  async deliver(_input: ValidatedContactRequest, requestId: string): Promise<DeliveryResult> {
    if (this.nodeEnv === "production") {
      logContactEvent({
        event: "contact_configuration_invalid",
        requestId,
        status: "mock_in_production"
      });
      return { ok: false, provider: "mock", reason: "configuration" };
    }

    logContactEvent({
      event: "contact_mock_delivery",
      requestId,
      status: "accepted"
    });
    return { ok: true, provider: "mock" };
  }
}

class DisabledDeliveryProvider implements ContactDeliveryProvider {
  async deliver(_input: ValidatedContactRequest, requestId: string): Promise<DeliveryResult> {
    logContactEvent({
      event: "contact_delivery_failure",
      requestId,
      status: "disabled"
    });
    return { ok: false, provider: "disabled", reason: "disabled" };
  }
}

class EmailDeliveryProvider implements ContactDeliveryProvider {
  constructor(private readonly env: ServerEnv) {}

  async deliver(input: ValidatedContactRequest, requestId: string): Promise<DeliveryResult> {
    const internalEmail = makeInternalEmail(input, requestId, this.env);

    if (this.env.CONTACT_EMAIL_PROVIDER !== "resend" || !isEmailConfigured(this.env) || !internalEmail) {
      logContactEvent({
        event: "contact_configuration_invalid",
        requestId,
        status: "email_configuration"
      });
      return {
        ok: false,
        provider: this.env.CONTACT_EMAIL_PROVIDER || "email",
        reason: "configuration"
      };
    }

    try {
      const internalSent = await sendWithResend(internalEmail, this.env);
      if (!internalSent) {
        logContactEvent({
          event: "contact_delivery_failure",
          requestId,
          status: "provider_error"
        });
        return { ok: false, provider: "resend", reason: "provider_error" };
      }

      logContactEvent({
        event: "contact_delivery_success",
        requestId,
        status: "internal_delivered"
      });
      return { ok: true, provider: "resend", visitorConfirmationSent: false };
    } catch {
      logContactEvent({
        event: "contact_delivery_failure",
        requestId,
        status: "provider_timeout_or_error"
      });
      return { ok: false, provider: "resend", reason: "provider_error" };
    }
  }
}

export function getContactDeliveryProvider(): ContactDeliveryProvider {
  const validated = validateServerEnv(process.env);

  if (!validated.ok || !validated.env) {
    return new DisabledDeliveryProvider();
  }

  return createContactDeliveryProvider(getContactMode(validated.env), validated.env);
}

export function createContactDeliveryProvider(
  mode: string,
  envOrNodeEnv: ServerEnv | string | undefined
): ContactDeliveryProvider {
  const nodeEnv = typeof envOrNodeEnv === "string" ? envOrNodeEnv : envOrNodeEnv?.NODE_ENV;

  if (mode === "mock") {
    return new MockDeliveryProvider(nodeEnv);
  }

  if (mode === "email" && typeof envOrNodeEnv === "object") {
    return new EmailDeliveryProvider(envOrNodeEnv);
  }

  return new DisabledDeliveryProvider();
}
