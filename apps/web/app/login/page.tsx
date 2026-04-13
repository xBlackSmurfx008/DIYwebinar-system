"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px", marginTop: 4 }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px", marginTop: 4 }}
          />
        </label>
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p style={{ textAlign: "center", margin: 0 }}>
          No account?{" "}
          <a href="/register" style={{ color: "#0070f3" }}>
            Register
          </a>
        </p>
      </form>
      <div style={{ marginTop: 24, padding: 16, background: "#f5f5f5", borderRadius: 8 }}>
        <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Demo accounts:</p>
        <p style={{ margin: "0 0 4px", fontSize: 14 }}>
          Admin: admin@example.com / admin123
        </p>
        <p style={{ margin: 0, fontSize: 14 }}>
          Speaker: speaker@example.com / speaker123
        </p>
      </div>
    </div>
  );
}
