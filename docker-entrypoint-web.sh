#!/bin/sh
set -e
prisma migrate deploy --schema /app/packages/db/prisma/schema.prisma
exec node /app/apps/web/server.js
