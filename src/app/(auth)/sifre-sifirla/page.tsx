/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';

/**
 * Şifre sıfırlama — giriş ekranının görsel dilini kullanır.
 * NOT: Bu ekranın Figma tasarımı yok; login düzeninden türetildi.
 */

const FIELD_CLASS =
  'h-[56.4px] w-full rounded-[14.4px] border-[1.61px] border-[#e8f6ff] ' +
  'bg-lm-panel px-[18px] font-inter text-label font-normal text-lm-text ' +
  'outline-none transition-colors focus:border-lm-accent ' +
  'placeholder:text-lm-dim';

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
      <img src="/figma/logo-mark.svg" alt="" className="w-[191.2px]" />

      <form onSubmit={handleSubmit} className="mt-[92.9px] flex w-[498.2px] flex-col">
        <label
          htmlFor="email"
          className="font-inter text-label font-semibold tracking-[-0.3px] text-lm-text"
        >
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

        {sent && (
          <p className="mt-[22.2px] font-inter text-helper text-lm-accent">
            Sıfırlama bağlantısı e-posta adresine gönderildi.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-[22.2px] font-inter text-helper text-lm-text">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-[40px] h-[56.4px] w-full rounded-[14.4px] border-[1.61px] border-lm-accent bg-lm-accent font-inter text-label font-semibold tracking-[-0.3px] text-lm-text transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
        </button>

        <Link
          href="/login"
          className="mt-[22.2px] text-center font-poppins text-helper font-normal tracking-[0.63px] text-lm-muted transition-colors hover:text-lm-text"
        >
          Giriş ekranına dön
        </Link>
      </form>
    </div>
  );
}
