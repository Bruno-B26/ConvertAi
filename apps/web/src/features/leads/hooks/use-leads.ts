'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, updateLead, bulkUpdateLeads, type GetLeadsParams } from '../services/leads-api';

export function useLeads(campaignId: string, params?: GetLeadsParams) {
  return useQuery({
    queryKey: ['leads', campaignId, params],
    queryFn: () => getLeads(campaignId, params),
    enabled: Boolean(campaignId),
  });
}

export function useUpdateLead(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      leadId,
      data,
    }: {
      leadId: string;
      data: { status?: 'approved' | 'rejected'; notes?: string };
    }) => updateLead(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', campaignId] });
    },
  });
}

export function useBulkUpdateLeads(campaignId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ action, leadIds }: { action: 'approve' | 'reject'; leadIds: string[] }) =>
      bulkUpdateLeads(campaignId, action, leadIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', campaignId] });
    },
  });
}
