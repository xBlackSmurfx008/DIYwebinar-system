export default function OBSPage() {
  const host = process.env.RTMP_HOST || 'localhost';
  const rtmpPort = process.env.RTMP_PORT || '1935';
  const httpPort = process.env.RTMP_HTTP_PORT || '8000';
  return (
    <div>
      <h2>OBS Configuration</h2>
      <p>Use the following settings in OBS to stream to your event stage.</p>
      <ul>
        <li>Service: Custom...</li>
        <li>Server (RTMPS): rtmp://{host}:{rtmpPort}/live</li>
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
        HLS playlist: http://{host}:{httpPort}/live/&lt;streamKey&gt;/index.m3u8
        (node-media-server writes segments under a folder per stream.)
      </p>
    </div>
  );
}
