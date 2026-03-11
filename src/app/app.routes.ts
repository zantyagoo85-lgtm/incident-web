import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { IncidentListComponent } from './features/incidents/pages/incident-list/incident-list.component';
import { IncidentCreateComponent } from './features/incidents/pages/incident-create/incident-create.component';
import { IncidentDetailComponent } from './features/incidents/pages/incident-detail/incident-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'incidents', component: IncidentListComponent },
  { path: 'incidents/create', component: IncidentCreateComponent },
  { path: 'incidents/:id', component: IncidentDetailComponent },
  { path: '**', redirectTo: '' },
];
