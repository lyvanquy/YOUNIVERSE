'use client';

import { createContext, useContext, useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Bell, Send, Check } from 'lucide-react';
import { CustomJewelry } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import MarqueeSlogan from './components/MarqueeSlogan';
import { TestimonialCarousel, MaterialShowcase, AstraShowcase, SiriusShowcase, PolarisShowcase, Visual4Steps } from './components/ProductsView';
import CartDrawer from './components/CartDrawer';
import { translations } from './locales';
import { apiRequest, AUTH_TOKEN_KEY, USER_KEY, type ApiUser } from './lib/api';

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
};

type YouniverseAppContextValue = {
  language: 'en' | 'vi';
  setLanguage: (lang: 'en' | 'vi') => void;
  addCustomToCart: (item: CustomJewelry) => void;
  notifySoon: (charmName: string) => void;
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (credential: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  updateAvatar: (avatarUrl: string) => Promise<UserInfo>;
  updateProfile: (name: string, phone: string, address: string) => Promise<UserInfo>;
  logout: () => void;
};

const YouniverseAppContext = createContext<YouniverseAppContextValue | null>(null);

const toUserInfo = (user: ApiUser): UserInfo => ({
  id: user.id,
  name: user.fullName,
  email: user.email,
  phone: user.phone ?? undefined,
  avatarUrl: user.avatarUrl ?? undefined,
  address: user.address ?? undefined,
});

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

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const showPublicLayout = !isAuthPage;
  const [cart, setCart] = useState<CustomJewelry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [mounted, setMounted] = useState(false);
  const t = translations[language];

  // Load language from local storage on mount
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('youniverse_lang');
      if (storedLang === 'en' || storedLang === 'vi') {
        setLanguage(storedLang);
      }
    } catch (e) {
      console.warn('Could not load language from localStorage', e);
    }
    setMounted(true);
  }, []);

  const updateLanguage = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    try {
      localStorage.setItem('youniverse_lang', lang);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  };

  // Dynamic HTML lang attribute & font fallback toggle
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (language === 'vi') {
        root.classList.add('lang-vi');
        root.setAttribute('lang', 'vi');
      } else {
        root.classList.remove('lang-vi');
        root.setAttribute('lang', 'en');
      }
    } catch (e) {
      console.warn('Could not set HTML lang attributes', e);
    }
  }, [language]);
  
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Dialog modal states
  const [activeNotificationCharm, setActiveNotificationCharm] = useState<string | null>(null);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);

  // Load cart and user auth from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('youniverse_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }

      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      }

      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(Boolean(storedUser));

        apiRequest<{ user: ApiUser }>('/auth/me', { token: storedToken })
          .then((data) => {
            const nextUser = toUserInfo(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
            setUser(nextUser);
            setIsAuthenticated(true);
          })
          .catch(() => {
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          });
      }
    } catch (e) {
      console.warn('Could not load app state from localStorage', e);
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

  const handleLogin = async (email: string, password: string) => {
    const data = await apiRequest<{ user: ApiUser; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const nextUser = toUserInfo(data.user);

    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(data.accessToken);
    setUser(nextUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const handleGoogleLogin = async (credential: string) => {
    const data = await apiRequest<{ user: ApiUser; accessToken: string }>('/auth/google', {
      method: 'POST',
      body: { credential },
    });
    const nextUser = toUserInfo(data.user);

    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(data.accessToken);
    setUser(nextUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const handleRegister = async (name: string, email: string, phone: string, password: string) => {
    const data = await apiRequest<{ user: ApiUser; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: {
        fullName: name,
        email,
        phone: phone || undefined,
        password,
        confirmPassword: password,
      },
    });
    const nextUser = toUserInfo(data.user);

    localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(data.accessToken);
    setUser(nextUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const handleUpdateAvatar = async (avatarUrl: string) => {
    if (!token) {
      throw new Error('Authentication required');
    }

    const data = await apiRequest<{ user: ApiUser }>('/auth/me/avatar', {
      method: 'PATCH',
      token,
      body: { avatarUrl },
    });
    const nextUser = toUserInfo(data.user);

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const handleUpdateProfile = async (name: string, phone: string, address: string) => {
    if (!token) {
      throw new Error('Authentication required');
    }

    const data = await apiRequest<{ user: ApiUser }>('/auth/me/profile', {
      method: 'PATCH',
      token,
      body: {
        fullName: name,
        phone: phone || undefined,
        address: address || undefined,
      },
    });
    const nextUser = toUserInfo(data.user);

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <YouniverseAppContext.Provider
      value={{
        language,
        setLanguage: updateLanguage,
        addCustomToCart: handleAddCustomToCart,
        notifySoon: triggerNotifySoon,
        user,
        token,
        isAuthenticated,
        login: handleLogin,
        googleLogin: handleGoogleLogin,
        register: handleRegister,
        updateAvatar: handleUpdateAvatar,
        updateProfile: handleUpdateProfile,
        logout: handleLogout
      }}
    >
      <div className={`min-h-screen bg-stone-50 font-sans text-stone-800 antialiased flex flex-col justify-between ${language === 'vi' ? 'lang-vi' : ''}`} id="app-root-container">
        
        {/* 1. Header Navigation Area */}
        {showPublicLayout && (
          <Header 
            cartCount={cart.length}
            onOpenCart={() => setCartOpen(true)}
          />
        )}

        {/* 2. Primary Page Content */}
        <main className="flex-grow">
          {children}

          {/* Dynamic Running text slogan after banner or pages as requested (Page 4 & 7) */}
          {pathname !== '/' && pathname !== '/order' && pathname !== '/policy' && showPublicLayout && (
            <section className="my-6">
              <MarqueeSlogan onSloganClick={handleSloganClick} variant={pathname === '/products' ? 'newArrivals' : 'default'} />
            </section>
          )}

          {/* YOUniverse & YOU — Customer Testimonials (Products page only) */}
          {pathname === '/products' && (
            <TestimonialCarousel language={language} />
          )}

          {/* Premium Heat-Shrink Plastic — Material Showcase (Products page only) */}
          {pathname === '/products' && (
            <MaterialShowcase language={language} />
          )}

          {/* Astra: Your Unique Identifier (Products page only) */}
          {pathname === '/products' && (
            <AstraShowcase language={language} />
          )}

          {/* Sirius: The Unspoken Passion (Products page only) */}
          {pathname === '/products' && (
            <SiriusShowcase language={language} />
          )}

          {/* Polaris: The Guiding Spirit (Products page only) */}
          {pathname === '/products' && (
            <PolarisShowcase language={language} />
          )}

          {/* Visual 4 Steps (Products page only) */}
          {pathname === '/products' && (
            <Visual4Steps language={language} />
          )}
        </main>

        {/* 3. Footer Segment */}
        {showPublicLayout && <Footer />}

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
                {t.earlyAccess}
              </span>
              <button 
                onClick={() => setActiveNotificationCharm(null)}
                className="text-stone-400 hover:text-black font-semibold font-mono transition-colors text-xs hover:underline cursor-pointer focus:outline-none"
              >
                {t.close}
              </button>
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center space-x-2 text-amber-500">
                <Bell className="h-5 w-5 animate-bounce" />
                <h3 className="font-display text-xl font-extrabold text-stone-900 uppercase tracking-tight">
                  {t.registerInterest.replace('{name}', activeNotificationCharm || '')}
                </h3>
              </div>
              
              <p className="font-sans text-xs text-stone-500 leading-relaxed">
                {t.earlyAccessDesc.replace('{name}', activeNotificationCharm || '')}
              </p>
            </div>

            {registrationSuccess ? (
              <div className="bg-emerald-500 text-white rounded-xl p-4 flex items-center space-x-3 text-xs md:text-sm shadow-inner transition-all relative z-10">
                <Check className="h-5 w-5 shrink-0 animate-bounce" />
                <span className="font-semibold">{t.successRegister}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitEmailNotification} className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold block" htmlFor="notif-email">
                    {t.emailLabel}
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
                  <span>{t.confirmNotif}</span>
                </button>
              </form>
            )}

            <div className="text-center font-mono text-[9px] text-stone-400 relative z-10">
              {t.securedText}
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
              {t.orderPlaced}
            </h4>
          </div>

          <p className="font-sans text-xs text-stone-300 leading-relaxed relative z-10">
            {t.orderPlacedText}
          </p>

          <button
            onClick={() => setOrderPlacedSuccess(false)}
            className="w-full rounded-full bg-white hover:bg-stone-100 text-black py-2.5 text-xs font-display font-extrabold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] relative z-10 cursor-pointer"
          >
            {t.gotIt}
          </button>
        </div>
      )}

      </div>
    </YouniverseAppContext.Provider>
  );
}
