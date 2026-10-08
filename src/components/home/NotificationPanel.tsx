/* eslint-disable @next/next/no-img-element */

import { Tag } from '@/components/ui/Tag';
import { NOTIFICATIONS } from '@/components/home/notifications';

/**
 * Sağ paneldeki bildirim akışı. Figma'da liste 361.5px genişliğinde,
 * tarih etiketleri ve 126px yüksekliğindeki kartlardan oluşur; kartlar
 * 11.1px yarıçaplı, %50 saydam #1A1A1A zeminli ve %30 beyaz konturludur.
 */
export function NotificationPanel() {
  return (
    <section aria-label="Bildirimler" className="relative">
      <div className="h-[578.1px] space-y-[8.7px] overflow-hidden">
        {NOTIFICATIONS.map((group) => (
          <div key={group.date}>
            <p className="mb-[11.2px] text-panel-date font-inter font-normal text-lm-muted">
              {group.date}
            </p>

            <ul className="space-y-[8.7px]">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="relative h-[126px] rounded-[11.1px] border-[1.11px] border-lm-card-border bg-lm-card px-[20.3px] py-[15.9px]"
                >
                  <Tag tone={item.tone}>{item.tag}</Tag>

                  <p className="mt-[7.8px] w-[321.9px] text-card-title font-poppins font-normal leading-[1.145] text-lm-text">
                    {item.title}
                  </p>

                  <p className="absolute bottom-[15px] left-[20.3px] text-card-time font-inter font-medium text-lm-text">
                    {item.time}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Listenin altından kaybolma efekti */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-black/70 to-transparent" />

      <a
        href="#"
        className="absolute -bottom-[72.3px] left-0 flex items-center gap-[19px] text-panel-date font-inter font-normal text-lm-text transition-opacity hover:opacity-70"
      >
        Tüm bildirimleri görüntüle
        <img src="/figma/arrow-right.svg" alt="" className="w-[11.5px]" />
      </a>
    </section>
  );
}
