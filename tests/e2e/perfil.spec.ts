import { test, expect } from "@playwright/test";
import fs from "node:fs";

async function salvarNome(page: import("@playwright/test").Page, nome: string) {
  await page.getByLabel("Nome").fill(nome);
  await page.getByRole("button", { name: "Salvar perfil" }).click();
  await expect(page.getByText("Perfil salvo")).toBeVisible();
}

test("salvar nome e prova personaliza o dashboard", async ({ page }) => {
  await page.goto("/#/perfil");
  await page.getByLabel("Mês da prova").fill("6");
  await page.getByLabel("Ano da prova").fill("2029");
  await salvarNome(page, "Dr. Teste");
  await page.goto("/#/inicio");
  await expect(page.getByRole("heading", { name: "Olá, Dr. Teste" })).toBeVisible();
  await expect(page.getByText("06/2029")).toBeVisible();
});

test("horas diárias inválidas mostram erro e não salvam", async ({ page }) => {
  await page.goto("/#/perfil");
  await page.getByLabel("Nome").fill("Fulano");
  await page.getByLabel("Horas diárias de estudo").fill("30");
  await page.getByRole("button", { name: "Salvar perfil" }).click();
  await expect(page.getByRole("alert")).toContainText("entre 0,5 e 16");
  await page.goto("/#/inicio");
  await expect(page.getByRole("heading", { name: "Olá!" })).toBeVisible();
});

test("backup: salvar, alterar e restaurar; arquivo inválido é recusado", async ({ page }, info) => {
  await page.goto("/#/perfil");
  await expect(page.getByText(/ainda não fez backup/)).toHaveCount(0);
  await salvarNome(page, "Dr. Teste");
  await expect(page.getByText(/ainda não fez backup/)).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Salvar backup" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^oftastudy-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const caminho = info.outputPath("backup.json");
  await download.saveAs(caminho);
  expect(JSON.parse(fs.readFileSync(caminho, "utf8")).versao).toBe(1);
  await expect(page.getByText(/ainda não fez backup/)).toHaveCount(0);

  await salvarNome(page, "Outro Nome");
  await page.getByLabel("Restaurar backup").setInputFiles(caminho);
  await expect(page.getByText("Backup restaurado")).toBeVisible();
  await expect(page.getByLabel("Nome")).toHaveValue("Dr. Teste");

  await page.getByLabel("Restaurar backup").setInputFiles({ name: "lixo.json", mimeType: "application/json", buffer: Buffer.from("isto nao e json") });
  await expect(page.getByRole("alert")).toContainText("não é um backup");
  await page.goto("/#/inicio");
  await expect(page.getByRole("heading", { name: "Olá, Dr. Teste" })).toBeVisible();
});
