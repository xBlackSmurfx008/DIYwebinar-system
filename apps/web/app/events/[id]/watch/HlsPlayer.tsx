"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Props = {
  src: string;
  title: string;
};

export function HlsPlayer({ src, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading" | "live" | "offline" | "error">(
    "loading"
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => setStatus("offline"));
      return;
    }

    if (!Hls.isSupported()) {
      setStatus("error");
      return;
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });
    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setStatus("live");
      video.play().catch(() => {});
    });

    hls.on(Hls.Events.ERROR, (_evt, data) => {
      if (data.fatal) {
        setStatus("offline");
      }
    });

    return () => {
      hls.destroy();
    };
  }, [src]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <video
        ref={videoRef}
        controls
        playsInline
        style={{ width: "100%", maxWidth: 960, background: "#000" }}
      />
      <p style={{ marginTop: 12, color: "#444" }}>
        {status === "loading" && "Connecting to stream…"}
        {status === "live" && "Playing live HLS."}
        {status === "offline" &&
          "Stream not available yet. Start broadcasting from OBS, then refresh."}
        {status === "error" && "This browser cannot play HLS. Try Chrome, Firefox, or Safari."}
      </p>
    </div>
  );
}
