'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Dashboard } from '@/features/dashboard/components';
import { Login } from '@/shared/components';

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? <Dashboard /> : <Login />;
}
