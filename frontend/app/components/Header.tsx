'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Sparkles, User, LogOut } from 'lucide-react';
import { useYouniverseApp } from '../YouniverseApp';
import { translations } from '../locales';

interface HeaderProps {
  cartCount: number;
  onOpenCart?: () => void;
}

export default function Header({ cartCount, onOpenCart }: HeaderProps) {
  const pathname = usePathname();
  const { isAuthenticated, user, logout, language, setLanguage } = useYouniverseApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  
  const t = translations[language];

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
    { href: '/', label: t.home, hoverClass: 'hover:text-blue-400 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-blue cursor-pointer', dotColor: 'bg-blue-500', activeText: 'text-blue-400' },
    { href: '/products', label: t.ourUniverse, hoverClass: 'hover:text-amber-400 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-yellow cursor-pointer', dotColor: 'bg-amber-500', activeText: 'text-amber-400' },
    { href: '/about', label: t.aboutUs, hoverClass: 'hover:text-rose-400 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-red cursor-pointer', dotColor: 'bg-rose-500', activeText: 'text-rose-400' },
    { href: '/policy', label: t.ourPolicy, hoverClass: 'hover:text-purple-400 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] cursor-pointer', dotColor: 'bg-purple-500', activeText: 'text-purple-400' },
  ];

  const isActiveRoute = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-350 ease-in-out ${
      isScrolled 
        ? 'border-stone-800/60 bg-black/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]' 
        : 'border-stone-800/40 bg-black/90 backdrop-blur-lg'
    }`}>
      
      {/* Cosmic background: subtle grid + stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid overlay like footer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
        
        {/* Nebula glow blobs */}
        <div className="absolute -top-10 left-[15%] w-[200px] h-[100px] rounded-full bg-blue-500/8 blur-[60px] animate-pulse-glow" />
        <div className="absolute -top-10 right-[20%] w-[180px] h-[80px] rounded-full bg-amber-500/6 blur-[50px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-[50%] w-[160px] h-[80px] rounded-full bg-rose-500/5 blur-[50px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

        {/* Cosmic star elements — diverse shapes inspired by hand-drawn sparkle art */}
        {/* Large 4-point stars */}
        <div className="absolute top-2 left-10 text-base text-blue-400/70 animate-twinkle select-none">✦</div>
        <div className="absolute top-3 right-[14%] text-lg text-amber-300/60 animate-twinkle select-none" style={{ animationDelay: '1.5s' }}>✦</div>
        <div className="absolute bottom-2 left-[30%] text-base text-amber-400/50 animate-twinkle select-none" style={{ animationDelay: '1.2s' }}>✦</div>
        
        {/* 6-point starburst */}
        <div className="absolute top-1 left-[22%] text-sm text-white/40 animate-twinkle select-none" style={{ animationDelay: '0.6s' }}>✶</div>
        <div className="absolute bottom-1 right-[30%] text-sm text-rose-300/50 animate-twinkle select-none" style={{ animationDelay: '2.2s' }}>✶</div>

        {/* Diamond shapes */}
        <div className="absolute top-4 left-[40%] text-xs text-white/35 animate-twinkle select-none" style={{ animationDelay: '0.8s' }}>◆</div>
        <div className="absolute bottom-3 right-[22%] text-[10px] text-blue-300/45 animate-twinkle select-none" style={{ animationDelay: '2.8s' }}>◇</div>

        {/* Cross / plus shapes */}
        <div className="absolute top-2 right-[38%] text-xs text-white/30 animate-twinkle select-none" style={{ animationDelay: '1.8s' }}>✢</div>
        <div className="absolute bottom-2 left-[12%] text-[11px] text-amber-200/35 animate-twinkle select-none" style={{ animationDelay: '3.2s' }}>✣</div>

        {/* Small accent dots */}
        <div className="absolute top-5 left-[60%] text-[8px] text-white/25 animate-twinkle select-none" style={{ animationDelay: '2.5s' }}>•</div>
        <div className="absolute bottom-4 right-10 text-[10px] text-blue-400/35 animate-twinkle select-none" style={{ animationDelay: '0.3s' }}>✧</div>
        <div className="absolute top-1 left-[50%] text-[10px] text-rose-400/40 animate-twinkle select-none" style={{ animationDelay: '3.5s' }}>✧</div>
        <div className="absolute bottom-1 left-[68%] text-xs text-amber-300/30 animate-twinkle select-none" style={{ animationDelay: '1s' }}>✦</div>
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        
        {/* Left Side: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-5" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.href === '/' ? 'home' : item.href.slice(1)}`}
                className={`group relative py-2 font-display text-sm font-semibold tracking-wide transition-all duration-500 ease-out focus:outline-none ${item.hoverClass} ${
                  isActive ? item.activeText : 'text-stone-300'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 right-0 h-[2px] ${item.dotColor} rounded-full transition-transform duration-500 ease-out transform scale-x-0 group-hover:scale-x-100 origin-center ${isActive ? 'scale-x-100' : ''}`} />
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            id="mobile-menu-btn"
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-stone-300 hover:bg-white/10 hover:text-white focus:outline-none transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Link
            id="logo-brand"
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center justify-center focus:outline-none"
          >
            <img 
              src="/images/logo-youniverse-transparent.png" 
              alt="YOUniverse Logo" 
              className="object-contain h-16 md:h-20 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            />
          </Link>
        </div>

        {/* Right Side: Language Toggle and Shopping Bag */}
        <div className="flex items-center space-x-1.5 md:space-x-3 z-20">
          {/* Language Toggle - hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center rounded-full border border-stone-700/60 bg-stone-900/60 p-0.5" suppressHydrationWarning>
            <button
              onClick={() => setLanguage('vi')}
              suppressHydrationWarning
              className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full transition-all duration-350 cursor-pointer ${
                language === 'vi'
                  ? 'bg-white text-black shadow-sm shadow-white/10'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLanguage('en')}
              suppressHydrationWarning
              className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full transition-all duration-350 cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-black shadow-sm shadow-white/10'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Temporarily hidden login functionality
          {isAuthenticated ? (
            <div className="flex items-center space-x-1.5 md:space-x-2">
              <Link
                href={user?.role === 'ADMIN' ? '/admin' : '/account'}
                id="header-account-btn"
                className="group relative flex h-9 md:h-10 w-9 md:w-auto md:px-4 items-center justify-center rounded-full border border-stone-700 bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white hover:border-stone-600 transition-all duration-300 shadow-sm focus:outline-none"
                title={`Hi, ${user?.name}`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 md:mr-2 animate-pulse" />
                <span className="hidden md:inline font-sans text-xs font-semibold truncate max-w-[80px]">
                  {user?.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={logout}
                id="header-logout-btn"
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-stone-700 bg-stone-900 text-rose-400 hover:text-rose-300 hover:bg-rose-950 hover:border-rose-700 focus:outline-none transition-all duration-300 shadow-sm cursor-pointer"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              id="header-login-btn"
              className="group relative flex h-10 px-5 items-center justify-center rounded-full bg-white hover:bg-stone-100 text-black font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:translate-y-[-1px] focus:outline-none cursor-pointer"
            >
              {t.login}
            </Link>
          )}
          */}

          <button
            id="cart-btn"
            onClick={onOpenCart}
            suppressHydrationWarning
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/60 text-stone-300 hover:bg-stone-800 hover:text-white hover:border-stone-500 hover:shadow-[0_0_15px_rgba(250,204,21,0.15)] focus:outline-none transition-all duration-300 cursor-pointer ${
              animateCart ? 'animate-wiggle-glow border-amber-500/60 bg-amber-900/20' : ''
            }`}
          >
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-105 animate-wiggle" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-[10px] font-bold text-white ring-2 ring-black shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Dark cosmic theme */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-800/60 bg-black/95 backdrop-blur-xl px-4 pt-2 pb-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] animate-fade-in">
          
          {/* Mobile cosmic stars decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-4 right-8 text-[6px] text-amber-400/50 animate-twinkle select-none">✦</div>
            <div className="absolute bottom-8 left-6 text-[7px] text-blue-400/40 animate-twinkle select-none" style={{ animationDelay: '1s' }}>✦</div>
            <div className="absolute top-1/2 right-12 text-[5px] text-white/20 animate-twinkle select-none" style={{ animationDelay: '2s' }}>•</div>
          </div>

          <div className="space-y-2 pt-2 pb-3 relative z-10">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`mobile-nav-${item.href === '/' ? 'home' : item.href.slice(1)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left py-3 px-4 font-display text-lg font-bold rounded-xl transition-all duration-300 focus:outline-none ${
                    isActive 
                      ? 'bg-white/10 text-white border-l-4 border-amber-500' 
                      : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${item.dotColor} ${isActive ? 'shadow-[0_0_8px_currentColor]' : 'opacity-60'}`} />
                  </div>
                </Link>
              );
            })}

            {/* Mobile Language Toggle */}
            <div className="border-t border-stone-800/60 pt-4 px-4 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-stone-500">{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
              <div className="flex items-center rounded-full border border-stone-700/60 bg-stone-900/60 p-0.5">
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-wider rounded-full transition-all duration-350 cursor-pointer ${
                    language === 'vi'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-wider rounded-full transition-all duration-350 cursor-pointer ${
                    language === 'en'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Temporarily hidden login functionality on mobile
            <div className="border-t border-stone-800/60 pt-4 px-4">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Link
                    href={user?.role === 'ADMIN' ? '/admin' : '/account'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-white font-display font-bold text-base hover:underline"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Dashboard ({user?.name.split(' ')[0]})</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-400 hover:text-rose-300 font-sans text-sm font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-white text-black font-display text-sm font-bold uppercase tracking-wider rounded-full hover:bg-stone-100 transition-all cursor-pointer"
                >
                  {t.loginRegister}
                </Link>
              )}
            </div>
            */}
          </div>
        </div>
      )}
    </header>
  );
}
