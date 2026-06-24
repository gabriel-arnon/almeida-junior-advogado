"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { bankingSituations } from "@/content/services";
import { siteConfig } from "@/content/site";
import {
  APPROVED_UTM_FIELDS,
  contactFormSchema,
  type ContactApiResponse,
  type ContactFormInput
} from "@/lib/contact-schema";
import { contactFailureMessage } from "@/lib/contact-messages";

type FormValues = {
  fullName: string;
  phone: string;
  city: string;
  issueCategory: string;
  description: string;
  privacyAccepted: boolean;
  company: string;
  sourcePage?: string;
  utm?: Partial<Record<(typeof APPROVED_UTM_FIELDS)[number], string>>;
};

type SubmitState =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

function collectUtmFields() {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  return APPROVED_UTM_FIELDS.reduce<NonNullable<FormValues["utm"]>>((acc, field) => {
    const value = params.get(field)?.trim();
    if (value) {
      acc[field] = value.slice(0, 100);
    }
    return acc;
  }, {});
}

function fieldErrorId(field: keyof FormValues) {
  return `${field}-error`;
}

export function VisualContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "Preencha os campos para solicitar contato. O envio é seguro e não solicita documentos."
  });
  const submittedOnceRef = useRef(false);

  const defaultValues = useMemo<FormValues>(
    () => ({
      fullName: "",
      phone: "",
      city: "",
      issueCategory: "",
      description: "",
      privacyAccepted: false,
      company: "",
      sourcePage: typeof window === "undefined" ? "/" : window.location.pathname,
      utm: collectUtmFields()
    }),
    []
  );

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError
  } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(contactFormSchema) as Resolver<FormValues>,
    shouldFocusError: true
  });

  async function onSubmit(values: FormValues) {
    if (isSubmitting || submittedOnceRef.current) {
      return;
    }

    submittedOnceRef.current = true;
    setSubmitState({
      type: "idle",
      message: "Enviando sua solicitação..."
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
      });
      const result = (await response.json()) as ContactApiResponse;

      if (result.ok) {
        reset(defaultValues);
        setSubmitState({
          type: "success",
          message: result.message
        });
        return;
      }

      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ContactFormInput & keyof FormValues, {
            type: "server",
            message
          });
        }
      }

      setSubmitState({
        type: "error",
        message: result.message || contactFailureMessage
      });
    } catch {
      setSubmitState({
        type: "error",
        message: contactFailureMessage
      });
    } finally {
      submittedOnceRef.current = false;
    }
  }

  const statusTone =
    submitState.type === "success"
      ? "border-green-700/30 bg-green-50 text-green-900"
      : submitState.type === "error"
        ? "border-gold/45 bg-gold/10 text-navy"
        : "border-navy/15 bg-navy/5 text-navy";

  return (
    <section
      aria-labelledby="formulario-contato-heading"
      className="border border-light-gray bg-white p-4 shadow-form sm:p-5 lg:p-6"
    >
      <div className="mb-4 border-b border-light-gray pb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
          Contato inicial
        </p>
        <h2
          id="formulario-contato-heading"
          className="mt-2 text-2xl font-semibold text-navy md:text-3xl"
        >
          Solicitar retorno
        </h2>
        <p className="mt-2 text-sm leading-6 text-graphite-soft">
          Envie um resumo seguro da situação para análise inicial e retorno pelos canais informados.
        </p>
      </div>

      <form
        aria-describedby="form-status security-warning"
        className="space-y-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="company">Empresa</label>
          <input
            id="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("company")}
          />
        </div>

        <input type="hidden" {...register("sourcePage")} />
        {APPROVED_UTM_FIELDS.map((field) => (
          <input key={field} type="hidden" {...register(`utm.${field}`)} />
        ))}

        <div>
          <label htmlFor="fullName" className="text-[0.95rem] font-semibold text-navy">
            Nome completo
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? fieldErrorId("fullName") : undefined}
            className="mt-1.5 min-h-12 w-full rounded-sm border border-light-gray px-3.5 text-base transition focus:border-gold disabled:bg-light-gray/40"
            disabled={isSubmitting}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p id={fieldErrorId("fullName")} className="mt-2 text-sm font-semibold text-red-700">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="text-[0.95rem] font-semibold text-navy">
              Telefone ou WhatsApp
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(13) 00000-0000"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? fieldErrorId("phone") : undefined}
              className="mt-1.5 min-h-12 w-full rounded-sm border border-light-gray px-3.5 text-base transition focus:border-gold disabled:bg-light-gray/40"
              disabled={isSubmitting}
              {...register("phone")}
            />
            {errors.phone ? (
              <p id={fieldErrorId("phone")} className="mt-2 text-sm font-semibold text-red-700">
                {errors.phone.message}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="city" className="text-[0.95rem] font-semibold text-navy">
              Cidade
            </label>
            <input
              id="city"
              type="text"
              autoComplete="address-level2"
              placeholder="Sua cidade"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? fieldErrorId("city") : undefined}
              className="mt-1.5 min-h-12 w-full rounded-sm border border-light-gray px-3.5 text-base transition focus:border-gold disabled:bg-light-gray/40"
              disabled={isSubmitting}
              {...register("city")}
            />
            {errors.city ? (
              <p id={fieldErrorId("city")} className="mt-2 text-sm font-semibold text-red-700">
                {errors.city.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="issueCategory" className="text-[0.95rem] font-semibold text-navy">
            Tipo de situação bancária
          </label>
          <select
            id="issueCategory"
            aria-invalid={Boolean(errors.issueCategory)}
            aria-describedby={errors.issueCategory ? fieldErrorId("issueCategory") : undefined}
            className="mt-1.5 min-h-12 w-full rounded-sm border border-light-gray bg-white px-3.5 text-base transition focus:border-gold disabled:bg-light-gray/40"
            disabled={isSubmitting}
            {...register("issueCategory")}
          >
            <option value="">Selecione uma opção</option>
            {bankingSituations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.issueCategory ? (
            <p id={fieldErrorId("issueCategory")} className="mt-2 text-sm font-semibold text-red-700">
              {errors.issueCategory.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="description" className="text-[0.95rem] font-semibold text-navy">
            Breve descrição
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Descreva brevemente o ocorrido."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description
                ? `${fieldErrorId("description")} security-warning`
                : "security-warning"
            }
            className="mt-1.5 w-full rounded-sm border border-light-gray px-3.5 py-2.5 text-base leading-7 transition focus:border-gold disabled:bg-light-gray/40"
            disabled={isSubmitting}
            {...register("description")}
          />
          <p
            id="security-warning"
            className="mt-2 border-l-2 border-gold bg-gold/10 px-3 py-2 text-sm leading-6 text-navy"
          >
            Descreva brevemente o ocorrido. Não informe senhas, códigos, tokens, números completos
            de conta ou cartão.
          </p>
          {errors.description ? (
            <p id={fieldErrorId("description")} className="mt-2 text-sm font-semibold text-red-700">
              {errors.description.message}
            </p>
          ) : null}
        </div>

        <label className="flex gap-3 border border-light-gray bg-light-gray/20 p-2.5 text-sm leading-6 text-graphite-soft">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-navy"
            aria-invalid={Boolean(errors.privacyAccepted)}
            aria-describedby={
              errors.privacyAccepted ? fieldErrorId("privacyAccepted") : undefined
            }
            disabled={isSubmitting}
            {...register("privacyAccepted")}
          />
          <span>
            Declaro que li o aviso de privacidade e estou ciente de que meus dados serão utilizados
            para analisar e responder à solicitação de contato.
          </span>
        </label>
        {errors.privacyAccepted ? (
          <p id={fieldErrorId("privacyAccepted")} className="text-sm font-semibold text-red-700">
            {errors.privacyAccepted.message}
          </p>
        ) : null}

        <div
          id="form-status"
          className={`rounded-sm border p-2.5 text-sm leading-6 ${statusTone}`}
          role="status"
          aria-live="polite"
        >
          {submitState.message}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full rounded-sm bg-navy px-5 font-semibold text-white transition hover:bg-navy/92 disabled:cursor-not-allowed disabled:bg-light-gray disabled:text-graphite-soft"
        >
          {isSubmitting ? "Enviando..." : "Enviar solicitação"}
        </button>

        <div className="grid gap-2.5 border-t border-light-gray pt-3 sm:grid-cols-2">
          <a
            href={siteConfig.whatsappHref}
            className="flex min-h-12 items-center justify-center rounded-sm bg-navy px-5 text-center font-semibold text-white transition hover:bg-navy/92"
          >
            Falar pelo WhatsApp
          </a>
          <a
            href={siteConfig.phoneHref}
            className="flex min-h-12 items-center justify-center rounded-sm border border-navy px-5 text-center font-semibold text-navy transition hover:bg-navy hover:text-white"
          >
            Ligar agora
          </a>
        </div>
      </form>
    </section>
  );
}
