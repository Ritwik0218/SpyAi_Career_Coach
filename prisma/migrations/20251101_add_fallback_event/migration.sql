-- Migration: add_fallback_event
-- Date: 2025-11-01
-- NOTE: This SQL file is provided for convenience. Run with `psql` or `prisma migrate` in a safe environment.

CREATE TABLE IF NOT EXISTS "FallbackEvent" (
  "id" TEXT PRIMARY KEY,
  "event" TEXT NOT NULL,
  "details" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "processed" BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS "idx_fallback_event_event_processed" ON "FallbackEvent" ("event", "processed");
