'use client';

import { GaleriPanel } from '@/components/panels/GaleriPanel';
import { OturmaDuzeniPanel } from '@/components/panels/OturmaDuzeniPanel';
import { NAV_INTERACTION_CLASS } from '@/components/ui/Pill';
import { usePanel, type PanelTuru } from './PanelContext';

/** Sağ panelde açılan sekmelerin başlıkları. */
const PANEL_BASLIK: Record<PanelTuru, string> = {
  galeri: 'Galeri',
  'oturma-duzeni': 'Oturma Düzeni',
};

function panelIcerigi(panel: PanelTuru): React.ReactNode {
  switch (panel) {
    case 'galeri':
      return <GaleriPanel />;
    case 'oturma-duzeni':
      return <OturmaDuzeniPanel />;
  }
}

/**
 * Açık panelin gövdesi ve kapat düğmesini taşıyan başlık satırı.
 *
 * Hem sağ şeritte hem dar ekrandaki panel kullanır; böylece iki yerin
 * işaretlemesi birbirinden ayrışmaz.
 */
function PanelGovdesi({ panel }: { panel: PanelTuru }) {
  const { panelKapat } = usePanel();
  const baslik = PANEL_BASLIK[panel];

  return (
    <div role="region" aria-label={baslik}>
      <div className="mb-[18px] flex items-center justify-between gap-[12px]">
        <p className="font-inter text-panel-date font-normal text-lm-muted">{baslik}</p>

        {/* Görsel kutu 32px; `p-[6px]` dokunma alanını 44px'e çıkarır ve
            `-m-[6px]` bu fazlalığı yerleşimden geri alır. */}
        <button
          type="button"
          onClick={panelKapat}
          aria-label="Paneli kapat"
          className={[
            '-m-[6px] shrink-0 rounded-full p-[6px]',
            'text-lm-muted hover:text-lm-text',
            NAV_INTERACTION_CLASS,
          ].join(' ')}
        >
          <span
            aria-hidden="true"
            className="flex h-[32px] w-[32px] items-center justify-center text-[20px] leading-none"
          >
            ×
          </span>
        </button>
      </div>

      {panelIcerigi(panel)}
    </div>
  );
}

/**
 * Sağ şeridin içeriği. Panel kapalıyken bildirim listesi olduğu gibi
 * (bugünkü haliyle) render edilir; bir sekme açıksa onun gövdesi gösterilir.
 */
export function RailIcerik({ bildirimler }: { bildirimler: React.ReactNode }) {
  const { aktifPanel } = usePanel();

  if (aktifPanel === null) {
    return <>{bildirimler}</>;
  }

  return <PanelGovdesi panel={aktifPanel} />;
}

/**
 * 1500px altında sağ şerit gizlendiği için açık panelin sol kolonun altında
 * görünmesini sağlar. Panel kapalıyken hiçbir şey render etmez; geniş
 * ekranlarda da `min-[1500px]:hidden` ile sağ şeritle çakışmaz.
 */
export function DarEkranPaneli() {
  const { aktifPanel } = usePanel();

  if (aktifPanel === null) {
    return null;
  }

  return (
    <div className="mt-[22.5px] px-[20px] py-[24px] min-[1500px]:hidden">
      <PanelGovdesi panel={aktifPanel} />
    </div>
  );
}
