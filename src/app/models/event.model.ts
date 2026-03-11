export interface IncidentEvent {
  incidentId: string;
  type: string;
  occurredAt: string;
  payload: Record<string, any>;
  metadata: {
    correlationId: string;
    [key: string]: any;
  };
}

export interface ServiceCatalogSnapshot {
  serviceId: string;
  ownerEmail: string;
  tier: string;
  timestamp: string;
  success: boolean;
  error?: string;
}
