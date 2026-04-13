# Deploying DIYwebinar-system (Vercel + Neon + Railway)

## Architecture

```
┌──────────────┐     ┌───────────────┐     ┌──────────────────┐
│  Vercel       │────▶│  Neon DB       │◀────│  Railway (RTMP)  │
│  Next.js App  │     │  PostgreSQL    │     │  node-media-srv  │
│  Port 443     │     │  Serverless    │     │  Ports 1935,8000 │
└──────────────┘     └───────────────┘     └──────────────────┘
       ▲                                           ▲
       │  HTTPS (web, API, chat)                   │  RTMP (OBS)
       │                                           │  HTTP (HLS)
    Viewers                                      Streamer
```

- **Vercel** — hosts the Next.js web app (login, dashboard, chat, watch page)
- **Neon** — serverless PostgreSQL (users, events, stream keys, chat messages)
- **Railway** — runs the RTMP ingest server + HLS transcoder (Docker container)

---

## Step 1: Create a Neon Database

1. Go to https://console.neon.tech and sign up / sign in
2. Click **New Project**
   - Name: `webinar`
   - Region: pick one close to your users
3. Copy the connection strings from the dashboard:
   - **Connection string** (pooled) → `DATABASE_URL`
   - **Direct connection** → `DIRECT_DATABASE_URL`

Both look like: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

## Step 2: Run Migrations + Seed

```bash
# From the project root
npm ci
export DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
export DIRECT_DATABASE_URL="$DATABASE_URL"

npm ci
npx -w packages/db prisma migrate deploy
npx -w packages/db prisma generate
node packages/db/prisma/seed.js
```

This creates the tables and demo accounts (admin@example.com / admin123, speaker@example.com / speaker123).

## Step 3: Push to GitHub

```bash
git init
git add .
git commit -m "feat: prepare for Vercel + Neon deployment"
git remote add origin https://github.com/YOUR_USERNAME/DIYwebinar-system.git
git push -u origin main
```

## Step 4: Deploy Web App to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Vercel auto-detects Next.js — the `vercel.json` configures the monorepo build
4. Add these **Environment Variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon pooled connection string |
| `DIRECT_DATABASE_URL` | Your Neon direct connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (update after first deploy) |
| `HLS_HOST` | `https://your-rtmp-server.up.railway.app` (add after Step 5) |
| `RTMP_URL` | `rtmp://your-rtmp-server.up.railway.app:1935/live` (add after Step 5) |

5. Click **Deploy**

## Step 5: Deploy RTMP Server to Railway

1. Go to https://railway.app and sign up / sign in
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repo
4. In **Settings**:
   - **Root directory**: `/` (leave default)
   - **Dockerfile path**: `services/rtmp/Dockerfile.railway`
   - **Start command**: (auto-detected from Dockerfile)
5. Add **Environment Variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Same Neon connection string |
| `RTMP_PORT` | `1935` |
| `RTMP_HTTP_PORT` | `8000` |
| `FFMPEG_PATH` | `/usr/bin/ffmpeg` |

6. In **Networking**, expose ports **1935** (TCP) and **8000** (HTTP)
7. Note the public URL Railway gives you (e.g., `your-rtmp-server.up.railway.app`)
8. Go back to Vercel and update `HLS_HOST` and `RTMP_URL` env vars, then redeploy

## Step 6: Configure OBS

In OBS:
- **Service**: Custom
- **Server**: `rtmp://your-rtmp-server.up.railway.app:1935/live`
- **Stream Key**: the key from your event creation

## Step 7: Verify

1. Open `https://your-app.vercel.app/login`
2. Sign in as admin, create an event
3. Copy the stream key, start streaming from OBS
4. Open the watch URL — video + chat should work
5. Share the watch URL with anyone on the internet

---

## Local Development (unchanged)

```bash
docker compose up --build
# Web: http://localhost:3000
# RTMP: rtmp://localhost:1935/live
# HLS:  http://localhost:8000
```

## Alternative: Fly.io for RTMP

If you prefer Fly.io over Railway:

```bash
cd services/rtmp
fly launch --dockerfile Dockerfile.railway
fly secrets set DATABASE_URL="postgresql://..."
fly deploy
```
