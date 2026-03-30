import { API_ROUTES, API_ERRORS } from '@/shared/constants';
import type { PaginatedResponse } from '@/shared/types';

export interface EnrichedStudy {
  id: string;
  name: string;
  programId: string;
  programName: string;
  therapeuticArea: string;
  principalInvestigator?: string;
  status: string;
  enrollment: { current: number; target: number };
}

export interface StudiesFilter {
  programId?: string;
  area?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

async function handleResponse<T>(res: Response, errorMsg: string): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(body || errorMsg);
  }
  return res.json();
}

export const studiesService = {
  /**
   * Fetch studies with optional filters and pagination.
   */
  async getAll(
    filter?: StudiesFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<EnrichedStudy>> {
    const url = new URL(API_ROUTES.studies, window.location.origin);
    if (filter?.programId)  url.searchParams.set('programId', filter.programId);
    if (filter?.area)       url.searchParams.set('area',      filter.area);
    if (pagination?.page)     url.searchParams.set('page',     String(pagination.page));
    if (pagination?.pageSize) url.searchParams.set('pageSize', String(pagination.pageSize));

    const res = await fetch(url.toString());
    return handleResponse<PaginatedResponse<EnrichedStudy>>(res, API_ERRORS.FETCH_STUDIES);
  },
};
