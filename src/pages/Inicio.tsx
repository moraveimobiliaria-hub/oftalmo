import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { BookOpenCheck, CircleCheck, Clock, ListChecks, RefreshCw } from "lucide-react";
import { carregarDashboard, type DashboardData } from "@/data/dashboard";
import { DADOS_DEMONSTRACAO } from "@/data/demo";
import { formatarData, formatarHoras, formatarNumero } from "@/lib/format";
import { StatCard } from "@/components/dashboard/stat-card";
import { SpecialtyChart } from "@/components/dashboard/specialty-chart";
import { ContinuarEstudando, ListaDeTarefas, Painel } from "@/components/dashboard/panels";

export default function Inicio() {
  const [params] = useSearchParams();
  const demo = params.get("demo") === "1";
  const [real, setReal] = useState<DashboardData | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    carregarDashboard(new Date())
      .then((d) => ativo && setReal(d))
      .catch(() => ativo && setErro(true));
    return () => {
      ativo = false;
    };
  }, []);

  if (erro) return <p role="alert" className="text-red-700">Não foi possível ler os dados neste navegador.</p>;
  const d = demo ? DADOS_DEMONSTRACAO : real;
  if (!d) return <p className="text-slate-500">Carregando…</p>;

  const saudacao = d.nome ? `Olá, ${d.nome}` : "Olá!";
  const prova = d.provaMes && d.provaAno ? `${String(d.provaMes).padStart(2, "0")}/${d.provaAno}` : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {demo && (
        <div className="rounded-xl bg-act-revisao/20 px-4 py-3 text-sm font-medium text-navy ring-1 ring-act-revisao/50">
          DEMONSTRAÇÃO — números de exemplo, nada é gravado.{" "}
          <Link to="/inicio" className="underline">Sair da demonstração</Link>
        </div>
      )}

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">{saudacao}</h1>
          {!d.nome && !demo && (
            <p className="mt-1 text-sm text-slate-500">
              Conte seu nome no <Link to="/perfil" className="underline">Perfil</Link> para personalizar.
            </p>
          )}
        </div>
        {!demo && (
          <Link to="/inicio?demo=1" className="rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy hover:bg-sky-soft">
            Pré-visualizar com exemplos
          </Link>
        )}
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard id="horas" titulo="Horas estudadas" valor={formatarHoras(d.horas)} icone={<Clock size={18} />} />
        <StatCard id="aulas" titulo="Videoaulas concluídas" valor={formatarNumero(d.aulasConcluidas)} icone={<CircleCheck size={18} />} />
        <StatCard id="questoes" titulo="Questões respondidas" valor={formatarNumero(d.questoesRespondidas)} icone={<ListChecks size={18} />} />
        <StatCard id="acertos" titulo="Acertos" valor={d.acertoPct === null ? "—" : `${d.acertoPct}%`} detalhe={d.acertoPct === null ? "Sem questões ainda" : undefined} icone={<BookOpenCheck size={18} />} />
        <StatCard id="revisoes" titulo="Revisões pendentes" valor={formatarNumero(d.revisoesPendentes)} icone={<RefreshCw size={18} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Painel titulo="Progresso do cronograma">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-slate-600">Meta: concluir até {formatarData(d.metaCronograma)}</span>
            <span className="font-medium text-navy">{d.progressoCronograma.pct}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100" role="progressbar" aria-valuenow={d.progressoCronograma.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Tempo decorrido até a meta">
            <div className="h-2.5 rounded-full bg-act-aula" style={{ width: `${d.progressoCronograma.pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {d.progressoCronograma.daysLeft > 0 ? `Faltam ${formatarNumero(d.progressoCronograma.daysLeft)} dias para a meta.` : "A data da meta já chegou."}
          </p>
          <p className="mt-3 border-t pt-3 text-sm text-slate-600">
            Prova do CBO:{" "}
            {prova ? (
              <strong className="text-navy">
                {prova}
                {d.diasProva !== null && d.diasProva > 0 ? ` — faltam ${formatarNumero(d.diasProva)} dias` : ""}
              </strong>
            ) : (
              <>
                data não definida. <Link to="/perfil" className="underline">Definir no Perfil</Link>
              </>
            )}
          </p>
        </Painel>
        <Painel titulo="Desempenho por especialidade">
          <SpecialtyChart dados={d.porEspecialidade} />
        </Painel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ContinuarEstudando aula={d.ultimaAula} />
        <ListaDeTarefas titulo="Meu dia" tarefas={d.tarefasHoje} />
        <ListaDeTarefas titulo="Próximas atividades" tarefas={[]} />
      </div>
    </div>
  );
}
