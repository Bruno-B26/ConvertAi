export interface DashboardMetrics {
  leadsFound: number;
  leadsApproved: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesReplied: number;
  meetingsScheduled: number;
  conversions: number;
}

export interface ActiveCampaign {
  id: string;
  name: string;
  status: 'searching' | 'review' | 'running' | 'paused';
  metrics: {
    leadsFound: number;
    leadsApproved: number;
    messagesSent: number;
    messagesReplied: number;
  };
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  activeCampaigns: ActiveCampaign[];
}
