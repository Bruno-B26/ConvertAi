import clsx from 'clsx';
import type { Lead } from '../types';

const SECTOR_STYLES: Record<string, string> = {
  Tecnologia: 'bg-blue-500/15 text-blue-400',
  Comércio: 'bg-purple-500/15 text-purple-400',
  Serviços: 'bg-indigo-500/15 text-indigo-400',
  Saúde: 'bg-pink-500/15 text-pink-400',
  Educação: 'bg-orange-500/15 text-orange-400',
  Logística: 'bg-cyan-500/15 text-cyan-400',
  Alimentação: 'bg-amber-500/15 text-amber-400',
  Indústria: 'bg-slate-500/15 text-slate-400',
  Imobiliário: 'bg-teal-500/15 text-teal-400',
  'Construção Civil': 'bg-yellow-500/15 text-yellow-400',
};

function getSectorStyle(sector: string | null): string {
  if (!sector) return 'bg-white/5 text-gray-400';
  return SECTOR_STYLES[sector] ?? 'bg-white/5 text-gray-400';
}

function formatCapitalSocial(value: number | null): string {
  if (value === null) return '—';
  if (value < 50_000) return 'Até R$ 50 mil';
  if (value < 360_000) return 'R$ 50–360 mil';
  if (value < 1_000_000) return 'R$ 360 mil–1M';
  if (value < 10_000_000) return 'R$ 1M–10M';
  return 'Acima de R$ 10M';
}

interface LeadRowProps {
  lead: Lead;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function LeadRow({ lead, onApprove, onReject }: LeadRowProps) {
  const isApproved = lead.status === 'approved';
  const isRejected = lead.status === 'rejected';

  return (
    <div
      className={clsx(
        'flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-b-0 transition-opacity',
        isRejected && 'opacity-40',
      )}
    >
      {/* Empresa */}
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-semibold truncate', isRejected ? 'text-gray-500' : 'text-white')}>
          {lead.company.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {[lead.company.address.city, lead.company.address.state].filter(Boolean).join(', ') || '—'}
        </p>
      </div>

      {/* Segmento */}
      <div className="hidden sm:block w-44 shrink-0">
        <span
          className={clsx(
            'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide truncate max-w-full',
            getSectorStyle(lead.company.sector),
          )}
        >
          {lead.company.sector ?? lead.company.cnaeDescription ?? 'N/D'}
        </span>
      </div>

      {/* Porte */}
      <div className="hidden md:block w-28 shrink-0 text-sm text-gray-400">
        {lead.company.size ?? '—'}
      </div>

      {/* Faturamento */}
      <div className="hidden lg:block w-32 shrink-0 text-sm text-gray-400">
        {formatCapitalSocial(lead.company.capitalSocial)}
      </div>

      {/* Ações / status */}
      <div className="flex items-center gap-2 shrink-0 w-36 justify-end">
        {isApproved ? (
          <span className="text-sm font-semibold text-green-400 uppercase tracking-wide">Aprovado</span>
        ) : isRejected ? (
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Removido</span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onReject(lead.id)}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-gray-300 hover:border-white/30 hover:text-white transition-colors"
            >
              Remover
            </button>
            <button
              type="button"
              onClick={() => onApprove(lead.id)}
              className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400 hover:bg-green-500/20 hover:border-green-500/40 transition-colors"
            >
              Aprovar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
