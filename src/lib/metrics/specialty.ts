import { accuracyPercent } from "./accuracy";

export type SpecialtyAccuracy = { specialty_id: string; pct: number; total: number };

/** Acertos por especialidade, na ordem em que cada especialidade aparece. */
export function accuracyBySpecialty(attempts: { specialty_id: string; correta: boolean }[]): SpecialtyAccuracy[] {
  const grupos = new Map<string, { certas: number; total: number }>();
  for (const a of attempts) {
    const g = grupos.get(a.specialty_id) ?? { certas: 0, total: 0 };
    g.total += 1;
    if (a.correta) g.certas += 1;
    grupos.set(a.specialty_id, g);
  }
  return [...grupos].map(([specialty_id, g]) => ({
    specialty_id,
    pct: accuracyPercent(g.certas, g.total) ?? 0,
    total: g.total,
  }));
}
