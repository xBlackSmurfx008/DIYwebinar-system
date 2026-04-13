#!/bin/sh
set -e

cd /app

i=0
until npm -w packages/db run migrate:deploy; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "migrate:deploy failed after $i attempts"
    exit 1
  fi
  echo "waiting for database..."
  sleep 2
done

npm -w packages/db run seed

exec npm -w apps/web run start
