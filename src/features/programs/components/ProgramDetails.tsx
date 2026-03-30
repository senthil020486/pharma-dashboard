'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Program, updateProgramMetadata, clearSelectedProgram, deleteProgram } from '@/store/slices/programsSlice';
import { Study } from '@/store/slices/programsSlice';
import { addAuditLog } from '@/store/slices/adminSlice';
import styles from './ProgramDetails.module.css';

interface ProgramDetailsProps {
  program: Program;
}

const PHASE_TIMELINE = [
  'Discovery',
  'Preclinical',
  'Phase 1',
  'Phase 2',
  'Phase 3',
  'Approved'
];

export default function ProgramDetails({ program }: ProgramDetailsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth) as any;
  const user = authState?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [editedProgram, setEditedProgram] = useState<Partial<Program>>(program);

  // Check if user can edit
  const canEdit = user && (user.role === 'editor' || user.role === 'admin');
  
  // Check if user can delete (admin only)
  const canDelete = user && user.role === 'admin';

  // Get current phase index
  const currentPhaseIndex = PHASE_TIMELINE.findIndex(
    (phase) => phase.toLowerCase() === program.developmentPhase.toLowerCase()
  );

  // Calculate completion percentage
  const completionPercentage = currentPhaseIndex >= 0 
    ? ((currentPhaseIndex + 1) / PHASE_TIMELINE.length) * 100 
    : 0;

  const handleBackClick = () => {
    dispatch(clearSelectedProgram());
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${program.name}"? This action cannot be undone.`)) {
      await dispatch(deleteProgram(program.id));
      dispatch(addAuditLog({
        timestamp: new Date().toISOString(),
        userId: user?.id || 'unknown',
        userName: user?.name || 'Unknown User',
        action: 'DELETE_PROGRAM',
        target: 'Program',
        targetId: program.id,
        details: `Deleted program "${program.name}"`,
      }));
      dispatch(clearSelectedProgram());
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProgram(program);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Program, value: string) => {
    setEditedProgram((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (program.id) {
      await dispatch(updateProgramMetadata({ id: program.id, data: editedProgram }));
      setIsEditing(false);
    }
  };

  const studies: Study[] = program.studies || [];

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBackClick} aria-label="Go back to program list">
        ← Back to List
      </button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{program.name}</h1>
          <p className={styles.id}>ID: {program.id}</p>
        </div>
        <div className={styles.headerButtons}>
          {canDelete && !isEditing && (
            <button className={styles.deleteButton} onClick={handleDelete}>
              🗑️ Delete Program
            </button>
          )}
          {canEdit && !isEditing && (
            <button className={styles.editButton} onClick={handleEdit}>
              Edit Metadata
            </button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Program Information</h3>
          <div className={styles.infoGroup}>
            <label>Development Phase</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProgram.developmentPhase || ''}
                onChange={(e) => handleInputChange('developmentPhase', e.target.value)}
              />
            ) : (
              <p className={styles.phaseInfo}>{program.developmentPhase}</p>
            )}
          </div>

          <div className={styles.infoGroup}>
            <label>Therapeutic Area</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProgram.therapeuticArea || ''}
                onChange={(e) => handleInputChange('therapeuticArea', e.target.value)}
              />
            ) : (
              <p>{program.therapeuticArea}</p>
            )}
          </div>

          <div className={styles.infoGroup}>
            <label>Target Indication</label>
            <p>{program.targetIndication}</p>
          </div>

          <div className={styles.infoGroup}>
            <label>Status</label>
            <p className={styles[program.status.toLowerCase()]}>{program.status}</p>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Development Timeline</h3>
          <div className={styles.timelineContainer}>
            <div className={styles.timelineTrack}>
              <div 
                className={styles.timelineProgress}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className={styles.timelinePhases}>
              {PHASE_TIMELINE.map((phase, index) => (
                <div 
                  key={phase}
                  className={`${styles.timelinePhase} ${
                    index === currentPhaseIndex ? styles.active :
                    index < currentPhaseIndex ? styles.completed :
                    styles.pending
                  }`}
                  title={phase}
                >
                  <div className={styles.phaseDot} />
                  <div className={styles.phaseLabel}>{phase}</div>
                </div>
              ))}
            </div>
            <div className={styles.timelineStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Progress</span>
                <span className={styles.statValue}>{Math.round(completionPercentage)}%</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Current Phase</span>
                <span className={styles.statValue}>{program.developmentPhase}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Associated Studies & Enrollment</h3>
        {studies.length === 0 ? (
          <p className={styles.empty}>No studies associated with this program</p>
        ) : (
          <div className={styles.studiesContainer}>
            <div className={styles.studiesSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Studies</span>
                <span className={styles.summaryValue}>{studies.length}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total Enrollment</span>
                <span className={styles.summaryValue}>{studies.reduce((sum, s) => sum + (s.enrollment.current || 0), 0)}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Active Studies</span>
                <span className={styles.summaryValue}>{studies.filter(s => s.status === 'Active').length}</span>
              </div>
            </div>
            <div className={styles.studiesList}>
              {studies.map((study) => (
                <div key={study.id} className={styles.studyItem}>
                  <div className={styles.studyHeader}>
                    <div>
                      <strong className={styles.studyName}>{study.name}</strong>
                      <p className={styles.studyId}>ID: {study.id}</p>
                    </div>
                    <span className={`${styles.studyStatus} ${styles[study.status.toLowerCase()]}`}>
                      {study.status}
                    </span>
                  </div>
                  <div className={styles.enrollmentBar}>
                    <div className={styles.enrollmentInfo}>
                      <span className={styles.enrollmentLabel}>Enrollment Progress</span>
                      <span className={styles.enrollmentCount}>{study.enrollment.current}/{study.enrollment.target} Patients</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${Math.min((study.enrollment.current / study.enrollment.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isEditing && canEdit && (
        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Changes
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
