import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="screen-message">Loading…</div>;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/employee"} replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) {
      setError("Enter a valid email address and password.");
      return;
    }
    setBusy(true);
    try {
      const loggedInUser = await login(email.trim(), password);
      navigate(loggedInUser.role === "admin" ? "/admin" : "/employee", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <a className="brand login-brand" href="/login"><span className="brand-mark">P</span><span>PeopleDesk</span></a>
        <p className="eyebrow">YOUR TEAM, IN ONE PLACE</p>
        <h1>Welcome back</h1>
        <p className="login-intro">Sign in to continue to your workspace.</p>
        <form onSubmit={submit} className="login-form" noValidate>
          <label>Email address<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></label>
          <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary login-button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <p className="login-footnote">Use your account email and password. Your access level is assigned by your administrator.</p>
      </section>
      <aside className="login-aside">
        <div className="aside-orb orb-one" /><div className="aside-orb orb-two" />
        <div className="aside-content">
          <div className="aside-symbol">✳</div>
          <p className="eyebrow">PEOPLE FIRST</p>
          <h2>A clearer view of your team.</h2>
          <p>Simple tools to keep employee information organized and accessible to the right people.</p>
          <div className="aside-stat"><span className="stat-line" /><span>One workspace. Better teamwork.</span></div>
        </div>
        <span className="aside-copyright">PeopleDesk © {new Date().getFullYear()}</span>
      </aside>
    </main>
  );
}
