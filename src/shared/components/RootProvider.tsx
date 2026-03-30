'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import LayoutWrapper from './LayoutWrapper';

interface RootProviderProps {
  children: React.ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <Provider store={store}>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </Provider>
  );
}
