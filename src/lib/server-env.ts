import "server-only";
import { validateServerEnv } from "@/lib/env-config";

export function getServerEnv() {
  return validateServerEnv(process.env);
}
