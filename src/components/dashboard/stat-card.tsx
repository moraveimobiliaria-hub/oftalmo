import type { ReactNode } from "react";

export function StatCard({ id, titulo, valor, detalhe, icone }: { id: string; titulo: string; valor: string; detalhe?: string; icone: ReactNode }) {
  return (
    <div data-testid={`stat-${id}`} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-sm">{titulo}</span>
        <span className="text-act-aula" aria-hidden="true">{icone}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-navy">{valor}</div>
      {detalhe && <div className="mt-1 text-xs text-slate-500">{detalhe}</div>}
    </div>
  );
}
