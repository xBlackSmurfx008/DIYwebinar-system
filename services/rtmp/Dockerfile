FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 1935 8000
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
