import { API_ROUTES, API_ERRORS } from '@/shared/constants';
import type { Program, PaginatedResponse } from '@/shared/types';

export interface FetchProgramsParams {
  phase?: string;
  area?: string;
  search?: string;
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

export const programsService = {
  /**
   * Fetch a paginated/filtered list of programs.
   * Returns raw array for backwards-compatibility when pageSize=1000.
   */
  async getAll(params?: FetchProgramsParams): Promise<Program[]> {
    const url = new URL(API_ROUTES.programs, window.location.origin);
    if (params?.phase)    url.searchParams.set('phase',    params.phase);
    if (params?.area)     url.searchParams.set('area',     params.area);
    if (params?.search)   url.searchParams.set('search',   params.search);
    if (params?.page)     url.searchParams.set('page',     String(params.page));
    if (params?.pageSize) url.searchParams.set('pageSize', String(params.pageSize));

    const res  = await fetch(url.toString());
    const body = await handleResponse<PaginatedResponse<Program>>(res, API_ERRORS.FETCH_PROGRAMS);
    // API always returns { data, pagination } now
    return Array.isArray(body) ? body : (body as any).data;
  },

  /**
   * Fetch a single program with full study details.
   */
  async getById(id: string): Promise<Program> {
    const res = await fetch(API_ROUTES.programById(id));
    return handleResponse<Program>(res, API_ERRORS.FETCH_PROGRAM);
  },

  /**
   * Update program metadata (editor/admin only).
   */
  async update(id: string, data: Partial<Program>): Promise<Program> {
    const res = await fetch(API_ROUTES.programById(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Program>(res, API_ERRORS.UPDATE_PROGRAM);
  },

  /**
   * Delete a program (admin only).
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const res = await fetch(API_ROUTES.programById(id), { method: 'DELETE' });
    return handleResponse<{ success: boolean }>(res, API_ERRORS.DELETE_PROGRAM);
  },

  /**
   * Create a new program.
   */
  async create(data: Partial<Program>): Promise<Program> {
    const res = await fetch(API_ROUTES.programs, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Program>(res, API_ERRORS.FETCH_PROGRAMS);
  },
};
