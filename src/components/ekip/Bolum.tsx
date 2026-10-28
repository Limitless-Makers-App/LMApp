/** Ekip sayfasındaki bölüm başlığı + içerik sarmalayıcısı. */
export function Bolum({
  baslik,
  children,
}: {
  baslik: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-[34px]">
      <h2 className="font-inter text-card-title font-semibold text-lm-text">{baslik}</h2>
      <div className="mt-[13.8px]">{children}</div>
    </section>
  );
}
