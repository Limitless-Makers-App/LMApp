import { cn } from '@/lib/utils';

export type TagTone = 'education' | 'program' | 'social' | 'project';

const TONE_CLASS: Record<TagTone, string> = {
  education: 'bg-lm-tag-education',
  program: 'bg-lm-tag-program',
  social: 'bg-lm-tag-social',
  project: 'bg-lm-tag-project',
};

interface TagProps {
  tone: TagTone;
  children: React.ReactNode;
  className?: string;
}

/**
 * Bildirim kartlarındaki kategori etiketi.
 * Figma ölçüleri: yükseklik 27px, yarıçap 13.5px, Inter Regular 15px,
 * harf aralığı 1.5px, metin #E8F6FF.
 */
export function Tag({ tone, children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-[27px] items-center rounded-[13.5px] px-[12.9px]',
        'font-inter text-tag font-normal tracking-[1.5px] text-[#e8f6ff]',
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
