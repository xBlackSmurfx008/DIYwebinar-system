#!/bin/sh
set -e
cd /app

# Postgres may not accept connections immediately after container start
i=0
until node node_modules/prisma/build/index.js migrate deploy --schema packages/db/prisma/schema.prisma; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "migrate deploy failed after $i attempts"
    exit 1
  fi
  echo "waiting for database..."
  sleep 2
done

exec node apps/web/server.js
