import type { DashboardData } from "./dashboard";

/** Números ilustrativos, só para ver o dashboard "cheio". Nunca são gravados. */
export const DADOS_DEMONSTRACAO: DashboardData = {
  nome: "Aluno(a) de exemplo",
  horas: 86.5,
  aulasConcluidas: 42,
  questoesRespondidas: 1280,
  acertoPct: 72,
  revisoesPendentes: 18,
  progressoCronograma: { pct: 34, daysLeft: 410 },
  metaCronograma: "2027-12-31",
  diasProva: 780,
  provaMes: 6,
  provaAno: 2029,
  porEspecialidade: [
    { nome: "Retina", pct: 81, total: 210 },
    { nome: "Glaucoma", pct: 76, total: 180 },
    { nome: "Catarata", pct: 74, total: 150 },
    { nome: "Córnea", pct: 68, total: 140 },
    { nome: "Estrabismo", pct: 61, total: 95 },
    { nome: "Neuro-oftalmologia", pct: 54, total: 80 },
  ],
  ultimaAula: { titulo: "Glaucoma de ângulo aberto — fisiopatologia", posicaoSeg: 1325 },
  tarefasHoje: [
    { titulo: "Assistir: Retina — descolamento", tipo: "aula" },
    { titulo: "30 questões de Glaucoma", tipo: "questoes" },
    { titulo: "Revisar: Catarata congênita", tipo: "revisao" },
  ],
};
