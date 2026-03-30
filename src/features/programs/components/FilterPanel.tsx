'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchPrograms } from '@/store/slices/programsSlice';
import { DEVELOPMENT_PHASES, THERAPEUTIC_AREAS } from '@/shared/constants';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  onPhaseFilter: (phases: string[]) => void;
  onAreaFilter: (areas: string[]) => void;
  selectedPhases: string[];
  selectedAreas: string[];
}

export default function FilterPanel({
  onPhaseFilter,
  onAreaFilter,
  selectedPhases,
  selectedAreas,
}: FilterPanelProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [localPhases, setLocalPhases] = useState<string[]>(selectedPhases);
  const [localAreas, setLocalAreas] = useState<string[]>(selectedAreas);

  useEffect(() => {
    setLocalPhases(selectedPhases);
  }, [selectedPhases]);

  useEffect(() => {
    setLocalAreas(selectedAreas);
  }, [selectedAreas]);

  const handlePhaseChange = (phase: string, checked: boolean) => {
    const updated = checked ? [...localPhases, phase] : localPhases.filter((p) => p !== phase);
    setLocalPhases(updated);
  };

  const handleAreaChange = (area: string, checked: boolean) => {
    const updated = checked ? [...localAreas, area] : localAreas.filter((a) => a !== area);
    setLocalAreas(updated);
  };

  const handleApplyFilters = () => {
    onPhaseFilter(localPhases);
    onAreaFilter(localAreas);
    
    // Construct query parameters
    const phase = localPhases.length > 0 ? localPhases[0] : undefined;
    const area = localAreas.length > 0 ? localAreas[0] : undefined;
    
    dispatch(fetchPrograms({ phase, area }));
  };

  const handleClearFilters = () => {
    setLocalPhases([]);
    setLocalAreas([]);
    onPhaseFilter([]);
    onAreaFilter([]);
    dispatch(fetchPrograms(undefined));
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Filters</h3>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Development Phase</legend>
        <div className={styles.checkboxGroup}>
          {DEVELOPMENT_PHASES.map((phase) => (
            <label key={phase} className={styles.label}>
              <input
                type="checkbox"
                checked={localPhases.includes(phase)}
                onChange={(e) => handlePhaseChange(phase, e.target.checked)}
              />
              <span>{phase}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Therapeutic Area</legend>
        <div className={styles.checkboxGroup}>
          {THERAPEUTIC_AREAS.map((area) => (
            <label key={area} className={styles.label}>
              <input
                type="checkbox"
                checked={localAreas.includes(area)}
                onChange={(e) => handleAreaChange(area, e.target.checked)}
              />
              <span>{area}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.buttonGroup}>
        <button className={styles.applyButton} onClick={handleApplyFilters}>
          Apply Filters
        </button>
        <button className={styles.clearButton} onClick={handleClearFilters}>
          Clear All
        </button>
      </div>
    </div>
  );
}
