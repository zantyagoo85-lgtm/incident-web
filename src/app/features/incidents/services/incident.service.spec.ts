import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IncidentService } from '../../../core/services/incident.service';
import { IncidentStatus, IncidentSeverity, ApiIncidentStatus } from '../../../models';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;

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
    const fullApiResponse = {
      success: true,
      message: 'Operation completed successfully',
      data: {
        items: [
          {
            id: '1',
            title: 'Test Incident',
            description: 'Test Description',
            severity: IncidentSeverity.HIGH,
            status: IncidentStatus.OPEN,
            serviceId: 'svc-database-001',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T11:45:00Z',
          },
        ],
        currentPage: 0,
        totalPages: 1,
        pageSize: 10,
        totalCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      meta: {
        timestamp: '2024-01-15T10:30:00Z',
        traceId: 'test-trace-id',
      },
    };

    service.getIncidents(filters).subscribe((response) => {
      expect(response.items).toBeDefined();
      expect(response.items.length).toBe(1);
      expect(response.totalCount).toBe(1);
      expect(response.currentPage).toBe(0);
      expect(response.pageSize).toBe(10);
      expect(response.totalPages).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/incidents?status=OPEN');
    expect(req.request.method).toBe('GET');
    req.flush(fullApiResponse);
  });

  it('should get incident by id', () => {
    const mockApiResponse = {
      success: true,
      message: 'Operation completed successfully',
      data: {
        incident: {
          id: '1',
          title: 'Database Connection Failed',
          description: 'Primary database server is not responding to connection requests',
          severity: IncidentSeverity.HIGH,
          status: IncidentStatus.OPEN,
          serviceId: 'svc-database-001',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T11:45:00Z',
        },
        timeline: [
          {
            id: 'evt-1',
            eventType: 'incident_created',
            description: 'Incident created',
            occurredAt: '2024-01-15T10:30:00Z',
            changedBy: 'system@app.local',
            correlationId: 'corr-1',
            userEmail: 'system@app.local',
          },
        ],
      },
      meta: {
        timestamp: '2024-01-15T10:30:00Z',
        traceId: 'test-trace-id',
      },
    };

    service.getIncidentById('1').subscribe((response) => {
      expect(response.id).toBe('1');
      expect(response.title).toBe('Database Connection Failed');
      expect(response.description).toBe(
        'Primary database server is not responding to connection requests',
      );
      expect(response.status).toBe(IncidentStatus.OPEN);
      expect(response.severity).toBe(IncidentSeverity.HIGH);
      expect(response.serviceId).toBe('svc-database-001');
      expect(response.createdAt).toBe('2024-01-15T10:30:00Z');
      expect(response.updatedAt).toBe('2024-01-15T11:45:00Z');
      expect(response.events).toBeDefined();
      expect(response.events.length).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/incidents/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should create incident', () => {
    const createRequest = {
      title: 'New Incident',
      description: 'Test Description',
      severity: IncidentSeverity.MEDIUM,
      serviceId: 'new-service',
    };

    const mockCreatedIncident = {
      id: '3',
      title: 'New Incident',
      description: 'Test Description',
      severity: IncidentSeverity.MEDIUM,
      status: IncidentStatus.OPEN,
      serviceId: 'new-service',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };

    const fullApiResponse = {
      success: true,
      message: 'Operation completed successfully',
      data: mockCreatedIncident,
      meta: {
        timestamp: '2024-01-15T10:30:00Z',
        traceId: 'test-trace-id',
      },
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

    const req = httpMock.expectOne('http://localhost:5000/api/incidents');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createRequest);
    req.flush(fullApiResponse);
  });

  it('should update incident status', () => {
    const updateRequest = {
      status: ApiIncidentStatus.RESOLVED,
    };

    const mockUpdatedIncident = {
      id: '1',
      title: 'Database Connection Failed',
      description: 'Primary database server is not responding to connection requests',
      severity: IncidentSeverity.HIGH,
      status: IncidentStatus.RESOLVED,
      serviceId: 'svc-database-001',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T12:00:00Z',
    };

    const fullApiResponse = {
      success: true,
      message: 'Operation completed successfully',
      data: mockUpdatedIncident,
      meta: {
        timestamp: '2024-01-15T10:30:00Z',
        traceId: 'test-trace-id',
      },
    };

    const mockUpdatedIncident = {
      id: '1',
      title: 'Database Connection Failed',
      description: 'Primary database server is not responding to connection requests',
      severity: IncidentSeverity.HIGH,
      status: IncidentStatus.RESOLVED,
      serviceId: 'svc-database-001',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T12:00:00Z',
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
      expect(incident.updatedAt).toBe('2024-01-15T12:00:00Z');
    });

    const req = httpMock.expectOne('http://localhost:5000/api/incidents/1/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateRequest);
    req.flush(fullApiResponse);
  });
});
