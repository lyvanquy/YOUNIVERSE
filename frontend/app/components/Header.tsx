import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { PageType } from '../types';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  cartCount: number;
  onOpenCart?: () => void;
}

export default function Header({ currentPage, onNavigate, cartCount, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger wiggle-glow when cart count increases
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 800);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const navItems = [
    { id: 'home' as PageType, label: 'Home', hoverClass: 'hover:text-blue-500 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-blue cursor-pointer', dotColor: 'bg-blue-500' },
    { id: 'products' as PageType, label: 'Our YOUniverse', hoverClass: 'hover:text-amber-500 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-yellow cursor-pointer', dotColor: 'bg-yellow-500' },
    { id: 'about-us' as PageType, label: 'About us', hoverClass: 'hover:text-red-500 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-red cursor-pointer', dotColor: 'bg-red-500' },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-350 ease-in-out ${
      isScrolled 
        ? 'border-stone-200/40 bg-gradient-to-r from-white/70 via-white/85 to-white/70 backdrop-blur-lg shadow-sm' 
        : 'border-stone-100 bg-gradient-to-r from-stone-50/50 via-white/90 to-stone-50/50 backdrop-blur-md'
    }`}>
      {/* Cosmic background decorative stars (satisfying blink-blink theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45">
        <div className="absolute top-3 left-12 text-sm text-blue-400 animate-twinkle select-none">✦</div>
        <div className="absolute bottom-2 left-1/3 text-base text-stone-400/70 animate-twinkle duration-2000 select-none">✦</div>
        <div className="absolute top-2 right-1/4 text-base text-amber-400/80 animate-twinkle duration-1000 select-none">✦</div>
        <div className="absolute bottom-3 right-20 text-sm text-red-400 animate-twinkle duration-1500 select-none">✦</div>
      </div>

      <div className={`relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? 'h-16' : 'h-20'
      }`}>
        
        {/* Left Side: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`group relative py-2 font-display text-base font-semibold tracking-wide text-stone-700 transition-all duration-500 ease-out focus:outline-none ${item.hoverClass}`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 right-0 h-[2px] ${item.dotColor} rounded-full transition-transform duration-500 ease-out transform scale-x-0 group-hover:scale-x-100 origin-center ${isActive ? 'scale-x-100' : ''}`} />
              </button>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            id="mobile-menu-btn"
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Center: Logo (as described: "Logo ở giữa click vào => đưa về trang chủ") */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button
            id="logo-brand"
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="group flex flex-col items-center justify-center focus:outline-none"
          >
            <span className="relative font-display text-2xl font-extrabold tracking-widest text-black flex items-center transition-transform hover:scale-105 duration-300">
              <Sparkles className="absolute -left-6 top-1.5 h-4 w-4 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 animate-twinkle" />
              YO<span className="text-amber-500 group-hover:text-blue-500 transition-colors duration-500">U</span>niverse
              <Sparkles className="absolute -right-6 bottom-1.5 h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:-rotate-12 transition-all duration-300 animate-twinkle" />
            </span>
            <span className="text-[7px] font-mono tracking-[0.35em] text-stone-400 uppercase group-hover:text-red-500 transition-colors duration-500">
              A Galaxy to Hold
            </span>
          </button>
        </div>

        {/* Right Side: Shopping Bag bag icon */}
        <div className="flex items-center space-x-4">
          <button
            id="cart-btn"
            onClick={onOpenCart}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-stone-900 hover:border-black hover:shadow-[0_0_12px_rgba(250,204,21,0.15)] focus:outline-none transition-all duration-300 shadow-sm ${
              animateCart ? 'animate-wiggle-glow border-amber-400 bg-amber-50/20' : ''
            }`}
          >
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-105 animate-wiggle" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-[10px] font-bold text-white ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.45)] animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-6 shadow-lg animate-fade-in">
          <div className="space-y-4 pt-2 pb-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-3 px-4 font-display text-lg font-bold rounded-lg transition-colors focus:outline-none ${
                    isActive 
                      ? 'bg-stone-50 text-stone-900 border-l-4 border-amber-500' 
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dotColor}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
