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
    <aside className={styles.panel} role="region" aria-label="Filter options for programs">
      <h3 className={styles.title}>Filters</h3>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Development Phase</legend>
        <div className={styles.checkboxGroup} role="group" aria-labelledby="phase-legend">
          {DEVELOPMENT_PHASES.map((phase) => (
            <label key={phase} className={styles.label} htmlFor={`phase-${phase}`}>
              <input
                id={`phase-${phase}`}
                type="checkbox"
                checked={localPhases.includes(phase)}
                onChange={(e) => handlePhaseChange(phase, e.target.checked)}
                aria-label={`Filter by development phase: ${phase}`}
              />
              <span>{phase}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Therapeutic Area</legend>
        <div className={styles.checkboxGroup} role="group" aria-labelledby="area-legend">
          {THERAPEUTIC_AREAS.map((area) => (
            <label key={area} className={styles.label} htmlFor={`area-${area}`}>
              <input
                id={`area-${area}`}
                type="checkbox"
                checked={localAreas.includes(area)}
                onChange={(e) => handleAreaChange(area, e.target.checked)}
                aria-label={`Filter by therapeutic area: ${area}`}
              />
              <span>{area}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.buttonGroup} role="group" aria-label="Filter action buttons">
        <button 
          className={styles.applyButton} 
          onClick={handleApplyFilters}
          aria-label={`Apply filters: ${localPhases.length} phase(s), ${localAreas.length} area(s) selected`}
        >
          Apply Filters
        </button>
        <button 
          className={styles.clearButton} 
          onClick={handleClearFilters}
          aria-label="Clear all selected filters and reset to default view"
        >
          Clear All
        </button>
      </div>
    </aside>
  );
}
