import type { TagTone } from '@/components/ui/Tag';

export interface NotificationItem {
  id: string;
  tone: TagTone;
  tag: string;
  title: string;
  time: string;
}

export interface NotificationGroup {
  date: string;
  items: NotificationItem[];
}

/** Figma "LM App PC ana sayfa v2" bildirim listesi. */
export const NOTIFICATIONS: NotificationGroup[] = [
  {
    date: '5 Temmuz',
    items: [
      {
        id: 'n1',
        tone: 'education',
        tag: 'Eğitim',
        title: '6 Temmuz eğitmen kartları yüklendi',
        time: '22.42',
      },
      {
        id: 'n2',
        tone: 'program',
        tag: 'Program',
        title: "6 Temmuz gezisi için yarın 08.45'te masa tenisinin oradayız.",
        time: '21.27',
      },
      {
        id: 'n3',
        tone: 'social',
        tag: 'Sosyal',
        title: 'Enes seni masa tenisi takımına davet etti',
        time: '19.13',
      },
    ],
  },
  {
    date: '3 Temmuz',
    items: [
      {
        id: 'n4',
        tone: 'project',
        tag: 'Proje',
        title: 'Ideathon için şimdiden ekipleri kurmaya başlayın.',
        time: '19.13',
      },
    ],
  },
];
