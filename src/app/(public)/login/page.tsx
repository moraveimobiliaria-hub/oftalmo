"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password: senha });
    if (error) {
      setErro("E-mail ou senha incorretos");
      setEnviando(false);
      return;
    }
    router.replace("/inicio");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <form onSubmit={entrar} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-6 text-center text-lg font-medium text-navy">Entrar na sua conta</h1>
        <label htmlFor="email" className="mb-1 block text-sm text-slate-600">E-mail</label>
        <input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-act-aula" />
        <label htmlFor="senha" className="mb-1 block text-sm text-slate-600">Senha</label>
        <input id="senha" type="password" required autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-act-aula" />
        {erro && <p role="alert" className="mb-4 text-sm text-red-600">{erro}</p>}
        <button disabled={enviando} className="w-full rounded-lg bg-navy py-2.5 font-medium text-white transition hover:bg-navy-soft disabled:opacity-60">
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
