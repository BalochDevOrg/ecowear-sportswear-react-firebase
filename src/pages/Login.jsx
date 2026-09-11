import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const account = await login(form);

      if (account.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      if (from === "/checkout" || from.endsWith("/checkout")) {
        navigate("/checkout", { replace: true });
        return;
      }

      if (typeof from === "string" && from.length > 0 && !from.includes("/login")) {
        navigate(from, { replace: true });
        return;
      }

      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="auth-badge">Welcome back</p>
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-lead">
          Access your EcoWear orders, profile, and secure checkout history.
          Admin teammates sign in here and are routed to the staff dashboard.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              className="auth-input"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label className="auth-label">
            Password
            <input
              className="auth-input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="auth-footer">
            New here?{" "}
            <Link className="auth-link" to="/register">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
