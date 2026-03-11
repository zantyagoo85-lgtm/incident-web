import { IncidentEvent } from './event.model';

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
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
  status: IncidentStatus;
}

export interface IncidentFilter {
  status?: IncidentStatus | '';
  severity?: IncidentSeverity | '';
  serviceId?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface IncidentListResponse {
  incidents: Incident[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
