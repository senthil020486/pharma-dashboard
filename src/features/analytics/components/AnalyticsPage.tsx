'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics, setTimeRange } from '@/store/slices/analyticsSlice';
import { AppDispatch, RootState } from '@/store/store';
import { TIME_RANGES } from '@/shared/constants';
import styles from './AnalyticsPage.module.css';

export default function AnalyticsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const analyticsState = useSelector((state: RootState) => state.analytics) as any;
  const { metrics, loading, timeRange } = analyticsState;
  const { isAuthenticated } = useSelector((state: RootState) => state.auth) as any;

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchAnalytics({ timeRange }));
  }, [dispatch, isAuthenticated, timeRange]);

  if (!isAuthenticated) return <div className={styles.container} role="alert">Please login first</div>;
  if (loading)          return <div className={styles.container} role="status" aria-live="polite">Loading analytics...</div>;
  if (!metrics)         return <div className={styles.container} role="status">No data available</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>📈 Analytics & Reporting</h1>
        <div className={styles.timeRangeSelector} role="group" aria-label="Select time range for analytics">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              className={`${styles.timeButton} ${timeRange === range ? styles.active : ''}`}
              onClick={() => dispatch(setTimeRange(range))}
              aria-pressed={timeRange === range}
              aria-label={`Show data for ${range.charAt(0).toUpperCase() + range.slice(1)}`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.metricsGrid} role="region" aria-label="Key performance metrics" aria-live="polite" aria-atomic="false">
        {[
          { label: 'Total Programs',         value: metrics.totalPrograms },
          { label: 'Active Programs',         value: metrics.activePrograms },
          { label: 'Approved Programs',       value: metrics.approvedPrograms },
          { label: 'Total Patients Enrolled', value: metrics.totalPatients.toLocaleString() },
          { label: 'Avg Enrollment Target',   value: metrics.averageEnrollment },
          { label: 'Compliance Rate',         value: `${metrics.complianceRate}%`, good: metrics.complianceRate >= 80 },
          { label: 'Success Rate',            value: `${metrics.successRate}%` },
          { label: 'Budget Utilization',      value: `${metrics.budgetUtilization}%` },
        ].map(({ label, value, good }) => (
          <div 
            key={label} 
            className={styles.metricCard}
            role="article"
            aria-label={`${label}: ${value}`}
          >
            <div className={styles.metricLabel}>{label}</div>
            <div 
              className={`${styles.metricValue} ${good ? styles.good : ''}`}
              role="status"
              aria-live="polite"
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsContainer}>
        {[
          { title: 'Development Phase Distribution', data: metrics.phaseDistribution },
          { title: 'Therapeutic Area Distribution',  data: Object.fromEntries(Object.entries(metrics.areaDistribution).slice(0, 8)) },
        ].map(({ title, data }) => (
          <div 
            key={title} 
            className={styles.chartCard}
            role="region"
            aria-label={title}
          >
            <h2>{title}</h2>
            <div className={styles.distributionChart} role="img" aria-label={`${title}: ${Object.entries(data).map(([label, count]) => `${label} ${count}`).join(', ')}`}>
              {Object.entries(data)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([label, count]) => (
                  <div key={label} className={styles.chartRow}>
                    <div className={styles.chartLabel}>{label}</div>
                    <div className={styles.chartBar}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${((count as number) / metrics.totalPrograms) * 100}%` }}
                        role="progressbar"
                        aria-valuenow={(count as number)}
                        aria-valuemin={0}
                        aria-valuemax={metrics.totalPrograms}
                        aria-label={`${label}: ${count} out of ${metrics.totalPrograms} programs`}
                      >
                        {count as number}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.timeline} role="region" aria-label="Status Timeline">
        <h2>Status Timeline</h2>
        <div className={styles.timelineContent}>
          {metrics.statusTimeline.map((item: any, idx: number) => (
            <div 
              key={idx} 
              className={styles.timelineItem}
              role="article"
              aria-label={`${item.phase}: ${item.count} programs on ${item.date}`}
            >
              <div className={styles.timelineDate}>{item.date}</div>
              <div className={styles.timelinePhase}>{item.phase}</div>
              <div className={styles.timelineCount}>{item.count} programs</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
