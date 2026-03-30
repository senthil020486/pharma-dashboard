export const TIME_RANGES = ['week', 'month', 'quarter', 'year', 'all'] as const;
export type TimeRange = typeof TIME_RANGES[number];

export const TIME_RANGE_LABELS: Record<string, string> = {
  week:    'Last 7 Days',
  month:   'Last 30 Days',
  quarter: 'Last Quarter',
  year:    'Last Year',
  all:     'All Time',
};

export const ANALYTICS_METRICS_CONFIG = {
  totalPrograms:     { label: 'Total Programs',       icon: '💊', color: '#3b82f6' },
  activePrograms:    { label: 'Active Programs',       icon: '🔬', color: '#10b981' },
  approvedPrograms:  { label: 'Approved Programs',     icon: '✅', color: '#22c55e' },
  totalPatients:     { label: 'Total Patients',        icon: '👥', color: '#8b5cf6' },
  complianceRate:    { label: 'Compliance Rate',       icon: '📋', color: '#f59e0b' },
  successRate:       { label: 'Avg Success Rate',      icon: '📈', color: '#06b6d4' },
  budgetUtilization: { label: 'Budget Utilization',    icon: '💰', color: '#ef4444' },
} as const;
