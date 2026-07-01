'use client';

import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { Sparkles, Heart, Compass, ChevronRight, Check, Plus, Upload, X, Home, ShoppingBag, PawPrint, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useYouniverseApp } from '../YouniverseApp';
import { translations } from '../locales';
import {
  CHARM_PRODUCTS,
  ASTRA_SYSTEMS,
  SIRIUS_CHARMS,
  POLARIS_QUOTES,
  type AstraSystemId,
  type SiriusCategoryId,
  type SiriusCharmId,
  type PolarisTabId,
} from '../data';

/* ═══════════════════════════════════════════════
   ORDER VIEW — "Cùng tạo nên vũ trụ của riêng bạn"
   3-step charm customization → Cosmic Invoice → Payment → Success
   ═══════════════════════════════════════════════ */

const formatPrice = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(v);

export default function OrderView() {
  const { language } = useYouniverseApp();
  const router = useRouter();
  const t = translations[language];

  /* ── Step state ── */
  const [currentStep, setCurrentStep] = useState(1); // 1=Astra, 2=Sirius, 3=Polaris, 4=Invoice, 5=Success

  /* ── Step 1: Astra ── */
  const [astraSystem, setAstraSystem] = useState<AstraSystemId | null>(null);
  const [engraveChoice, setEngraveChoice] = useState<'engrave' | 'original' | null>(null);
  const [nickname, setNickname] = useState('');

  /* ── Step 2: Sirius ── */
  const [siriusCategory, setSiriusCategory] = useState<SiriusCategoryId | null>(null);
  const [siriusCharm, setSiriusCharm] = useState<SiriusCharmId | null>(null);
  const [siriusConfirmed, setSiriusConfirmed] = useState(false);
  const [showSiriusConfirmPopup, setShowSiriusConfirmPopup] = useState(false);
  const [pendingSiriusCharm, setPendingSiriusCharm] = useState<SiriusCharmId | null>(null);

  /* ── Step 3: Polaris ── */
  const [polarisTab, setPolarisTab] = useState<PolarisTabId>('preset');
  const [polarisPresetId, setPolarisPresetId] = useState<string | null>(null);
  const [polarisCustomText, setPolarisCustomText] = useState('');
  const [polarisCustomSealed, setPolarisCustomSealed] = useState(false);
  const [polarisSwapCharm, setPolarisSwapCharm] = useState<SiriusCharmId | null>(null);
  const [showPolarisConfirmPopup, setShowPolarisConfirmPopup] = useState(false);
  const [pendingPolarisQuote, setPendingPolarisQuote] = useState<string | null>(null);

  /* ── Step 4: Customer info ── */
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  /* ── Payment ── */
  const [paymentReceipt, setPaymentReceipt] = useState<string | null>(null);
  const [paymentFileName, setPaymentFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  /* ── Computed ── */
  const totalPrice = (() => {
    let p = 0;
    if (astraSystem) p += CHARM_PRODUCTS[0].price;
    if (siriusConfirmed && siriusCharm) p += CHARM_PRODUCTS[1].price;
    if (polarisTab === 'preset' && polarisPresetId) p += CHARM_PRODUCTS[2].price;
    if (polarisTab === 'custom' && polarisCustomSealed && polarisCustomText) p += CHARM_PRODUCTS[2].price;
    if (polarisTab === 'swap' && polarisSwapCharm) p += CHARM_PRODUCTS[1].price; // second sirius price
    return p;
  })();

  const selectedAstra = ASTRA_SYSTEMS.find(s => s.id === astraSystem);
  const selectedSirius = SIRIUS_CHARMS.find(c => c.id === siriusCharm);
  const otherCategory: SiriusCategoryId = siriusCategory === 'pet' ? 'drink' : 'pet';
  const remainingSiriusCharms = SIRIUS_CHARMS.filter(c => c.category === otherCategory);

  /* ── Handlers ── */
  const handleSiriusCharmClick = (id: SiriusCharmId) => {
    setPendingSiriusCharm(id);
    setShowSiriusConfirmPopup(true);
  };

  const confirmSirius = () => {
    if (pendingSiriusCharm) {
      setSiriusCharm(pendingSiriusCharm);
      setSiriusConfirmed(true);
    }
    setShowSiriusConfirmPopup(false);
    setPendingSiriusCharm(null);
  };

  const cancelSiriusConfirm = () => {
    setShowSiriusConfirmPopup(false);
    setPendingSiriusCharm(null);
  };

  const handlePolarisPresetClick = (id: string) => {
    setPendingPolarisQuote(id);
    setShowPolarisConfirmPopup(true);
  };

  const confirmPolarisPreset = () => {
    if (pendingPolarisQuote) {
      setPolarisPresetId(pendingPolarisQuote);
    }
    setShowPolarisConfirmPopup(false);
    setPendingPolarisQuote(null);
  };

  const cancelPolarisConfirm = () => {
    setShowPolarisConfirmPopup(false);
    setPendingPolarisQuote(null);
  };

  const handleFileChange = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setPaymentFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPaymentReceipt(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setTimeout(() => {
      progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleConfirmOrder = () => {
    goToStep(5);
  };

  /* ── Step completion checks ── */
  const step1Done = !!astraSystem && engraveChoice !== null;
  const step2Done = siriusConfirmed && !!siriusCharm;
  const step3Done =
    (polarisTab === 'preset' && !!polarisPresetId) ||
    (polarisTab === 'custom' && polarisCustomSealed && polarisCustomText.length > 0) ||
    (polarisTab === 'swap' && !!polarisSwapCharm);

  const stepIcons = [
    <Sparkles key="s" className="h-4 w-4" />,
    <Heart key="h" className="h-4 w-4" />,
    <Compass key="c" className="h-4 w-4" />,
    <ShoppingBag key="b" className="h-4 w-4" />,
  ];

  const stepLabels = [t.orderProgressAstra, t.orderProgressSirius, t.orderProgressPolaris, t.orderProgressOwn];
  const stepColors = ['bg-blue-500', 'bg-amber-500', 'bg-rose-500', 'bg-emerald-500'];
  const stepDone = [step1Done, step2Done, step3Done, false];

  /* ═════════════════════ RENDER ═════════════════════ */

  if (currentStep === 5) {
    /* ── SUCCESS SCREEN ── */
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-stone-900 to-indigo-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Floating sparkles — nhiều + đa sắc */}
        {[
          { pos: 'top-12 left-[10%]', color: 'text-amber-400', char: '✦', delay: 0 },
          { pos: 'top-20 right-[15%]', color: 'text-blue-400', char: '✸', delay: 0.3 },
          { pos: 'bottom-24 left-[20%]', color: 'text-rose-400', char: '✶', delay: 0.6 },
          { pos: 'bottom-16 right-[25%]', color: 'text-amber-300', char: '✧', delay: 0.9 },
          { pos: 'top-1/3 left-[5%]', color: 'text-purple-400', char: '✹', delay: 1.2 },
          { pos: 'top-1/4 right-[8%]', color: 'text-amber-400', char: '✦', delay: 1.5 },
          { pos: 'top-[60%] left-[8%]', color: 'text-blue-300', char: '◆', delay: 0.5 },
          { pos: 'top-[40%] right-[5%]', color: 'text-rose-300', char: '✶', delay: 2 },
          { pos: 'top-[75%] right-[12%]', color: 'text-amber-400', char: '✸', delay: 1.8 },
          { pos: 'bottom-[30%] left-[12%]', color: 'text-blue-400', char: '✦', delay: 0.8 },
        ].map((s, i) => (
          <div key={i} className={`absolute ${s.pos} text-2xl ${s.color} animate-twinkle`} style={{ animationDelay: `${s.delay}s` }}>{s.char}</div>
        ))}

        <div className="relative z-10 max-w-lg w-full text-center space-y-8">
          <div className="text-8xl animate-bounce">✨</div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            {t.orderSuccessTitle}
          </h1>
          <p className="font-sans text-stone-300 text-sm leading-relaxed max-w-md mx-auto">
            {t.orderSuccessText}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-white text-black font-display text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-2xl border-2 border-white shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>{t.orderSuccessBackHome}</span>
            </button>
            <button
              onClick={() => router.push('/products')}
              className="flex items-center gap-2 border-2 border-white/60 hover:bg-white/10 text-white font-display text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-2xl transition-all duration-150 cursor-pointer"
            >
              <span>{t.orderSuccessExplore}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 text-stone-800 relative overflow-hidden bg-gradient-to-br from-[#f0ecff] via-[#f5f0ff] to-[#e8e4ff]" id="order-view">
      {/* Background grid — tím nhạt */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#b4aee010_1px,transparent_1px),linear-gradient(to_bottom,#b4aee010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Decorative floating sparkles — page-level */}
      <div className="absolute top-[12%] left-[2%] text-3xl text-amber-400/50 animate-twinkle pointer-events-none select-none z-0" style={{ animationDelay: '0.3s' }}>✦</div>
      <div className="absolute top-[28%] right-[2%] text-2xl text-blue-500/40 animate-float-sparkle pointer-events-none select-none z-0" style={{ animationDelay: '1s' }}>✧</div>
      <div className="absolute top-[55%] left-[3%] text-xl text-rose-400/35 animate-twinkle pointer-events-none select-none z-0" style={{ animationDelay: '2s' }}>✶</div>
      <div className="absolute top-[70%] right-[3%] text-lg text-amber-500/30 animate-float-sparkle pointer-events-none select-none z-0" style={{ animationDelay: '0.8s' }}>✸</div>
      <div className="absolute top-[85%] left-[6%] text-base text-purple-400/35 animate-twinkle pointer-events-none select-none z-0" style={{ animationDelay: '1.5s' }}>✹</div>
      <div className="absolute top-[40%] right-[1.5%] text-sm text-blue-400/25 animate-float-sparkle pointer-events-none select-none z-0" style={{ animationDelay: '2.5s' }}>◆</div>

      {/* ═══ HERO SECTION ═══ — Dark cosmic banner */}
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto mt-6 border-2 border-stone-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.85)] z-10">
        <div className="bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-900 px-6 py-10 md:px-12 md:py-14">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Floating sparkles — nhiều + đa dạng */}
          <div className="absolute top-5 right-8 text-2xl text-amber-400 animate-twinkle" style={{ animationDelay: '0s' }}>✦</div>
          <div className="absolute top-8 left-10 text-xl text-blue-400 animate-twinkle" style={{ animationDelay: '1s' }}>✸</div>
          <div className="absolute top-1/2 right-[15%] text-rose-400/70 animate-twinkle" style={{ animationDelay: '2s' }}>✶</div>
          <div className="absolute bottom-6 left-[20%] text-amber-300/60 animate-float-sparkle" style={{ animationDelay: '0.5s' }}>✧</div>
          <div className="absolute bottom-8 right-[30%] text-blue-300/50 animate-twinkle" style={{ animationDelay: '1.8s' }}>✹</div>
          <div className="absolute top-[30%] left-[5%] text-purple-400/40 animate-float-sparkle" style={{ animationDelay: '3s' }}>◆</div>
          <div className="absolute top-[15%] right-[35%] text-amber-400/30 animate-twinkle" style={{ animationDelay: '2.3s' }}>✦</div>

          {/* Title */}
          <div className="text-center relative z-10 mb-8">
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
              {t.orderHeroTitle}
            </h1>
            <p className="font-sans text-stone-300 text-xs md:text-sm mt-3 max-w-lg mx-auto">
              {t.orderHeroSubtitle}
            </p>
          </div>

          {/* Gallery — 3 charm stock photos */}
          <div className="relative z-10 flex items-center gap-4 md:gap-6 justify-center">
            {['/images/charm-stock-1.jpg', '/images/charm-stock-2.jpg', '/images/charm-stock-3.jpg'].map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden border-2 transition-all duration-500 ${
                  i === 1
                    ? 'w-32 h-32 md:w-44 md:h-44 rounded-2xl border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
                    : 'w-24 h-24 md:w-36 md:h-36 rounded-2xl border-stone-600'
                }`}
              >
                <img src={src} alt={`Charm sample ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}

            {/* Caption card */}
            <div className="hidden lg:block max-w-[220px] space-y-2">
              <p className="font-display text-sm font-black text-amber-300 uppercase tracking-wide">
                {t.orderGalleryLabel}
              </p>
              <p className="font-sans text-stone-400 text-xs leading-relaxed">
                {t.orderGalleryCaption}
              </p>
            </div>
          </div>

          {/* Mobile caption */}
          <p className="lg:hidden font-sans text-stone-400 text-[10px] text-center mt-4 max-w-sm mx-auto leading-relaxed relative z-10">
            {t.orderGalleryCaption}
          </p>
        </div>
      </section>

      {/* ═══ PROGRESS BAR ═══ */}
      <div ref={progressRef} className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 pb-4 relative z-10">
        <div className="bg-white border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] rounded-2xl px-6 py-5">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center flex-shrink-0">
                  <button
                    onClick={() => {
                      if (i + 1 <= currentStep || stepDone[i]) goToStep(i + 1);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-display text-sm font-black transition-all duration-300 cursor-pointer border-2 border-stone-900 ${
                      currentStep > i + 1 || (i + 1 === currentStep && stepDone[i] && currentStep < 4)
                        ? 'bg-emerald-500 shadow-[2px_2px_0px_rgba(5,150,105,0.5)]'
                        : currentStep === i + 1
                        ? `${stepColors[i]} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] scale-110`
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {currentStep > i + 1 || (stepDone[i] && currentStep > i + 1) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      stepIcons[i]
                    )}
                  </button>
                  <span
                    className={`font-display text-[9px] font-black uppercase tracking-wider mt-2 max-w-[80px] leading-tight ${
                      currentStep === i + 1 ? 'text-stone-900' : 'text-stone-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                      currentStep > i + 1 ? 'bg-emerald-500' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ STEP CONTENT CONTAINER ═══ */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 pb-4">
        <div className="bg-white border-2 border-stone-900 rounded-3xl p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.75)] min-h-[480px]">

          {/* ═══ STEP 1: ASTRA ═══ */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fade-in">
              {/* Badge + title */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-blue-500 border-2 border-stone-900 rounded-full px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  <span className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {t.orderStep1Badge}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight">
                  {t.orderStep1Title}
                </h2>
                <p className="font-sans text-stone-600 text-sm leading-relaxed max-w-xl">
                  {t.orderStep1Intro}
                </p>
              </div>

              {/* 3 System cards */}
              <div className="space-y-3">
                <label className="font-display text-[10px] font-black uppercase tracking-wider text-stone-700">
                  {t.orderStep1SelectSystem}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {ASTRA_SYSTEMS.map((sys) => {
                    const isActive = astraSystem === sys.id;
                    return (
                      <button
                        key={sys.id}
                        onClick={() => setAstraSystem(sys.id)}
                        className={`group relative rounded-2xl overflow-hidden border-2 p-5 text-center transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'border-blue-600 bg-blue-50 shadow-[4px_4px_0px_rgba(37,99,235,0.4)]'
                            : 'border-stone-300 bg-white hover:border-stone-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                        }`}
                      >
                        {/* Charm image circle */}
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-stone-900 mb-4 group-hover:scale-105 transition-transform duration-300">
                          <img src={sys.image} alt={language === 'vi' ? sys.nameVi : sys.nameEn} className="w-full h-full object-cover" />
                        </div>
                        {/* Emoji + name */}
                        <p className="text-2xl mb-1">{sys.emoji}</p>
                        <p className="font-display text-sm font-black text-stone-900">
                          {language === 'vi' ? sys.nameVi : sys.nameEn}
                        </p>
                        <p className="font-sans text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                          {language === 'vi' ? sys.descVi : sys.descEn}
                        </p>
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-blue-600 border-2 border-stone-900 shadow-[2px_2px_0_#000] flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Engrave section — revealed after selecting system */}
              {astraSystem && (
                <div className="space-y-5 animate-fade-in border-t-2 border-stone-100 pt-6">
                  <p className="font-sans text-stone-700 text-sm leading-relaxed">
                    {t.orderStep1EngraveName}
                  </p>

                  {/* Comparison images */}
                  <div className="flex gap-4 justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-stone-300 mx-auto relative">
                        <img src={selectedAstra?.image || ''} alt="Original" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-display text-[10px] font-black uppercase tracking-wider text-stone-500">
                        {t.orderStep1EngraveCompareOriginal}
                      </span>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-blue-500 shadow-[3px_3px_0_rgba(37,99,235,0.4)] mx-auto relative">
                        <img src={selectedAstra?.image || ''} alt="With engraving" className="w-full h-full object-cover" />
                        {/* Text overlay simulation */}
                        <div className="absolute inset-0 bg-black/25 flex items-end justify-center pb-2">
                          <span className="font-display text-white text-xs font-bold tracking-wider bg-black/50 px-2 py-0.5 rounded">
                            {nickname || 'Your Name'}
                          </span>
                        </div>
                      </div>
                      <span className="font-display text-[10px] font-black uppercase tracking-wider text-blue-600">
                        {t.orderStep1EngraveCompareEngrave}
                      </span>
                    </div>
                  </div>

                  {/* 2 buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <button
                      onClick={() => setEngraveChoice('engrave')}
                      className={`flex-1 py-3.5 px-5 rounded-xl font-display text-xs font-black uppercase tracking-wider border-2 transition-all duration-150 cursor-pointer ${
                        engraveChoice === 'engrave'
                          ? 'border-blue-600 bg-blue-500 text-white shadow-[3px_3px_0_rgba(0,0,0,0.3)] translate-x-0 translate-y-0'
                          : 'border-stone-900 text-stone-700 bg-white shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]'
                      }`}
                    >
                      ✨ {t.orderStep1EngraveBtn}
                    </button>
                    <button
                      onClick={() => { setEngraveChoice('original'); setNickname(''); }}
                      className={`flex-1 py-3.5 px-5 rounded-xl font-display text-xs font-black uppercase tracking-wider border-2 transition-all duration-150 cursor-pointer ${
                        engraveChoice === 'original'
                          ? 'border-stone-900 bg-stone-900 text-white shadow-[3px_3px_0_rgba(0,0,0,0.3)]'
                          : 'border-stone-900 text-stone-700 bg-white shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]'
                      }`}
                    >
                      {t.orderStep1OriginalBtn}
                    </button>
                  </div>

                  {/* Name input */}
                  {engraveChoice === 'engrave' && (
                    <div className="max-w-md mx-auto animate-fade-in">
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value.slice(0, 8))}
                        maxLength={8}
                        placeholder={t.orderStep1EngraveInput}
                        className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-white border-2 border-stone-900 shadow-[3px_3px_0_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[3px_3px_0_rgba(37,99,235,0.5)] transition-all text-center font-bold"
                      />
                      <p className="font-mono text-[10px] text-stone-500 text-center mt-1.5 font-bold">
                        {nickname.length}/8
                      </p>
                    </div>
                  )}
                </div>
              )}

          {/* CTA */}
              {step1Done && (
                <div className="pt-4 flex justify-end animate-fade-in">
                  <button
                    onClick={() => goToStep(2)}
                    className="flex items-center gap-2 bg-blue-600 text-white font-display text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-pointer group"
                  >
                    <span>{t.orderStep1Continue}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ═══ STEP 2: SIRIUS ═══ */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-amber-400 border-2 border-stone-900 rounded-full px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Heart className="h-3.5 w-3.5 text-stone-900" />
                  <span className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">
                    {t.orderStep2Badge}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight">
                  {t.orderStep2Title}
                </h2>
                <p className="font-sans text-stone-600 text-sm leading-relaxed max-w-xl">
                  {t.orderStep2Intro}
                </p>
              </div>

              {/* Category question */}
              <div className="space-y-3">
                <p className="font-sans text-stone-700 text-sm font-bold leading-relaxed">
                  {t.orderStep2Question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => { setSiriusCategory('pet'); setSiriusCharm(null); setSiriusConfirmed(false); }}
                    className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer group ${
                      siriusCategory === 'pet'
                        ? 'border-amber-500 bg-amber-50 shadow-[4px_4px_0px_rgba(245,158,11,0.4)]'
                        : 'border-stone-300 bg-white hover:border-stone-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                    }`}
                  >
                    <PawPrint className={`h-10 w-10 mx-auto mb-3 transition-colors ${siriusCategory === 'pet' ? 'text-amber-500' : 'text-stone-400 group-hover:text-stone-700'}`} />
                    <p className="font-display text-sm font-black text-stone-900 uppercase tracking-wide">
                      🐾 {t.orderStep2Pet}
                    </p>
                  </button>
                  <button
                    onClick={() => { setSiriusCategory('drink'); setSiriusCharm(null); setSiriusConfirmed(false); }}
                    className={`p-6 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer group ${
                      siriusCategory === 'drink'
                        ? 'border-amber-500 bg-amber-50 shadow-[4px_4px_0px_rgba(245,158,11,0.4)]'
                        : 'border-stone-300 bg-white hover:border-stone-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                    }`}
                  >
                    <Coffee className={`h-10 w-10 mx-auto mb-3 transition-colors ${siriusCategory === 'drink' ? 'text-amber-500' : 'text-stone-400 group-hover:text-stone-700'}`} />
                    <p className="font-display text-sm font-black text-stone-900 uppercase tracking-wide">
                      ☕ {t.orderStep2Drink}
                    </p>
                  </button>
                </div>
              </div>

              {/* Charm options */}
              {siriusCategory && (
                <div className="space-y-4 animate-fade-in border-t-2 border-stone-100 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {SIRIUS_CHARMS.filter(c => c.category === siriusCategory).map((charm) => {
                      const isSelected = siriusCharm === charm.id && siriusConfirmed;
                      return (
                        <div
                          key={charm.id}
                          className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 shadow-[3px_3px_0px_rgba(5,150,105,0.4)]'
                              : 'border-stone-300 bg-white hover:border-stone-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                          }`}
                        >
                          {/* Image */}
                          <div className="aspect-square overflow-hidden">
                            <img src={charm.image} alt={language === 'vi' ? charm.nameVi : charm.nameEn} className="w-full h-full object-cover" />
                          </div>
                          {/* Info + add button */}
                          <div className="p-4 flex items-center justify-between">
                            <div>
                              <p className="text-xl">{charm.emoji}</p>
                              <p className="font-display text-sm font-black text-stone-900 mt-1">
                                {language === 'vi' ? charm.nameVi : charm.nameEn}
                              </p>
                            </div>
                            {isSelected ? (
                              <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleSiriusCharmClick(charm.id)}
                                className="w-10 h-10 rounded-full bg-amber-400 border-2 border-stone-900 shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center text-stone-900 transition-all duration-150 cursor-pointer"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          {/* Selected overlay text */}
                          {isSelected && (
                            <div className="absolute top-3 right-3 bg-emerald-500 border border-emerald-700 text-white text-[9px] font-display font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                              ✓ {t.orderStep2Selected}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Confirm popup */}
                  {showSiriusConfirmPopup && pendingSiriusCharm && (
                    <div className="bg-white border-2 border-amber-400 shadow-[4px_4px_0px_rgba(245,158,11,0.35)] rounded-2xl p-5 text-center space-y-4 animate-fade-in">
                      <p className="font-sans text-stone-800 text-sm font-semibold">
                        {t.orderStep2ConfirmTitle.replace('{name}',
                          language === 'vi'
                            ? (SIRIUS_CHARMS.find(c => c.id === pendingSiriusCharm)?.nameVi || '')
                            : (SIRIUS_CHARMS.find(c => c.id === pendingSiriusCharm)?.nameEn || '')
                        )}
                      </p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={confirmSirius}
                          className="bg-amber-400 border-2 border-stone-900 shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] text-stone-900 font-display text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
                        >
                          {t.orderStep2ConfirmYes}
                        </button>
                        <button
                          onClick={cancelSiriusConfirm}
                          className="border-2 border-stone-900 text-stone-700 bg-white font-display text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all duration-150 cursor-pointer hover:bg-stone-100"
                        >
                          {t.orderStep2ConfirmNo}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Encourage text */}
                  {siriusConfirmed && (
                    <p className="font-display text-amber-600 text-base text-center font-black animate-fade-in">
                      ✨ {t.orderStep2Encourage} ✨
                    </p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-stone-100 mt-4">
                <button
                  onClick={() => goToStep(1)}
                  className="text-stone-600 hover:text-stone-900 font-display text-xs font-black uppercase tracking-wider cursor-pointer transition-colors underline underline-offset-4"
                >
                  ← {language === 'vi' ? 'Quay lại' : 'Back'}
                </button>
                {step2Done && (
                  <button
                    onClick={() => goToStep(3)}
                    className="flex items-center gap-2 bg-amber-400 text-stone-900 font-display text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-pointer group animate-fade-in"
                  >
                    <span>{t.orderStep2Continue}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═══ STEP 3: POLARIS ═══ */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-rose-500 border-2 border-stone-900 rounded-full px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Compass className="h-3.5 w-3.5 text-white" />
                  <span className="font-display text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {t.orderStep3Badge}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight">
                  {t.orderStep3Title}
                </h2>
                <p className="font-sans text-stone-600 text-sm leading-relaxed max-w-xl">
                  {t.orderStep3Intro}
                </p>
              </div>

              {/* 3 Tab buttons */}
              <div className="flex flex-wrap gap-2">
                {([
                  { id: 'preset' as PolarisTabId, icon: '🔮', label: t.orderStep3Tab1, desc: t.orderStep3Tab1Desc },
                  { id: 'custom' as PolarisTabId, icon: '✍️', label: t.orderStep3Tab2, desc: t.orderStep3Tab2Desc },
                  { id: 'swap' as PolarisTabId, icon: '🔄', label: t.orderStep3Tab3, desc: t.orderStep3Tab3Desc },
                ]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPolarisTab(tab.id)}
                    className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                      polarisTab === tab.id
                        ? 'border-rose-500 bg-rose-50 shadow-[3px_3px_0px_rgba(244,63,94,0.3)]'
                        : 'border-stone-300 bg-white hover:border-stone-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)] hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <p className="font-display text-[10px] font-black uppercase tracking-wider text-stone-900 mt-1">
                      {tab.label}
                    </p>
                    <p className="font-sans text-[9px] text-stone-500 mt-0.5">{tab.desc}</p>
                  </button>
                ))}
              </div>

              {/* ── Tab 1: Preset Quotes ── */}
              {polarisTab === 'preset' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {POLARIS_QUOTES.map((q) => {
                      const isSelected = polarisPresetId === q.id;
                      return (
                        <div
                          key={q.id}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 shadow-[3px_3px_0px_rgba(5,150,105,0.35)]'
                              : 'border-stone-300 bg-white hover:border-stone-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                          }`}
                        >
                          <p className="font-sans text-xs text-stone-700 italic leading-relaxed pr-8">
                            &ldquo;{language === 'vi' ? q.textVi : q.textEn}&rdquo;
                          </p>
                          {isSelected ? (
                            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-white" />
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePolarisPresetClick(q.id)}
                              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-rose-500 border-2 border-stone-900 shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center text-white transition-all duration-150 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Confirm popup */}
                  {showPolarisConfirmPopup && pendingPolarisQuote && (
                    <div className="bg-white border-2 border-rose-400 shadow-[4px_4px_0px_rgba(244,63,94,0.3)] rounded-2xl p-5 text-center space-y-4 animate-fade-in">
                      <p className="font-sans text-stone-800 text-sm font-semibold">{t.orderStep3Tab1Confirm}</p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={confirmPolarisPreset}
                          className="bg-rose-500 border-2 border-stone-900 shadow-[3px_3px_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] text-white font-display text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
                        >
                          {t.orderStep2ConfirmYes}
                        </button>
                        <button
                          onClick={cancelPolarisConfirm}
                          className="border-2 border-stone-900 text-stone-700 bg-white font-display text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all duration-150 cursor-pointer hover:bg-stone-100"
                        >
                          {t.orderStep2ConfirmNo}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab 2: Custom Quote ── */}
              {polarisTab === 'custom' && (
                <div className="space-y-4 animate-fade-in max-w-lg mx-auto">
                  <label className="font-display text-[10px] font-black uppercase tracking-wider text-stone-700 block">
                    {t.orderStep3Tab2Label}
                  </label>
                  <div className="relative">
                    <textarea
                      value={polarisCustomText}
                      onChange={(e) => {
                        if (e.target.value.length <= 15) {
                          setPolarisCustomText(e.target.value);
                          setPolarisCustomSealed(false);
                        }
                      }}
                      maxLength={15}
                      rows={3}
                      placeholder={t.orderStep3Tab2Placeholder}
                      className={`w-full px-5 py-4 text-base font-sans rounded-2xl border-2 focus:outline-none transition-all resize-none text-center italic ${
                        polarisCustomText.length > 15
                          ? 'border-red-400 bg-red-50/50 focus:border-red-500'
                          : 'border-stone-900 bg-gradient-to-br from-violet-50 to-rose-50 shadow-[3px_3px_0_rgba(0,0,0,0.15)] focus:shadow-[3px_3px_0_rgba(244,63,94,0.4)]'
                      }`}
                    />
                    <p className={`font-mono text-[10px] text-right mt-1 font-bold ${polarisCustomText.length > 15 ? 'text-red-500' : 'text-stone-500'}`}>
                      {t.orderStep3Tab2CharCount.replace('{count}', String(polarisCustomText.length))}
                    </p>
                  </div>

                  {/* Example validation */}
                  <div className="bg-stone-50 border-2 border-stone-200 rounded-xl p-3 space-y-1.5">
                    <p className="font-sans text-[10px] text-stone-500 font-black uppercase tracking-wider">
                      {language === 'vi' ? 'Ví dụ:' : 'Examples:'}
                    </p>
                    <p className="font-sans text-[11px] text-emerald-600">✓ Kiêu và ham ăn (12 {language === 'vi' ? 'ký tự' : 'chars'})</p>
                    <p className="font-sans text-[11px] text-red-500">✗ Học Bổng Xuất Sắc (17 {language === 'vi' ? 'ký tự' : 'chars'})</p>
                  </div>

                  {polarisCustomText.length > 0 && polarisCustomText.length <= 15 && !polarisCustomSealed && (
                    <button
                      onClick={() => setPolarisCustomSealed(true)}
                      className="w-full bg-rose-500 text-white font-display text-xs font-black uppercase tracking-wider py-3.5 rounded-xl border-2 border-stone-900 shadow-[4px_4px_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-pointer animate-fade-in"
                    >
                      {t.orderStep3Tab2Btn}
                    </button>
                  )}

                  {polarisCustomSealed && (
                    <div className="bg-emerald-50 border-2 border-emerald-500 shadow-[3px_3px_0_rgba(5,150,105,0.3)] rounded-xl p-4 text-center animate-fade-in">
                      <Check className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                      <p className="font-display text-emerald-700 text-sm font-black">
                        &ldquo;{polarisCustomText}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Tab 3: Swap (Extra Sirius) ── */}
              {polarisTab === 'swap' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="font-sans text-stone-700 text-sm leading-relaxed">
                    {t.orderStep3Tab3Desc2}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {remainingSiriusCharms.map((charm) => {
                      const isSelected = polarisSwapCharm === charm.id;
                      return (
                        <button
                          key={charm.id}
                          onClick={() => setPolarisSwapCharm(charm.id)}
                          className={`relative rounded-2xl overflow-hidden border-2 p-4 text-center transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 shadow-[3px_3px_0px_rgba(5,150,105,0.4)]'
                              : 'border-stone-300 bg-white hover:border-stone-900 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden border-2 border-stone-300 mb-3">
                            <img src={charm.image} alt={language === 'vi' ? charm.nameVi : charm.nameEn} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-2xl mb-1">{charm.emoji}</p>
                          <p className="font-display text-xs font-black text-stone-900">
                            {language === 'vi' ? charm.nameVi : charm.nameEn}
                          </p>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-700 flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-stone-100 mt-4">
                <button
                  onClick={() => goToStep(2)}
                  className="text-stone-600 hover:text-stone-900 font-display text-xs font-black uppercase tracking-wider cursor-pointer transition-colors underline underline-offset-4"
                >
                  ← {language === 'vi' ? 'Quay lại' : 'Back'}
                </button>
                {step3Done && (
                  <button
                    onClick={() => goToStep(4)}
                    className="flex items-center gap-2 bg-rose-500 text-white font-display text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-2xl border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-pointer group animate-fade-in"
                  >
                    <span>{language === 'vi' ? 'Hoàn tất lựa chọn' : 'Finalize Selections'}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═══ STEP 4: COSMIC INVOICE + PAYMENT ═══ */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-fade-in">
              {/* Invoice header */}
              <div className="text-center space-y-2">
                <Sparkles className="h-6 w-6 text-amber-500 mx-auto" />
                <h2 className="font-display text-2xl font-black text-stone-900 uppercase tracking-tight">
                  {t.orderInvoiceTitle}
                </h2>
                <p className="font-sans text-stone-500 text-sm">{t.orderInvoiceSubtitle}</p>
              </div>

              {/* Invoice items */}
              <div className="bg-gradient-to-br from-stone-900 via-indigo-950 to-stone-900 rounded-2xl p-6 md:p-8 text-white space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* Astra line */}
                {selectedAstra && (
                  <div className="flex items-center justify-between relative z-10 pb-3 border-b border-stone-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-display text-xs font-bold text-white uppercase">Charm Astra</p>
                        <p className="font-sans text-[10px] text-stone-400">
                          {language === 'vi' ? selectedAstra.nameVi : selectedAstra.nameEn}
                          {engraveChoice === 'engrave' && nickname ? ` — "${nickname}"` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-sans text-sm text-stone-300">{formatPrice(CHARM_PRODUCTS[0].price)}</span>
                  </div>
                )}

                {/* Sirius line */}
                {selectedSirius && (
                  <div className="flex items-center justify-between relative z-10 pb-3 border-b border-stone-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-display text-xs font-bold text-white uppercase">Charm Sirius</p>
                        <p className="font-sans text-[10px] text-stone-400">
                          {selectedSirius.emoji} {language === 'vi' ? selectedSirius.nameVi : selectedSirius.nameEn}
                        </p>
                      </div>
                    </div>
                    <span className="font-sans text-sm text-stone-300">{formatPrice(CHARM_PRODUCTS[1].price)}</span>
                  </div>
                )}

                {/* Polaris / Swap line */}
                {polarisTab === 'preset' && polarisPresetId && (
                  <div className="flex items-center justify-between relative z-10 pb-3 border-b border-stone-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                        <Compass className="h-4 w-4 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-display text-xs font-bold text-white uppercase">Charm Polaris</p>
                        <p className="font-sans text-[10px] text-stone-400 max-w-[200px] truncate italic">
                          &ldquo;{POLARIS_QUOTES.find(q => q.id === polarisPresetId)?.[language === 'vi' ? 'textVi' : 'textEn']}&rdquo;
                        </p>
                      </div>
                    </div>
                    <span className="font-sans text-sm text-stone-300">{formatPrice(CHARM_PRODUCTS[2].price)}</span>
                  </div>
                )}

                {polarisTab === 'custom' && polarisCustomSealed && polarisCustomText && (
                  <div className="flex items-center justify-between relative z-10 pb-3 border-b border-stone-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                        <Compass className="h-4 w-4 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-display text-xs font-bold text-white uppercase">Charm Polaris — {t.orderCustomQuote}</p>
                        <p className="font-sans text-[10px] text-stone-400 italic">&ldquo;{polarisCustomText}&rdquo;</p>
                      </div>
                    </div>
                    <span className="font-sans text-sm text-stone-300">{formatPrice(CHARM_PRODUCTS[2].price)}</span>
                  </div>
                )}

                {polarisTab === 'swap' && polarisSwapCharm && (
                  <div className="flex items-center justify-between relative z-10 pb-3 border-b border-stone-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-display text-xs font-bold text-white uppercase">Charm Sirius #2 — {t.orderSwapCharm}</p>
                        <p className="font-sans text-[10px] text-stone-400">
                          {SIRIUS_CHARMS.find(c => c.id === polarisSwapCharm)?.emoji}{' '}
                          {language === 'vi'
                            ? SIRIUS_CHARMS.find(c => c.id === polarisSwapCharm)?.nameVi
                            : SIRIUS_CHARMS.find(c => c.id === polarisSwapCharm)?.nameEn}
                        </p>
                      </div>
                    </div>
                    <span className="font-sans text-sm text-stone-300">{formatPrice(CHARM_PRODUCTS[1].price)}</span>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between relative z-10 pt-2">
                  <span className="font-display text-sm font-bold text-white uppercase tracking-wider">{t.orderInvoiceTotal}</span>
                  <span className="font-display text-2xl font-black text-amber-400">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Customer info form */}
              <div className="space-y-5">
                <h3 className="font-display text-sm font-black text-stone-900 uppercase tracking-wider border-b-2 border-stone-900 pb-1 inline-block">
                  {t.orderInvoiceCustomerInfo}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-display text-[10px] font-black uppercase tracking-wider text-stone-600">{t.orderInvoiceFullName}</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-white border-2 border-stone-900 shadow-[2px_2px_0_rgba(0,0,0,0.15)] focus:outline-none focus:shadow-[2px_2px_0_rgba(0,0,0,0.4)] transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-[10px] font-black uppercase tracking-wider text-stone-600">{t.orderInvoicePhone}</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-white border-2 border-stone-900 shadow-[2px_2px_0_rgba(0,0,0,0.15)] focus:outline-none focus:shadow-[2px_2px_0_rgba(0,0,0,0.4)] transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-[10px] font-black uppercase tracking-wider text-stone-600">{t.orderInvoiceEmail}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-white border-2 border-stone-900 shadow-[2px_2px_0_rgba(0,0,0,0.15)] focus:outline-none focus:shadow-[2px_2px_0_rgba(0,0,0,0.4)] transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-[10px] font-black uppercase tracking-wider text-stone-600">{t.orderInvoiceAddress}</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                      className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-white border-2 border-stone-900 shadow-[2px_2px_0_rgba(0,0,0,0.15)] focus:outline-none focus:shadow-[2px_2px_0_rgba(0,0,0,0.4)] transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-black uppercase tracking-wider text-stone-600">{t.orderInvoiceNote}</label>
                  <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder={t.orderInvoiceNotePlaceholder}
                    className="w-full px-4 py-3 text-sm font-sans rounded-xl bg-white border-2 border-stone-900 shadow-[2px_2px_0_rgba(0,0,0,0.15)] focus:outline-none focus:shadow-[2px_2px_0_rgba(0,0,0,0.4)] transition-all resize-none" />
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-5 border-t border-stone-100 pt-6">
                <h3 className="font-display text-sm font-bold text-stone-900 uppercase tracking-wider">
                  {t.orderPaymentTitle}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* QR Code placeholder */}
                  <div className="text-center space-y-3">
                    <p className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      {t.orderPaymentQrLabel}
                    </p>
                    <div className="w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <ShoppingBag className="h-8 w-8 text-stone-300 mx-auto" />
                        <p className="font-sans text-[10px] text-stone-400 max-w-[120px]">{t.orderPaymentQrPlaceholder}</p>
                      </div>
                    </div>
                  </div>

                  {/* Upload receipt */}
                  <div className="space-y-3">
                    <p className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      {t.orderPaymentUploadLabel}
                    </p>
                    <div
                      onDrop={onDrop}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100/50 transition-all cursor-pointer flex items-center justify-center"
                    >
                      {paymentReceipt ? (
                        <div className="relative w-full h-full">
                          <img src={paymentReceipt} alt="Receipt" className="w-full h-full object-contain rounded-xl p-2" />
                          <button
                            onClick={(e) => { e.stopPropagation(); setPaymentReceipt(null); setPaymentFileName(''); }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <Upload className="h-8 w-8 text-stone-300 mx-auto" />
                          <p className="font-display text-[10px] font-bold uppercase tracking-wider text-stone-500">{t.orderPaymentUploadBtn}</p>
                          <p className="font-sans text-[9px] text-stone-400">{t.orderPaymentUploadHint}</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileInputChange} className="hidden" />
                    {paymentFileName && (
                      <p className="font-mono text-[10px] text-stone-400 truncate">📎 {paymentFileName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-stone-100 mt-4">
                <button
                  onClick={() => goToStep(3)}
                  className="text-stone-600 hover:text-stone-900 font-display text-xs font-black uppercase tracking-wider cursor-pointer transition-colors underline underline-offset-4"
                >
                  ← {language === 'vi' ? 'Quay lại' : 'Back'}
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={!fullName || !phone || !address}
                  className="flex items-center gap-2 bg-amber-400 disabled:bg-stone-200 disabled:border-stone-300 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed text-stone-900 font-display text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-xl border-2 border-stone-900 shadow-[4px_4px_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t.orderConfirmBtn}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
