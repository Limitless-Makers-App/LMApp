import { AppBackdrop } from '@/components/layout/AppBackdrop';
import { AppFooter } from '@/components/layout/AppFooter';

/**
 * Giriş/kayıt ekranlarının iskeleti.
 * İçerik viewport'un kalanında ortalanır, altlık ise akışın en altında durur —
 * böylece form uzasa bile altlık içeriğin üstüne binmez.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppBackdrop />
      <div className="relative flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center px-6 py-[86.7px]">
          {children}
        </div>
        <div className="shrink-0 pb-[24px]">
          <AppFooter />
        </div>
      </div>
    </>
  );
}
