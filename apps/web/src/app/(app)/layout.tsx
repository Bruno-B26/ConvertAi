import { Sidebar } from '@/components/layout/sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="w-64 shrink-0 bg-surface border-r border-border">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
