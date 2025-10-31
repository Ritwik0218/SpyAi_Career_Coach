#!/usr/bin/env node
const fs = require('fs');
const { URL } = require('url');

const base = process.env.BASE_URL || 'http://localhost:3004';
const routes = ['/', '/resume', '/resume/ats-analysis', '/dashboard'];
const LOG_PATH = '/tmp/spyai-fallback.log';

async function check() {
  console.log(`Using base: ${base}`);
  let allOk = true;
  for (const r of routes) {
    const url = new URL(r, base).toString();
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`${r} -> ${res.status}`);
      if (res.status !== 200) allOk = false;
    } catch (err) {
      console.log(`${r} -> error: ${err.message}`);
      allOk = false;
    }
  }

  console.log('\nLast fallback log entries (if any):');
  try {
    if (fs.existsSync(LOG_PATH)) {
      const tail = fs.readFileSync(LOG_PATH, 'utf8').split('\n').filter(Boolean).slice(-20);
      tail.forEach((l) => console.log(l));
    } else {
      console.log('(no fallback log found)');
    }
  } catch (err) {
    console.log('Could not read fallback log:', err.message);
  }

  process.exit(allOk ? 0 : 2);
}

check();
