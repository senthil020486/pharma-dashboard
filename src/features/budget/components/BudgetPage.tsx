'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { programsService } from '@/features/programs/services/programsService';
import type { Program } from '@/shared/types';
import styles from './BudgetPage.module.css';

interface BudgetData {
  area: string;
  allocated: number;
  spent: number;
  programs: number;
}

export default function BudgetPage() {
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

  const budgetByArea: Record<string, BudgetData> = {};
  programs.forEach((p) => {
    if (!budgetByArea[p.therapeuticArea]) {
      budgetByArea[p.therapeuticArea] = { area: p.therapeuticArea, allocated: 0, spent: 0, programs: 0 };
    }
    budgetByArea[p.therapeuticArea].allocated += p.budget ?? 0;
    budgetByArea[p.therapeuticArea].spent     += Math.floor((p.budget ?? 0) * (p.successRate ?? 50) / 100);
    budgetByArea[p.therapeuticArea].programs  += 1;
  });

  const budgetData      = Object.values(budgetByArea).sort((a, b) => b.allocated - a.allocated);
  const totalAllocated  = budgetData.reduce((s, d) => s + d.allocated, 0);
  const totalSpent      = budgetData.reduce((s, d) => s + d.spent, 0);
  const totalRemaining  = totalAllocated - totalSpent;
  const utilizationRate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1>💰 Budget & Cost Analysis</h1></div>

      <div className={styles.summaryCards}>
        {[
          { label: 'Total Budget Allocated', value: `$${(totalAllocated / 1e6).toFixed(1)}M` },
          { label: 'Total Spent',            value: `$${(totalSpent    / 1e6).toFixed(1)}M` },
          { label: 'Remaining Budget',       value: `$${(totalRemaining/ 1e6).toFixed(1)}M` },
          { label: 'Utilization Rate',       value: `${utilizationRate.toFixed(1)}%`, high: utilizationRate > 80 },
        ].map(({ label, value, high }) => (
          <div key={label} className={styles.card}>
            <div className={styles.cardLabel}>{label}</div>
            <div className={`${styles.cardValue} ${high ? styles.high : ''}`}>{value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading budget data...</div>
      ) : (
        <>
          <div className={styles.budgetAnalysis}>
            <h2>Budget Breakdown by Therapeutic Area</h2>
            <div className={styles.budgetGrid}>
              {budgetData.map((item) => {
                const spentPct = (item.spent / item.allocated) * 100;
                return (
                  <div key={item.area} className={styles.budgetItem}>
                    <div className={styles.budgetHeader}>
                      <div className={styles.budgetArea}>{item.area}</div>
                      <div className={styles.programCount}>{item.programs} programs</div>
                    </div>
                    {[
                      { label: 'Allocated:', value: `$${(item.allocated / 1e6).toFixed(1)}M` },
                      { label: 'Spent:',     value: `$${(item.spent    / 1e6).toFixed(1)}M` },
                    ].map(({ label, value }) => (
                      <div key={label} className={styles.budgetRow}>
                        <span className={styles.label}>{label}</span>
                        <span className={styles.value}>{value}</span>
                      </div>
                    ))}
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${Math.min(spentPct, 100)}%` }}>
                        {spentPct.toFixed(0)}%
                      </div>
                    </div>
                    <div className={styles.budgetRow}>
                      <span className={styles.label}>Remaining:</span>
                      <span className={styles.value}>${((item.allocated - item.spent) / 1e6).toFixed(1)}M</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.detailedTable}>
            <h2>Program-Level Budget Details</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {['Program ID','Program Name','Therapeutic Area','Phase','Budget Allocated','Est. Spent','Remaining','Utilization'].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...programs].sort((a, b) => (b.budget ?? 0) - (a.budget ?? 0)).slice(0, 50).map((p) => {
                    const allocated   = p.budget ?? 0;
                    const spent       = Math.floor(allocated * (p.successRate ?? 50) / 100);
                    const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
                    return (
                      <tr key={p.id}>
                        <td className={styles.programId}>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.therapeuticArea}</td>
                        <td>{p.developmentPhase}</td>
                        <td>${(allocated / 1e6).toFixed(2)}M</td>
                        <td>${(spent     / 1e6).toFixed(2)}M</td>
                        <td>${((allocated - spent) / 1e6).toFixed(2)}M</td>
                        <td>
                          <div className={styles.miniProgress}>
                            <div className={styles.miniFill} style={{ width: `${utilization}%` }} />
                          </div>
                          {utilization.toFixed(0)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
