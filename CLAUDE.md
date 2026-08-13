# LMApp — Limitless Makers App

> **Ekip ve proje takip platformu** — Limitless Makers topluluğu için geliştiriliyor.
> Mentörler ve öğrenciler proje ekipleri üzerinden iletişim kurabilir, durum güncelleyebilir ve geri bildirim paylaşabilir.

---

## 🧱 Kullanılan Teknolojiler

| Alan | Teknoloji | Detay |
|------|-----------|-------|
| Framework | Next.js 16.3.0 (App Router) | Turbopack (default), SSR/SSG |
| Dil | TypeScript 5 | `strict: true` |
| Stil | Tailwind CSS v4 | PostCSS, `@tailwindcss/postcss` |
| Kimlik Doğrulama | Firebase Authentication | Email/Şifre + Google Sign-In |
| Veritabanı | Firebase Firestore (NoSQL) | `users` koleksiyonu hazır |
| PWA | Serwist v9.5.12 | Sadece production'da aktif (service worker) |
| Paket Yöneticisi | npm | |

---

## 📁 Proje Yapısı

```
D:\LMApp/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout — AuthProvider sarmalı
│   │   ├── page.tsx          # Ana sayfa (varsayılan Next.js şablonu, henüz düzenlenmedi)
│   │   └── globals.css
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state, onAuthStateChanged, roller
│   ├── hooks/
│   │   └── useAuth.ts         # AuthContext'i tüketen custom hook
│   ├── lib/
│   │   └── firebaseClient.ts  # Firebase init (session persistence)
│   ├── services/
│   │   └── authService.ts     # Auth işlemleri (giriş, kayıt, çıkış, şifre sıfırlama)
│   └── sw.ts                  # Service Worker (Serwist)
├── public/                    # Statik dosyalar
├── next.config.ts             # Serwist (sadece NODE_ENV=production)
├── .env.example               # Firebase credential şablonu
├── .env.local                 # Gerçek Firebase credential'lar (gitignored)
├── CLAUDE.md                  # Bu dosya
├── AGENTS.md                  # Next.js 16 uyarıları
└── package.json
```

---

## 🗄️ Firestore Veri Modeli

### `users` koleksiyonu

- **Doküman ID:** `{uid}` (Firebase Auth UID)
- Kayıt anında `authService.ts` → `signUpWithEmail()` tarafından oluşturulur.
- Google ile girişte (`googleSignIn()`) yoksa oluşturulur.

| Alan | Tip | Açıklama |
|------|-----|----------|
| `uid` | string | Firebase Auth UID |
| `email` | string | E-posta adresi |
| `displayName` | string | Görünen ad |
| `photoURL` | string (opsiyonel) | Profil fotoğrafı URL'si |
| `role` | string | `"user"` (varsayılan), `"mentor"`, `"admin"` |
| `createdAt` | timestamp | Firestore serverTimestamp |
| `updatedAt` | timestamp | Firestore serverTimestamp |

> `"mentor"` ve `"admin"` rolleri henüz endpoint/panel üzerinden atanamıyor — Firestore Console'dan manuel girilmeli.

---

## ✅ Tamamlanan Adımlar

| # | Adım | Branch / PR |
|---|------|-------------|
| 1 | GitHub repo oluşturma, ekip üyelerine yetki | `main` |
| 2 | Next.js + TypeScript + Tailwind proje iskeleti | `main` |
| 3 | PWA desteği (Serwist) | `main` |
| 4 | Firebase projesi → Auth + Firestore etkinleştirme | `main` |
| 5 | `.env.example`, `.gitignore` düzenleme | `main` |
| 6 | Auth servisi (`authService.ts`), Context (`AuthContext.tsx`), hook (`useAuth.ts`) | `feat/auth-service` → PR #25 → `main` |

---

## 🚀 Çalıştırma

```bash
npm install          # Bağımlılıkları yükle
npm run dev          # http://localhost:3000 (Turbopack)
npm run build        # Production build
npm run start        # Production sunucu
```

> `.env.local` eksikse Firebase bağlantısı çalışmaz. Mevcut credential'lar için Slack'ten veya e-posta ile ekip üyelerinden birine ulaşın.

---

## 📌 Sıradaki Adımlar (Plan)

1. **Route yapısı**: `(auth)` ve `(dashboard)` route grupları, AuthGuard bileşeni, boş sayfa iskeletleri (login, register, dashboard, team/[id])
2. **Firestore servisleri**: `teamService.ts`, `commentService.ts`, `userService.ts`
3. **İş mantığı**: Roller (`roles.ts`), validasyon (`validators.ts`)
4. **Custom hook'lar**: `useTeams.ts`, `useComments.ts`
5. **FCM bildirim altyapısı**: Push notification'lar
6. **Admin paneli**: Ekip oluşturma, üye yönetimi, rol atama
7. **UI/UX**: Tasarım ekibinden gelen Figma çıktılarının entegrasyonu

---

## ⚠️ Next.js 16 Notları

Bu proje Next.js 16.3.0 kullanmaktadır. Eğitim verinizdeki Next.js sürümlerinden farklı olabilir. Kod yazmadan önce `node_modules/next/dist/docs/` dizinindeki ilgili kılavuzları okuyun.
Detaylar için: [`AGENTS.md`](./AGENTS.md)

---

_Doküman: 13 Ağustos 2026_