import { Logo } from "@/components/logo";

export default function ErroDados() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <Logo />
      <h1 className="text-xl font-semibold text-navy">Não foi possível salvar dados neste navegador</h1>
      <p className="max-w-md text-slate-600">
        O OftaStudy guarda tudo no próprio navegador. Isso não está funcionando aqui. Tente sair da aba anônima/privada,
        liberar o armazenamento do site nas configurações do navegador, ou abrir em outro navegador (Edge, Chrome ou Safari).
      </p>
    </main>
  );
}
