import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { PageType } from '../types';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  cartCount: number;
  onOpenCart?: () => void;
}

export default function Header({ currentPage, onNavigate, cartCount, onOpenCart }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as PageType, label: 'Home', hoverClass: 'hover:text-blue-500 hover:scale-105 active:scale-95 transition-all duration-300 brand-glow-blue cursor-pointer', dotColor: 'bg-blue-500' },
    { id: 'products' as PageType, label: 'Our UNIverse', hoverClass: 'hover:text-amber-500 hover:scale-105 active:scale-95 transition-all duration-300 brand-glow-yellow cursor-pointer', dotColor: 'bg-yellow-500' },
    { id: 'about-us' as PageType, label: 'About us', hoverClass: 'hover:text-red-500 hover:scale-105 active:scale-95 transition-all duration-300 brand-glow-red cursor-pointer', dotColor: 'bg-red-500' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`relative py-2 font-display text-base font-semibold tracking-wide text-stone-700 transition-colors ${item.hoverClass}`}
              >
                {item.label}
                {isActive && (
                  <span className={`absolute -bottom-[21px] left-0 right-0 h-[3px] ${item.dotColor} rounded-full transition-all duration-300`} />
                )}
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
            <span className="font-display text-2xl font-extrabold tracking-widest text-black flex items-center transition-transform hover:scale-105 duration-300">
              YO<span className="text-amber-500 group-hover:text-blue-500 transition-colors duration-500">U</span>niverse
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
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-all duration-300 shadow-sm"
          >
            <ShoppingBag className="h-5 w-5 hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
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
                  className={`block w-full text-left py-3 px-4 font-display text-lg font-bold rounded-lg transition-colors ${
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
