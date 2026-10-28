import { DURUMLAR } from '@/lib/ekipConstants';
import { cn } from '@/lib/utils';

interface DurumSeciciProps {
  mevcutDurum: string;
  kaydediliyor: boolean;
  onSec: (durum: string) => void;
}

/** Ekip üyelerinin durumu değiştirebildiği buton grubu. */
export function DurumSecici({ mevcutDurum, kaydediliyor, onSec }: DurumSeciciProps) {
  return (
    <div className="flex flex-wrap gap-[9px]">
      {DURUMLAR.map((durum) => {
        const secili = mevcutDurum === durum;
        return (
          <button
            key={durum}
            type="button"
            disabled={kaydediliyor}
            onClick={() => onSec(durum)}
            aria-pressed={secili}
            className={cn(
              'inline-flex h-[40px] items-center rounded-[13.5px] border-[1.5px] px-[18px]',
              'font-inter text-label font-medium transition-opacity',
              'disabled:opacity-50',
              secili
                ? 'border-lm-accent bg-lm-accent text-lm-text'
                : 'border-lm-pill-border bg-lm-pill text-lm-muted hover:opacity-80',
            )}
          >
            {durum}
          </button>
        );
      })}
    </div>
  );
}
