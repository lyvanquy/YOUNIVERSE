'use client';

import { createContext, useContext, useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Bell, Send, Check } from 'lucide-react';
import { CustomJewelry } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import MarqueeSlogan from './components/MarqueeSlogan';
import CartDrawer from './components/CartDrawer';

type YouniverseAppContextValue = {
  addCustomToCart: (item: CustomJewelry) => void;
  notifySoon: (charmName: string) => void;
};

const YouniverseAppContext = createContext<YouniverseAppContextValue | null>(null);

export const useYouniverseApp = () => {
  const context = useContext(YouniverseAppContext);

  if (!context) {
    throw new Error('useYouniverseApp must be used inside YouniverseApp');
  }

  return context;
};

export default function YouniverseApp({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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
    router.push('/about');
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
    <YouniverseAppContext.Provider
      value={{
        addCustomToCart: handleAddCustomToCart,
        notifySoon: triggerNotifySoon,
      }}
    >
      <div className="min-h-screen bg-stone-50 font-sans text-stone-800 antialiased flex flex-col justify-between" id="app-root-container">
        
        {/* 1. Header Navigation Area */}
        <Header 
          cartCount={cart.length}
          onOpenCart={() => setCartOpen(true)}
        />

        {/* 2. Primary Page Content */}
        <main className="flex-grow">
          {children}

          {/* Dynamic Running text slogan after banner or pages as requested (Page 4 & 7) */}
          {pathname !== '/' && (
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
          
          <div className="relative w-full max-w-md bg-white/85 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 md:p-8 shadow-2xl z-10 text-left animate-fade-in space-y-6 overflow-hidden">
            
            {/* Tech coordinates grid backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

            <div className="flex justify-between items-start relative z-10">
              <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Early Access Register
              </span>
              <button 
                onClick={() => setActiveNotificationCharm(null)}
                className="text-stone-400 hover:text-black font-semibold font-mono transition-colors text-xs hover:underline cursor-pointer focus:outline-none"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center space-x-2 text-amber-500">
                <Bell className="h-5 w-5 animate-bounce" />
                <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                  Register Interest for {activeNotificationCharm}
                </h3>
              </div>
              
              <p className="font-sans text-xs text-stone-505 leading-relaxed">
                The <strong className="text-black font-semibold">{activeNotificationCharm}</strong> charm is currently being crafted by the ISB Event Team. Leave your email to receive early notifications and unlock an exclusive 10% discount code!
              </p>
            </div>

            {registrationSuccess ? (
              <div className="bg-emerald-500 text-white rounded-xl p-4 flex items-center space-x-3 text-xs md:text-sm shadow-inner transition-all relative z-10">
                <Check className="h-5 w-5 shrink-0 animate-bounce" />
                <span className="font-semibold">Successfully registered! We will contact you immediately upon launch!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitEmailNotification} className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-450 font-bold block" htmlFor="notif-email">
                    Email address for exclusive benefits:
                  </label>
                  <input
                    id="notif-email"
                    type="email"
                    required
                    value={registrationEmail}
                    onChange={(e) => setRegistrationEmail(e.target.value)}
                    placeholder="email-cua-ban@gmail.com"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-xs font-sans text-black focus:border-stone-400 focus:outline-none bg-stone-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-stone-950 hover:bg-black text-white py-3.5 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(0,0,0,0.15)] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Confirm Early Notification</span>
                </button>
              </form>
            )}

            <div className="text-center font-mono text-[9px] text-stone-400 relative z-10">
              * Data strictly secured by YOUniverse ISB.
            </div>

          </div>
        </div>
      )}

      {/* 6. Success Alert toast after custom drafts order placement */}
      {orderPlacedSuccess && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-sm w-full bg-stone-950/90 backdrop-blur-xl text-white p-5 rounded-2xl border border-stone-805 shadow-[0_15px_35px_rgba(0,0,0,0.35)] space-y-4 animate-slide-in text-left overflow-hidden group">
          
          {/* Tech coordinates grid backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

          <div className="flex items-center space-x-2.5 text-amber-400 relative z-10">
            <Sparkles className="h-5 w-5 animate-twinkle" />
            <h4 className="font-display text-sm font-black uppercase tracking-widest">
              Draft Order Placed!
            </h4>
          </div>

          <p className="font-sans text-xs text-stone-300 leading-relaxed relative z-10">
            Your customized YOUniverse jewelry design draft has been saved. Please contact the ISB Event Team to review the physical accessory prototypes.
          </p>

          <button
            onClick={() => setOrderPlacedSuccess(false)}
            className="w-full rounded-full bg-white hover:bg-stone-100 text-black py-2.5 text-xs font-display font-extrabold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] relative z-10 cursor-pointer"
          >
            Got It
          </button>
        </div>
      )}

      </div>
    </YouniverseAppContext.Provider>
  );
}
