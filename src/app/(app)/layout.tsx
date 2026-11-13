import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 lg:px-10 lg:pb-10">{children}</main>
      <BottomNav />
    </div>
  );
}
