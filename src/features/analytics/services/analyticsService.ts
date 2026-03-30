import { API_ROUTES, API_ERRORS } from '@/shared/constants';
import type { AnalyticsMetrics } from '@/shared/types';

export interface FetchAnalyticsParams {
  timeRange?: string;
  areas?: string[];
}

async function handleResponse<T>(res: Response, errorMsg: string): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || errorMsg);
  }
  return res.json();
}

export const analyticsService = {
  /**
   * Fetch aggregated analytics metrics.
   */
  async getMetrics(params?: FetchAnalyticsParams): Promise<AnalyticsMetrics> {
    const url = new URL(API_ROUTES.analytics, window.location.origin);
    if (params?.timeRange) url.searchParams.set('timeRange', params.timeRange);
    if (params?.areas?.length) url.searchParams.set('areas', params.areas.join(','));

    const res = await fetch(url.toString());
    return handleResponse<AnalyticsMetrics>(res, API_ERRORS.FETCH_ANALYTICS);
  },
};
