import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'incidents',
    loadComponent: () => import('./features/incidents/pages/incident-list/incident-list.component').then(c => c.IncidentListComponent)
  },
  {
    path: 'incidents/create',
    loadComponent: () => import('./features/incidents/pages/incident-create/incident-create.component').then(c => c.IncidentCreateComponent)
  },
  {
    path: 'incidents/:id',
    loadComponent: () => import('./features/incidents/pages/incident-detail/incident-detail.component').then(c => c.IncidentDetailComponent)
  },
  { path: '**', redirectTo: '' }
];
