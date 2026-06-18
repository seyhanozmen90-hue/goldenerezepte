"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SAVED_EMAIL_KEY = "gr_admin_email";

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_EMAIL_KEY);
    if (saved) setEmail(saved);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("E-Mail oder Passwort falsch.");
    } else {
      if (remember) {
        localStorage.setItem(SAVED_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY);
      }
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🥨</div>
        <div className="login-title">Admin Login</div>
        <div className="login-subtitle">GoldeneRezepte Verwaltung</div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-Mail</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Passwort</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: "system-ui, sans-serif", fontSize: "0.88rem", color: "var(--muted)" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              E-Mail adresimi hatırla
            </label>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Wird geladen..." : "Anmelden"}
          </button>
        </form>
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <Link href="/" style={{ color: "var(--muted)", fontSize: "0.85rem", fontFamily: "system-ui, sans-serif" }}>
            ← Zurück zur Website
          </Link>
        </div>
      </div>
    </div>
  );
}
