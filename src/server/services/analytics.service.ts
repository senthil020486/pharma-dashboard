/**
 * SERVER-ONLY: Analytics service — business logic layer.
 *
 * Validates and normalises filter inputs before delegating to the
 * analytics repository for aggregation.
 */

import {
  analyticsRepository,
  type AnalyticsFilter,
} from '@/server/repositories/analytics.repository';
import { ServiceError } from './programs.service';
import type { AnalyticsMetrics } from '@/shared/types';

export interface GetMetricsInput {
  /** Comma-separated or array of therapeutic areas to scope the report. */
  areas?: string | string[];
  /** Reserved for future time-range filtering. */
  timeRange?: string;
}

export const analyticsService = {
  /**
   * Compute and return aggregated portfolio metrics.
   * Accepts raw query-string values and normalises them before use.
   */
  getMetrics(input: GetMetricsInput = {}): AnalyticsMetrics {
    // Normalise areas: accept a comma-separated string OR an array
    let areas: string[] = [];
    if (typeof input.areas === 'string' && input.areas.trim()) {
      areas = input.areas.split(',').map((a) => a.trim()).filter(Boolean);
    } else if (Array.isArray(input.areas)) {
      areas = input.areas.filter(Boolean);
    }

    if (areas.length > 20) {
      throw new ServiceError('Cannot filter by more than 20 therapeutic areas at once', 400);
    }

    const filter: AnalyticsFilter = areas.length ? { areas } : {};
    return analyticsRepository.computeMetrics(filter);
  },
};
