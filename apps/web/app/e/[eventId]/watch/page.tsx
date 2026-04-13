import { getPrisma } from "@platform/db";
import { notFound } from "next/navigation";
import WatchClient from "./WatchClient";

export const dynamic = "force-dynamic";

interface Props {
  params: { eventId: string };
}

export default async function WatchPage({ params }: Props) {
  const prisma = getPrisma();
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
    include: {
      streamKeys: { where: { isActive: true }, select: { key: true } },
    },
  });

  if (!event) notFound();

  const hlsHost = process.env.HLS_HOST || "http://localhost:8000";

  return (
    <WatchClient
      event={{
        id: event.id,
        title: event.title,
        format: event.format,
        status: event.status,
        startAt: event.startAt.toISOString(),
        endAt: event.endAt.toISOString(),
      }}
      streamKey={event.streamKeys[0]?.key ?? null}
      hlsHost={hlsHost}
    />
  );
}
