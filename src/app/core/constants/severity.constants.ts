import { IncidentSeverity } from '../../models';

export const SEVERITY_OPTIONS = [
  { value: IncidentSeverity.LOW, label: 'Baja', color: '#28a745' },
  { value: IncidentSeverity.MEDIUM, label: 'Media', color: '#ffc107' },
  { value: IncidentSeverity.HIGH, label: 'Alta', color: '#fd7e14' },
  { value: IncidentSeverity.CRITICAL, label: 'Crítica', color: '#dc3545' }
];

export const getStatusColor = (severity: IncidentSeverity): string => {
  const option = SEVERITY_OPTIONS.find(opt => opt.value === severity);
  return option?.color || '#6c757d';
};
