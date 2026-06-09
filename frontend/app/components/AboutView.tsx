import { useState, useEffect, useRef } from 'react';
import { Star, Quote, Eye, Flame, Sparkles, Phone } from 'lucide-react';
import { CORE_VALUES, TEAM_MEMBERS } from '../data';
import { useYouniverseApp } from '../YouniverseApp';
import { translations } from '../locales';

interface AboutViewProps {
  onGoProducts: () => void;
}

export default function AboutView({ onGoProducts }: AboutViewProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const { language } = useYouniverseApp();
  const t = translations[language];
  
  // Ref-based cursor following for 120 FPS performance (zero React re-renders!)
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('about-us-view');
      if (container && glowRef.current) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // GPU-accelerated translate3d for smooth animations
        glowRef.current.style.transform = `translate3d(${x - 175}px, ${y - 175}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pb-24 space-y-24 text-stone-800 relative overflow-hidden" id="about-us-view">
      
      {/* Technical Background Mesh Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      
      {/* Blurred Floating Accent energy blobs */}
      <div className="absolute top-[30%] left-[-15%] w-[400px] h-[400px] rounded-full bg-blue-500/3 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute top-[60%] right-[-15%] w-[400px] h-[400px] rounded-full bg-amber-500/3 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow duration-5000" />

      {/* Interactive Mouse-Follow Glow Halo (Desktop only) */}
      <div 
        ref={glowRef}
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0 blur-[85px] opacity-35 hidden md:block will-change-transform transform-gpu"
        style={{
          left: 0,
          top: 0,
          transform: 'translate3d(-999px, -999px, 0)',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)',
        }}
      />

      {/* 1. Page Header Block */}
      <section className="relative overflow-hidden h-48 sm:h-64 cursor-default rounded-3xl mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto mt-6 shadow-sm border border-stone-850 bg-black flex items-center justify-center z-10">
        {/* Banner background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/banner-about-us.png" 
            alt="YOUniverse About Us Banner" 
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/70" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        </div>

        {/* Technical Corner Markers */}
        <div className="absolute top-4 left-6 hidden sm:block font-mono text-[8px] text-stone-500 uppercase tracking-widest pointer-events-none select-none z-10">
          [ 10.7626° N, 106.6602° E // HCMC_NODE ]
        </div>

        <div className="mx-auto max-w-xl text-center space-y-3 relative z-10 px-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
            {t.aboutBannerTitle}
          </h1>
          <p className="font-sans text-stone-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {t.aboutBannerDesc}
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left info box (Big Headline) */}
          <div className="lg:col-span-5 space-y-4 text-left lg:sticky lg:top-28">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-black uppercase tracking-tight leading-tight">
              {t.storyTitle}
            </h2>
            <div className="h-1 w-20 bg-amber-500 mt-4 rounded animate-pulse-glow" />
            
            {/* Ambient ornament graphics background */}
            <div className="hidden lg:block pt-10">
              <div className="relative p-6 border border-stone-200/60 rounded-2xl bg-white/85 backdrop-blur-md flex items-center space-x-4 text-stone-600 shadow-sm transition-all duration-300 hover:shadow-md hover:border-amber-200">
                
                {/* Rotating orbit path */}
                <div className="absolute inset-0 border border-dashed border-stone-150/80 rounded-2xl pointer-events-none animate-pulse-glow" />
                
                <Quote className="h-7 w-7 text-amber-500 shrink-0 animate-float" />
                <p className={`text-[11px] ${language === 'vi' ? 'font-sans' : 'font-mono'} leading-relaxed text-stone-600 text-left`}>
                   {t.quoteText}
                 </p>
                {/* Decorative stars */}
                <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-amber-400 animate-twinkle" />
              </div>
            </div>
          </div>

          {/* Right info text paragraph */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="relative bg-white/85 border border-stone-200/60 rounded-3xl p-6 md:p-10 shadow-sm hover:shadow-[0_12px_35px_-5px_rgba(0,0,0,0.04)] hover:border-stone-350 transition-all duration-500 backdrop-blur-md overflow-hidden group">
              
              {/* Subtle Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

              <div className="absolute top-4 right-4 text-stroke-current text-stone-200/40 font-display text-8xl font-black select-none pointer-events-none transition-all duration-700 group-hover:text-amber-500/25 group-hover:scale-105 z-0">
                UEH
              </div>
              
              <div className="space-y-6 text-stone-600 text-sm leading-relaxed font-sans relative z-10">
                <p className="first-letter:text-4xl first-letter:font-extrabold first-letter:text-black first-letter:mr-2 first-letter:float-left">
                  {t.storyDesc}
                </p>
                
                <p>
                  {t.storyDesc2}
                </p>
                
                 <div className={`p-4 bg-stone-50/80 rounded-2xl border border-stone-200/80 ${language === 'vi' ? 'font-sans' : 'font-mono'} text-xs text-stone-850 flex items-center space-x-2`}>
                   <span className="text-amber-500 animate-pulse">⚡</span>
                   <span>{t.storyTip}</span>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3 & 4. Our Mission & Our Vision (Bento layout layout with flowing gradient borders) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="group relative rounded-3xl transition-all duration-500 hover:-translate-y-1.5 cursor-default flex flex-col justify-between hover:shadow-[0_20px_45px_-5px_rgba(59,130,246,0.12)]">
            {/* Flowing Gradient Border (on hover) */}
            <div className="absolute -inset-[1.5px] rounded-[25px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-flow-gradient" />
            
            {/* Inner Card Background Mask */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-50/10 via-white to-white border border-stone-200/80 z-10 pointer-events-none group-hover:border-transparent transition-all duration-500" />

            {/* Content Wrapper */}
             <div className="relative z-20 p-8 space-y-4">
              <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/5 rounded-bl-full pointer-events-none z-0" />
              
              <div className="flex items-center space-x-3 relative z-10">
                <span className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center">
                  <Flame className="h-5 w-5 animate-pulse" />
                </span>
                <h3 className="font-display text-xl font-extrabold text-black uppercase tracking-tight">
                  {t.missionTitle}
                </h3>
              </div>
              
              <p className="font-sans text-stone-700 text-sm leading-relaxed relative z-10">
                {t.missionDesc}
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative rounded-3xl transition-all duration-500 hover:-translate-y-1.5 cursor-default flex flex-col justify-between hover:shadow-[0_20px_45px_-5px_rgba(234,179,8,0.12)]">
            {/* Flowing Gradient Border (on hover) */}
            <div className="absolute -inset-[1.5px] rounded-[25px] bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-flow-gradient" />
            
            {/* Inner Card Background Mask */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-50/10 via-white to-white border border-stone-200/80 z-10 pointer-events-none group-hover:border-transparent transition-all duration-500" />

            {/* Content Wrapper */}
             <div className="relative z-20 p-8 space-y-4">
              <div className="absolute top-0 right-0 h-20 w-20 bg-amber-500/5 rounded-bl-full pointer-events-none z-0" />

              <div className="flex items-center space-x-3 relative z-10">
                <span className="p-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl flex items-center justify-center">
                  <Eye className="h-5 w-5 animate-float" />
                </span>
                <h3 className="font-display text-xl font-extrabold text-black uppercase tracking-tight">
                  {t.visionTitle}
                </h3>
              </div>

              <p className="font-sans text-stone-700 text-sm leading-relaxed relative z-10">
                {t.visionDesc}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Our Core Values (3 columns with premium letter hover mechanics) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl font-extrabold text-black uppercase tracking-tight">
            {t.coreValuesTitle}
          </h2>
          <p className="font-sans text-stone-500 text-xs max-w-sm mx-auto">
            {t.coreValuesDesc}
          </p>
        </div>

        {/* 3 Column Grid of Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CORE_VALUES.map((val) => {
            // Give specific letters distinct layout designs (Y: Blue, O: Yellow, U: Red)
            const colorSetup = val.letter === 'Y' 
              ? { 
                  text: 'text-blue-500', 
                  glow: 'bg-blue-500/5', 
                  border: 'border-stone-200/80 hover:border-blue-200/80', 
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)]', 
                  strokeClass: 'text-stroke-current text-blue-200/30 group-hover:text-blue-500/50',
                  gradient: 'from-blue-400 via-indigo-400 to-cyan-400'
                }
              : val.letter === 'O'
              ? { 
                  text: 'text-amber-500', 
                  glow: 'bg-amber-500/5', 
                  border: 'border-stone-200/80 hover:border-amber-200/80', 
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(234,179,8,0.1)]', 
                  strokeClass: 'text-stroke-current text-amber-200/30 group-hover:text-amber-500/50',
                  gradient: 'from-amber-400 via-yellow-400 to-orange-500'
                }
              : { 
                  text: 'text-rose-500', 
                  glow: 'bg-rose-500/5', 
                  border: 'border-stone-200/80 hover:border-rose-200/80', 
                  hoverShadow: 'hover:shadow-[0_20px_40px_rgba(244,63,94,0.1)]', 
                  strokeClass: 'text-stroke-current text-rose-200/30 group-hover:text-rose-500/50',
                  gradient: 'from-rose-400 via-red-500 to-pink-505'
                };

            // Load translated titles and text dynamically based on val.letter (Y, O, U)
            const transTitle = val.letter === 'Y' ? t.coreYTitle : val.letter === 'O' ? t.coreOTitle : t.coreUTitle;
            const transSubtitle = val.letter === 'Y' ? t.coreYSubtitle : val.letter === 'O' ? t.coreOSubtitle : t.coreUSubtitle;
            const transHighlight = val.letter === 'Y' ? t.coreYHighlight : val.letter === 'O' ? t.coreOHighlight : t.coreUHighlight;
            const transDesc = val.letter === 'Y' ? t.coreYDesc : val.letter === 'O' ? t.coreODesc : t.coreUDesc;

            return (
              <div
                key={val.letter}
                className={`group relative rounded-[28px] transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between cursor-default ${colorSetup.hoverShadow}`}
              >
                {/* Flowing Gradient Border (on hover) */}
                <div className={`absolute -inset-[1.5px] rounded-[29px] bg-gradient-to-r ${colorSetup.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-flow-gradient`} />
                
                {/* Inner Card Background Mask */}
                <div className="absolute inset-0 rounded-[28px] bg-white border border-stone-200/60 z-10 pointer-events-none group-hover:border-transparent transition-all duration-500" />

                {/* Content Wrapper */}
                <div className="relative z-20 p-6 md:p-8 flex flex-col justify-between h-full w-full">
                  {/* Decorative Giant background letter */}
                  <span className={`absolute -top-6 -right-2 font-display text-[150px] font-black select-none pointer-events-none transition-all duration-550 group-hover:scale-108 group-hover:rotate-6 ${colorSetup.strokeClass}`}>
                    {val.letter}
                  </span>

                  <div className="space-y-4 text-left">
                    <div className="flex items-center space-x-2">
                      <span className={`h-8 w-8 rounded-full ${colorSetup.text} ${colorSetup.glow} flex items-center justify-center font-display text-lg font-black`}>
                        {val.letter}
                      </span>
                      <h3 className="font-display text-lg font-extrabold text-black tracking-tight uppercase">
                        {transTitle}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-display text-xs font-bold text-stone-900 uppercase tracking-widest">
                        {transSubtitle}
                      </h4>
                      <p className={`${language === 'vi' ? 'font-sans' : 'font-mono'} text-[11px] font-bold ${colorSetup.text}`}>
                        {transHighlight}
                      </p>
                    </div>

                    <p className="font-sans text-stone-500 text-xs leading-relaxed pt-2 border-t border-stone-100">
                      {transDesc}
                    </p>
                  </div>

                  {/* Star icon decoration */}
                  <div className="flex justify-end pt-4">
                    <Star className={`h-4 w-4 ${colorSetup.text} animate-twinkle opacity-30 group-hover:opacity-100`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        <div className="text-center space-y-3 relative max-w-md mx-auto py-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
          
          <h2 className="font-display text-3xl font-extrabold text-black uppercase tracking-tight relative inline-block">
            {t.meetTeamTitle}
            <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-amber-400 to-rose-500 rounded-full" />
          </h2>
          <p className="font-sans text-stone-500 text-xs max-w-xs mx-auto leading-relaxed pt-1.5">
            {t.meetTeamDesc}
          </p>
        </div>

        {/* Desktop Layout: Overlapping Fan-Out Card Deck */}
        <div className="hidden md:flex flex-row items-stretch justify-center w-full max-w-6xl mx-auto h-[440px] py-6 relative z-20">
          
          {/* Cosmic background ornaments behind the cards deck */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Ambient soft glow */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-gradient-to-r from-blue-400/5 via-amber-400/5 to-rose-400/5 blur-[90px] animate-pulse-glow" />
            
            {/* Orbit lines */}
            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-[950px] h-[320px] rounded-full border border-dashed border-stone-200/50 opacity-80" />
            <div className="absolute top-[70%] left-1/2 -translate-x-1/2 w-[750px] h-[220px] rounded-full border border-dashed border-stone-200/35 opacity-60" />

            {/* Twinkling background stars */}
            <div className="absolute top-8 left-[8%] text-amber-400 animate-twinkle opacity-65"><Sparkles className="h-4 w-4" /></div>
            <div className="absolute top-16 right-[10%] text-blue-400 animate-twinkle duration-2000 opacity-55"><Star className="h-3.5 w-3.5" /></div>
            <div className="absolute bottom-20 left-[3%] text-rose-400 animate-twinkle duration-1500 opacity-45"><Sparkles className="h-3.5 w-3.5" /></div>
            <div className="absolute bottom-10 right-[6%] text-purple-400 animate-twinkle duration-3000 opacity-65"><Star className="h-4 w-4" /></div>
          </div>

          {TEAM_MEMBERS.map((member, index) => {
            const nameToUse = language === 'vi' ? member.nameVi : member.name;
            const cleanName = nameToUse.replace(/^(Mr\.|Ms\.|Anh|Chị)\s+/i, '');
            const nameParts = cleanName.split(' ');
            const initials = nameParts.length >= 2 
              ? `${nameParts[nameParts.length - 2][0]}${nameParts[nameParts.length - 1][0]}` 
              : nameParts[0].substring(0, 2);
            const shortName = nameParts[nameParts.length - 1]; // e.g. "Chi", "Dang", "Thu"

            const theme = [
              {
                text: 'text-blue-500',
                gradient: 'from-blue-500 via-cyan-400 to-indigo-500',
                badgeText: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
                bg: 'bg-blue-50/50 border border-blue-200/50'
              },
              {
                text: 'text-amber-500',
                gradient: 'from-amber-400 via-yellow-400 to-orange-500',
                badgeText: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
                bg: 'bg-amber-50/50 border border-amber-200/50'
              },
              {
                text: 'text-rose-500',
                gradient: 'from-rose-500 via-red-500 to-pink-550',
                badgeText: 'text-rose-600 bg-rose-500/10 border-rose-500/20',
                bg: 'bg-rose-50/50 border border-rose-200/50'
              },
              {
                text: 'text-purple-500',
                gradient: 'from-purple-500 via-fuchsia-400 to-violet-500',
                badgeText: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
                bg: 'bg-purple-50/50 border border-purple-200/50'
              }
            ][index % 4];

            const isHovered = hoveredIdx === index;
            const isAnyHovered = hoveredIdx !== null;

            // Calculate fan-out layout dynamic styles
            const rotAngle = isHovered ? 0 : (index - 3.5) * 3;
            const transY = isHovered ? -24 : 0;
            const cardWidth = isHovered 
              ? 'w-[310px] lg:w-[350px]' 
              : isAnyHovered 
              ? 'w-[75px] lg:w-[90px]' 
              : 'w-[105px] lg:w-[125px]';
            const cardMargin = isHovered 
              ? 'mx-3 lg:mx-4' 
              : '-mr-5 lg:-mr-7 last:mr-0';
            
            // Overlapping layering index
            const baseZ = index <= 3 ? 10 + index : 10 + (7 - index);
            const zIndex = isHovered ? 50 : baseZ;

            return (
              <div
                key={member.name}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  zIndex: zIndex,
                }}
                className={`group relative h-full transition-all duration-500 ease-out origin-bottom ${cardWidth} ${cardMargin}`}
              >
                {/* Inner Card (handles actual visual padding, translation, and rotation) */}
                <div
                  style={{
                    transform: `rotate(${rotAngle}deg) translateY(${transY}px)`,
                  }}
                  className={`w-full h-full relative rounded-[28px] transition-all duration-500 ease-out flex flex-col justify-between cursor-pointer backdrop-blur-md p-5 shadow-[0_12px_28px_rgba(0,0,0,0.04)] group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)] select-none origin-bottom ${theme.bg} overflow-hidden`}
                >
                  {/* Flowing Gradient Border (on hover) */}
                  <div className={`absolute -inset-[1.5px] rounded-[29px] bg-gradient-to-r ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-flow-gradient`} />
                  
                  {/* Inner Card Background Mask */}
                  <div className={`absolute inset-0 rounded-[28px] ${theme.bg} group-hover:bg-white/95 group-hover:border-transparent z-10 pointer-events-none transition-all duration-500`} />

                  {/* Tech coordinates grid backdrop (reveals slightly on hover) */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:10px_10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                  
                  {/* Technical Corner Crosshairs */}
                  <div className="absolute top-2.5 left-3 text-[8px] font-mono text-stone-300 group-hover:text-stone-400 transition-colors pointer-events-none select-none z-20">+</div>
                  <div className="absolute top-2.5 right-3 text-[8px] font-mono text-stone-300 group-hover:text-stone-400 transition-colors pointer-events-none select-none z-20">+</div>

                  {/* Decorative background stars inside the card */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 opacity-45 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-7 left-5 text-[7px] text-stone-400 group-hover:text-amber-500 transition-colors animate-twinkle select-none">✦</div>
                    <div className="absolute top-20 right-4 text-[6.5px] text-stone-400 group-hover:text-amber-400 transition-colors animate-twinkle duration-1000 select-none">✦</div>
                    <div className="absolute bottom-24 left-3 text-[6px] text-stone-400 group-hover:text-purple-400 transition-colors animate-twinkle duration-3000 select-none">✦</div>
                    <div className="absolute bottom-16 right-5 text-[6.5px] text-stone-400 group-hover:text-blue-500 transition-colors animate-twinkle duration-2000 select-none">✦</div>
                    {isHovered && (
                      <>
                        <div className="absolute top-1/4 right-6 text-[8px] text-rose-500 animate-twinkle duration-1500 select-none">✦</div>
                        <div className="absolute bottom-1/3 left-6 text-[7px] text-purple-500 animate-twinkle duration-2500 select-none">✦</div>
                      </>
                    )}
                  </div>

                  {/* Card Header Section */}
                  <div className="relative z-20 flex justify-end items-center w-full h-4">
                  </div>

                  {/* Card Body Section */}
                  <div className="relative z-20 flex flex-col items-center justify-center flex-grow py-3 overflow-hidden">
                    
                    {isHovered ? (
                      // Expanded Hover View
                      <div className="flex flex-col items-center justify-between text-center animate-fade-in w-full h-full py-1">
                        {/* Full-width avatar/photo container */}
                        <div className="relative w-full h-[240px] rounded-2xl overflow-hidden shrink-0 border border-stone-200/50 shadow-sm">
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center relative`}>
                              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_75%)] animate-pulse-glow" />
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />
                              <span className="font-display text-4xl lg:text-5xl font-black tracking-wider text-white select-none uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-10">
                                {initials}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Name and Role Centered at the Bottom */}
                        <div className="space-y-1.5 w-full mt-4 pb-2">
                          <h3 className="font-display text-sm font-black text-stone-900 uppercase tracking-wide">
                            {nameToUse}
                          </h3>
                          <div className="flex justify-center">
                            <span className={`inline-block font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md border ${theme.badgeText}`}>
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Collapsed Default View
                      <div className="flex flex-col items-center justify-center space-y-4 h-full py-4 animate-fade-in">
                        {/* Small Avatar Indicator */}
                        <div className="relative w-12 h-12 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center shadow-inner shrink-0 group-hover:border-stone-700 transition-colors">
                          <span className="font-display text-[10px] font-black text-stone-350 select-none uppercase">
                            {initials}
                          </span>
                        </div>
                        
                        {/* Vertical Name */}
                        <span className="font-display text-[9px] font-black text-stone-400 group-hover:text-stone-600 transition-colors uppercase tracking-widest leading-none [writing-mode:vertical-lr] rotate-180 select-none pt-2">
                          {shortName}
                        </span>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Layout: Responsive Vertical Accordion */}
        <div className="flex md:hidden flex-col space-y-3 w-full max-w-md mx-auto px-4">
          {TEAM_MEMBERS.map((member, index) => {
            const nameToUse = language === 'vi' ? member.nameVi : member.name;
            const cleanName = nameToUse.replace(/^(Mr\.|Ms\.|Anh|Chị)\s+/i, '');
            const nameParts = cleanName.split(' ');
            const initials = nameParts.length >= 2 
              ? `${nameParts[nameParts.length - 2][0]}${nameParts[nameParts.length - 1][0]}` 
              : nameParts[0].substring(0, 2);

            const theme = [
              {
                text: 'text-blue-500',
                gradient: 'from-blue-500 via-cyan-400 to-indigo-500',
                badgeText: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
                bg: 'bg-blue-50/50 border border-blue-200/50'
              },
              {
                text: 'text-amber-500',
                gradient: 'from-amber-400 via-yellow-400 to-orange-500',
                badgeText: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
                bg: 'bg-amber-50/50 border border-amber-200/50'
              },
              {
                text: 'text-rose-500',
                gradient: 'from-rose-500 via-red-500 to-pink-550',
                badgeText: 'text-rose-600 bg-rose-500/10 border-rose-500/20',
                bg: 'bg-rose-50/50 border border-rose-200/50'
              },
              {
                text: 'text-purple-500',
                gradient: 'from-purple-500 via-fuchsia-400 to-violet-500',
                badgeText: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
                bg: 'bg-purple-50/50 border border-purple-200/50'
              }
            ][index % 4];

            const isExpanded = hoveredIdx === index;

            return (
              <div
                key={member.name}
                onClick={() => setHoveredIdx(isExpanded ? null : index)}
                className={`group relative rounded-2xl transition-all duration-300 backdrop-blur-sm p-4 overflow-hidden flex flex-col justify-between cursor-pointer shadow-sm ${theme.bg} ${
                  isExpanded ? 'h-[130px] border-stone-300' : 'h-[72px]'
                }`}
              >
                {/* Tech coordinates grid backdrop (reveals slightly on hover) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:10px_10px] opacity-10 pointer-events-none z-0" />
                
                {/* Header Row (Initials & Name/Role overview) */}
                <div className="relative z-10 flex items-center justify-between w-full h-10">
                  <div className="flex items-center space-x-3.5">
                    {/* Small initials avatar */}
                    <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center shrink-0 shadow-inner">
                      <span className="font-display text-[9px] font-black text-stone-300 select-none uppercase">
                        {initials}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className={`font-display text-xs font-black uppercase tracking-wide text-stone-900 group-hover:${theme.text} transition-colors`}>
                        {nameToUse}
                      </h3>
                      {!isExpanded && (
                        <p className="font-mono text-[7px] text-stone-400 uppercase tracking-widest leading-none">
                          {member.role}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-stone-350 select-none font-bold">
                    {isExpanded ? '✕' : ''}
                  </span>
                </div>

                {isExpanded && (
                  // Expanded Details block
                  <div className="relative z-10 flex flex-col items-stretch space-y-3 pt-3 border-t border-stone-100/60 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <span className={`inline-block font-mono text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${theme.badgeText}`}>
                        {member.role}
                      </span>
                      <span className="font-mono text-[8px] text-emerald-500 flex items-center space-x-1">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        <span>ONLINE</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* 6. Active Call-to-Action (CTA Capsule Section) */}
      <section className="mx-auto max-w-4xl px-4 text-center relative z-10">
        <div className="bg-black text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col items-center space-y-6 shadow-xl border border-stone-850 group">
          
          <div className="absolute inset-0 bg-stone-900/30 opacity-60 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />
          
          <div className="absolute top-4 left-4 text-amber-400 text-xl animate-twinkle">✦</div>
          <div className="absolute bottom-6 right-6 text-blue-400 text-lg animate-twinkle duration-2000">✦</div>


          <div className="space-y-2 relative z-10">
            <span className={`text-[10px] ${language === 'vi' ? 'font-sans' : 'font-mono'} tracking-widest text-amber-400 uppercase font-bold block`}>
              {language === 'vi' ? 'Tự thiết kế bộ charm' : 'Make Your Own Set'}
            </span>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-white uppercase leading-tight max-w-xl mx-auto">
              {t.readyTitle}
            </h3>
            <p className="font-sans text-stone-400 text-xs max-w-sm mx-auto">
              {t.readyDesc}
            </p>
          </div>

          {/* Button "nhấn vào thì ra trang chi tiết sản phẩm" */}
          <button
            id="cta-about-btn"
            onClick={onGoProducts}
            className="relative z-10 w-full sm:w-auto rounded-full bg-white hover:bg-stone-100 text-black font-display text-xs font-black tracking-widest uppercase px-8 py-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.45)] hover:scale-105 active:scale-95 text-center flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t.exploreNow}</span>
            <Sparkles className="h-4 w-4 text-amber-500 animate-twinkle" />
          </button>

        </div>
      </section>

    </div>
  );
}
