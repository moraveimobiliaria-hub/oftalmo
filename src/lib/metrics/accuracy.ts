/** Percentual de acertos (inteiro). `null` quando ainda não há questões respondidas. */
export function accuracyPercent(correct: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((correct / total) * 100);
}
