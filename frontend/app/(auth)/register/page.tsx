"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useYouniverseApp } from "../../YouniverseApp";
import { translations } from "../../locales";
import { Eye, EyeOff, Lock, Mail, User, Phone, Check, Heart } from "lucide-react";
import GoogleLoginButton from "../../components/GoogleLoginButton";

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin, isAuthenticated, language } = useYouniverseApp();
  const t = translations[language];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref-based cursor following for 120 FPS performance (zero React re-renders!)
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById('register-container');
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

  // Redirect authenticated users to their account page
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/account");
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return t.fillRequiredFieldsError;
    }

    // Email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t.invalidEmailError;
    }

    // Password rules: minimum 8 characters, at least one letter and one number
    if (password.length < 8) {
      return t.passwordRuleError;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return t.passwordRuleError;
    }

    if (password !== confirmPassword) {
      return t.passwordMatchError;
    }

    if (!agreeTerms) {
      return t.agreeTermsError;
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await register(name, email, phone, password);
      if (res.success) {
        router.push("/account");
      } else {
        setError(res.message || t.registerFailedError);
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
        router.push("/account");
      } else {
        setError(res.message || t.registerFailedError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.unexpectedError);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white" id="register-container">
      {/* 2. Interactive Mouse-Follow Glow Halo (Desktop only) */}
      <div 
        ref={glowRef}
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none z-0 blur-[100px] opacity-35 bg-gradient-to-r from-rose-500 via-pink-400 to-cyan-400 hidden md:block will-change-transform transform-gpu"
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
              {t.registerTitle}
            </h2>
            <p className="font-sans text-xs text-stone-500 leading-relaxed">
              {t.registerSubtitle}
            </p>
          </div>

          {error && (
            <div className="w-full bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-xs font-sans text-left flex items-start space-x-2">
              <span className="shrink-0 mt-0.5">✦</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Full Name */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="register-name">
                {t.fullNameLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  required
                  placeholder={language === 'vi' ? "Nguyễn Linh Chi" : "Jane Doe"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 focus:shadow-[0_0_12px_rgba(244,63,94,0.15)] rounded-2xl pl-11 pr-4 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="register-email">
                {t.emailLabelLogin} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  required
                  placeholder="your-name@galaxy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 focus:shadow-[0_0_12px_rgba(244,63,94,0.15)] rounded-2xl pl-11 pr-4 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block ml-1 font-bold" htmlFor="register-phone">
                {t.phoneLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="register-phone"
                  type="tel"
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 focus:shadow-[0_0_12px_rgba(244,63,94,0.15)] rounded-2xl pl-11 pr-4 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Passwords grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="register-password">
                  {t.passwordLabelRegister}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min 8 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 focus:shadow-[0_0_12px_rgba(244,63,94,0.15)] rounded-2xl pl-11 pr-11 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
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

              {/* Confirm Password */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="register-confirm">
                  {t.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="register-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-stone-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 focus:shadow-[0_0_12px_rgba(244,63,94,0.15)] rounded-2xl pl-11 pr-11 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-stone-400 hover:text-stone-700 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2 text-left">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-950 focus:ring-1 focus:ring-rose-400 cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-stone-500 text-[11px] leading-relaxed cursor-pointer select-none font-semibold">
                {t.agreeTermsLabel}
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-stone-950 hover:bg-black text-white py-4 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(0,0,0,0.15)] hover:translate-y-[-1px] flex items-center justify-center space-x-2 cursor-pointer disabled:bg-stone-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.registerBtn}</span>
                  <Check className="h-4 w-4" />
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
              text="signup_with"
              locale={language}
              disabled={loading}
            />
          </form>

          <div className="text-center font-sans text-xs text-stone-500 pt-2 border-t border-dashed border-stone-200/80 w-full">
            <span>{t.alreadyHaveIdentity} </span>
            <Link
              href="/login"
              id="go-to-login"
              className="text-stone-900 font-bold hover:underline hover:text-rose-500 transition-colors font-semibold"
            >
              {t.loginInstead}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
