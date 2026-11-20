import { useParams } from "react-router";
import { NAV_ITEMS } from "@/lib/nav";

export default function Futura() {
  const { secao } = useParams();
  const item = NAV_ITEMS.find((i) => i.slug === secao && i.fase !== null);
  if (!item) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-navy">Página não encontrada</h1>
        <p className="mt-2 text-slate-600">Use o menu para voltar a uma seção existente.</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">{item.label}</h1>
      <div className="mt-6 rounded-2xl border border-dashed bg-white p-8 text-slate-600">
        Disponível na Fase {item.fase}. Esta parte ainda não foi construída.
      </div>
    </div>
  );
}
