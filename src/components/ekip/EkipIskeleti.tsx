import { cn } from '@/lib/utils';
import { KART_CLASS } from './ekipStyles';

/** Yükleniyor iskeleti — kart tonunda, ana sayfa v2 ile aynı yüzeyler. */
export function EkipIskeleti() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className={cn(KART_CLASS, 'h-[132px]')} />
      <div className="mt-[34px] grid gap-[13.8px] sm:grid-cols-2">
        <div className={cn(KART_CLASS, 'h-[92px]')} />
        <div className={cn(KART_CLASS, 'h-[92px]')} />
      </div>
      <div className="mt-[34px] flex flex-col gap-[13.8px]">
        <div className={cn(KART_CLASS, 'h-[104px]')} />
        <div className={cn(KART_CLASS, 'h-[104px]')} />
      </div>
    </div>
  );
}
