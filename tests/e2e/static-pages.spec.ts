import { expect, test } from "@playwright/test";

test("privacy policy route loads", async ({ page }) => {
  await page.goto("/politica-de-privacidade");

  await expect(page.getByRole("heading", { level: 1, name: "Política de Privacidade" })).toBeVisible();
  await expect(page.getByText("Última atualização: 23 de junho de 2026")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "1. Identificação do responsável pelo tratamento" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar para a página inicial" }).first()).toHaveAttribute(
    "href",
    "/"
  );
});

test("legal notice route loads", async ({ page }) => {
  await page.goto("/aviso-legal");

  await expect(page.getByRole("heading", { level: 1, name: "Aviso Legal" })).toBeVisible();
  await expect(page.getByText("Última atualização: 23 de junho de 2026")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "4. Ausência de garantia de resultado" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Voltar para a página inicial" }).first()).toHaveAttribute(
    "href",
    "/"
  );
});

test("internal page header links point to homepage sections", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/aviso-legal");

  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  await expect(nav.getByRole("link", { name: "Perfil" })).toHaveAttribute("href", "/#perfil");
  await expect(nav.getByRole("link", { name: "Preparação" })).toHaveAttribute("href", "/#documentos");
  await expect(page.getByRole("link", { name: "Solicitar contato" }).first()).toHaveAttribute(
    "href",
    "/#formulario-contato"
  );
});

test("legal pages can navigate back to homepage", async ({ page }) => {
  await page.goto("/aviso-legal");
  await page.getByRole("link", { name: "Voltar para a página inicial" }).first().click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Problemas com operações, cobranças ou contratos bancários?"
  );
});

test("legal pages include reciprocal links", async ({ page }) => {
  await page.goto("/politica-de-privacidade");
  await page.getByRole("article").getByRole("link", { name: "Aviso Legal" }).click();
  await expect(page).toHaveURL("/aviso-legal");

  await page.getByRole("article").getByRole("link", { name: "Política de Privacidade" }).click();
  await expect(page).toHaveURL("/politica-de-privacidade");
});

for (const path of ["/politica-de-privacidade", "/aviso-legal"]) {
  test(`has no horizontal overflow on mobile at ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);

    const metrics = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth
    }));

    expect(Math.max(metrics.body, metrics.document)).toBeLessThanOrEqual(metrics.viewport + 1);
  });
}

test("development noindex metadata is active by default", async ({ page }) => {
  await page.goto("/");

  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/);
});
