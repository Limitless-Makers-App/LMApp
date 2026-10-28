/**
 * Sağ panelde açılan "Galeri" sekmesinin içeriği.
 *
 * Sekme bir route değil; bildirim rayıyla aynı yerde açıldığı için ölçüler
 * ray ile aynı tasarım dilini kullanır (panel genişliği 361.5px, kart
 * yarıçapı 11.1px, kontur `lm-card-border`). İçerik henüz olmadığı için
 * kesikli konturlu yer tutucu gösterilir.
 */
export function GaleriPanel() {
  return (
    <section aria-label="Galeri" className="relative">
      <div className="flex h-[578.1px] items-center justify-center rounded-[11.1px] border-[1.11px] border-dashed border-lm-card-border bg-lm-card px-[20.3px]">
        <p className="text-center font-inter text-panel-date font-normal text-lm-muted">
          Galeri içeriği yakında
        </p>
      </div>
    </section>
  );
}
