import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Incident,
  IncidentEvent,
  IncidentListResponse,
  CreateIncidentRequest,
  UpdateIncidentStatusRequest,
  IncidentFilter,
  IncidentStatus,
  IncidentSeverity,
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
    {
      id: '2',
      title: 'API Response Time Degraded',
      description: 'API endpoints are responding with latency above acceptable thresholds',
      status: IncidentStatus.IN_PROGRESS,
      severity: IncidentSeverity.MEDIUM,
      serviceId: 'svc-api-002',
      createdAt: '2024-01-15T14:20:00Z',
      updatedAt: '2024-01-15T15:30:00Z',
    },
    {
      id: '3',
      title: 'Memory Usage Spike',
      description: 'Application memory usage has exceeded 80% threshold',
      status: IncidentStatus.RESOLVED,
      severity: IncidentSeverity.LOW,
      serviceId: 'svc-app-003',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
    },
    {
      id: '4',
      title: 'Authentication Service Down',
      description: 'Users are unable to authenticate with the system',
      status: IncidentStatus.OPEN,
      severity: IncidentSeverity.CRITICAL,
      serviceId: 'svc-auth-004',
      createdAt: '2024-01-15T16:00:00Z',
      updatedAt: '2024-01-15T16:00:00Z',
    },
    {
      id: '5',
      title: 'File Upload Issues',
      description: 'Users reporting failures when uploading files larger than 10MB',
      status: IncidentStatus.IN_PROGRESS,
      severity: IncidentSeverity.MEDIUM,
      serviceId: 'svc-storage-005',
      createdAt: '2024-01-15T12:45:00Z',
      updatedAt: '2024-01-15T13:20:00Z',
    },
  ];

  private events: IncidentEvent[] = [
    {
      incidentId: '1',
      type: 'status_change',
      occurredAt: '2024-01-15T10:30:00Z',
      payload: { message: 'Incident created', userId: 'user-001' },
      metadata: { correlationId: 'corr-001' },
    },
    {
      incidentId: '1',
      type: 'status_change',
      occurredAt: '2024-01-15T11:00:00Z',
      payload: { message: 'Status changed to IN_PROGRESS', userId: 'user-002' },
      metadata: { correlationId: 'corr-002' },
    },
    {
      incidentId: '1',
      type: 'comment',
      occurredAt: '2024-01-15T11:30:00Z',
      payload: {
        message: 'Database team is investigating the connection issue',
        userId: 'user-003',
      },
      metadata: { correlationId: 'corr-003' },
    },
    {
      incidentId: '1',
      type: 'status_change',
      occurredAt: '2024-01-15T11:45:00Z',
      payload: { message: 'Status changed to OPEN', userId: 'user-002' },
      metadata: { correlationId: 'corr-004' },
    },
  ];

  getIncidents(filter: IncidentFilter): Observable<IncidentListResponse> {
    let filteredIncidents = [...this.incidents];

    // Apply filters
    if (filter.status) {
      filteredIncidents = filteredIncidents.filter((inc) => inc.status === filter.status);
    }
    if (filter.severity) {
      filteredIncidents = filteredIncidents.filter((inc) => inc.severity === filter.severity);
    }
    if (filter.serviceId) {
      filteredIncidents = filteredIncidents.filter((inc) =>
        inc.serviceId.includes(filter.serviceId!),
      );
    }
    if (filter.q) {
      const searchTerm = filter.q.toLowerCase();
      filteredIncidents = filteredIncidents.filter(
        (inc) =>
          inc.title.toLowerCase().includes(searchTerm) ||
          inc.description.toLowerCase().includes(searchTerm),
      );
    }

    // Sort
    if (filter.sort) {
      filteredIncidents.sort((a, b) => {
        const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        
        switch (filter.sort) {
          case 'createdAt':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'severity':
            return severityOrder[a.severity] - severityOrder[b.severity];
          default:
            return 0;
        }
      });
    }

    // Pagination
    const page = filter.page || 1;
    const pageSize = filter.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedIncidents = filteredIncidents.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredIncidents.length / pageSize);

    return of({
      incidents: paginatedIncidents,
      totalCount: filteredIncidents.length,
      page,
      pageSize,
      totalPages,
    }).pipe(delay(500)); // Simulate network delay
  }

  getIncidentById(id: string): Observable<Incident & { events: IncidentEvent[] }> {
    const incident = this.incidents.find((inc) => inc.id === id);
    const events = this.events.filter((evt) => evt.incidentId === id);

    if (!incident) {
      throw new Error('Incident not found');
    }

    return of({
      ...incident,
      events: events.sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      ),
    }).pipe(delay(300));
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

    // Add initial event
    this.events.push({
      incidentId: newIncident.id,
      type: 'status_change',
      occurredAt: new Date().toISOString(),
      payload: { message: 'Incident created', userId: 'current-user' },
      metadata: { correlationId: `corr-${this.events.length + 1}` },
    });

    return of(newIncident).pipe(delay(500));
  }

  updateIncidentStatus(id: string, request: UpdateIncidentStatusRequest): Observable<Incident> {
    const incident = this.incidents.find((inc) => inc.id === id);
    if (!incident) {
      throw new Error('Incident not found');
    }

    incident.status = request.status;
    incident.updatedAt = new Date().toISOString();

    // Add status change event
    this.events.push({
      incidentId: id,
      type: 'status_change',
      occurredAt: new Date().toISOString(),
      payload: { message: `Status changed to ${request.status}`, userId: 'current-user' },
      metadata: { correlationId: `corr-${this.events.length + 1}` },
    });

    return of(incident).pipe(delay(300));
  }
}
