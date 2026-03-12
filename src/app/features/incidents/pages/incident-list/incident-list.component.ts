import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    MatProgressSpinnerModule,
  ],
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.scss'],
})
export class IncidentListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'status', 'severity', 'serviceId', 'createdAt', 'actions'];
  incidents: Incident[] = [];
  loading = false;
  totalCount = 0;
  totalPages = 0;
  pageSize = 10;
  currentPage = 0;

  statusOptions = Object.values(IncidentStatus);
  severityOptions = Object.values(IncidentSeverity);

  filters: IncidentFilter = {
    page: 1,
    pageSize: 10,
    sort: 'createdAt_desc',
  };

  constructor(
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef,
  ) {
    console.log('IncidentListComponent constructor initialized');
  }

  ngOnInit(): void {
    console.log('IncidentListComponent ngOnInit called');
    console.log('Initial filters:', this.filters);

    // Cargar incidentes inmediatamente
    this.loadIncidents();
  }

  loadIncidents(): void {
    console.log('Loading incidents with filters:', this.filters);
    this.loading = true;
    this.incidentService.getIncidents(this.filters).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        // ApiService already extracts the data from ApiResponse
        this.incidents = response.items;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;

        // Only update currentPage if it's different from current paginator state
        // Backend page 1,2,3... → Frontend pageIndex 0,1,2...
        const newCurrentPage = response.currentPage - 1;
        if (this.currentPage !== newCurrentPage) {
          this.currentPage = newCurrentPage;
        }

        this.loading = false;

        // Forzar change detection para actualizar la UI
        console.log('Forcing change detection');
        console.log('Updated currentPage:', this.currentPage);
        console.log('Total pages:', this.totalPages);
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading incidents:', error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters(): void {
    console.log('applyFilters called, resetting page to 1');
    this.filters.page = 1; // Backend usa páginas 1,2,3...
    this.currentPage = 0; // Reset frontend paginator to first page
    console.log('New filters:', this.filters);
    this.loadIncidents();
  }

  clearFilters(): void {
    this.filters = {
      page: 1, // Backend usa páginas 1,2,3...
      pageSize: 10,
      sort: 'createdAt_desc',
    };
    this.currentPage = 0; // Reset frontend paginator to first page
    this.pageSize = 10; // Reset page size to default
    this.applyFilters();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    console.log('Paginator event:', event);
    console.log('Current filters before change:', this.filters);

    // Angular Material pageIndex 0,1,2... → Backend page 1,2,3...
    const backendPage = event.pageIndex + 1;

    console.log('Sending to backend:', {
      page: backendPage,
      pageSize: event.pageSize,
    });

    this.filters.page = backendPage;
    this.filters.pageSize = event.pageSize;

    // Update frontend currentPage to match paginator
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadIncidents();
  }

  getStatusLabel(status: IncidentStatus): string {
    const labels: Record<IncidentStatus, string> = {
      [IncidentStatus.OPEN]: 'Abierto',
      [IncidentStatus.IN_PROGRESS]: 'En Progreso',
      [IncidentStatus.RESOLVED]: 'Resuelto',
      [IncidentStatus.CLOSED]: 'Cerrado',
    };
    return labels[status] || status;
  }

  getSeverityLabel(severity: IncidentSeverity): string {
    const labels: Record<IncidentSeverity, string> = {
      [IncidentSeverity.LOW]: 'Baja',
      [IncidentSeverity.MEDIUM]: 'Media',
      [IncidentSeverity.HIGH]: 'Alta',
      [IncidentSeverity.CRITICAL]: 'Crítica',
    };
    return labels[severity] || severity;
  }

  getStatusColor(status: IncidentStatus): string {
    const colors: Record<IncidentStatus, string> = {
      [IncidentStatus.OPEN]: 'status-open',
      [IncidentStatus.IN_PROGRESS]: 'status-in-progress',
      [IncidentStatus.RESOLVED]: 'status-resolved',
      [IncidentStatus.CLOSED]: 'status-closed',
    };
    return colors[status] || '';
  }

  getSeverityColor(severity: IncidentSeverity): string {
    const colors: Record<IncidentSeverity, string> = {
      [IncidentSeverity.LOW]: 'severity-low',
      [IncidentSeverity.MEDIUM]: 'severity-medium',
      [IncidentSeverity.HIGH]: 'severity-high',
      [IncidentSeverity.CRITICAL]: 'severity-critical',
    };
    return colors[severity] || '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES');
  }
}
