import { cn } from '@/lib/utils';

interface YorumFormuProps {
  deger: string;
  degistir: (deger: string) => void;
  gonderiliyor: boolean;
  onGonder: (event: React.FormEvent) => void;
}

/** Mentorların ekibe geri bildirim yazdığı form. */
export function YorumFormu({ deger, degistir, gonderiliyor, onGonder }: YorumFormuProps) {
  return (
    <form onSubmit={onGonder} className="flex flex-col gap-[13.8px]">
      <textarea
        value={deger}
        onChange={(event) => degistir(event.target.value)}
        rows={4}
        placeholder="Ekibe geri bildirimini yaz..."
        className={cn(
          'w-full resize-y rounded-[14.4px] border-[1.61px] border-lm-card-border',
          'bg-lm-panel px-[18px] py-[13px] font-inter text-label text-lm-text',
          'outline-none transition-colors focus:border-lm-accent',
          'placeholder:text-lm-dim',
        )}
      />
      <button
        type="submit"
        disabled={gonderiliyor || !deger.trim()}
        className={cn(
          'h-[56.4px] self-start rounded-[14.4px] border-[1.61px] border-lm-accent bg-lm-accent',
          'px-[32px] font-inter text-label font-semibold text-lm-text',
          'transition-opacity hover:opacity-90 disabled:opacity-50',
        )}
      >
        {gonderiliyor ? 'Gönderiliyor...' : 'Yorum Gönder'}
      </button>
    </form>
  );
}
