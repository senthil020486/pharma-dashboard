'use client';

import React from 'react';
import { Program } from '@/store/slices/programsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgramDetails } from '@/store/slices/programsSlice';
import { AppDispatch, RootState } from '@/store/store';
import styles from './ProgramList.module.css';

interface ProgramListProps {
  programs: Program[];
  loading: boolean;
}

export default function ProgramList({ programs, loading }: ProgramListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth) as any;
  const user = authState?.user;

  // Only admin and editor can view details
  const canViewDetails = user && (user.role === 'admin' || user.role === 'editor');

  const handleRowClick = (programId: string) => {
    dispatch(fetchProgramDetails(programId));
  };

  if (loading) {
    return <div className={styles.loading}>Loading programs...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Programs</h2>
      <p className={styles.count}>Total: {programs.length} programs</p>

      {programs.length === 0 ? (
        <p className={styles.empty}>No programs found</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table} role="grid">
            <thead>
              <tr>
                <th scope="col">Program Name</th>
                <th scope="col">Phase</th>
                <th scope="col">Therapeutic Area</th>
                <th scope="col">Milestone</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.name}</td>
                  <td>{program.developmentPhase}</td>
                  <td>{program.therapeuticArea}</td>
                  <td>{program.milestone}</td>
                  <td>
                    <span className={`${styles.status} ${styles[program.status.toLowerCase()]}`}>
                      {program.status}
                    </span>
                  </td>
                  <td>
                    {canViewDetails ? (
                      <button
                        className={styles.button}
                        onClick={() => handleRowClick(program.id)}
                        aria-label={`View details for ${program.name}`}
                      >
                        View Details
                      </button>
                    ) : (
                      <span className={styles.restricted} title="View Details not available for your role">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
