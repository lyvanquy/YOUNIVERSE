"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useYouniverseApp } from "../../YouniverseApp";
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useYouniverseApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to the correct dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all cosmic credentials.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Redirection will be handled by the useEffect
      } else {
        setError(res.message || "Failed to log in to the YOUniverse.");
      }
    } catch (err) {
      setError("An unexpected stellar error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-16 px-4 overflow-hidden" id="login-container">
      {/* 1. Background elements aligning with YOUniverse theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 filter blur-[90px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/5 filter blur-[90px] pointer-events-none z-0 animate-pulse-glow duration-5000" />

      {/* 2. Glassmorphic Login Card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-8 md:p-10 shadow-2xl z-10 overflow-hidden">
        {/* Card Technical mesh backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Top Orbiting Sparkle Header */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-50 to-amber-100/30 border border-amber-200 flex items-center justify-center shadow-inner">
            <div className="absolute inset-[-4px] rounded-full border border-dashed border-amber-400/40 animate-spin-slow" />
            <Sparkles className="h-6 w-6 text-amber-500 animate-twinkle" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-black uppercase tracking-wider text-stone-900">
              VOYAGER LOGIN
            </h2>
            <p className="font-sans text-xs text-stone-500 leading-relaxed max-w-xs">
              Enter your cosmic credentials to access your personal galaxy.
            </p>
          </div>

          {error && (
            <div className="w-full bg-rose-50 border border-rose-200 text-rose-600 rounded-xl p-3 text-xs font-sans text-left animate-fade-in flex items-start space-x-2">
              <span className="shrink-0 mt-0.5">✦</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Field */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block ml-1" htmlFor="login-email">
                Cosmic Address (Email)
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
                  className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold block" htmlFor="login-password">
                  Stellar Password
                </label>
                <Link
                  href="#"
                  onClick={() => alert("Please contact UEH.ISB team leader to reset password.")}
                  className="text-[9px] font-sans text-stone-450 hover:underline hover:text-amber-500 transition-colors"
                >
                  Forgot Password?
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
                  className="w-full border border-stone-200 focus:border-stone-400 focus:ring-1 focus:ring-stone-400 rounded-2xl pl-11 pr-11 py-3.5 text-xs font-sans text-stone-900 bg-stone-50/40 focus:bg-white focus:outline-none transition-all"
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
                  <span>Enter YOUniverse</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="text-center font-sans text-xs text-stone-500 pt-2">
            <span>New to the universe? </span>
            <Link
              href="/register"
              id="go-to-register"
              className="text-stone-900 font-bold hover:underline hover:text-amber-500 transition-colors"
            >
              Create Unique Identity
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
