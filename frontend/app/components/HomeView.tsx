import { useState } from 'react';
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
import { PageType, CustomJewelry } from '../types';
import { CHARM_PRODUCTS } from '../data';

interface HomeViewProps {
  onNavigate: (page: PageType) => void;
  onAddCustomToCart: (jewelry: CustomJewelry) => void;
}

export default function HomeView({ onNavigate, onAddCustomToCart }: HomeViewProps) {
  // Product Line Showcase states
  const [activeCharmIndex, setActiveCharmIndex] = useState<number | null>(null);

  // Customizer live preview state representing the "How to Build Your YOUniverse" 3-step engine
  const [jewelryType, setJewelryType] = useState<'bracelet' | 'necklace' | 'cord'>('bracelet');
  const [vibeColor, setVibeColor] = useState<string>('blue'); // 'blue' | 'yellow' | 'red' | 'indigo'
  const [selectedCharms, setSelectedCharms] = useState<string[]>(['astra', 'sirius']);
  const [customName, setCustomName] = useState<string>('UNI');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    
    setSuccessMessage(`Đã thêm thiết kế cá nhân hóa "${customName}" của bạn vào giỏ hàng thành công!`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  return (
    <div className="space-y-16 pb-24" id="home-view">
      
      {/* 1. Hero Block / Banner Section */}
      <section className="relative overflow-hidden bg-stone-50 py-20 px-4 md:px-8 tracking-wide">
        <div className="absolute inset-0 cosmic-banner-glow pointer-events-none" />
        
        {/* Decorative blinking stars */}
        <div className="absolute top-12 left-10 text-amber-300 animate-twinkle">✦</div>
        <div className="absolute top-24 right-1/4 text-red-300 animate-twinkle duration-1000">✦</div>
        <div className="absolute bottom-16 left-1/3 text-blue-300 animate-twinkle duration-2000">✦</div>
        <div className="absolute bottom-1/2 right-12 text-stone-300 animate-twinkle">✦</div>

        <div className="mx-auto max-w-7xl relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left intro text info */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-black text-white text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-spin-slow" />
                <span>Launch Edition 2026</span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black leading-none">
                BẢN SẮC <br className="hidden sm:inline" />
                <span className="text-stroke-accent tracking-widest">ĐỘC BẢN</span> <br />
                VŨ TRỤ RIÊNG BIỆT
              </h1>
              
              <p className="font-sans text-stone-600 text-base md:text-lg leading-relaxed max-w-lg">
                Thế giới nội tâm của bạn vốn đa sắc màu. Đừng bó hẹp cá tính tinh tế của bản thân trong những chiếc phụ kiện rập khuôn. Hãy cùng <strong className="text-black font-semibold">YOUniverse</strong> đeo chiếc bùa thiên vân may mắn và dệt nên câu chuyện vũ trụ của riêng bạn.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  id="hero-go-products"
                  onClick={() => onNavigate('products')}
                  className="rounded-full bg-black hover:bg-stone-900 border-2 border-black text-white font-display text-sm font-bold tracking-widest uppercase px-8 py-4 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0] text-center"
                >
                  Our UNIverse Charms
                </button>
                <a
                  href="#customizer-workshop"
                  className="rounded-full bg-transparent hover:bg-stone-100 border-2 border-stone-800 text-stone-800 font-display text-sm font-bold tracking-widest uppercase px-8 py-4 transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[0] text-center"
                >
                  Tự Thiết Kế 3 Bước ↓
                </a>
              </div>
            </div>

            {/* Right aesthetic visual interactive card (The missing banner is replaced with stellar craft) */}
            <div className="relative flex justify-center">
              <div className="relative w-72 h-96 sm:w-80 sm:h-[420px] rounded-2xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-amber-200 to-transparent opacity-40 rounded-bl-full pointer-events-none" />
                
                {/* Visual Header of Card */}
                <div className="flex justify-between items-start">
                  <div className="font-mono text-[9px] text-stone-500 uppercase tracking-widest">
                    YOUniverse Accessory Co.
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-mono uppercase font-bold py-0.5 px-2 rounded">
                    Blink Blink
                  </span>
                </div>

                {/* Central Celestial Ornament Graphic */}
                <div className="my-auto flex flex-col items-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Ring Path Orbit */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-stone-300 animate-spin-slow" />
                    
                    {/* Inner glowing core space elements */}
                    <div className="absolute h-32 w-32 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center animate-pulse-glow" />
                    
                    {/* Center Charm visual design */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                      <Sparkles className="h-10 w-10 text-amber-500 animate-twinkle" />
                      <span className="mt-2 font-display text-sm font-extrabold tracking-widest uppercase text-black">
                        ASTRA CORE
                      </span>
                      <span className="text-[8px] font-mono text-stone-400 capitalize">
                        Your Energy Spark
                      </span>
                    </div>

                    {/* Orbiting small charms */}
                    <div className="absolute top-2 left-6 h-7 w-7 rounded-full bg-white border border-stone-300 shadow-sm flex items-center justify-center text-blue-500 animate-float">
                      <Heart className="h-3.5 w-3.5" />
                    </div>
                    <div className="absolute bottom-6 right-2 h-7 w-7 rounded-full bg-white border border-stone-300 shadow-sm flex items-center justify-center text-red-500 animate-float duration-1500">
                      <Compass className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                {/* Visual Footer of Card */}
                <div className="space-y-1 text-left">
                  <p className="font-display text-lg font-extrabold text-black uppercase tracking-tight">
                    CLASSIC ORBIT CORE
                  </p>
                  <p className="font-sans text-xs text-stone-500 line-clamp-2">
                    Custom modular jewelry allows you to combine Star sign initials with sweet heart elements.
                  </p>
                </div>
              </div>

              {/* Backing structural highlights */}
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100 rounded-full filter blur-xl opacity-50 -z-10" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-amber-100 rounded-full filter blur-xl opacity-60 -z-10" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Khám Phá Các Hành Tinh: Charm Lines Products Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10" id="charm-lines-section">
        
        <div className="text-center space-y-3">
          <h2 className="font-display text-xs font-black tracking-widest text-amber-500 uppercase">
            Khám phá các hành tinh
          </h2>
          <h3 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 uppercase">
            Bộ Sưu Tập Charm Đặc Biệt
          </h3>
          <p className="font-sans text-stone-500 text-sm max-w-xl mx-auto">
            Hành trình du ngoạn các chòm sao, mang theo những nét đặc trưng độc bản của dòng Charm Astra, Sirius và Polaris. Di chuột qua thẻ để đọc lời tuyên ngôn.
          </p>
        </div>

        {/* Carousel of 3 Images (PDF page 5 description: "Cho hiệu ứng carousel 3 khối hình ảnh giới thiệu 3 dòng charm. Hiệu ứng hover vào thì hiện chữ lên cho 3 dòng charm") */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {CHARM_PRODUCTS.map((charm, index) => {
            const isHovered = activeCharmIndex === index;
            
            // Color borders depending on brand color code
            const borderColors = {
              blue: 'hover:border-blue-500 hover:shadow-blue-500/10',
              yellow: 'hover:border-amber-500 hover:shadow-yellow-500/10',
              red: 'hover:border-red-500 hover:shadow-red-500/10',
            }[charm.brandColor];

            const textColors = {
              blue: 'text-blue-600',
              yellow: 'text-amber-500',
              red: 'text-red-500',
            }[charm.brandColor];

            const bgGlows = {
              blue: 'from-blue-50/50 to-white',
              yellow: 'from-amber-50/50 to-white',
              red: 'from-rose-50/50 to-white',
            }[charm.brandColor];

            return (
              <div
                key={charm.id}
                id={`charm-card-${charm.id}`}
                onMouseEnter={() => setActiveCharmIndex(index)}
                onMouseLeave={() => setActiveCharmIndex(null)}
                onClick={() => onNavigate('products')}
                className={`relative h-96 rounded-2xl border-2 border-stone-200 bg-gradient-to-b ${bgGlows} p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-sm ${borderColors}`}
              >
                {/* Card Icon & Top indicator */}
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                    Charm Collection
                  </span>
                  
                  {/* Icon mapped beautifully */}
                  <div className={`p-2.5 rounded-full bg-white border border-stone-100 shadow-sm ${textColors}`}>
                    {charm.id === 'astra' && <Sparkles className="h-6 w-6 animate-twinkle" />}
                    {charm.id === 'sirius' && <Heart className="h-6 w-6 animate-float" />}
                    {charm.id === 'polaris' && <Compass className="h-6 w-6 animate-spin-slow" />}
                  </div>
                </div>

                {/* Mid Section: Styled Illustration placeholder (Client can replace with image) */}
                <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-dashed border-stone-200 animate-spin-slow opacity-60" />
                  <div className="text-stone-300 font-display text-[9px] font-bold uppercase tracking-widest mt-12 text-center select-none">
                    [ Hình ảnh {charm.name} ]
                  </div>
                  {/* Decorative orbital stars blinking */}
                  <span className={`absolute top-4 right-4 ${textColors} text-lg animate-twinkle`}>✦</span>
                  <span className={`absolute bottom-4 left-4 ${textColors} text-[10px] animate-twinkle`}>✦</span>
                </div>

                {/* Content: sliding reveal on hover, cleanly handled via CSS transitions */}
                <div className="space-y-2 text-left relative z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-stone-100">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-stone-400">
                      {charm.badge}
                    </span>
                  </div>
                  
                  <h4 className="font-display text-xl font-extrabold text-black uppercase tracking-tight">
                    {charm.name}
                  </h4>
                  
                  {/* Hover effect text reveal */}
                  <div className="transition-all duration-500 overflow-hidden">
                    <p className={`font-mono text-xs italic font-medium leading-relaxed ${textColors} mb-1`}>
                      &ldquo;{charm.tagline}&rdquo;
                    </p>
                    <p className="font-sans text-stone-500 text-xs line-clamp-2 md:line-clamp-none">
                      {charm.description}
                    </p>
                  </div>
                </div>

                {/* Bottom line decorator */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-xs font-mono font-medium text-stone-400">
                  <span>Xem Chi Tiết</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

        </div>

      </section>

      {/* 3. How to Build Your YOUniverse (Hướng dẫn 3 bước - Customized Workshop) */}
      <section 
        id="customizer-workshop" 
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10"
      >
        
        {/* Header segment of workshop instructions */}
        <div className="text-center space-y-3">
          <h2 className="font-display text-xs font-black tracking-widest text-blue-500 uppercase">
            3 bước tạo vũ trụ riêng
          </h2>
          <h3 className="font-display text-3xl font-extrabold text-stone-900 uppercase">
            Khóa Thiết Kế YOUniverse
          </h3>
          <p className="font-sans text-stone-500 text-sm max-w-xl mx-auto">
            Học thiết kế thông minh 3 bước tự chọn. Tạo nên nét đẹp thẩm mỹ riêng bản và cảm quan vũ trụ có một không hai.
          </p>
        </div>

        {/* Dynamic Interactive Workshop Widget */}
        <div className="bg-white rounded-3xl border-2 border-black p-6 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT 5 columns: Interactive controls structured inside 3 standard steps */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* Step 1: Set Your Vibe */}
              <div className="border-l-4 border-blue-500 pl-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white shrink-0">
                    1
                  </span>
                  <h4 className="font-display text-sm font-extrabold uppercase tracking-widest text-stone-800">
                    Set Your Vibe (Chọn Khí Quyển)
                  </h4>
                </div>
                
                <p className="font-sans text-xs text-stone-500">
                  Chọn tông ánh sáng cho khí quyển vũ trụ của bạn:
                </p>

                {/* Vibe selection swatches */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {vibeOptions.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVibeColor(v.id)}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-full border text-xs font-mono font-medium transition-all ${
                        vibeColor === v.id
                          ? 'border-black bg-stone-50 ring-2 ring-black font-bold text-black'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className={`h-3.5 w-3.5 rounded-full ${v.colorClass}`} />
                      <span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Mix & Match Astra, Sirius, Polaris */}
              <div className="border-l-4 border-amber-500 pl-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white shrink-0">
                    2
                  </span>
                  <h4 className="font-display text-sm font-extrabold uppercase tracking-widest text-stone-800">
                    Mix & Match Charms (Đính Bùa Sao)
                  </h4>
                </div>
                
                <p className="font-sans text-xs text-stone-500">
                  Click để ghép tối đa 6 charm đặc trưng độc đáo lên chuỗi:
                </p>

                <div className="flex gap-2 pt-1 flex-wrap">
                  {charmOptions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleAddCharm(c.id)}
                      className="group flex items-center space-x-1.5 border border-stone-300 bg-white hover:border-black p-2 rounded-xl text-xs font-medium transition-all hover:bg-stone-50"
                      title={`Add ${c.label}`}
                    >
                      <c.icon className={`h-4 w-4 ${c.color}`} />
                      <span className="text-stone-700">{c.label}</span>
                      <Plus className="h-3.5 w-3.5 text-stone-400 group-hover:text-black" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Tell your story */}
              <div className="border-l-4 border-rose-500 pl-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shrink-0">
                    3
                  </span>
                  <h4 className="font-display text-sm font-extrabold uppercase tracking-widest text-stone-800">
                    Tell Your Story (Chạm Khắc Chữ)
                  </h4>
                </div>
                
                <p className="font-sans text-xs text-stone-500">
                  Nhập kí tự tên viết tắt của bạn (Sao Astra) để hệ thống hiển thị:
                </p>

                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full border-2 border-stone-300 rounded-xl px-4 py-2 text-sm font-mono tracking-widest font-extrabold text-black focus:border-black focus:outline-none placeholder-stone-400 bg-stone-50/50"
                    placeholder="E.g. ANA / MINH..."
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] text-stone-400 font-mono">
                    {customName.length}/10
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-4 border-t border-stone-100 space-y-3 text-left">
              <button
                onClick={handleCreateAndAdd}
                className="w-full rounded-2xl bg-black hover:bg-stone-900 border-2 border-black text-white px-6 py-4 font-display text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Gem className="h-4 w-4 text-yellow-300 animate-spin-slow" />
                <span>Thêm Thiết Kế Vào Giỏ Hàng</span>
              </button>

              <button
                onClick={resetCustomizer}
                className="w-full text-center text-xs font-mono text-stone-400 hover:text-red-500 transition-colors py-1 cursor-pointer"
              >
                Reset Customizer
              </button>
            </div>

          </div>

          {/* RIGHT 7 columns: High-performance live rendering preview box */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            
            {/* Live Preview Display Box */}
            <div className={`flex-1 min-h-[300px] border-2 border-black rounded-2xl p-6 relative flex flex-col justify-between overflow-hidden transition-colors duration-700 bg-white`}>
              
              {/* Background ambient lighting based on selected pulse vibe color */}
              <div 
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  vibeColor === 'blue' ? 'bg-blue-500/5' : 
                  vibeColor === 'yellow' ? 'bg-amber-500/5' : 
                  vibeColor === 'red' ? 'bg-rose-500/5' : 
                  'bg-indigo-500/5'
                }`} 
              />
              
              {/* Grid guide markings to mimic design workshop look */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

              {/* Status Header of Workshop Canvas */}
              <div className="flex justify-between items-center relative z-10 text-[9px] font-mono tracking-widest text-stone-400">
                <span className="flex items-center space-x-1.5 font-bold uppercase">
                  <span className={`h-2 w-2 rounded-full ${
                    vibeColor === 'blue' ? 'bg-blue-500' :
                    vibeColor === 'yellow' ? 'bg-yellow-500' :
                    vibeColor === 'red' ? 'bg-red-500' :
                    'bg-indigo-500'
                  } animate-ping`} />
                  <span>Interactive preview</span>
                </span>
                <span className="uppercase bg-stone-100 py-0.5 px-2 rounded text-stone-600 font-bold">
                  Atmosphere: {vibeColor}
                </span>
              </div>

              {/* Jewelry chain preview base rendering */}
              <div className="relative my-auto flex items-center justify-center p-8">
                
                {/* Simulated Glow ring behind */}
                <div className={`absolute h-48 w-48 rounded-full filter blur-2xl opacity-20 animate-pulse-glow ${
                  vibeColor === 'blue' ? 'bg-blue-400' :
                  vibeColor === 'yellow' ? 'bg-amber-400' :
                  vibeColor === 'red' ? 'bg-rose-400' :
                  'bg-indigo-400'
                }`} />

                {/* Jewelry selection graphic core */}
                <div className="relative w-full max-w-[280px] h-32 flex items-center justify-center">
                  
                  {/* Necklace hook loop */}
                  {jewelryType === 'necklace' && (
                    <div className="absolute top-0 w-28 h-40 rounded-full border-t border-stone-300 group-hover:scale-105 duration-300" />
                  )}

                  {/* Bracelet / Jewelry Base Chain bar line */}
                  <div className="h-2 w-full rounded-full bg-stone-200 border border-stone-300 shadow-sm relative flex items-center justify-around px-8">
                    {/* Metal clamps */}
                    <div className="absolute left-1 h-3.5 w-1.5 rounded-sm bg-stone-400" />
                    <div className="absolute right-1 h-3.5 w-1.5 rounded-sm bg-stone-400" />
                    
                    {/* Active item charms array visualization */}
                    {selectedCharms.length === 0 ? (
                      <span className="absolute text-[10px] font-mono font-medium text-stone-400 animate-pulse tracking-wide italic">
                        No charms on chain. Choose charms above!
                      </span>
                    ) : (
                      <div className="absolute inset-x-8 flex justify-center items-center gap-2">
                        {selectedCharms.map((charmId, charmIdx) => {
                          const matchingCharm = CHARM_PRODUCTS.find((cp) => cp.id === charmId);
                          const isAstra = charmId === 'astra';
                          
                          let charmIconColor = 'text-blue-500';
                          let charmBgColor = 'bg-blue-50 border-blue-200';
                          
                          if (charmId === 'sirius') {
                            charmIconColor = 'text-amber-500';
                            charmBgColor = 'bg-amber-50 border-amber-200';
                          } else if (charmId === 'polaris') {
                            charmIconColor = 'text-rose-500';
                            charmBgColor = 'bg-rose-50 border-rose-200';
                          }

                          return (
                            <div 
                              key={charmIdx}
                              className={`group/charm relative flex flex-col items-center bg-white border ${charmBgColor} p-2 rounded-xl shadow-md cursor-pointer hover:scale-110 active:scale-95 transition-all text-center animate-float`}
                              style={{ animationDelay: `${charmIdx * 0.4}s` }}
                            >
                              <button 
                                onClick={() => handleRemoveCharm(charmIdx)}
                                className="absolute -top-1.5 -right-1.5 hidden group-hover/charm:flex h-4 w-4 bg-red-500 text-white rounded-full items-center justify-center p-0.5 hover:bg-red-600 shadow"
                                title="Remove Charm"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>

                              {charmId === 'astra' && <Sparkles className={`h-4.5 w-4.5 ${charmIconColor} animate-twinkle`} />}
                              {charmId === 'sirius' && <Heart className={`h-4.5 w-4.5 ${charmIconColor}`} />}
                              {charmId === 'polaris' && <Compass className={`h-4.5 w-4.5 ${charmIconColor}`} />}

                              {/* Live Custom named engraving display on Astra */}
                              {isAstra && (
                                <span className="mt-0.5 text-[8px] font-mono font-bold uppercase tracking-tight text-black max-w-[40px] truncate">
                                  {customName || 'Astra'}
                                </span>
                              )}
                              {!isAstra && (
                                <span className="mt-0.5 text-[6px] font-sans tracking-wide text-stone-400 capitalize">
                                  {matchingCharm?.badge}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* Success Notification overlay inside panel */}
              {successMessage && (
                <div className="absolute top-4 inset-x-4 bg-emerald-500 text-white p-3 rounded-xl border border-emerald-400 shadow-xl flex items-center space-x-2 animate-fade-in relative z-50 text-xs">
                  <Bookmark className="h-4.5 w-4.5 shrink-0" />
                  <span className="font-sans font-semibold text-left">{successMessage}</span>
                </div>
              )}

              {/* Mini visual summary of custom options */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap justify-between items-center text-[10px] font-mono text-stone-500 relative z-10 gap-2">
                <div className="flex gap-2">
                  <span className="bg-stone-100 py-0.5 px-2 rounded">
                    Charms: {selectedCharms.length}/6
                  </span>
                  <span className="bg-stone-100 py-0.5 px-2 rounded">
                    Engraving: &ldquo;{customName || 'None'}&rdquo;
                  </span>
                </div>
                
                <span className="font-bold text-stone-700">
                  Custom base: {jewelryType.toUpperCase()}
                </span>
              </div>

            </div>

            {/* Selector of Jewelry Core Type */}
            <div className="mt-6 bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-left">
              <div>
                <h5 className="font-display text-xs font-bold text-stone-700 uppercase tracking-widest flex items-center space-x-1">
                  <Paintbrush className="h-3.5 w-3.5 text-stone-500" />
                  <span>Chọn Core Jewelry</span>
                </h5>
                <p className="font-sans text-[11px] text-stone-400">
                  Bộ nền chuỗi xâu hạt (Classy Silver Bracelet, Orbit Necklace, Cord):
                </p>
              </div>

              <div className="flex gap-2 bg-white p-1 rounded-xl border border-stone-200">
                {(['bracelet', 'necklace', 'cord'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setJewelryType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-display font-black tracking-wide uppercase transition-all ${
                      jewelryType === type
                        ? 'bg-black text-white'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {type === 'bracelet' && 'Vòng Tay'}
                    {type === 'necklace' && 'Dây Chuyền'}
                    {type === 'cord' && 'Dây Vải'}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
