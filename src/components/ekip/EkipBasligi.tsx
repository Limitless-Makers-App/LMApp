import { zamanMetni } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { EkipVerisi } from '@/types/ekip';
import { DurumEtiketi } from './DurumEtiketi';
import { KART_CLASS } from './ekipStyles';

interface EkipBasligiProps {
  ekip: EkipVerisi;
  ekipAdi: string;
  uyeSayisi: number;
}

/** Ekip adı, durum etiketi ve son güncelleme bilgisini taşıyan başlık kartı. */
export function EkipBasligi({ ekip, ekipAdi, uyeSayisi }: EkipBasligiProps) {
  return (
    <header className={cn(KART_CLASS, 'px-[24.9px] py-[21.8px]')}>
      <div className="flex flex-wrap items-center gap-[13px]">
        <h1 className="font-inter text-hero font-bold text-lm-text">{ekipAdi}</h1>
        <DurumEtiketi durum={ekip.durum} />
      </div>
      <p className="mt-[9px] font-inter text-helper text-lm-muted">
        {uyeSayisi} üye
        {ekip.guncellemeTarihi ? ` · Son güncelleme ${zamanMetni(ekip.guncellemeTarihi)}` : ''}
      </p>
    </header>
  );
}
