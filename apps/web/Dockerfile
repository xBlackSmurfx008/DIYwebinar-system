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

COPY apps/web/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "-w", "apps/web", "run", "start"]
