import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/AuthProvider";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card tai-tho-card">
      <div className="login-card__header">
        <h2>Đăng nhập</h2>
        <p>Sử dụng tài khoản Admin để tiếp tục.</p>
      </div>

      <form className="page" onSubmit={onSubmit} style={{ gap: 18 }}>
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.18)",
              borderRadius: 12,
              padding: "12px 16px",
              color: "#dc2626",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <div className="field">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@youniverse.local"
            required
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label htmlFor="admin-password">Mật khẩu</label>
          <input
            id="admin-password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <button
          className="button button--full"
          type="submit"
          disabled={loading}
          style={{ marginTop: 4 }}
        >
          {loading ? <span className="spinner" /> : <LogIn size={16} />}
          {loading ? "Đang xác thực..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
