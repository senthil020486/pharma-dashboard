'use client';

import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store/store';
import { restoreAuth } from '@/store/slices/authSlice';
import LayoutWrapper from './LayoutWrapper';

interface RootProviderProps {
  children: React.ReactNode;
}

function AuthRestorer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Restore auth state from localStorage on app load
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        dispatch(restoreAuth(authData));
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('auth');
      }
    }
    // Mark as initialized after attempting to restore
    setIsInitialized(true);
  }, [dispatch]);

  // Don't render anything until we've attempted to restore auth
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <Provider store={store}>
      <AuthRestorer>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </AuthRestorer>
    </Provider>
  );
}
