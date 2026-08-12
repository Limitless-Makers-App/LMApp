'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextValue } from '@/context/AuthContext';

/**
 * Auth context'ini tüketmek için custom hook.
 * Kullanım: const { user, signIn, signOut, ... } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}