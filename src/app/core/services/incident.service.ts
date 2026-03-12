import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  Incident,
  CreateIncidentRequest,
  UpdateIncidentStatusRequest,
  IncidentFilter,
  IncidentListResponse,
  IncidentEvent,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private apiService: ApiService) {}

  getIncidents(filter: IncidentFilter): Observable<IncidentListResponse> {
    return this.apiService.get<IncidentListResponse>('/incidents', filter);
  }

  getIncidentById(id: string): Observable<Incident & { events: IncidentEvent[] }> {
    return this.apiService
      .get<{ incident: Incident; timeline: IncidentEvent[] }>(`/incidents/${id}`)
      .pipe(
        map((response: { incident: Incident; timeline: IncidentEvent[] }) => ({
          ...response.incident,
          events: response.timeline || [],
        })),
      );
  }

  createIncident(request: CreateIncidentRequest): Observable<Incident> {
    return this.apiService.post<Incident>('/incidents', request);
  }

  updateIncidentStatus(id: string, request: UpdateIncidentStatusRequest): Observable<Incident> {
    console.log('IncidentService.updateIncidentStatus called with:', { id, request });
    return this.apiService.patch<Incident>(`/incidents/${id}/status`, request);
  }

  getIncidentTimeline(id: string): Observable<Incident & { events: IncidentEvent[] }> {
    return this.apiService.get<Incident & { events: IncidentEvent[] }>(`/incidents/${id}`);
  }
}
