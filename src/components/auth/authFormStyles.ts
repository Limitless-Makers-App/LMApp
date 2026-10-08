/**
 * Giriş ve kayıt ekranlarının ortak form stilleri.
 *
 * Ölçüler Figma "LM App PC log in" (239:818) çerçevesinden 0.3 katsayısıyla
 * CSS px'e çevrilmiştir. İki sayfa aynı dili paylaştığı için burada tek yerde
 * tutulur — birini değiştirirken diğerinin geride kalmasını engeller.
 */

/** Metin alanı: 56.4px yükseklik, 14.4px yarıçap, odakta marka yeşili. */
export const FIELD_CLASS =
  'h-[56.4px] w-full rounded-[14.4px] border-[1.61px] border-lm-field-border ' +
  'bg-lm-panel px-[18px] font-inter text-label font-normal text-lm-text ' +
  'outline-none transition-colors focus:border-lm-accent ' +
  'placeholder:text-lm-dim';

/** Alan etiketi: Inter Semibold, hafif negatif harf aralığı. */
export const LABEL_CLASS =
  'font-inter text-label font-semibold tracking-[-0.3px] text-lm-text';

/** Birincil eylem butonu (Giriş Yap / Kayıt Ol). */
export const PRIMARY_BUTTON_CLASS =
  'h-[56.4px] w-full rounded-[14.4px] border-[1.61px] border-lm-accent ' +
  'bg-lm-accent font-inter text-label font-semibold tracking-[-0.3px] text-lm-text ' +
  'transition-opacity hover:opacity-90 disabled:opacity-50';

/** İkincil eylem butonu (Google ile devam et). */
export const SECONDARY_BUTTON_CLASS =
  'h-[56.4px] w-full rounded-[14.4px] border-[1.61px] border-lm-pill-border ' +
  'bg-lm-pill font-inter text-label font-medium text-lm-text ' +
  'transition-opacity hover:opacity-90 disabled:opacity-50';

/** Hata bildirimi — panel zemininde ince renkli kontur. */
export const ERROR_CLASS =
  'rounded-[14.4px] border-[1.61px] border-lm-tag-education bg-lm-panel ' +
  'px-[18px] py-[12px] font-inter text-helper text-lm-text';
