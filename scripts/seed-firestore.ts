/**
 * Firestore test verisi yükleyici.
 *
 * `ekip` ve `ekip-yorumlari` koleksiyonlarını örnek verilerle doldurur.
 * Script idempotenttir: her çalıştırmada `seed-` önekli dokümanları siler ve
 * aynı sabit ID'lerle yeniden yazar.
 *
 * Kullanım:
 *   npm run seed -- --uid=<kendi_uid>
 *   npm run seed -- --uid=<uid_1> --uid=<uid_2> --mentor-uid=<uid_1>
 *
 * Ayrıntı için: CLAUDE.md → "Test Verisi (Seed)"
 */

import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import type { ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

/* ==========================================================================
   Sabitler
   ========================================================================== */

const EKIP_COLLECTION = 'ekip';
const YORUM_COLLECTION = 'ekip-yorumlari';
const USERS_COLLECTION = 'users';

/** Bu önekle başlayan yorum dokümanları seed'e ait sayılır ve silinebilir. */
const SEED_PREFIX = 'seed-';

/**
 * `ekip/[id]/page.tsx` içindeki `DURUMLAR` listesiyle birebir aynı olmalı —
 * sayfa durum etiketlerini bu dizelerle karşılaştırıyor.
 */
type Durum = 'Fikir aşaması' | 'Rapor yazıyor' | 'Sunum hazırlığı' | 'Tamamlandı';
type YorumTipi = 'mentor' | 'ogrenci';

/* ==========================================================================
   Yardımcılar
   ========================================================================== */

/** Kullanıcıya gösterilecek hatalar — yığın izi olmadan yazdırılır. */
class KullaniciHatasi extends Error {}

function dur(mesaj: string): never {
  throw new KullaniciHatasi(mesaj);
}

/** `.env.local` varsa yükler; yoksa ortam değişkenleri dışarıdan gelmiş olmalı. */
function ortamiYukle(): void {
  try {
    process.loadEnvFile('.env.local');
  } catch {
    // Dosya yok — sorun değil, aşağıda eksik değişken kontrolü yapılıyor.
  }
}

/* ==========================================================================
   Komut satırı argümanları
   ========================================================================== */

interface Argumanlar {
  uidler: string[];
  mentorUid: string | null;
  projectId: string | null;
  yardim: boolean;
}

function argumanlariAyristir(argv: string[]): Argumanlar {
  const sonuc: Argumanlar = {
    uidler: [],
    mentorUid: null,
    projectId: null,
    yardim: false,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      sonuc.yardim = true;
      continue;
    }

    const eslesme = /^--([a-z-]+)=(.*)$/.exec(arg);
    if (!eslesme) continue;

    const [, ad, hamDeger] = eslesme;
    const deger = hamDeger.trim();
    if (!deger) continue;

    if (ad === 'uid') {
      // Hem `--uid=a --uid=b` hem `--uid=a,b` desteklenir.
      sonuc.uidler.push(...deger.split(',').map((parca) => parca.trim()));
    } else if (ad === 'mentor-uid') {
      sonuc.mentorUid = deger;
    } else if (ad === 'project-id') {
      sonuc.projectId = deger;
    }
  }

  sonuc.uidler = [...new Set(sonuc.uidler.filter(Boolean))];
  return sonuc;
}

const KULLANIM = `
Firestore test verisi yükleyici

Kullanım:
  npm run seed -- --uid=<uid> [--uid=<uid> ...] [seçenekler]

Seçenekler:
  --uid=<uid>          Ekip üyesi olacak kullanıcı UID'si. Tekrarlanabilir
                       veya virgülle ayrılmış liste olarak verilebilir. Zorunlu.
  --mentor-uid=<uid>   Mentor rolündeki kullanıcı. Verilirse bu kullanıcının
                       users/<uid> dokümanına role: "mentor" yazılır (merge).
                       Yorum formunun görünmesi için gereklidir.
  --project-id=<id>    Firebase proje ID'si. Verilmezse
                       NEXT_PUBLIC_FIREBASE_PROJECT_ID kullanılır.
  -h, --help           Bu metni gösterir.

Gerekli ortam değişkenleri (.env.local):
  FIREBASE_SERVICE_ACCOUNT_KEY   Service account JSON'u, tek satır (önerilen)
  FIREBASE_SERVICE_ACCOUNT_PATH  veya indirilen JSON dosyasının yolu

Örnek:
  npm run seed -- --uid=abc123 --mentor-uid=abc123
`.trim();

/* ==========================================================================
   Kimlik bilgileri
   ========================================================================== */

function servisHesabiniYukle(): ServiceAccount {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();

  if (json) {
    let hesap: ServiceAccount;
    try {
      hesap = JSON.parse(json) as ServiceAccount;
    } catch {
      dur(
        'FIREBASE_SERVICE_ACCOUNT_KEY geçerli JSON değil.\n' +
          '  JSON içeriğini TEK SATIR olarak ve tırnak içine alarak yapıştırın:\n' +
          "  FIREBASE_SERVICE_ACCOUNT_KEY='{" + '"type":"service_account", ...' + "}'",
      );
    }
    return privateKeyDuzelt(hesap);
  }

  const yol = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (yol) {
    let icerik: string;
    try {
      icerik = readFileSync(yol, 'utf8');
    } catch {
      dur(`FIREBASE_SERVICE_ACCOUNT_PATH okunamadı: ${yol}`);
    }
    try {
      return privateKeyDuzelt(JSON.parse(icerik) as ServiceAccount);
    } catch {
      dur(`FIREBASE_SERVICE_ACCOUNT_PATH geçerli JSON değil: ${yol}`);
    }
  }

  dur(
    'Service account bilgisi bulunamadı.\n' +
      '  .env.local içine FIREBASE_SERVICE_ACCOUNT_KEY (tek satır JSON) veya\n' +
      '  FIREBASE_SERVICE_ACCOUNT_PATH (dosya yolu) ekleyin.\n' +
      '  Anahtar: Firebase Console → Project settings → Service accounts → Generate new private key',
  );
}

/**
 * `.env.local` üzerinden geçen JSON'da satır sonları bazen çift kaçışlı
 * (`\\n`) kalır; gerçek satır sonuna çevirmezsek Admin SDK imza hatası verir.
 */
function privateKeyDuzelt(hesap: ServiceAccount): ServiceAccount {
  if (hesap.privateKey?.includes('\\n')) {
    return { ...hesap, privateKey: hesap.privateKey.replace(/\\n/g, '\n') };
  }
  return hesap;
}

/* ==========================================================================
   Seed verisi
   ========================================================================== */

interface YorumSeed {
  icerik: string;
  tip: YorumTipi;
  /** Yorumun kaç gün önce yazıldığı — sıralamayı deterministik yapar. */
  gunOnce: number;
}

interface EkipSeed {
  id: string;
  ekipAdi: string;
  durum: Durum;
  yorumlar: YorumSeed[];
}

const EKIPLER: EkipSeed[] = [
  {
    id: 'ekip-1',
    ekipAdi: 'Tarım Teknolojileri',
    durum: 'Rapor yazıyor',
    yorumlar: [
      {
        icerik:
          'Problem tanımı çok net olmuş, tebrikler. Bir sonraki adımda hedef kitleyi biraz daha daraltmayı deneyin — "küçük ölçekli üretici" ifadesi hâlâ geniş kalıyor.',
        tip: 'mentor',
        gunOnce: 9,
      },
      {
        icerik:
          'Teşekkürler! Bu hafta saha görüşmelerini tamamlayıp hedef kitleyi netleştireceğiz.',
        tip: 'ogrenci',
        gunOnce: 7,
      },
      {
        icerik:
          'Rapor taslağını cuma gününe kadar paylaşırsanız, sunum öncesi birlikte gözden geçirebiliriz.',
        tip: 'mentor',
        gunOnce: 2,
      },
    ],
  },
  {
    id: 'ekip-2',
    ekipAdi: 'Fintech 101',
    durum: 'Sunum hazırlığı',
    yorumlar: [
      {
        icerik:
          'Sunum akışı iyi kurulmuş ancak 3. slayttaki verinin kaynağını belirtmemişsiniz; jüri bunu mutlaka soracaktır.',
        tip: 'mentor',
        gunOnce: 6,
      },
      {
        icerik:
          'Kaynağı ekledik ve slayt sayısını 12\'ye indirdik. Gözden geçirebilir misiniz?',
        tip: 'ogrenci',
        gunOnce: 4,
      },
      {
        icerik:
          'Gördüm, çok daha derli toplu olmuş. Süre provasını da yapın — 5 dakikayı aşmamalı.',
        tip: 'mentor',
        gunOnce: 1,
      },
    ],
  },
  {
    id: 'ekip-3',
    ekipAdi: 'Yaratıcılık 101',
    durum: 'Fikir aşaması',
    yorumlar: [
      {
        icerik:
          'Fikir haritasına baktım, üç yön de denenebilir. Hangisinin en hızlı prototiplenebileceğini birlikte tartışalım.',
        tip: 'mentor',
        gunOnce: 5,
      },
      {
        icerik:
          'Biz de ikinci seçeneğe yakınız. Kullanıcı testi için 5 kişi bulduk, haftaya başlıyoruz.',
        tip: 'ogrenci',
        gunOnce: 3,
      },
    ],
  },
];

/**
 * Üyeleri ekiplere dağıtır.
 *
 * 3'ten az UID verildiğinde herkes her ekibe girer — böylece tek UID ile test
 * eden kişi tüm sayfalarda "ekip üyesi" arayüzünü (durum güncelleme) görür.
 * 3 ve üzeri UID'de üyeler sırayla paylaştırılır.
 */
function uyeleriDagit(uidler: string[], ekipSirasi: number): string[] {
  if (uidler.length < 3) return [...uidler];

  const secilenler = uidler.filter((_, index) => index % 3 === ekipSirasi);
  return secilenler.length > 0 ? secilenler : [uidler[ekipSirasi % uidler.length]];
}

/* ==========================================================================
   Yazma
   ========================================================================== */

async function main(): Promise<void> {
  ortamiYukle();

  const argumanlar = argumanlariAyristir(process.argv.slice(2));

  if (argumanlar.yardim) {
    console.log(KULLANIM);
    return;
  }

  if (argumanlar.uidler.length === 0) {
    dur(`En az bir --uid vermelisiniz.\n\n${KULLANIM}`);
  }

  const servisHesabi = servisHesabiniYukle();
  const projectId =
    argumanlar.projectId ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ??
    undefined;

  const app = initializeApp({
    credential: cert(servisHesabi),
    ...(projectId ? { projectId } : {}),
  });
  const db = getFirestore(app);

  const mentorUid = argumanlar.mentorUid ?? argumanlar.uidler[0];
  const batch = db.batch();

  // Mentor rolü — yalnızca açıkça istendiğinde users dokümanına dokunulur.
  if (argumanlar.mentorUid) {
    batch.set(
      db.collection(USERS_COLLECTION).doc(argumanlar.mentorUid),
      { role: 'mentor' },
      { merge: true },
    );
  }

  let yorumSayisi = 0;
  let silinenYorum = 0;

  for (const [sira, ekip] of EKIPLER.entries()) {
    const uyeler = uyeleriDagit(argumanlar.uidler, sira);

    // Tüm üyeler aynı `guncellemeTarihi` değerini paylaşsın diye tek referans.
    const zaman = Timestamp.fromDate(new Date());
    const ilkYorumGunu = Math.max(...ekip.yorumlar.map((y) => y.gunOnce));

    batch.set(db.collection(EKIP_COLLECTION).doc(ekip.id), {
      ekipAdi: ekip.ekipAdi,
      uyeler,
      durum: ekip.durum,
      olusturmaTarihi: Timestamp.fromDate(
        new Date(Date.now() - (ilkYorumGunu + 7) * 86_400_000),
      ),
      guncellemeTarihi: zaman,
    });

    // Önceki çalıştırmadan kalan seed yorumlarını temizle (idempotency).
    const mevcut = await db
      .collection(YORUM_COLLECTION)
      .where('ekipId', '==', ekip.id)
      .get();

    const artiklar = mevcut.docs.filter((belge) =>
      belge.id.startsWith(SEED_PREFIX),
    );
    artiklar.forEach((belge) => {
      batch.delete(belge.ref);
      silinenYorum += 1;
    });

    // Yorum yazarları: mentor yorumları mentorUid'den, öğrenci yorumları
    // mentordan farklı bir üyeden gelir.
    const ogrenciUid = uyeler.find((uid) => uid !== mentorUid) ?? mentorUid;

    ekip.yorumlar.forEach((yorum, yorumSirasi) => {
      const yorumId = `${SEED_PREFIX}${ekip.id}-${yorumSirasi + 1}`;
      batch.set(db.collection(YORUM_COLLECTION).doc(yorumId), {
        ekipId: ekip.id,
        gonderenId: yorum.tip === 'mentor' ? mentorUid : ogrenciUid,
        icerik: yorum.icerik,
        zaman: Timestamp.fromDate(
          new Date(Date.now() - yorum.gunOnce * 86_400_000),
        ),
        tip: yorum.tip,
      });
      yorumSayisi += 1;
    });
  }

  await batch.commit();

  /* ------------------------------- Özet ------------------------------- */

  console.log('\n✔ Seed tamamlandı.');
  console.log(`  Proje          : ${projectId ?? '(service account varsayılanı)'}`);
  console.log(`  Ekip           : ${EKIPLER.length}`);
  console.log(`  Yorum          : ${yorumSayisi}`);
  console.log(`  Silinen eskiler: ${silinenYorum}`);
  console.log(`  Üyeler         : ${argumanlar.uidler.join(', ')}`);
  console.log(`  Mentor         : ${mentorUid}${argumanlar.mentorUid ? ' (role: mentor yazıldı)' : ''}`);
  console.log('\n  Test adresleri:');
  EKIPLER.forEach((ekip) => console.log(`    http://localhost:3000/ekip/${ekip.id.replace('ekip-', '')}`));

  if (!argumanlar.mentorUid) {
    console.log(
      '\n  Not: --mentor-uid verilmedi. Yorum ekleme formunun görünmesi için\n' +
        '  kullanıcının users dokümanında role: "mentor" olmalı.',
    );
  }
  console.log('');
}

void main().catch((hata: unknown) => {
  if (hata instanceof KullaniciHatasi) {
    console.error(`\n✖ ${hata.message}\n`);
  } else {
    console.error('\n✖ Beklenmeyen hata:', hata);
  }
  process.exitCode = 1;
});
