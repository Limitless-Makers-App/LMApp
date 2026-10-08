/* eslint-disable @next/next/no-img-element */
'use client';

import { useSyncExternalStore } from 'react';
import { AvatarMenu } from '@/components/layout/AvatarMenu';
import { useAuth } from '@/hooks/useAuth';

const DATE_FORMAT = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  timeZone: 'Europe/Istanbul',
});

/** Tarih dışarıdan değişmez; abonelik gerekmez. */
const subscribe = () => () => {};
const getToday = () => DATE_FORMAT.format(new Date());

/**
 * Uygulama başlığı. Figma'da logo solda (123.5–358.2px), tarih ve karşılama
 * metni sağda (1539.8–1722.4px), hesap ikonu en sağda (1735.7–1796.2px) durur.
 * Tarih sunucuda boş, istemcide dolu render edilir; böylece statik ön-render
 * ile istemci arasında hydration uyuşmazlığı oluşmaz.
 */
export function AppHeader() {
  const { user } = useAuth();
  const today = useSyncExternalStore(subscribe, getToday, () => '');

  const name = user?.displayName || user?.email?.split('@')[0] || '';

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-start">
        <img src="/figma/logo-mark.svg" alt="" className="mt-[2px] w-[112.8px]" />
        <img
          src="/figma/logo-wordmark.svg"
          alt="Limitless Makers"
          className="ml-[6.9px] w-[114.7px]"
        />
      </div>

      <div className="flex items-center gap-[13.3px]">
        <div className="text-right">
          <p className="text-header-date font-inter font-normal text-lm-text">
            {today}
          </p>
          <p className="text-header-welcome font-inter font-medium text-lm-text">
            {name ? `Hoş geldin ${name}` : 'Hoş geldin'}
          </p>
        </div>

        <AvatarMenu />
      </div>
    </header>
  );
}
