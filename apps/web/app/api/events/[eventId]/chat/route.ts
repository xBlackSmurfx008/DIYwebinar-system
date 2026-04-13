import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { getPrisma } from "@platform/db";

const prisma = getPrisma();

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const url = new URL(req.url);
  const after = url.searchParams.get("after");

  const messages = await prisma.chatMessage.findMany({
    where: {
      eventId: params.eventId,
      ...(after ? { createdAt: { gt: new Date(after) } } : {}),
    },
    orderBy: { createdAt: "asc" },
    take: 200,
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
  });

  return NextResponse.json(messages);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Must be signed in" }, { status: 401 });
  }

  const { content, type } = await req.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      eventId: params.eventId,
      userId: session.user.id,
      content: content.trim().slice(0, 500),
      type: type === "QUESTION" ? "QUESTION" : "CHAT",
    },
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
  });

  return NextResponse.json(message);
}
