import fs from 'fs';
import path from 'path';

const LOG_PATH = '/tmp/spyai-fallback.log';

export function logFallback(event, details = {}) {
  const entry = {
    ts: new Date().toISOString(),
    event,
    details,
  };
  try {
    fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + '\n');
  } catch (err) {
    // ignore write errors in dev
    // console.warn('Failed to write fallback log', err);
  }
  // Always output to console for immediate visibility
  console.info('[FALLBACK]', event, details);
}

export default logFallback;
