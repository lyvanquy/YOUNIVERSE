import { apiBaseUrl } from "../lib/api";

export default function SettingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Cấu hình vận hành của admin app. Các thiết lập ghi dữ liệu sẽ cần backend endpoint riêng nếu muốn mở rộng.</p>
        </div>
      </div>

      <div className="grid-2">
        <section className="card">
          <h3>API</h3>
          <dl className="detail-list">
            <div><dt>Base URL</dt><dd className="mono">{apiBaseUrl}</dd></div>
            <div><dt>Env key</dt><dd className="mono">VITE_API_URL</dd></div>
          </dl>
        </section>

        <section className="card">
          <h3>Payment Operations</h3>
          <p className="muted">
            COD, BANK_TRANSFER và MOCK_ONLINE đã có workflow backend. VNPay, MoMo và Stripe hiện là provider stub,
            cần cấu hình adapter trước khi bật trên checkout thật.
          </p>
        </section>
      </div>

      <section className="card">
        <h3>Recommended Admin Account</h3>
        <p className="muted">Seed backend hiện tạo tài khoản:</p>
        <pre className="mono" style={{ background: "#f4f4f5", padding: 14, borderRadius: 8, overflow: "auto" }}>
{`email: admin@youniverse.local
password: Admin123456`}
        </pre>
      </section>
    </div>
  );
}
