'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthFormCercevesi } from '@/components/auth/AuthFormCercevesi';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { FormAlani } from '@/components/auth/FormAlani';
import { PRIMARY_BUTTON_CLASS } from '@/components/auth/authFormStyles';
import { useAuth } from '@/hooks/useAuth';

/**
 * Şifre sıfırlama — giriş ekranının görsel dilini kullanır.
 * NOT: Bu ekranın Figma tasarımı yok; login düzeninden türetildi.
 */
export default function SifreSifirlaPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Sıfırlama e-postası gönderilemedi.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <AuthLogo wordmark={false} />

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

        {sent && (
          <p className="mt-[22.2px] font-inter text-helper text-lm-accent">
            Sıfırlama bağlantısı e-posta adresine gönderildi.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`${PRIMARY_BUTTON_CLASS} mt-[40px]`}
        >
          {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
        </button>

        <Link
          href="/login"
          className="mt-[22.2px] text-center font-poppins text-helper font-normal tracking-[0.63px] text-lm-muted transition-colors hover:text-lm-text"
        >
          Giriş ekranına dön
        </Link>
      </AuthFormCercevesi>
    </div>
  );
}
