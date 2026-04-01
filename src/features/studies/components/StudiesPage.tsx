'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { studiesService, EnrichedStudy } from '@/features/studies/services/studiesService';
import { THERAPEUTIC_AREAS } from '@/shared/constants';
import styles from './StudiesPage.module.css';

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function StudiesPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth) as any;
  const [studies, setStudies]   = useState<EnrichedStudy[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 50, total: 0, totalPages: 0 });
  const [loading, setLoading]   = useState(true);
  const [areaFilter, setAreaFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    studiesService.getAll(
        { area: areaFilter || undefined },
        { page: pagination.page, pageSize: pagination.pageSize },
      )
      .then((data: any) => {
        setStudies(data.data);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, pagination.page, areaFilter]);

  if (!isAuthenticated) return <div className={styles.container} role="alert">Please login first</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔬 Clinical Studies Management</h1>
        <div className={styles.controls}>
          <label htmlFor="area-filter" className={styles.filterLabel}>Filter by Therapeutic Area:</label>
          <select
            id="area-filter"
            value={areaFilter}
            onChange={(e) => { setAreaFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className={styles.filterSelect}
            aria-label="Filter studies by therapeutic area"
          >
            <option value="">All Therapeutic Areas</option>
            {THERAPEUTIC_AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading} role="status" aria-live="polite">Loading studies...</div>
      ) : (
        <>
          <div className={styles.tableContainer} role="region" aria-label="Clinical studies table">
            <table 
              className={styles.table}
              role="table"
              aria-label="List of clinical studies with enrollment and progress information"
            >
              <caption style={{position: 'absolute', left: '-10000px'}}>
                Table showing clinical studies with their program associations, therapeutic areas, principal investigators, current status, enrollment progress, and completion percentage
              </caption>
              <thead>
                <tr>
                  {['Study ID','Program','Therapeutic Area','Principal Investigator','Status','Enrollment','Progress'].map(h => (
                    <th key={h} scope="col">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studies.map((study) => {
                  const pct = (study.enrollment.current / study.enrollment.target) * 100;
                  return (
                    <tr key={study.id} role="row">
                      <td className={styles.studyId} role="cell">{study.id}</td>
                      <td role="cell">{study.programName}</td>
                      <td role="cell">{study.therapeuticArea}</td>
                      <td role="cell">{study.principalInvestigator}</td>
                      <td role="cell">
                        <span 
                          className={`${styles.status} ${styles[study.status.toLowerCase()]}`}
                          role="status"
                          aria-label={`Status: ${study.status}`}
                        >
                          {study.status}
                        </span>
                      </td>
                      <td role="cell" aria-label={`Enrollment: ${study.enrollment.current} out of ${study.enrollment.target} participants`}>
                        {study.enrollment.current} / {study.enrollment.target}
                      </td>
                      <td role="cell">
                        <div 
                          className={styles.progressBar}
                          role="progressbar"
                          aria-valuenow={Math.round(pct)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Enrollment progress: ${Math.floor(pct)}%`}
                        >
                          <div className={styles.progressFill} style={{ width: `${pct}%` }}>
                            {Math.floor(pct)}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div 
            className={styles.pagination}
            role="navigation"
            aria-label="Study pagination"
          >
            <button
              className={styles.paginationButton}
              onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page === 1}
              aria-label="Go to previous page"
            >
              Previous
            </button>
            <span 
              className={styles.paginationInfo}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              Page {pagination.page} of {pagination.totalPages} (Total: {pagination.total} studies)
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
