import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '@/features/analytics/services/analyticsService';
import type { AnalyticsMetrics } from '@/shared/types';

export type { AnalyticsMetrics };

export interface AnalyticsState {
  metrics: AnalyticsMetrics | null;
  loading: boolean;
  error: string | null;
  timeRange: 'week' | 'month' | 'quarter' | 'year' | 'all';
  selectedAreas: string[];
}

const initialState: AnalyticsState = {
  metrics: null,
  loading: false,
  error: null,
  timeRange: 'year',
  selectedAreas: [],
};

export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (filters: { timeRange?: string; areas?: string[] } | undefined, { rejectWithValue }) => {
    try {
      return await analyticsService.getMetrics(filters);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },
    setSelectedAreas: (state, action) => {
      state.selectedAreas = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTimeRange, setSelectedAreas } = analyticsSlice.actions;
export default analyticsSlice.reducer;
