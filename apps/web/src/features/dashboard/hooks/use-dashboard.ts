'use client';

import { useQuery } from '@tanstack/react-query';
import * as dashboardApi from '../services/dashboard-api';

export function useDashboard(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardApi.getDashboard(params),
    // Enquanto o backend não estiver implementado, retorna dados mock
    placeholderData: {
      metrics: {
        leadsFound: 0,
        leadsApproved: 0,
        messagesSent: 0,
        messagesDelivered: 0,
        messagesReplied: 0,
        meetingsScheduled: 0,
        conversions: 0,
      },
      activeCampaigns: [],
    },
  });
}
