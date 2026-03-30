/**
 * SERVER-ONLY: Programs service — business logic layer.
 *
 * Sits between HTTP route handlers and the programs repository.
 * Responsibilities:
 *   - Input validation & normalisation
 *   - ID generation
 *   - Derived-field computation
 *   - Error semantics (throws typed ServiceError on business-rule violations)
 */

import {
  programsRepository,
  type ProgramsFilter,
  type PaginationOptions,
} from '@/server/repositories/programs.repository';
import type { Program } from '@/shared/types';

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------

export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 400 | 404 | 409 | 500 = 500,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// ---------------------------------------------------------------------------
// Input shapes
// ---------------------------------------------------------------------------

export interface CreateProgramInput {
  name: string;
  developmentPhase: Program['developmentPhase'];
  therapeuticArea: string;
  targetIndication: string;
  milestone?: string;
  status?: Program['status'];
  principalInvestigator?: string;
  enrollmentTarget?: number;
  budget?: number;
}

export interface UpdateProgramInput extends Partial<CreateProgramInput> {
  complianceStatus?: Program['complianceStatus'];
  enrolledPatients?: number;
  successRate?: number;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const programsService = {
  /**
   * List programs with optional filtering and pagination.
   * Defaults to page 1 / 50 per page.
   */
  list(
    filter: ProgramsFilter = {},
    pagination: Partial<PaginationOptions> = {},
  ) {
    const page     = Math.max(1, pagination.page     ?? 1);
    const pageSize = Math.min(200, Math.max(1, pagination.pageSize ?? 50));
    return programsRepository.findPaginated(filter, { page, pageSize });
  },

  /**
   * Return a single program or throw 404.
   */
  get(id: string): Program {
    if (!id?.trim()) throw new ServiceError('Program id is required', 400);
    const program = programsRepository.findById(id);
    if (!program) throw new ServiceError(`Program ${id} not found`, 404);
    return program;
  },

  /**
   * Create a new program with a generated id and sensible defaults.
   */
  create(input: CreateProgramInput): Program {
    if (!input.name?.trim())
      throw new ServiceError('name is required', 400);
    if (!input.developmentPhase)
      throw new ServiceError('developmentPhase is required', 400);
    if (!input.therapeuticArea?.trim())
      throw new ServiceError('therapeuticArea is required', 400);
    if (!input.targetIndication?.trim())
      throw new ServiceError('targetIndication is required', 400);

    const id = `PRG${String(Date.now()).slice(-5)}${Math.floor(Math.random() * 10)}`;

    const program: Program = {
      id,
      name:                  input.name.trim(),
      developmentPhase:      input.developmentPhase,
      therapeuticArea:       input.therapeuticArea.trim(),
      targetIndication:      input.targetIndication.trim(),
      milestone:             input.milestone ?? 'Compound Synthesis',
      status:                input.status    ?? 'active',
      principalInvestigator: input.principalInvestigator,
      enrollmentTarget:      input.enrollmentTarget ?? 0,
      enrolledPatients:      0,
      budget:                input.budget ?? 0,
      complianceStatus:      'pending',
      successRate:           60,
      startDate:             new Date().toISOString().split('T')[0],
      studies:               [],
    };

    return programsRepository.create(program);
  },

  /**
   * Apply a partial update to an existing program.
   */
  update(id: string, input: UpdateProgramInput): Program {
    if (!id?.trim()) throw new ServiceError('Program id is required', 400);

    // Validate allowed range for numeric fields
    if (input.successRate !== undefined) {
      if (input.successRate < 0 || input.successRate > 100)
        throw new ServiceError('successRate must be between 0 and 100', 400);
    }
    if (input.enrolledPatients !== undefined && input.enrolledPatients < 0) {
      throw new ServiceError('enrolledPatients cannot be negative', 400);
    }

    const updated = programsRepository.update(id, input);
    if (!updated) throw new ServiceError(`Program ${id} not found`, 404);
    return updated;
  },

  /**
   * Delete a program by id.
   */
  remove(id: string): void {
    if (!id?.trim()) throw new ServiceError('Program id is required', 400);
    const deleted = programsRepository.delete(id);
    if (!deleted) throw new ServiceError(`Program ${id} not found`, 404);
  },
};
