import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { programsService } from '@/features/programs/services/programsService';
import type { Program, Study } from '@/shared/types';

export type { Program, Study };

export interface ProgramsState {
  data: Program[];
  filteredData: Program[];
  selectedProgram: Program | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  searchTerm: string;
}

const initialState: ProgramsState = {
  data: [],
  filteredData: [],
  selectedProgram: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 50,
    total: 0,
  },
  searchTerm: '',
};

// Async thunk to fetch all programs
export const fetchPrograms = createAsyncThunk(
  'programs/fetchPrograms',
  async (filters: { phase?: string; area?: string; page?: number; pageSize?: number } | undefined, { rejectWithValue }) => {
    try {
      return await programsService.getAll(filters);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Async thunk to fetch single program with studies
export const fetchProgramDetails = createAsyncThunk(
  'programs/fetchProgramDetails',
  async (programId: string, { rejectWithValue }) => {
    try {
      return await programsService.getById(programId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Async thunk to update program metadata
export const updateProgramMetadata = createAsyncThunk(
  'programs/updateProgramMetadata',
  async ({ id, data }: { id: string; data: Partial<Program> }, { rejectWithValue }) => {
    try {
      return await programsService.update(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Async thunk to delete program (admin only)
export const deleteProgram = createAsyncThunk(
  'programs/deleteProgram',
  async (programId: string, { rejectWithValue }) => {
    try {
      await programsService.delete(programId);
      return programId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    clearSelectedProgram: (state) => {
      state.selectedProgram = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProgramDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProgram = action.payload;
      })
      .addCase(fetchProgramDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProgramMetadata.fulfilled, (state, action) => {
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.selectedProgram?.id === action.payload.id) {
          state.selectedProgram = action.payload;
        }
      })
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload);
        if (state.selectedProgram?.id === action.payload) {
          state.selectedProgram = null;
        }
      });
  },
});

export const { clearSelectedProgram } = programsSlice.actions;
export default programsSlice.reducer;
