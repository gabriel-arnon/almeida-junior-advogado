import { NextResponse } from "next/server";
import {
  isEmailConfigured,
  isProductionCompatibleRateLimitConfigured,
  validateServerEnv
} from "@/lib/env-config";

export function GET() {
  const validation = validateServerEnv(process.env);
  const env = validation.ok ? validation.env : undefined;
  const contactDelivery = env?.CONTACT_FORM_MODE === "email" && isEmailConfigured(env) ? "enabled" : "disabled";
  const productionRateLimit = env ? isProductionCompatibleRateLimitConfigured(env) : false;

  return NextResponse.json(
    {
      status: "ok",
      environment: env?.VERCEL_ENV || env?.NODE_ENV || "unknown",
      contactDelivery,
      productionCompatibleRateLimit: productionRateLimit,
      configurationValid: validation.ok
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
