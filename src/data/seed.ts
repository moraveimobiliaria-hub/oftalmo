import { db } from "./db";
import { todaySP } from "@/lib/metrics/dates";

export const ESPECIALIDADES_INICIAIS = [
  "Anatomia e fisiologia ocular", "Catarata", "Glaucoma", "Retina", "Córnea", "Uveítes",
  "Neuro-oftalmologia", "Estrabismo", "Oftalmopediatria", "Órbita e plástica ocular",
  "Lentes de contato e refração", "Emergências oftalmológicas", "Oncologia ocular", "Cirurgia refrativa",
];

/** Primeira abertura: cria o perfil padrão e as 14 especialidades. Nas seguintes, não faz nada. */
export async function iniciarBanco(): Promise<void> {
  await db.transaction("rw", db.profile, db.specialties, async () => {
    if (await db.profile.get(1)) return;
    await db.profile.add({
      id: 1,
      nome: "",
      metaCronograma: "2027-12-31",
      provaMes: null,
      provaAno: null,
      horasDiarias: null,
      ultimoBackup: null,
      inicioEstudos: todaySP(),
    });
    await db.specialties.bulkAdd(ESPECIALIDADES_INICIAIS.map((nome, i) => ({ nome, ordem: i + 1 })));
  });
}
