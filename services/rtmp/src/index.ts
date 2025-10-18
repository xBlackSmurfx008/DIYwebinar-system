import 'dotenv/config';
import NodeMediaServer from 'node-media-server';
import { getPrisma } from '@platform/db';

const prisma = getPrisma();

const rtmpPort = parseInt(process.env.RTMP_PORT || '1935', 10);
const httpPort = parseInt(process.env.RTMP_HTTP_PORT || '8000', 10);
const ffmpegPath = process.env.FFMPEG_PATH || '/usr/bin/ffmpeg';

const nms = new NodeMediaServer({
  logType: 2,
  rtmp: {
    port: rtmpPort,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: httpPort,
    allow_origin: '*',
    mediaroot: './media',
  },
  trans: {
    ffmpeg: ffmpegPath,
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=6:hls_flags=delete_segments+append_list]'
      }
    ]
  }
});

nms.on('prePublish', async (id, StreamPath, args) => {
  try {
    const streamKey = StreamPath.split('/').pop();
    if (!streamKey) {
      // reject publish
      // @ts-ignore
      nms.getSession(id)?.reject();
      return;
    }
    const found = await prisma.streamKey.findUnique({ where: { key: streamKey } });
    if (!found || !found.isActive) {
      // @ts-ignore
      nms.getSession(id)?.reject();
      return;
    }
    console.log(`[RTMP] Authorized stream key '${streamKey}' for event ${found.eventId}`);
  } catch (err) {
    console.error('prePublish error', err);
    // @ts-ignore
    nms.getSession(id)?.reject();
  }
});

nms.on('donePublish', async (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/').pop();
  console.log(`[RTMP] Stream ended for key: ${streamKey}`);
});

nms.run();

console.log(`RTMP server running on rtmp://0.0.0.0:${rtmpPort}/live`);
console.log(`HLS available on http://0.0.0.0:${httpPort}/live/<streamKey>.m3u8`);
