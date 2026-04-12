import { getStreamingConfig } from "../../lib/streaming";

export default function OBSPage() {
  const { rtmpUrl, host, httpPort } = getStreamingConfig();
  return (
    <div>
      <h2>OBS configuration</h2>
      <p>Use these settings in OBS to stream to the stage.</p>
      <ul>
        <li>Service: Custom</li>
        <li>
          Server: <code>{rtmpUrl}</code>
        </li>
        <li>Stream key: from the event you created (Create event page)</li>
      </ul>
      <h3>Recommended encoder settings</h3>
      <ul>
        <li>Video encoder: x264</li>
        <li>Rate control: CBR</li>
        <li>Bitrate: 5000 Kbps (1080p), max 8000 Kbps</li>
        <li>Keyframe interval: 2 seconds</li>
        <li>FPS: 30</li>
        <li>Audio: AAC 128 Kbps</li>
      </ul>
      <h3>Playback (HLS)</h3>
      <p>
        Manifest pattern:{" "}
        <code>
          http://{host}:{httpPort}/live/&lt;streamKey&gt;.m3u8
        </code>
      </p>
      <p style={{ color: "#555", fontSize: 14 }}>
        If you run the stack in Docker, set <code>RTMP_PUBLIC_HOST</code> to a
        host your browser can reach (often your LAN IP), not{" "}
        <code>localhost</code>, so the viewer and HLS URLs work from other
        devices.
      </p>
    </div>
  );
}
