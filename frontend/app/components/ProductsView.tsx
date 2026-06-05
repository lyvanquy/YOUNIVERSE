import { Sparkles, Heart, Compass } from 'lucide-react';
import { CHARM_PRODUCTS } from '../data';

interface ProductsViewProps {
  onNotifySoon: (charmName: string) => void;
}

export default function ProductsView({ onNotifySoon }: ProductsViewProps) {
  return (
    <div className="pb-24 space-y-16" id="products-view">
      
      {/* 1. Header Banner of Our products */}
      <section className="relative overflow-hidden bg-stone-50 py-16 px-4 cursor-default">
        {/* Cosmos background details */}
        <div className="absolute inset-0 cosmic-banner-glow pointer-events-none" />
        <div className="absolute top-1/4 left-1/5 text-amber-300 animate-twinkle">✦</div>
        <div className="absolute top-12 right-12 text-blue-400 animate-twinkle duration-2000">✦</div>
        
        <div className="mx-auto max-w-7xl text-center space-y-4 relative z-10">
          <span className="bg-black text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full">
            The Cosmos Catalogue
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-black uppercase">
            OUR UNIVERSE
          </h1>
          <p className="font-sans text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
            Nơi hội tụ những chòm sao bản chất cá nhân hóa. Mỗi tác phẩm được chạm khắc tỉ mỉ nhằm đưa bạn tiếp xúc sâu đậm nhất với chòm sao nội tâm của mình.
          </p>
        </div>
      </section>

      {/* 2. Main Product Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-black uppercase" id="headline-our-products">
            OUR PRODUCTS
          </h2>
          <div className="h-1 w-16 bg-amber-500 mx-auto mt-3 rounded" />
        </div>

        {/* 3 columns list, staggered left-to-right, inspired by comparative layouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          
          {CHARM_PRODUCTS.map((prod, idx) => {
            const isAstra = prod.id === 'astra';
            const isSirius = prod.id === 'sirius';

            // Distinct themes for each column representing star groups
            const accentBgColor = isAstra 
              ? 'bg-blue-50/50 hover:bg-blue-50 border-blue-200 hover:border-blue-400' 
              : isSirius 
              ? 'bg-amber-50/50 hover:bg-amber-50 border-amber-200 hover:border-amber-400' 
              : 'bg-rose-50/50 hover:bg-rose-50 border-rose-200 hover:border-rose-400';

            const buttonGlowClass = isAstra 
              ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20' 
              : isSirius 
              ? 'bg-amber-500 hover:bg-amber-600 hover:shadow-yellow-500/20' 
              : 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/20';

            const badgeTextBadge = isAstra 
              ? 'text-blue-500 bg-blue-100/60' 
              : isSirius 
              ? 'text-amber-500 bg-amber-100/60' 
              : 'text-red-500 bg-rose-100/60';

            return (
              <div
                key={prod.id}
                id={`product-card-${prod.id}`}
                className={`flex flex-col justify-between rounded-3xl border-2 p-6 md:p-8 transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md ${accentBgColor}`}
              >
                {/* Top illustration box */}
                <div className="space-y-6">
                  
                  {/* Photo area with dots indicator below (as seen in Macbook Page 6 screenshot) */}
                  <div className="relative bg-white border border-stone-100 rounded-2xl h-56 flex flex-col justify-between items-center p-4 shadow-inner overflow-hidden">
                    <span className="absolute top-3 left-3 font-mono text-[9px] text-stone-400">
                      Product Code: {prod.id.toUpperCase()}-01
                    </span>

                    {/* Central big glowing ornament representing physical charm */}
                    <div className="my-auto relative w-28 h-28 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-stone-200 animate-spin-slow opacity-50" />
                      
                      {isAstra && <Sparkles className="h-14 w-14 text-blue-500 animate-twinkle" />}
                      {isSirius && <Heart className="h-14 w-14 text-amber-500 animate-float" />}
                      {!isAstra && !isSirius && <Compass className="h-14 w-14 text-red-500 animate-spin-slow" />}
                    </div>

                    {/* Simple dots indicator below comparison image (as seen in mockup) */}
                    <div className="flex space-x-1 justify-center pb-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-800" />
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                    </div>
                  </div>

                  {/* Brand Content and Metadata */}
                  <div className="space-y-3 text-left">
                    <span className={`inline-block text-[9px] font-mono font-black uppercase tracking-wider py-1 px-3.5 rounded-full ${badgeTextBadge}`}>
                      {prod.badge}
                    </span>
                    
                    <h3 className="font-display text-2xl font-black text-black uppercase tracking-tight">
                      {prod.name}
                    </h3>
                    
                    {/* Tagline text */}
                    <p className="font-mono text-xs font-semibold text-stone-500 italic">
                      &ldquo;{prod.tagline}&rdquo;
                    </p>

                    {/* Main Tagline 2-line Description */}
                    <p className="font-sans text-stone-600 text-xs leading-relaxed min-h-[40px] line-clamp-2" title={prod.description}>
                      {prod.description}
                    </p>

                    {/* In-depth features */}
                    <div className="border-t border-stone-200/50 pt-4 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400 block">
                        Đặc trưng nổi bật:
                      </span>
                      <p className="font-sans text-[11px] text-stone-500 leading-normal">
                        {prod.extendedDesc}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Foot Segment: Price and Button */}
                {/* As requested: "Giá (Price): Bỏ dòng này" and CTA is <Coming soon> */}
                <div className="pt-6 mt-6 border-t border-stone-200/60 text-left">
                  <button
                    onClick={() => onNotifySoon(prod.name)}
                    className={`w-full rounded-2xl text-white py-3 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 transform active:scale-95 shadow-md flex items-center justify-center space-x-2 cursor-pointer ${buttonGlowClass}`}
                  >
                    <span>&lt; Coming soon &gt;</span>
                  </button>
                  <p className="text-center text-[9px] font-mono text-stone-400 mt-2">
                    Lên kệ chính thức vào mùa hè này
                  </p>
                </div>
              </div>
            );
          })}

        </div>

      </section>

      {/* 3. Small informational banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 border-2 border-black rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-left gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
              Ý nghĩa cốt lõi
            </span>
            <h4 className="font-display text-sm font-extrabold uppercase text-stone-900 tracking-wider">
              Khắc Ghi Câu Chuyện Của Riêng Bạn
            </h4>
            <p className="font-sans text-xs text-stone-500 leading-relaxed">
              Bạn có thể dễ dàng liên hệ với ISB Event Team để nhận thông tin đặt cọc trước dòng charm để sở hữu bộ sticker đặc quyền từ chúng tôi.
            </p>
          </div>

          <a 
            href="mailto:youniverse_ueh.isb@gmail.com"
            className="rounded-full bg-black hover:bg-stone-900 text-white font-mono text-xs font-bold tracking-widest uppercase px-6 py-3 transition-colors shrink-0"
          >
            Liên Hệ Đặt Trước
          </a>
        </div>
      </section>

    </div>
  );
}
