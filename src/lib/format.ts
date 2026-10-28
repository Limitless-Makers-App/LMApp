import type { Timestamp } from 'firebase/firestore';

const ZAMAN_FORMAT = new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Istanbul',
});

/** Firestore zaman damgasını Türkçe okunabilir metne çevirir. */
export function zamanMetni(zaman: Timestamp | null | undefined): string {
  if (!zaman) return '';
  return ZAMAN_FORMAT.format(zaman.toDate());
}
