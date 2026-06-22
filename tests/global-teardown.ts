import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const pidPath = join(process.cwd(), "test-results", "playwright-server.pid");

export default async function globalTeardown() {
  if (!existsSync(pidPath)) {
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
}
