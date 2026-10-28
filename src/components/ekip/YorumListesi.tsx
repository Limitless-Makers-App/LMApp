import { Tag } from '@/components/ui/Tag';
import { zamanMetni } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { YorumVerisi } from '@/types/ekip';
import { KART_CLASS, YORUM_KART_CLASS } from './ekipStyles';

interface YorumListesiProps {
  yorumlar: YorumVerisi[];
  yukleniyor: boolean;
}

/** Yorumları yeniden eskiye listeler; yüklenirken iskelet, boşken bilgi gösterir. */
export function YorumListesi({ yorumlar, yukleniyor }: YorumListesiProps) {
  if (yukleniyor) {
    return (
      <div className="flex animate-pulse flex-col gap-[13.8px]" aria-hidden>
        <div className={cn(KART_CLASS, 'h-[104px]')} />
        <div className={cn(KART_CLASS, 'h-[104px]')} />
      </div>
    );
  }

  if (yorumlar.length === 0) {
    return (
      <p
        className={cn(
          KART_CLASS,
          'px-[20.3px] py-[15.9px] font-inter text-label text-lm-muted',
        )}
      >
        Henüz yorum yok.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-[13.8px]">
      {yorumlar.map((yorum) => {
        const mentorYorumu = yorum.tip === 'mentor';
        return (
          <li key={yorum.id} className={cn(YORUM_KART_CLASS, 'px-[20.3px] py-[15.9px]')}>
            <div className="flex flex-wrap items-center gap-[10px]">
              <Tag tone={mentorYorumu ? 'program' : 'social'}>
                {mentorYorumu ? 'Mentor' : 'Öğrenci'}
              </Tag>
              <span className="font-inter text-card-time font-medium text-lm-muted">
                {zamanMetni(yorum.zaman)}
              </span>
            </div>
            <p className="mt-[11px] font-inter text-label whitespace-pre-line text-lm-text">
              {yorum.icerik}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
