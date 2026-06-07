"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useYouniverseApp } from "../../YouniverseApp";
import { Sparkles, Eye, EyeOff, Lock, Mail, User, Phone, Check, Heart } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, user } = useYouniverseApp();

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

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  }, [isAuthenticated, user, router]);

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return "Please fill in all required cosmic coordinate fields.";
    }

    // Email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid cosmic email address.";
    }

    // Password rules: minimum 8 characters, at least one letter and one number
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return "Password must contain both letters and numbers.";
    }

    if (password !== confirmPassword) {
      return "Stellar passwords do not match.";
    }

    if (!agreeTerms) {
      return "You must agree to the YOUniverse terms and conditions.";
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
        // Redirection will be handled by the useEffect
      } else {
        setError(res.message || "Failed to create your identity.");
      }
    } catch (err) {
      setError("Stellar disturbance occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-16 px-4 overflow-hidden" id="register-container">
      {/* 1. Background elements aligning with YOUniverse theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[15%] right-[-10%] w-[350px] h-[350px] rounded-full bg-rose-500/5 filter blur-[90px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-[15%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 filter blur-[90px] pointer-events-none z-0 animate-pulse-glow duration-5000" />

      {/* 2. Glassmorphic Registration Card */}
      <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-8 md:p-10 shadow-2xl z-10 overflow-hidden">
        {/* Card Technical mesh backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Top Orbiting Heart Header */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-rose-50 to-rose-100/30 border border-rose-200 flex items-center justify-center shadow-inner">
            <div className="absolute inset-[-4px] rounded-full border border-dashed border-rose-400/40 animate-spin-slow" style={{ animationDirection: "reverse" }} />
            <Heart className="h-6 w-6 text-rose-500 animate-float" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-black uppercase tracking-wider text-stone-900">
              CREATE IDENTITY
            </h2>
            <p className="font-sans text-xs text-stone-500 leading-relaxed max-w-xs">
              Begin your journey and design your unique universe.
            </p>
          </div>

          {error && (
            <div className="w-full bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-xs font-sans text-left animate-fade-in flex items-start space-x-2">
              <span className="shrink-0 mt-0.5">✦</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Full Name */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="register-name">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  required
                  placeholder="Ms. Cosmic Voyager"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-2xl pl-11 pr-4 py-3 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="register-email">
                Cosmic Address (Email) *
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
                  className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-2xl pl-11 pr-4 py-3 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 block ml-1 font-bold" htmlFor="register-phone">
                Mobile Number (Optional)
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
                  className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-2xl pl-11 pr-4 py-3 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Passwords grid (Responsive: 1 column on mobile, 2 columns on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="register-password">
                  Stellar Password *
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
                    className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-2xl pl-11 pr-11 py-3 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
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
                  Confirm Password *
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
                    className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-2xl pl-11 pr-11 py-3 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
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
                className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-950 focus:ring-stone-950 cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-stone-500 text-[11px] leading-relaxed cursor-pointer select-none">
                I agree to align my energy with the YOUniverse rules. I consent to styling unique modular charms and keeping my personal galaxy data secure.
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
                  <span>Create Account</span>
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center font-sans text-xs text-stone-500 pt-2 border-t border-dashed border-stone-200/80 w-full">
            <span>Already have an identity? </span>
            <Link
              href="/login"
              id="go-to-login"
              className="text-stone-900 font-bold hover:underline hover:text-rose-500 transition-colors"
            >
              Login Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
