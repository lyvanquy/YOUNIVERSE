import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/AuthProvider";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@youniverse.local");
  const [password, setPassword] = useState("Admin123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/admin/dashboard";

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
    <div className="login-card">
      <div className="page-header">
        <div>
          <h2>Đăng nhập Admin</h2>
          <p>Dùng tài khoản có role ADMIN trong backend.</p>
        </div>
      </div>

      <form className="page" onSubmit={onSubmit}>
        {error && <div className="page-state page-state--error" style={{ minHeight: 0 }}>{error}</div>}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="button button--full" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : <LogIn size={16} />}
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
