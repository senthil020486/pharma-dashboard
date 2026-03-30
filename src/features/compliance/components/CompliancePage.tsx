'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { programsService } from '@/features/programs/services/programsService';
import type { Program } from '@/shared/types';
import styles from './CompliancePage.module.css';

export default function CompliancePage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth) as any;
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    programsService.getAll({ pageSize: 1000 })
      .then(setPrograms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return <div className={styles.container}>Please login first</div>;

  const compliant    = programs.filter((p) => p.complianceStatus === 'compliant').length;
  const pending      = programs.filter((p) => p.complianceStatus === 'pending').length;
  const nonCompliant = programs.filter((p) => p.complianceStatus === 'non-compliant').length;
  const rate         = programs.length > 0 ? ((compliant / programs.length) * 100).toFixed(1) : '0';
  const pct          = (n: number) => programs.length > 0 ? ((n / programs.length) * 100).toFixed(1) : '0';

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1>✅ Regulatory Compliance Dashboard</h1></div>

      <div className={styles.scorecard}>
        {[
          { label: 'Overall Compliance Rate', value: `${rate}%`, good: parseFloat(rate) >= 80 },
          { label: 'Compliant Programs',       value: compliant },
          { label: 'Pending Review',           value: pending },
          { label: 'Non-Compliant',            value: nonCompliant, warn: true },
        ].map(({ label, value, good, warn }) => (
          <div key={label} className={styles.scoreItem}>
            <div className={styles.scoreLabel}>{label}</div>
            <div className={`${styles.scoreValue} ${good ? styles.good : ''} ${warn ? styles.warning : ''}`}>{value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading compliance data...</div>
      ) : (
        <>
          <div className={styles.statusBreakdown}>
            <h2>Compliance Status by Category</h2>
            <div className={styles.breakdownGrid}>
              {[
                { key: 'compliant',    icon: '✅', title: 'Compliant',       count: compliant,    pct: pct(compliant) },
                { key: 'pending',      icon: '⏳', title: 'Pending Review',  count: pending,      pct: pct(pending) },
                { key: 'noncompliant', icon: '❌', title: 'Non-Compliant',   count: nonCompliant, pct: pct(nonCompliant) },
              ].map(({ key, icon, title, count, pct: p }) => (
                <div key={key} className={`${styles.statusCard} ${styles[key]}`}>
                  <div className={styles.statusIcon}>{icon}</div>
                  <div className={styles.statusTitle}>{title}</div>
                  <div className={styles.statusCount}>{count}</div>
                  <div className={styles.statusPercent}>{p}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detailedTable}>
            <h2>Detailed Program Compliance Report</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {['Program ID','Program Name','Therapeutic Area','Phase','Compliance Status','Budget Allocated','Success Rate'].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {programs.map((p) => (
                    <tr key={p.id} className={`${styles.row} ${styles[p.complianceStatus ?? 'compliant']}`}>
                      <td className={styles.programId}>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.therapeuticArea}</td>
                      <td>{p.developmentPhase}</td>
                      <td>
                        <span className={`${styles.status} ${styles[p.complianceStatus ?? 'compliant']}`}>
                          {p.complianceStatus ?? 'compliant'}
                        </span>
                      </td>
                      <td>${(p.budget ?? 0).toLocaleString()}</td>
                      <td>{p.successRate ?? 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
