/**
 * Shared domain types — safe to import from both server and client code.
 */

export interface Study {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'Pending';
  enrollment: { current: number; target: number };
}

export interface Program {
  id: string;
  name: string;
  developmentPhase: 'Discovery' | 'Preclinical' | 'IND Enabling' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'NDA Review' | 'Approved';
  therapeuticArea: string;
  milestone: string;
  targetIndication: string;
  status: string;
  studies?: Study[];
  principalInvestigator?: string;
  enrollmentTarget?: number;
  enrolledPatients?: number;
  startDate?: string;
  expectedCompletion?: string;
  budget?: number;
  complianceStatus?: 'compliant' | 'pending' | 'non-compliant';
  successRate?: number;
}

export interface AnalyticsMetrics {
  totalPrograms: number;
  activePrograms: number;
  approvedPrograms: number;
  discontinuedPrograms: number;
  averageEnrollment: number;
  totalPatients: number;
  complianceRate: number;
  successRate: number;
  budgetUtilization: number;
  phaseDistribution: Record<string, number>;
  areaDistribution: Record<string, number>;
  statusTimeline: Array<{ date: string; phase: string; count: number }>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
