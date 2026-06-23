import { expect, type Page, test } from "@playwright/test";

const formData = {
  fullName: "Maria de Souza",
  phone: "(13) 97410-9024",
  city: "Santos",
  issueCategory: "Cobranças ou descontos indevidos",
  description:
    "Houve uma cobrança bancária não reconhecida e preciso de orientação sobre quais informações separar para análise."
};

async function fillValidContactForm(page: Page) {
  await page.getByLabel("Nome completo", { exact: true }).fill(formData.fullName);
  await page.getByLabel("Telefone ou WhatsApp", { exact: true }).fill(formData.phone);
  await page.getByLabel("Cidade", { exact: true }).fill(formData.city);
  await page
    .getByLabel("Tipo de situação bancária", { exact: true })
    .selectOption(formData.issueCategory);
  await page.getByLabel("Breve descrição", { exact: true }).fill(formData.description);
  await page.getByLabel("Declaro que li o aviso de privacidade").check();
}

async function expectContactFormValues(page: Page) {
  await expect(page.getByLabel("Nome completo", { exact: true })).toHaveValue(formData.fullName);
  await expect(page.getByLabel("Telefone ou WhatsApp", { exact: true })).toHaveValue(
    formData.phone
  );
  await expect(page.getByLabel("Cidade", { exact: true })).toHaveValue(formData.city);
  await expect(page.getByLabel("Tipo de situação bancária", { exact: true })).toHaveValue(
    formData.issueCategory
  );
  await expect(page.getByLabel("Breve descrição", { exact: true })).toHaveValue(
    formData.description
  );
  await expect(page.getByLabel("Declaro que li o aviso de privacidade")).toBeChecked();
}

async function mockFailedSubmission(page: Page) {
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
}

test("keeps entered values after failed submission from normal page access", async ({ page }) => {
  await mockFailedSubmission(page);

  await page.goto("/");
  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Enviar solicitação" }).click();

  await expect(page.getByRole("status")).toContainText("Não foi possível enviar");
  await expectContactFormValues(page);
});

test("keeps entered values after reaching the form through the contact CTA", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await mockFailedSubmission(page);

  await page.goto("/");
  await page.locator("header").getByRole("link", { name: "Solicitar contato" }).click();
  await expect(page).toHaveURL(/#formulario-contato$/);
  await expect(page.locator("#formulario-contato")).toBeInViewport();

  await fillValidContactForm(page);
  await page.getByRole("button", { name: "Enviar solicitação" }).click();

  await expect(page.getByRole("status")).toContainText("Não foi possível enviar");
  await expectContactFormValues(page);
});

test("clears fields only after a successful mock submission", async ({ page }) => {
  await page.goto("/");
  await fillValidContactForm(page);

  await page.getByRole("button", { name: "Enviar solicitação" }).click();

  await expect(page.getByRole("status")).toContainText("Recebemos sua solicitação");
  await expect(page.getByLabel("Nome completo", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Telefone ou WhatsApp", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Cidade", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Tipo de situação bancária", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Breve descrição", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Declaro que li o aviso de privacidade")).not.toBeChecked();
});

test("renders only one contact form on the homepage", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('form[aria-describedby="form-status security-warning"]')).toHaveCount(
    1
  );
});
