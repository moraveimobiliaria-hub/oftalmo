import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/data/db";
import { iniciarBanco } from "@/data/seed";
import { getPerfil, salvarPerfil } from "@/data/profile";
import { exportarBackup, restaurarBackup, diasDesdeBackup } from "@/data/backup";

beforeEach(async () => {
  await db.delete();
  await db.open();
  await iniciarBanco();
});

async function dadosDe() {
  return {
    perfil: await getPerfil(),
    especialidades: await db.specialties.count(),
    tentativas: await db.attempts.count(),
  };
}

describe("exportar e restaurar", () => {
  it("exportar, apagar tudo e restaurar devolve o mesmo conteúdo", async () => {
    await salvarPerfil({ nome: "Dr. Teste", provaMes: 6, provaAno: 2029 });
    await db.attempts.add({ questionId: 1, specialtyId: 2, escolhida: "A", correta: true, respondidaEm: "2026-11-20T12:00:00Z" });
    const backup = await exportarBackup();
    const antes = await dadosDe();

    await db.delete();
    await db.open();
    expect(await db.attempts.count()).toBe(0);

    const r = await restaurarBackup(JSON.parse(JSON.stringify(backup)));
    expect(r.ok).toBe(true);
    expect(await dadosDe()).toEqual(antes);
  });

  it("exportar grava a data do último backup (inclusive dentro do arquivo)", async () => {
    const backup = await exportarBackup();
    const perfil = await getPerfil();
    expect(perfil.ultimoBackup).not.toBeNull();
    expect((backup.dados.profile[0] as { ultimoBackup: string }).ultimoBackup).toBe(perfil.ultimoBackup);
  });
});

describe("restaurar arquivo inválido não apaga nada", () => {
  const casos: [string, unknown][] = [
    ["texto qualquer", "lixo"],
    ["nulo", null],
    ["versão desconhecida", { versao: 99, dados: {} }],
    ["tabela desconhecida", { versao: 1, dados: { profile: [], foo: [] } }],
    ["tabela ausente", { versao: 1, dados: { profile: [] } }],
    ["sem a linha de perfil", { versao: 1, dados: tabelasVazias({ specialties: [{ nome: "Retina", ordem: 1 }] }) }],
    ["perfil com campos inválidos", { versao: 1, dados: tabelasVazias({ profile: [{ id: 1, nome: 5, metaCronograma: "x" }] }) }],
    ["linha que não é objeto", { versao: 1, dados: tabelasVazias({ specialties: [1] }) }],
  ];
  for (const [nome, entrada] of casos) {
    it(nome, async () => {
      await salvarPerfil({ nome: "Dr. Teste" });
      const r = await restaurarBackup(entrada);
      expect(r.ok).toBe(false);
      expect((await getPerfil()).nome).toBe("Dr. Teste");
      expect(await db.specialties.count()).toBe(14);
    });
  }

  it("falha no meio da gravação desfaz tudo (duas especialidades com o mesmo nome)", async () => {
    await salvarPerfil({ nome: "Dr. Teste" });
    const r = await restaurarBackup({
      versao: 1,
      dados: tabelasVazias({
        profile: [{ id: 1, nome: "Invasor", metaCronograma: "2027-12-31", provaMes: null, provaAno: null, horasDiarias: null, ultimoBackup: null, inicioEstudos: "2026-11-20" }],
        specialties: [{ nome: "Retina", ordem: 1 }, { nome: "Retina", ordem: 2 }],
      }),
    });
    expect(r.ok).toBe(false);
    expect((await getPerfil()).nome).toBe("Dr. Teste");
    expect(await db.specialties.count()).toBe(14);
  });
});

describe("diasDesdeBackup", () => {
  const hoje = new Date("2026-11-20T12:00:00Z");
  it("nunca fez backup devolve null", () => {
    expect(diasDesdeBackup(null, hoje)).toBeNull();
  });
  it("8 dias atrás devolve 8", () => {
    expect(diasDesdeBackup("2026-11-12T12:00:00Z", hoje)).toBe(8);
  });
  it("data futura não vira número negativo", () => {
    expect(diasDesdeBackup("2027-01-01T00:00:00Z", hoje)).toBe(0);
  });
});

function tabelasVazias(sobrescrever: Record<string, unknown[]> = {}) {
  const base: Record<string, unknown[]> = {
    profile: [], specialties: [], subjects: [], lessons: [], lessonProgress: [],
    questions: [], options: [], attempts: [], studySessions: [],
  };
  return { ...base, ...sobrescrever };
}
