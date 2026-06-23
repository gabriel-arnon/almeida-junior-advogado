import { spawn } from "node:child_process";
import { existsSync, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const serverUrl = "http://127.0.0.1:3100";
const pidPath = join(process.cwd(), "test-results", "playwright-server.pid");
const envLocalPath = join(process.cwd(), ".env.local");
const envLocalBackupPath = join(process.cwd(), "test-results", "playwright.env.local.backup");

function isolateLocalEnvFile() {
  if (existsSync(envLocalBackupPath)) {
    renameSync(envLocalBackupPath, envLocalPath);
  }

  if (existsSync(envLocalPath)) {
    renameSync(envLocalPath, envLocalBackupPath);
  }
}

function restoreLocalEnvFile() {
  if (!existsSync(envLocalPath) && existsSync(envLocalBackupPath)) {
    renameSync(envLocalBackupPath, envLocalPath);
  }
}

function safePlaywrightEnv() {
  const env = { ...process.env };

  delete env.CONTACT_EMAIL_API_KEY;
  delete env.CONTACT_EMAIL_PROVIDER;
  delete env.CONTACT_EMAIL_TO;
  delete env.CONTACT_EMAIL_FROM;
  delete env.CONTACT_EMAIL_REPLY_TO;
  delete env.VERCEL_ENV;

  return env;
}

async function waitForServer(timeoutMs: number) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(serverUrl);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is not ready yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${serverUrl}`);
}

export default async function globalSetup() {
  mkdirSync(dirname(pidPath), { recursive: true });
  isolateLocalEnvFile();

  try {
    const child = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3100"],
      {
        cwd: process.cwd(),
        detached: true,
        env: {
          ...safePlaywrightEnv(),
          CONTACT_FORM_MODE: "mock",
          CONTACT_EMAIL_PROVIDER: "",
          CONTACT_EMAIL_FROM: "",
          CONTACT_EMAIL_REPLY_TO: "",
          CONTACT_RATE_LIMIT_MAX_REQUESTS: "100",
          CONTACT_RATE_LIMIT_WINDOW_SECONDS: "900"
        },
        stdio: "ignore",
        windowsHide: true
      }
    );

    if (!child.pid) {
      throw new Error("Unable to start Playwright Next.js server.");
    }

    writeFileSync(pidPath, String(child.pid), "utf8");
    child.unref();

    await waitForServer(120000);
  } catch (error) {
    restoreLocalEnvFile();
    throw error;
  }
}
