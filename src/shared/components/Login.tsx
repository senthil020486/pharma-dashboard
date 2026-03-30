'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { loginStart, loginSuccess, loginError } from '@/store/slices/authSlice';
import styles from './Login.module.css';

// Demo credentials
const DEMO_USERS = [
  { email: 'admin@pharma.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
  { email: 'editor@pharma.com', password: 'editor123', name: 'Editor User', role: 'editor' as const },
  { email: 'viewer@pharma.com', password: 'viewer123', name: 'Viewer User', role: 'viewer' as const },
];

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    dispatch(loginStart());

    // Simulate API call
    setTimeout(() => {
      const user = DEMO_USERS.find((u) => u.email === email && u.password === password);

      if (user) {
        dispatch(
          loginSuccess({
            id: Math.random().toString(36).substr(2, 9),
            email: user.email,
            name: user.name,
            role: user.role,
          })
        );
        setIsLoading(false);
      } else {
        const msg = 'Invalid email or password';
        setError(msg);
        dispatch(loginError(msg));
        setIsLoading(false);
      }
    }, 500);
  };

  const quickLogin = (demoUser: (typeof DEMO_USERS)[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    
    setIsLoading(true);
    dispatch(loginStart());
    
    setTimeout(() => {
      dispatch(
        loginSuccess({
          id: Math.random().toString(36).substr(2, 9),
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
        })
      );
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>Rx</div>
        <h1 className={styles.title}>Drug Development Portfolio</h1>
        <p className={styles.subtitle}>Clinical RCD Management System</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles.divider}>Demo Accounts</div>

        <div className={styles.demoAccounts}>
          {DEMO_USERS.map((user) => (
            <button
              key={user.email}
              type="button"
              className={`${styles.demoButton} ${styles[user.role]}`}
              onClick={() => quickLogin(user)}
              disabled={isLoading}
            >
              <span className={styles.demoRole}>{user.role.toUpperCase()}</span>
              <span className={styles.demoEmail}>{user.email}</span>
            </button>
          ))}
        </div>

        <div className={styles.info}>
          <p>📋 <strong>Admin:</strong> Full access to all features</p>
          <p>✏️ <strong>Editor:</strong> Can edit program metadata</p>
          <p>👁️ <strong>Viewer:</strong> Read-only access</p>
        </div>
      </div>
    </div>
  );
}
