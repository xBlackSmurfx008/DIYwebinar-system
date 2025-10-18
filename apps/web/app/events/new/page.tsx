"use client";
import { useState } from 'react';

export default function NewEventPage() {
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("WEBINAR");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, format, startAt, endAt })
    });
    if (res.ok) alert('Event created'); else alert('Failed');
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
      <h2>Create Event</h2>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
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
        Starts
        <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
      </label>

      <label>
        Ends
        <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
      </label>

      <button type="submit">Create</button>
    </form>
  );
}
