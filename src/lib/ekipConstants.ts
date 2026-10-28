/**
 * Ekip ve yorum verisinin Firestore sabitleri.
 *
 * Koleksiyon adları ile durum listesi tek yerde durur; sayfa, servis ve seed
 * script'i aynı değerleri tekrar yazmak zorunda kalmaz.
 */

export const EKIP_COLLECTION = 'ekip';
export const YORUM_COLLECTION = 'ekip-yorumlari';
export const USERS_COLLECTION = 'users';

/** Firestore `in` sorgusu en fazla 30 değer kabul eder. */
export const IN_QUERY_LIMIT = 30;

export const DURUMLAR = [
  'Fikir aşaması',
  'Rapor yazıyor',
  'Sunum hazırlığı',
  'Tamamlandı',
] as const;

/** Ekip durumunun geçerli değerleri — `DURUMLAR`'dan türetilir. */
export type EkipDurumu = (typeof DURUMLAR)[number];
