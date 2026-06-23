import { existsSync, readFileSync, rmSync } from "node:fs";
import { renameSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const pidPath = join(process.cwd(), "test-results", "playwright-server.pid");
const envLocalPath = join(process.cwd(), ".env.local");
const envLocalBackupPath = join(process.cwd(), "test-results", "playwright.env.local.backup");

function restoreLocalEnvFile() {
  if (!existsSync(envLocalPath) && existsSync(envLocalBackupPath)) {
    renameSync(envLocalBackupPath, envLocalPath);
  }
}

export default async function globalTeardown() {
  if (!existsSync(pidPath)) {
    restoreLocalEnvFile();
    return;
  }

  const pid = readFileSync(pidPath, "utf8").trim();

  if (pid) {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", pid, "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true
      });
    } else {
      try {
        process.kill(Number(pid), "SIGTERM");
      } catch {
        // The process may already be gone.
      }
    }
  }

  rmSync(pidPath, { force: true });
  restoreLocalEnvFile();
}
