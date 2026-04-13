FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY packages/db/package.json packages/db/
COPY services/rtmp/package.json services/rtmp/
COPY patches/ patches/

RUN npm ci

COPY tsconfig.base.json ./
COPY packages/db/ packages/db/
COPY apps/web/ apps/web/

RUN npx -w packages/db prisma generate
RUN npm -w packages/db run build
RUN npm -w apps/web run build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "-w", "apps/web", "run", "start"]
