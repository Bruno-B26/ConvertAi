import type { DashboardMetrics } from '../types';

interface ConversionFunnelProps {
  metrics: DashboardMetrics;
}

interface FunnelStep {
  label: string;
  value: number;
  base: number;
}

export function ConversionFunnel({ metrics }: ConversionFunnelProps) {
  const steps: FunnelStep[] = [
    { label: 'Encontrados', value: metrics.leadsFound, base: metrics.leadsFound },
    { label: 'Aprovados', value: metrics.leadsApproved, base: metrics.leadsFound },
    { label: 'Enviados', value: metrics.messagesSent, base: metrics.leadsFound },
    { label: 'Entregues', value: metrics.messagesDelivered, base: metrics.leadsFound },
    { label: 'Respondidos', value: metrics.messagesReplied, base: metrics.leadsFound },
    { label: 'Reuniões', value: metrics.meetingsScheduled, base: metrics.leadsFound },
    { label: 'Conversões', value: metrics.conversions, base: metrics.leadsFound },
  ];

  const isEmpty = metrics.leadsFound === 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
      <h2 className="font-display text-sm font-semibold text-text-1 mb-6">
        Funil de conversão
      </h2>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <span className="text-text-3 text-sm">Nenhuma campanha com dados ainda.</span>
          <span className="text-text-3 text-xs">Os dados aparecerão aqui assim que uma campanha retornar leads.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => {
            const pct = step.base > 0 ? Math.round((step.value / step.base) * 100) : 0;
            const isLast = i === steps.length - 1;

            return (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-text-2">{step.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-3 tabular-nums w-10 text-right">{pct}%</span>
                    <span className={`text-sm font-semibold tabular-nums w-16 text-right ${isLast ? 'text-accent' : 'text-text-1'}`}>
                      {step.value.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-surface-raised rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isLast ? 'bg-accent' : 'bg-border-strong'}`}
                    style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
