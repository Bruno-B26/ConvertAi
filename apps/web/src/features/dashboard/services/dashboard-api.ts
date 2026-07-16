import { apiClient } from '@/lib/api-client';
import type { DashboardResponse } from '../types';

export function getDashboard(params?: { from?: string; to?: string }): Promise<DashboardResponse> {
  const query = new URLSearchParams();
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  const qs = query.toString();
  return apiClient<DashboardResponse>(`/dashboard${qs ? `?${qs}` : ''}`);
}
