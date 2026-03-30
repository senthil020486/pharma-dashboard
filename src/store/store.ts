import { configureStore } from '@reduxjs/toolkit';
import programsReducer from './slices/programsSlice';
import filtersReducer from './slices/filtersSlice';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import adminReducer from './slices/adminSlice';
import analyticsReducer from './slices/analyticsSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    programs: programsReducer,
    filters: filtersReducer,
    auth: authReducer,
    theme: themeReducer,
    admin: adminReducer,
    analytics: analyticsReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
