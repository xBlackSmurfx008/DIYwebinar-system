"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface Props {
  streamKey: string | null;
  hlsHost: string;
}

export default function VideoPlayer({ streamKey, hlsHost }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"waiting" | "loading" | "live" | "error">("waiting");

  useEffect(() => {
    if (!streamKey || !videoRef.current) return;

    const url = `${hlsHost}/live/${streamKey}/index.m3u8`;
    let hls: Hls | null = null;
    let retryTimer: ReturnType<typeof setTimeout>;

    function tryLoad() {
      if (!videoRef.current) return;

      if (Hls.isSupported()) {
        hls = new Hls({
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 6,
          enableWorker: true,
        });
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setStatus("live");
          videoRef.current?.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) {
            setStatus("loading");
            hls?.destroy();
            hls = null;
            retryTimer = setTimeout(tryLoad, 3000);
          }
        });
        setStatus("loading");
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = url;
        videoRef.current.addEventListener("loadedmetadata", () => {
          setStatus("live");
          videoRef.current?.play().catch(() => {});
        });
        videoRef.current.addEventListener("error", () => {
          setStatus("loading");
          retryTimer = setTimeout(tryLoad, 3000);
        });
        setStatus("loading");
      } else {
        setStatus("error");
      }
    }

    tryLoad();

    return () => {
      clearTimeout(retryTimer);
      if (hls) hls.destroy();
    };
  }, [streamKey, hlsHost]);

  if (!streamKey) {
    return (
      <div
        style={{
          background: "#000",
          color: "#fff",
          aspectRatio: "16/9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        No stream configured for this event.
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        controls
        playsInline
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#000",
          borderRadius: 8,
        }}
      />
      {status === "waiting" && (
        <Overlay>Waiting for stream...</Overlay>
      )}
      {status === "loading" && (
        <Overlay>Connecting to stream... (auto-retry)</Overlay>
      )}
      {status === "error" && (
        <Overlay>Your browser does not support HLS playback.</Overlay>
      )}
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        fontSize: 16,
      }}
    >
      {children}
    </div>
  );
}
