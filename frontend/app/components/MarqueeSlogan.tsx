import { Sparkles } from 'lucide-react';

interface MarqueeSloganProps {
  onSloganClick: () => void;
}

export default function MarqueeSlogan({ onSloganClick }: MarqueeSloganProps) {
  // Let's build a long line of repeated slogans so there are no empty gaps during the loop.
  const sloganText = "A galaxy to hold, a story to be told • ";
  const repeats = Array(12).fill(sloganText).join(" ");

  return (
    <button
      onClick={onSloganClick}
      title="Khám phá câu chuyện của chúng tôi!"
      className="group relative block w-full overflow-hidden border-y border-stone-200 bg-amber-50/50 py-3.5 focus:outline-none transition-colors duration-300 hover:bg-amber-100/50 cursor-pointer text-left"
    >
      <div className="relative flex w-full overflow-hidden">
        {/* Animated Marquee Inner */}
        <div className="flex animate-marquee whitespace-nowrap text-sm font-display font-black uppercase tracking-widest text-black">
          <span className="inline-block pr-4 flex items-center gap-2">
            {repeats}
            <Sparkles className="h-4 w-4 text-amber-500 animate-twinkle inline scale-120" />
          </span>
          <span className="inline-block pr-4 flex items-center gap-2">
            {repeats}
            <Sparkles className="h-4 w-4 text-blue-500 animate-twinkle inline scale-120" />
          </span>
        </div>
      </div>

      {/* Floating Sparkle Hover Prompt */}
      <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black text-[10px] font-mono tracking-widest font-extrabold text-white px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-md">
        <span>About us page</span>
        <Sparkles className="h-3 w-3 text-yellow-300 animate-spin-slow" />
      </span>
    </button>
  );
}
