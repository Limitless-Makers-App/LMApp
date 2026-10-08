/* eslint-disable @next/next/no-img-element */

import {
  FEATURED_SESSION,
  PURPLE_SESSION,
  RED_SESSION,
  SPEAKER_BIO,
  SPEAKER_POSTER,
} from '@/components/home/homeContent';
import { SessionBanner } from '@/components/home/SessionBanner';
import { SessionCard } from '@/components/home/SessionCard';
import { SpeakerBio } from '@/components/home/SpeakerBio';
import { SpeakerPoster } from '@/components/home/SpeakerPoster';

/**
 * Ana sayfa — Figma "LM App PC ana sayfa v2" (239:906), 1920×1080 referans.
 * İçerik kolonu 1058.7px: poster (270) + 49.5 + biyografi (270) + 54 + sağ kolon (415.2).
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-[4.3px]">
        <img src="/figma/clock.svg" alt="" className="w-[22.9px]" />
        <span className="text-label font-inter font-semibold text-lm-text">
          {FEATURED_SESSION.time}
        </span>
      </div>

      <SessionBanner
        className="mt-[7.2px]"
        color={FEATURED_SESSION.color}
        speaker={FEATURED_SESSION.speaker}
        role={FEATURED_SESSION.role}
        title={FEATURED_SESSION.title}
      />

      <div className="mt-[25.4px] flex items-start">
        <SpeakerPoster
          name={SPEAKER_POSTER.name}
          field={SPEAKER_POSTER.field}
        />

        <div className="ml-[49.5px]">
          <SpeakerBio
            name={SPEAKER_BIO.name}
            field={SPEAKER_BIO.field}
            bio={SPEAKER_BIO.bio}
          />
        </div>

        <div className="ml-[54px] flex w-[415.2px] shrink-0 flex-col">
          <span className="text-label font-inter font-semibold text-lm-text">
            {RED_SESSION.time}
          </span>

          <SessionCard
            className="mt-[13.8px] h-[139.2px]"
            color={RED_SESSION.color}
            speaker={RED_SESSION.speaker}
            role={RED_SESSION.role}
            title={RED_SESSION.title}
          />

          <span className="mt-[47.7px] text-label font-inter font-semibold text-lm-text">
            {PURPLE_SESSION.time}
          </span>

          <SessionCard
            className="mt-[10.8px] h-[152.7px]"
            color={PURPLE_SESSION.color}
            speaker={PURPLE_SESSION.speaker}
            role={PURPLE_SESSION.role}
            title={PURPLE_SESSION.title}
          />
        </div>
      </div>
    </div>
  );
}
