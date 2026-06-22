import { expect, test } from "@playwright/test";

test("privacy policy route loads", async ({ page }) => {
  await page.goto("/politica-de-privacidade");

  await expect(page.getByRole("heading", { level: 1, name: "Política de Privacidade" })).toBeVisible();
  await expect(page.getByText("Última atualização")).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar para a página inicial" })).toBeVisible();
});

test("legal notice route loads", async ({ page }) => {
  await page.goto("/aviso-legal");

  await expect(page.getByRole("heading", { level: 1, name: "Aviso Legal" })).toBeVisible();
  await expect(page.getByText("Ausência de promessa de resultado")).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar para a página inicial" })).toBeVisible();
});

test("legal pages can navigate back to homepage", async ({ page }) => {
  await page.goto("/aviso-legal");
  await page.getByRole("link", { name: "Voltar para a página inicial" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Problemas com operações, cobranças ou contratos bancários?"
  );
});

test("development noindex metadata is active by default", async ({ page }) => {
  await page.goto("/");

  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/);
});
