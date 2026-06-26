import { expect, type Page, test } from "@playwright/test";

async function waitForBodyScrollUnlock(page: Page) {
  await page.waitForFunction(() => document.body.style.overflow !== "hidden");
}

async function waitForScrollToSettle(page: Page) {
  await page.waitForFunction(
    () => {
      const key = "__scrollSettleState";
      const currentScrollY = window.scrollY;
      const now = performance.now();
      const store = window as typeof window & {
        [key]?: { scrollY: number; stableSince: number };
      };
      const previous = store[key];

      if (!previous || Math.abs(previous.scrollY - currentScrollY) >= 1) {
        store[key] = { scrollY: currentScrollY, stableSince: now };
        return false;
      }

      return now - previous.stableSince >= 120;
    },
    undefined,
    { timeout: 2500 }
  );
}

async function waitForTargetTopToSettle(page: Page, selector: string) {
  await page.waitForFunction(
    (targetSelector) => {
      const target = document.querySelector(targetSelector);

      if (!target) {
        return false;
      }

      const key = `__targetTopSettleState:${targetSelector}`;
      const currentTop = target.getBoundingClientRect().top;
      const now = performance.now();
      const store = window as typeof window & {
        [key]?: { top: number; stableSince: number };
      };
      const previous = store[key];

      if (!previous || Math.abs(previous.top - currentTop) >= 1) {
        store[key] = { top: currentTop, stableSince: now };
        return false;
      }

      return now - previous.stableSince >= 120;
    },
    selector,
    { timeout: 2500 }
  );
}

async function waitForMobileMenuClosed(page: Page) {
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Abrir menu de navegação" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  await waitForBodyScrollUnlock(page);
}

async function expectAnchorGap(page: Page, selector: string, minGap = 24, maxGap = 80) {
  await waitForTargetTopToSettle(page, selector);

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

async function openMobileMenu(page: Page) {
  const menuButton = page.getByRole("button", { name: "Abrir menu de navegação" });

  await menuButton.click();
  await expect(page.getByRole("button", { name: "Fechar menu de navegação" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.waitForFunction(() => document.body.style.overflow === "hidden");
}

const desktopAnchors = [
  { hash: "perfil", visibleSelector: "#perfil" },
  { hash: "situacoes", visibleSelector: "#situacoes" },
  { hash: "como-funciona", visibleSelector: "#como-funciona" },
  { hash: "documentos", visibleSelector: "#documentos" },
  { hash: "regioes", visibleSelector: "#regioes" },
  { hash: "faq", visibleSelector: "#faq" }
];

const mobileMenuAnchors = [
  { name: "Perfil", hash: "perfil", visibleSelector: "#perfil" },
  { name: "Situações", hash: "situacoes", visibleSelector: "#situacoes" },
  { name: "Atendimento", hash: "como-funciona", visibleSelector: "#como-funciona" },
  { name: "Preparação", hash: "documentos", visibleSelector: "#documentos" },
  { name: "Escritórios", hash: "regioes", visibleSelector: "#regioes" },
  { name: "FAQ", hash: "faq", visibleSelector: "#faq" },
  { name: "Solicitar contato", hash: "formulario-contato", visibleSelector: "#formulario-contato" }
];

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

test("desktop navigation remains visible at desktop width", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Navegação principal", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /menu de navegação/ })).toHaveCount(0);
});

for (const anchor of desktopAnchors) {
  test(`desktop anchor #${anchor.hash} aligns below the sticky header`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Navegação principal", exact: true });
    await expect(nav).toBeVisible();

    const link = nav.locator(`a[href="/#${anchor.hash}"]`);

    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${anchor.hash}$`));
    await expectAnchorGap(page, anchor.visibleSelector);
  });
}

test("desktop situations section shows 20 cards", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  await expect(page.locator('[data-situation-list="desktop"] > li')).toHaveCount(20);
});

test("mobile menu replaces horizontal navigation and supports open close interactions", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Navegação principal", exact: true })).toBeHidden();

  const menuButton = page.getByRole("button", { name: "Abrir menu de navegação" });
  await expect(menuButton).toBeVisible();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toHaveAttribute("aria-controls", "mobile-navigation");

  await menuButton.click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.waitForFunction(() => document.body.style.overflow === "hidden");

  await page.getByRole("button", { name: "Fechar menu de navegação" }).click();
  await waitForMobileMenuClosed(page);

  await openMobileMenu(page);
  await page.keyboard.press("Escape");
  await waitForMobileMenuClosed(page);
});

test("mobile menu closes after selecting a navigation link", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await openMobileMenu(page);
  await page
    .getByRole("navigation", { name: "Navegação principal mobile" })
    .getByRole("link", { name: "Situações" })
    .click();

  await expect(page).toHaveURL(/#situacoes$/);
  await waitForMobileMenuClosed(page);
});

test("mobile menu links remain visually readable after opening from lower sections", async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const sectionTargets = ["#situacoes", "#como-funciona", "#documentos", "#regioes", "#faq"];
  const expectedLinks = [
    { label: "Perfil", color: /rgba?\(255,\s*255,\s*255/ },
    { label: "Situações", color: /rgba?\(255,\s*255,\s*255/ },
    { label: "Atendimento", color: /rgba?\(255,\s*255,\s*255/ },
    { label: "Preparação", color: /rgba?\(255,\s*255,\s*255/ },
    { label: "Escritórios", color: /rgba?\(255,\s*255,\s*255/ },
    { label: "FAQ", color: /rgba?\(255,\s*255,\s*255/ },
    { label: "Solicitar contato", color: /^rgb\(1,\s*39,\s*61\)$/ }
  ];

  for (const target of sectionTargets) {
    await page.locator(target).scrollIntoViewIfNeeded();
    await expect(page.locator(target)).toBeInViewport();

    await openMobileMenu(page);

    const menu = page.getByRole("navigation", { name: "Navegação principal mobile" });
    await expect(menu).toHaveCSS("background-color", "rgb(1, 39, 61)");

    for (const { label, color } of expectedLinks) {
      const link = menu.getByRole("link", { name: label });
      await expect(link).toBeVisible();

      const readability = await link.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const topElement = document.elementFromPoint(centerX, centerY);
        const linkStyle = window.getComputedStyle(element);
        const menuStyle = window.getComputedStyle(element.closest("nav") as Element);

        return {
          color: linkStyle.color,
          opacity: linkStyle.opacity,
          menuBackground: menuStyle.backgroundColor,
          isTopElementLink: element.contains(topElement)
        };
      });

      expect(readability.color).toMatch(color);
      expect(readability.opacity).toBe("1");
      expect(readability.menuBackground).toBe("rgb(1, 39, 61)");
      expect(readability.isTopElementLink).toBe(true);
    }

    await page.keyboard.press("Escape");
    await waitForMobileMenuClosed(page);
  }
});

for (const anchor of mobileMenuAnchors) {
  test(`mobile menu anchor #${anchor.hash} aligns below the sticky header`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator("#documentos").scrollIntoViewIfNeeded();
    await waitForScrollToSettle(page);

    await openMobileMenu(page);
    await page
      .getByRole("navigation", { name: "Navegação principal mobile" })
      .getByRole("link", { name: anchor.name })
      .click();
    await waitForMobileMenuClosed(page);
    await expect(page).toHaveURL(new RegExp(`#${anchor.hash}$`));
    await expectAnchorGap(page, anchor.visibleSelector, 20, 84);
  });
}

test("mobile situations show six cards first and reveal the remaining cards", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator('[data-situation-list="mobile-primary"] > li')).toHaveCount(6);
  await expect(page.locator('[data-situation-list="mobile-additional"] > li')).toHaveCount(14);
  await expect(page.locator("#outras-situacoes")).toHaveAttribute("aria-hidden", "true");

  const toggle = page.getByRole("button", { name: "Ver outras situações" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await expect(page.getByRole("button", { name: "Ocultar outras situações" })).toHaveAttribute(
    "aria-expanded",
    "true"
  );
  await expect(page.locator("#outras-situacoes")).toHaveAttribute("aria-hidden", "false");

  await page.getByRole("button", { name: "Ocultar outras situações" }).click();
  await expect(page.getByRole("button", { name: "Ver outras situações" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  await expect(page.locator("#outras-situacoes")).toHaveAttribute("aria-hidden", "true");
});

test("internal page profile link returns to a visible homepage anchor", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/aviso-legal");

  await page
    .getByRole("navigation", { name: "Navegação principal", exact: true })
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
  const viewports = [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 412, height: 915 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const metrics = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth
    }));

    expect(Math.max(metrics.body, metrics.document)).toBeLessThanOrEqual(metrics.viewport + 1);
    await expect(page.getByText("Almeida Junior Advogado").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Abrir menu de navegação" })).toBeVisible();

    await openMobileMenu(page);

    const menuMetrics = await page.locator("#mobile-navigation").evaluate((menu) => {
      const rect = menu.getBoundingClientRect();

      return {
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
        scrollHeight: menu.scrollHeight,
        clientHeight: menu.clientHeight
      };
    });

    expect(menuMetrics.bottom).toBeLessThanOrEqual(menuMetrics.viewportHeight + 1);
    expect(menuMetrics.clientHeight).toBeLessThanOrEqual(menuMetrics.viewportHeight);

    await page.keyboard.press("Escape");
    await waitForMobileMenuClosed(page);
  }
});
