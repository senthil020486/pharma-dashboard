'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { toggleTheme } from '@/store/slices/themeSlice';
import { logout } from '@/store/slices/authSlice';
import Navigation from './Navigation';
import styles from './LayoutWrapper.module.css';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const dispatch = useDispatch<AppDispatch>();
  const themeState = useSelector((state: RootState) => state.theme) as any;
  const authState = useSelector((state: RootState) => state.auth) as any;

  const { mode = 'light' } = themeState;
  const { user = null, isAuthenticated = false } = authState;

  const [showAdmin, setShowAdmin] = React.useState(false);

  React.useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', mode);
  }, [mode]);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>Rx</div>
          <div className={styles.headerText}>
            <h1>Drug Development Portfolio</h1>
            <p>Clinical RCD Management System</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={`${styles.userRole} ${styles[user?.role || 'viewer']}`}>{user?.role?.toUpperCase()}</span>
          </div>
          <button
            className={styles.themeToggle}
            onClick={handleThemeToggle}
            aria-label="Toggle Theme"
            title="Toggle Dark/Light Mode"
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </button>
          {user?.role === 'admin' && (
            <button
              className={styles.adminButton}
              onClick={() => setShowAdmin(!showAdmin)}
              aria-label="Admin Panel"
              title="Admin Panel"
            >
              ⚙️
            </button>
          )}
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            🚪
          </button>
        </div>
      </header>
      <Navigation />
      <div className={styles.layoutContent}>
        {children}
      </div>
    </div>
  );
}
