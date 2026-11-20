import type { Table } from "dexie";
import { db, TABELAS } from "./db";
import { iniciarBanco } from "./seed";
import type { Resultado } from "./profile";

export type Backup = { versao: 1; geradoEm: string; dados: Record<string, unknown[]> };

const tabela = (nome: string) => (db as unknown as Record<string, Table>)[nome];

/** Junta todos os dados num objeto (para virar arquivo .json) e anota a data do backup. */
export async function exportarBackup(): Promise<Backup> {
  await iniciarBanco();
  const agora = new Date().toISOString();
  await db.profile.update(1, { ultimoBackup: agora });
  const dados: Record<string, unknown[]> = {};
  for (const nome of TABELAS) dados[nome] = await tabela(nome).toArray();
  return { versao: 1, geradoEm: agora, dados };
}

function validar(json: unknown): string | null {
  if (typeof json !== "object" || json === null) return "Este arquivo não é um backup do OftaStudy.";
  const b = json as { versao?: unknown; dados?: unknown };
  if (b.versao !== 1) return "Versão de backup desconhecida. Nada foi alterado.";
  if (typeof b.dados !== "object" || b.dados === null || Array.isArray(b.dados)) return "O backup está incompleto.";
  const dados = b.dados as Record<string, unknown>;
  const desconhecidas = Object.keys(dados).filter((k) => !(TABELAS as readonly string[]).includes(k));
  if (desconhecidas.length) return "O backup contém dados que este app não reconhece. Nada foi alterado.";
  for (const nome of TABELAS) {
    const linhas = dados[nome];
    if (!Array.isArray(linhas)) return "O backup está incompleto.";
    if (linhas.some((l) => typeof l !== "object" || l === null || Array.isArray(l))) return "O backup está corrompido.";
  }
  return null;
}

/** Troca TODOS os dados atuais pelos do backup, de uma vez só. Se algo falhar, nada muda. */
export async function restaurarBackup(json: unknown): Promise<Resultado> {
  const erro = validar(json);
  if (erro) return { ok: false, erro };
  const dados = (json as Backup).dados;
  try {
    await db.transaction("rw", TABELAS.map(tabela), async () => {
      for (const nome of TABELAS) {
        await tabela(nome).clear();
        await tabela(nome).bulkAdd(dados[nome]);
      }
    });
  } catch {
    return { ok: false, erro: "Não foi possível restaurar este backup. Seus dados atuais foram mantidos." };
  }
  await iniciarBanco();
  return { ok: true };
}

/** Dias desde o último backup; null se nunca houve; nunca negativo. */
export function diasDesdeBackup(ultimo: string | null, hoje: Date): number | null {
  if (!ultimo) return null;
  const dias = Math.floor((hoje.getTime() - new Date(ultimo).getTime()) / 86_400_000);
  return Math.max(0, dias);
}

/** Há algo que valha proteger com backup? (nome preenchido ou qualquer dado além das especialidades iniciais) */
export async function temDadosParaProteger(): Promise<boolean> {
  const perfil = await db.profile.get(1);
  if (perfil && perfil.nome !== "") return true;
  const contagens = await Promise.all([
    db.subjects.count(), db.lessons.count(), db.lessonProgress.count(),
    db.questions.count(), db.attempts.count(), db.studySessions.count(),
  ]);
  return contagens.some((n) => n > 0);
}
