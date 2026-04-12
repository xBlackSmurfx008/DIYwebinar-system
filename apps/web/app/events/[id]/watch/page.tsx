import { notFound } from "next/navigation";
import { getPrisma } from "@platform/db";
import { hlsManifestUrl } from "../../../../lib/streaming";
import { HlsPlayer } from "./HlsPlayer";

const prisma = getPrisma();

export default async function WatchPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      streamKeys: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event) notFound();
  const key = event.streamKeys[0];
  if (!key) notFound();

  const hlsUrl = hlsManifestUrl(key.key);

  return (
    <HlsPlayer src={hlsUrl} title={event.title} />
  );
}
