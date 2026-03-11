import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IncidentListComponent } from '../../pages/incident-list/incident-list.component';
import { IncidentService } from '../../../../core/services/incident.service';
import { Incident, IncidentStatus, IncidentSeverity } from '../../../../models';

describe('IncidentListComponent', () => {
  let component: IncidentListComponent;
  let fixture: ComponentFixture<IncidentListComponent>;
  let incidentService: IncidentService;

  const mockIncidents: Incident[] = [
    {
      id: '1',
      title: 'Test Incident 1',
      description: 'Description 1',
      severity: IncidentSeverity.HIGH,
      status: IncidentStatus.OPEN,
      serviceId: 'service-1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Test Incident 2',
      description: 'Description 2',
      severity: IncidentSeverity.MEDIUM,
      status: IncidentStatus.RESOLVED,
      serviceId: 'service-2',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IncidentListComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentListComponent);
    component = fixture.componentInstance;
    incidentService = TestBed.inject(IncidentService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load incidents on initialization', () => {
    const spy = spyOn(incidentService, 'getIncidents').and.returnValue({
      subscribe: jasmine.createSpy(),
    } as any);

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith({
      status: '',
      severity: '',
      serviceId: '',
      q: '',
      page: 0,
      pageSize: 10,
      sort: 'createdAt_desc',
    });
  });

  it('should apply filters', () => {
    component.filters.q = 'test';
    component.filters.status = IncidentStatus.OPEN;

    const spy = jasmine.createSpyOn(incidentService, 'getIncidents').and.returnValue({
      subscribe: jasmine.createSpy('subscribe'),
    } as any);

    component.applyFilters();

    expect(spy).toHaveBeenCalledWith({
      status: IncidentStatus.OPEN,
      severity: '',
      serviceId: '',
      q: 'test',
      page: 0,
      pageSize: 10,
      sort: 'createdAt_desc',
    });
  });

  it('should clear filters', () => {
    component.filters.q = 'test';
    component.filters.status = IncidentStatus.OPEN;

    const spy = spyOn(component, 'applyFilters');

    component.clearFilters();

    expect(component.filters).toEqual({
      status: '',
      severity: '',
      serviceId: '',
      q: '',
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should get correct status labels', () => {
    expect(component.getStatusLabel(IncidentStatus.OPEN)).toBe('Abierto');
    expect(component.getStatusLabel(IncidentStatus.RESOLVED)).toBe('Resuelto');
  });

  it('should get correct severity labels', () => {
    expect(component.getSeverityLabel(IncidentSeverity.HIGH)).toBe('Alta');
    expect(component.getSeverityLabel(IncidentSeverity.LOW)).toBe('Baja');
  });
});
