import type { DashboardData } from "@/data/dashboard";

const COR_TIPO: Record<string, string> = {
  aula: "bg-act-aula",
  questoes: "bg-act-questoes",
  revisao: "bg-act-revisao",
  simulado: "bg-act-simulado",
  descanso: "bg-act-descanso",
};

export function Painel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="mb-3 text-base font-semibold text-navy">{titulo}</h2>
      {children}
    </section>
  );
}

function minutos(seg: number) {
  const m = Math.floor(seg / 60);
  const s = String(seg % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function ContinuarEstudando({ aula }: { aula: DashboardData["ultimaAula"] }) {
  return (
    <Painel titulo="Continuar estudando">
      {aula ? (
        <div>
          <p className="font-medium text-navy">{aula.titulo}</p>
          <p className="mt-1 text-sm text-slate-500">Você parou em {minutos(aula.posicaoSeg)}.</p>
          <p className="mt-3 text-xs text-slate-400">O botão para retomar a aula chega com as videoaulas (Fase 2).</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Nenhuma aula iniciada ainda. Quando você assistir a primeira, ela aparece aqui.</p>
      )}
    </Painel>
  );
}

export function ListaDeTarefas({ titulo, tarefas }: { titulo: string; tarefas: DashboardData["tarefasHoje"] }) {
  return (
    <Painel titulo={titulo}>
      {tarefas.length === 0 ? (
        <p className="text-sm text-slate-500">O cronograma chega na Fase 4. Por enquanto não há tarefas programadas.</p>
      ) : (
        <ul className="space-y-2">
          {tarefas.map((t) => (
            <li key={t.titulo} className="flex items-center gap-3 text-sm text-navy">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${COR_TIPO[t.tipo] ?? "bg-slate-300"}`} aria-hidden="true" />
              {t.titulo}
            </li>
          ))}
        </ul>
      )}
    </Painel>
  );
}
