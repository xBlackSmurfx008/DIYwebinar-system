"use client";

import VideoPlayer from "../../../../components/VideoPlayer";
import LiveChat from "../../../../components/LiveChat";

interface Props {
  event: {
    id: string;
    title: string;
    format: string;
    status: string;
    startAt: string;
    endAt: string;
  };
  streamKey: string | null;
  hlsHost: string;
}

export default function WatchClient({ event, streamKey, hlsHost }: Props) {
  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>{event.title}</h2>
      <p style={{ color: "#666", marginTop: 0, fontSize: 14 }}>
        {event.format} &middot; {event.status} &middot;{" "}
        {new Date(event.startAt).toLocaleString()} &ndash;{" "}
        {new Date(event.endAt).toLocaleString()}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: 16,
          minHeight: 500,
        }}
      >
        <VideoPlayer streamKey={streamKey} hlsHost={hlsHost} />
        <LiveChat eventId={event.id} />
      </div>
    </div>
  );
}
