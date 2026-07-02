import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import { RequireAdmin, RequireGuest } from "../features/auth/routeGuards";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProductsPage from "../pages/ProductsPage";
import ProductFormPage from "../pages/ProductFormPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import InventoryPage from "../pages/InventoryPage";
import CouponsPage from "../pages/CouponsPage";
import UsersPage from "../pages/UsersPage";
import FeedbacksPage from "../pages/FeedbacksPage";
import SettingsPage from "../pages/SettingsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RequireGuest />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage mode="create" />} />
          <Route path="products/:id/edit" element={<ProductFormPage mode="edit" />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="feedbacks" element={<FeedbacksPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
