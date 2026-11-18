import React, { useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { api, resolveImageUrl } from "@/lib/api";

const FALLBACK_SLIDES = [
  "https://images.pexels.com/photos/7996793/pexels-photo-7996793.jpeg",
  "https://images.unsplash.com/photo-1604719312566-8912e9227c6a",
  "https://images.pexels.com/photos/27088193/pexels-photo-27088193.jpeg",
];

// Foto slider menjadi latar belakang penuh. Teks dan tombol dari HomePage
// dikirim lewat `children` dan tampil di depan foto.
export default function HeroCarousel({ children }) {
  const [slides, setSlides] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("ll_slides"));
      return Array.isArray(cached) ? cached : [];
    } catch (e) {
      return [];
    }
  });
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: false })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplayRef.current]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    api
      .get("/slides")
      .then((r) => {
        const imgs = (r.data.images || []).filter(Boolean);
        const list = imgs.length ? imgs : FALLBACK_SLIDES;
        setSlides(list);
        try {
          localStorage.setItem("ll_slides", JSON.stringify(list));
        } catch (e) {
          /* abaikan */
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div
      data-testid="hero-carousel"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A8A] to-[#172554] soft-shadow"
    >
      {/* Foto latar. Selama foto belum ada, latar biru tua tetap tampil. */}
      {slides.length > 0 && (
        <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((src, i) => (
              <div key={i} className="relative h-full flex-[0_0_100%]">
                <img
                  src={resolveImageUrl(src)}
                  alt={`Foto toko ${i + 1}`}
                  className="h-full w-full object-cover"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lapisan gelap tipis agar teks putih mudah dibaca di atas foto apa pun */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />

      {/* Isi di depan foto */}
      <div className="pointer-events-none relative z-10 flex min-h-[72vh] flex-col items-center justify-center px-5 py-14 text-center text-white sm:min-h-[560px] lg:min-h-[620px]">
        {children}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
              data-testid={`carousel-dot-${i}`}
              aria-label={`Pergi ke slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === i ? "w-8 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
