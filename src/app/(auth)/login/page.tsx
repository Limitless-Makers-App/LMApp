'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthAltBaglanti } from '@/components/auth/AuthAltBaglanti';
import { AuthFormCercevesi } from '@/components/auth/AuthFormCercevesi';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { FormAlani } from '@/components/auth/FormAlani';
import { SifreAlani } from '@/components/auth/SifreAlani';
import { PRIMARY_BUTTON_CLASS } from '@/components/auth/authFormStyles';
import { useAuthYonlendirme } from '@/components/auth/useAuthYonlendirme';
import { useAuth } from '@/hooks/useAuth';

/**
 * Giriş ekranı — Figma "LM App PC log in" (239:818), 1920×1080 referans.
 * Ölçüler Figma değerlerinin 0.3 katsayısıyla CSS px'e çevrilmiş halidir;
 * ortak parçalar `components/auth/` altından gelir.
 */
export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
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
      await signIn(email, password);
      router.push('/');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <AuthLogo />

      <AuthFormCercevesi onSubmit={handleSubmit} hata={error}>
        <FormAlani
          id="email"
          label="*E-posta:"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          ustBosluk={false}
        />

        <SifreAlani
          id="password"
          label="*Şifre:"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />

        <Link
          href="/sifre-sifirla"
          className="mt-[22.2px] font-poppins text-helper font-normal tracking-[0.63px] text-lm-muted transition-colors hover:text-lm-text"
        >
          Şifremi unuttum
        </Link>

        <button
          type="submit"
          disabled={loading}
          className={`${PRIMARY_BUTTON_CLASS} mt-[40px]`}
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <AuthAltBaglanti
          metin="Hesabın yok mu?"
          baglantiMetni="Kayıt Ol"
          href="/register"
        />
      </AuthFormCercevesi>
    </div>
  );
}
