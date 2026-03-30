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
      href: '/programs',
      icon: '💊',
      label: 'Programs',
      description: 'Drug Development'
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
    <nav className={styles.navigation} role="navigation" aria-label="Main navigation">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          title={item.description}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          <span className={styles.navIcon} aria-hidden="true">
            {item.icon}
          </span>
          <span className={styles.navLabel}>
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
