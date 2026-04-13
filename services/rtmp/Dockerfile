FROM node:20-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY packages/db/package.json packages/db/
COPY services/rtmp/package.json services/rtmp/
COPY patches/ patches/

RUN npm ci

COPY tsconfig.base.json ./
COPY packages/db/ packages/db/
COPY services/rtmp/ services/rtmp/

RUN npx -w packages/db prisma generate
RUN npm -w services/rtmp run build

EXPOSE 1935 8000
ENV NODE_ENV=production
CMD ["npm", "-w", "services/rtmp", "run", "start"]
