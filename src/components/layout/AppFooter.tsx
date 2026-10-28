/* eslint-disable @next/next/no-img-element */

const SOCIALS = [
  { src: '/figma/social-1.svg', label: 'Instagram', href: 'https://www.instagram.com/limitlessmakers/' },
  { src: '/figma/social-2.svg', label: 'LinkedIn', href: 'https://www.linkedin.com/company/limitless-makers/' },
  { src: '/figma/social-3.svg', label: 'YouTube', href: null },
  { src: '/figma/social-4.svg', label: 'X', href: 'https://x.com/limitlessmakers' },
];

/**
 * Sayfa altlığı. Figma'da metin ve ikonlar yatayda ortalanmış tek bir satırdır:
 * metin 775.2–976.8px, ikonlar 995.5–1144.9px (toplam merkez 960px).
 */
export function AppFooter() {
  return (
    <footer className="mt-[36.7px] flex flex-wrap items-center justify-center gap-[18.7px]">
      <p className="w-full max-w-[201.6px] text-footer font-inter font-normal text-lm-muted sm:w-[201.6px]">
        All rights reserved Powered by Limitless Makers
      </p>

      <ul className="flex items-center gap-[9.4px]">
        {SOCIALS.map((social) =>
          // Adresi henüz bilinmeyen ikonlar `#` yerine hiç bağlantı olarak
          // render edilmez — ölü `#` linki klavyeyle gezinirken boşa duruyordu.
          social.href ? (
            <li key={social.src}>
              <a
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-opacity hover:opacity-70"
              >
                <img src={social.src} alt="" className="w-[30.34px]" />
              </a>
            </li>
          ) : (
            <li key={social.src} aria-hidden="true">
              <img
                src={social.src}
                alt=""
                title={`${social.label} — adres henüz tanımlı değil`}
                className="w-[30.34px] opacity-50"
              />
            </li>
          ),
        )}
      </ul>
    </footer>
  );
}
