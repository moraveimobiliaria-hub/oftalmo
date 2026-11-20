import { test, expect } from "@playwright/test";

test("a raiz abre o início", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/#\/inicio$/);
});

test("seção futura mostra em qual fase chega", async ({ page }) => {
  await page.goto("/#/simulados");
  await expect(page.getByText("Disponível na Fase 6")).toBeVisible();
});

test("endereço desconhecido mostra página não encontrada", async ({ page }) => {
  await page.goto("/#/xyz");
  await expect(page.getByText("Página não encontrada")).toBeVisible();
});

test("menu tem os 10 itens", async ({ page, isMobile }) => {
  await page.goto("/#/inicio");
  if (isMobile) {
    await page.getByRole("button", { name: "Mais" }).click();
    await expect(page.locator("div.fixed a")).toHaveCount(10);
  } else {
    await expect(page.getByRole("navigation", { name: "Menu principal" }).first().getByRole("link")).toHaveCount(10);
  }
});
