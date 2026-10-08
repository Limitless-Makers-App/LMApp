/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';

interface SpeakerPosterProps {
  name: string;
  field: string;
  /** Konuşmacı fotoğrafı. Verilmezse nötr silüet yer tutucusu kullanılır. */
  photo?: string;
}

/** Gerçek kişi portresi yerine kullanılan nötr yer tutucu (vektör, ~0.7 KB). */
const PLACEHOLDER_PHOTO = '/figma/speaker-placeholder.svg';

/**
 * Konuşmacı posteri (Figma: 270×405px, 12px yarıçap).
 * Açık zeminli ön yüz; üstte portre, altta marka yeşili tipografi ve
 * `mix-blend-overlay` ile bindirilen ∞ motifi yer alır.
 */
export function SpeakerPoster({ name, field, photo }: SpeakerPosterProps) {
  return (
    <div className="relative h-[405px] w-[270px] shrink-0 overflow-hidden rounded-[12px]">
      <img
        src="/figma/speaker-card-bg.svg"
        alt=""
        className="absolute inset-0 h-full w-full max-w-none"
      />

      <div className="absolute top-[18px] left-[18px] h-[270px] w-[234px] overflow-hidden">
        <Image
          src={photo ?? PLACEHOLDER_PHOTO}
          alt={name}
          fill
          sizes="234px"
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      <img
        src="/figma/poster-overlay.svg"
        alt=""
        className="absolute top-[265.8px] left-[27px] h-[168px] w-[317.4px] max-w-none mix-blend-overlay"
      />

      <p className="absolute top-[304.8px] right-[18px] text-[15px] font-inter font-semibold tracking-[0.15px] text-[rgba(30,30,30,0.5)]">
        {field}
      </p>

      <p className="absolute top-[320.7px] right-[18px] text-[30px] font-inter font-extrabold tracking-[0.3px] text-lm-accent">
        {name}
      </p>

      <p className="absolute top-[386.1px] left-[37.05px] -translate-x-1/2 -translate-y-full text-[22.5px] font-inter font-extrabold tracking-[0.225px] whitespace-nowrap text-lm-accent">
        4.0
      </p>

      <p className="absolute top-[368.1px] right-[18px] text-[15px] font-inter font-semibold tracking-[0.15px] text-[rgba(30,30,30,0.5)]">
        #limitlessmakers
      </p>
    </div>
  );
}
