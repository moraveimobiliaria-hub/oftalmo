import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/data/db";
import { iniciarBanco } from "@/data/seed";
import { salvarPerfil } from "@/data/profile";
import { carregarDashboard } from "@/data/dashboard";
import { formatarData, formatarHoras } from "@/lib/format";

const hoje = new Date("2026-11-20T15:00:00Z");

beforeEach(async () => {
  await db.delete();
  await db.open();
  await iniciarBanco();
});

describe("carregarDashboard com banco recém-criado", () => {
  it("não quebra e mostra valores vazios, nunca NaN", async () => {
    const d = await carregarDashboard(hoje);
    expect(d.acertoPct).toBeNull();
    expect(d.horas).toBe(0);
    expect(d.questoesRespondidas).toBe(0);
    expect(d.aulasConcluidas).toBe(0);
    expect(d.ultimaAula).toBeNull();
    expect(d.porEspecialidade).toEqual([]);
    expect(d.tarefasHoje).toEqual([]);
    expect(d.diasProva).toBeNull();
    expect(Number.isFinite(d.progressoCronograma.pct)).toBe(true);
  });
});

describe("carregarDashboard com dados", () => {
  it("3 tentativas, 2 certas = 67% e agrupa por especialidade", async () => {
    const retina = (await db.specialties.where("nome").equals("Retina").first())!.id!;
    const glaucoma = (await db.specialties.where("nome").equals("Glaucoma").first())!.id!;
    await db.attempts.bulkAdd([
      { questionId: 1, specialtyId: retina, escolhida: "A", correta: true, respondidaEm: "2026-11-19T10:00:00Z" },
      { questionId: 2, specialtyId: retina, escolhida: "B", correta: false, respondidaEm: "2026-11-19T10:01:00Z" },
      { questionId: 3, specialtyId: glaucoma, escolhida: "C", correta: true, respondidaEm: "2026-11-19T10:02:00Z" },
    ]);
    const d = await carregarDashboard(hoje);
    expect(d.questoesRespondidas).toBe(3);
    expect(d.acertoPct).toBe(67);
    expect(d.porEspecialidade).toEqual([
      { nome: "Retina", pct: 50, total: 2 },
      { nome: "Glaucoma", pct: 100, total: 1 },
    ]);
  });

  it("conta horas, aulas concluídas e acha a última aula", async () => {
    const esp = (await db.specialties.toCollection().first())!.id!;
    const a1 = (await db.lessons.add({ specialtyId: esp, titulo: "Aula 1", fonte: "pasta" })) as number;
    const a2 = (await db.lessons.add({ specialtyId: esp, titulo: "Aula 2", fonte: "pasta" })) as number;
    await db.lessonProgress.bulkAdd([
      { lessonId: a1, posicaoSeg: 100, concluida: true, ultimoAcesso: "2026-11-18T10:00:00Z" },
      { lessonId: a2, posicaoSeg: 250, concluida: false, ultimoAcesso: "2026-11-19T10:00:00Z" },
    ]);
    await db.studySessions.add({ inicio: "2026-11-19T10:00:00Z", duracaoSeg: 5400, tipo: "aula" });
    const d = await carregarDashboard(hoje);
    expect(d.aulasConcluidas).toBe(1);
    expect(d.horas).toBe(1.5);
    expect(d.ultimaAula).toEqual({ titulo: "Aula 2", posicaoSeg: 250 });
  });

  it("ignora progresso de aula que foi apagada", async () => {
    await db.lessonProgress.add({ lessonId: 999, posicaoSeg: 10, concluida: false, ultimoAcesso: "2026-11-19T10:00:00Z" });
    expect((await carregarDashboard(hoje)).ultimaAula).toBeNull();
  });

  it("dias até a prova quando definida", async () => {
    await salvarPerfil({ provaMes: 1, provaAno: 2029 });
    const d = await carregarDashboard(hoje);
    expect(d.diasProva).toBeGreaterThan(700);
  });

  it("meta já passada: 100% e 0 dias, sem erro", async () => {
    await db.profile.update(1, { metaCronograma: "2026-01-01" });
    const d = await carregarDashboard(hoje);
    expect(d.progressoCronograma).toEqual({ pct: 100, daysLeft: 0 });
  });
});

describe("formatação brasileira", () => {
  it("data AAAA-MM-DD vira DD/MM/AAAA", () => {
    expect(formatarData("2027-12-31")).toBe("31/12/2027");
  });
  it("horas com vírgula", () => {
    expect(formatarHoras(1.5)).toBe("1,5 h");
    expect(formatarHoras(0)).toBe("0 h");
  });
});
