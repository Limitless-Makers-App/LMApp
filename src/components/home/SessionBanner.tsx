/* eslint-disable @next/next/no-img-element */

import { cn } from '@/lib/utils';

interface SessionBannerProps {
  /** Figma'daki düz renk — üzerine %20 siyah perde biner. */
  color: string;
  speaker: string;
  role: string;
  title: string;
  className?: string;
}

/**
 * Ana sayfanın üstündeki geniş oturum bandı (Figma: 1058.7×140.9px).
 * Solda konuşmacı adı ve unvanı, ortada dikey ayraç, sağda #1A1919 zemin
 * üzerinde oturum başlığı yer alır. Ayraç bandı 282px'de ikiye böler.
 */
export function SessionBanner({
  color,
  speaker,
  role,
  title,
  className,
}: SessionBannerProps) {
  return (
    <div
      className={cn(
        'relative flex h-[140.9px] w-full overflow-hidden rounded-[13.6px]',
        'border-[1.5px] border-[#5e5e5f] shadow-[0_15.4px_19.1px_rgba(0,0,0,0.25)]',
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(${color}, ${color})`,
      }}
    >
      <div className="flex w-[280.5px] shrink-0 flex-col justify-center pb-[36px] pl-[24.9px]">
        <p className="text-[30.6px] font-inter font-bold leading-none tracking-[-0.31px] text-lm-text">
          {speaker}
        </p>
        <p className="mt-[7.7px] whitespace-pre-line font-poppins text-[10.2px] font-normal leading-[0.967] text-lm-text">
          {role}
        </p>
      </div>

      <img src="/figma/card-divider.svg" alt="" className="h-full w-[1.5px] shrink-0" />

      <div className="flex flex-1 items-center bg-[#1a1919] px-[37.6px]">
        <p className="w-[327.8px] text-[17.6px] font-inter font-normal leading-[1.152] tracking-[-0.35px] text-lm-text">
          {title}
        </p>
      </div>
    </div>
  );
}
