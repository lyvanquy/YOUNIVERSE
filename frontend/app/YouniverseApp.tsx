'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Sparkles, Bell, Send, Check } from 'lucide-react';
import { PageType, CustomJewelry } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import MarqueeSlogan from './components/MarqueeSlogan';
import HomeView from './components/HomeView';
import ProductsView from './components/ProductsView';
import AboutView from './components/AboutView';
import CartDrawer from './components/CartDrawer';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [cart, setCart] = useState<CustomJewelry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Dialog modal states
  const [activeNotificationCharm, setActiveNotificationCharm] = useState<string | null>(null);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('youniverse_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage', e);
    }
  }, []);

  // Save cart to local storage whenever it changes
  const updateCart = (newCart: CustomJewelry[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('youniverse_cart', JSON.stringify(newCart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  };

  const handleAddCustomToCart = (item: CustomJewelry) => {
    const updated = [...cart, item];
    updateCart(updated);
  };

  const handleRemoveCartItem = (indexToRemove: number) => {
    const updated = cart.filter((_, idx) => idx !== indexToRemove);
    updateCart(updated);
  };

  const handleSloganClick = () => {
    setCurrentPage('about-us');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerNotifySoon = (charmName: string) => {
    setActiveNotificationCharm(charmName);
    setRegistrationSuccess(false);
    setRegistrationEmail('');
  };

  const handleSubmitEmailNotification = (e: FormEvent) => {
    e.preventDefault();
    if (!registrationEmail.trim()) return;
    
    // Simulate successful API call to save email
    setRegistrationSuccess(true);
    setTimeout(() => {
      setActiveNotificationCharm(null);
      setRegistrationSuccess(false);
    }, 3500);
  };

  const handleCheckoutDraftOrder = () => {
    setOrderPlacedSuccess(true);
    setCart([]);
    updateCart([]);
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased flex flex-col justify-between" id="app-root-container">
      
      {/* 1. Header Navigation Area */}
      <Header 
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cart.length}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* 2. Primary Page Content Switcher */}
      <main className="flex-grow">
        
        {/* Banner Area display conditional logic based on pages (Page 4 requested banner update later, we provide elegant slots) */}
        {currentPage === 'home' && (
          <HomeView 
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddCustomToCart={handleAddCustomToCart}
          />
        )}

        {currentPage === 'products' && (
          <ProductsView 
            onNotifySoon={triggerNotifySoon}
          />
        )}

        {currentPage === 'about-us' && (
          <AboutView 
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Dynamic Running text slogan after banner or pages as requested (Page 4 & 7) */}
        {currentPage !== 'home' && (
          <section className="my-6">
            <MarqueeSlogan onSloganClick={handleSloganClick} />
          </section>
        )}

      </main>

      {/* 3. Footer Segment */}
      <Footer />

      {/* 4. Sliding personalized configured jewels list lookbook */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutDraftOrder}
      />

      {/* 5. Glowing Coming Soon Notification Dialog Modal */}
      {activeNotificationCharm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-hidden" id="notif-modal">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveNotificationCharm(null)} />
          
          <div className="relative w-full max-w-md bg-white border-2 border-black rounded-3xl p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] z-10 text-left animate-fade-in space-y-6">
            
            <div className="flex justify-between items-start">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded">
                Early Access Register
              </span>
              <button 
                onClick={() => setActiveNotificationCharm(null)}
                className="text-stone-400 hover:text-black font-bold font-mono transition-colors text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-amber-500">
                <Bell className="h-5 w-5 animate-bounce" />
                <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                  Register Interest for {activeNotificationCharm}
                </h3>
              </div>
              
              <p className="font-sans text-xs text-stone-500 leading-relaxed">
                The <strong className="text-black font-semibold">{activeNotificationCharm}</strong> charm is currently being crafted by the ISB Event Team. Leave your email to receive early notifications and unlock an exclusive 10% discount code!
              </p>
            </div>

            {registrationSuccess ? (
              <div className="bg-emerald-500 text-white rounded-xl p-4 flex items-center space-x-3 text-xs md:text-sm shadow-inner transition-all">
                <Check className="h-5 w-5 shrink-0 animate-bounce" />
                <span className="font-semibold">Successfully registered! We will contact you immediately upon launch!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitEmailNotification} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block" htmlFor="notif-email">
                    Email address for exclusive benefits:
                  </label>
                  <input
                    id="notif-email"
                    type="email"
                    required
                    value={registrationEmail}
                    onChange={(e) => setRegistrationEmail(e.target.value)}
                    placeholder="email-cua-ban@gmail.com"
                    className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-xs font-sans text-black focus:border-black focus:outline-none bg-stone-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-black hover:bg-stone-900 border-2 border-black text-white py-3.5 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Confirm Early Notification</span>
                </button>
              </form>
            )}

            <div className="text-center font-mono text-[9px] text-stone-400">
              * Data strictly secured by YOUniverse ISB.
            </div>

          </div>
        </div>
      )}

      {/* 6. Success Alert toast after custom drafts order placement */}
      {orderPlacedSuccess && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-sm w-full bg-black text-white p-5 rounded-2xl border-2 border-stone-800 shadow-2xl space-y-4 animate-slide-in text-left">
          <div className="flex items-center space-x-2.5 text-amber-400">
            <Sparkles className="h-5 w-5 animate-twinkle" />
            <h4 className="font-display text-sm font-black uppercase tracking-widest">
              Draft Order Placed!
            </h4>
          </div>

          <p className="font-sans text-xs text-stone-300 leading-relaxed">
            Your customized YOUniverse jewelry design draft has been saved. Please contact the ISB Event Team to review the physical accessory prototypes.
          </p>

          <button
            onClick={() => setOrderPlacedSuccess(false)}
            className="w-full rounded-xl bg-white hover:bg-stone-100 text-black py-2 text-xs font-display font-extrabold uppercase tracking-wide transition-colors"
          >
            Got It
          </button>
        </div>
      )}

    </div>
  );
}
