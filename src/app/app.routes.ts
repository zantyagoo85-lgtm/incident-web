import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { IncidentListComponent } from './features/incidents/pages/incident-list/incident-list.component';
import { IncidentCreateComponent } from './features/incidents/pages/incident-create/incident-create.component';
import { IncidentDetailComponent } from './features/incidents/pages/incident-detail/incident-detail.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'incidents',
    component: IncidentListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'incidents/create',
    component: IncidentCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'incidents/:id',
    component: IncidentDetailComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
