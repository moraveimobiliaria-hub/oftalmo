import { useState } from "react";
import { Link, useLocation } from "react-router";
import { MoreHorizontal } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { NAV_ICONS } from "./nav-icons";

const MAIN = ["inicio", "videoaulas", "banco-de-questoes", "revisoes"];

export function BottomNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const main = NAV_ITEMS.filter((i) => MAIN.includes(i.slug));
  return (
    <div className="lg:hidden">
      {open && (
        <div className="fixed inset-x-0 bottom-16 z-40 mx-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5">
          <div className="grid grid-cols-3 gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = NAV_ICONS[item.slug];
              return (
                <Link
                  key={item.slug}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl p-3 text-center text-xs text-navy hover:bg-sky-soft"
                >
                  <Icon size={20} /> {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <nav aria-label="Menu principal" className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t bg-white">
        {main.map((item) => {
          const Icon = NAV_ICONS[item.slug];
          const active = pathname === item.href;
          return (
            <Link
              key={item.slug}
              to={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-0.5 text-[11px] ${active ? "font-medium text-act-aula" : "text-slate-500"}`}
            >
              <Icon size={20} /> {item.label.replace("Banco de questões", "Questões")}
            </Link>
          );
        })}
        <button onClick={() => setOpen((o) => !o)} className="flex flex-col items-center gap-0.5 text-[11px] text-slate-500">
          <MoreHorizontal size={20} /> Mais
        </button>
      </nav>
    </div>
  );
}
