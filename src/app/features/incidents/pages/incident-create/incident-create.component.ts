import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
import { CreateIncidentRequest, IncidentSeverity } from '../../../../models';

@Component({
  selector: 'app-incident-create',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.scss',
})
export class IncidentCreateComponent {
  incidentForm: FormGroup;
  loading = false;
  severityOptions = Object.values(IncidentSeverity);

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.incidentForm = this.createIncidentForm();
  }

  private createIncidentForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      description: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(1000)],
      ],
      severity: [IncidentSeverity.MEDIUM, [Validators.required]],
      serviceId: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });
  }

  getErrorMessage(field: string): string {
    const control = this.incidentForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Este campo es obligatorio';
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const incidentData: CreateIncidentRequest = this.incidentForm.value;

    this.incidentService.createIncident(incidentData).subscribe({
      next: (incident) => {
        this.snackBar.open('Incidente creado exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigate(['/incidents', incident.id]);
      },
      error: (error) => {
        console.error('Error creating incident:', error);
        this.snackBar.open('Error al crear el incidente', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/incidents']);
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
}
