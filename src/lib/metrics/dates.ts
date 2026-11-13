/** Data de hoje (AAAA-MM-DD) no fuso de São Paulo, não em UTC. */
export function todaySP(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(now);
}
