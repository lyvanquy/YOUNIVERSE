import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./AuthProvider";

function BootScreen() {
  return (
    <div className="boot-screen">
      <span className="spinner" />
      <span>Đang kiểm tra phiên đăng nhập...</span>
    </div>
  );
}

export function RequireAdmin() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isBooting) return <BootScreen />;
  if (!auth.isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!auth.isAdmin) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function RequireGuest() {
  const auth = useAuth();

  if (auth.isBooting) return <BootScreen />;
  if (auth.isAuthenticated && auth.isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return <Outlet />;
}
