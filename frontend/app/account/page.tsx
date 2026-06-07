"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useYouniverseApp } from "../YouniverseApp";
import { User, ShoppingBag, MapPin, LogOut, Sparkles, Heart } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useYouniverseApp();

  // Route Guard: Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="h-6 w-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Simulated customer order history
  const mockOrders = [
    {
      id: "YOUNIV-9821",
      date: "2026-06-05",
      total: "248,000 VND",
      status: "Processing",
      statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      items: ["Charm Astra", "Sirius Heart Core"],
    },
    {
      id: "YOUNIV-7410",
      date: "2026-05-20",
      total: "139,000 VND",
      status: "Delivered",
      statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
      items: ["Charm Polaris"],
    },
  ];

  return (
    <div className="relative min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 z-10" id="account-page">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-15%] w-[350px] h-[350px] rounded-full bg-blue-500/4 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[-15%] w-[350px] h-[350px] rounded-full bg-rose-500/3 filter blur-[100px] pointer-events-none z-0 animate-pulse-glow duration-5000" />

      {/* Breadcrumb */}
      <div className="text-left font-mono text-[10px] text-stone-400 uppercase tracking-widest relative z-10">
        [ Home / Account Dashboard ]
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Voyager Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 shadow-md text-left space-y-6 relative overflow-hidden">
            {/* Tech coordinates grid backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808002_1px,transparent_1px),linear-gradient(to_bottom,#80808002_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />

            <div className="flex items-center space-x-4 relative z-10">
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200 flex items-center justify-center shadow-inner">
                <div className="absolute inset-[-3px] rounded-full border border-dashed border-blue-400/40 animate-spin-slow" />
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-display text-lg font-black uppercase tracking-tight text-stone-900 truncate max-w-[160px]">
                  {user.name}
                </h3>
                <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-stone-100 text-xs font-sans text-stone-600 relative z-10">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mb-0.5">Stellar Coordinates (Email)</span>
                <span className="font-medium text-stone-900">{user.email}</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mb-0.5">Comm Link (Phone)</span>
                <span className="font-medium text-stone-900">{user.phone || "Not linked"}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full rounded-full border border-rose-200 bg-rose-50/20 hover:bg-rose-50 text-rose-600 hover:text-rose-700 py-3 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer relative z-10 shadow-sm hover:shadow"
            >
              <LogOut className="h-4 w-4" />
              <span>Stellar Logout</span>
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="bg-white/60 backdrop-blur-md border border-stone-200/40 rounded-[24px] p-5 text-left space-y-2 relative">
            <div className="flex items-center space-x-2 text-stone-800">
              <Heart className="h-4 w-4 text-rose-500 animate-float" />
              <h4 className="font-display text-xs font-bold uppercase tracking-wider">Member Perks</h4>
            </div>
            <p className="font-sans text-[11px] text-stone-500 leading-relaxed">
              Your cosmic profile unlocks early access for upcoming charm lines. Ensure your shipping coordinates are updated during checkout.
            </p>
          </div>
        </div>

        {/* Right Column: Order History and Address Coordinates */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* Order history segment */}
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 md:p-8 shadow-md space-y-6">
            <div className="flex items-center space-x-2 text-stone-950">
              <ShoppingBag className="h-5 w-5 text-stone-700" />
              <h3 className="font-display text-lg font-black uppercase tracking-tight">Order Logs</h3>
            </div>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="border border-stone-100 bg-stone-50/30 hover:bg-stone-50/70 p-5 rounded-2xl transition-all duration-300 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-stone-100">
                    <div>
                      <span className="font-mono text-xs font-bold text-stone-900">{order.id}</span>
                      <span className="text-[10px] font-sans text-stone-400 block sm:inline sm:ml-3">{order.date}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] font-mono uppercase tracking-wider block">Items Purchased</span>
                      <span className="font-sans font-medium text-stone-700">{order.items.join(", ")}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-400 text-[10px] font-mono uppercase tracking-wider block">Cosmic Value</span>
                      <span className="font-display font-extrabold text-stone-900">{order.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Coordinate Block */}
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 md:p-8 shadow-md space-y-6">
            <div className="flex items-center space-x-2 text-stone-950">
              <MapPin className="h-5 w-5 text-stone-700" />
              <h3 className="font-display text-lg font-black uppercase tracking-tight">Shipping Coordinates</h3>
            </div>

            <div className="border border-stone-100 bg-stone-50/30 p-5 rounded-2xl text-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-sans font-bold text-stone-800 block">{user.name}</span>
                  <span className="font-sans text-stone-600 leading-relaxed block mt-1">
                    279 Nguyễn Tri Phương Street, Vườn Lài Ward, District 10, HCMC
                  </span>
                </div>
                <button
                  onClick={() => alert("Coordinate adjustment is coming soon.")}
                  className="font-mono text-[10px] text-amber-600 hover:text-amber-700 font-bold uppercase hover:underline focus:outline-none"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
