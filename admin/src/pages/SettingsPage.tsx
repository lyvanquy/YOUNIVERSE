import { apiBaseUrl } from "../lib/api";

export default function SettingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Cài đặt</h2>
          <p>Cấu hình vận hành của ứng dụng admin. Các thiết lập ghi dữ liệu sẽ cần backend endpoint riêng nếu muốn mở rộng.</p>
        </div>
      </div>

      <div className="grid-2">
        <section className="card">
          <h3>Kết nối hệ thống (API)</h3>
          <dl className="detail-list">
            <div><dt>Đường dẫn API (Base URL)</dt><dd className="mono">{apiBaseUrl}</dd></div>
            <div><dt>Biến môi trường (Env key)</dt><dd className="mono">VITE_API_URL</dd></div>
          </dl>
        </section>

        <section className="card">
          <h3>Cấu hình Thanh toán</h3>
          <p className="muted">
            COD, BANK_TRANSFER và MOCK_ONLINE đã có luồng xử lý trên backend. VNPay, MoMo và Stripe hiện là các cổng mô phỏng (stub provider),
            cần cấu hình thông số kết nối thực tế trước khi kích hoạt trên cổng thanh toán thật.
          </p>
        </section>
      </div>

      <section className="card">
        <h3>Tài khoản Quản trị mặc định</h3>
        <p className="muted">Dữ liệu mẫu (Seed backend) mặc định tạo tài khoản quản trị:</p>
        <pre className="mono" style={{ background: "#f5f5f4", padding: 14, borderRadius: 12, overflow: "auto" }}>
{`Tên đăng nhập (email): admin@youniverse.local
Mật khẩu (password): Admin123456`}
        </pre>
      </section>
    </div>
  );
}
