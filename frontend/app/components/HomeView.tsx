import { useState, useEffect, useRef, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import UsecaseCarousel from './UsecaseCarousel';
import { apiRequest } from '../lib/api';

interface HomeViewProps {
  onAddCustomToCart: (jewelry: CustomJewelry) => void;
}

export default function HomeView({ onAddCustomToCart }: HomeViewProps) {
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
  const [showStickyCta, setShowStickyCta] = useState(false);
  const inlineCtaRef = useRef<HTMLDivElement>(null);

  // Show fixed CTA as soon as the inline CTA enters the viewport
  useEffect(() => {
    const handleScroll = () => {
      const el = inlineCtaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Hide when footer is visible
      const footer = document.querySelector('footer');
      const footerVisible = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
      // Show fixed CTA from when inline CTA enters viewport, hide at footer
      setShowStickyCta(rect.top < window.innerHeight && !footerVisible);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

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

  const handleSubmitFeedback = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setFeedbackLoading(true);
    setFeedbackStatus(null);

    try {
      await apiRequest('/feedback', {
        method: 'POST',
        body: {
          fullName: String(formData.get('fullName') ?? ''),
          email: String(formData.get('email') ?? ''),
          message: String(formData.get('message') ?? ''),
        },
      });
      setFeedbackStatus(t.feedbackSuccess);
      form.reset();
    } catch (error) {
      setFeedbackStatus(error instanceof Error ? error.message : 'Could not send feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <>
    <div className="space-y-16 pb-8 relative overflow-x-hidden" id="home-view">
      
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
        {/* Banner background GIF */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/home-banner-space.gif"
            alt="Space background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
        </div>
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left intro text info */}
            <div className="space-y-7 text-left">
              
              {/* Welcome badge */}
              <div className="inline-flex items-center space-x-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-full px-4 py-1.5 animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                <span className="font-mono text-[10px] text-amber-200/90 uppercase tracking-[0.2em] font-semibold">
                  {t.heroBadge}
                </span>
              </div>

              {/* Hero title with gradient accent */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-white leading-[1.1] uppercase">
                <span className="block">{language === 'vi' ? 'MỖI DẢI THIÊN HÀ' : 'UNSPOKEN DESIRES,'}</span>
                <span className="block mt-1 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                  {language === 'vi' ? 'LÀ MỘT CÂU CHUYỆN' : 'BESPOKE'}
                </span>
                <span className="block mt-1">{language === 'vi' ? 'ĐƯỢC KỂ' : 'YOUniverse.'}</span>
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
              <div className="flex flex-row items-center gap-3 pt-2">
                {/* Primary CTA - Big prominent shimmer */}
                <Link
                  id="hero-go-products"
                  href="/products"
                  className="group/btn relative rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-[length:200%_100%] animate-shimmer text-black font-display text-sm font-black tracking-wide uppercase px-7 py-4 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(251,191,36,0.45)] hover:translate-y-[-3px] active:translate-y-[0] text-center cursor-pointer whitespace-nowrap shadow-[0_4px_20px_rgba(251,191,36,0.25)]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5 shrink-0" />
                    <span>{t.heroBtn1}</span>
                    <ChevronRight className="h-5 w-5 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300 shrink-0" />
                  </span>
                </Link>
                {/* Secondary CTA - Big glass style */}
                <Link
                  href="/about"
                  className="group/btn2 rounded-full bg-white/[0.08] backdrop-blur-md hover:bg-white/[0.15] border border-white/25 hover:border-white/50 text-white font-display text-sm font-bold tracking-wide uppercase px-7 py-4 transition-all duration-300 hover:translate-y-[-3px] hover:shadow-[0_10px_30px_rgba(255,255,255,0.08)] active:translate-y-[0] text-center cursor-pointer whitespace-nowrap"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Bookmark className="h-5 w-5 opacity-70 shrink-0" />
                    <span>{t.heroBtn2}</span>
                    <ChevronRight className="h-5 w-5 opacity-0 -ml-2 group-hover/btn2:opacity-100 group-hover/btn2:ml-0 transition-all duration-300 shrink-0" />
                  </span>
                </Link>
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
                      <Image
                        src={slide.imageUrl}
                        alt={`${slide.title} YOUniverse`}
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 640px) 288px, 320px"
                        className="object-cover select-none z-0 transition-transform duration-1000 group-hover:scale-105"
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
      <MarqueeSlogan href="/about" />

      {/* Brand Introduction — "The Silent Communicator" */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 md:mt-24" id="brand-intro-section">
        <div className="relative overflow-hidden rounded-3xl bg-[#FAF6EE] border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Pop-art background decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            
            {/* Bold geometric shapes */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-amber-400/20" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-blue-500/15" />
            <div className="absolute top-[20%] right-[8%] w-20 h-20 rounded-full bg-rose-400/15" />
            <div className="absolute bottom-[15%] left-[45%] w-14 h-14 bg-amber-400/10 rotate-45" />
            <div className="absolute top-[60%] right-[35%] w-10 h-10 bg-blue-500/10 rotate-12 rounded-sm" />
            
            {/* Half-circle accent */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-40 rounded-r-full bg-rose-400/10" />
            <div className="absolute -right-8 bottom-[20%] w-16 h-32 rounded-l-full bg-blue-400/10" />
            
            {/* Colorful sparkle/star elements — varied shapes from reference */}
            {/* Large stars */}
            <div className="absolute top-5 left-[12%] text-2xl text-amber-500 animate-twinkle select-none" style={{ animationDelay: '0.2s' }}>✦</div>
            <div className="absolute top-8 right-[18%] text-3xl text-blue-500 animate-twinkle select-none" style={{ animationDelay: '1.5s' }}>✦</div>
            <div className="absolute bottom-6 left-[55%] text-xl text-rose-500 animate-twinkle select-none" style={{ animationDelay: '2.5s' }}>✦</div>
            
            {/* 6-point & 8-point bursts */}
            <div className="absolute top-[25%] left-[5%] text-lg text-amber-600/60 animate-twinkle select-none" style={{ animationDelay: '0.8s' }}>✶</div>
            <div className="absolute bottom-[30%] right-[6%] text-xl text-blue-600/50 animate-twinkle select-none" style={{ animationDelay: '2s' }}>✸</div>
            <div className="absolute top-[15%] right-[40%] text-sm text-rose-500/50 animate-twinkle select-none" style={{ animationDelay: '3s' }}>✹</div>
            
            {/* Small diamonds & dots */}
            <div className="absolute top-3 left-[35%] text-xs text-stone-900/20 select-none">◆</div>
            <div className="absolute bottom-4 right-[45%] text-[10px] text-amber-600/30 animate-twinkle select-none" style={{ animationDelay: '1.2s' }}>◆</div>
            <div className="absolute top-[45%] left-[8%] text-sm text-blue-500/30 animate-twinkle select-none" style={{ animationDelay: '0.5s' }}>✧</div>
            <div className="absolute bottom-10 left-[22%] text-base text-rose-400/40 animate-twinkle select-none" style={{ animationDelay: '1.8s' }}>✧</div>
            
            {/* Tiny accent circles (like confetti dots) */}
            <div className="absolute top-[12%] left-[28%] w-3 h-3 rounded-full bg-blue-500/25" />
            <div className="absolute top-[70%] right-[12%] w-2.5 h-2.5 rounded-full bg-rose-500/30" />
            <div className="absolute bottom-[22%] left-[38%] w-2 h-2 rounded-full bg-amber-500/35" />
            <div className="absolute top-[55%] left-[18%] w-4 h-4 rounded-full bg-amber-400/15 border border-amber-400/20" />
            <div className="absolute top-[35%] right-[22%] w-3 h-3 rounded-full bg-blue-400/15 border border-blue-400/20" />
            
            {/* Wavy/squiggly decorative lines */}
            <svg className="absolute bottom-8 right-[28%] w-16 h-4 text-rose-400/30" viewBox="0 0 64 16">
              <path d="M0 8 Q8 0 16 8 Q24 16 32 8 Q40 0 48 8 Q56 16 64 8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <svg className="absolute top-10 left-[42%] w-12 h-3 text-blue-400/25" viewBox="0 0 48 12">
              <path d="M0 6 Q6 0 12 6 Q18 12 24 6 Q30 0 36 6 Q42 12 48 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            
            {/* Dotted orbit ring */}
            <div className="absolute top-6 right-10 w-20 h-20 rounded-full border-2 border-dotted border-stone-900/8" />
            <div className="absolute bottom-8 left-12 w-14 h-14 rounded-full border-2 border-dashed border-amber-500/15" />
          </div>

          {/* Content */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-0">
            
            {/* Left — Big decorative title block (2 cols) */}
            <div className="md:col-span-2 flex flex-col justify-center items-center md:items-start p-8 md:p-12 md:border-r-2 border-stone-900/10">
              {/* Label badge */}
              <div className="inline-flex items-center space-x-2 bg-stone-900 rounded-full px-4 py-1.5 mb-6 shadow-[3px_3px_0px_0px_rgba(234,179,8,1)]">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-[9px] text-amber-200 uppercase tracking-[0.2em] font-bold">
                  {t.brandIntroLabel}
                </span>
              </div>
              
              {/* Giant brand name */}
              <h2 className="font-youth text-5xl sm:text-6xl md:text-7xl font-black text-stone-900 leading-none tracking-tight">
                <span className="block">YOU</span>
                <span className="block text-transparent" style={{ WebkitTextStroke: '2px #1a1a1a', paintOrder: 'stroke fill' }}>
                  niverse
                </span>
              </h2>
              
              {/* Subtitle with line */}
              <div className="flex items-center gap-3 mt-5">
                <div className="h-[3px] w-10 bg-amber-400 rounded-full" />
                <span className="font-display text-[11px] text-stone-500 uppercase tracking-[0.25em] font-bold">
                  {t.brandIntroSubtitle}
                </span>
              </div>
            </div>

            {/* Right — Description & visual (3 cols) */}
            <div className="md:col-span-3 flex flex-col justify-center p-8 md:p-12 md:pl-10">
              {/* Decorative quote mark */}
              <div className="text-6xl md:text-8xl font-display text-stone-900/[0.06] leading-none select-none -mb-6 md:-mb-10">
                &ldquo;
              </div>
              
              <p className="font-sans text-stone-700 text-base md:text-lg leading-relaxed max-w-xl">
                {t.brandIntroDesc}
              </p>

              {/* 3-element formula visual pills — bold pop-art style */}
              <div className="flex flex-wrap items-center gap-2.5 mt-8">
                <div className="flex items-center gap-2 bg-blue-500 rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  <span className="font-display text-[11px] text-white uppercase tracking-wider font-bold">Astra</span>
                </div>
                <span className="text-stone-400 text-sm font-bold">+</span>
                <div className="flex items-center gap-2 bg-amber-400 rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                  <Heart className="h-3.5 w-3.5 text-stone-900" />
                  <span className="font-display text-[11px] text-stone-900 uppercase tracking-wider font-bold">Sirius</span>
                </div>
                <span className="text-stone-400 text-sm font-bold">+</span>
                <div className="flex items-center gap-2 bg-rose-500 rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default">
                  <Compass className="h-3.5 w-3.5 text-white" />
                  <span className="font-display text-[11px] text-white uppercase tracking-wider font-bold">Polaris</span>
                </div>
                <span className="text-stone-400 text-lg font-black">=</span>
                <div className="flex items-center gap-2 bg-stone-900 rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(234,179,8,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(234,179,8,1)] transition-all cursor-default">
                  <span className="font-display text-[11px] text-white uppercase tracking-wider font-bold">YOUniverse</span>
                  <span className="text-amber-400 text-sm animate-twinkle">✦</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Khám Phá Các Hành Tinh: Charm Lines Products Showcase */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20 md:mt-28 space-y-10" id="charm-lines-section">
        
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 uppercase">
            {t.planetTitle}
          </h2>
          <p className="font-sans text-stone-500 text-xs tracking-wider mx-auto">
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
              <Link
                key={charm.id}
                href="/products"
                id={`charm-card-${charm.id}`}
                onMouseEnter={() => setActiveCharmIndex(index)}
                onMouseLeave={() => setActiveCharmIndex(null)}
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
                    alt={`${charm.name} - charm cá nhân hóa YOUniverse`}
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
              </Link>
            );
          })}

        </div>

      </section>

      {/* Inline CTA Button — hidden when fixed version is active */}
      <div ref={inlineCtaRef} className={`flex justify-center py-2 relative z-10 transition-opacity duration-300 ${showStickyCta ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <a
          href="/order"
          className="group/cta inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-[length:200%_100%] animate-shimmer text-black font-display text-sm font-black tracking-wider uppercase px-10 py-4 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(251,191,36,0.4)] hover:translate-y-[-3px] active:translate-y-[0] cursor-pointer shadow-[0_6px_25px_rgba(251,191,36,0.3)] whitespace-nowrap"
        >
          <Sparkles className="h-[18px] w-[18px] opacity-80 shrink-0" />
          <span>{t.customizeCta}</span>
          <ChevronRight className="h-[18px] w-[18px] opacity-0 -ml-2 group-hover/cta:opacity-100 group-hover/cta:ml-0 transition-all duration-300 shrink-0" />
        </a>
      </div>

      {/* Photoshoot Gallery — Behind the Scenes */}
      <section className="relative z-10 mt-10 md:mt-14 overflow-hidden" id="photoshoot-section">

        {/* Scrolling Photo Marquee — Row 1 (Left to Right) */}
        <div className="relative w-full overflow-hidden mb-4">
          <div className="flex animate-photo-scroll whitespace-nowrap">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-4 pr-4 shrink-0">
                {[
                  { src: '/images/photoshoot-1.jpg', w: 220, h: 300 },
                  { src: '/images/photoshoot-2.jpg', w: 360, h: 300 },
                  { src: '/images/photoshoot-3.jpg', w: 280, h: 300 },
                  { src: '/images/photoshoot-4.jpg', w: 400, h: 300 },
                  { src: '/images/photoshoot-5.jpg', w: 220, h: 300 },
                  { src: '/images/photoshoot-6.jpg', w: 340, h: 300 },
                ].map((photo, i) => (
                  <div key={i} className={`group/photo relative rounded-2xl overflow-hidden shrink-0 cursor-pointer shadow-md hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] hover:z-50 hover:scale-[1.08] transition-all duration-500 ease-out`} style={{ width: photo.w, height: photo.h }}>
                    <img src={photo.src} alt="YOUniverse charm" className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-110" />
                    <div className="absolute top-3 left-3 opacity-0 group-hover/photo:opacity-100 transition-all duration-500 z-10">
                      <img src="/images/logo-youniverse-transparent.png" alt="" className="h-10 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Scrolling Photo Marquee — Row 2 (Right to Left) */}
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-photo-scroll-reverse whitespace-nowrap">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex gap-4 pr-4 shrink-0">
                {[
                  { src: '/images/photoshoot-7.jpg', w: 380, h: 280 },
                  { src: '/images/photoshoot-8.jpg', w: 220, h: 280 },
                  { src: '/images/photoshoot-9.jpg', w: 340, h: 280 },
                  { src: '/images/photoshoot-10.jpg', w: 400, h: 280 },
                  { src: '/images/photoshoot-11.jpg', w: 280, h: 280 },
                ].map((photo, i) => (
                  <div key={i} className={`group/photo relative rounded-2xl overflow-hidden shrink-0 cursor-pointer shadow-md hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] hover:z-50 hover:scale-[1.08] transition-all duration-500 ease-out`} style={{ width: photo.w, height: photo.h }}>
                    <img src={photo.src} alt="YOUniverse charm" className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-110" />
                    <div className="absolute top-3 left-3 opacity-0 group-hover/photo:opacity-100 transition-all duration-500 z-10">
                      <img src="/images/logo-youniverse-transparent.png" alt="" className="h-10 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Tính Ứng Dụng — Use Cases Carousel (Apple-style) */}
      <section className="relative z-10 mt-20 md:mt-28 py-16 md:py-24 bg-stone-950" id="usecase-section">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12 px-4">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
            {t.usecaseTitle}
          </h2>
        </div>

        {/* Carousel */}
        {(() => {
          const usecaseSlides = [
            { image: '/images/photoshoot-1.png', title: t.usecase1Title, desc: t.usecase1Desc },
            { image: '/images/photoshoot-2.png', title: t.usecase2Title, desc: t.usecase2Desc },
            { image: '/images/photoshoot-3.png', title: t.usecase3Title, desc: t.usecase3Desc },
            { image: '/images/photoshoot-4.png', title: t.usecase4Title, desc: t.usecase4Desc },
            { image: '/images/photoshoot-5.png', title: t.usecase5Title, desc: t.usecase5Desc },
            { image: '/images/photoshoot-6.png', title: t.usecase6Title, desc: t.usecase6Desc },
          ];

          return (
            <UsecaseCarousel slides={usecaseSlides} />
          );
        })()}

      </section>

      {/* Unleash Your YOUniverse — Feedback / Story Sharing Section */}
      <section className="relative z-10 mt-20 md:mt-28 py-16 md:py-24 overflow-hidden" id="feedback-section">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 uppercase">
              {t.feedbackTitle}
            </h2>
            <p className="font-sans text-stone-500 text-sm tracking-wider">{t.feedbackSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Product Image Collage */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
                <Image src="/images/photoshoot-3.png" alt="Khách hàng chia sẻ câu chuyện cùng charm YOUniverse" fill sizes="50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="font-display text-2xl font-extrabold text-white uppercase tracking-wide leading-snug">
                    {language === 'vi' ? 'Hãy chia sẻ' : 'Share your'}<br />
                    <span className="text-amber-400">YOUniverse</span><br />
                    {language === 'vi' ? 'tại đây.' : 'right here.'}
                  </p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-2xl overflow-hidden shadow-xl rotate-6 border-2 border-stone-200/60">
                <Image src="/images/photoshoot-1.png" alt="" fill sizes="128px" className="object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-2xl overflow-hidden shadow-xl -rotate-6 border-2 border-stone-200/60">
                <Image src="/images/photoshoot-5.png" alt="" fill sizes="112px" className="object-cover" />
              </div>
            </div>

            {/* Right — Feedback Form */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-2xl border border-stone-200/60 rounded-3xl p-8 md:p-10 shadow-2xl">
                <div className="mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="font-display text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {language === 'vi' ? 'Kết nối vũ trụ' : 'Cosmic Connection'}
                  </span>
                </div>

                <form className="space-y-6" onSubmit={handleSubmitFeedback}>
                  <div className="space-y-2">
                    <label className="block font-display text-xs font-bold text-stone-600 uppercase tracking-wider">{t.feedbackNameLabel}</label>
                    <input name="fullName" type="text" required placeholder={t.feedbackNamePlaceholder} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 text-sm font-sans placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-display text-xs font-bold text-stone-600 uppercase tracking-wider">{t.feedbackEmailLabel}</label>
                    <input name="email" type="email" required placeholder={t.feedbackEmailPlaceholder} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 text-sm font-sans placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-display text-xs font-bold text-stone-600 uppercase tracking-wider leading-relaxed">{t.feedbackStoryLabel}</label>
                    <textarea name="message" required rows={5} placeholder={t.feedbackStoryPlaceholder} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-900 text-sm font-sans placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400/30 transition-all duration-300 resize-none" />
                  </div>
                  <button disabled={feedbackLoading} type="submit" className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-[length:200%_100%] animate-shimmer text-black font-display text-sm font-black tracking-wider uppercase px-8 py-4 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(251,191,36,0.3)] hover:translate-y-[-2px] active:translate-y-[0] cursor-pointer disabled:opacity-60">
                    {feedbackLoading ? (language === 'vi' ? 'Đang gửi...' : 'Sending...') : t.feedbackSubmit}
                  </button>
                  {feedbackStatus && (
                    <div className="text-center py-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                      <p className="text-emerald-500 text-sm font-sans font-medium">{feedbackStatus}</p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YOUniverse Running Text */}
      <section className="relative z-10 mt-20 md:mt-28 overflow-hidden" id="cta-marquee-section">

        {/* YOUniverse Running Text Marquee */}
        <Link
          href="/about"
          className="relative block w-full py-4 bg-stone-950 cursor-pointer group/marquee overflow-hidden"
        >
          {/* Row scrolling Right to Left */}
          <div className="flex animate-photo-scroll whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center shrink-0 gap-8 px-4">
                {[...Array(3)].map((_, j) => (
                  <span 
                    key={j} 
                    className="font-display text-3xl md:text-5xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400/20 via-amber-300/30 to-amber-400/20 group-hover/marquee:from-amber-400 group-hover/marquee:via-yellow-300 group-hover/marquee:to-amber-400 transition-all duration-500 select-none"
                  >
                    YOUniverse
                  </span>
                ))}
                <span className="text-amber-400/15 group-hover/marquee:text-amber-400/60 text-2xl transition-colors duration-500">✦</span>
              </div>
            ))}
          </div>

          {/* Hover indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/marquee:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-2 border border-amber-400/30">
              <span className="font-display text-sm font-bold text-amber-400 uppercase tracking-widest">
                {language === 'vi' ? 'Xem câu chuyện →' : 'Our Story →'}
              </span>
            </div>
          </div>
        </Link>
      </section>


    </div>

    {/* Fixed Bottom CTA — smooth slide animation */}
    <div
      className={`fixed bottom-0 left-0 right-0 z-[60] transition-all duration-500 ease-out ${
        showStickyCta
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-black/80 backdrop-blur-xl border-t border-amber-400/20 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <a
            href="/order"
            className="group/cta inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-[length:200%_100%] animate-shimmer text-black font-display text-sm font-black tracking-wider uppercase px-8 py-3 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-100 cursor-pointer shadow-[0_4px_20px_rgba(251,191,36,0.25)] whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4 opacity-80 shrink-0" />
            <span>{t.customizeCta}</span>
            <ChevronRight className="h-4 w-4 opacity-0 -ml-2 group-hover/cta:opacity-100 group-hover/cta:ml-0 transition-all duration-300 shrink-0" />
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
