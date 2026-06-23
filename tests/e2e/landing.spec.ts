import { expect, type Page, test } from "@playwright/test";

const validDescription =
  "Houve uma cobrança bancária não reconhecida e preciso de orientação sobre quais informações separar para análise.";

async function fillValidContactForm(page: Page) {
  await page.getByLabel("Nome completo", { exact: true }).fill("Maria de Souza");
  await page.getByLabel("Telefone ou WhatsApp", { exact: true }).fill("(13) 97410-9024");
  await page.getByLabel("Cidade", { exact: true }).fill("Santos");
  await page
    .getByLabel("Tipo de situação bancária", { exact: true })
    .selectOption("Cobranças ou descontos indevidos");
  await page.getByLabel("Breve descrição", { exact: true }).fill(validDescription);
  await page.getByLabel("Declaro que li o aviso de privacidade").check();
}

test("homepage renders required static sections", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Almeida Junior Advogado/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Problemas com operações, cobranças ou contratos bancários?"
  );

  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "Solicitar contato" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Falar pelo WhatsApp" }).first()).toBeVisible();

  for (const sectionName of [
    "Conflitos bancários",
    "Atendimento objetivo",
    "Grimaldo de Almeida Junior",
    "Documentos úteis",
    "Atendimento presencial",
    "Respostas objetivas"
  ]) {
    await expect(page.getByText(sectionName, { exact: false }).first()).toBeVisible();
  }
});

test("lawyer profile renders the professional portrait", async ({ page }) => {
  await page.goto("/");

  const profile = page.locator("#perfil");
  const portrait = profile.getByRole("img", {
    name: "Grimaldo de Almeida Junior, advogado inscrito na OAB/SP 424.479"
  });

  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute("src", /grimaldo-almeida-junior\.webp/);
  await expect(profile.getByText("GA", { exact: true })).toHaveCount(0);
});

test("anchor navigation reaches expected homepage sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "FAQ" }).click();
  await expect(page).toHaveURL(/#faq$/);
  await expect(page.locator("#faq")).toBeInViewport();
});

test("desktop header exposes restrained contact CTA", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  const header = page.locator("header");
  await expect(header.getByText("OAB/SP 424.479")).toBeVisible();
  await expect(header.getByRole("link", { name: "Solicitar contato" })).toBeVisible();
});

test("mobile navigation remains compact and usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const header = page.locator("header");
  await expect(header.getByLabel("Almeida Junior Advogado - página inicial")).toBeVisible();
  await expect(header.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  await expect(header.getByRole("link", { name: "FAQ" })).toBeVisible();
});

test("contact form shows validation for required fields", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Enviar solicitação" }).click();

  await expect(page.getByText("Informe seu nome completo.")).toBeVisible();
  await expect(page.getByText("Informe um telefone ou WhatsApp válido.")).toBeVisible();
  await expect(page.getByText("Informe sua cidade.")).toBeVisible();
  await expect(page.getByText("Selecione o tipo de situação bancária.")).toBeVisible();
  await expect(page.getByText("Descreva brevemente o ocorrido.")).toBeVisible();
  await expect(page.getByText("Confirme que leu o aviso de privacidade")).toBeVisible();
});

test("contact form validates phone and description limits", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Nome completo", { exact: true }).fill("Maria de Souza");
  await page.getByLabel("Telefone ou WhatsApp", { exact: true }).fill("123");
  await page.getByLabel("Cidade", { exact: true }).fill("Santos");
  await page
    .getByLabel("Tipo de situação bancária", { exact: true })
    .selectOption("Cobranças ou descontos indevidos");
  await page.getByLabel("Breve descrição", { exact: true }).fill("Curto demais.");
  await page.getByLabel("Declaro que li o aviso de privacidade").check();
  await page.getByRole("button", { name: "Enviar solicitação" }).click();

  await expect(page.getByText("Informe um telefone ou WhatsApp válido.")).toBeVisible();
  await expect(page.getByText("A descrição deve ter pelo menos 30 caracteres.")).toBeVisible();

  await page.getByLabel("Telefone ou WhatsApp", { exact: true }).fill("(13) 97410-9024");
  await page.getByLabel("Breve descrição", { exact: true }).fill("A".repeat(1001));
  await page.getByRole("button", { name: "Enviar solicitação" }).click();

  await expect(page.getByText("A descrição deve ter no máximo 1000 caracteres.")).toBeVisible();
});

test("contact form submits successfully in development mock mode", async ({ page }) => {
  await page.goto("/");
  await fillValidContactForm(page);

  await page.getByRole("button", { name: "Enviar solicitação" }).click();

  await expect(page.getByRole("status")).toContainText("Recebemos sua solicitação");
  await expect(page.getByLabel("Nome completo", { exact: true })).toHaveValue("");
  await expect(page.getByRole("link", { name: "Falar pelo WhatsApp" }).last()).toBeVisible();
  await expect(page.getByRole("link", { name: "Ligar agora" })).toBeVisible();
});

test("loading state prevents duplicate submissions", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/contact", async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        requestId: "test-request",
        message:
          "Recebemos sua solicitação. As informações serão verificadas pela equipe, que poderá entrar em contato pelo telefone ou WhatsApp indicado em até 24 horas úteis. O envio deste formulário não representa contratação, aceitação automática do caso ou garantia de resultado."
      })
    });
  });

  await page.goto("/");
  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Enviar solicitação" }).click();
  await expect(page.getByRole("button", { name: "Enviando..." })).toBeDisabled();
  await page.getByRole("button", { name: "Enviando..." }).click({ force: true });
  await expect(page.getByRole("status")).toContainText("Recebemos sua solicitação");
  expect(requests).toBe(1);
});

test("delivery failure preserves form data and offers fallbacks", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        code: "delivery_unavailable",
        message:
          "Não foi possível enviar sua solicitação neste momento. Tente novamente ou entre em contato pelo WhatsApp ou telefone."
      })
    });
  });

  await page.goto("/");
  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Enviar solicitação" }).click();

  await expect(page.getByRole("status")).toContainText("Não foi possível enviar");
  await expect(page.getByLabel("Nome completo", { exact: true })).toHaveValue("Maria de Souza");
  await expect(page.getByRole("link", { name: "Falar pelo WhatsApp" }).last()).toBeVisible();
  await expect(page.getByRole("link", { name: "Ligar agora" })).toBeVisible();
});

test("brand uses approved singular form only", async ({ page }) => {
  await page.goto("/");

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).toContain("Almeida Junior Advogado");
  expect(bodyText).not.toContain("Almeida Junior Advogado" + "s");
});

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
]) {
  test(`has no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const metrics = await page.evaluate(() => ({
      body: document.body.scrollWidth,
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth
    }));

    expect(Math.max(metrics.body, metrics.document)).toBeLessThanOrEqual(metrics.viewport + 1);
  });
}

test("api rejects invalid server-side payload", async ({ request }) => {
  const response = await request.post("/api/contact", {
    data: {
      fullName: "A",
      phone: "123",
      city: "",
      issueCategory: "categoria desconhecida",
      description: "curto",
      privacyAccepted: false,
      company: ""
    }
  });
  const body = await response.json();

  expect(response.status()).toBe(400);
  expect(body.ok).toBe(false);
  expect(body.code).toBe("invalid_input");
  expect(body.fieldErrors.fullName).toBeTruthy();
});

test("api rejects honeypot without revealing spam rule", async ({ request }) => {
  const response = await request.post("/api/contact", {
    data: {
      fullName: "Maria de Souza",
      phone: "(13) 97410-9024",
      city: "Santos",
      issueCategory: "Cobranças ou descontos indevidos",
      description: validDescription,
      privacyAccepted: true,
      company: "Empresa preenchida"
    }
  });
  const body = await response.json();

  expect(response.status()).toBe(400);
  expect(body.ok).toBe(false);
  expect(JSON.stringify(body)).not.toContain("honeypot");
  expect(JSON.stringify(body)).not.toContain("spam");
});

test("api rejects non-json requests", async ({ request }) => {
  const response = await request.post("/api/contact", {
    headers: {
      "Content-Type": "text/plain"
    },
    data: "not-json"
  });
  const body = await response.json();

  expect(response.status()).toBe(415);
  expect(body.ok).toBe(false);
  expect(body.code).toBe("invalid_content_type");
});
