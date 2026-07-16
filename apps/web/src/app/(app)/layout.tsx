import { Topbar } from '@/components/layout/topbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Topbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
