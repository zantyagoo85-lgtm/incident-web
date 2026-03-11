import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface HealthStatus {
  status: string;
  timestamp: string;
  services?: {
    database: string;
    mongodb: string;
    redis: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor(private apiService: ApiService) {}

  getHealthStatus(): Observable<HealthStatus> {
    return this.apiService.get<HealthStatus>('/health');
  }
}
