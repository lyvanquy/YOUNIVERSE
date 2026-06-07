"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useYouniverseApp } from "../YouniverseApp";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Layers, 
  LogOut, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight,
  Package
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useYouniverseApp();

  // Route Guard: Redirect if not Admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "ADMIN") {
      router.push("/account");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="h-6 w-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Simulated Admin statistics
  const stats = [
    { label: "Stellar Revenue", value: "12,850,000 VND", change: "+12.4% this week", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Stellar Orders", value: "48", change: "+8 new today", icon: ShoppingBag, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { label: "Active Voyagers", value: "152", change: "+24 this month", icon: Users, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { label: "Charm Stock Status", value: "3 Collections", change: "Astra, Sirius, Polaris", icon: Package, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  ];

  // Simulated recent orders
  const recentOrders = [
    { id: "YOUNIV-9821", name: "Cosmic Voyager", email: "user@youniverse.com", date: "2026-06-07", status: "Processing", total: "248,000 VND" },
    { id: "YOUNIV-9742", name: "Nguyen Linh Chi", email: "chi.nl@isb.edu.vn", date: "2026-06-06", status: "Paid", total: "129,000 VND" },
    { id: "YOUNIV-9510", name: "Tran Hai Dang", email: "dang.th@isb.edu.vn", date: "2026-06-06", status: "Paid", total: "386,000 VND" },
    { id: "YOUNIV-9310", name: "Quach Kha Thi", email: "thi.qk@isb.edu.vn", date: "2026-06-05", status: "Completed", total: "119,000 VND" },
  ];

  return (
    <div className="relative min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 z-10" id="admin-page">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-amber-500/3 filter blur-[120px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-blue-500/3 filter blur-[120px] pointer-events-none z-0 animate-pulse-glow duration-5000" />

      {/* Header and Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200/50 pb-6 relative z-10">
        <div className="text-left space-y-1">
          <div className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
            [ System Control / Core Dashboard ]
          </div>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-stone-900 flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-stone-700" />
            <span>YOUNIVERSE CONTROL CENTER</span>
          </h2>
        </div>

        <button
          onClick={logout}
          className="rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 py-2.5 px-5 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-sm hover:shadow"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit System</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-left space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="font-sans text-xs font-semibold text-stone-550 uppercase tracking-wide">{stat.label}</span>
              <div className={`p-2 rounded-xl border ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl font-extrabold tracking-tight text-stone-900">{stat.value}</h3>
              <p className="font-sans text-[10px] text-stone-400 font-medium">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Admin Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left 2 Columns: Order Logs */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-black uppercase tracking-tight text-stone-900">Recent Transactions</h3>
            <button
              onClick={() => alert("Transactional data logs coming soon.")}
              className="font-mono text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider hover:underline focus:outline-none"
            >
              View All logs
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-100 bg-stone-50/20">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-450 uppercase font-mono text-[9px] tracking-wider border-b border-stone-100">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-4">Voyager</th>
                  <th className="py-4 px-4">Stellar Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-100/50 hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-stone-900">{order.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-sans font-semibold text-stone-850">{order.name}</div>
                      <div className="text-[10px] text-stone-400">{order.email}</div>
                    </td>
                    <td className="py-4 px-4 font-sans text-stone-500">{order.date}</td>
                    <td className="py-4 px-4">
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        order.status === "Completed" 
                          ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                          : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-display font-extrabold text-stone-900 text-right">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: System Admin Actions */}
        <div className="lg:col-span-1 space-y-6 text-left">
          
          <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-[32px] p-6 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-black uppercase tracking-tight text-stone-900">System Actions</h3>
            
            <div className="space-y-3 font-sans text-xs">
              <button 
                onClick={() => alert("Product creator workflow is coming soon.")}
                className="w-full flex items-center justify-between p-4 border border-stone-100 bg-stone-50/40 hover:bg-stone-50 rounded-2xl transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Package className="h-4 w-4 text-stone-500" />
                  <span className="font-semibold text-stone-800">Add New Charm</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => alert("Stock coordinate adjustment is coming soon.")}
                className="w-full flex items-center justify-between p-4 border border-stone-100 bg-stone-50/40 hover:bg-stone-50 rounded-2xl transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Layers className="h-4 w-4 text-stone-500" />
                  <span className="font-semibold text-stone-800">Inventory Adjust</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => alert("Stellar coupon generator is coming soon.")}
                className="w-full flex items-center justify-between p-4 border border-stone-100 bg-stone-50/40 hover:bg-stone-50 rounded-2xl transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-4 w-4 text-stone-500" />
                  <span className="font-semibold text-stone-800">Generate Coupon</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* ISB Creator Box */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-850 rounded-[32px] p-6 shadow-md text-white space-y-3 relative overflow-hidden">
            {/* Tech coordinates grid backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />
            
            <div className="relative z-10 flex items-center space-x-2 text-amber-400">
              <Sparkles className="h-4 w-4 animate-twinkle" />
              <h4 className="font-display text-xs font-bold uppercase tracking-wider">System Creator Log</h4>
            </div>
            
            <p className="font-sans text-[11px] text-stone-300 leading-relaxed relative z-10">
              Admin console managed by the UEH.ISB team. Confirm updates only through matching PR approvals.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
