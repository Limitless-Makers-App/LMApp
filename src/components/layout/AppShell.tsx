/* eslint-disable @next/next/no-img-element */

import { AppBackdrop } from '@/components/layout/AppBackdrop';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PrimaryNav, SecondaryNav } from '@/components/layout/AppNav';
import { DarEkranPaneli, RailIcerik } from '@/components/layout/PanelRail';

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

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-1 flex-col px-[16px] pt-[60px] pb-[24px] sm:px-[32px] lg:px-[6.43%] lg:pt-[86.7px]">
        <AppHeader />

        <div className="mt-[23.5px] flex flex-1 flex-col items-stretch gap-[22.5px] min-[1500px]:flex-row">
          <div className="relative flex min-w-0 flex-1 flex-col">
            <img
              src="/figma/container-outline.svg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full max-w-none"
            />
            <PrimaryNav />
            <main className="relative flex-1 px-[20px] pt-[40px] pb-[60px] sm:px-[40px] min-[1500px]:pt-[55.5px] min-[1500px]:pb-[81.3px] min-[1500px]:pr-[85.7px] min-[1500px]:pl-[55.6px]">
              {children}
            </main>

            {/* Dar ekranda sağ şerit gizli olduğu için açık panel içeriğin
                altında gösterilir; panel kapalıyken hiçbir şey render etmez. */}
            <DarEkranPaneli />
          </div>

          {/* Bildirim rayı 1500px altında gizlenir: 1366×768'de sol panel
              kullanılabilir genişlik bırakmıyordu. */}
          <div className="relative hidden w-full shrink-0 flex-col min-[1500px]:flex min-[1500px]:w-[450px]">
            <img
              src="/figma/panel-icon.svg"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full max-w-none"
            />
            <SecondaryNav />
            <div className="relative flex-1 px-[20px] pt-[40px] pb-[72.3px] lg:px-[44.2px] lg:pt-[78.6px]">
              <RailIcerik bildirimler={rail} />
            </div>
          </div>
        </div>

        <AppFooter />
      </div>
    </>
  );
}
