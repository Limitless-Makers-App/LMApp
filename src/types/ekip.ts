import type { Timestamp } from 'firebase/firestore';

/** Firestore `ekip/{id}` dokümanının okunan alanları. */
export interface EkipVerisi {
  ekipAdi?: string;
  uyeler: string[];
  durum: string;
  guncellemeTarihi?: Timestamp | null;
}

/** Firestore `ekip-yorumlari/{id}` dokümanının okunan alanları. */
export interface YorumVerisi {
  id: string;
  gonderenId: string;
  icerik: string;
  zaman: Timestamp | null;
  tip?: 'mentor' | 'ogrenci';
}
