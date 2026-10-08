'use client';

import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tag } from '@/components/ui/Tag';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebaseClient';
import { cn } from '@/lib/utils';

/* ==========================================================================
   Veri katmanı
   ========================================================================== */

const EKIP_COLLECTION = 'ekip';
const YORUM_COLLECTION = 'ekip-yorumlari';
const USERS_COLLECTION = 'users';

/** Firestore `in` sorgusu en fazla 30 değer kabul eder. */
const IN_QUERY_LIMIT = 30;

const DURUMLAR = [
  'Fikir aşaması',
  'Rapor yazıyor',
  'Sunum hazırlığı',
  'Tamamlandı',
] as const;

interface EkipVerisi {
  ekipAdi?: string;
  uyeler: string[];
  durum: string;
  guncellemeTarihi?: Timestamp | null;
}

interface YorumVerisi {
  id: string;
  gonderenId: string;
  icerik: string;
  zaman: Timestamp | null;
  tip?: 'mentor' | 'ogrenci';
}

const ZAMAN_FORMAT = new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Istanbul',
});

/** URL'deki sayısal id'yi Firestore doküman ID'sine çevirir ("5" → "ekip-5"). */
function dokumanId(hamId: string): string {
  return /^\d+$/.test(hamId) ? `ekip-${hamId}` : hamId;
}

function zamanMetni(zaman: Timestamp | null | undefined): string {
  if (!zaman) return '';
  return ZAMAN_FORMAT.format(zaman.toDate());
}

/** Üye uid'lerini görünen ada çevirir. Bulunamayanlar uid olarak kalır. */
async function uyeAdlariniGetir(uids: string[]): Promise<Record<string, string>> {
  if (uids.length === 0) return {};

  const gruplar: string[][] = [];
  for (let i = 0; i < uids.length; i += IN_QUERY_LIMIT) {
    gruplar.push(uids.slice(i, i + IN_QUERY_LIMIT));
  }

  const sonuc: Record<string, string> = {};
  await Promise.all(
    gruplar.map(async (grup) => {
      const snapshot = await getDocs(
        query(collection(db, USERS_COLLECTION), where(documentId(), 'in', grup)),
      );
      snapshot.forEach((belge) => {
        const veri = belge.data();
        sonuc[belge.id] = veri.displayName || veri.email || belge.id;
      });
    }),
  );
  return sonuc;
}

/* ==========================================================================
   Ortak görsel parçalar — ana sayfa v2'nin dilinde
   ========================================================================== */

const KART_CLASS =
  'rounded-[13.6px] border-[1.5px] border-lm-card-border bg-lm-card';

function Bolum({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <section className="mt-[34px]">
      <h2 className="font-inter text-card-title font-semibold text-lm-text">{baslik}</h2>
      <div className="mt-[13.8px]">{children}</div>
    </section>
  );
}

function DurumEtiketi({ durum }: { durum: string }) {
  const tamamlandi = durum === 'Tamamlandı';
  return (
    <span
      className={cn(
        'inline-flex h-[27px] items-center rounded-[13.5px] border-[1.5px] px-[12.9px]',
        'font-inter text-tag font-normal tracking-[1.5px] whitespace-nowrap',
        tamamlandi
          ? 'border-lm-accent bg-lm-accent text-lm-text'
          : 'border-lm-pill-border bg-lm-pill text-lm-muted',
      )}
    >
      {durum || 'Durum yok'}
    </span>
  );
}

/** Yükleniyor iskeleti — kart tonunda, ana sayfa v2 ile aynı yüzeyler. */
function Iskelet() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className={cn(KART_CLASS, 'h-[132px]')} />
      <div className="mt-[34px] grid gap-[13.8px] sm:grid-cols-2">
        <div className={cn(KART_CLASS, 'h-[92px]')} />
        <div className={cn(KART_CLASS, 'h-[92px]')} />
      </div>
      <div className="mt-[34px] flex flex-col gap-[13.8px]">
        <div className={cn(KART_CLASS, 'h-[104px]')} />
        <div className={cn(KART_CLASS, 'h-[104px]')} />
      </div>
    </div>
  );
}

/* ==========================================================================
   Sayfa
   ========================================================================== */

export default function EkipDetayPage() {
  const params = useParams();
  const router = useRouter();
  const { user, role } = useAuth();

  const hamId = typeof params?.id === 'string' ? params.id : '';
  const ekipId = useMemo(() => dokumanId(hamId), [hamId]);

  const [ekip, setEkip] = useState<EkipVerisi | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');

  const [yorumlar, setYorumlar] = useState<YorumVerisi[]>([]);
  const [yorumlarYukleniyor, setYorumlarYukleniyor] = useState(true);

  const [uyeAdlari, setUyeAdlari] = useState<Record<string, string>>({});
  const [durumKaydediliyor, setDurumKaydediliyor] = useState(false);

  const [yeniYorum, setYeniYorum] = useState('');
  const [yorumGonderiliyor, setYorumGonderiliyor] = useState(false);

  const ekipUyesiMi = Boolean(user && ekip?.uyeler?.includes(user.uid));
  const mentorMu = role === 'mentor';

  /** Yorumları zaman sırasına göre (yeniden eskiye) çeker. */
  const yorumlariGetir = useCallback(async () => {
    // NOT: where + orderBy birleşimi Firestore'da bileşik indeks gerektirir.
    const snapshot = await getDocs(
      query(
        collection(db, YORUM_COLLECTION),
        where('ekipId', '==', ekipId),
        orderBy('zaman', 'desc'),
      ),
    );
    setYorumlar(
      snapshot.docs.map((belge) => {
        const veri = belge.data();
        return {
          id: belge.id,
          gonderenId: veri.gonderenId ?? '',
          icerik: veri.icerik ?? '',
          zaman: veri.zaman ?? null,
          tip: veri.tip,
        } satisfies YorumVerisi;
      }),
    );
  }, [ekipId]);

  // Ekip dokümanı
  useEffect(() => {
    if (!ekipId) return;
    let iptal = false;

    (async () => {
      setYukleniyor(true);
      try {
        const snapshot = await getDoc(doc(db, EKIP_COLLECTION, ekipId));
        if (iptal) return;

        if (!snapshot.exists()) {
          router.replace('/');
          return;
        }

        const veri = snapshot.data() as Partial<EkipVerisi>;
        const uyeler = Array.isArray(veri.uyeler) ? veri.uyeler : [];
        setEkip({
          ekipAdi: veri.ekipAdi,
          uyeler,
          durum: veri.durum ?? '',
          guncellemeTarihi: veri.guncellemeTarihi ?? null,
        });

        setUyeAdlari(await uyeAdlariniGetir(uyeler));
      } catch (err) {
        if (!iptal) {
          setHata(
            err instanceof Error ? err.message : 'Ekip bilgisi yüklenemedi.',
          );
        }
      } finally {
        if (!iptal) setYukleniyor(false);
      }
    })();

    return () => {
      iptal = true;
    };
  }, [ekipId, router]);

  // Yorumlar
  useEffect(() => {
    if (!ekipId) return;
    let iptal = false;

    (async () => {
      setYorumlarYukleniyor(true);
      try {
        await yorumlariGetir();
      } catch (err) {
        if (!iptal) {
          setHata(
            err instanceof Error ? err.message : 'Yorumlar yüklenemedi.',
          );
        }
      } finally {
        if (!iptal) setYorumlarYukleniyor(false);
      }
    })();

    return () => {
      iptal = true;
    };
  }, [ekipId, yorumlariGetir]);

  /** Durumu Firestore'a yazar; başarılıysa yerel durumu günceller. */
  const durumGuncelle = async (yeniDurum: string) => {
    if (!ekipUyesiMi || ekip?.durum === yeniDurum) return;

    setDurumKaydediliyor(true);
    setHata('');
    try {
      await updateDoc(doc(db, EKIP_COLLECTION, ekipId), {
        durum: yeniDurum,
        guncellemeTarihi: serverTimestamp(),
      });
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
  };

  /** Yorum ekler ve listeyi yeniden çeker. */
  const yorumGonder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!mentorMu || !user || !yeniYorum.trim()) return;

    setYorumGonderiliyor(true);
    setHata('');
    try {
      await addDoc(collection(db, YORUM_COLLECTION), {
        ekipId,
        gonderenId: user.uid,
        icerik: yeniYorum.trim(),
        zaman: serverTimestamp(),
        tip: 'mentor',
      });
      setYeniYorum('');
      await yorumlariGetir();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Yorum gönderilemedi.');
    } finally {
      setYorumGonderiliyor(false);
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
        <Iskelet />
      ) : ekip ? (
        <>
          {/* Başlık bloğu */}
          <header
            className={cn(KART_CLASS, 'px-[24.9px] py-[21.8px]')}
          >
            <div className="flex flex-wrap items-center gap-[13px]">
              <h1 className="font-inter text-hero font-bold text-lm-text">
                {ekipAdi}
              </h1>
              <DurumEtiketi durum={ekip.durum} />
            </div>
            <p className="mt-[9px] font-inter text-helper text-lm-muted">
              {uyeler.length} üye
              {ekip.guncellemeTarihi
                ? ` · Son güncelleme ${zamanMetni(ekip.guncellemeTarihi)}`
                : ''}
            </p>
          </header>

          {/* Ekip üyeleri */}
          <Bolum baslik="Ekip Üyeleri">
            {uyeler.length === 0 ? (
              <p className={cn(KART_CLASS, 'px-[20.3px] py-[15.9px] font-inter text-label text-lm-muted')}>
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

          {/* Durum güncelleme — yalnızca ekip üyeleri */}
          {ekipUyesiMi && (
            <Bolum baslik="Durumu Güncelle">
              <div className="flex flex-wrap gap-[9px]">
                {DURUMLAR.map((durum) => {
                  const secili = ekip.durum === durum;
                  return (
                    <button
                      key={durum}
                      type="button"
                      disabled={durumKaydediliyor}
                      onClick={() => durumGuncelle(durum)}
                      aria-pressed={secili}
                      className={cn(
                        'inline-flex h-[40px] items-center rounded-[13.5px] border-[1.5px] px-[18px]',
                        'font-inter text-label font-medium transition-opacity',
                        'disabled:opacity-50',
                        secili
                          ? 'border-lm-accent bg-lm-accent text-lm-text'
                          : 'border-lm-pill-border bg-lm-pill text-lm-muted hover:opacity-80',
                      )}
                    >
                      {durum}
                    </button>
                  );
                })}
              </div>
            </Bolum>
          )}

          {/* Yorumlar */}
          <Bolum baslik="Yorumlar">
            {yorumlarYukleniyor ? (
              <div className="flex animate-pulse flex-col gap-[13.8px]" aria-hidden>
                <div className={cn(KART_CLASS, 'h-[104px]')} />
                <div className={cn(KART_CLASS, 'h-[104px]')} />
              </div>
            ) : yorumlar.length === 0 ? (
              <p className={cn(KART_CLASS, 'px-[20.3px] py-[15.9px] font-inter text-label text-lm-muted')}>
                Henüz yorum yok.
              </p>
            ) : (
              <ul className="flex flex-col gap-[13.8px]">
                {yorumlar.map((yorum) => {
                  const mentorYorumu = yorum.tip === 'mentor';
                  return (
                    <li
                      key={yorum.id}
                      className="rounded-[11.1px] border-[1.11px] border-lm-card-border bg-lm-card px-[20.3px] py-[15.9px]"
                    >
                      <div className="flex flex-wrap items-center gap-[10px]">
                        <Tag tone={mentorYorumu ? 'program' : 'social'}>
                          {mentorYorumu ? 'Mentor' : 'Öğrenci'}
                        </Tag>
                        <span className="font-inter text-card-time font-medium text-lm-muted">
                          {zamanMetni(yorum.zaman)}
                        </span>
                      </div>
                      <p className="mt-[11px] font-inter text-label whitespace-pre-line text-lm-text">
                        {yorum.icerik}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Bolum>

          {/* Yorum ekleme — yalnızca mentorlar */}
          {mentorMu && (
            <Bolum baslik="Yorum Ekle">
              <form onSubmit={yorumGonder} className="flex flex-col gap-[13.8px]">
                <textarea
                  value={yeniYorum}
                  onChange={(event) => setYeniYorum(event.target.value)}
                  rows={4}
                  placeholder="Ekibe geri bildirimini yaz..."
                  className={cn(
                    'w-full resize-y rounded-[14.4px] border-[1.61px] border-lm-card-border',
                    'bg-lm-panel px-[18px] py-[13px] font-inter text-label text-lm-text',
                    'outline-none transition-colors focus:border-lm-accent',
                    'placeholder:text-lm-dim',
                  )}
                />
                <button
                  type="submit"
                  disabled={yorumGonderiliyor || !yeniYorum.trim()}
                  className={cn(
                    'h-[56.4px] self-start rounded-[14.4px] border-[1.61px] border-lm-accent bg-lm-accent',
                    'px-[32px] font-inter text-label font-semibold text-lm-text',
                    'transition-opacity hover:opacity-90 disabled:opacity-50',
                  )}
                >
                  {yorumGonderiliyor ? 'Gönderiliyor...' : 'Yorum Gönder'}
                </button>
              </form>
            </Bolum>
          )}
        </>
      ) : null}
    </div>
  );
}
