'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { SearchFiltersForm } from './search-filters';
import { LeadsResults } from './leads-results';
import type { SearchFilters, Lead } from '../types';

// Mock leads — substituir pela chamada real à API quando o backend estiver pronto.
// Fluxo real: criar/atualizar Campaign com os filtros → POST /campaigns/:id/search →
// aguardar campaign.status === 'review' → GET /campaigns/:id/leads
const MOCK_LEADS: Omit<Lead, 'status'>[] = [
  {
    id: '1',
    campaignId: 'mock',
    company: {
      name: 'Nortech Sistemas',
      cnpj: '12.345.678/0001-90',
      cnae: '6201501',
      cnaeDescription: 'Desenvolvimento de programas de computador',
      sector: 'Tecnologia',
      size: '51–200 func.',
      capitalSocial: 7_500_000,
      address: { city: 'São Paulo', state: 'SP' },
    },
    contact: { name: null, phone: '11999990001', whatsapp: '11999990001', email: null },
  },
  {
    id: '2',
    campaignId: 'mock',
    company: {
      name: 'Grão Alimentos',
      cnpj: '23.456.789/0001-01',
      cnae: '4711301',
      cnaeDescription: 'Comércio varejista de mercadorias em geral',
      sector: 'Comércio',
      size: '11–50 func.',
      capitalSocial: 1_800_000,
      address: { city: 'Curitiba', state: 'PR' },
    },
    contact: { name: null, phone: '41988880002', whatsapp: '41988880002', email: null },
  },
  {
    id: '3',
    campaignId: 'mock',
    company: {
      name: 'Vetta Consultoria',
      cnpj: '34.567.890/0001-12',
      cnae: '6911701',
      cnaeDescription: 'Serviços advocatícios',
      sector: 'Serviços',
      size: '11–50 func.',
      capitalSocial: 500_000,
      address: { city: 'Belo Horizonte', state: 'MG' },
    },
    contact: { name: null, phone: '31977770003', whatsapp: '31977770003', email: null },
  },
  {
    id: '4',
    campaignId: 'mock',
    company: {
      name: 'BuildRight Engenharia',
      cnpj: '45.678.901/0001-23',
      cnae: '4120400',
      cnaeDescription: 'Construção de edifícios',
      sector: 'Construção Civil',
      size: '51–200 func.',
      capitalSocial: 28_000_000,
      address: { city: 'Porto Alegre', state: 'RS' },
    },
    contact: { name: null, phone: '51966660004', whatsapp: '51966660004', email: null },
  },
  {
    id: '5',
    campaignId: 'mock',
    company: {
      name: 'Clarity Health',
      cnpj: '56.789.012/0001-34',
      cnae: '8630501',
      cnaeDescription: 'Atividade médica ambulatorial',
      sector: 'Saúde',
      size: '201–500 func.',
      capitalSocial: 22_000_000,
      address: { city: 'São Paulo', state: 'SP' },
    },
    contact: { name: null, phone: '11955550005', whatsapp: null, email: 'contato@clarityhealth.com.br' },
  },
  {
    id: '6',
    campaignId: 'mock',
    company: {
      name: 'Fibra Log',
      cnpj: '67.890.123/0001-45',
      cnae: '4930201',
      cnaeDescription: 'Transporte rodoviário de carga',
      sector: 'Logística',
      size: '51–200 func.',
      capitalSocial: 8_000_000,
      address: { city: 'Campinas', state: 'SP' },
    },
    contact: { name: null, phone: '19944440006', whatsapp: '19944440006', email: null },
  },
];

type SearchState = 'idle' | 'searching' | 'results';

export function BuscarView() {
  const router = useRouter();
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [leads, setLeads] = useState<Lead[]>([]);

  async function handleSearch(_filters: SearchFilters) {
    setSearchState('searching');
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setLeads(MOCK_LEADS.map((l) => ({ ...l, status: 'found' as const })));
    setSearchState('results');
  }

  function handleApprove(id: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'approved' as const } : l)),
    );
  }

  function handleReject(id: string) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'rejected' as const } : l)),
    );
  }

  function handleApproveAll() {
    setLeads((prev) =>
      prev.map((l) => (l.status === 'found' ? { ...l, status: 'approved' as const } : l)),
    );
  }

  function handleConfigureCampaign() {
    router.push('/campaigns');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Encontrar clientes ideais</h1>
        <p className="mt-1 text-sm text-gray-400">
          Descreva o perfil de empresa que você quer prospectar. A gente monta a lista, você decide quem entra na campanha.
        </p>
      </div>

      {/* Formulário de filtros */}
      <SearchFiltersForm
        onSearch={handleSearch}
        isSearching={searchState === 'searching'}
      />

      {/* Estado de carregamento */}
      {searchState === 'searching' && (
        <div className="rounded-xl bg-[#161616] border border-white/10 p-16 flex flex-col items-center gap-4">
          <svg className="animate-spin w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-white">Buscando empresas...</p>
            <p className="text-xs text-gray-500 mt-1">Consultando base de dados da Receita Federal</p>
          </div>
        </div>
      )}

      {/* Resultados */}
      {searchState === 'results' && leads.length > 0 && (
        <LeadsResults
          leads={leads}
          onApprove={handleApprove}
          onReject={handleReject}
          onApproveAll={handleApproveAll}
          onConfigureCampaign={handleConfigureCampaign}
        />
      )}

      {/* Sem resultados */}
      {searchState === 'results' && leads.length === 0 && (
        <div className="rounded-xl bg-[#161616] border border-white/10 p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Nenhum lead encontrado</p>
            <p className="text-xs text-gray-500 mt-1">Tente ampliar os filtros de busca ou selecionar outro segmento.</p>
          </div>
        </div>
      )}
    </div>
  );
}
