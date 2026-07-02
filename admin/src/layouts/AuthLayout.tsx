import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <div className="auth-brand__logo">YOUniverse</div>
        <h1>Admin Control Center</h1>
        <p>Quản lý sản phẩm, đơn hàng, kho, coupon và phản hồi khách hàng trong một dashboard riêng.</p>
      </section>
      <section className="auth-panel">
        <Outlet />
      </section>
    </main>
  );
}
