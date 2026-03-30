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

  if (!isAuthenticated) return <div className={styles.container}>Please login first</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔬 Clinical Studies Management</h1>
        <div className={styles.controls}>
          <select
            value={areaFilter}
            onChange={(e) => { setAreaFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            className={styles.filterSelect}
          >
            <option value="">All Therapeutic Areas</option>
            {THERAPEUTIC_AREAS.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading studies...</div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {['Study ID','Program','Therapeutic Area','Principal Investigator','Status','Enrollment','Progress'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {studies.map((study) => {
                  const pct = (study.enrollment.current / study.enrollment.target) * 100;
                  return (
                    <tr key={study.id}>
                      <td className={styles.studyId}>{study.id}</td>
                      <td>{study.programName}</td>
                      <td>{study.therapeuticArea}</td>
                      <td>{study.principalInvestigator}</td>
                      <td>
                        <span className={`${styles.status} ${styles[study.status.toLowerCase()]}`}>{study.status}</span>
                      </td>
                      <td>{study.enrollment.current} / {study.enrollment.target}</td>
                      <td>
                        <div className={styles.progressBar}>
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

          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {pagination.page} of {pagination.totalPages} (Total: {pagination.total} studies)
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
