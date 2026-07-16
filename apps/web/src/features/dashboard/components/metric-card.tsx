interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}

export function MetricCard({ label, value, icon, accent = false }: MetricCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-3 uppercase tracking-wider">{label}</span>
        <span className={accent ? 'text-accent' : 'text-text-3'}>{icon}</span>
      </div>
      <p className={`font-display text-3xl font-bold tabular-nums ${accent ? 'text-accent' : 'text-text-1'}`}>
        {value.toLocaleString('pt-BR')}
      </p>
    </div>
  );
}
