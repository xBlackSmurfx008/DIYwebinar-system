"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavBar() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isSpeaker =
    session?.user?.role === "SPEAKER" || session?.user?.role === "ADMIN";

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1 style={{ margin: 0 }}>Events Platform</h1>
      </Link>
      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/">Dashboard</Link>
        {isAdmin && <Link href="/events/new">New Event</Link>}
        {isSpeaker && <Link href="/obs">OBS Setup</Link>}
        {status === "authenticated" ? (
          <>
            <span style={{ fontSize: 14, color: "#666" }}>
              {session.user.name || session.user.email} ({session.user.role})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                background: "#eee",
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/login">Sign In</Link>
        )}
      </nav>
    </header>
  );
}
