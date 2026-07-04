"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useYouniverseApp } from "../../YouniverseApp";
import { translations } from "../../locales";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const getSafeReturnTo = () => {
  const fallback = "/";
  const requestedPath = new URLSearchParams(window.location.search).get("returnTo");

  if (!requestedPath) return fallback;

  try {
    const target = new URL(requestedPath, window.location.origin);
    if (target.origin !== window.location.origin) return fallback;
    if (target.pathname === "/login" || target.pathname === "/register") return fallback;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, isAuthenticated, language } = useYouniverseApp();
  const t = translations[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref-based cursor following for 120 FPS performance (zero React re-renders!)
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('login-container');
      if (container && glowRef.current) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // GPU-accelerated translate3d for smooth animations
        glowRef.current.style.transform = `translate3d(${x - 175}px, ${y - 175}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Return authenticated users to the page they were viewing before login.
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(getSafeReturnTo());
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError(t.fillCredentialsError);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordMinLengthError);
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.replace(getSafeReturnTo());
      } else {
        setError(res.message || t.loginFailedError);
      }
    } catch (err) {
      setError(t.unexpectedError);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await googleLogin(credential);
      if (res.success) {
        router.replace(getSafeReturnTo());
      } else {
        setError(res.message || t.loginFailedError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white" id="login-container">
      {/* 2. Interactive Mouse-Follow Glow Halo (Desktop only) */}
      <div 
        ref={glowRef}
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0 blur-[100px] opacity-15 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 hidden md:block will-change-transform transform-gpu"
        style={{
          left: 0,
          top: 0,
        }}
      />

      {/* LEFT PANEL: Branding & Visuals */}
      <div className="relative w-full md:w-2/5 bg-[#0b0f19] flex flex-col justify-between text-white shrink-0 min-h-[35vh] md:min-h-screen z-10 animate-auth-left">
        {/* Full-screen Vertical Pop-Art Illustration Background */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img 
            src="/images/auth-branding-vertical.png" 
            alt="Left Panel Cosmic Backdrop" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/[0.04]" />
        </div>

        {/* Cloud Separator SVGs - Desktop (Right side of left panel) */}
        <svg 
          className="absolute top-0 bottom-0 -right-20 h-full w-40 z-20 pointer-events-none select-none hidden md:block" 
          viewBox="0 0 100 1000" 
          preserveAspectRatio="none"
        >
          {/* Layer 1 - Deep Glow */}
          <path 
            d="M 70,0 C 0,50 0,150 70,200 C 25,230 25,320 70,350 C -5,400 -5,500 70,550 C 20,580 20,670 70,700 C -10,740 -10,840 70,880 C 10,910 10,970 70,1000 L 100,1000 L 100,0 Z" 
            fill="white" 
            fillOpacity={0.15} 
          />
          {/* Layer 2 - Mid Shadow */}
          <path 
            d="M 70,0 C 10,50 10,150 70,200 C 35,230 35,320 70,350 C 5,400 5,500 70,550 C 30,580 30,670 70,700 C 0,740 0,840 70,880 C 20,910 20,970 70,1000 L 100,1000 L 100,0 Z" 
            fill="white" 
            fillOpacity={0.3} 
          />
          {/* Layer 3 - Main Boundary */}
          <path 
            d="M 70,0 C 20,50 20,150 70,200 C 45,230 45,320 70,350 C 15,400 15,500 70,550 C 40,580 40,670 70,700 C 10,740 10,840 70,880 C 30,910 30,970 70,1000 L 100,1000 L 100,0 Z" 
            fill="white" 
          />
        </svg>

        {/* Cloud Separator SVGs - Mobile (Bottom side of left panel) */}
        <svg 
          className="absolute left-0 right-0 -bottom-16 w-full h-32 z-20 pointer-events-none select-none md:hidden" 
          viewBox="0 0 1000 100" 
          preserveAspectRatio="none"
        >
          {/* Layer 1 - Deep Glow */}
          <path 
            d="M 0,70 C 50,0 150,0 200,70 C 230,25 320,25 350,70 C 400,-5 500,-5 550,70 C 580,20 670,20 700,70 C 740,-10 840,-10 880,70 C 910,10 970,10 1000,70 L 1000,100 L 0,100 Z" 
            fill="white" 
            fillOpacity={0.15} 
          />
          {/* Layer 2 - Mid Shadow */}
          <path 
            d="M 0,70 C 50,10 150,10 200,70 C 230,35 320,35 350,70 C 400,5 500,5 550,70 C 580,30 670,30 700,70 C 740,0 840,0 880,70 C 910,20 970,20 1000,70 L 1000,100 L 0,100 Z" 
            fill="white" 
            fillOpacity={0.3} 
          />
          {/* Layer 3 - Main Boundary */}
          <path 
            d="M 0,70 C 50,20 150,20 200,70 C 230,45 320,45 350,70 C 400,15 500,15 550,70 C 580,40 670,40 700,70 C 740,10 840,10 880,70 C 910,30 970,30 1000,70 L 1000,100 L 0,100 Z" 
            fill="white" 
          />
        </svg>
      </div>

      {/* RIGHT PANEL: The Form */}
      <div className="relative w-full md:w-3/5 bg-white flex flex-col justify-center items-center p-8 md:p-16 z-20 min-h-[65vh] md:min-h-screen overflow-hidden animate-auth-right">
        {/* Technical corner crosshairs & coordinates */}
        <div className="absolute top-4 left-6 text-[8px] font-mono text-stone-300 pointer-events-none select-none z-20">+</div>
        <div className="absolute top-4 right-6 text-[8px] font-mono text-stone-300 pointer-events-none select-none z-20">+</div>
        <div className="absolute bottom-4 left-6 text-[8px] font-mono text-stone-300 pointer-events-none select-none z-20">+</div>
        <div className="absolute bottom-4 right-6 text-[8px] font-mono text-stone-300 pointer-events-none select-none z-20">+</div>
        <div className="absolute top-4 right-12 font-mono text-[7px] text-stone-400/80 tracking-widest pointer-events-none select-none z-20 uppercase">
          [ 10.7626° N, 106.6602° E ]
        </div>

        {/* Card Technical mesh backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

        {/* Floating gradient blobs */}
        <div className="absolute -top-20 -right-20 w-[350px] h-[350px] rounded-full bg-amber-200/20 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-blue-200/15 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-rose-100/10 filter blur-[120px] pointer-events-none z-0 animate-pulse-glow" style={{ animationDelay: '4s' }} />

        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.8)_100%)] pointer-events-none z-0" />

        {/* Decorative orbit ring */}
        <div className="absolute top-[15%] right-[10%] w-32 h-32 rounded-full border border-dashed border-stone-200/30 animate-spin-slow pointer-events-none z-0 opacity-40" />
        <div className="absolute bottom-[20%] left-[8%] w-20 h-20 rounded-full border border-dotted border-amber-200/30 animate-spin-slow pointer-events-none z-0 opacity-30" style={{ animationDirection: 'reverse' }} />

        {/* Form Container */}
        <div className="w-full max-w-md space-y-6 relative z-10 animate-auth-form">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-wider text-stone-900">
              {t.loginTitle}
            </h2>
            <p className="font-sans text-xs text-stone-500 leading-relaxed">
              {t.loginSubtitle}
            </p>
          </div>

          {error && (
            <div className="w-full bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-xs font-sans text-left flex items-start space-x-2">
              <span className="shrink-0 mt-0.5">✦</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="login-email">
                {t.emailLabelLogin}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="name@galaxy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-stone-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:shadow-[0_0_12px_rgba(245,158,11,0.15)] rounded-2xl pl-11 pr-4 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block" htmlFor="login-password">
                  {t.passwordLabelLogin}
                </label>
                <Link
                  href="#"
                  onClick={() => alert(language === 'vi' ? "Vui lòng liên hệ với trưởng nhóm UEH.ISB để thiết lập lại mật khẩu." : "Please contact UEH.ISB team leader to reset password.")}
                  className="text-[9px] font-sans text-stone-450 hover:underline hover:text-amber-500 transition-colors font-semibold"
                >
                  {t.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-stone-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:shadow-[0_0_12px_rgba(245,158,11,0.15)] rounded-2xl pl-11 pr-11 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-stone-400 hover:text-stone-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-stone-950 hover:bg-black text-white py-4 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(0,0,0,0.15)] hover:translate-y-[-1px] flex items-center justify-center space-x-2 cursor-pointer disabled:bg-stone-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.loginBtn}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-stone-400">
                {language === "vi" ? "hoặc" : "or"}
              </span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            <GoogleLoginButton
              onCredential={handleGoogleCredential}
              text="signin_with"
              locale={language}
              disabled={loading}
            />
          </form>

          <div className="text-center font-sans text-xs text-stone-500 pt-2 w-full border-t border-dashed border-stone-200/80">
            <span>{t.newToUniverse} </span>
            <Link
              href="/register"
              id="go-to-register"
              className="text-stone-900 font-bold hover:underline hover:text-amber-500 transition-colors font-semibold"
            >
              {t.createIdentity}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
