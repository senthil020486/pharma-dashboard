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
      <p className={styles.count} aria-live="polite">Total: {programs.length} programs</p>

      {programs.length === 0 ? (
        <p className={styles.empty} role="status">No programs found</p>
      ) : (
        <div className={styles.tableWrapper} role="region" aria-label="Programs table">
          <table className={styles.table} role="table" aria-label="List of pharmaceutical programs with their status and details">
            <caption className={styles.caption} style={{position: 'absolute', left: '-10000px'}}>
              Table of pharmaceutical programs showing program name, development phase, therapeutic area, milestone, current status, and action buttons for viewing details
            </caption>
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
                <tr key={program.id} data-program-id={program.id}>
                  <td headers="program-name"><strong>{program.name}</strong></td>
                  <td headers="phase">{program.developmentPhase}</td>
                  <td headers="area">{program.therapeuticArea}</td>
                  <td headers="milestone">{program.milestone}</td>
                  <td headers="status">
                    <span 
                      className={`${styles.status} ${styles[program.status.toLowerCase()]}`}
                      role="status"
                      aria-label={`Status: ${program.status}`}
                    >
                      {program.status}
                    </span>
                  </td>
                  <td headers="action">
                    {canViewDetails ? (
                      <button
                        className={styles.button}
                        onClick={() => handleRowClick(program.id)}
                        aria-label={`View details for program ${program.name}`}
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
