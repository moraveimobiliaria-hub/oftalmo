import { db, type Perfil } from "./db";
import { iniciarBanco } from "./seed";

export type Resultado = { ok: true } | { ok: false; erro: string };

export async function getPerfil(): Promise<Perfil> {
  await iniciarBanco();
  return (await db.profile.get(1))!;
}

/** AAAA-MM-DD de um dia que existe no calendário (recusa "", "31/12/2027" e 2027-02-31). */
export function dataIsoValida(texto: unknown): texto is string {
  if (typeof texto !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const d = new Date(`${texto}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === texto;
}

/** Devolve a mensagem de erro, ou null se o perfil está válido. */
export function validarPerfil(p: Perfil): string | null {
  if (typeof p.nome !== "string" || (p.nome.length > 0 && p.nome.trim().length === 0)) return "Informe um nome válido.";
  if (!dataIsoValida(p.metaCronograma)) return "Informe uma data válida para a meta do cronograma.";
  if (!dataIsoValida(p.inicioEstudos)) return "A data de início dos estudos é inválida.";
  if (p.horasDiarias !== null && (typeof p.horasDiarias !== "number" || !(p.horasDiarias >= 0.5) || p.horasDiarias > 16))
    return "As horas diárias devem ficar entre 0,5 e 16.";
  if ((p.provaMes === null) !== (p.provaAno === null)) return "Informe o mês e o ano da prova, ou deixe os dois vazios.";
  if (p.provaMes !== null && (!Number.isInteger(p.provaMes) || p.provaMes < 1 || p.provaMes > 12)) return "O mês da prova deve ser de 1 a 12.";
  if (p.provaAno !== null && (!Number.isInteger(p.provaAno) || p.provaAno < 2026)) return "O ano da prova deve ser 2026 ou depois.";
  if (p.ultimoBackup !== null && typeof p.ultimoBackup !== "string") return "O registro do último backup é inválido.";
  return null;
}

/** Atualiza só os campos informados. Se algo for inválido, não grava nada. */
export async function salvarPerfil(parcial: Partial<Omit<Perfil, "id">>): Promise<Resultado> {
  const atual = await getPerfil();
  const novo: Perfil = { ...atual, ...parcial, id: 1 };
  // Nome só com espaços fica como veio, para a validação recusar; nos demais casos, sem espaços nas pontas.
  if (parcial.nome !== undefined && parcial.nome.trim() !== "") novo.nome = parcial.nome.trim();
  const erro = validarPerfil(novo);
  if (erro) return { ok: false, erro };
  await db.profile.put(novo);
  return { ok: true };
}
