import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/data/db";
import { iniciarBanco } from "@/data/seed";
import { getPerfil, salvarPerfil } from "@/data/profile";

beforeEach(async () => {
  await db.delete();
  await db.open();
});

describe("iniciarBanco", () => {
  it("cria as 14 especialidades iniciais", async () => {
    await iniciarBanco();
    expect(await db.specialties.count()).toBe(14);
    const nomes = (await db.specialties.orderBy("ordem").toArray()).map((e) => e.nome);
    expect(nomes[0]).toBe("Anatomia e fisiologia ocular");
    expect(nomes[13]).toBe("Cirurgia refrativa");
  });

  it("chamar duas vezes (ou ao mesmo tempo) continua com 14", async () => {
    await Promise.all([iniciarBanco(), iniciarBanco()]);
    await iniciarBanco();
    expect(await db.specialties.count()).toBe(14);
    expect(await db.profile.count()).toBe(1);
  });

  it("não recria especialidade que o usuário apagou de propósito", async () => {
    await iniciarBanco();
    const catarata = await db.specialties.where("nome").equals("Catarata").first();
    await db.specialties.delete(catarata!.id!);
    await iniciarBanco();
    expect(await db.specialties.count()).toBe(13);
  });
});

describe("perfil", () => {
  it("perfil padrão tem a meta de 31/12/2027 e prova indefinida", async () => {
    await iniciarBanco();
    const p = await getPerfil();
    expect(p.metaCronograma).toBe("2027-12-31");
    expect(p.provaMes).toBeNull();
    expect(p.provaAno).toBeNull();
    expect(p.ultimoBackup).toBeNull();
  });

  it("recusa horas diárias fora de 0,5–16", async () => {
    await iniciarBanco();
    expect((await salvarPerfil({ horasDiarias: 30 })).ok).toBe(false);
    expect((await salvarPerfil({ horasDiarias: 0.1 })).ok).toBe(false);
    expect((await salvarPerfil({ horasDiarias: 4 })).ok).toBe(true);
  });

  it("recusa mês sem ano, ano sem mês, mês 13 e ano passado", async () => {
    await iniciarBanco();
    expect((await salvarPerfil({ provaMes: 3 })).ok).toBe(false);
    expect((await salvarPerfil({ provaAno: 2029 })).ok).toBe(false);
    expect((await salvarPerfil({ provaMes: 13, provaAno: 2029 })).ok).toBe(false);
    expect((await salvarPerfil({ provaMes: 6, provaAno: 2020 })).ok).toBe(false);
  });

  it("recusa meta de cronograma vazia ou inválida (evita NaN no dashboard)", async () => {
    await iniciarBanco();
    expect((await salvarPerfil({ metaCronograma: "" })).ok).toBe(false);
    expect((await salvarPerfil({ metaCronograma: "31/12/2027" })).ok).toBe(false);
    expect((await salvarPerfil({ metaCronograma: "2027-02-31" })).ok).toBe(false);
    expect((await salvarPerfil({ metaCronograma: "2028-06-30" })).ok).toBe(true);
  });

  it("recusa nome só com espaços", async () => {
    await iniciarBanco();
    expect((await salvarPerfil({ nome: "   " })).ok).toBe(false);
  });

  it("salva e devolve nome e prova", async () => {
    await iniciarBanco();
    const r = await salvarPerfil({ nome: "Dr. Teste", provaMes: 6, provaAno: 2029 });
    expect(r.ok).toBe(true);
    const p = await getPerfil();
    expect(p.nome).toBe("Dr. Teste");
    expect(p.provaMes).toBe(6);
    expect(p.provaAno).toBe(2029);
  });

  it("recusa que falha não altera o perfil", async () => {
    await iniciarBanco();
    await salvarPerfil({ nome: "Dr. Teste" });
    await salvarPerfil({ nome: "Outro", horasDiarias: 99 });
    expect((await getPerfil()).nome).toBe("Dr. Teste");
  });
});
