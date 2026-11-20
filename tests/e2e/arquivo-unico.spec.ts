import { test, expect } from "@playwright/test";
import { execSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const arquivo = pathToFileURL(path.resolve("dist/index.html")).href;

test.describe("arquivo único aberto direto do disco (file://)", () => {
  test.skip(({ isMobile }) => isMobile, "o build é o mesmo; basta testar uma vez");
  test.beforeAll(() => {
    execSync("npm run build", { stdio: "pipe" });
  });

  test("abre o dashboard, navega por # e grava o perfil", async ({ page }) => {
    await page.goto(arquivo);
    await expect(page.getByRole("heading", { name: /Olá/ })).toBeVisible();

    await page.goto(`${arquivo}#/simulados`);
    await expect(page.getByText("Disponível na Fase 6")).toBeVisible();

    await page.goto(`${arquivo}#/perfil`);
    await page.getByLabel("Nome").fill("Dr. Arquivo");
    await page.getByRole("button", { name: "Salvar perfil" }).click();
    await expect(page.getByText("Perfil salvo")).toBeVisible();

    await page.goto(`${arquivo}#/inicio`);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Olá, Dr. Arquivo" })).toBeVisible();
  });
});

test("navegador sem armazenamento mostra aviso claro, não tela em branco", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", { value: undefined, configurable: true });
  });
  await page.goto("/#/inicio");
  await expect(page.getByText("Não foi possível salvar dados neste navegador")).toBeVisible();
});
