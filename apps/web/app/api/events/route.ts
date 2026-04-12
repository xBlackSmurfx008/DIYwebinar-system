import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@platform/db";
import {
  createEventBodySchema,
  parseOptionalDate,
} from "../../../lib/events-api";
import { getStreamingConfig, hlsManifestUrl } from "../../../lib/streaming";

const prisma = getPrisma();

const DEMO_ORG_ID = process.env.DEMO_ORG_ID || "demo-org";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = createEventBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { title, format, startAt, endAt } = parsed.data;
    const now = Date.now();
    const start = parseOptionalDate(startAt, new Date(now));
    const end = parseOptionalDate(endAt, new Date(now + 3600_000));
    if (end <= start) {
      return NextResponse.json(
        { error: "endAt must be after startAt" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        orgId: DEMO_ORG_ID,
        title,
        description: "",
        format,
        startAt: start,
        endAt: end,
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

    const { rtmpUrl } = getStreamingConfig();
    const hlsUrl = hlsManifestUrl(streamKey.key);
    const watchUrl = `/events/${event.id}/watch`;

    return NextResponse.json({
      event,
      streamKey,
      rtmpUrl,
      hlsUrl,
      watchUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
