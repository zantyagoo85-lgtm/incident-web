import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, RouterLink],
  template: `
    <div class="home-container">
      <mat-card class="welcome-card">
        <mat-card-header>
          <mat-card-title class="welcome-title">
            <mat-icon class="title-icon">dashboard</mat-icon>
            Sistema de Gestión de Incidentes
          </mat-card-title>
          <mat-card-subtitle> Gestiona y rastrea incidentes eficientemente </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content class="welcome-content">
          <p class="welcome-description">
            Bienvenido al Sistema de Gestión de Incidentes. Aquí puedes crear, ver y gestionar
            incidentes con actualizaciones en tiempo real y seguimiento completo.
          </p>

          <div class="action-buttons">
            <a mat-raised-button color="primary" routerLink="/incidents" class="action-btn">
              <mat-icon>list</mat-icon>
              Ver Incidentes
            </a>

            <a mat-raised-button color="accent" routerLink="/incidents/create" class="action-btn">
              <mat-icon>add</mat-icon>
              Crear Incidente
            </a>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="features-grid">
        <mat-card class="feature-card">
          <mat-card-content>
            <mat-icon class="feature-icon">assignment</mat-icon>
            <h3>Rastrear Incidentes</h3>
            <p>Monitorea todos los incidentes en tiempo real con información detallada</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="feature-card">
          <mat-card-content>
            <mat-icon class="feature-icon">timeline</mat-icon>
            <h3>Vista de Línea de Tiempo</h3>
            <p>Visualiza la progresión de incidentes con línea de tiempo completa</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="feature-card">
          <mat-card-content>
            <mat-icon class="feature-icon">filter_list</mat-icon>
            <h3>Filtros Avanzados</h3>
            <p>Filtra incidentes por estado, severidad y capacidades de búsqueda</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .home-container {
        display: flex;
        flex-direction: column;
        gap: 32px;
        padding: 24px 0;
      }

      .welcome-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 16px;
        overflow: hidden;
      }

      .welcome-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.8rem;
        font-weight: 600;
      }

      .title-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }

      .welcome-content {
        padding: 24px;
      }

      .welcome-description {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 32px;
        opacity: 0.95;
      }

      .action-buttons {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        font-size: 1rem;
        border-radius: 8px;
        transition: transform 0.2s ease;
      }

      .action-btn:hover {
        transform: translateY(-2px);
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }

      .feature-card {
        text-align: center;
        padding: 32px 24px;
        border-radius: 12px;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        cursor: pointer;
      }

      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }

      .feature-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #667eea;
        margin-bottom: 16px;
      }

      .feature-card h3 {
        margin: 0 0 12px 0;
        font-size: 1.3rem;
        font-weight: 600;
        color: #333;
      }

      .feature-card p {
        margin: 0;
        color: #666;
        line-height: 1.5;
      }

      @media (max-width: 768px) {
        .home-container {
          padding: 16px 0;
        }

        .welcome-title {
          font-size: 1.5rem;
        }

        .action-buttons {
          flex-direction: column;
        }

        .features-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent {}
