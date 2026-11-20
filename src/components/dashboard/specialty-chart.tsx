import { formatarNumero } from "@/lib/format";

type Linha = { nome: string; pct: number; total: number };

/** Barras horizontais de acerto por especialidade, da pior para a melhor (para mostrar onde reforçar). */
export function SpecialtyChart({ dados }: { dados: Linha[] }) {
  if (dados.length === 0) {
    return <p className="text-sm text-slate-500">Responda questões para ver seu desempenho por especialidade.</p>;
  }
  const ordenados = [...dados].sort((a, b) => a.pct - b.pct);
  return (
    <ul className="space-y-3" aria-label="Acertos por especialidade">
      {ordenados.map((d) => (
        <li key={d.nome} title={`${d.nome}: ${d.pct}% de acertos em ${formatarNumero(d.total)} questões`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-navy">{d.nome}</span>
            <span className="shrink-0 tabular-nums text-slate-600">
              {d.pct}% <span className="text-xs text-slate-400">({formatarNumero(d.total)})</span>
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100" role="img" aria-label={`${d.nome}: ${d.pct}%`}>
            <div className="h-2 rounded-full bg-[#0f9d8f]" style={{ width: `${Math.max(2, d.pct)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
