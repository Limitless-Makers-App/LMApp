# Figma Tasarımlarını LMApp'e Entegre Etme Planı

## Context

Kullanıcı, Limitless Makers App (LMApp) için Figma'da hazırlanmış tasarımları mevcut kod tabanına entegre etmek istiyor. Proje şu anda Next.js 16.3.0 + Firebase Auth + Firestore altyapısına sahip ancak **hiçbir tasarım sistemi veya görsel kimlik tanımlı değil** — sadece Tailwind varsayılanları kullanılıyor. Figma MCP (Model Context Protocol) sayesinde Figma'daki değişkenleri, bileşenleri ve sayfa tasarımlarını okuyup kod üretebileceğiz.

**Kullanıcı tercihleri:**
- Figma MCP'ye **Plugin ile (OAuth)** bağlanmak istiyor
- Çoğu sayfanın tasarımı hazır (login, register, dashboard, ekip listesi, ekip detay)
- Figma'da design system var mı bilinmiyor — keşfederek öğreneceğiz

---

## Aşama 0: Figma MCP Kurulumu

### 0.1 Plugin Ekleme

```bash
claude plugin install figma@claude-plugins-official
```

### 0.2 Kimlik Doğrulama

```bash
# Claude Code içinde:
/plugin figma
# → Tarayıcıda OAuth akışı açılır, Figma hesabına bağlanır
```

### 0.3 Figma Dosya Anahtarını Alma

Kullanıcıdan Figma dosya linkini al: `https://www.figma.com/file/XXXXX/...`
Buradaki `XXXXX` dosya anahtarı.

---

## Aşama 1: Keşif (Figma'dan Veri Çekme)

Figma MCP'nin sağladığı araçlarla sırayla:

### 1.1 Sayfa Yapısını Keşfet
- `get_metadata({})` → tüm sayfaların isimleri ve ID'leri

### 1.2 Tasarım Token'larını Çıkar
- `get_variable_defs({})` → renkler, tipografi, spacing, radius değişkenleri

### 1.3 Her Sayfanın Ekran Görüntüsünü Al
- `get_screenshot({ nodeId: "..." })` → her sayfa için görsel referans

### 1.4 Her Sayfanın Tasarım Kodunu Al (Referans Olarak)
- `get_design_context({ nodeId: "..." })` → React + Tailwind kodu çıktısı
- Bu çıktıyı **referans** olarak kullan, birebir kopyalama

### 1.5 Design System Varlığını Kontrol Et
- `search_design_system({ queries: ["button", "input", "card"] })`

### 1.6 İkonları Çek
- `download_assets({ nodes: [...], defaultFormat: "SVG" })` → özel ikonlar

---

## Aşama 2: Tasarım Token Sistemi

### 2.1 CSS Değişkenleri + Tailwind v4 Tema (`globals.css`)

**Dosya:** `src/app/globals.css` — tamamen yeniden yazılacak

**Yapı:**
- `:root {}` → light tema değişkenleri (bg, text, border, shadow, radius)
- `:root.dark {}` → dark tema (class-based, media query değil)
- `@theme inline {}` → Tailwind utility class'ları (`bg-surface`, `text-primary`, vb.)
- Figma'dan gelen gerçek değerlerle doldurulacak

**Örnek yapı:**
```css
@import "tailwindcss";

:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a2e;
  --border-primary: #e5e7eb;
  /* ... Figma'dan çekilen değerler */
}

:root.dark {
  --bg-primary: #0a0a0a;
  /* ... dark mod değerleri */
}

@theme inline {
  --color-brand-500: #3b82f6;
  --color-primary: var(--color-brand-500);
  --color-surface: var(--bg-primary);
  /* ... Tailwind utility mapping'leri */
}
```

### 2.2 Root Layout Güncelleme (`layout.tsx`)

**Dosya:** `src/app/layout.tsx`
- Dark mode başlatma script'i ekle (`prefers-color-scheme` oku, `<html>`'e `dark` class'ı ekle)
- Figma'da farklı bir font varsa `next/font/google` ile ekle

### 2.3 cn() Utility

**Dosya:** `src/lib/utils.ts`
```ts
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
```

---

## Aşama 3: Bileşen Kütüphanesi

### 3.1 UI Bileşenleri (`src/components/ui/`)

Her bileşen:
- `className` prop'u almalı
- TypeScript interface'i olmalı
- Tasarım token'larını kullanmalı (örn. `bg-brand-500`, `text-surface`)
- `'use client'` direktifi (state/hook kullanıyorsa)

| # | Bileşen | Dosya | Notlar |
|---|---------|-------|--------|
| 1 | `Button` | `src/components/ui/Button.tsx` | Variants: primary, secondary, ghost, danger. Sizes: sm, md, lg |
| 2 | `Input` | `src/components/ui/Input.tsx` | forwardRef, label, error, helperText |
| 3 | `Card` | `src/components/ui/Card.tsx` | Variants, padding prop |
| 4 | `Alert` | `src/components/ui/Alert.tsx` | error, success, warning, info |
| 5 | `Spinner` | `src/components/ui/Spinner.tsx` | Sizes, optional label |
| 6 | `Avatar` | `src/components/ui/Avatar.tsx` | Fotoğraf → initial fallback |
| 7 | `Badge` | `src/components/ui/Badge.tsx` | Rol/etiket göstergesi |
| 8 | `EmptyState` | `src/components/ui/EmptyState.tsx` | Başlık + açıklama + aksiyon |
| 9 | `PageHeader` | `src/components/ui/PageHeader.tsx` | Sayfa başlığı + aksiyon slot'u |

### 3.2 Özel Bileşenler

| Bileşen | Dosya | Açıklama |
|---------|-------|----------|
| `DashboardLayout` | `src/components/layout/DashboardLayout.tsx` | Sidebar/topnav + AuthGuard |
| `TeamCard` | `src/components/teams/TeamCard.tsx` | Ekip kartı (list görünümü) |

### 3.3 İkonlar

- Figma özel ikonları varsa → `src/components/icons/` altında SVG wrapper'lar
- Google SVG → `src/components/icons/IconGoogle.tsx` (mevcut inline SVG'yi taşı)
- Gerekirse `npm install lucide-react` ekle (opsiyonel)

---

## Aşama 4: Sayfa Migrasyonu (Sıralı)

Her sayfa Figma'daki tasarıma göre yeniden yazılacak. **Önce token sistemi, sonra UI bileşenleri, sonra sayfalar.**

### 4.1 Auth Layout (`(auth)/layout.tsx`)
- Figma'daki auth sayfası düzenini uygula (split-screen, card, vb.)
- Token tabanlı stiller kullan

### 4.2 Login Sayfası (`(auth)/login/page.tsx`)
- Input, Button, Alert bileşenlerini kullan
- Google ikonunu IconGoogle'a taşı
- Figma'daki form düzenini yansıt

### 4.3 Register Sayfası (`(auth)/register/page.tsx`)
- Login ile aynı pattern, displayName alanı eklenmiş

### 4.4 Dashboard Layout (`(dashboard)/layout.tsx`)
- DashboardLayout bileşenine taşı
- Sidebar/nav varsa ekle
- Responsive davranış

### 4.5 Dashboard Ana Sayfa (Ekip Listesi) (`(dashboard)/page.tsx`)
- TeamCard bileşeni ile ekip listesi
- Arama/filtre varsa ekle
- EmptyState, Spinner, skeleton yükleme

### 4.6 Ekip Detay Sayfası (`(dashboard)/ekip/[id]/page.tsx`)
- Ekip başlığı, badge, üye listesi
- Yorum/aktivite alanı (placeholder)
- Aksiyon butonları

### 4.7 Şifre Sıfırlama Sayfası (Figma'da varsa)
- `(auth)/sifre-sifirla/page.tsx`

### 4.8 Profil Sayfası (Figma'da varsa)
- `(dashboard)/profil/page.tsx`

---

## Branch Stratejisi

`feat/auth-service`'ten fork'lanacak branch'ler:

```
feat/auth-service
├── feat/design-tokens        # Aşama 2 – Token sistemi
├── feat/ui-components         # Aşama 3 – Bileşenler
├── feat/page-login            # Aşama 4.1–4.3 – Auth sayfaları
├── feat/page-dashboard        # Aşama 4.4–4.5 – Dashboard + ekip listesi
├── feat/page-team-detail      # Aşama 4.6 – Ekip detay
└── feat/design-complete       # Son birleştirme
```

Sıralı merge: Her branch `feat/auth-service`'e merge edilir, bir sonraki bağımlılık beklenir.

---

## Doğrulama

Her sayfa migrasyonundan sonra:

### Görsel
- [ ] Figma ekran görüntüsüyle canlı sayfa yan yana karşılaştır
- [ ] Renkler eşleşiyor (hex değerleri kontrol)
- [ ] Tipografi eşleşiyor (font, size, weight, line-height)
- [ ] Spacing/padding/margin eşleşiyor
- [ ] Border-radius eşleşiyor
- [ ] Responsive davranış doğru

### Fonksiyonel
- [ ] Login/register akışı çalışıyor
- [ ] Form validasyonu çalışıyor
- [ ] Navigasyon linkleri doğru
- [ ] Dark mode geçişi çalışıyor
- [ ] Loading/empty/error state'leri düzgün

### Kod Kalitesi
- [ ] TypeScript strict mode geçiyor
- [ ] `npm run lint` temiz
- [ ] `npm run build` başarılı
- [ ] Tekrar eden Tailwind class'ları yok (bileşenler kullanılıyor)
- [ ] Tasarım token'ları kullanılıyor (hardcoded hex yok)

---

## Kritik Dosyalar

**Sıfırdan oluşturulacak:**
- `src/lib/utils.ts`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Alert.tsx`
- `src/components/ui/Spinner.tsx`
- `src/components/ui/Avatar.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/PageHeader.tsx`
- `src/components/icons/IconGoogle.tsx`
- `src/components/layout/DashboardLayout.tsx`
- `src/components/teams/TeamCard.tsx`
- `docs/DESIGN_TOKENS.md`

**Değiştirilecek:**
- `src/app/globals.css` — tamamen yeniden yaz
- `src/app/layout.tsx` — tema başlatma
- `src/app/(auth)/layout.tsx` — token tabanlı stil
- `src/app/(auth)/login/page.tsx` — yeniden yaz
- `src/app/(auth)/register/page.tsx` — yeniden yaz
- `src/app/(dashboard)/layout.tsx` — DashboardLayout'a devret
- `src/app/(dashboard)/page.tsx` — ekip listesi
- `src/app/(dashboard)/ekip/[id]/page.tsx` — ekip detay