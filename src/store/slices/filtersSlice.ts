import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  developmentPhase: string[];
  therapeuticArea: string[];
}

const initialState: FiltersState = {
  developmentPhase: [],
  therapeuticArea: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPhaseFilter: (state, action: PayloadAction<string[]>) => {
      state.developmentPhase = action.payload;
    },
    setAreaFilter: (state, action: PayloadAction<string[]>) => {
      state.therapeuticArea = action.payload;
    },
    clearFilters: (state) => {
      state.developmentPhase = [];
      state.therapeuticArea = [];
    },
  },
});

export const { setPhaseFilter, setAreaFilter, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
