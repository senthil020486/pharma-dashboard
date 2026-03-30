// Program development phases (ordered)
export const DEVELOPMENT_PHASES = [
  'Discovery',
  'Preclinical',
  'IND Enabling',
  'Phase 1',
  'Phase 2',
  'Phase 3',
  'NDA Review',
  'Approved',
] as const;

export type DevelopmentPhase = typeof DEVELOPMENT_PHASES[number];

// Abbreviated timeline (used in progress bars/charts)
export const PHASE_TIMELINE = [
  'Discovery',
  'Preclinical',
  'Phase 1',
  'Phase 2',
  'Phase 3',
  'Approved',
] as const;

export const THERAPEUTIC_AREAS = [
  'Oncology',
  'Cardiology',
  'Neurology',
  'Immunology',
  'Endocrinology',
  'Infectious Disease',
  'Respiratory',
  'Gastroenterology',
  'Hematology',
  'Rheumatology',
] as const;

export type TherapeuticArea = typeof THERAPEUTIC_AREAS[number];

export const PROGRAM_STATUSES = ['active', 'on-hold', 'completed', 'discontinued'] as const;
export type ProgramStatus = typeof PROGRAM_STATUSES[number];

export const COMPLIANCE_STATUSES = ['compliant', 'pending', 'non-compliant'] as const;
export type ComplianceStatus = typeof COMPLIANCE_STATUSES[number];

export const STUDY_STATUSES = ['Active', 'Completed', 'Pending'] as const;
export type StudyStatus = typeof STUDY_STATUSES[number];

export const USER_ROLES = ['admin', 'editor', 'viewer'] as const;
export type UserRole = typeof USER_ROLES[number];

// Phase index map for progress calculation
export const PHASE_INDEX: Record<string, number> = Object.fromEntries(
  DEVELOPMENT_PHASES.map((phase, i) => [phase.toLowerCase(), i])
);

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE = 1;

// Status badge color mapping
export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active:         { bg: 'var(--success-bg)',  text: 'var(--success-text)' },
  completed:      { bg: 'var(--info-bg)',     text: 'var(--info-text)' },
  discontinued:   { bg: 'var(--error-bg)',    text: 'var(--error-text)' },
  'on-hold':      { bg: 'var(--warning-bg)',  text: 'var(--warning-text)' },
  compliant:      { bg: 'var(--success-bg)',  text: 'var(--success-text)' },
  pending:        { bg: 'var(--warning-bg)',  text: 'var(--warning-text)' },
  'non-compliant':{ bg: 'var(--error-bg)',    text: 'var(--error-text)' },
};

// Phase color mapping for charts
export const PHASE_COLORS: Record<string, string> = {
  Discovery:        '#8b5cf6',
  Preclinical:      '#6366f1',
  'IND Enabling':   '#3b82f6',
  'Phase 1':        '#0ea5e9',
  'Phase 2':        '#06b6d4',
  'Phase 3':        '#10b981',
  'NDA Review':     '#f59e0b',
  Approved:         '#22c55e',
};

// Therapeutic area color mapping for charts
export const AREA_COLORS: Record<string, string> = {
  Oncology:            '#ef4444',
  Cardiology:          '#f97316',
  Neurology:           '#a855f7',
  Immunology:          '#3b82f6',
  Endocrinology:       '#06b6d4',
  'Infectious Disease':'#10b981',
  Respiratory:         '#84cc16',
  Gastroenterology:    '#eab308',
  Hematology:          '#ec4899',
  Rheumatology:        '#6366f1',
};
