'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/** Sağ panelde açılabilen sekmeler. Bunlar route değil, panel durumudur. */
export type PanelTuru = 'galeri' | 'oturma-duzeni';

interface PanelContextValue {
  /** Açık olan panel; `null` ise panel kapalıdır ve bildirim rayı görünür. */
  aktifPanel: PanelTuru | null;
  /** Panele geçer; aynı sekme tekrar tıklanırsa kapatır. */
  panelDegistir: (panel: PanelTuru) => void;
  panelKapat: () => void;
}

const PanelContext = createContext<PanelContextValue | undefined>(undefined);

/**
 * Sağ panelin hangi sekmeyi gösterdiğini tutar.
 *
 * Bildirim rayı için ayrı bir aç/kapa state'i yoktu — ray her zaman görünürdü.
 * Galeri ve Oturma Düzeni route olmadığı için aktiflik pathname'den türetilemez;
 * bu yüzden tek bir durum kaynağı burada tutulur ve hem sağ şeritteki hem dar
 * ekrandaki sol şerit hapları aynı kaynağı okur.
 */
export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [aktifPanel, setAktifPanel] = useState<PanelTuru | null>(null);

  const panelDegistir = useCallback((panel: PanelTuru) => {
    setAktifPanel((mevcut) => (mevcut === panel ? null : panel));
  }, []);

  const panelKapat = useCallback(() => setAktifPanel(null), []);

  const value = useMemo<PanelContextValue>(
    () => ({ aktifPanel, panelDegistir, panelKapat }),
    [aktifPanel, panelDegistir, panelKapat],
  );

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}

export function usePanel(): PanelContextValue {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanel yalnızca PanelProvider içinde kullanılabilir.');
  }
  return context;
}
