import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useYouniverseApp } from '../YouniverseApp';

interface MarqueeSloganProps {
  href: string;
  variant?: 'default' | 'newArrivals';
}

export default function MarqueeSlogan({ href, variant = 'default' }: MarqueeSloganProps) {
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
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      tooltipRef.current.style.left = `${x}px`;
      tooltipRef.current.style.top = `${y - 45}px`;
    }
  };

  return (
    <div
      className="relative block w-full overflow-visible border-y border-black bg-[#FAF6EE] py-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onWheel={(e) => e.currentTarget.scrollLeft = 0}
    >
      <div className="relative flex w-full overflow-clip">
        {isNewArrivals ? (
          /* NEW ARRIVALS variant — logo + large text */
          <Link
            href={href}
            className="flex animate-marquee-ltr whitespace-nowrap py-0.5 hover:text-amber-500 focus:outline-none cursor-pointer transition-colors duration-300"
          >
            {[...Array(2)].map((_, setIdx) => (
              <span key={setIdx} className="inline-flex items-center pr-2">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="inline-flex items-center gap-6 px-4">
                    <Image src="/images/logo-youniverse.png" alt="" width={80} height={40} className="h-5 w-auto object-contain" />
                    <span className="font-display text-xs md:text-sm font-black uppercase tracking-widest text-black select-none">
                      New Arrivals
                    </span>
                    <span className="text-black/40">•</span>
                  </span>
                ))}
              </span>
            ))}
          </Link>
        ) : (
          /* Default variant — Unspoken Desires slogan */
          <Link
            href={href}
            className="flex animate-marquee-ltr whitespace-nowrap text-base md:text-lg font-display font-black uppercase tracking-widest text-black py-0.5 hover:text-amber-500 focus:outline-none cursor-pointer transition-colors duration-300"
          >
            <span className="inline-block pr-2">
              {repeats}
            </span>
            <span className="inline-block pr-2">
              {repeats}
            </span>
          </Link>
        )}
      </div>

      {/* Tooltip follows cursor — absolute to container */}
      {isHovered && (
        <div
          ref={tooltipRef}
          className="hidden md:flex absolute pointer-events-none -translate-x-1/2 bg-black/90 backdrop-blur-sm text-amber-400 text-[11px] font-display font-bold uppercase tracking-wider px-5 py-2.5 rounded-full items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-amber-400/20 z-[9999] whitespace-nowrap"
          style={{ left: -999, top: -999 }}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-twinkle" />
          <span>{language === 'vi' ? 'Xem câu chuyện →' : 'Read Our Story →'}</span>
        </div>
      )}
    </div>
  );
}
