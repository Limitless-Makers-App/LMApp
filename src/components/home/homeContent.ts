/**
 * Ana sayfa (v2 — Figma 239:906) içeriği.
 *
 * NOT: Figma MCP çağrı limiti nedeniyle bazı metin alanları doğrulanamadı.
 * `TODO(figma)` ile işaretlenen değerler yer tutucudur; tasarımdaki gerçek
 * metinlerle değiştirilmelidir. Konuşmacı adları, unvanlar ve oturum
 * başlıkları tasarımdan birebir alınmıştır.
 */

export interface HomeSession {
  /** Figma'daki düz renk; üzerine %20 siyah perde biner. */
  color: string;
  time: string;
  speaker: string;
  role: string;
  title: string;
}

/** Üstteki geniş bant — Yusuf Kurt oturumu. */
export const FEATURED_SESSION: HomeSession = {
  color: 'rgb(112, 178, 100)',
  time: '10.00-12.45',
  speaker: 'Yusuf Kurt',
  role: 'Kibele Projekt\nGenel Müdürü',
  // TODO(figma): Bant başlığı tasarımdan okunamadı (2 satır, 327.8px genişlik).
  title: 'Tarım Teknolojileri ve Sürdürülebilir Gıda Üretimi',
};

/** Sağ kolondaki üst kart. */
export const RED_SESSION: HomeSession = {
  color: 'rgb(186, 80, 85)',
  time: '14.00-17.45',
  speaker: 'Ulvi iskanderli',
  // TODO(figma): Unvan metni tasarımdan okunamadı.
  role: 'Fintech\nKurucu',
  title: 'Fintech 101',
};

/** Sağ kolondaki alt kart. */
export const PURPLE_SESSION: HomeSession = {
  color: 'rgb(59, 53, 89)',
  // TODO(figma): İkinci zaman aralığı tasarımdan okunamadı.
  time: '17.45-19.00',
  speaker: 'Didem Otar',
  role: 'Dotar Design // Kreatif Tasarım Direktörü',
  title: 'Yaratıcılık 101: Tasarım Odaklı Düşünme',
};

export const SPEAKER_POSTER = {
  name: 'Yusuf Kurt',
  field: 'Tarım Teknolojileri',
};

/** Poster ve biyografi kartı aynı konuşmacıyı gösterir. */
export const SPEAKER_BIO = {
  name: 'Yusuf Kurt',
  field: 'Tarım Teknolojileri',
  // TODO(figma): Biyografi metni tasarımdan okunamadı (Montserrat Regular 12px).
  bio: 'Kibele Projekt Genel Müdürü. Tarım teknolojileri alanında sürdürülebilir üretim modelleri ve veri odaklı tarım çözümleri üzerine çalışıyor.',
};
