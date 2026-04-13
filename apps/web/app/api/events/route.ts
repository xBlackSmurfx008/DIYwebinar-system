import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { getPrisma } from "@platform/db";

const prisma = getPrisma();

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      format: true,
      status: true,
      startAt: true,
      endAt: true,
    },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, format, startAt, endAt } = body;

    const event = await prisma.event.create({
      data: {
        orgId: "demo-org",
        title,
        description: "",
        format,
        startAt: startAt ? new Date(startAt) : new Date(),
        endAt: endAt ? new Date(endAt) : new Date(Date.now() + 3600_000),
        areas: {
          create: [
            { kind: "RECEPTION", name: "Reception" },
            { kind: "STAGE", name: "Stage" },
            { kind: "SESSIONS", name: "Sessions" },
            { kind: "EXPO", name: "Expo" },
            { kind: "REPLAY", name: "Replay" },
          ],
        },
        tickets: {
          create: [{ name: "Free", totalQuantity: 1000 }],
        },
      },
    });

    const streamKey = await prisma.streamKey.create({
      data: {
        eventId: event.id,
        label: "primary",
        key: crypto.randomUUID().replace(/-/g, ""),
      },
    });

    return NextResponse.json({ event, streamKey });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
