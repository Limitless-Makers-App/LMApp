interface PlaceholderPageProps {
  title: string;
  description?: string;
}

/**
 * Henüz tasarımı entegre edilmemiş rotalar için geçici içerik.
 * Nav bağlantılarının 404 vermesini engeller.
 */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h1 className="text-hero font-inter font-bold text-lm-text">{title}</h1>
      <p className="mt-[13px] max-w-[420px] font-inter text-label text-lm-muted">
        {description ?? 'Bu sayfanın tasarımı henüz eklenmedi.'}
      </p>
    </div>
  );
}
