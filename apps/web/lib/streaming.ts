/**
 * URLs exposed to browsers and OBS must use a host the client can reach.
 * In Docker, set RTMP_PUBLIC_HOST to your machine's LAN IP or hostname (not `web` / `rtmp`).
 */
export function getStreamingConfig() {
  const host = process.env.RTMP_PUBLIC_HOST || process.env.RTMP_HOST || "localhost";
  const rtmpPort = process.env.RTMP_PORT || "1935";
  const httpPort = process.env.RTMP_HTTP_PORT || "8000";
  const rtmpUrl = `rtmp://${host}:${rtmpPort}/live`;
  return { host, rtmpPort, httpPort, rtmpUrl };
}

export function hlsManifestUrl(streamKey: string) {
  const { host, httpPort } = getStreamingConfig();
  return `http://${host}:${httpPort}/live/${streamKey}.m3u8`;
}
