export default function OBSPage() {
  const rtmpUrl = process.env.RTMP_URL || "rtmp://localhost:1935/live";
  const hlsHost = process.env.HLS_HOST || "http://localhost:8000";

  return (
    <div>
      <h2>OBS Configuration</h2>
      <p>Use the following settings in OBS to stream to your event stage.</p>
      <ul>
        <li>Service: Custom...</li>
        <li>
          Server: <code>{rtmpUrl}</code>
        </li>
        <li>Stream Key: your-generated-stream-key</li>
      </ul>
      <h3>Recommended Encoder Settings</h3>
      <ul>
        <li>Video encoder: x264</li>
        <li>Rate Control: CBR</li>
        <li>Bitrate: 5000 Kbps (1080p), max 8000 Kbps</li>
        <li>Keyframe Interval: 2 seconds</li>
        <li>FPS: 30</li>
        <li>Audio: AAC 128 Kbps</li>
      </ul>
      <h3>Playback (HLS)</h3>
      <p>
        HLS playlist: {hlsHost}/live/&lt;streamKey&gt;/index.m3u8
      </p>
    </div>
  );
}
