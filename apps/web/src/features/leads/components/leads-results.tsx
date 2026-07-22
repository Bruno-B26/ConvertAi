import type { Lead } from '../types';
import { LeadRow } from './lead-row';

interface LeadsResultsProps {
  leads: Lead[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onApproveAll: () => void;
  onConfigureCampaign: () => void;
}

export function LeadsResults({
  leads,
  onApprove,
  onReject,
  onApproveAll,
  onConfigureCampaign,
}: LeadsResultsProps) {
  const total = leads.length;
  const approvedCount = leads.filter((l) => l.status === 'approved').length;
  const pendingCount = leads.filter((l) => l.status === 'found').length;

  return (
    <div className="rounded-xl bg-[#161616] border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-white">{total} leads encontrados</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              {pendingCount} para revisar
            </span>
          )}
          {approvedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs text-green-400">
              {approvedCount} aprovado{approvedCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {pendingCount > 0 && (
          <button
            type="button"
            onClick={onApproveAll}
            className="shrink-0 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-gray-300 hover:border-white/30 hover:text-white transition-colors"
          >
            Aprovar todos os restantes
          </button>
        )}
      </div>

      {/* Column headers — only on larger screens */}
      <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex-1 text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</div>
        <div className="w-44 shrink-0 text-xs font-medium text-gray-500 uppercase tracking-wider">Segmento</div>
        <div className="w-28 shrink-0 text-xs font-medium text-gray-500 uppercase tracking-wider">Porte</div>
        <div className="w-32 shrink-0 text-xs font-medium text-gray-500 uppercase tracking-wider">Faturamento</div>
        <div className="w-36 shrink-0" />
      </div>

      {/* Rows */}
      <div>
        {leads.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </div>

      {/* Configure campaign CTA */}
      {approvedCount > 0 && (
        <div className="px-5 py-4 border-t border-white/10 flex justify-end bg-white/[0.01]">
          <button
            type="button"
            onClick={onConfigureCampaign}
            className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-green-400 transition-colors"
          >
            Configurar campanha com {approvedCount} aprovado{approvedCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
