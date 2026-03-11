import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
  ],
  template: `
    <mat-toolbar color="primary" class="app-header">
      <span class="app-title">
        <mat-icon>warning</mat-icon>
        Incident Management
      </span>

      <span class="spacer"></span>

      <ng-container *ngIf="authService.isAuthenticated(); else loginButton">
        <button mat-button [routerLink]="['/incidents']">
          <mat-icon>list</mat-icon>
          Incidentes
        </button>

        <button mat-button [routerLink]="['/incidents/create']">
          <mat-icon>add</mat-icon>
          Nuevo
        </button>

        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ authService.getCurrentUser()?.email }}
          <mat-icon>arrow_drop_down</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            Cerrar sesión
          </button>
        </mat-menu>
      </ng-container>

      <ng-template #loginButton>
        <button mat-button routerLink="/login">
          <mat-icon>login</mat-icon>
          Iniciar sesión
        </button>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [
    `
      .app-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .app-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 18px;
        font-weight: 500;
      }

      .spacer {
        flex: 1 1 auto;
      }

      button mat-icon {
        margin-right: 8px;
      }
    `,
  ],
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
