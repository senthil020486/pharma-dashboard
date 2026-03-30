export const API_ROUTES = {
  programs:          '/api/programs',
  programById:       (id: string) => `/api/programs/${id}`,
  studies:           '/api/studies',
  analytics:         '/api/analytics',
} as const;

export const API_ERRORS = {
  FETCH_PROGRAMS:    'Failed to fetch programs',
  FETCH_PROGRAM:     'Failed to fetch program details',
  UPDATE_PROGRAM:    'Failed to update program',
  DELETE_PROGRAM:    'Failed to delete program',
  FETCH_ANALYTICS:   'Failed to fetch analytics',
  FETCH_STUDIES:     'Failed to fetch studies',
} as const;
