/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pill, NAV_INTERACTION_CLASS } from '@/components/ui/Pill';
import { cn } from '@/lib/utils';

const PRIMARY_LINKS = [
  { href: '/program', label: 'Program' },
  { href: '/proje', label: 'Proje' },
  { href: '/sosyal', label: 'Sosyal' },
  { href: '/formlar', label: 'Formlar' },
];

const SECONDARY_LINKS = [
  { href: '/duyurular', label: 'Duyurular' },
  { href: '/gorevler', label: 'Görevler' },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sol panelin üst şeridi. Sekmenin (çentiğin) içinde ana sayfa ikonu,
 * ardından Program / Proje / Sosyal / Formlar hapları yer alır.
 * Figma: ana sayfa ikonu şeridin 12.6–47.4px aralığında, haplar 69px'den başlar.
 *
 * Şeritte sabit yükseklik **yok**: tek satırda yükseklik zaten hapların 60px'i
 * kadardır, dolayısıyla tasarım genişliğinde görünüm birebir aynı kalır. Buna
 * karşılık `flex-wrap` sayesinde sığmayan haplar taşmak/üst üste binmek yerine
 * alt satıra iner — dar pencerede ve yüksek zoom'da çakışma böyle engellenir.
 */
export function PrimaryNav() {
  const isActive = useIsActive();
  const anaSayfaAktif = isActive('/');

  return (
    <nav className="relative flex w-full min-w-0 shrink-0 flex-wrap items-center gap-[9px]">
      <Link
        href="/"
        aria-label="Ana sayfa"
        aria-current={anaSayfaAktif ? 'page' : undefined}
        className={cn(
          'flex h-[60px] w-[59.3px] shrink-0 items-center justify-center',
          'rounded-[18px]',
          NAV_INTERACTION_CLASS,
          anaSayfaAktif
            ? // Ana sayfa ikonu Figma'da çerçevesiz; bu yüzden kenarlık yerine
              // parlaklık + zemin ile vurgulanıyor.
              'bg-lm-pill-active opacity-100 duration-200'
            : 'duration-150 hover:bg-lm-pill-hover opacity-50 hover:opacity-100',
        )}
      >
        <img
          src="/figma/nav-home.svg"
          alt=""
          aria-hidden="true"
          className="w-[34.8px]"
        />
      </Link>

      {PRIMARY_LINKS.map((link) => (
        <Pill key={link.href} href={link.href} active={isActive(link.href)}>
          {link.label}
        </Pill>
      ))}
    </nav>
  );
}

/**
 * Sağ panelin üst şeridi: Duyurular / Görevler hapları ve en sağdaki
 * sekme ikonu. Figma: haplar panelin 108.3px'inden başlar, ikon 390.8–449.3
 * aralığındaki çentikte ortalanır.
 *
 * `PrimaryNav` ile aynı taşma koruması: `min-w-0` + `flex-wrap`.
 */
export function SecondaryNav() {
  const isActive = useIsActive();

  return (
    <nav className="relative flex w-full min-w-0 shrink-0 flex-wrap items-center gap-[9px] pl-[108.3px]">
      {SECONDARY_LINKS.map((link) => (
        <Pill key={link.href} href={link.href} active={isActive(link.href)}>
          {link.label}
        </Pill>
      ))}

      <span className="ml-auto flex w-[58.5px] shrink-0 justify-center">
        <img
          src="/figma/panel-tab-icon.svg"
          alt=""
          aria-hidden="true"
          className="w-[25.3px]"
        />
      </span>
    </nav>
  );
}
