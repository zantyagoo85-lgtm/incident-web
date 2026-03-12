import { IncidentEvent } from './event.model';
import { PaginatedResponse } from './api-response.model';

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// Enum para status del backend (snake_case)
export enum ApiIncidentStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  events?: IncidentEvent[];
}

export interface CreateIncidentRequest {
  title: string;
  description: string;
  severity: IncidentSeverity;
  serviceId: string;
}

export interface UpdateIncidentStatusRequest {
  status: ApiIncidentStatus;
}

export interface IncidentFilter {
  status?: IncidentStatus | '';
  severity?: IncidentSeverity | '';
  serviceId?: string | undefined;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

// Tipo para la respuesta del endpoint de incidentes
export type IncidentListResponse = PaginatedResponse<Incident>;
