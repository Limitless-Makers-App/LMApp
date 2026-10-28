'use client';

import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { EkipDurumu } from '@/lib/ekipConstants';
import { yorumEkle, yorumlariGetir } from '@/services/commentService';
import { ekipDurumGuncelle, ekipGetir } from '@/services/teamService';
import { uyeAdlariniGetir } from '@/services/userService';
import type { EkipVerisi, YorumVerisi } from '@/types/ekip';

export interface EkipDetaySonucu {
  ekip: EkipVerisi | null;
  uyeAdlari: Record<string, string>;
  yorumlar: YorumVerisi[];
  yukleniyor: boolean;
  yorumlarYukleniyor: boolean;
  hata: string;
  durumKaydediliyor: boolean;
  yorumGonderiliyor: boolean;
  durumGuncelle: (durum: EkipDurumu | string) => Promise<void>;
  yorumGonder: (gonderenId: string, icerik: string) => Promise<boolean>;
}

/**
 * Ekip detay ekranının veri katmanı: ekip dokümanı, üye adları ve yorumlar.
 *
 * İki yükleme birbirinden bağımsız ilerler — ekip kartı, yorumlar hâlâ
 * beklenirken görünür. Bileşen kaldırıldığında (`iptal` bayrağı) geç gelen
 * yanıtlar state'e yazılmaz.
 */
export function useEkipDetay(ekipId: string): EkipDetaySonucu {
  const router = useRouter();

  const [ekip, setEkip] = useState<EkipVerisi | null>(null);
  const [uyeAdlari, setUyeAdlari] = useState<Record<string, string>>({});
  const [yorumlar, setYorumlar] = useState<YorumVerisi[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yorumlarYukleniyor, setYorumlarYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [durumKaydediliyor, setDurumKaydediliyor] = useState(false);
  const [yorumGonderiliyor, setYorumGonderiliyor] = useState(false);

  const yorumlariYenile = useCallback(async () => {
    // NOT: where + orderBy birleşimi Firestore'da bileşik indeks gerektirir.
    setYorumlar(await yorumlariGetir(ekipId));
  }, [ekipId]);

  useEffect(() => {
    if (!ekipId) return;
    let iptal = false;

    (async () => {
      setYukleniyor(true);
      try {
        const veri = await ekipGetir(ekipId);
        if (iptal) return;

        if (!veri) {
          router.replace('/');
          return;
        }

        setEkip(veri);
        setUyeAdlari(await uyeAdlariniGetir(veri.uyeler));
      } catch (err) {
        if (!iptal) {
          setHata(err instanceof Error ? err.message : 'Ekip bilgisi yüklenemedi.');
        }
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    })();

    return () => {
      iptal = true;
    };
  }, [ekipId, router]);

  useEffect(() => {
    if (!ekipId) return;
    let iptal = false;

    (async () => {
      setYorumlarYukleniyor(true);
      try {
        await yorumlariYenile();
      } catch (err) {
        if (!iptal) {
          setHata(err instanceof Error ? err.message : 'Yorumlar yüklenemedi.');
        }
      } finally {
        if (!iptal) setYorumlarYukleniyor(false);
      }
    })();

    return () => {
      iptal = true;
    };
  }, [ekipId, yorumlariYenile]);

  /** Durumu Firestore'a yazar; başarılıysa yerel durumu günceller. */
  const durumGuncelle = useCallback(
    async (yeniDurum: EkipDurumu | string) => {
      if (ekip?.durum === yeniDurum) return;

      setDurumKaydediliyor(true);
      setHata('');
      try {
        await ekipDurumGuncelle(ekipId, yeniDurum);
        setEkip((onceki) =>
          onceki
            ? { ...onceki, durum: yeniDurum, guncellemeTarihi: Timestamp.now() }
            : onceki,
        );
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Durum güncellenemedi.');
      } finally {
        setDurumKaydediliyor(false);
      }
    },
    [ekipId, ekip?.durum],
  );

  /** Yorum ekler ve listeyi yeniden çeker. */
  const yorumGonder = useCallback(
    async (gonderenId: string, icerik: string): Promise<boolean> => {
      const temiz = icerik.trim();
      if (!temiz) return false;

      setYorumGonderiliyor(true);
      setHata('');
      try {
        await yorumEkle(ekipId, gonderenId, temiz, 'mentor');
        await yorumlariYenile();
        return true;
      } catch (err) {
        setHata(err instanceof Error ? err.message : 'Yorum gönderilemedi.');
        return false;
      } finally {
        setYorumGonderiliyor(false);
      }
    },
    [ekipId, yorumlariYenile],
  );

  return {
    ekip,
    uyeAdlari,
    yorumlar,
    yukleniyor,
    yorumlarYukleniyor,
    hata,
    durumKaydediliyor,
    yorumGonderiliyor,
    durumGuncelle,
    yorumGonder,
  };
}
