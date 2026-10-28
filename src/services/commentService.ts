import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { YORUM_COLLECTION } from '@/lib/ekipConstants';
import { db } from '@/lib/firebaseClient';
import type { YorumVerisi } from '@/types/ekip';

/**
 * Bir ekibin yorumlarını yeniden eskiye çeker.
 *
 * NOT: `where` + `orderBy` birleşimi Firestore'da bileşik indeks gerektirir
 * (`ekipId` + `zaman`). İndeks yoksa `FAILED_PRECONDITION` döner.
 */
export async function yorumlariGetir(ekipId: string): Promise<YorumVerisi[]> {
  const snapshot = await getDocs(
    query(
      collection(db, YORUM_COLLECTION),
      where('ekipId', '==', ekipId),
      orderBy('zaman', 'desc'),
    ),
  );

  return snapshot.docs.map((belge) => {
    const veri = belge.data();
    return {
      id: belge.id,
      gonderenId: veri.gonderenId ?? '',
      icerik: veri.icerik ?? '',
      zaman: veri.zaman ?? null,
      tip: veri.tip,
    } satisfies YorumVerisi;
  });
}

/** Ekibe yeni yorum ekler. */
export async function yorumEkle(
  ekipId: string,
  gonderenId: string,
  icerik: string,
  tip: 'mentor' | 'ogrenci',
): Promise<void> {
  await addDoc(collection(db, YORUM_COLLECTION), {
    ekipId,
    gonderenId,
    icerik,
    zaman: serverTimestamp(),
    tip,
  });
}
