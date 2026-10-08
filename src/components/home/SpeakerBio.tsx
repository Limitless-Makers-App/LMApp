/* eslint-disable @next/next/no-img-element */

interface SpeakerBioProps {
  name: string;
  field: string;
  bio: string;
}

/**
 * Konuşmacı biyografi kartı (Figma: 270×405px, 12px yarıçap).
 * Posterin arka yüzü: açık zemin, solda yeşil sırt bandı üzerinde dikey ad,
 * sağda Montserrat Regular ile biyografi metni.
 */
export function SpeakerBio({ name, field, bio }: SpeakerBioProps) {
  return (
    <div className="relative h-[405px] w-[270px] shrink-0 overflow-hidden rounded-[12px] bg-[#eee]">
      <div
        className="absolute"
        style={{
          top: '34.81%',
          right: '-4.1%',
          bottom: '-2.29%',
          left: '2.89%',
          transform: 'rotate(-6.51deg)',
        }}
      >
        <img
          src="/figma/bio-vector.svg"
          alt=""
          className="h-full w-full max-w-none"
        />
      </div>

      {/* Yeşil sırt bandı */}
      <div className="absolute top-0 left-[22.2px] h-full w-[27.9px] bg-lm-accent" />

      <div className="absolute top-[205.7px] left-[21px] flex h-[182px] w-[29.1px] items-center justify-center mix-blend-overlay">
        <p className="-rotate-90 text-[24px] font-inter font-extrabold leading-[1.208] tracking-[0.24px] whitespace-nowrap text-[#1e1e1e]">
          {name}
        </p>
      </div>

      <div className="absolute top-[205.7px] left-[3.9px] flex h-[182px] w-[14.4px] items-center justify-center">
        <p className="-rotate-90 text-[12px] font-inter font-semibold leading-[1.208] tracking-[0.12px] whitespace-nowrap text-[rgba(30,30,30,0.5)]">
          {field}
        </p>
      </div>

      <p className="absolute top-[23.7px] left-[60.9px] w-[182px] text-[12px] font-montserrat font-normal leading-[1.46] tracking-[-0.24px] text-[#1e1e1e]">
        {bio}
      </p>

      <p className="absolute top-[385.8px] left-[36.15px] -translate-x-1/2 -translate-y-full text-[15px] font-inter font-extrabold tracking-[0.15px] whitespace-nowrap text-[#1e1e1e] mix-blend-overlay">
        4.0
      </p>

      <p className="absolute top-[367.8px] right-[20.2px] text-[15px] font-inter font-semibold tracking-[0.15px] text-[rgba(30,30,30,0.5)]">
        #limitlessmakers
      </p>
    </div>
  );
}
