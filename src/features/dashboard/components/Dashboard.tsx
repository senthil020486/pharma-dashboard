'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchPrograms } from '@/store/slices/programsSlice';
import { setPhaseFilter, setAreaFilter } from '@/store/slices/filtersSlice';
import { ProgramList } from '@/features/programs/components';
import { FilterPanel } from '@/features/programs/components';
import { ProgramDetails } from '@/features/programs/components';
import { AdminPanel } from '@/features/admin/components';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const programsState = useSelector((state: RootState) => state.programs) as any;
  const filtersState = useSelector((state: RootState) => state.filters) as any;
  const authState = useSelector((state: RootState) => state.auth) as any;

  const { data: programs = [], loading = false, selectedProgram = null } = programsState;
  const { developmentPhase = [], therapeuticArea = [] } = filtersState;
  const { user = null } = authState;

  const [showAdmin, setShowAdmin] = React.useState(false);

  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch]);

  const handlePhaseFilter = (phases: string[]) => {
    dispatch(setPhaseFilter(phases));
  };

  const handleAreaFilter = (areas: string[]) => {
    dispatch(setAreaFilter(areas));
  };

  return (
    <div className={styles.container}>
      {showAdmin && user?.role === 'admin' ? (
        <main className={styles.mainFull}>
          <AdminPanel />
        </main>
      ) : (
        <>
          <aside className={styles.sidebar}>
            <FilterPanel
              onPhaseFilter={handlePhaseFilter}
              onAreaFilter={handleAreaFilter}
              selectedPhases={developmentPhase}
              selectedAreas={therapeuticArea}
            />
          </aside>

          <main className={styles.main}>
            {selectedProgram ? (
              <ProgramDetails program={selectedProgram} />
            ) : (
              <ProgramList programs={programs} loading={loading} />
            )}
          </main>
        </>
      )}
    </div>
  );
}
