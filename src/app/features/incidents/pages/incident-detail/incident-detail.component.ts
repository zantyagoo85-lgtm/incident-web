import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { IncidentService } from '../../../../core/services/incident.service';
import {
  Incident,
  IncidentStatus,
  IncidentSeverity,
  UpdateIncidentStatusRequest,
  IncidentEvent,
  ApiIncidentStatus,
} from '../../../../models';
import { getStatusColor } from '../../../../core/constants/status.constants';
import { getStatusColor as getSeverityColor } from '../../../../core/constants/severity.constants';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.scss',
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident | null = null;
  events: IncidentEvent[] = [];
  loading = true;
  updatingStatus = false;
  statusForm: FormGroup;
  statusOptions = Object.values(IncidentStatus);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {
    this.statusForm = this.fb.group({
      status: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIncidentDetail(id);
    } else {
      this.router.navigate(['/incidents']);
    }
  }

  loadIncidentDetail(id: string): void {
    console.log('Loading incident detail for ID:', id);
    this.loading = true;
    this.incidentService.getIncidentById(id).subscribe({
      next: (data) => {
        console.log('Incident detail loaded:', data);
        this.incident = data;
        this.events = data.events || [];
        this.statusForm.patchValue({ status: data.status });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading incident detail:', error);
        this.snackBar.open('Error al cargar los detalles del incidente', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/incidents']);
      },
    });
  }

  updateStatus(status: string): void {
    console.log('updateStatus called with:', status);
    console.log('Current incident:', this.incident);

    if (!this.incident) {
      console.error('No incident available for update');
      return;
    }

    // Guardar el ID original antes de actualizar
    const originalId = this.incident.id;
    console.log('Incident ID:', originalId);
    this.updatingStatus = true;

    // Convertir IncidentStatus a ApiIncidentStatus
    const apiStatus = this.mapToApiStatus(status as IncidentStatus);
    const request: UpdateIncidentStatusRequest = {
      status: apiStatus,
    };

    console.log('Updating status with request:', request);
    console.log('Calling updateIncidentStatus with ID:', originalId);

    this.incidentService.updateIncidentStatus(originalId, request).subscribe({
      next: (updatedIncident) => {
        console.log('Status updated successfully:', updatedIncident);
        // Mantener el ID original
        this.incident = { ...updatedIncident, id: originalId };
        this.snackBar.open('Estado actualizado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.updatingStatus = false;
        this.cdr.detectChanges();
        console.log('Reloading incident detail with ID:', originalId);
        this.loadIncidentDetail(originalId);
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.snackBar.open('Error al actualizar el estado', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.updatingStatus = false;
        this.cdr.detectChanges();
      },
    });
  }

  private mapToApiStatus(status: IncidentStatus): ApiIncidentStatus {
    const statusMap: Record<IncidentStatus, ApiIncidentStatus> = {
      [IncidentStatus.OPEN]: ApiIncidentStatus.OPEN,
      [IncidentStatus.IN_PROGRESS]: ApiIncidentStatus.IN_PROGRESS,
      [IncidentStatus.RESOLVED]: ApiIncidentStatus.RESOLVED,
      [IncidentStatus.CLOSED]: ApiIncidentStatus.CLOSED,
    };
    return statusMap[status] || ApiIncidentStatus.OPEN;
  }

  getStatusColor(status: IncidentStatus): string {
    return getStatusColor(status);
  }

  getSeverityColor(severity: IncidentSeverity): string {
    return getSeverityColor(severity);
  }

  getStatusLabel(status: IncidentStatus): string {
    const statusMap = {
      [IncidentStatus.OPEN]: 'Abierto',
      [IncidentStatus.IN_PROGRESS]: 'En Progreso',
      [IncidentStatus.RESOLVED]: 'Resuelto',
      [IncidentStatus.CLOSED]: 'Cerrado',
    };
    return statusMap[status] || status;
  }

  getSeverityLabel(severity: IncidentSeverity): string {
    const severityMap = {
      [IncidentSeverity.LOW]: 'Baja',
      [IncidentSeverity.MEDIUM]: 'Media',
      [IncidentSeverity.HIGH]: 'Alta',
      [IncidentSeverity.CRITICAL]: 'Crítica',
    };
    return severityMap[severity] || severity;
  }

  getEventTypeLabel(eventType: string): string {
    const eventMap: Record<string, string> = {
      incident_created: 'Incidente Creado',
      incident_status_changed: 'Estado Cambiado',
      service_catalog_snapshot: 'Consulta Catálogo de Servicios',
    };
    return eventMap[eventType] || eventType;
  }

  goBack(): void {
    this.router.navigate(['/incidents']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES');
  }
}
