import Link from 'next/link';

interface AuthAltBaglantiProps {
  metin: string;
  baglantiMetni: string;
  href: string;
}

/** Formun altındaki "Hesabın yok mu? Kayıt Ol" satırı. */
export function AuthAltBaglanti({ metin, baglantiMetni, href }: AuthAltBaglantiProps) {
  return (
    <p className="mt-[22.2px] text-center font-inter text-helper text-lm-muted">
      {metin}{' '}
      <Link href={href} className="font-medium text-lm-accent hover:underline">
        {baglantiMetni}
      </Link>
    </p>
  );
}
