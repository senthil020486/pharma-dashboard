/**
 * SERVER-ONLY: Studies service — business logic layer.
 *
 * Validates query inputs and delegates to the studies repository.
 */

import {
  studiesRepository,
  type StudiesFilter,
} from '@/server/repositories/studies.repository';
import { ServiceError } from './programs.service';

export interface ListStudiesInput {
  area?: string;
  programId?: string;
  page?: number | string;
  pageSize?: number | string;
}

export const studiesService = {
  /**
   * Return a paginated list of enriched studies.
   * Coerces string page/pageSize values from query params.
   */
  list(input: ListStudiesInput = {}) {
    const page     = Math.max(1, parseInt(String(input.page     ?? '1'),  10));
    const pageSize = Math.min(200, Math.max(1, parseInt(String(input.pageSize ?? '50'), 10)));

    if (Number.isNaN(page) || Number.isNaN(pageSize)) {
      throw new ServiceError('page and pageSize must be valid integers', 400);
    }

    const filter: StudiesFilter = {
      area:      input.area?.trim()      || undefined,
      programId: input.programId?.trim() || undefined,
    };

    return studiesRepository.findPaginated(filter, { page, pageSize });
  },
};
