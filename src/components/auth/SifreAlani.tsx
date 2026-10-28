/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { FIELD_CLASS, LABEL_CLASS } from './authFormStyles';

interface SifreAlaniProps {
  id: string;
  label: string;
  value: string;
  onChange: (deger: string) => void;
  autoComplete: 'current-password' | 'new-password';
  /** Etiketin üst boşluğu — login'de 42.5px, register'da da aynı. */
  ustBosluk?: boolean;
  minLength?: number;
}

/** Şifre alanı + görünürlük değiştiren göz ikonu. */
export function SifreAlani({
  id,
  label,
  value,
  onChange,
  autoComplete,
  ustBosluk = true,
  minLength,
}: SifreAlaniProps) {
  const [goster, setGoster] = useState(false);

  return (
    <>
      <label htmlFor={id} className={ustBosluk ? `${LABEL_CLASS} mt-[42.5px]` : LABEL_CLASS}>
        {label}
      </label>
      <div className="relative mt-[12.5px]">
        <input
          id={id}
          type={goster ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${FIELD_CLASS} pr-[60px]`}
          required
          minLength={minLength}
        />
        <button
          type="button"
          onClick={() => setGoster((onceki) => !onceki)}
          aria-label={goster ? 'Şifreyi gizle' : 'Şifreyi göster'}
          className="absolute top-1/2 right-[15px] -translate-y-1/2 opacity-70 transition-opacity hover:opacity-100"
        >
          <img
            src={goster ? '/figma/eye.svg' : '/figma/eye-off.svg'}
            alt=""
            className="w-[24.3px]"
          />
        </button>
      </div>
    </>
  );
}
