/**
 * SERVER-ONLY: Synthetic data seed for the in-memory database.
 * This file must never be imported by client-side code.
 */

import type { Program, Study } from '@/shared/types';

// ---------------------------------------------------------------------------
// Raw seed constants (not exported – use shared/constants for UI)
// ---------------------------------------------------------------------------

const DEVELOPMENT_PHASES = [
  'Discovery', 'Preclinical', 'IND Enabling',
  'Phase 1', 'Phase 2', 'Phase 3', 'NDA Review', 'Approved',
] as const;

const THERAPEUTIC_AREAS = [
  'Oncology', 'Cardiology', 'Neurology', 'Immunology', 'Endocrinology',
  'Infectious Disease', 'Respiratory', 'Gastroenterology', 'Hematology', 'Rheumatology',
] as const;

const DRUG_PREFIXES  = ['Sol','Lum','Vir','Plex','Cyto','Neuro','Cardio','Immun','Endo','Onco'];
const DRUG_SUFFIXES  = ['mix','ax','en','ib','zin','umab','tide','kine','zole','stat'];
const PHARMA_COMPANIES = ['GSK','JNJ','RHHBY','PFE','AZN','NVO','LLY','ABT','MRK','AMGN'];
const MILESTONES     = ['Compound Synthesis','Initial Safety Assessment','Efficacy Study','Regulatory Submission','Market Launch'];
const STATUSES       = ['active','on-hold','completed','discontinued'] as const;
const COMPLIANCE     = ['compliant','pending','non-compliant'] as const;
const INVESTIGATORS  = [
  'Dr. Sarah Chen','Dr. Michael Rodriguez','Dr. Emily Watson','Dr. James Lee',
  'Dr. Anna Kowalski','Dr. Robert Singh','Dr. Maria Garcia','Dr. David Thompson',
  'Dr. Patricia Moore','Dr. Thomas Anderson',
];
const INDICATIONS = [
  'Type 2 Diabetes','Heart Failure',"Alzheimer's Disease",'Rheumatoid Arthritis',
  'Asthma','COPD',"Crohn's Disease",'Psoriasis','Melanoma',
  'Non-Small Cell Lung Cancer','COVID-19','Hypertension','Hyperlipidemia',
  'Depression','Anxiety Disorder',"Parkinson's Disease",'Epilepsy',
  'Multiple Sclerosis','Lupus','Hepatitis C',
];

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

function drugName(index: number): string {
  const prefix = DRUG_PREFIXES[index % DRUG_PREFIXES.length];
  const suffix  = DRUG_SUFFIXES[Math.floor(index / DRUG_PREFIXES.length) % DRUG_SUFFIXES.length];
  return `${prefix}${suffix}`;
}

function generateStudies(programId: string, count: number, targetEnrollment: number): Study[] {
  const perStudy = Math.floor(targetEnrollment / count);
  return Array.from({ length: count }, (_, i) => ({
    id:     `${programId}-study-${i + 1}`,
    name:   `Clinical Study ${i + 1} - ${['Phase 1','Phase 2','Phase 3'][i % 3]}`,
    status: ['Active','Completed','Pending'][Math.floor(Math.random() * 3)] as Study['status'],
    enrollment: {
      current: Math.floor(Math.random() * perStudy * 1.1),
      target:  perStudy,
    },
  }));
}

function generatePrograms(count: number): Program[] {
  return Array.from({ length: count }, (_, i) => {
    const phaseIdx        = Math.floor(Math.random() * DEVELOPMENT_PHASES.length);
    const phase           = DEVELOPMENT_PHASES[phaseIdx];
    const area            = THERAPEUTIC_AREAS[Math.floor(Math.random() * THERAPEUTIC_AREAS.length)];
    const programId       = `PRG${String(i + 1).padStart(5, '0')}`;
    const enrollmentTarget = Math.floor(Math.random() * 800) + 100;
    const startYear       = 2018 + Math.floor(Math.random() * 6);
    const startDate       = new Date(startYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const completionDate  = new Date(startDate);
    completionDate.setFullYear(completionDate.getFullYear() + phaseIdx + 1);

    return {
      id:   programId,
      name: `${drugName(i)} (${PHARMA_COMPANIES[i % PHARMA_COMPANIES.length]}-${Math.floor(Math.random() * 9000) + 1000})`,
      developmentPhase:    phase as Program['developmentPhase'],
      therapeuticArea:     area,
      milestone:           MILESTONES[Math.floor(Math.random() * MILESTONES.length)],
      targetIndication:    INDICATIONS[Math.floor(Math.random() * INDICATIONS.length)],
      status:              phase === 'Approved' ? 'completed' : STATUSES[Math.floor(Math.random() * STATUSES.length)],
      studies:             generateStudies(programId, Math.floor(Math.random() * 4) + 1, enrollmentTarget),
      principalInvestigator: INVESTIGATORS[Math.floor(Math.random() * INVESTIGATORS.length)],
      enrollmentTarget,
      enrolledPatients:    Math.floor(Math.random() * enrollmentTarget * 0.95),
      startDate:           startDate.toISOString().split('T')[0],
      expectedCompletion:  completionDate.toISOString().split('T')[0],
      budget:              Math.floor(Math.random() * 50_000_000) + 1_000_000,
      complianceStatus:    COMPLIANCE[Math.floor(Math.random() * COMPLIANCE.length)] as Program['complianceStatus'],
      successRate:         Math.floor(Math.random() * 40) + 60,
    };
  });
}

// ---------------------------------------------------------------------------
// Singleton in-memory store (simulates a DB connection)
// ---------------------------------------------------------------------------

export const db = {
  programs: generatePrograms(1000),
};
