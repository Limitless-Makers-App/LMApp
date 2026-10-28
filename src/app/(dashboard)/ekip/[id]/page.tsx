'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Bolum } from '@/components/ekip/Bolum';
import { DurumSecici } from '@/components/ekip/DurumSecici';
import { EkipBasligi } from '@/components/ekip/EkipBasligi';
import { EkipIskeleti } from '@/components/ekip/EkipIskeleti';
import { KART_CLASS } from '@/components/ekip/ekipStyles';
import { YorumFormu } from '@/components/ekip/YorumFormu';
import { YorumListesi } from '@/components/ekip/YorumListesi';
import { useAuth } from '@/hooks/useAuth';
import { useEkipDetay } from '@/hooks/useEkipDetay';
import { cn } from '@/lib/utils';

/** URL'deki sayısal id'yi Firestore doküman ID'sine çevirir ("5" → "ekip-5"). */
function dokumanId(hamId: string): string {
  return /^\d+$/.test(hamId) ? `ekip-${hamId}` : hamId;
}

/**
 * Ekip detay sayfası — veri yükleme ve mutasyonlar `useEkipDetay`'de,
 * görsel parçalar `components/ekip/` altında. Burada yalnızca kompozisyon var.
 */
export default function EkipDetayPage() {
  const params = useParams();
  const { user, role } = useAuth();
  const [yeniYorum, setYeniYorum] = useState('');

  const hamId = typeof params?.id === 'string' ? params.id : '';
  const ekipId = useMemo(() => dokumanId(hamId), [hamId]);

  const {
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
  } = useEkipDetay(ekipId);

  const ekipUyesiMi = Boolean(user && ekip?.uyeler?.includes(user.uid));
  const mentorMu = role === 'mentor';

  const yorumFormunuGonder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (await yorumGonder(user.uid, yeniYorum)) {
      setYeniYorum('');
    }
  };

  const ekipAdi = ekip?.ekipAdi || `Ekip #${hamId}`;
  const uyeler = ekip?.uyeler ?? [];

  return (
    <div className="flex flex-col">
      {hata && (
        <p
          role="alert"
          className="mb-[19px] rounded-[13.6px] border-[1.5px] border-lm-danger bg-lm-panel px-[20.3px] py-[13px] font-inter text-helper text-lm-text"
        >
          {hata}
        </p>
      )}

      {yukleniyor ? (
        <EkipIskeleti />
      ) : ekip ? (
        <>
          <EkipBasligi ekip={ekip} ekipAdi={ekipAdi} uyeSayisi={uyeler.length} />

          <Bolum baslik="Ekip Üyeleri">
            {uyeler.length === 0 ? (
              <p
                className={cn(
                  KART_CLASS,
                  'px-[20.3px] py-[15.9px] font-inter text-label text-lm-muted',
                )}
              >
                Bu ekipte henüz üye yok.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-[9.4px]">
                {uyeler.map((uid) => (
                  <li
                    key={uid}
                    className={cn(
                      KART_CLASS,
                      'px-[16px] py-[9px] font-inter text-label text-lm-text',
                      uid === user?.uid && 'border-lm-accent',
                    )}
                  >
                    {uyeAdlari[uid] ?? uid}
                    {uid === user?.uid && (
                      <span className="ml-[7px] text-helper text-lm-muted">(sen)</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Bolum>

          {ekipUyesiMi && (
            <Bolum baslik="Durumu Güncelle">
              <DurumSecici
                mevcutDurum={ekip.durum}
                kaydediliyor={durumKaydediliyor}
                onSec={durumGuncelle}
              />
            </Bolum>
          )}

          <Bolum baslik="Yorumlar">
            <YorumListesi yorumlar={yorumlar} yukleniyor={yorumlarYukleniyor} />
          </Bolum>

          {mentorMu && (
            <Bolum baslik="Yorum Ekle">
              <YorumFormu
                deger={yeniYorum}
                degistir={setYeniYorum}
                gonderiliyor={yorumGonderiliyor}
                onGonder={yorumFormunuGonder}
              />
            </Bolum>
          )}
        </>
      ) : null}
    </div>
  );
}
