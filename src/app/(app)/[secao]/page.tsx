import { notFound } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

export function generateStaticParams() {
  return NAV_ITEMS.filter((i) => i.fase !== null).map((i) => ({ secao: i.slug }));
}

export default async function SecaoFutura({ params }: { params: Promise<{ secao: string }> }) {
  const { secao } = await params;
  const item = NAV_ITEMS.find((i) => i.slug === secao && i.fase !== null);
  if (!item) notFound();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">{item.label}</h1>
      <div className="mt-6 rounded-2xl border border-dashed bg-white p-8 text-slate-600">
        Disponível na Fase {item.fase}. Esta parte ainda não foi construída.
      </div>
    </div>
  );
}
