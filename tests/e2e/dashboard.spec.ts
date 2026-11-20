import { test, expect, type Page } from "@playwright/test";

async function contarTentativas(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      new Promise<number>((resolve, reject) => {
        const req = indexedDB.open("oftastudy");
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const db = req.result;
          const c = db.transaction("attempts").objectStore("attempts").count();
          c.onsuccess = () => resolve(c.result);
          c.onerror = () => reject(c.error);
        };
      }),
  );
}

test("dashboard vazio mostra estados vazios sem NaN", async ({ page }) => {
  await page.goto("/#/inicio");
  await expect(page.getByRole("heading", { name: /Olá/ })).toBeVisible();
  await expect(page.getByTestId("stat-acertos")).toContainText("—");
  await expect(page.getByTestId("stat-questoes")).toContainText("0");
  await expect(page.getByText("Nenhuma aula iniciada ainda")).toBeVisible();
  await expect(page.getByText("O cronograma chega na Fase 4").first()).toBeVisible();
  await expect(page.getByText("Prova do CBO")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("NaN");
  await expect(page.getByText("DEMONSTRAÇÃO")).toHaveCount(0);
});

test("demonstração mostra números, não grava nada e some ao sair", async ({ page }) => {
  await page.goto("/#/inicio");
  await expect(page.getByTestId("stat-acertos")).toContainText("—");

  await page.goto("/#/inicio?demo=1");
  await expect(page.getByText("DEMONSTRAÇÃO").first()).toBeVisible();
  await expect(page.getByTestId("stat-acertos")).toContainText("72%");

  expect(await contarTentativas(page)).toBe(0);

  await page.goto("/#/inicio");
  await expect(page.getByText("DEMONSTRAÇÃO")).toHaveCount(0);
  await expect(page.getByTestId("stat-acertos")).toContainText("—");
  expect(await contarTentativas(page)).toBe(0);
});

test("tem o botão para pré-visualizar com exemplos", async ({ page }) => {
  await page.goto("/#/inicio");
  await page.getByRole("link", { name: /Pré-visualizar com exemplos/ }).click();
  await expect(page.getByText("DEMONSTRAÇÃO").first()).toBeVisible();
  await page.getByRole("link", { name: /Sair da demonstração/ }).click();
  await expect(page.getByText("DEMONSTRAÇÃO")).toHaveCount(0);
});
