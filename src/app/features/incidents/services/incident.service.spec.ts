import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IncidentService } from '../../../core/services/incident.service';
import { Incident, IncidentStatus, IncidentSeverity } from '../../../models';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;
  let incidentService: jasmine.SpyObj<IncidentService>;

  const mockIncident: Incident = {
    id: 'test-id',
    title: 'Test Incident',
    description: 'Test Description',
    severity: IncidentSeverity.HIGH,
    status: IncidentStatus.OPEN,
    serviceId: 'test-service',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IncidentService],
    });

    service = TestBed.inject(IncidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get incidents with filters', () => {
    const filters = { status: IncidentStatus.OPEN };
    service.getIncidents(filters).subscribe((response) => {
      expect(response.incidents).toBeDefined();
      expect(response.incidents.length).toBeGreaterThan(0);
      expect(response.totalCount).toBeGreaterThan(0);
      expect(response.page).toBe(0);
      expect(response.pageSize).toBe(10);
      expect(response.totalPages).toBeGreaterThan(0);
    });
  });

  it('should get incident by id', () => {
    service.getIncidentById('1').subscribe((incident) => {
      expect(incident.id).toBe('1');
      expect(incident.title).toBe('Database Connection Failed');
      expect(incident.description).toBe(
        'Primary database server is not responding to connection requests',
      );
      expect(incident.status).toBe(IncidentStatus.OPEN);
      expect(incident.severity).toBe(IncidentSeverity.HIGH);
      expect(incident.serviceId).toBe('svc-database-001');
      expect(incident.createdAt).toBe('2024-01-15T10:30:00Z');
      expect(incident.updatedAt).toBe('2024-01-15T11:45:00Z');
      expect(incident.events).toBeDefined();
    });
  });

  it('should create incident', () => {
    const createRequest = {
      title: 'New Incident',
      description: 'Test Description',
      severity: IncidentSeverity.MEDIUM,
      serviceId: 'new-service',
    };

    service.createIncident(createRequest).subscribe((incident) => {
      expect(incident.id).toBe('3');
      expect(incident.title).toBe('New Incident');
      expect(incident.description).toBe('Test Description');
      expect(incident.status).toBe(IncidentStatus.OPEN);
      expect(incident.severity).toBe(IncidentSeverity.MEDIUM);
      expect(incident.serviceId).toBe('new-service');
      expect(incident.createdAt).toBeDefined();
      expect(incident.updatedAt).toBeDefined();
    });
  });

  it('should update incident status', () => {
    const updateRequest = {
      status: IncidentStatus.RESOLVED,
    };

    service.updateIncidentStatus('1', updateRequest).subscribe((incident) => {
      expect(incident.id).toBe('1');
      expect(incident.title).toBe('Database Connection Failed');
      expect(incident.description).toBe(
        'Primary database server is not responding to connection requests',
      );
      expect(incident.status).toBe(IncidentStatus.RESOLVED);
      expect(incident.severity).toBe(IncidentSeverity.HIGH);
      expect(incident.serviceId).toBe('svc-database-001');
      expect(incident.createdAt).toBe('2024-01-15T10:30:00Z');
      expect(incident.updatedAt).toBeDefined();
    });
  });
});
