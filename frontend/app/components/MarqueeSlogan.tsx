import { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useYouniverseApp } from '../YouniverseApp';

interface MarqueeSloganProps {
  onSloganClick: () => void;
  variant?: 'default' | 'newArrivals';
}

export default function MarqueeSlogan({ onSloganClick, variant = 'default' }: MarqueeSloganProps) {
  const { language } = useYouniverseApp();
  
  const isNewArrivals = variant === 'newArrivals';

  // Repeated text to form a continuous infinite ribbon without gaps
  const sloganText = "Unspoken Desires, Bespoke YOUniverse • ✦ • ";
  const repeats = Array(12).fill(sloganText).join(" ");
  
  // Ref-based tooltip cursor following for zero React re-renders!
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipRef.current) {
      // Estimate tooltip width to prevent it from going off the screen edges
      const estimatedTooltipHalfWidth = 120; // 240px total width / 2
      const padding = 16; // Safety margin from screen edge
      
      // Clamp the X coordinate within the viewport boundaries
      const minX = estimatedTooltipHalfWidth + padding;
      const maxX = window.innerWidth - (estimatedTooltipHalfWidth + padding);
      const clampedX = Math.max(minX, Math.min(maxX, e.clientX));

      tooltipRef.current.style.transform = `translate3d(${clampedX}px, ${e.clientY + 18}px, 0) translate3d(-50%, 0, 0)`;
    }
  };

  return (
    <div
      className="relative block w-full overflow-hidden border-y border-black bg-[#FAF6EE] py-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="relative flex w-full overflow-hidden">
        {isNewArrivals ? (
          /* NEW ARRIVALS variant — logo + large text */
          <button
            onClick={onSloganClick}
            className="flex animate-marquee-ltr whitespace-nowrap py-0.5 hover:text-amber-500 focus:outline-none cursor-pointer transition-colors duration-300"
          >
            {[...Array(2)].map((_, setIdx) => (
              <span key={setIdx} className="inline-flex items-center pr-2">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="inline-flex items-center gap-6 px-4">
                    <img src="/images/logo-youniverse.png" alt="YOUniverse" className="h-5 w-auto object-contain" />
                    <span className="font-display text-base md:text-lg font-black uppercase tracking-widest text-black select-none">
                      New Arrivals
                    </span>
                    <span className="text-black/40">•</span>
                  </span>
                ))}
              </span>
            ))}
          </button>
        ) : (
          /* Default variant — Unspoken Desires slogan */
          <button
            onClick={onSloganClick}
            className="flex animate-marquee-ltr whitespace-nowrap text-base md:text-lg font-display font-black uppercase tracking-widest text-black py-0.5 hover:text-amber-500 focus:outline-none cursor-pointer transition-colors duration-300"
          >
            <span className="inline-block pr-2">
              {repeats}
            </span>
            <span className="inline-block pr-2">
              {repeats}
            </span>
          </button>
        )}
      </div>

      {/* Premium custom tooltip that follows the mouse cursor (Desktop only) */}
      {isHovered && (
        <div
          ref={tooltipRef}
          className="hidden md:flex fixed pointer-events-none bg-black text-white text-[10px] md:text-xs font-sans font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-stone-800 z-[9999] whitespace-nowrap will-change-transform transform-gpu"
          style={{
            left: 0,
            top: 0,
            transform: 'translate3d(-999px, -999px, 0) translate3d(-50%, 0, 0)',
          }}
        >
          <span>{language === 'vi' ? 'Xem câu chuyện của chúng mình →' : 'Read Our Story →'}</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-twinkle" />
        </div>
      )}
    </div>
  );
}
