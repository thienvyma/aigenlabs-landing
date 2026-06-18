"use client";

import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);
    if (!response.ok) {
      setError("Invalid email or password.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <form className="login-card" onSubmit={submit}>
      <span className="eyebrow">Admin</span>
      <h1>AigenLabs CMS</h1>
      <p>Manage landing content, assets, SEO, navigation, footer, and design tokens.</p>
      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
      </label>
      <label>
        Password
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
      </label>
      {error ? <div className="admin-error">{error}</div> : null}
      <button className="btn btn-dark" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="login-note">For local development, override credentials with ADMIN_EMAIL and ADMIN_PASSWORD.</p>
    </form>
  );
}
