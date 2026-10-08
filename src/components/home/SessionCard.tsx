/* eslint-disable @next/next/no-img-element */

import { cn } from '@/lib/utils';

interface SessionCardProps {
  color: string;
  speaker: string;
  role: string;
  title: string;
  className?: string;
}

/**
 * Sağ kolondaki kompakt oturum kartı (Figma: 415.2px genişlik, 139.2–152.7px
 * yükseklik). Üstte konuşmacı adı ve unvanı bulunur; alt kısım #1A1919 zeminli,
 * üst kenarı ayraç çizgili bir şerittir ve oturum başlığı ile ok ikonunu taşır.
 */
export function SessionCard({
  color,
  speaker,
  role,
  title,
  className,
}: SessionCardProps) {
  return (
    <div
      className={cn(
        'relative flex w-full flex-col overflow-hidden rounded-[13.6px]',
        'border-[1.5px] border-[#5e5e5f] shadow-[0_15.4px_19.1px_rgba(0,0,0,0.25)]',
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(${color}, ${color})`,
      }}
    >
      <div className="px-[24.9px] pt-[21.8px]">
        <p className="text-[30.6px] font-inter font-bold leading-none tracking-[-0.31px] text-lm-text">
          {speaker}
        </p>
        <p className="mt-[5px] whitespace-pre-line font-poppins text-[10.2px] font-normal leading-[0.967] text-lm-text">
          {role}
        </p>
      </div>

      <div className="mt-auto flex h-[58.3px] shrink-0 items-center border-t-[1.5px] border-[#5e5e5f] bg-[#1a1919] pr-[13.5px] pl-[26.4px]">
        <p className="w-[202.2px] text-[17.6px] font-inter font-normal leading-[1.152] tracking-[-0.35px] text-lm-text">
          {title}
        </p>
        <img src="/figma/card-icon.svg" alt="" className="ml-auto w-[24px]" />
      </div>
    </div>
  );
}
