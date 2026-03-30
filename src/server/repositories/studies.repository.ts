/**
 * SERVER-ONLY: Studies repository — collects and filters studies across all programs.
 */

import { db } from '@/server/db/seed';
import type { Study } from '@/shared/types';

export interface EnrichedStudy extends Study {
  programId:            string;
  programName:          string;
  therapeuticArea:      string;
  principalInvestigator?: string;
}

export interface StudiesFilter {
  area?: string;
  programId?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export const studiesRepository = {
  findAll(filter: StudiesFilter = {}): EnrichedStudy[] {
    const results: EnrichedStudy[] = [];

    for (const program of db.programs) {
      if (filter.programId && program.id !== filter.programId) continue;
      if (filter.area      && program.therapeuticArea !== filter.area)  continue;

      for (const study of program.studies ?? []) {
        results.push({
          ...study,
          programId:            program.id,
          programName:          program.name,
          therapeuticArea:      program.therapeuticArea,
          principalInvestigator: program.principalInvestigator,
        });
      }
    }

    return results;
  },

  findPaginated(filter: StudiesFilter, pagination: PaginationOptions) {
    const all   = this.findAll(filter);
    const total = all.length;
    const start = (pagination.page - 1) * pagination.pageSize;

    return {
      data: all.slice(start, start + pagination.pageSize),
      pagination: {
        page:       pagination.page,
        pageSize:   pagination.pageSize,
        total,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
    };
  },
};
