#!/bin/sh
set -e

echo "Waiting for database..."
sleep 3

echo "Running Prisma db push..."
npx prisma db push

echo "Seeding database..."
npm run db:seed || echo "Seed skipped or already applied"

echo "Starting AVORA backend..."
exec "$@"
