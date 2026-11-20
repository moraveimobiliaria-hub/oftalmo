import { test, expect } from "@playwright/test";
import { config } from "dotenv";

config({ path: ".env.local" });
const EMAIL = process.env.E2E_EMAIL ?? "";
const SENHA = process.env.E2E_SENHA ?? "";

test("rota interna sem login vai para o login", async ({ page }) => {
  await page.goto("/videoaulas");
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/inicio");
  await expect(page).toHaveURL(/\/login$/);
});

test("página inicial é pública e leva ao login", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();
  await page.getByRole("link", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("senha errada mostra mensagem de erro", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("ninguem@exemplo.com");
  await page.getByLabel("Senha").fill("senha-errada-123");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByText("E-mail ou senha incorretos")).toBeVisible();
});

test.describe("com usuário de teste", () => {
  test.skip(!EMAIL || !SENHA, "defina E2E_EMAIL e E2E_SENHA no .env.local");

  test("login correto abre o dashboard e Sair volta ao login", async ({ page, isMobile }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(EMAIL);
    await page.getByLabel("Senha").fill(SENHA);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/inicio$/);

    if (isMobile || (page.viewportSize()?.width ?? 1280) < 1024) {
      await page.getByRole("button", { name: "Mais" }).click();
      await page.getByRole("button", { name: "Sair" }).click();
    } else {
      await page.getByRole("button", { name: "Sair" }).click();
    }
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/inicio");
    await expect(page).toHaveURL(/\/login$/);
  });
});
