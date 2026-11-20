import { Navigate, Outlet, Route, Routes } from "react-router";
import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import Inicio from "@/pages/Inicio";
import Perfil from "@/pages/Perfil";
import Futura from "@/pages/Futura";

function Casca() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 lg:px-10 lg:pb-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Casca />}>
        <Route index element={<Navigate to="/inicio" replace />} />
        <Route path="inicio" element={<Inicio />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path=":secao" element={<Futura />} />
      </Route>
    </Routes>
  );
}
