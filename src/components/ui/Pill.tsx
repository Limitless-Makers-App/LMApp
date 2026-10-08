import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Nav öğelerinin (haplar + ana sayfa ikonu) paylaştığı etkileşim sınıfları.
 *
 * `transition-property` burada **tek** bir listede veriliyor. Tailwind'de
 * `transition-colors` ile `transition-transform` aynı özelliği yazar; üst üste
 * kullanıldıklarında yalnızca biri geçerli olur ve animasyonun yarısı sessizce
 * kaybolur. Dört özelliği açıkça saymak bu tuzağı ortadan kaldırır.
 *
 * `transition-duration` bilerek buraya konmadı: aktif hap 200ms, pasif hap
 * 150ms kullanıyor. İki `duration-*` sınıfı birlikte verilseydi yine biri
 * diğerini ezerdi; süreyi her çağıran kendisi seçer.
 *
 * `motion-reduce` hareket azaltma tercihini destekler: geçiş ve basma
 * küçülmesi kapanır, renk durumları anında uygulanmaya devam eder.
 */
export const NAV_INTERACTION_CLASS = [
  'transition-[color,background-color,border-color,transform,opacity] ease-out',
  'outline-none focus-visible:ring-[2px] focus-visible:ring-lm-accent',
  'active:scale-95',
  'motion-reduce:transition-none motion-reduce:active:scale-100',
].join(' ');

interface PillProps {
  href: string;
  children: React.ReactNode;
  /** Bulunulan sayfanın bağlantısı — Figma'da altı çizili gösterilir. */
  active?: boolean;
  className?: string;
}

/**
 * Üst menüdeki hap biçimli bağlantı (Program, Proje, Sosyal, Formlar,
 * Duyurular, Görevler). Figma ölçüleri: yükseklik 60px, yarıçap 18px,
 * Inter Medium 23.1px, harf aralığı -0.46px.
 *
 * Genişlik sabit değil: `px-[21px]` + `whitespace-nowrap` ile içeriğe göre
 * büyür, böylece hem zoom'da hem dar pencerede metin kırılmaz. Sığmayan haplar
 * taşmak yerine alt satıra iner (bkz. `PrimaryNav`).
 */
export function Pill({ href, children, active = false, className }: PillProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-[60px] shrink-0 items-center justify-center whitespace-nowrap',
        'rounded-[18px] border-[1.5px] px-[21px]',
        'font-inter text-nav font-medium tracking-[-0.46px]',
        NAV_INTERACTION_CLASS,
        // Renk sınıfları iki dala ayrıldı: `border-lm-pill-border` ile
        // `border-lm-text` (ve metin/zemin karşılıkları) aynı özelliği yazdığı
        // için birlikte verildiklerinde hangisinin kazandığı CSS sıralamasına
        // kalırdı. Her durumda yalnızca bir takım üretiliyor.
        active
          ? // Aktif: beyaz metin + parlak kenarlık + hafif dolgu, 200ms geçiş.
            'border-lm-text bg-lm-pill-active text-lm-text underline underline-offset-[6px] duration-200'
          : // Pasif: hover'da zemin bir ton açılır, kenarlık ve metin parlar.
            'border-lm-pill-border bg-lm-pill text-lm-dim duration-150 hover:border-lm-text hover:bg-lm-pill-hover hover:text-lm-text',
        className,
      )}
    >
      {children}
    </Link>
  );
}
