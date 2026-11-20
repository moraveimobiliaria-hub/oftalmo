/** AAAA-MM-DD → DD/MM/AAAA */
export function formatarData(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/** 1.5 → "1,5 h" ; 0 → "0 h" */
export function formatarHoras(horas: number): string {
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(horas)} h`;
}

export function formatarNumero(n: number): string {
  return new Intl.NumberFormat("pt-BR").format(n);
}
