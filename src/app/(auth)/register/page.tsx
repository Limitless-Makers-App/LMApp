'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthAltBaglanti } from '@/components/auth/AuthAltBaglanti';
import { AuthAyirici } from '@/components/auth/AuthAyirici';
import { AuthFormCercevesi } from '@/components/auth/AuthFormCercevesi';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { FormAlani } from '@/components/auth/FormAlani';
import { GoogleButonu } from '@/components/auth/GoogleButonu';
import { SifreAlani } from '@/components/auth/SifreAlani';
import { PRIMARY_BUTTON_CLASS } from '@/components/auth/authFormStyles';
import { useAuthYonlendirme } from '@/components/auth/useAuthYonlendirme';
import { useAuth } from '@/hooks/useAuth';

/**
 * Kayıt ekranı — giriş sayfasının görsel dilini kullanır.
 * Ölçüler Figma değerlerinin 0.3 katsayısıyla CSS px'e çevrilmiş halidir;
 * ortak parçalar `components/auth/` altından gelir.
 */
export default function RegisterPage() {
  const { signUp, googleSignIn } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useAuthYonlendirme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, displayName);
      router.push('/');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Kayıt başarısız. Lütfen tekrar deneyin.',
      );
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
      setError(err instanceof Error ? err.message : 'Google ile kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <AuthLogo />

      <AuthFormCercevesi onSubmit={handleSubmit} hata={error}>
        <FormAlani
          id="displayName"
          label="*Ad Soyad:"
          autoComplete="name"
          value={displayName}
          onChange={setDisplayName}
          ustBosluk={false}
        />

        <FormAlani
          id="email"
          label="*E-posta:"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />

        <SifreAlani
          id="password"
          label="*Şifre:"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className={`${PRIMARY_BUTTON_CLASS} mt-[40px]`}
        >
          {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </button>

        <AuthAyirici />

        <GoogleButonu onClick={handleGoogleSignIn} disabled={loading} />

        <AuthAltBaglanti
          metin="Zaten hesabın var mı?"
          baglantiMetni="Giriş Yap"
          href="/login"
        />
      </AuthFormCercevesi>
    </div>
  );
}
