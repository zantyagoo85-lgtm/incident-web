import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

import {
  Incident,
  IncidentStatus,
  IncidentSeverity,
  CreateIncidentRequest,
  UpdateIncidentStatusRequest,
  IncidentFilter,
  IncidentListResponse,
  IncidentEvent,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  private incidents: Incident[] = [
    {
      id: '1',
      title: 'Database Connection Failed',
      description: 'Primary database server is not responding to connection requests',
      status: IncidentStatus.OPEN,
      severity: IncidentSeverity.HIGH,
      serviceId: 'svc-database-001',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
    },
  ];

  private events: IncidentEvent[] = [
    {
      id: 'evt-1',
      eventType: 'incident_created',
      description: 'Incident created',
      occurredAt: '2024-01-15T10:30:00Z',
      changedBy: 'system@app.local',
      correlationId: 'corr-1',
      userEmail: 'system@app.local',
    },
  ];

  getIncidents(filter: IncidentFilter): Observable<IncidentListResponse> {
    let filteredIncidents = [...this.incidents];

    if (filter.status) {
      filteredIncidents = filteredIncidents.filter((inc) => inc.status === filter.status);
    }
    if (filter.severity) {
      filteredIncidents = filteredIncidents.filter((inc) => inc.severity === filter.severity);
    }
    if (filter.serviceId && filter.serviceId) {
      filteredIncidents = filteredIncidents.filter((inc) =>
        inc.serviceId.includes(filter.serviceId as string),
      );
    }
    if (filter.searchQuery) {
      const searchTerm = filter.searchQuery.toLowerCase();
      filteredIncidents = filteredIncidents.filter(
        (inc) =>
          inc.title.toLowerCase().includes(searchTerm) ||
          inc.description.toLowerCase().includes(searchTerm),
      );
    }

    const totalCount = filteredIncidents.length;
    const totalPages = Math.ceil(totalCount / (filter.pageSize || 10));
    const currentPage = filter.page || 0;

    const mockResponse: IncidentListResponse = {
      items: filteredIncidents,
      currentPage,
      totalPages,
      pageSize: filter.pageSize || 10,
      totalCount,
      hasPreviousPage: currentPage > 0,
      hasNextPage: currentPage < totalPages - 1,
    };

    return of(mockResponse).pipe(delay(500));
  }

  getIncidentById(id: string): Observable<Incident & { events: IncidentEvent[] }> {
    const incident = this.incidents.find((inc) => inc.id === id);
    const events = this.events.filter((evt) => evt.id === id);

    if (!incident) {
      throw new Error('Incident not found');
    }

    return of({ ...incident, events }).pipe(delay(500));
  }

  createIncident(request: CreateIncidentRequest): Observable<Incident> {
    const newIncident: Incident = {
      id: (this.incidents.length + 1).toString(),
      ...request,
      status: IncidentStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.incidents.unshift(newIncident);

    this.events.push({
      id: `evt-${this.events.length + 1}`,
      eventType: 'status_change',
      description: 'Incident created',
      occurredAt: new Date().toISOString(),
      changedBy: 'current-user',
      correlationId: `corr-${this.events.length + 1}`,
      userEmail: 'current-user',
    });

    return of(newIncident).pipe(delay(500));
  }

  updateIncidentStatus(id: string, request: UpdateIncidentStatusRequest): Observable<Incident> {
    const incident = this.incidents.find((inc) => inc.id === id);
    if (!incident) {
      throw new Error('Incident not found');
    }

    const statusMap: Record<string, IncidentStatus> = {
      open: IncidentStatus.OPEN,
      in_progress: IncidentStatus.IN_PROGRESS,
      resolved: IncidentStatus.RESOLVED,
      closed: IncidentStatus.CLOSED,
    };

    const updatedIncident = {
      ...incident,
      status: statusMap[request.status] || IncidentStatus.OPEN,
      updatedAt: new Date().toISOString(),
    };

    this.incidents = this.incidents.map((inc) => (inc.id === id ? updatedIncident : inc));

    this.events.push({
      id: `evt-${this.events.length + 1}`,
      eventType: 'status_change',
      description: `Status changed to ${request.status}`,
      occurredAt: new Date().toISOString(),
      changedBy: 'current-user',
      correlationId: `corr-${this.events.length + 1}`,
      userEmail: 'current-user',
    });

    return of(incident).pipe(delay(300));
  }
}
