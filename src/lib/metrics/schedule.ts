const DIA_MS = 24 * 60 * 60 * 1000;

/** Progresso do tempo entre início e meta (0–100) e dias que faltam (nunca negativo). */
export function scheduleProgress(start: Date, goal: Date, today: Date): { pct: number; daysLeft: number } {
  const total = goal.getTime() - start.getTime();
  const daysLeft = Math.max(0, Math.ceil((goal.getTime() - today.getTime()) / DIA_MS));
  if (total <= 0) return { pct: 100, daysLeft };
  const pct = Math.min(100, Math.max(0, Math.round(((today.getTime() - start.getTime()) / total) * 100)));
  return { pct, daysLeft };
}

/** Dias até o dia 1 do mês da prova. `null` se a prova não foi definida; 0 se já passou. */
export function daysUntilExam(today: Date, mes: number | null, ano: number | null): number | null {
  if (mes === null || ano === null) return null;
  const prova = Date.UTC(ano, mes - 1, 1, 12);
  return Math.max(0, Math.ceil((prova - today.getTime()) / DIA_MS));
}
