/* eslint-disable @next/next/no-img-element */

import { AppBackdrop } from '@/components/layout/AppBackdrop';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PrimaryNav, SecondaryNav } from '@/components/layout/AppNav';

interface AppShellProps {
  children: React.ReactNode;
  /** Sağ panelin içeriği (bildirim listesi). Boşsa panel yalnızca çerçeve olur. */
  rail?: React.ReactNode;
}

/**
 * Uygulama iskeleti: zemin + başlık + iki panel (sol içerik, sağ bildirim) + altlık.
 * Figma'da sol panel 1200×789, sağ panel 450×789 ve aralarında 22.5px boşluk var;
 * paneller `container-outline.svg` ve `panel-icon.svg` ile çizilir — ikisi de
 * 5 birim kalınlığında #F8FCFF kontur ve 0.3 ölçekte 1.5px'e karşılık gelir.
 */
export function AppShell({ children, rail }: AppShellProps) {
  return (
    <>
      <AppBackdrop />

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-1 flex-col px-[6.43%] pt-[86.7px] pb-[24px]">
        <AppHeader />

        <div className="mt-[23.5px] flex flex-1 items-stretch gap-[22.5px]">
          <div className="relative flex min-w-0 flex-1 flex-col">
            <img
              src="/figma/container-outline.svg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full max-w-none"
            />
            <PrimaryNav />
            <main className="relative flex-1 pr-[85.7px] pl-[55.6px] pt-[55.5px] pb-[81.3px]">
              {children}
            </main>
          </div>

          <div className="relative flex w-[450px] shrink-0 flex-col">
            <img
              src="/figma/panel-icon.svg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full max-w-none"
            />
            <SecondaryNav />
            <div className="relative flex-1 px-[44.2px] pt-[78.6px] pb-[72.3px]">
              {rail}
            </div>
          </div>
        </div>

        <AppFooter />
      </div>
    </>
  );
}
