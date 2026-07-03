import { BarChart2, Package, ShoppingBag, Users } from "lucide-react";
import { Outlet } from "react-router-dom";

const features = [
  "Quản lý sản phẩm, ảnh & giá",
  "Xử lý đơn hàng & vận chuyển",
  "Theo dõi kho hàng real-time",
  "Thống kê doanh thu & phân tích",
];

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      {/* LEFT — Branding panel */}
      <section className="auth-brand">
        {/* Grid overlay */}
        <div className="auth-brand-grid" />

        {/* Logo */}
        <div className="auth-brand__logo">
          <div className="auth-brand__mark">YOU</div>
          <div className="auth-brand__name">
            YOUniverse
            <span>Admin Dashboard</span>
          </div>
        </div>

        {/* Headline */}
        <h1>
          Trung tâm <em>kiểm soát</em> toàn bộ hệ thống
        </h1>

        <p>
          Dashboard quản trị tập trung: sản phẩm, đơn hàng, kho, mã giảm giá và phản hồi khách hàng — tất cả trong một nơi.
        </p>

        {/* Feature list */}
        <div className="auth-brand__features">
          {features.map((f) => (
            <div key={f} className="auth-brand__feature">
              <span className="auth-brand__feature-dot" />
              {f}
            </div>
          ))}
        </div>

        {/* Decorative stat pills */}
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {[
            { icon: ShoppingBag, label: "Đơn hàng", color: "#3b82f6" },
            { icon: Package,     label: "Sản phẩm", color: "#eab308" },
            { icon: Users,       label: "Khách hàng", color: "#10b981" },
            { icon: BarChart2,   label: "Doanh thu",  color: "#8b5cf6" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 9999,
                padding: "5px 12px",
                fontSize: 11,
                color: "#a1a1aa",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Icon size={12} color={color} />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* RIGHT — Login form */}
      <section className="auth-panel">
        <Outlet />
      </section>
    </main>
  );
}
