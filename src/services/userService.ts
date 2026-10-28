import { collection, documentId, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { IN_QUERY_LIMIT, USERS_COLLECTION } from '@/lib/ekipConstants';
import { db } from '@/lib/firebaseClient';

/**
 * Üye uid'lerini görünen ada çevirir. Bulunamayanlar uid olarak kalır.
 *
 * Firestore `in` sorgusu en fazla 30 değer kabul ettiği için liste
 * `IN_QUERY_LIMIT`'lik gruplara bölünüp paralel okunur.
 */
export async function uyeAdlariniGetir(uids: string[]): Promise<Record<string, string>> {
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

/**
 * Kullanıcının Firestore'daki rolünü okur.
 * Doküman yoksa `null` döner — çağıran taraf varsayılanı seçer.
 */
export async function kullaniciRoluGetir(uid: string): Promise<string | null> {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snapshot.exists()) return null;
  return snapshot.data().role ?? 'user';
}
