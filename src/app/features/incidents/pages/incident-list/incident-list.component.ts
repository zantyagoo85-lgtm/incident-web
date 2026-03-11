import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { IncidentService } from '../../../../core/services/incident.service';
import { Incident, IncidentStatus, IncidentSeverity, IncidentFilter } from '../../../../models';

interface IncidentListResponse {
  incidents: Incident[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink,
    MatProgressSpinnerModule
  ],
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.scss']
})
export class IncidentListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'status', 'severity', 'serviceId', 'createdAt', 'actions'];
  incidents: Incident[] = [];
  loading = false;
  totalCount = 0;
  pageSize = 10;
  currentPage = 0;

  statusOptions = Object.values(IncidentStatus);
  severityOptions = Object.values(IncidentSeverity);
  
  filters: IncidentFilter = {
    page: 0,
    pageSize: 10,
    sort: 'createdAt_desc'
  };

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.loading = true;
    this.incidentService.getIncidents(this.filters).subscribe({
      next: (response: IncidentListResponse) => {
        this.incidents = response.incidents;
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading incidents:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filters.page = 0;
    this.loadIncidents();
  }

  clearFilters(): void {
    this.filters = {
      page: 0,
      pageSize: 10,
      sort: 'createdAt_desc'
    };
    this.loadIncidents();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.filters.page = event.pageIndex;
    this.filters.pageSize = event.pageSize;
    this.loadIncidents();
  }

  getStatusLabel(status: IncidentStatus): string {
    const labels: Record<IncidentStatus, string> = {
      [IncidentStatus.OPEN]: "Abierto",
      [IncidentStatus.IN_PROGRESS]: "En Progreso",
      [IncidentStatus.RESOLVED]: "Resuelto",
      [IncidentStatus.CLOSED]: "Cerrado"
    };
    return labels[status] || status;
  }

  getSeverityLabel(severity: IncidentSeverity): string {
    const labels: Record<IncidentSeverity, string> = {
      [IncidentSeverity.LOW]: "Bajo",
      [IncidentSeverity.MEDIUM]: "Medio",
      [IncidentSeverity.HIGH]: "Alto",
      [IncidentSeverity.CRITICAL]: "Crítico"
    };
    return labels[severity] || severity;
  }

  getStatusColor(status: IncidentStatus): string {
    const colors: Record<IncidentStatus, string> = {
      [IncidentStatus.OPEN]: 'status-open',
      [IncidentStatus.IN_PROGRESS]: 'status-in-progress',
      [IncidentStatus.RESOLVED]: 'status-resolved',
      [IncidentStatus.CLOSED]: 'status-closed'
    };
    return colors[status] || '';
  }

  getSeverityColor(severity: IncidentSeverity): string {
    const colors: Record<IncidentSeverity, string> = {
      [IncidentSeverity.LOW]: 'severity-low',
      [IncidentSeverity.MEDIUM]: 'severity-medium',
      [IncidentSeverity.HIGH]: 'severity-high',
      [IncidentSeverity.CRITICAL]: 'severity-critical'
    };
    return colors[severity] || '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString("es-ES");
  }
}
