import { expect, type Page, test } from "@playwright/test";

async function expectAnchorGap(page: Page, selector: string, minGap = 24, maxGap = 80) {
  await page.waitForTimeout(900);

  const metrics = await page.evaluate((targetSelector) => {
    const header = document.querySelector("header");
    const target = document.querySelector(targetSelector);
    const headerRect = header?.getBoundingClientRect();
    const targetRect = target?.getBoundingClientRect();

    return {
      headerBottom: headerRect?.bottom ?? 0,
      targetTop: targetRect?.top ?? 0,
      gap: (targetRect?.top ?? 0) - (headerRect?.bottom ?? 0)
    };
  }, selector);

  expect(metrics.targetTop).toBeGreaterThanOrEqual(metrics.headerBottom + minGap);
  expect(metrics.targetTop).toBeLessThanOrEqual(metrics.headerBottom + maxGap);
}

test("homepage integrates profile into the introductory section before situations and form", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('form[aria-describedby="form-status security-warning"]')).toHaveCount(
    1
  );
  await expect(page.locator("#perfil")).toHaveCount(1);
  await expect(page.locator("#perfil")).toHaveClass(/bg-navy/);
  await expect(page.locator("#perfil")).not.toContainText("Perfil profissional");
  await expect(page.locator("#perfil")).toContainText("Grimaldo de Almeida Junior");
  await expect(page.locator("#perfil")).toContainText("OAB/SP 424.479");

  const order = await page.evaluate(() => {
    const intro = document.querySelector("main > section:first-of-type");
    const profile = document.querySelector("#perfil");
    const form = document.querySelector("#formulario-contato");
    const situations = document.querySelector("#situacoes");

    return {
      introTop: intro?.getBoundingClientRect().top ?? 0,
      profileTop: profile?.getBoundingClientRect().top ?? 0,
      formTop: form?.getBoundingClientRect().top ?? 0,
      situationsTop: situations?.getBoundingClientRect().top ?? 0
    };
  });

  expect(order.introTop).toBeLessThanOrEqual(order.profileTop);
  expect(order.profileTop).toBeLessThan(order.formTop);
  expect(order.situationsTop).toBeLessThanOrEqual(order.formTop);
});

test("homepage anchors align below the sticky header", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  const anchors = [
    { name: "Perfil", hash: "perfil", visibleSelector: "#perfil" },
    { name: "Situações", hash: "situacoes", visibleSelector: "#situacoes" },
    { name: "Atendimento", hash: "como-funciona", visibleSelector: "#como-funciona" },
    { name: "Preparação", hash: "documentos", visibleSelector: "#documentos" },
    { name: "Escritórios", hash: "regioes", visibleSelector: "#regioes" },
    { name: "FAQ", hash: "faq", visibleSelector: "#faq" }
  ];

  for (const anchor of anchors) {
    await nav.getByRole("link", { name: anchor.name }).click();
    await expect(page).toHaveURL(new RegExp(`#${anchor.hash}$`));
    await expectAnchorGap(page, anchor.visibleSelector);
  }
});

test("internal page profile link returns to a visible homepage anchor", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/aviso-legal");

  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Perfil" })
    .click();

  await expect(page).toHaveURL(/\/#perfil$/);
  await expectAnchorGap(page, "#perfil");
});

test("situations appear before the contact form on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const order = await page.evaluate(() => {
    const situationsHeading = document.querySelector("#situacoes h2");
    const form = document.querySelector("#formulario-contato");

    return {
      situationsTop: situationsHeading?.getBoundingClientRect().top ?? 0,
      formTop: form?.getBoundingClientRect().top ?? 0
    };
  });

  expect(order.situationsTop).toBeLessThan(order.formTop);
});

test("hero contact CTA targets the existing contact form", async ({ page }) => {
  await page.goto("/");

  const heroCta = page.getByRole("main").getByRole("link", { name: "Solicitar contato" }).first();
  await expect(heroCta).toHaveAttribute("href", "#formulario-contato");

  await heroCta.click();
  await expect(page).toHaveURL(/#formulario-contato$/);
  await expect(page.getByRole("heading", { name: "Solicitar retorno" })).toBeInViewport();
});

test("footer links use the configured contact, office and legal destinations", async ({ page }) => {
  await page.goto("/");

  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute(
    "href",
    /https:\/\/wa\.me\/5513974109024/
  );
  await expect(footer.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("target", "_blank");
  await expect(footer.getByRole("link", { name: /Telefone/ })).toHaveAttribute(
    "href",
    "tel:+5513974109024"
  );
  await expect(footer.getByRole("link", { name: /grimaldoalmeida\.oab@gmail\.com/ })).toHaveAttribute(
    "href",
    "mailto:grimaldoalmeida.oab@gmail.com"
  );
  await expect(footer.getByRole("link", { name: "@drgrimaldoalmeida" })).toHaveAttribute(
    "href",
    "https://www.instagram.com/drgrimaldoalmeida"
  );
  await expect(footer.getByRole("link", { name: /Santos — Centro/ })).toHaveAttribute(
    "href",
    /google\.com\/maps\/search/
  );
  await expect(footer.getByRole("link", { name: /Santos — Centro/ })).toHaveAttribute(
    "aria-label",
    /Praça Edílio José Soares/
  );
  await expect(footer.getByRole("link", { name: /Bertioga — Centro/ })).toHaveAttribute(
    "href",
    /google\.com\/maps\/place\/Almeida\+Junior\+Advogados/
  );
  await expect(footer.getByRole("link", { name: /Bertioga — Centro/ })).toHaveAttribute(
    "aria-label",
    /Rua Bartolomeu Fernandes Gonçalves/
  );
  await expect(footer.getByRole("link", { name: "Política de Privacidade" })).toHaveAttribute(
    "href",
    "/politica-de-privacidade"
  );
  await expect(footer.getByRole("link", { name: "Aviso Legal" })).toHaveAttribute(
    "href",
    "/aviso-legal"
  );
});

test("FAQ question rows expose expanded state and toggle by keyboard", async ({ page }) => {
  await page.goto("/");

  const firstQuestion = page.locator("#faq button").first();
  const firstIcon = firstQuestion.locator("[data-state]");
  await firstQuestion.focus();
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
  await expect(firstIcon).toHaveAttribute("data-state", "closed");

  await page.keyboard.press("Enter");
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  await expect(firstIcon).toHaveAttribute("data-state", "open");

  await page.keyboard.press("Enter");
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
  await expect(firstIcon).toHaveAttribute("data-state", "closed");
});

test("mobile homepage has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const metrics = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  }));

  expect(Math.max(metrics.body, metrics.document)).toBeLessThanOrEqual(metrics.viewport + 1);
});
