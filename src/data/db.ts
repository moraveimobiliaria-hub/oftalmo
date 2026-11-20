import Dexie, { type EntityTable } from "dexie";

export type Perfil = {
  id: 1;
  nome: string;
  /** AAAA-MM-DD */
  metaCronograma: string;
  provaMes: number | null;
  provaAno: number | null;
  horasDiarias: number | null;
  /** ISO do último backup salvo, ou null */
  ultimoBackup: string | null;
  /** AAAA-MM-DD do primeiro uso */
  inicioEstudos: string;
};

export type Especialidade = { id?: number; nome: string; ordem: number };
export type Assunto = { id?: number; specialtyId: number; nome: string };
export type Aula = {
  id?: number;
  specialtyId: number;
  titulo: string;
  descricao?: string;
  duracaoSeg?: number;
  /** Fase 2: "pasta" = arquivo no computador; "drive" = link do Google Drive */
  fonte: "pasta" | "drive";
  link?: string;
};
export type ProgressoAula = { lessonId: number; posicaoSeg: number; concluida: boolean; ultimoAcesso: string };
export type Questao = { id?: number; specialtyId: number | null; enunciado: string; correta: string | null; comentario?: string };
export type Alternativa = { id?: number; questionId: number; letra: string; texto: string };
export type Tentativa = { id?: number; questionId: number; specialtyId: number; escolhida: string | null; correta: boolean; respondidaEm: string };
export type SessaoEstudo = { id?: number; inicio: string; duracaoSeg: number; tipo: string };

class OftaDB extends Dexie {
  profile!: EntityTable<Perfil, "id">;
  specialties!: EntityTable<Especialidade, "id">;
  subjects!: EntityTable<Assunto, "id">;
  lessons!: EntityTable<Aula, "id">;
  lessonProgress!: EntityTable<ProgressoAula, "lessonId">;
  questions!: EntityTable<Questao, "id">;
  options!: EntityTable<Alternativa, "id">;
  attempts!: EntityTable<Tentativa, "id">;
  studySessions!: EntityTable<SessaoEstudo, "id">;

  constructor() {
    super("oftastudy");
    this.version(1).stores({
      profile: "id",
      specialties: "++id, &nome, ordem",
      subjects: "++id, specialtyId",
      lessons: "++id, specialtyId",
      lessonProgress: "lessonId, ultimoAcesso",
      questions: "++id, specialtyId",
      options: "++id, questionId",
      attempts: "++id, questionId, specialtyId, respondidaEm",
      studySessions: "++id, inicio",
    });
  }
}

export const db = new OftaDB();

/** Nomes de todas as tabelas, usado pelo backup. */
export const TABELAS = [
  "profile", "specialties", "subjects", "lessons", "lessonProgress",
  "questions", "options", "attempts", "studySessions",
] as const;
