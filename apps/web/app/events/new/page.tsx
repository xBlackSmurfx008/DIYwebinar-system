"use client";

import Link from "next/link";
import { useState } from "react";

type CreatedPayload = {
  event: { id: string; title: string };
  streamKey: { key: string };
  rtmpUrl: string;
  hlsUrl: string;
  watchUrl: string;
};

export default function NewEventPage() {
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("WEBINAR");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [created, setCreated] = useState<CreatedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const body: Record<string, string> = { title, format };
      if (startAt) body.startAt = new Date(startAt).toISOString();
      if (endAt) body.endAt = new Date(endAt).toISOString();

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Could not create event. Is the database migrated and seeded?"
        );
        return;
      }
      setCreated(data as CreatedPayload);
    } finally {
      setPending(false);
    }
  };

  if (created) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <h2>Event created</h2>
        <p>
          <strong>{created.event.title}</strong>
        </p>
        <p>
          <Link href={created.watchUrl}>Open viewer page</Link>
        </p>
        <section>
          <h3>OBS</h3>
          <p>
            Server: <code>{created.rtmpUrl}</code>
          </p>
          <p>
            Stream key: <code>{created.streamKey.key}</code>
          </p>
        </section>
        <section>
          <h3>HLS (playback URL)</h3>
          <p>
            <code>{created.hlsUrl}</code>
          </p>
        </section>
        <p>
          <Link href="/events/new">Create another</Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      <h2>Create event</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <label>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Format
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="WEBINAR">Webinar</option>
          <option value="VIRTUAL">Virtual</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">Onsite</option>
        </select>
      </label>

      <label>
        Starts (optional)
        <input
          type="datetime-local"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
        />
      </label>

      <label>
        Ends (optional)
        <input
          type="datetime-local"
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
        />
      </label>

      <button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create"}
      </button>
    </form>
  );
}
