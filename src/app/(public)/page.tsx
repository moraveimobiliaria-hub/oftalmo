import Link from "next/link";
import { Logo } from "@/components/logo";

export default function PaginaInicial() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-white">
      <Logo light className="mb-8 scale-125" />
      <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
        Seu caminho até a prova do CBO, em um só lugar.
      </h1>
      <p className="mt-4 max-w-md text-white/70">
        Videoaulas, questões, revisões e cronograma organizados para você estudar de qualquer lugar.
      </p>
      <Link href="/login" className="mt-8 rounded-lg bg-aqua px-8 py-3 font-medium text-navy transition hover:brightness-110">
        Entrar
      </Link>
    </main>
  );
}
