import { apiClient } from '@/lib/api-client';
import type { Lead, LeadListResponse } from '../types';

export interface GetLeadsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export function getLeads(campaignId: string, params: GetLeadsParams = {}): Promise<LeadListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  const qs = query.toString();
  return apiClient<LeadListResponse>(`/campaigns/${campaignId}/leads${qs ? `?${qs}` : ''}`);
}

export function updateLead(
  leadId: string,
  data: { status?: 'approved' | 'rejected'; notes?: string },
): Promise<Lead> {
  return apiClient<Lead>(`/leads/${leadId}`, { method: 'PATCH', body: data });
}

export function bulkUpdateLeads(
  campaignId: string,
  action: 'approve' | 'reject',
  leadIds: string[],
): Promise<{ updated: number }> {
  return apiClient<{ updated: number }>(`/campaigns/${campaignId}/leads/bulk`, {
    method: 'POST',
    body: { action, leadIds },
  });
}
