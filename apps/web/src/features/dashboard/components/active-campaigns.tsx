import type { ActiveCampaign } from '../types';

interface ActiveCampaignsProps {
  campaigns: ActiveCampaign[];
}

const STATUS_CONFIG = {
  searching: { label: 'Buscando', className: 'text-warning bg-warning/10' },
  review: { label: 'Revisar', className: 'text-accent bg-accent-soft' },
  running: { label: 'Ativa', className: 'text-success bg-success-soft' },
  paused: { label: 'Pausada', className: 'text-text-3 bg-surface-raised' },
} satisfies Record<ActiveCampaign['status'], { label: string; className: string }>;

export function ActiveCampaigns({ campaigns }: ActiveCampaignsProps) {
  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-display text-sm font-semibold text-text-1">Campanhas ativas</h2>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-1">
          <span className="text-text-3 text-sm">Nenhuma campanha em andamento.</span>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {campaigns.map((campaign) => {
            const config = STATUS_CONFIG[campaign.status];
            const progress =
              campaign.metrics.leadsApproved > 0
                ? Math.round((campaign.metrics.messagesSent / campaign.metrics.leadsApproved) * 100)
                : 0;

            return (
              <div key={campaign.id} className="px-6 py-4 flex items-center gap-4">
                {/* Nome + status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-text-1 truncate">{campaign.name}</p>
                    <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.className}`}>
                      {config.label}
                    </span>
                  </div>
                  {/* Barra de progresso do disparo */}
                  <div className="h-1 w-full bg-surface-raised rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Números */}
                <div className="shrink-0 flex gap-5 text-right">
                  <div>
                    <p className="text-xs text-text-3">Leads</p>
                    <p className="text-sm font-semibold text-text-1 tabular-nums">
                      {campaign.metrics.leadsApproved}/{campaign.metrics.leadsFound}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-3">Respostas</p>
                    <p className="text-sm font-semibold text-text-1 tabular-nums">
                      {campaign.metrics.messagesReplied}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
