import { useCallback, useEffect, useState } from "react";
import { getPerfil, salvarPerfil } from "@/data/profile";
import { temDadosParaProteger } from "@/data/backup";
import { Painel } from "@/components/dashboard/panels";
import { BackupPanel } from "@/components/backup-panel";

type Form = { nome: string; meta: string; mes: string; ano: string; horas: string };

const campo = "mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-act-aula";

export default function Perfil() {
  const [form, setForm] = useState<Form | null>(null);
  const [ultimoBackup, setUltimoBackup] = useState<string | null>(null);
  const [temDados, setTemDados] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const carregar = useCallback(async () => {
    const p = await getPerfil();
    setForm({
      nome: p.nome,
      meta: p.metaCronograma,
      mes: p.provaMes?.toString() ?? "",
      ano: p.provaAno?.toString() ?? "",
      horas: p.horasDiarias?.toString().replace(".", ",") ?? "",
    });
    setUltimoBackup(p.ultimoBackup);
    setTemDados(await temDadosParaProteger());
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  if (!form) return <p className="text-slate-500">Carregando…</p>;
  const mudar = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const numero = (t: string) => (t.trim() === "" ? null : Number(t.replace(",", ".")));
    const r = await salvarPerfil({
      nome: form.nome,
      metaCronograma: form.meta,
      provaMes: numero(form.mes),
      provaAno: numero(form.ano),
      horasDiarias: numero(form.horas),
    });
    setMsg(r.ok ? { tipo: "ok", texto: "Perfil salvo." } : { tipo: "erro", texto: r.erro });
    if (r.ok) await carregar();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy">Perfil</h1>
      <Painel titulo="Seus dados de estudo">
        <form onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-600 sm:col-span-2">
            Nome
            <input className={campo} value={form.nome} onChange={mudar("nome")} autoComplete="name" />
          </label>
          <label className="text-sm text-slate-600">
            Meta de conclusão do cronograma
            <input type="date" className={campo} value={form.meta} onChange={mudar("meta")} />
          </label>
          <label className="text-sm text-slate-600">
            Horas diárias de estudo
            <input className={campo} inputMode="decimal" placeholder="ex.: 3" value={form.horas} onChange={mudar("horas")} />
          </label>
          <label className="text-sm text-slate-600">
            Mês da prova
            <input className={campo} inputMode="numeric" placeholder="1 a 12" value={form.mes} onChange={mudar("mes")} />
          </label>
          <label className="text-sm text-slate-600">
            Ano da prova
            <input className={campo} inputMode="numeric" placeholder="2029" value={form.ano} onChange={mudar("ano")} />
          </label>
          <div className="sm:col-span-2">
            <button className="rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-soft">Salvar perfil</button>
            {msg && (
              <p role={msg.tipo === "erro" ? "alert" : "status"} className={`mt-3 text-sm ${msg.tipo === "erro" ? "text-red-700" : "text-emerald-700"}`}>
                {msg.texto}
              </p>
            )}
          </div>
        </form>
      </Painel>
      <BackupPanel ultimoBackup={ultimoBackup} temDados={temDados} aoMudar={carregar} />
    </div>
  );
}
