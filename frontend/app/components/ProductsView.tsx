import { useEffect, useState } from 'react';
import { Sparkles, Heart, Compass, Search } from 'lucide-react';
import { useYouniverseApp } from '../YouniverseApp';
import { translations } from '../locales';

interface ProductsViewProps {
  onNotifySoon: (charmName: string) => void;
}

type ProductLineFilter = 'all' | 'astra' | 'sirius' | 'polaris';
type ProductLine = 'ASTRA' | 'SIRIUS' | 'POLARIS';
type SortBy = 'newest' | 'price-asc' | 'price-desc';

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  productLine: ProductLine;
  badge: string | null;
  shortDescription: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  sku: string | null;
  images: Array<{
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }>;
  inventory: {
    quantity: number;
  } | null;
};

type ProductListResponse = {
  success: boolean;
  message: string;
  data?: {
    items: ApiProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1').replace(/\/$/, '');

const productLineToApi: Record<Exclude<ProductLineFilter, 'all'>, ProductLine> = {
  astra: 'ASTRA',
  sirius: 'SIRIUS',
  polaris: 'POLARIS',
};

const sortToApi: Record<SortBy, string> = {
  newest: 'newest',
  'price-asc': 'price-low-high',
  'price-desc': 'price-high-low',
};

const lineTaglines: Record<ProductLine, string> = {
  ASTRA: 'Own your unique name, ignite your inner flame.',
  SIRIUS: 'Pack the joy you seek, let your passion speak.',
  POLARIS: 'Trust the guiding quote, let your spirit float.',
};

const lineFallbackImages: Record<ProductLine, string> = {
  ASTRA: '/images/astra-core.png',
  SIRIUS: '/images/sirius-core.png',
  POLARIS: '/images/polaris-core.png',
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

function ProductVisual({ product }: { product: ApiProduct }) {
  const [imageFailed, setImageFailed] = useState(false);
  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const imageUrl = imageFailed ? lineFallbackImages[product.productLine] : primaryImage?.url ?? lineFallbackImages[product.productLine];
  
  const coreImage = {
    ASTRA: '/images/astra-core.png',
    SIRIUS: '/images/sirius-core.png',
    POLARIS: '/images/polaris-core.png',
  }[product.productLine];

  return (
    <>
      <img
        src={imageUrl}
        alt={primaryImage?.alt ?? product.name}
        onError={() => setImageFailed(true)}
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/35 to-white/10" />
      <div className="relative w-36 h-36 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-108">
        <img 
          src={coreImage} 
          alt={product.name} 
          className="w-full h-full object-contain select-none z-10"
        />
      </div>
    </>
  );
}

export default function ProductsView({ onNotifySoon }: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState<ProductLineFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { language } = useYouniverseApp();
  const t = translations[language];

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: '1',
          limit: '12',
          sort: sortToApi[sortBy],
        });

        if (searchQuery.trim()) {
          params.set('search', searchQuery.trim());
        }

        if (selectedLine !== 'all') {
          params.set('line', productLineToApi[selectedLine]);
        }

        const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as ProductListResponse;

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.message || 'Could not load products');
        }

        setProducts(payload.data.items);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        setProducts([]);
        setError(err instanceof Error ? err.message : 'Could not load products');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, selectedLine, sortBy, refreshKey]);

  return (
    <div className="pb-24 space-y-16 bg-neutral-50/30" id="products-view">
      
      {/* 1. Header Banner of Our products */}
      <section className="relative overflow-hidden h-48 sm:h-64 cursor-default rounded-3xl mx-auto max-w-7xl mt-6 shadow-sm">
        {/* Banner background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/banner-our-universe.png" 
            alt="YOUniverse Our UNIverse Banner" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 2. Main Product Catalog Section with Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Headline */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-black uppercase" id="headline-our-products">
            {language === 'vi' ? 'SẢN PHẨM CỦA CHÚNG TÔI' : 'OUR PRODUCTS'}
          </h2>
          <div className="h-1 w-16 bg-amber-500 mx-auto mt-3 rounded" />
        </div>

        {/* Apple-style Filter & Search Bar */}
        <div className="bg-white border border-stone-200/80 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder={language === 'vi' ? "Tìm kiếm charm (ví dụ: tên, mô tả)..." : "Search charms (e.g. name, description)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs font-sans rounded-full bg-stone-50 border border-stone-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-black font-sans font-bold"
              >
                ✕ {language === 'vi' ? 'Xóa' : 'Clear'}
              </button>
            )}
          </div>

          {/* Product Line Filter Segment Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'astra', 'sirius', 'polaris'] as const).map((line) => {
              const isActive = selectedLine === line;
              const label = line === 'all' 
                ? (language === 'vi' ? 'Tất cả các dòng' : 'All Lines') 
                : `Charm ${line.charAt(0).toUpperCase() + line.slice(1)}`;
              
              const activeClass = 
                line === 'all' ? 'bg-black text-white border-black' :
                line === 'astra' ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20' :
                line === 'sirius' ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20' :
                'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/20';

              const inactiveClass = 'hover:bg-stone-50 border-stone-200 text-stone-600 bg-white hover:text-black hover:border-stone-400';

              // Option B: Select icon based on the line type
              const renderIcon = () => {
                const iconClass = `h-3.5 w-3.5 transition-colors duration-300 ${
                  isActive 
                    ? 'text-white animate-pulse-glow' 
                    : line === 'astra' 
                    ? 'text-blue-500 group-hover:text-blue-600' 
                    : line === 'sirius' 
                    ? 'text-amber-500 group-hover:text-amber-600' 
                    : 'text-rose-500 group-hover:text-rose-600'
                }`;

                if (line === 'astra') return <Sparkles className={iconClass} />;
                if (line === 'sirius') return <Heart className={iconClass} />;
                if (line === 'polaris') return <Compass className={iconClass} />;
                return null;
              };

              return (
                <button
                  key={line}
                  onClick={() => setSelectedLine(line)}
                  className={`group flex items-center space-x-1.5 px-4 py-2 rounded-full border text-[10px] font-bold font-display tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive ? activeClass : inactiveClass
                  }`}
                >
                  {renderIcon()}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Dropdown Sorting Control */}
          <div className="relative flex items-center space-x-2 self-start lg:self-auto" id="sort-control-container">
            <span className={`text-[10px] ${language === 'vi' ? 'font-sans' : 'font-mono'} font-bold uppercase tracking-wider text-stone-400 shrink-0`}>{language === 'vi' ? 'Sắp xếp:' : 'Sort By:'}</span>
            
            <div className="relative">
              {/* Dropdown Toggle Button */}
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center justify-between space-x-3 bg-white border border-stone-200 hover:border-stone-400 rounded-full px-4.5 py-2 text-xs font-sans font-medium text-stone-700 hover:text-black transition-all cursor-pointer min-w-[160px]"
              >
                <span>{sortBy === 'price-asc' ? (language === 'vi' ? 'Giá: Thấp đến Cao' : 'Price: Low to High') : sortBy === 'price-desc' ? (language === 'vi' ? 'Giá: Cao đến Thấp' : 'Price: High to Low') : (language === 'vi' ? 'Thứ tự mặc định' : 'Default Order')}</span>
                <span className={`text-[8px] text-stone-400 transition-transform duration-350 ${sortOpen ? 'rotate-180 text-black' : 'rotate-0'}`}>
                  ▼
                </span>
              </button>

              {/* Dropdown Options Panel */}
              {sortOpen && (
                <>
                  {/* Invisible backdrop to capture click-outside event */}
                  <div className="fixed inset-0 z-20 cursor-default" onClick={() => setSortOpen(false)} />
                  
                  {/* Options container list */}
                  <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white border border-stone-200 shadow-lg p-1.5 z-30 space-y-1 animate-fade-in">
                    {(
                      [
                        { value: 'newest', label: language === 'vi' ? 'Thứ tự mặc định' : 'Default Order' },
                        { value: 'price-asc', label: language === 'vi' ? 'Giá: Thấp đến Cao' : 'Price: Low to High' },
                        { value: 'price-desc', label: language === 'vi' ? 'Giá: Cao đến Thấp' : 'Price: High to Low' }
                      ] as const
                    ).map((opt) => {
                      const isSelected = opt.value === sortBy;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl font-sans transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? 'bg-stone-50 text-black font-semibold' 
                              : 'text-stone-600 hover:bg-stone-50 hover:text-black'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <span className="text-amber-500 font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* 3 columns comparative list, staggered left-to-right, inspired by Apple comparative layouts */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4 animate-pulse">
                <div className="h-60 w-full rounded-3xl bg-white border border-stone-200 shadow-sm" />
                <div className="h-2 w-16 rounded bg-stone-200" />
                <div className="h-6 w-40 rounded bg-stone-200" />
                <div className="h-3 w-56 rounded bg-stone-100" />
                <div className="h-9 w-32 rounded-full bg-stone-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-red-200/80 shadow-sm space-y-4">
            <p className="font-sans text-red-500 text-sm font-semibold">Cannot load products from backend.</p>
            <p className="font-mono text-[11px] text-stone-400">{error}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="rounded-full bg-black px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/60 shadow-sm">
            <p className="font-sans text-stone-400 text-sm">{language === 'vi' ? 'Không tìm thấy sản phẩm nào phù hợp với bộ lọc.' : 'No products match your search/filter criteria.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            
            {products.map((prod) => {
              const isAstra = prod.productLine === 'ASTRA';
              const isSirius = prod.productLine === 'SIRIUS';
              const currentPrice = prod.salePrice ?? prod.price;
              const stockQuantity = prod.inventory?.quantity ?? 0;
              const productCode = prod.sku ?? prod.slug.toUpperCase();

              const translatedBadge = isAstra ? t.charmAstraBadge : isSirius ? t.charmSiriusBadge : t.charmPolarisBadge;
              const translatedTagline = isAstra ? t.charmAstraTagline : isSirius ? t.charmSiriusTagline : t.charmPolarisTagline;
              const translatedDescription = isAstra ? t.charmAstraDesc : isSirius ? t.charmSiriusDesc : t.charmPolarisDesc;

              return (
                <div
                  key={prod.id}
                  id={`product-card-${prod.slug}`}
                  className="flex flex-col items-center text-center space-y-4 cursor-default"
                >
                  {/* Photo area container (rounded white box) */}
                  <div className="relative bg-white border border-stone-150 rounded-3xl h-60 w-full flex items-center justify-center p-6 shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden group">
                    <span className="absolute top-4 left-4 font-mono text-[9px] text-stone-400">
                      CODE: {productCode}
                    </span>

                    {/* Floating absolute Sparkle in corner that appears on hover */}
                    <Sparkles className="absolute top-4 right-4 h-4 w-4 text-amber-500 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-45 transition-all duration-500 ease-out pointer-events-none" />

                    {/* Central big physical charm image overlaying the box */}
                    <ProductVisual product={prod} />
                  </div>

                  {/* Centered color dots indicator below image box */}
                  {isAstra && (
                    <div className="flex space-x-1.5 justify-center py-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-offset-1 ring-blue-500" />
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="h-2 w-2 rounded-full bg-stone-300" />
                    </div>
                  )}
                  {isSirius && (
                    <div className="flex space-x-1.5 justify-center py-1">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      <span className="h-2 w-2 rounded-full bg-amber-500 ring-2 ring-offset-1 ring-amber-500" />
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span className="h-2 w-2 rounded-full bg-stone-300" />
                    </div>
                  )}
                  {!isAstra && !isSirius && (
                    <div className="flex space-x-1.5 justify-center py-1">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="h-2 w-2 rounded-full bg-rose-500 ring-2 ring-offset-1 ring-rose-500" />
                      <span className="h-2 w-2 rounded-full bg-stone-300" />
                    </div>
                  )}

                  {/* Product Details Section */}
                  <div className="space-y-2 flex flex-col items-center">
                    
                    {/* Orange micro-badge label */}
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-600">
                      {translatedBadge}
                    </span>
                    
                    {/* Heading title */}
                    <h3 className="font-display text-2xl font-black text-black uppercase tracking-tight">
                      {prod.name}
                    </h3>
                    
                    {/* Tagline */}
                    <p className={`${language === 'vi' ? 'font-sans' : 'font-mono'} text-xs font-semibold text-stone-500 italic max-w-xs px-2 text-center`}>
                      &ldquo;{translatedTagline}&rdquo;
                    </p>

                    {/* Short Description */}
                    <p className="font-sans text-stone-500 text-xs leading-relaxed max-w-xs px-2 line-clamp-3 text-center">
                      {translatedDescription || prod.shortDescription || prod.description}
                    </p>

                    {/* <div className="flex items-center gap-2 pt-1">
                      <span className="font-sans text-sm font-bold text-black">{formatPrice(currentPrice)}</span>
                      {prod.salePrice && (
                        <span className="font-sans text-xs text-stone-400 line-through">{formatPrice(prod.price)}</span>
                      )}
                    </div> */}

                    {/* <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${stockQuantity > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stockQuantity > 0 ? `${stockQuantity} in stock` : 'Out of stock'}
                    </span> */}

                  </div>

                  {/* Centered Actions Block: Primary pill button and secondary text link */}
                  <div className="flex items-center justify-center pt-2">
                    <button
                      onClick={() => onNotifySoon(prod.name)}
                      className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-sans text-xs font-semibold px-5 py-2 rounded-full tracking-wide shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      {language === 'vi' ? 'Nhận thông báo' : 'Notify Soon'}
                    </button>
                    <button
                      onClick={() => onNotifySoon(prod.name)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-semibold font-sans flex items-center space-x-1 cursor-pointer ml-4 group/link"
                    >
                      <span>{language === 'vi' ? 'Tìm hiểu thêm' : 'Learn more'}</span>
                      <span className="inline-block transform group-hover/link:translate-x-0.5 transition-transform">&gt;</span>
                    </button>
                  </div>

                  {/* Small launching footer text */}
                  <p className={`text-[9px] ${language === 'vi' ? 'font-sans' : 'font-mono'} text-stone-400`}>
                    {language === 'vi' ? 'Chính thức ra mắt mùa hè này' : 'Launching officially this summer'}
                  </p>
                </div>
              );
            })}

          </div>
        )}

      </section>

    </div>
  );
}
