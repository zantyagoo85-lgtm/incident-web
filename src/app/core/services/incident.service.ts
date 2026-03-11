import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockService } from './mock.service';
import { 
  Incident, 
  CreateIncidentRequest, 
  UpdateIncidentStatusRequest, 
  IncidentFilter, 
  IncidentListResponse,
  IncidentEvent
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  constructor(private mockService: MockService) {}

  getIncidents(filter: IncidentFilter): Observable<IncidentListResponse> {
    return this.mockService.getIncidents(filter);
  }

  getIncidentById(id: string): Observable<Incident & { events: IncidentEvent[] }> {
    return this.mockService.getIncidentById(id);
  }

  createIncident(request: CreateIncidentRequest): Observable<Incident> {
    return this.mockService.createIncident(request);
  }

  updateIncidentStatus(id: string, request: UpdateIncidentStatusRequest): Observable<Incident> {
    return this.mockService.updateIncidentStatus(id, request);
  }
}
