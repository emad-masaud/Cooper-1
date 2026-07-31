import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdSliderProps {
  images: string[];
  alt: string;
}

export default function AdSlider({ images, alt }: AdSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = Array.isArray(images) ? images.filter(img => typeof img === 'string' && img.trim() !== '') : [];
  if (!validImages || validImages.length === 0) return null;

  const currentImg = validImages[activeIndex % validImages.length] || '/logo.svg';
  const resolvedSrc = currentImg.startsWith('http') || currentImg.startsWith('/') ? currentImg : `/${currentImg}`;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  return (
    <div className="space-y-4">
      {/* Main image view */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-100 shadow-lg dark:bg-zinc-850">
        <img 
          src={resolvedSrc}
          alt={`${alt} - view ${activeIndex + 1}`}
          className="h-full w-full object-cover object-center transition-all duration-500"
        />

        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition hover:bg-black/60 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition hover:bg-black/60 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Bullet indicators (only if multiple images) */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-xs">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === (activeIndex % validImages.length) ? 'w-4 bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail previews (only if multiple images) */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto py-1">
          {validImages.map((img, index) => {
            const thumbSrc = img.startsWith('http') || img.startsWith('/') ? img : `/${img}`;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-full border-2 transition-all ${
                  index === (activeIndex % validImages.length)
                    ? 'border-primary scale-[1.02] shadow-md' 
                    : 'border-zinc-200/50 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                }`}
              >
                <img 
                  src={thumbSrc}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
