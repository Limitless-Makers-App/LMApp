'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { kullaniciRoluGetir } from '@/services/userService';
import {
  AuthUser,
  signInWithEmail,
  signUpWithEmail,
  signOut as authSignOut,
  resetPassword,
  mapFirebaseUser,
} from '@/services/authService';

export interface AuthContextValue {
  /** Mevcut kullanıcı (null = oturum açılmamış) */
  user: AuthUser | null;
  /** Kullanıcının Firestore'daki rolü ('user' | 'mentor' | 'admin') */
  role: string | null;
  /** Auth durumu henüz yükleniyor mu? */
  loading: boolean;
  /** Son hata mesajı */
  error: string | null;
  /** Email + şifre ile giriş */
  signIn: (email: string, password: string) => Promise<AuthUser>;
  /** Yeni kullanıcı kaydı */
  signUp: (email: string, password: string, displayName: string) => Promise<AuthUser>;
  /** Oturumu kapat */
  signOut: () => Promise<void>;
  /** Şifre sıfırlama e-postası */
  resetPassword: (email: string) => Promise<void>;
  /** Hata durumunu temizle */
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        const mapped = mapFirebaseUser(fbUser);
        setUser(mapped);

        // Firestore'dan kullanıcı rolünü çek
        try {
          const kullaniciRolu = await kullaniciRoluGetir(mapped.uid);
          if (kullaniciRolu !== null) {
            setRole(kullaniciRolu);
          }
        } catch {
          // Rol çekilemezse sessizce devam et
          setRole('user');
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleError = useCallback((err: unknown): string => {
    const message =
      err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu';
    setError(message);
    return message;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        return await signInWithEmail(email, password);
      } catch (err) {
        throw new Error(handleError(err));
      }
    },
    [handleError]
  );

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      setError(null);
      try {
        return await signUpWithEmail(email, password, displayName);
      } catch (err) {
        throw new Error(handleError(err));
      }
    },
    [handleError]
  );

  const signOutHandler = useCallback(async () => {
    setError(null);
    try {
      await authSignOut();
    } catch (err) {
      throw new Error(handleError(err));
    }
  }, [handleError]);

  const resetPasswordHandler = useCallback(
    async (email: string) => {
      setError(null);
      try {
        await resetPassword(email);
      } catch (err) {
        throw new Error(handleError(err));
      }
    },
    [handleError]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      error,
      signIn,
      signUp,
      signOut: signOutHandler,
      resetPassword: resetPasswordHandler,
      clearError,
    }),
    [
      user,
      role,
      loading,
      error,
      signIn,
      signUp,
      signOutHandler,
      resetPasswordHandler,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}