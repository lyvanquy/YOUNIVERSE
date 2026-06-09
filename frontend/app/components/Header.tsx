'use client';

import { useState, useEffect } from 'react';
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
    { href: '/', label: t.home, hoverClass: 'hover:text-blue-500 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-blue cursor-pointer', dotColor: 'bg-blue-500' },
    { href: '/products', label: t.ourUniverse, hoverClass: 'hover:text-amber-500 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-yellow cursor-pointer', dotColor: 'bg-yellow-500' },
    { href: '/about', label: t.aboutUs, hoverClass: 'hover:text-red-500 hover:-translate-y-[2px] hover:scale-[1.02] active:scale-[0.98] brand-glow-red cursor-pointer', dotColor: 'bg-red-500' },
  ];

  const isActiveRoute = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

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
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.href === '/' ? 'home' : item.href.slice(1)}`}
                className={`group relative py-2 font-display text-base font-semibold tracking-wide text-stone-700 transition-all duration-500 ease-out focus:outline-none ${item.hoverClass}`}
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
            className="inline-flex items-center justify-center rounded-md p-2 text-stone-700 hover:bg-stone-50 hover:text-stone-900 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Center: Logo (as described: "Logo ở giữa click vào => đưa về trang chủ") */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Link
            id="logo-brand"
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex flex-col items-center justify-center focus:outline-none"
          >
            <span className="relative font-youth text-lg md:text-2xl font-extrabold tracking-widest text-black flex items-center transition-transform hover:scale-105 duration-300">
              <Sparkles className="absolute -left-5 md:-left-6 top-1 md:top-1.5 h-3 w-3 md:h-4 md:w-4 text-amber-500 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300 animate-twinkle" />
              YO<span className="text-amber-500 group-hover:text-blue-500 transition-colors duration-500">U</span>niverse
              <Sparkles className="absolute -right-5 md:-right-6 bottom-1 md:bottom-1.5 h-3 w-3 md:h-4 md:w-4 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:-rotate-12 transition-all duration-300 animate-twinkle" />
            </span>
            <span className="hidden md:block text-[7px] font-mono tracking-[0.35em] text-stone-400 uppercase group-hover:text-red-500 transition-colors duration-500">
              A Galaxy to Hold
            </span>
          </Link>
        </div>

        {/* Right Side: Account state, Language Toggle, and Shopping Bag */}
        <div className="flex items-center space-x-1.5 md:space-x-3 z-20">
          {/* Language Toggle - hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center rounded-full border border-stone-250 bg-stone-50/80 p-0.5 shadow-sm">
            <button
              onClick={() => setLanguage('vi')}
              className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full transition-all duration-350 cursor-pointer ${
                language === 'vi'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-full transition-all duration-350 cursor-pointer ${
                language === 'en'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              EN
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center space-x-1.5 md:space-x-2">
              <Link
                href={user?.role === 'ADMIN' ? '/admin' : '/account'}
                id="header-account-btn"
                className="group relative flex h-9 md:h-10 w-9 md:w-auto md:px-4 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-stone-955 hover:border-stone-400 transition-all duration-300 shadow-sm focus:outline-none"
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
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-rose-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-300 focus:outline-none transition-all duration-300 shadow-sm cursor-pointer"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              id="header-login-btn"
              className="group relative flex h-10 px-5 items-center justify-center rounded-full bg-stone-950 hover:bg-black text-white font-display text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-md hover:translate-y-[-1px] focus:outline-none cursor-pointer"
            >
              Login
            </Link>
          )}

          <button
            id="cart-btn"
            onClick={onOpenCart}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-stone-900 hover:border-black hover:shadow-[0_0_12px_rgba(250,204,21,0.15)] focus:outline-none transition-all duration-300 shadow-sm cursor-pointer ${
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
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`mobile-nav-${item.href === '/' ? 'home' : item.href.slice(1)}`}
                  onClick={() => setMobileMenuOpen(false)}
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
                </Link>
              );
            })}

            {/* Mobile Language Toggle */}
            <div className="border-t border-stone-100 pt-4 px-4 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-stone-500">{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
              <div className="flex items-center rounded-full border border-stone-250 bg-stone-50/80 p-0.5 shadow-sm">
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-wider rounded-full transition-all duration-350 cursor-pointer ${
                    language === 'vi'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-wider rounded-full transition-all duration-350 cursor-pointer ${
                    language === 'en'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile Auth actions */}
            <div className="border-t border-stone-100 pt-4 px-4">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Link
                    href={user?.role === 'ADMIN' ? '/admin' : '/account'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-stone-900 font-display font-bold text-base hover:underline"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Dashboard ({user?.name.split(' ')[0]})</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-500 hover:text-rose-700 font-sans text-sm font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-stone-950 text-white font-display text-sm font-bold uppercase tracking-wider rounded-full hover:bg-black transition-all cursor-pointer"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
