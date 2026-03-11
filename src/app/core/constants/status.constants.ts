import { IncidentStatus } from '../../models';

export const STATUS_OPTIONS = [
  { value: IncidentStatus.OPEN, label: 'Abierto', color: '#dc3545' },
  { value: IncidentStatus.IN_PROGRESS, label: 'En Progreso', color: '#ffc107' },
  { value: IncidentStatus.RESOLVED, label: 'Resuelto', color: '#28a745' },
  { value: IncidentStatus.CLOSED, label: 'Cerrado', color: '#6c757d' },
];

export const getStatusColor = (status: IncidentStatus): string => {
  const option = STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.color || '#6c757d';
};
