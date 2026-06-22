import { z } from "zod";
import { bankingSituations } from "@/content/services";

export const CONTACT_DESCRIPTION_MIN = 30;
export const CONTACT_DESCRIPTION_MAX = 1000;
export const APPROVED_UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content"
] as const;

const issueCategories = bankingSituations;
const phoneDigitsPattern = /^\+?[\d\s().-]{10,24}$/;

function sanitizeUtmValue(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim().replace(/[\u0000-\u001F\u007F]/g, "");
  return trimmed ? trimmed.slice(0, 100) : undefined;
}

export function normalizeBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const withoutCountry = digits.startsWith("55") ? digits.slice(2) : digits;

  if (withoutCountry.length < 10 || withoutCountry.length > 11) {
    return null;
  }

  const areaCode = withoutCountry.slice(0, 2);
  if (areaCode.startsWith("0")) {
    return null;
  }

  return `+55${withoutCountry}`;
}

export const contactFormSchema = z.object({
  fullName: z
    .string({ error: "Informe seu nome completo." })
    .trim()
    .min(3, "Informe seu nome completo.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  phone: z
    .string({ error: "Informe um telefone ou WhatsApp." })
    .trim()
    .min(10, "Informe um telefone ou WhatsApp válido.")
    .max(24, "Informe um telefone ou WhatsApp válido.")
    .regex(phoneDigitsPattern, "Informe um telefone ou WhatsApp válido.")
    .refine((value) => normalizeBrazilianPhone(value) !== null, {
      message: "Informe um telefone ou WhatsApp brasileiro válido."
    }),
  city: z
    .string({ error: "Informe sua cidade." })
    .trim()
    .min(2, "Informe sua cidade.")
    .max(80, "A cidade deve ter no máximo 80 caracteres."),
  issueCategory: z.enum(issueCategories, {
    error: "Selecione o tipo de situação bancária."
  }),
  description: z
    .string({ error: "Descreva brevemente o ocorrido." })
    .trim()
    .min(
      CONTACT_DESCRIPTION_MIN,
      `A descrição deve ter pelo menos ${CONTACT_DESCRIPTION_MIN} caracteres.`
    )
    .max(
      CONTACT_DESCRIPTION_MAX,
      `A descrição deve ter no máximo ${CONTACT_DESCRIPTION_MAX} caracteres.`
    ),
  privacyAccepted: z.literal(true, {
    error: "Confirme que leu o aviso de privacidade para continuar."
  }),
  company: z.string().trim().max(0, "Não foi possível enviar sua solicitação.").optional(),
  sourcePage: z.string().trim().max(200).optional(),
  utm: z
    .object({
      utm_source: z.preprocess(sanitizeUtmValue, z.string().max(100).optional()),
      utm_medium: z.preprocess(sanitizeUtmValue, z.string().max(100).optional()),
      utm_campaign: z.preprocess(sanitizeUtmValue, z.string().max(100).optional()),
      utm_term: z.preprocess(sanitizeUtmValue, z.string().max(100).optional()),
      utm_content: z.preprocess(sanitizeUtmValue, z.string().max(100).optional())
    })
    .partial()
    .optional()
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ValidatedContactRequest = z.output<typeof contactFormSchema> & {
  normalizedPhone: string;
};

export function validateContactRequest(input: unknown) {
  const parsed = contactFormSchema.safeParse(input);

  if (!parsed.success) {
    return parsed;
  }

  const normalizedPhone = normalizeBrazilianPhone(parsed.data.phone);
  if (!normalizedPhone) {
    return {
      success: false as const,
      error: {
        issues: [
          {
            path: ["phone"],
            message: "Informe um telefone ou WhatsApp brasileiro válido."
          }
        ]
      }
    };
  }

  return {
    success: true as const,
    data: {
      ...parsed.data,
      normalizedPhone
    }
  };
}

export type ContactApiSuccess = {
  ok: true;
  requestId: string;
  message: string;
};

export type ContactApiFailure = {
  ok: false;
  code:
    | "invalid_content_type"
    | "invalid_json"
    | "invalid_input"
    | "rate_limited"
    | "delivery_unavailable"
    | "delivery_failed"
    | "request_too_large";
  message: string;
  fieldErrors?: Partial<Record<keyof ContactFormInput, string>>;
};

export type ContactApiResponse = ContactApiSuccess | ContactApiFailure;
