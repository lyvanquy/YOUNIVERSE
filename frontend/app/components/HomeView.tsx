import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Heart, 
  Compass, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Paintbrush, 
  Bookmark, 
  Gem,
} from 'lucide-react';
import { CustomJewelry } from '../types';
import { CHARM_PRODUCTS } from '../data';
import MarqueeSlogan from './MarqueeSlogan';
import { CORE_VALUES } from '../data';
import { useYouniverseApp } from '../YouniverseApp';
import { translations } from '../locales';

interface HomeViewProps {
  onGoAbout: () => void;
  onGoProducts: () => void;
  onAddCustomToCart: (jewelry: CustomJewelry) => void;
}

export default function HomeView({ onGoAbout, onGoProducts, onAddCustomToCart }: HomeViewProps) {
  const { language } = useYouniverseApp();
  const t = translations[language];
  // Ref-based cursor following for 120 FPS performance (zero React re-renders!)
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('home-view');
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

  // Product Line Showcase states
  const [activeCharmIndex, setActiveCharmIndex] = useState<number | null>(null);

  // Hero Carousel Slides Data - Real charm stock photos
  const heroSlides = [
    {
      id: 'charm-bom',
      title: 'CHARM STAR',
      tagline: language === 'vi' ? 'Ngôi sao cá nhân hóa' : 'Personalized Star',
      footerTitle: language === 'vi' ? 'CHARM NGÔI SAO "BOM"' : 'STAR CHARM "BOM"',
      footerDesc: language === 'vi' 
        ? 'Hạt charm ngôi sao khắc tên riêng — mỗi mảnh là một câu chuyện độc nhất.' 
        : 'Custom star charm engraved with your name — every piece tells a unique story.',
      badgeText: language === 'vi' ? 'Bán chạy' : 'Best Seller',
      imageUrl: '/images/home-astra.jpg',
    },
    {
      id: 'charm-cat',
      title: 'CHARM MASCOT',
      tagline: language === 'vi' ? 'Linh vật YOUniverse' : 'YOUniverse Mascot',
      footerTitle: language === 'vi' ? 'CHARM MÈO VŨ TRỤ' : 'COSMIC CAT CHARM',
      footerDesc: language === 'vi' 
        ? 'Chú mèo vũ trụ dễ thương — người bạn đồng hành trên mọi hành trình.' 
        : 'Adorable cosmic cat — your companion on every journey.',
      badgeText: language === 'vi' ? 'Yêu thích' : 'Fan Favorite',
      imageUrl: '/images/home-sirius.jpg',
    },
    {
      id: 'charm-youcan',
      title: 'CHARM MESSAGE',
      tagline: language === 'vi' ? 'Truyền cảm hứng' : 'Inspire You',
      footerTitle: language === 'vi' ? 'CHARM "YOU CAN."' : 'CHARM "YOU CAN."',
      footerDesc: language === 'vi' 
        ? 'Lời nhắn nhủ bạn mỗi ngày — bạn có thể làm được mọi điều.' 
        : 'A daily reminder — you can do anything you set your mind to.',
      badgeText: language === 'vi' ? 'Truyền cảm hứng' : 'Inspiring',
      imageUrl: '/images/home-polaris.jpg',
    },
  ];

  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroCarouselIndex((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Customizer live preview state representing the "How to Build Your YOUniverse" 3-step engine
  const [jewelryType, setJewelryType] = useState<'bracelet' | 'necklace' | 'cord'>('bracelet');
  const [vibeColor, setVibeColor] = useState<string>('blue'); // 'blue' | 'yellow' | 'red' | 'indigo'
  const [selectedCharms, setSelectedCharms] = useState<string[]>(['astra', 'sirius']);
  const [customName, setCustomName] = useState<string>('UNI');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dynamic glow border/shadow based on selected atmosphere
  const glowShadows = {
    blue: 'shadow-[0_20px_50px_rgba(59,130,246,0.06)] border-blue-200/50',
    yellow: 'shadow-[0_20px_50px_rgba(245,158,11,0.06)] border-amber-200/50',
    red: 'shadow-[0_20px_50px_rgba(239,68,68,0.06)] border-rose-200/50',
    indigo: 'shadow-[0_20px_50px_rgba(99,102,241,0.06)] border-indigo-200/50',
  }[vibeColor] || 'shadow-[0_20px_50px_rgba(0,0,0,0.04)] border-stone-200';

  // Vibe options mapping
  const vibeOptions = [
    { id: 'blue', label: 'Azure Nebula', colorClass: 'bg-blue-400 ring-blue-500/30 text-blue-600', glow: 'shadow-blue-500/10' },
    { id: 'yellow', label: 'Golden Solar', colorClass: 'bg-amber-400 ring-amber-500/30 text-amber-600', glow: 'shadow-yellow-500/10' },
    { id: 'red', label: 'Aurora Flame', colorClass: 'bg-rose-400 ring-rose-500/30 text-rose-600', glow: 'shadow-red-500/10' },
    { id: 'indigo', label: 'Cosmic Royal', colorClass: 'bg-indigo-400 ring-indigo-500/30 text-indigo-600', glow: 'shadow-indigo-500/10' },
  ];

  // Quick charm catalog details for the customizer
  const charmOptions = [
    { id: 'astra', label: 'Astra Star', icon: Sparkles, color: 'text-blue-500' },
    { id: 'sirius', label: 'Sirius Heart', icon: Heart, color: 'text-yellow-500' },
    { id: 'polaris', label: 'Polaris Compass', icon: Compass, color: 'text-red-500' },
  ];

  const handleAddCharm = (charmId: string) => {
    if (selectedCharms.length >= 6) return; // Limit to 6 charms max
    setSelectedCharms([...selectedCharms, charmId]);
  };

  const handleRemoveCharm = (indexToRemove: number) => {
    setSelectedCharms(selectedCharms.filter((_, idx) => idx !== indexToRemove));
  };

  const resetCustomizer = () => {
    setJewelryType('bracelet');
    setVibeColor('blue');
    setSelectedCharms(['astra', 'sirius']);
    setCustomName('UNI');
    setSuccessMessage(null);
  };

  const handleCreateAndAdd = () => {
    const creation: CustomJewelry = {
      baseType: jewelryType,
      selectedCharms: [...selectedCharms],
      customName: customName.trim() || 'YOU',
      vibeColor: vibeColor
    };
    onAddCustomToCart(creation);
    
    setSuccessMessage(`Successfully added your custom design "${customName}" to your cart!`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-16 pb-24 relative overflow-hidden" id="home-view">
      
      {/* Technical Background Mesh Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      
      {/* Blurred Floating Accent energy blobs */}
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] rounded-full bg-blue-500/5 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute top-[50%] right-[-15%] w-[450px] h-[450px] rounded-full bg-amber-500/4 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow duration-5000" />
      <div className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px] rounded-full bg-rose-500/4 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow duration-4000" />

      {/* Interactive Mouse-Follow Glow Halo */}
      <div 
        ref={glowRef}
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0 blur-[80px] opacity-40 hidden md:block will-change-transform transform-gpu"
        style={{
          left: 0,
          top: 0,
          transform: 'translate3d(-999px, -999px, 0)',
          background: vibeColor === 'blue' 
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)'
            : vibeColor === 'yellow'
            ? 'radial-gradient(circle, rgba(234, 179, 8, 0.25) 0%, transparent 70%)'
            : vibeColor === 'red'
            ? 'radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
        }}
      />

      {/* 1. Hero Block / Banner Section */}
      <section className="relative overflow-hidden bg-black py-20 px-4 md:px-8 tracking-wide rounded-3xl mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto mt-6 shadow-sm border border-stone-850 z-10">
        {/* Banner background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/home-banner.png" 
            alt="YOUniverse Home Banner" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
        </div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left intro text info */}
            <div className="space-y-7 text-left">
              
              {/* Sparkle micro-badge */}
              <div className="inline-flex items-center space-x-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-full px-4 py-1.5 animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                <span className="font-mono text-[10px] text-amber-200/90 uppercase tracking-[0.2em] font-semibold">
                  {language === 'vi' ? '✦ Phụ kiện cá nhân hóa ✦' : '✦ Personalized Charms ✦'}
                </span>
              </div>

              {/* Hero title with gradient accent */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-white leading-[1.1] uppercase">
                <span className="block">{language === 'vi' ? 'MỖI DẢI THIÊN HÀ' : 'A GALAXY TO HOLD,'}</span>
                <span className="block mt-1 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                  {language === 'vi' ? 'LÀ MỘT CÂU CHUYỆN' : 'A STORY TO BE'}
                </span>
                <span className="block mt-1">{language === 'vi' ? 'ĐƯỢC KỂ' : 'TOLD'}</span>
              </h1>

              {/* Decorative divider line */}
              <div className="flex items-center space-x-3">
                <div className="h-[2px] w-12 bg-gradient-to-r from-amber-400 to-transparent rounded-full" />
                <div className="h-1 w-1 rounded-full bg-amber-400/60" />
                <div className="h-1 w-1 rounded-full bg-amber-400/30" />
              </div>
              
              {/* Tagline */}
              <p className="font-sans text-stone-300/90 text-sm md:text-[15px] leading-relaxed max-w-md">
                {t.heroTagline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
                {/* Primary CTA - Shimmer effect */}
                <button
                  id="hero-go-products"
                  onClick={onGoProducts}
                  className="group/btn relative rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-[length:200%_100%] animate-shimmer text-black font-display text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(251,191,36,0.35)] hover:translate-y-[-2px] active:translate-y-[0] text-center cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <Sparkles className="h-4 w-4 opacity-70" />
                    <span>{language === 'vi' ? 'Khám phá Vũ trụ' : 'Explore Universe'}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                  </span>
                </button>
                {/* Secondary CTA - Glass style */}
                <a
                  href="#customizer-workshop"
                  className="group/btn2 rounded-full bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.12] border border-white/20 hover:border-white/40 text-white/90 font-display text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[0] text-center"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Paintbrush className="h-4 w-4 opacity-60" />
                    <span>{language === 'vi' ? 'Tự thiết kế 3 Bước' : 'Build Yours 3 Steps'}</span>
                    <span className="inline-block animate-bounce text-amber-300 text-sm">↓</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Right aesthetic visual interactive card (The missing banner is replaced with stellar craft) */}
            <div className="relative flex justify-center">
              <div className="relative w-72 h-96 sm:w-80 sm:h-[420px] rounded-3xl overflow-hidden group hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] hover:border-blue-200/80 transition-all duration-500 hover:-translate-y-1">
                
                {heroSlides.map((slide, idx) => {
                  const isActive = idx === heroCarouselIndex;
                  
                  // Compute sliding positioning class
                  let slideTransformClass = "";
                  if (isActive) {
                    slideTransformClass = "translate-x-0 opacity-100 scale-100 z-10";
                  } else if (
                    idx < heroCarouselIndex || 
                    (heroCarouselIndex === 0 && idx === heroSlides.length - 1)
                  ) {
                    slideTransformClass = "-translate-x-full opacity-0 scale-95 z-0 pointer-events-none";
                  } else {
                    slideTransformClass = "translate-x-full opacity-0 scale-95 z-0 pointer-events-none";
                  }

                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 p-6 pb-12 flex flex-col justify-between transition-all duration-1000 ease-in-out ${slideTransformClass}`}
                    >
                      {/* Full Background Slide Image */}
                      <img 
                        src={slide.imageUrl} 
                        alt={slide.title} 
                        className="absolute inset-0 w-full h-full object-cover select-none z-0 transition-transform duration-1000 group-hover:scale-105" 
                      />

                      {/* Legibility gradient overlay - subtle for cinematic styling */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 z-10 pointer-events-none" />

                      {/* Visual Header of Card */}
                      <div className="relative z-20 flex justify-between items-start">
                        <div className="font-mono text-[9px] text-stone-350 uppercase tracking-widest">
                          YOUniverse Accessory Co.
                        </div>
                        <span className={`text-[9px] ${language === 'vi' ? 'font-sans' : 'font-mono'} uppercase font-bold py-0.5 px-2.5 rounded-full border bg-white/10 text-white border-white/20`}>
                          {slide.badgeText}
                        </span>
                      </div>

                      {/* Center Orbit Path / Space illustration removed */}

                      {/* Visual Footer of Card removed per user request */}
                    </div>
                  );
                })}

                {/* Dot/Dash Indicators (larger, colored pill-shaped dashes with glowing shadows) */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-20">
                  {heroSlides.map((slide, idx) => {
                    const isActive = idx === heroCarouselIndex;
                    // Dynamic active color matching slide theme
                    const activeColorClass = idx === 0 
                      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                      : idx === 1 
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' 
                      : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]';

                    return (
                      <button
                        key={idx}
                        onClick={() => setHeroCarouselIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-500 focus:outline-none cursor-pointer ${
                          isActive 
                            ? `${activeColorClass} w-10` 
                            : 'bg-stone-300/80 hover:bg-stone-400 w-5'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                        title={slide.title}
                      />
                    );
                  })}
                </div>

              </div>

              {/* Backing structural highlights */}
              <div className={`absolute -bottom-6 -left-6 w-36 h-36 rounded-full filter blur-2xl opacity-60 -z-10 animate-pulse-glow transition-all duration-700 ${
                heroCarouselIndex === 0 ? 'bg-blue-500/10' : heroCarouselIndex === 1 ? 'bg-amber-500/10' : 'bg-rose-500/10'
              }`} />
              <div className={`absolute -top-6 -right-6 w-36 h-36 rounded-full filter blur-2xl opacity-70 -z-10 animate-pulse-glow duration-3000 transition-all duration-700 ${
                heroCarouselIndex === 0 ? 'bg-amber-500/10' : heroCarouselIndex === 1 ? 'bg-rose-500/10' : 'bg-blue-500/10'
              }`} />
            </div>

          </div>
        </div>
      </section>

      {/* Slogan marquee right below Hero Banner */}
      <MarqueeSlogan onSloganClick={onGoAbout} />

      {/* 2. Khám Phá Các Hành Tinh: Charm Lines Products Showcase */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 md:mt-28 space-y-10" id="charm-lines-section">
        
        <div className="text-center space-y-3">
          <h3 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 uppercase">
            {t.planetTitle}
          </h3>
          <p className="font-sans text-stone-500 text-xs tracking-wider max-w-lg mx-auto">
            {t.planetSubtitle}
          </p>
        </div>

        {/* Carousel of 3 Images (Responsive swipeable carousel on mobile, 3-column grid on desktop) */}
        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-6 md:pb-0 scrollbar-none scroll-smooth">
          
          {CHARM_PRODUCTS.map((charm, index) => {
            const isHovered = activeCharmIndex === index;
            
            // Color borders depending on brand color code
            const borderColors = {
              blue: 'hover:border-blue-300/80 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)]',
              yellow: 'hover:border-amber-300/80 hover:shadow-[0_20px_50px_rgba(234,179,8,0.12)]',
              red: 'hover:border-rose-300/80 hover:shadow-[0_20px_50px_rgba(244,63,94,0.12)]',
            }[charm.brandColor];

            const textColors = {
              blue: 'text-blue-600',
              yellow: 'text-amber-500',
              red: 'text-red-500',
            }[charm.brandColor];

            const bgGlows = {
              blue: 'from-blue-50/10 via-white/80 to-white/60',
              yellow: 'from-amber-50/10 via-white/80 to-white/60',
              red: 'from-rose-50/10 via-white/80 to-white/60',
            }[charm.brandColor];

            const gradientColors = {
              blue: 'from-blue-400 via-indigo-400 to-cyan-400',
              yellow: 'from-amber-400 via-yellow-400 to-orange-500',
              red: 'from-rose-400 via-red-500 to-pink-500',
            }[charm.brandColor] || 'from-blue-400 via-amber-400 to-rose-400';

            const translatedBadge = charm.id === 'astra' ? t.charmAstraBadge : charm.id === 'sirius' ? t.charmSiriusBadge : t.charmPolarisBadge;
            const translatedTagline = charm.id === 'astra' ? t.charmAstraTagline : charm.id === 'sirius' ? t.charmSiriusTagline : t.charmPolarisTagline;
            const translatedDescription = charm.id === 'astra' ? t.charmAstraDesc : charm.id === 'sirius' ? t.charmSiriusDesc : t.charmPolarisDesc;

            return (
              <div
                key={charm.id}
                id={`charm-card-${charm.id}`}
                onMouseEnter={() => setActiveCharmIndex(index)}
                onMouseLeave={() => setActiveCharmIndex(null)}
                onClick={onGoProducts}
                className={`group shrink-0 w-[88%] md:w-auto snap-center md:snap-align-none relative h-[420px] rounded-[32px] transition-all duration-500 md:hover:-translate-y-1.5 cursor-pointer shadow-sm ${borderColors}`}
              >
                {/* Flowing Gradient Border (on hover) */}
                <div className={`absolute -inset-[1.5px] rounded-[33px] bg-gradient-to-r ${gradientColors} opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-flow-gradient`} />

                {/* Inner Card Background Mask */}
                <div className={`absolute inset-0 rounded-[32px] bg-gradient-to-b ${bgGlows} backdrop-blur-md border border-stone-200/60 z-10 pointer-events-none md:group-hover:border-transparent transition-all duration-500`} />

                {/* Card Content Wrapper */}
                <div className="relative z-20 h-full w-full overflow-hidden rounded-[32px]">

                  {/* Full-card product image */}
                  <img 
                    src={
                      charm.id === 'astra' 
                        ? '/images/charm-stock-1.jpg' 
                        : charm.id === 'sirius' 
                          ? '/images/charm-stock-2.jpg' 
                          : '/images/charm-stock-3.jpg'
                    } 
                    alt={charm.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110" 
                  />

                  {/* Gradient overlay - stronger on hover/mobile to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-85 md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Decorative stars */}
                  <span className={`absolute top-4 right-4 ${textColors} text-sm animate-twinkle z-10`}>✦</span>
                  <span className={`absolute top-4 left-4 ${textColors} text-[10px] animate-twinkle duration-2000 z-10`}>✦</span>

                  {/* Charm name always visible at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    {/* Badge + Name - always visible */}
                    <div className="transform translate-y-[-8px] md:translate-y-0 transition-all duration-500 md:group-hover:translate-y-[-8px]">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className={`text-[10px] ${language === 'vi' ? 'font-sans' : 'font-mono'} font-extrabold uppercase tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}>
                          {translatedBadge}
                        </span>
                      </div>
                      <h4 className="font-display text-2xl font-black text-white uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                        {charm.name}
                      </h4>
                    </div>

                    {/* Hover-reveal content - slides up on desktop, always visible on mobile */}
                    <div className="opacity-100 translate-y-0 md:opacity-0 md:translate-y-6 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 ease-out mt-2">
                      <p className={`${language === 'vi' ? 'font-sans' : 'font-mono'} text-xs italic font-bold leading-relaxed text-amber-300 mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]`}>
                        &ldquo;{translatedTagline}&rdquo;
                      </p>
                      <p className="font-sans text-white/90 text-[11px] leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                        {translatedDescription}
                      </p>
                      <div className={`flex items-center justify-between mt-3 pt-2 border-t border-white/20 text-xs ${language === 'vi' ? 'font-sans' : 'font-mono'} font-medium text-white/70`}>
                        <span>{language === 'vi' ? 'Khám phá chi tiết' : 'Explore Details'}</span>
                        <ChevronRight className="h-4 w-4 transform md:group-hover:translate-x-1.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>

      </section>

      {/* 3. How to Build Your YOUniverse (Hướng dẫn 3 bước - Customized Workshop) */}
      <section 
        id="customizer-workshop" 
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 md:mt-36 space-y-10 md:space-y-12"
      >
        
        {/* Header segment of workshop instructions */}
        <div className="text-center space-y-3">
          <h3 className="font-display text-3xl font-extrabold text-stone-900 uppercase tracking-tight">
            {t.howToTitle}
          </h3>
          <p className="font-sans text-stone-500 text-xs tracking-wider max-w-xl mx-auto">
            {t.howToSubtitle}
          </p>
        </div>

        {/* Orbit Timeline (5A: Visual 3 steps planets flow) */}
        <div className="relative py-6">
          {/* Glowing Gradient Orbit Line (Desktop only) */}
          <div className="absolute top-1/2 left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-blue-300 via-amber-300 to-rose-300 -translate-y-1/2 hidden md:block z-0 opacity-80 blur-[0.5px]" />
          <div className="absolute top-1/2 left-[15%] right-[15%] h-[3px] bg-gradient-to-r from-blue-400 via-amber-400 to-rose-400 -translate-y-1/2 hidden md:block z-0 opacity-30 blur-[4px] animate-pulse-glow" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 Card */}
            <div className="group relative rounded-[28px] transition-all duration-500 hover:-translate-y-1.5 cursor-default flex flex-col items-center text-center hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)]">
              {/* Flowing Gradient Border (on hover) */}
              <div className="absolute -inset-[1.5px] rounded-[29px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-flow-gradient" />
              
              {/* Inner Card Background Mask */}
              <div className="absolute inset-0 rounded-[28px] bg-white/90 backdrop-blur-md border border-stone-200/60 z-10 pointer-events-none group-hover:border-transparent transition-all duration-500" />

              {/* Content Wrapper */}
              <div className="relative z-20 p-6 flex flex-col items-center space-y-4">
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-50/50 to-blue-100/30 border border-blue-200 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                  {/* Orbiting halo effect */}
                  <div className="absolute inset-[-4px] rounded-full border border-dashed border-blue-400/30 animate-spin-slow group-hover:border-blue-400/80 transition-colors duration-500" />
                  <Sparkles className="h-7 w-7 text-blue-500 animate-twinkle" />
                  
                  {/* Glowing step badge */}
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-black text-white shadow-md shadow-blue-500/20 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300">1</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-black uppercase tracking-wider text-stone-900 group-hover:text-blue-500 transition-colors">{t.step1Title}</h4>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed max-w-[245px] mx-auto">
                    {t.step1Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="group relative rounded-[28px] transition-all duration-500 hover:-translate-y-1.5 cursor-default flex flex-col items-center text-center hover:shadow-[0_20px_40px_rgba(234,179,8,0.08)]">
              {/* Flowing Gradient Border (on hover) */}
              <div className="absolute -inset-[1.5px] rounded-[29px] bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-flow-gradient" />
              
              {/* Inner Card Background Mask */}
              <div className="absolute inset-0 rounded-[28px] bg-white/90 backdrop-blur-md border border-stone-200/60 z-10 pointer-events-none group-hover:border-transparent transition-all duration-500" />

              {/* Content Wrapper */}
              <div className="relative z-20 p-6 flex flex-col items-center space-y-4">
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-50/50 to-amber-100/30 border border-amber-200 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                  {/* Orbiting halo effect */}
                  <div className="absolute inset-[-4px] rounded-full border border-dashed border-amber-400/30 animate-spin-slow group-hover:border-amber-400/80 transition-colors duration-500" style={{ animationDirection: 'reverse' }} />
                  <Heart className="h-7 w-7 text-amber-500 animate-float" />
                  
                  {/* Glowing step badge */}
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white shadow-md shadow-amber-500/20 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300">2</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-black uppercase tracking-wider text-stone-900 group-hover:text-amber-500 transition-colors">{t.step2Title}</h4>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed max-w-[245px] mx-auto">
                    {t.step2Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="group relative rounded-[28px] transition-all duration-500 hover:-translate-y-1.5 cursor-default flex flex-col items-center text-center hover:shadow-[0_20px_40px_rgba(244,63,94,0.08)]">
              {/* Flowing Gradient Border (on hover) */}
              <div className="absolute -inset-[1.5px] rounded-[29px] bg-gradient-to-r from-rose-400 via-red-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 animate-flow-gradient" />
              
              {/* Inner Card Background Mask */}
              <div className="absolute inset-0 rounded-[28px] bg-white/90 backdrop-blur-md border border-stone-200/60 z-10 pointer-events-none group-hover:border-transparent transition-all duration-500" />

              {/* Content Wrapper */}
              <div className="relative z-20 p-6 flex flex-col items-center space-y-4">
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-50/50 to-rose-100/30 border border-rose-200 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                  {/* Orbiting halo effect */}
                  <div className="absolute inset-[-4px] rounded-full border border-dashed border-rose-400/30 animate-spin-slow group-hover:border-rose-400/80 transition-colors duration-500" />
                  <Compass className="h-7 w-7 text-rose-500 animate-spin-slow" />
                  
                  {/* Glowing step badge */}
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md shadow-rose-500/20 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300">3</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-black uppercase tracking-wider text-stone-900 group-hover:text-rose-500 transition-colors">{t.step3Title}</h4>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed max-w-[245px] mx-auto">
                    {t.step3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
