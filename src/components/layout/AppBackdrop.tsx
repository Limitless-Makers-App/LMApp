/* eslint-disable @next/next/no-img-element */

/**
 * Figma'daki döndürülmüş degrade blob'ların konumu.
 * Değerler çerçeveye göre yüzde + derece olarak Figma'dan okundu.
 */
const BLOBS = [
  { src: '/figma/bg-1.svg', left: 9.659, top: 63.79, width: 117.14, height: 184.48, rotate: -131.17 },
  { src: '/figma/bg-2.svg', left: 91.89, top: 42.3, width: 113.69, height: 161.61, rotate: -51.48 },
  { src: '/figma/bg-3.svg', left: 75.09, top: 91.75, width: 110.39, height: 154.88, rotate: -106.56 },
  { src: '/figma/bg-4.svg', left: 61.63, top: 6.31, width: 123.91, height: 159.56, rotate: 0 },
  { src: '/figma/bg-5.svg', left: 18.89, top: -0.13, width: 111.55, height: 145.55, rotate: -131.17 },
];

/**
 * Sayfanın arkasındaki zemin: dikey degrade + döndürülmüş blob'lar + karartma perdesi.
 * Tüm auth ve dashboard ekranları bunu paylaşır.
 */
export function AppBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-[#2d2d2d]" />

      {BLOBS.map((blob) => (
        <img
          key={blob.src}
          src={blob.src}
          alt=""
          className="absolute max-w-none"
          style={{
            left: `${blob.left}%`,
            top: `${blob.top}%`,
            width: `${blob.width}%`,
            height: `${blob.height}%`,
            transform: `translate(-50%, -50%) rotate(${blob.rotate}deg)`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[#1a1919]/20" />
    </div>
  );
}
