export interface IncidentEvent {
  id: string;
  eventType: string;
  description: string;
  occurredAt: string;
  changedBy: string;
  correlationId: string;
  userEmail: string;
}

export interface ServiceCatalogSnapshot {
  serviceId: string;
  ownerEmail: string;
  tier: string;
  timestamp: string;
  success: boolean;
  error?: string;
}
