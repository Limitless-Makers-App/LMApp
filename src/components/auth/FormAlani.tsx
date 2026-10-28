'use client';

import { FIELD_CLASS, LABEL_CLASS } from './authFormStyles';

interface FormAlaniProps {
  id: string;
  label: string;
  type?: 'text' | 'email';
  autoComplete?: string;
  value: string;
  onChange: (deger: string) => void;
  /** Etiketin üst boşluğunu belirler; ilk alan için `false`. */
  ustBosluk?: boolean;
  required?: boolean;
  minLength?: number;
}

/** Etiket + metin alanı çifti — üç auth ekranının ortak yapısı. */
export function FormAlani({
  id,
  label,
  type = 'text',
  autoComplete,
  value,
  onChange,
  ustBosluk = true,
  required = true,
  minLength,
}: FormAlaniProps) {
  return (
    <>
      <label
        htmlFor={id}
        className={ustBosluk ? `${LABEL_CLASS} mt-[42.5px]` : LABEL_CLASS}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD_CLASS} mt-[12.5px]`}
        required={required}
        minLength={minLength}
      />
    </>
  );
}
