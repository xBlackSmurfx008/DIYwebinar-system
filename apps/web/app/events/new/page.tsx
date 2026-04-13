"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("WEBINAR");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [result, setResult] = useState<{ key?: string; id?: string } | null>(null);

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "ADMIN") {
    return <p>Only admins can create events. <a href="/login">Sign in</a></p>;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, format, startAt, endAt }),
    });
    if (!res.ok) {
      alert("Failed to create event");
      return;
    }
    const data = await res.json();
    setResult({ key: data.streamKey?.key, id: data.event?.id });
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Create Event</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "8px", marginTop: 4 }}
          />
        </label>
        <label>
          Format
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: 4 }}
          >
            <option value="WEBINAR">Webinar</option>
            <option value="VIRTUAL">Virtual</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">Onsite</option>
          </select>
        </label>
        <label>
          Starts
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: 4 }}
          />
        </label>
        <label>
          Ends
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: 4 }}
          />
        </label>
        <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
          Create
        </button>
      </form>

      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#e6f9e6",
            borderRadius: 8,
            border: "1px solid #28a745",
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Event created!</p>
          {result.key && (
            <p style={{ margin: "0 0 8px", fontSize: 14 }}>
              OBS stream key: <code style={{ background: "#fff", padding: "2px 6px" }}>{result.key}</code>
            </p>
          )}
          {result.id && (
            <p style={{ margin: 0, fontSize: 14 }}>
              Watch URL: <a href={`/e/${result.id}/watch`}>/e/{result.id}/watch</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
