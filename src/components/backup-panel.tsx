import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { diasDesdeBackup, exportarBackup, restaurarBackup } from "@/data/backup";
import { todaySP } from "@/lib/metrics/dates";
import { Painel } from "@/components/dashboard/panels";

type Props = { ultimoBackup: string | null; temDados: boolean; aoMudar: () => Promise<void> | void };

export function BackupPanel({ ultimoBackup, temDados, aoMudar }: Props) {
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const dias = diasDesdeBackup(ultimoBackup, new Date());

  let lembrete: string | null = null;
  if (dias === null && temDados) lembrete = "Você ainda não fez backup. Salve um para não perder seu progresso.";
  else if (dias !== null && dias >= 7) lembrete = `Seu último backup foi há ${dias} dias. Salve um novo.`;

  async function salvar() {
    const backup = await exportarBackup();
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `oftastudy-backup-${todaySP()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setAviso({ tipo: "ok", texto: "Backup salvo na pasta de downloads." });
    await aoMudar();
  }

  async function restaurar(arquivo: File | undefined) {
    if (!arquivo) return;
    let json: unknown;
    try {
      json = JSON.parse(await arquivo.text());
    } catch {
      setAviso({ tipo: "erro", texto: "Este arquivo não é um backup do OftaStudy. Nada foi alterado." });
      return;
    }
    const r = await restaurarBackup(json);
    setAviso(r.ok ? { tipo: "ok", texto: "Backup restaurado." } : { tipo: "erro", texto: r.erro });
    if (r.ok) await aoMudar();
  }

  return (
    <Painel titulo="Backup dos seus dados">
      <p className="text-sm text-slate-600">
        Seus dados ficam salvos <strong>só neste aparelho</strong>. O backup é um arquivo que guarda tudo; use-o para não perder nada ou para levar seu progresso para outro aparelho.
      </p>
      {lembrete && <p className="mt-3 rounded-lg bg-act-revisao/20 px-3 py-2 text-sm text-navy">{lembrete}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={salvar} className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-soft">
          <Download size={16} /> Salvar backup
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-navy/20 bg-white px-4 py-2 text-sm text-navy hover:bg-sky-soft">
          <Upload size={16} /> Restaurar backup
          <input type="file" accept="application/json,.json" aria-label="Restaurar backup" className="sr-only" onChange={(e) => { void restaurar(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      </div>
      <p className="mt-2 text-xs text-slate-400">Restaurar substitui tudo o que está neste aparelho pelo conteúdo do arquivo.</p>
      {aviso && (
        <p role={aviso.tipo === "erro" ? "alert" : "status"} className={`mt-3 text-sm ${aviso.tipo === "erro" ? "text-red-700" : "text-emerald-700"}`}>
          {aviso.texto}
        </p>
      )}
    </Painel>
  );
}
