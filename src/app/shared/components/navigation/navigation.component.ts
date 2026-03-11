import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <span class="toolbar-title">
        <mat-icon>assignment</mat-icon>
        Gestión de Incidentes
      </span>

      <div class="toolbar-spacer"></div>

      <button mat-button routerLink="/" class="nav-button">
        <mat-icon>list</mat-icon>
        Listado
      </button>

      <button mat-button routerLink="/incidents/create" class="nav-button">
        <mat-icon>add</mat-icon>
        Crear
      </button>
    </mat-toolbar>
  `,
  styles: [
    `
      .app-toolbar {
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .toolbar-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.2rem;
        font-weight: 500;
      }

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      .nav-button {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: 8px;
      }
    `,
  ],
})
export class NavigationComponent {
  constructor(private router: Router) {}
}
