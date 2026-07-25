"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_auth");
    if (token) router.push("/admin");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        localStorage.setItem("admin_auth", password);
        router.push("/admin");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-fg mb-2">Dreamlight</h1>
          <p className="text-sm text-muted">Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-8 shadow-sm border border-border">
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-muted font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm text-fg focus:outline-none focus:border-accent transition-colors"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center !py-3 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
