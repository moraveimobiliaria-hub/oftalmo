import { db } from "./db";
import { getPerfil } from "./profile";
import { accuracyPercent } from "@/lib/metrics/accuracy";
import { accuracyBySpecialty } from "@/lib/metrics/specialty";
import { daysUntilExam, scheduleProgress } from "@/lib/metrics/schedule";
import { totalHours } from "@/lib/metrics/hours";

export type DashboardData = {
  nome: string;
  horas: number;
  aulasConcluidas: number;
  questoesRespondidas: number;
  acertoPct: number | null;
  revisoesPendentes: number;
  progressoCronograma: { pct: number; daysLeft: number };
  metaCronograma: string;
  diasProva: number | null;
  provaMes: number | null;
  provaAno: number | null;
  porEspecialidade: { nome: string; pct: number; total: number }[];
  ultimaAula: { titulo: string; posicaoSeg: number } | null;
  tarefasHoje: { titulo: string; tipo: string }[];
};

export async function carregarDashboard(hoje: Date): Promise<DashboardData> {
  const perfil = await getPerfil();
  const [tentativas, sessoes, progresso, especialidades] = await Promise.all([
    db.attempts.toArray(),
    db.studySessions.toArray(),
    db.lessonProgress.toArray(),
    db.specialties.toArray(),
  ]);

  const certas = tentativas.filter((t) => t.correta).length;
  const nomePorId = new Map(especialidades.map((e) => [e.id!, e.nome]));
  const porEspecialidade = accuracyBySpecialty(tentativas.map((t) => ({ specialty_id: String(t.specialtyId), correta: t.correta })))
    .map((e) => ({ nome: nomePorId.get(Number(e.specialty_id)) ?? "Sem especialidade", pct: e.pct, total: e.total }));

  const ordenadas = [...progresso].sort((a, b) => b.ultimoAcesso.localeCompare(a.ultimoAcesso));
  let ultimaAula: DashboardData["ultimaAula"] = null;
  for (const p of ordenadas) {
    const aula = await db.lessons.get(p.lessonId);
    if (aula) {
      ultimaAula = { titulo: aula.titulo, posicaoSeg: p.posicaoSeg };
      break;
    }
  }

  const inicio = new Date(`${perfil.inicioEstudos}T12:00:00Z`);
  const meta = new Date(`${perfil.metaCronograma}T12:00:00Z`);

  return {
    nome: perfil.nome,
    horas: totalHours(sessoes.map((s) => ({ duracao_seg: s.duracaoSeg }))),
    aulasConcluidas: progresso.filter((p) => p.concluida).length,
    questoesRespondidas: tentativas.length,
    acertoPct: accuracyPercent(certas, tentativas.length),
    revisoesPendentes: 0,
    progressoCronograma: scheduleProgress(inicio, meta, hoje),
    metaCronograma: perfil.metaCronograma,
    diasProva: daysUntilExam(hoje, perfil.provaMes, perfil.provaAno),
    provaMes: perfil.provaMes,
    provaAno: perfil.provaAno,
    porEspecialidade,
    ultimaAula,
    tarefasHoje: [],
  };
}
