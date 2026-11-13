import { describe, it, expect } from "vitest";
import { accuracyPercent } from "@/lib/metrics/accuracy";
import { scheduleProgress, daysUntilExam } from "@/lib/metrics/schedule";
import { totalHours } from "@/lib/metrics/hours";
import { accuracyBySpecialty } from "@/lib/metrics/specialty";
import { todaySP } from "@/lib/metrics/dates";

describe("accuracyPercent", () => {
  it("sem questões respondidas devolve null (nunca NaN)", () => {
    expect(accuracyPercent(0, 0)).toBeNull();
  });
  it("7 de 10 = 70", () => {
    expect(accuracyPercent(7, 10)).toBe(70);
  });
  it("arredonda para inteiro", () => {
    expect(accuracyPercent(1, 3)).toBe(33);
  });
});

describe("scheduleProgress", () => {
  const start = new Date("2026-11-01T12:00:00Z");
  const goal = new Date("2027-12-31T12:00:00Z");
  it("hoje depois da meta: 100% e 0 dias", () => {
    expect(scheduleProgress(start, goal, new Date("2028-03-01T12:00:00Z"))).toEqual({ pct: 100, daysLeft: 0 });
  });
  it("hoje antes do início: 0%", () => {
    const r = scheduleProgress(start, goal, new Date("2026-10-01T12:00:00Z"));
    expect(r.pct).toBe(0);
    expect(r.daysLeft).toBeGreaterThan(0);
  });
  it("meio do caminho fica entre 0 e 100", () => {
    const r = scheduleProgress(start, goal, new Date("2027-06-01T12:00:00Z"));
    expect(r.pct).toBeGreaterThan(0);
    expect(r.pct).toBeLessThan(100);
  });
  it("meta igual ao início não divide por zero", () => {
    expect(scheduleProgress(start, start, start).pct).toBe(100);
  });
});

describe("daysUntilExam", () => {
  it("sem prova definida devolve null", () => {
    expect(daysUntilExam(new Date("2026-11-12T12:00:00Z"), null, null)).toBeNull();
  });
  it("conta até o dia 1 do mês da prova", () => {
    expect(daysUntilExam(new Date("2028-12-31T12:00:00Z"), 1, 2029)).toBe(1);
  });
  it("prova já passada devolve 0", () => {
    expect(daysUntilExam(new Date("2030-01-01T12:00:00Z"), 1, 2029)).toBe(0);
  });
});

describe("totalHours", () => {
  it("5400 segundos = 1,5 hora", () => {
    expect(totalHours([{ duracao_seg: 5400 }])).toBe(1.5);
  });
  it("lista vazia = 0", () => {
    expect(totalHours([])).toBe(0);
  });
});

describe("accuracyBySpecialty", () => {
  it("sem tentativas devolve lista vazia", () => {
    expect(accuracyBySpecialty([])).toEqual([]);
  });
  it("agrupa por especialidade", () => {
    const r = accuracyBySpecialty([
      { specialty_id: "a", correta: true },
      { specialty_id: "a", correta: false },
      { specialty_id: "b", correta: true },
    ]);
    expect(r).toEqual([
      { specialty_id: "a", pct: 50, total: 2 },
      { specialty_id: "b", pct: 100, total: 1 },
    ]);
  });
});

describe("todaySP", () => {
  it("01:30 UTC ainda é o dia anterior em São Paulo", () => {
    expect(todaySP(new Date("2026-11-13T01:30:00Z"))).toBe("2026-11-12");
  });
  it("15:00 UTC é o mesmo dia", () => {
    expect(todaySP(new Date("2026-11-13T15:00:00Z"))).toBe("2026-11-13");
  });
});
