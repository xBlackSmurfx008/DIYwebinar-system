"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

interface ChatMsg {
  id: string;
  content: string;
  type: "CHAT" | "QUESTION";
  createdAt: string;
  user: { name: string | null; email: string; role: string };
}

interface Props {
  eventId: string;
}

const POLL_INTERVAL = 2000;

export default function LiveChat({ eventId }: Props) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isQuestion, setIsQuestion] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      if (!active) return;
      const qs = latestRef.current ? `?after=${latestRef.current}` : "";
      try {
        const res = await fetch(`/api/events/${eventId}/chat${qs}`);
        if (res.ok) {
          const data: ChatMsg[] = await res.json();
          if (data.length > 0) {
            setMessages((prev) => {
              const ids = new Set(prev.map((m) => m.id));
              const merged = [...prev, ...data.filter((m) => !ids.has(m.id))];
              return merged.slice(-200);
            });
            latestRef.current = data[data.length - 1].createdAt;
          }
        }
      } catch {}
      if (active) setTimeout(poll, POLL_INTERVAL);
    }

    poll();
    return () => { active = false; };
  }, [eventId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/events/${eventId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: input.trim(),
          type: isQuestion ? "QUESTION" : "CHAT",
        }),
      });
      if (res.ok) {
        const msg: ChatMsg = await res.json();
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          if (ids.has(msg.id)) return prev;
          return [...prev, msg].slice(-200);
        });
        latestRef.current = msg.createdAt;
        setInput("");
      }
    } catch {}
    setSending(false);
  };

  const roleColor = (role: string) => {
    if (role === "ADMIN") return "#d63384";
    if (role === "SPEAKER") return "#0d6efd";
    return "#333";
  };

  const roleBadge = (role: string) => {
    if (role === "ADMIN") return " [Admin]";
    if (role === "SPEAKER") return " [Speaker]";
    return "";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          background: "#f8f8f8",
          borderBottom: "1px solid #ddd",
          fontWeight: 600,
        }}
      >
        Live Chat
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 0,
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#999", textAlign: "center", margin: "auto 0" }}>
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              background: m.type === "QUESTION" ? "#fff3cd" : "#f0f0f0",
              fontSize: 14,
            }}
          >
            {m.type === "QUESTION" && (
              <span style={{ fontSize: 11, color: "#856404", marginRight: 6 }}>Q&amp;A</span>
            )}
            <strong style={{ color: roleColor(m.user.role) }}>
              {m.user.name || m.user.email.split("@")[0]}
              {roleBadge(m.user.role)}
            </strong>
            : {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {session ? (
        <div
          style={{
            padding: 10,
            borderTop: "1px solid #ddd",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="checkbox"
              checked={isQuestion}
              onChange={(e) => setIsQuestion(e.target.checked)}
            />
            Q&amp;A
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            maxLength={500}
            style={{ flex: 1, padding: "8px", borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            style={{ padding: "8px 14px", cursor: "pointer" }}
          >
            Send
          </button>
        </div>
      ) : (
        <div style={{ padding: 12, textAlign: "center", borderTop: "1px solid #ddd" }}>
          <a href="/login" style={{ color: "#0070f3" }}>Sign in</a> to chat
        </div>
      )}
    </div>
  );
}
