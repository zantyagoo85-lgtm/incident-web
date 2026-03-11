import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpyObj } from 'jasmine';

import { IncidentService } from '../../../core/services/incident.service';
import { Incident, IncidentStatus, IncidentSeverity } from '../../../models';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;
  let incidentService: any;

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
    const filters = {
      status: IncidentStatus.OPEN,
      page: 0,
      pageSize: 10,
    };

    service.getIncidents(filters).subscribe((response) => {
      expect(response).toEqual({
        incidents: [mockIncident],
        totalCount: 1,
        page: 0,
        pageSize: 10,
        totalPages: 1,
      });
    });

    const req = httpMock.expectOne(
      (request) => request.url.includes('/incidents') && request.params.has('status'),
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      incidents: [mockIncident],
      totalCount: 1,
      page: 0,
      pageSize: 10,
      totalPages: 1,
    });
  });

  it('should get incident by id', () => {
    service.getIncidentById('test-id').subscribe((incident) => {
      expect(incident).toEqual({
        ...mockIncident,
        events: [],
      });
    });

    const req = httpMock.expectOne('/incidents/test-id');
    expect(req.request.method).toBe('GET');
    req.flush({
      ...mockIncident,
      events: [],
    });
  });

  it('should create incident', () => {
    const createRequest = {
      title: 'New Incident',
      description: 'New Description',
      severity: IncidentSeverity.MEDIUM,
      serviceId: 'new-service',
    };

    service.createIncident(createRequest).subscribe((incident) => {
      expect(incident).toEqual(mockIncident);
    });

    const req = httpMock.expectOne('/incidents');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createRequest);
    req.flush(mockIncident);
  });

  it('should update incident status', () => {
    const updateRequest = {
      status: IncidentStatus.RESOLVED,
    };

    service.updateIncidentStatus('test-id', updateRequest).subscribe((incident) => {
      expect(incident).toEqual(mockIncident);
    });

    const req = httpMock.expectOne('/incidents/test-id/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateRequest);
    req.flush(mockIncident);
  });
});
