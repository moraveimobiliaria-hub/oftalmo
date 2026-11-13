/** Total de horas estudadas, com 1 casa decimal. */
export function totalHours(sessions: { duracao_seg: number }[]): number {
  const seg = sessions.reduce((soma, s) => soma + s.duracao_seg, 0);
  return Math.round((seg / 3600) * 10) / 10;
}
