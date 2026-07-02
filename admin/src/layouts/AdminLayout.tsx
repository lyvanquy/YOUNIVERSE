import {
  BadgePercent,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../features/auth/AuthProvider";
import { cx } from "../lib/ui";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/coupons", label: "Coupons", icon: BadgePercent },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/feedbacks", label: "Feedbacks", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function pageTitle(pathname: string) {
  if (pathname.includes("/products/new")) return "Create Product";
  if (pathname.includes("/products/") && pathname.includes("/edit")) return "Edit Product";
  if (pathname.includes("/orders/")) return "Order Detail";
  const item = navItems.find((nav) => pathname.startsWith(nav.to));
  return item?.label ?? "Dashboard";
}

export default function AdminLayout() {
  const auth = useAuth();
  const location = useLocation();

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="brand-mark">YOU</div>
          <div>
            <strong>YOUniverse</strong>
            <span>Admin</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cx("nav-item", isActive && "nav-item--active")}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="admin-mini">
            <ClipboardList size={16} />
            <div>
              <strong>{auth.user?.fullName}</strong>
              <span>{auth.user?.email}</span>
            </div>
          </div>
          <button className="button button--ghost button--full" type="button" onClick={auth.logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Admin / {pageTitle(location.pathname)}</span>
            <h1>{pageTitle(location.pathname)}</h1>
          </div>
          <div className="topbar__right">
            <span className="status-dot" />
            <span>Backend API</span>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
