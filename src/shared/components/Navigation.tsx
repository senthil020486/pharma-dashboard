'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      icon: '📊',
      label: 'Dashboard',
      description: 'Overview & Programs'
    },
    {
      href: '/studies',
      icon: '🔬',
      label: 'Studies',
      description: 'Clinical Trials'
    },
    {
      href: '/analytics',
      icon: '📈',
      label: 'Analytics',
      description: 'Reports & Metrics'
    },
    {
      href: '/compliance',
      icon: '✅',
      label: 'Compliance',
      description: 'Regulatory Status'
    },
    {
      href: '/budget',
      icon: '💰',
      label: 'Budget',
      description: 'Financial Analysis'
    },
  ];

  return (
    <nav className={styles.navigation} aria-label="Main navigation menu">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '0.5rem', flexWrap: 'nowrap', alignItems: 'center' }}>
        {navItems.map((item) => (
          <li key={item.href} style={{ display: 'flex' }}>
            <Link
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
              aria-current={pathname === item.href ? 'page' : undefined}
              aria-label={`${item.label} - ${item.description}`}
            >
              <span className={styles.navIcon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.navLabel}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
