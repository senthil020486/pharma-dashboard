/**
 * SERVER-ONLY: Programs repository — all data-access logic in one place.
 * Route handlers call this; nothing else should query `db` directly.
 */

import { db } from '@/server/db/seed';
import type { Program } from '@/shared/types';

export interface ProgramsFilter {
  phase?: string;
  area?: string;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export const programsRepository = {
  /** Return all programs (optionally filtered, no pagination). */
  findAll(filter: ProgramsFilter = {}): Program[] {
    let results = [...db.programs];

    if (filter.phase && filter.phase !== 'all') {
      results = results.filter((p) => p.developmentPhase === filter.phase);
    }
    if (filter.area && filter.area !== 'all') {
      results = results.filter((p) => p.therapeuticArea === filter.area);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.therapeuticArea.toLowerCase().includes(q) ||
          p.targetIndication.toLowerCase().includes(q),
      );
    }

    return results;
  },

  /** Return a paginated slice. */
  findPaginated(filter: ProgramsFilter, pagination: PaginationOptions) {
    const all   = this.findAll(filter);
    const total = all.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const data  = all.slice(start, start + pagination.pageSize);

    return {
      data,
      pagination: {
        page:       pagination.page,
        pageSize:   pagination.pageSize,
        total,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
    };
  },

  /** Find a single program by id (includes studies). */
  findById(id: string): Program | undefined {
    return db.programs.find((p) => p.id === id);
  },

  /** Update a program in-place and return the updated record. */
  update(id: string, patch: Partial<Program>): Program | undefined {
    const idx = db.programs.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    db.programs[idx] = { ...db.programs[idx], ...patch };
    return db.programs[idx];
  },

  /** Remove a program and return whether it existed. */
  delete(id: string): boolean {
    const idx = db.programs.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    db.programs.splice(idx, 1);
    return true;
  },

  /** Append a new program. */
  create(program: Program): Program {
    db.programs.push(program);
    return program;
  },
};
