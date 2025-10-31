import fs from 'fs';
import path from 'path';
import { db } from '@/lib/prisma';

const LOG_PATH = '/tmp/spyai-fallback.log';

export async function logFallback(event, details = {}) {
  const entry = {
    ts: new Date().toISOString(),
    event,
    details,
  };
  try {
    fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
  } catch (err) {
    // ignore write errors in dev
  }

  // Attempt to persist to the database if available (non-blocking)
  try {
    if (db && typeof db.fallbackEvent?.create === 'function') {
      // write asynchronously but don't await to avoid blocking
      db.fallbackEvent.create({ data: { event, details } }).catch((e) => {
        console.warn('Failed to persist fallback event', e?.message || e);
      });
    }
  } catch (err) {
    // ignore DB errors in fallback logger — console output is the primary signal
  }

  // Always output to console for immediate visibility
  console.info('[FALLBACK]', event, details);
}

export default logFallback;
