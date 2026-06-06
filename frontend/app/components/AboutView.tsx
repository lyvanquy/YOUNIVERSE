import { Star, Quote, Eye, Flame, Sparkles } from 'lucide-react';
import { CORE_VALUES } from '../data';
import { PageType } from '../types';

interface AboutViewProps {
  onNavigate: (page: PageType) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div className="pb-24 space-y-20 text-stone-800" id="about-us-view">
      
      {/* 1. Page Header Block */}
      <section className="relative overflow-hidden bg-stone-50 py-16 px-4">
        {/* Abstract space glow background */}
        <div className="absolute inset-0 cosmic-banner-glow pointer-events-none" />
        <div className="absolute bottom-4 left-1/3 text-amber-300 animate-twinkle">✦</div>
        <div className="absolute top-4 right-1/4 text-red-400 animate-twinkle duration-1000">✦</div>

        <div className="mx-auto max-w-7xl text-center space-y-4 relative z-10">
          <span className="bg-black text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full">
            Our Story & Values
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-black uppercase">
            ABOUT YOUNIVERSE
          </h1>
          <p className="font-sans text-stone-500 text-sm max-w-xl mx-auto leading-relaxed">
            A project weaving unique identity and aesthetics from UEH.ISB. Championing the right to be yourself for everyone.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left info box (Big Headline) */}
          <div className="lg:col-span-5 space-y-4 text-left lg:sticky lg:top-28">
            <span className="text-[10px] font-mono font-black uppercase text-amber-500 tracking-widest block">
              01 / The Inspiration
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-black uppercase tracking-tight leading-tight">
              From cookie-cutter molds to a free universe.
            </h2>
            <div className="h-1 w-20 bg-black mt-4" />
            
            {/* Ambient ornament graphics background */}
            <div className="hidden lg:block pt-10">
              <div className="p-4 border-2 border-stone-200 border-dashed rounded-2xl bg-stone-50 flex items-center space-x-3 text-stone-500">
                <Quote className="h-8 w-8 text-amber-500 shrink-0" />
                <p className="text-[11px] font-mono leading-relaxed">
                  &ldquo;We long to break rigid stereotypes, allowing Gen Z to express their truest, most authentic selves.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right info text paragraph */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="relative bg-white border-2 border-black rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              
              <div className="absolute top-4 right-4 text-stone-200 font-display text-7xl font-bold select-none pointer-events-none">
                UEH
              </div>
              
              <div className="space-y-6 text-stone-600 text-sm leading-relaxed font-sans">
                <p className="first-letter:text-4xl first-letter:font-extrabold first-letter:text-black first-letter:mr-2 first-letter:float-left">
                  Originating from a passionate team at <strong className="text-black font-semibold">UEH.ISB</strong>, YOUniverse was born out of a question that kept us restless: Gen Z's inner world is vibrant and multi-faceted, so why do we have to constrain ourselves to generic, mass-produced accessories?
                </p>
                
                <p>
                  YOUniverse was created to completely break those boundaries. We present you with an infinite space for creativity: a miniature &quot;universe&quot; where each sparkling, starry charm speaks for you in the most authentic way possible.
                </p>
                
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 font-mono text-xs text-stone-800">
                  ⚡ Without saying a single word, the world around you will immediately know who you are, what passions you carry, and how unique your identity truly is.
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3 & 4. Our Mission & Our Vision (Bento layout layout) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-blue-50/40 to-white border-2 border-black p-8 rounded-3xl text-left space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/5 rounded-bl-full group-hover:scale-110 duration-500 pointer-events-none" />
            
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-blue-500 text-white rounded-xl">
                <Flame className="h-5 w-5 animate-pulse" />
              </span>
              <h3 className="font-display text-xl font-extrabold text-black uppercase tracking-tight">
                Our Mission
              </h3>
            </div>
            
            <p className="font-sans text-stone-700 text-sm leading-relaxed">
              The mission of YOUniverse is not just to sell standard accessories. We sell <strong className="text-black font-bold">&ldquo;the right to be yourself&rdquo;</strong>. By creating highly symbolic charm lines, we help you carry your simple hobbies and reliable spiritual anchors wherever you go.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-gradient-to-br from-amber-50/40 to-white border-2 border-black p-8 rounded-3xl text-left space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-20 w-20 bg-amber-500/5 rounded-bl-full group-hover:scale-110 duration-500 pointer-events-none" />

            <div className="flex items-center space-x-3">
              <span className="p-2 bg-amber-500 text-white rounded-xl">
                <Eye className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl font-extrabold text-black uppercase tracking-tight">
                Our Vision
              </h3>
            </div>

            <p className="font-sans text-stone-700 text-sm leading-relaxed">
              We aim to become the leading personalized accessory brand for Gen Z, founded and owned by <strong className="text-black font-bold">UEH.ISB-ers</strong>. We aspire to be an inspiring lifestyle gift brand, empowering every customer to confidently depict their independent individual signature.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Our Core Values (3 columns) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono font-black uppercase text-amber-500 tracking-widest block">
            02 / Core Philosophy
          </span>
          <h2 className="font-display text-3xl font-extrabold text-black uppercase tracking-tight">
            Our Core Values (Y.O.U)
          </h2>
          <p className="font-sans text-stone-500 text-xs max-w-sm mx-auto">
            Core values that construct the soul of our cosmic jewelry styling.
          </p>
        </div>

        {/* 3 Column Grid of Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORE_VALUES.map((val) => {
            // Give specific letters distinct layout designs (Y: Blue, O: Yellow, U: Red)
            const colorSetup = val.letter === 'Y' 
              ? { text: 'text-blue-500', glow: 'bg-blue-500/5', border: 'border-blue-100 hover:border-blue-400', mark: 'bg-blue-500' }
              : val.letter === 'O'
              ? { text: 'text-amber-500', glow: 'bg-amber-500/5', border: 'border-amber-100 hover:border-amber-400', mark: 'bg-amber-500' }
              : { text: 'text-red-500', glow: 'bg-rose-500/5', border: 'border-rose-100 hover:border-rose-400', mark: 'bg-red-500' };

            return (
              <div
                key={val.letter}
                className={`relative bg-white border-2 rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 group shadow-sm ${colorSetup.border}`}
              >
                {/* Decorative Giant background letter */}
                <span className="absolute -top-6 -right-2 text-stone-100 font-display text-[150px] font-black select-none pointer-events-none group-hover:scale-110 group-hover:text-stone-200/60 duration-500">
                  {val.letter}
                </span>

                <div className="space-y-4 relative z-10 text-left">
                  <div className="flex items-center space-x-2">
                    <span className={`h-8 w-8 rounded-full ${colorSetup.text} ${colorSetup.glow} flex items-center justify-center font-display text-lg font-black`}>
                      {val.letter}
                    </span>
                    <h3 className="font-display text-lg font-extrabold text-black tracking-tight uppercase">
                      {val.title}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-display text-xs font-bold text-stone-900 uppercase tracking-widest">
                      {val.subtitle}
                    </h4>
                    <p className={`font-mono text-[11px] font-bold ${colorSetup.text}`}>
                      {val.vietnameseTitle}
                    </p>
                  </div>

                  <p className="font-sans text-stone-500 text-xs leading-relaxed pt-2 border-t border-stone-100">
                    {val.description}
                  </p>
                </div>

                {/* Star icon decoration */}
                <div className="flex justify-end pt-4 relative z-10">
                  <Star className={`h-4 w-4 ${colorSetup.text} animate-twinkle opacity-30 group-hover:opacity-100`} />
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 6. Active Call-to-Action (CTA Section) */}
      <section className="mx-auto max-w-4xl px-4 text-center">
        <div className="bg-black text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col items-center space-y-6 shadow-xl border-4 border-stone-100">
          
          <div className="absolute inset-0 bg-stone-900/30 opacity-60 pointer-events-none" />
          <div className="absolute top-4 left-4 text-amber-400 text-xl animate-twinkle">✦</div>
          <div className="absolute bottom-6 right-6 text-blue-400 text-lg animate-twinkle duration-2000">✦</div>

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold block">
              Make Your Own Set
            </span>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-white uppercase leading-tight max-w-xl mx-auto">
              So are you ready to create your own universe?
            </h3>
            <p className="font-sans text-stone-400 text-xs max-w-sm mx-auto">
              Click below to explore our products catalog and check out our custom-crafted charms!
            </p>
          </div>

          {/* Button "nhấn vào thì ra trang chi tiết sản phẩm" */}
          <button
            id="cta-about-btn"
            onClick={() => onNavigate('products')}
            className="relative z-10 w-full sm:w-auto rounded-full bg-white hover:bg-stone-100 text-black font-display text-xs font-black tracking-widest uppercase px-8 py-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 text-center flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Explore Products Now</span>
            <Sparkles className="h-4 w-4 text-amber-500 animate-twinkle" />
          </button>

        </div>
      </section>

    </div>
  );
}
