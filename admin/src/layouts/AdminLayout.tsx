import {
  BadgePercent,
  Boxes,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../features/auth/AuthProvider";
import { cx } from "../lib/ui";
import Avatar from "../components/Avatar";

const navItems = [
  { to: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/products",  label: "Sản phẩm",   icon: Package },
  { to: "/orders",    label: "Đơn hàng",   icon: ShoppingBag },
  { to: "/inventory", label: "Kho hàng",   icon: Boxes },
  { to: "/coupons",   label: "Mã giảm giá",icon: BadgePercent },
  { to: "/users",     label: "Khách hàng", icon: Users },
  { to: "/feedbacks", label: "Phản hồi",   icon: MessageSquare },
  { to: "/settings",  label: "Cài đặt",    icon: Settings },
];

function pageTitle(pathname: string) {
  if (pathname.includes("/products/new"))  return "Thêm sản phẩm";
  if (pathname.includes("/products/") && pathname.includes("/edit")) return "Chỉnh sửa sản phẩm";
  if (pathname.includes("/orders/"))       return "Chi tiết đơn hàng";
  const item = navItems.find((nav) => pathname.startsWith(nav.to));
  return item?.label ?? "Tổng quan";
}

export default function AdminLayout() {
  const auth = useAuth();
  const location = useLocation();

  return (
    <div className="admin-shell">
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar__inner">
          {/* Brand */}
          <div className="sidebar__brand">
            <div className="brand-mark">YOU</div>
            <div className="sidebar__brand-text">
              <strong>YOUniverse</strong>
              <span>Quản trị viên</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="sidebar__nav">
            <div className="nav-section-label">Menu chính</div>
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cx("nav-item", isActive && "nav-item--active")}
                >
                  <span className="nav-item__icon">
                    <Icon size={17} />
                  </span>
                  <span className="nav-item__label">{item.label}</span>
                </NavLink>
              );
            })}

            <div className="nav-section-label" style={{ marginTop: 4 }}>Hệ thống</div>
            {navItems.slice(6).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cx("nav-item", isActive && "nav-item--active")}
                >
                  <span className="nav-item__icon">
                    <Icon size={17} />
                  </span>
                  <span className="nav-item__label">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="sidebar__footer">
            <div className="admin-mini">
              <Avatar name={auth.user?.fullName} size="sm" />
              <div className="admin-mini__info">
                <strong>{auth.user?.fullName ?? "Admin"}</strong>
                <span>{auth.user?.email}</span>
              </div>
            </div>
            <button
              className="button--sidebar-logout"
              type="button"
              onClick={auth.logout}
            >
              <LogOut size={15} />
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN SHELL ─────────────────────────────────────── */}
      <div className="main-shell">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar__left">
            <span className="breadcrumb">Quản trị / {pageTitle(location.pathname)}</span>
          </div>

          <div className="topbar__right">
            {/* Search */}
            <div className="topbar__search">
              <span className="topbar__search-icon">
                <Search size={14} />
              </span>
              <input
                className="topbar__search-input"
                type="search"
                placeholder="Tìm kiếm nhanh..."
                aria-label="Tìm kiếm"
              />
            </div>

            {/* System status */}
            <div className="topbar__status">
              <span className="status-dot" />
              <span>Hệ thống ổn định</span>
            </div>

            {/* Avatar */}
            <Avatar name={auth.user?.fullName} size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
