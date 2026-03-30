/**
 * SERVER-ONLY: barrel export for all server-side services.
 * Import from here in API route handlers.
 */
export { programsService, ServiceError } from './programs.service';
export type { CreateProgramInput, UpdateProgramInput } from './programs.service';

export { analyticsService } from './analytics.service';
export type { GetMetricsInput } from './analytics.service';

export { studiesService } from './studies.service';
export type { ListStudiesInput } from './studies.service';
