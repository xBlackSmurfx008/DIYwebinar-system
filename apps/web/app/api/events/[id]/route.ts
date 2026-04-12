import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@platform/db";
import { getStreamingConfig, hlsManifestUrl } from "../../../../lib/streaming";

const prisma = getPrisma();

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        streamKeys: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
      },
    });
    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const primary = event.streamKeys[0];
    if (!primary) {
      return NextResponse.json(
        { error: "No active stream key" },
        { status: 404 }
      );
    }

    const { rtmpUrl } = getStreamingConfig();
    const hlsUrl = hlsManifestUrl(primary.key);
    const watchUrl = `/events/${event.id}/watch`;

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        format: event.format,
        startAt: event.startAt,
        endAt: event.endAt,
        status: event.status,
      },
      streamKey: { key: primary.key, label: primary.label },
      rtmpUrl,
      hlsUrl,
      watchUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load event" }, { status: 500 });
  }
}
