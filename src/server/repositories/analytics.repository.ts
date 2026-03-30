/**
 * SERVER-ONLY: Analytics repository — aggregation logic over the programs store.
 */

import { programsRepository } from './programs.repository';
import type { AnalyticsMetrics } from '@/shared/types';

export interface AnalyticsFilter {
  areas?: string[];
}

export const analyticsRepository = {
  computeMetrics(filter: AnalyticsFilter = {}): AnalyticsMetrics {
    let programs = programsRepository.findAll({});

    if (filter.areas?.length) {
      programs = programs.filter((p) => filter.areas!.includes(p.therapeuticArea));
    }

    const total            = programs.length;
    const active           = programs.filter((p) => p.status === 'active').length;
    const approved         = programs.filter((p) => p.status === 'completed').length;
    const discontinued     = programs.filter((p) => p.status === 'discontinued').length;
    const totalPatients    = programs.reduce((s, p) => s + (p.enrolledPatients ?? 0), 0);
    const avgEnrollment    = programs.reduce((s, p) => s + (p.enrollmentTarget ?? 0), 0) / Math.max(total, 1);
    const compliant        = programs.filter((p) => p.complianceStatus === 'compliant').length;
    const complianceRate   = (compliant / Math.max(total, 1)) * 100;
    const avgSuccess       = programs.reduce((s, p) => s + (p.successRate ?? 0), 0) / Math.max(total, 1);
    const budgetUtil       = (totalPatients / Math.max(total * 100, 1)) * 100;

    const phaseDistribution: Record<string, number> = {};
    const areaDistribution:  Record<string, number> = {};

    programs.forEach((p) => {
      phaseDistribution[p.developmentPhase] = (phaseDistribution[p.developmentPhase] ?? 0) + 1;
      areaDistribution[p.therapeuticArea]   = (areaDistribution[p.therapeuticArea]   ?? 0) + 1;
    });

    const statusTimeline = Object.keys(phaseDistribution)
      .sort()
      .map((phase, idx) => ({
        date:  `2024-Q${idx + 1}`,
        phase,
        count: phaseDistribution[phase],
      }));

    return {
      totalPrograms:      total,
      activePrograms:     active,
      approvedPrograms:   approved,
      discontinuedPrograms: discontinued,
      averageEnrollment:  Math.floor(avgEnrollment),
      totalPatients,
      complianceRate:     Math.floor(complianceRate),
      successRate:        Math.floor(avgSuccess),
      budgetUtilization:  Math.floor(budgetUtil),
      phaseDistribution,
      areaDistribution,
      statusTimeline,
    };
  },
};
