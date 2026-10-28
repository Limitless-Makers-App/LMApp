import { cn } from '@/lib/utils';

/** Ekibin durumunu gösteren küçük etiket. Tamamlanan durumu vurgulanır. */
export function DurumEtiketi({ durum }: { durum: string }) {
  const tamamlandi = durum === 'Tamamlandı';
  return (
    <span
      className={cn(
        'inline-flex h-[27px] items-center rounded-[13.5px] border-[1.5px] px-[12.9px]',
        'font-inter text-tag font-normal tracking-[1.5px] whitespace-nowrap',
        tamamlandi
          ? 'border-lm-accent bg-lm-accent text-lm-text'
          : 'border-lm-pill-border bg-lm-pill text-lm-muted',
      )}
    >
      {durum || 'Durum yok'}
    </span>
  );
}
