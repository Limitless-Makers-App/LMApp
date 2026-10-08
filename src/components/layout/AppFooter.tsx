/* eslint-disable @next/next/no-img-element */

const SOCIALS = [
  { src: '/figma/social-1.svg', label: 'Instagram' },
  { src: '/figma/social-2.svg', label: 'LinkedIn' },
  { src: '/figma/social-3.svg', label: 'YouTube' },
  { src: '/figma/social-4.svg', label: 'X' },
];

/**
 * Sayfa altlığı. Figma'da metin ve ikonlar yatayda ortalanmış tek bir satırdır:
 * metin 775.2–976.8px, ikonlar 995.5–1144.9px (toplam merkez 960px).
 */
export function AppFooter() {
  return (
    <footer className="mt-[36.7px] flex items-center justify-center gap-[18.7px]">
      <p className="w-[201.6px] text-footer font-inter font-normal text-lm-muted">
        All rights reserved Powered by Limitless Makers
      </p>

      <ul className="flex items-center gap-[9.4px]">
        {SOCIALS.map((social) => (
          <li key={social.src}>
            <a
              href="#"
              aria-label={social.label}
              className="block transition-opacity hover:opacity-70"
            >
              <img src={social.src} alt="" className="w-[30.34px]" />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
