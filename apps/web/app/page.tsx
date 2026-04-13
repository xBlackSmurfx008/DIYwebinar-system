import Link from "next/link";
import { getPrisma } from "@platform/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const prisma = getPrisma();
  const events = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
    take: 20,
    include: { streamKeys: true, _count: { select: { registrations: true } } },
  });

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Dashboard</h2>
        {isAdmin && (
          <Link
            href="/events/new"
            style={{
              padding: "8px 16px",
              background: "#0070f3",
              color: "white",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            + New Event
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <p style={{ color: "#666" }}>No events yet. Create your first event to get started.</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 4px" }}>{event.title}</h3>
                <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                  {event.format} &middot; {event.status} &middot;{" "}
                  {new Date(event.startAt).toLocaleString()} &middot;{" "}
                  {event._count.registrations} registered
                </p>
                {isAdmin && event.streamKeys[0] && (
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: "#888" }}>
                    Stream key: <code>{event.streamKeys[0].key}</code>
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href={`/e/${event.id}/watch`}
                  style={{
                    padding: "6px 14px",
                    background: "#28a745",
                    color: "white",
                    borderRadius: 6,
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  Watch
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
