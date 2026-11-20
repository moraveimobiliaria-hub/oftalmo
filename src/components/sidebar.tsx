import { Link, useLocation } from "react-router";
import { NAV_ITEMS } from "@/lib/nav";
import { NAV_ICONS } from "./nav-icons";
import { Logo } from "./logo";

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-navy px-4 py-6 text-white lg:flex">
      <Link to="/inicio" className="mb-8 px-2">
        <Logo light />
      </Link>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Menu principal">
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICONS[item.slug];
          const active = pathname === item.href;
          return (
            <Link
              key={item.slug}
              to={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active ? "bg-white/15 font-medium" : "text-white/75 hover:bg-white/10"
              }`}
            >
              <Icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
