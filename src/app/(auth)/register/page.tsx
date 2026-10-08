/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth } from '@/hooks/useAuth';
import {
  ERROR_CLASS,
  FIELD_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from '@/components/auth/authFormStyles';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Kayıt ekranı — giriş sayfasının (Figma "LM App PC log in", 239:818) görsel
 * dilini kullanır. Ölçüler Figma değerlerinin 0.3 katsayısıyla CSS px'e
 * çevrilmiş halidir; stiller `authFormStyles` üzerinden paylaşılır.
 */
export default function RegisterPage() {
  const { signUp, googleSignIn, user } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      router.push('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Kayıt başarısız. Lütfen tekrar deneyin.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await googleSignIn();
      router.push('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google ile kayıt başarısız.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center">
        <img src="/figma/logo-mark.svg" alt="" className="w-[191.2px]" />
        <img
          src="/figma/logo-wordmark.svg"
          alt="Limitless Makers"
          className="mt-[11.3px] w-[195.6px]"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-[92.9px] flex w-[498.2px] flex-col"
      >
        {error && (
          <p role="alert" className={`${ERROR_CLASS} mb-[19px]`}>
            {error}
          </p>
        )}

        <label htmlFor="displayName" className={LABEL_CLASS}>
          *Ad Soyad:
        </label>
        <input
          id="displayName"
          type="text"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={`${FIELD_CLASS} mt-[12.5px]`}
          required
        />

        <label htmlFor="email" className={`${LABEL_CLASS} mt-[42.5px]`}>
          *E-posta:
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${FIELD_CLASS} mt-[12.5px]`}
          required
        />

        <label htmlFor="password" className={`${LABEL_CLASS} mt-[42.5px]`}>
          *Şifre:
        </label>
        <div className="relative mt-[12.5px]">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${FIELD_CLASS} pr-[60px]`}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            className="absolute top-1/2 right-[15px] -translate-y-1/2 opacity-70 transition-opacity hover:opacity-100"
          >
            <img
              src={showPassword ? '/figma/eye.svg' : '/figma/eye-off.svg'}
              alt=""
              className="w-[24.3px]"
            />
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${PRIMARY_BUTTON_CLASS} mt-[40px]`}
        >
          {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </button>

        <div className="my-[24px] flex items-center gap-[14px]">
          <span className="h-px flex-1 bg-lm-card-border" />
          <span className="font-inter text-helper text-lm-dim">veya</span>
          <span className="h-px flex-1 bg-lm-card-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={SECONDARY_BUTTON_CLASS}
        >
          Google ile devam et
        </button>

        <p className="mt-[22.2px] text-center font-inter text-helper text-lm-muted">
          Zaten hesabın var mı?{' '}
          <Link
            href="/login"
            className="font-medium text-lm-accent hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      </form>
    </div>
  );
}
