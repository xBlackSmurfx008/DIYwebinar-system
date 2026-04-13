import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@platform/db";

const prisma = getPrisma();

export async function GET(
  _req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
    include: {
      streamKeys: { where: { isActive: true }, select: { key: true } },
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: event.id,
    title: event.title,
    format: event.format,
    status: event.status,
    startAt: event.startAt,
    endAt: event.endAt,
    streamKey: event.streamKeys[0]?.key ?? null,
    registrations: event._count.registrations,
  });
}
