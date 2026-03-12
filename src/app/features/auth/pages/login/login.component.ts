import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header class="login-header">
          <mat-card-title class="login-title">
            <mat-icon>security</mat-icon>
            Incident Management
          </mat-card-title>
          <mat-card-subtitle>Iniciar sesión para continuar</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="tu@email.com"
                autocomplete="email"
              />
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                El correo es requerido
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Ingresa un correo válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                placeholder="Tu contraseña"
                autocomplete="current-password"
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button
                type="button"
                mat-icon-button
                matSuffix
                (click)="hidePassword = !hidePassword"
                [attr.aria-label]="'Hide password'"
                [attr.aria-pressed]="hidePassword"
              >
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <div class="login-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="login-button"
                [disabled]="loginForm.invalid || isLoading"
              >
                <ng-container *ngIf="!isLoading; else loadingTemplate">
                  Iniciar sesión
                </ng-container>
                <ng-template #loadingTemplate>
                  <mat-spinner diameter="20"></mat-spinner>
                  Iniciando...
                </ng-template>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #3f51b5 0%, #2196f3 50%, #03a9f4 100%);
        padding: 20px;
      }

      .login-card {
        width: 100%;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        border-radius: 16px;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.98);
      }

      .login-header {
        justify-content: center;
        text-align: center;
        margin-bottom: 20px;
      }

      .login-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-size: 24px;
        font-weight: 600;
        color: #1976d2;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .login-actions {
        margin-top: 24px;
        text-align: center;
      }

      .login-button {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 8px;
        background: linear-gradient(45deg, #1976d2, #2196f3);
        color: white;
      }

      .login-button:hover {
        background: linear-gradient(45deg, #1565c0, #1976d2);
      }

      .login-button:disabled {
        background: #9e9e9e;
        color: #ffffff;
      }

      ::ng-deep .mat-mdc-form-field-focus-overlay {
        background-color: rgba(33, 150, 243, 0.1);
      }

      ::ng-deep .mat-mdc-text-field-wrapper {
        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 8px;
      }

      ::ng-deep .mat-mdc-form-field-focus .mat-mdc-text-field-wrapper {
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
      }

      ::ng-deep .mat-mdc-card {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      ::ng-deep .mat-mdc-card-subtitle {
        color: #666;
        font-size: 14px;
      }

      ::ng-deep .mat-icon {
        color: #1976d2;
      }

      ::ng-deep .mat-mdc-form-field-label {
        color: #666 !important;
      }

      ::ng-deep .mat-mdc-input-element {
        color: #333 !important;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      email: ['user@example.com', [Validators.required, Validators.email]],
      password: ['password123', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    const loginData: LoginRequest = this.loginForm.value;
    console.log('Login data:', loginData);

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful, response:', response);

        // Obtener el auth state actual
        this.authService.authState$.pipe(take(1)).subscribe((authState) => {
          console.log('Auth state after login:', authState);
        });

        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/incidents';
        console.log('Redirecting to:', returnUrl);

        this.router.navigate([returnUrl]).then((navigated) => {
          console.log('Navigation successful:', navigated);
          this.snackBar.open('¡Bienvenido! Has iniciado sesión correctamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        });
      },
      error: (error: any) => {
        console.error('Login error:', error);
        this.isLoading = false;
        const errorMessage =
          error?.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  }
}
