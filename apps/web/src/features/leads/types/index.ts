export type SituacaoCadastral = 'ATIVA' | 'INAPTA' | 'BAIXADA' | 'SUSPENSA';
export type Porte = 'ME' | 'EPP' | 'DEMAIS';

export interface SearchFilters {
  cnae: string[];
  uf: string;
  municipio: string;
  situacaoCadastral: SituacaoCadastral;
  porte: Porte | '';
  faturamento: string;
  dataAberturaMin: string;
  dataAberturaMax: string;
  somenteMei: boolean;
  comContato: boolean;
  limite: number;
}

export interface LeadAddress {
  city: string | null;
  state: string | null;
}

export interface LeadCompany {
  name: string;
  cnpj: string | null;
  cnae: string | null;
  cnaeDescription: string | null;
  sector: string | null;
  size: string | null;
  capitalSocial: number | null;
  address: LeadAddress;
}

export interface LeadContact {
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
}

export type LeadStatus = 'found' | 'approved' | 'rejected';

export interface Lead {
  id: string;
  company: LeadCompany;
  contact: LeadContact;
  status: LeadStatus;
  campaignId: string;
}

export interface LeadListResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
