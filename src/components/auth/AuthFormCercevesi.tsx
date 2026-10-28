'use client';

import { ERROR_CLASS } from './authFormStyles';

interface AuthFormCercevesiProps {
  onSubmit: (event: React.FormEvent) => void;
  hata: string;
  children: React.ReactNode;
}

/** Auth formlarının ortak çerçevesi: sabit genişlik, üst boşluk ve hata satırı. */
export function AuthFormCercevesi({ onSubmit, hata, children }: AuthFormCercevesiProps) {
  return (
    <form onSubmit={onSubmit} className="mt-[92.9px] flex w-[498.2px] flex-col">
      {hata && (
        <p role="alert" className={`${ERROR_CLASS} mb-[19px]`}>
          {hata}
        </p>
      )}
      {children}
    </form>
  );
}
