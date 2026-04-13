#!/bin/bash
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "Usage: DATABASE_URL='postgresql://...' ./scripts/seed-neon.sh"
  exit 1
fi

echo "Running Prisma migrations against Neon..."
npx -w packages/db prisma migrate deploy

echo "Seeding demo accounts..."
npx -w packages/db prisma generate
node packages/db/prisma/seed.js

echo "Done! Demo accounts ready:"
echo "  Admin:   admin@example.com / admin123"
echo "  Speaker: speaker@example.com / speaker123"
