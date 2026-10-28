import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { EKIP_COLLECTION, type EkipDurumu } from '@/lib/ekipConstants';
import { db } from '@/lib/firebaseClient';
import type { EkipVerisi } from '@/types/ekip';

/**
 * Ekip dokümanını okur. Doküman yoksa `null` döner — çağıran taraf
 * yönlendirme kararını verir.
 */
export async function ekipGetir(ekipId: string): Promise<EkipVerisi | null> {
  const snapshot = await getDoc(doc(db, EKIP_COLLECTION, ekipId));
  if (!snapshot.exists()) return null;

  const veri = snapshot.data() as Partial<EkipVerisi>;
  return {
    ekipAdi: veri.ekipAdi,
    uyeler: Array.isArray(veri.uyeler) ? veri.uyeler : [],
    durum: veri.durum ?? '',
    guncellemeTarihi: veri.guncellemeTarihi ?? null,
  };
}

/** Ekip durumunu ve güncelleme zamanını yazar. */
export async function ekipDurumGuncelle(
  ekipId: string,
  durum: EkipDurumu | string,
): Promise<void> {
  await updateDoc(doc(db, EKIP_COLLECTION, ekipId), {
    durum,
    guncellemeTarihi: serverTimestamp(),
  });
}
