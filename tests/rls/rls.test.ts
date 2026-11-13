import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { config } from "dotenv";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const emailA = process.env.E2E_EMAIL;
const senhaA = process.env.E2E_SENHA;
const emailB = process.env.E2E_EMAIL_B;
const senhaB = process.env.E2E_SENHA_B;

const TABELAS = [
  "profiles", "specialties", "subjects", "lessons", "lesson_progress",
  "questions", "question_options", "question_attempts", "study_sessions",
];

const temConfig = Boolean(url && key && emailA && senhaA);

async function entrar(email: string, senha: string): Promise<SupabaseClient> {
  const c = createClient(url!, key!, { auth: { persistSession: false } });
  const { error } = await c.auth.signInWithPassword({ email, password: senha });
  if (error) throw new Error(`Login de teste falhou: ${error.message}`);
  return c;
}

describe.skipIf(!temConfig)("RLS — cada usuário só vê o que é seu", () => {
  let anon: SupabaseClient;
  let a: SupabaseClient;
  let lessonId: string | undefined;

  beforeAll(async () => {
    anon = createClient(url!, key!, { auth: { persistSession: false } });
    a = await entrar(emailA!, senhaA!);
  });

  afterAll(async () => {
    if (lessonId) await a.from("lessons").delete().eq("id", lessonId);
  });

  it("visitante sem login não lê nenhuma tabela", async () => {
    for (const t of TABELAS) {
      const { data } = await anon.from(t).select("*").limit(5);
      expect(data ?? [], t).toHaveLength(0);
    }
  });

  it("usuário logado vê suas 14 especialidades", async () => {
    const { data, error } = await a.from("specialties").select("nome");
    expect(error).toBeNull();
    expect(data).toHaveLength(14);
  });

  it("não é possível gravar linha em nome de outro usuário", async () => {
    const { data: esp } = await a.from("specialties").select("id").limit(1).single();
    const { error } = await a.from("study_sessions").insert({ user_id: randomUUID(), duracao_seg: 60 });
    expect(error).not.toBeNull();
    expect(esp).not.toBeNull();
  });

  it.skipIf(!emailB || !senhaB)("segundo usuário não vê nem altera dados do primeiro", async () => {
    const b = await entrar(emailB!, senhaB!);
    const { data: esp } = await a.from("specialties").select("id").limit(1).single();
    const { data: aula, error } = await a
      .from("lessons")
      .insert({ specialty_id: esp!.id, titulo: "aula-rls-teste" })
      .select("id")
      .single();
    expect(error).toBeNull();
    lessonId = aula!.id;

    const { data: vistoPorB } = await b.from("lessons").select("id").eq("id", lessonId!);
    expect(vistoPorB).toHaveLength(0);

    await b.from("lessons").update({ titulo: "invadido" }).eq("id", lessonId!);
    const { data: depois } = await a.from("lessons").select("titulo").eq("id", lessonId!).single();
    expect(depois!.titulo).toBe("aula-rls-teste");
  });
});
