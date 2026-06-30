'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UsecaseSlide {
  image: string;
  title: string;
  desc: string;
}

interface UsecaseCarouselProps {
  slides: UsecaseSlide[];
}

export default function UsecaseCarousel({ slides }: UsecaseCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visibleCount = 4; // Show 4 slides at a time on desktop
  const maxIndex = Math.max(0, slides.length - visibleCount);

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(clamped);
  };

  const handlePrev = () => scrollToIndex(activeIndex - 1);
  const handleNext = () => {
    setActiveIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  // Auto-play: advance every 4s, pause on hover
  useEffect(() => {
    if (hoveredIndex !== null) {
      // Pause autoplay on hover
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }

    autoplayRef.current = setInterval(() => {
      setActiveIndex(prev => prev >= maxIndex ? 0 : prev + 1);
    }, 4000);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [hoveredIndex, maxIndex]);

  // Calculate transform
  const slideWidthPercent = 100 / visibleCount;
  const translateX = -(activeIndex * slideWidthPercent);

  return (
    <div className="relative max-w-[1400px] mx-auto px-4">
      
      {/* Carousel Track */}
      <div className="overflow-hidden rounded-2xl">
        <div
          ref={scrollRef}
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {slides.map((slide, i) => {
            const isHovered = hoveredIndex === i;
            const hasHover = hoveredIndex !== null;

            return (
              <div
                key={i}
                className="flex-shrink-0 px-2"
                style={{ width: `${slideWidthPercent}%` }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ${
                  hasHover && !isHovered ? 'opacity-40 scale-[0.97]' : 'opacity-100 scale-100'
                }`}>
                  
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                  </div>

                  {/* Hover Overlay with Title */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 flex flex-col justify-end p-5 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <h4 className={`font-display text-xl font-extrabold text-white uppercase tracking-wide mb-2 transition-all duration-500 ${
                      isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}>
                      {slide.title}
                    </h4>
                  </div>

                </div>

                {/* Caption below card */}
                <div className={`mt-4 transition-all duration-500 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-0'
                }`}>
                  <h5 className="font-display text-sm font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                    {slide.title}
                  </h5>
                  <p className="font-sans text-white/70 text-xs leading-relaxed line-clamp-3">
                    {slide.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="group w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-amber-400/40 disabled:opacity-20 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 text-white/70 group-hover:text-amber-400 transition-colors" />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'bg-amber-400 w-6'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="group w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-amber-400/40"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-amber-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}
