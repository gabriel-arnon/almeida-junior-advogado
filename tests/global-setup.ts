import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const serverUrl = "http://127.0.0.1:3100";
const pidPath = join(process.cwd(), "test-results", "playwright-server.pid");

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

  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3100"],
    {
      cwd: process.cwd(),
      detached: true,
      env: {
        ...process.env,
        CONTACT_FORM_MODE: "mock",
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
}
