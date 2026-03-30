import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchFilters {
  searchTerm: string;
  phases: string[];
  areas: string[];
  statuses: string[];
  complianceStatus: string[];
  budgetRange: [number, number];
  enrollmentRange: [number, number];
  sortBy: 'name' | 'phase' | 'area' | 'enrollment' | 'budget' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface SearchState {
  filters: SearchFilters;
  recentSearches: string[];
  savedFilters: Array<{ id: string; name: string; filters: SearchFilters }>;
}

const initialState: SearchState = {
  filters: {
    searchTerm: '',
    phases: [],
    areas: [],
    statuses: [],
    complianceStatus: [],
    budgetRange: [0, 50000000],
    enrollmentRange: [0, 1000],
    sortBy: 'name',
    sortOrder: 'asc',
  },
  recentSearches: [],
  savedFilters: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
      if (action.payload.length > 0 && !state.recentSearches.includes(action.payload)) {
        state.recentSearches.unshift(action.payload);
        if (state.recentSearches.length > 10) state.recentSearches.pop();
      }
    },
    setPhaseFilters: (state, action: PayloadAction<string[]>) => {
      state.filters.phases = action.payload;
    },
    setAreaFilters: (state, action: PayloadAction<string[]>) => {
      state.filters.areas = action.payload;
    },
    setStatusFilters: (state, action: PayloadAction<string[]>) => {
      state.filters.statuses = action.payload;
    },
    setComplianceFilters: (state, action: PayloadAction<string[]>) => {
      state.filters.complianceStatus = action.payload;
    },
    setBudgetRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.budgetRange = action.payload;
    },
    setEnrollmentRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.enrollmentRange = action.payload;
    },
    setSortBy: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.filters.sortBy = action.payload.sortBy as any;
      state.filters.sortOrder = action.payload.sortOrder;
    },
    clearAllFilters: (state) => {
      state.filters = initialState.filters;
    },
    saveFilter: (state, action: PayloadAction<{ name: string; filters: SearchFilters }>) => {
      const id = `filter-${Date.now()}`;
      state.savedFilters.push({ id, ...action.payload });
    },
    loadFilter: (state, action: PayloadAction<string>) => {
      const saved = state.savedFilters.find((f) => f.id === action.payload);
      if (saved) {
        state.filters = saved.filters;
      }
    },
    deleteFilter: (state, action: PayloadAction<string>) => {
      state.savedFilters = state.savedFilters.filter((f) => f.id !== action.payload);
    },
  },
});

export const {
  setSearchTerm,
  setPhaseFilters,
  setAreaFilters,
  setStatusFilters,
  setComplianceFilters,
  setBudgetRange,
  setEnrollmentRange,
  setSortBy,
  clearAllFilters,
  saveFilter,
  loadFilter,
  deleteFilter,
} = searchSlice.actions;

export default searchSlice.reducer;
