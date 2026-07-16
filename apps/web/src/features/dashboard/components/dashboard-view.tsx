'use client';

import { useDashboard } from '../hooks/use-dashboard';
import { MetricCard } from './metric-card';
import { ConversionFunnel } from './conversion-funnel';
import { ActiveCampaigns } from './active-campaigns';

const METRIC_CARDS = [
  {
    key: 'leadsFound' as const,
    label: 'Leads encontrados',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'leadsApproved' as const,
    label: 'Leads aprovados',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'messagesSent' as const,
    label: 'Mensagens enviadas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M14 2L9 14l-2.5-5L1 6.5 14 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'messagesDelivered' as const,
    label: 'Entregues',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8l4 4 10-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        <path d="M5 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'messagesReplied' as const,
    label: 'Respondidos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M14 10c0 .6-.4 1-1 1H5l-3 3V3c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'meetingsScheduled' as const,
    label: 'Reuniões agendadas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'conversions' as const,
    label: 'Conversões',
    accent: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 12l4-5 3 3 2-2.5 3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function DashboardView() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-1">Painel</h1>
        <p className="mt-1 text-sm text-text-3">Visão geral de todas as suas campanhas</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {METRIC_CARDS.map((card) => (
          <div key={card.key} className={isLoading ? 'animate-pulse' : ''}>
            <MetricCard
              label={card.label}
              value={data?.metrics[card.key] ?? 0}
              icon={card.icon}
              accent={card.accent}
            />
          </div>
        ))}
      </div>

      {/* Funil + Campanhas ativas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionFunnel metrics={data?.metrics ?? {
          leadsFound: 0,
          leadsApproved: 0,
          messagesSent: 0,
          messagesDelivered: 0,
          messagesReplied: 0,
          meetingsScheduled: 0,
          conversions: 0,
        }} />
        <ActiveCampaigns campaigns={data?.activeCampaigns ?? []} />
      </div>
    </div>
  );
}
