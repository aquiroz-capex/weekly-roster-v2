// Minimal, no-deps script to compute week type and post to Discord.
// Uses Intl API for timezone handling; avoids external packages to keep Actions fast.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readConfig() {
  const configPath = path.resolve(__dirname, '..', 'config', 'rotation.json');
  const raw = fs.readFileSync(configPath, 'utf-8');
  const cfg = JSON.parse(raw);
  if (!cfg.timezone || !cfg.sendTimeLocal || !cfg.anchorDate || !Array.isArray(cfg.labels) || cfg.labels.length !== 4) {
    throw new Error('Invalid config/rotation.json');
  }
  return cfg;
}

function getLocalNowParts(timezone) {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]));
  // parts: { year, month, day, hour, minute, weekday }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: parts.weekday, // e.g., Sun, Mon
  };
}

function isSundayAtSendTime(localParts, sendTimeLocal) {
  const [sendHourStr, sendMinuteStr] = sendTimeLocal.split(':');
  const sendHour = Number(sendHourStr);
  const sendMinute = Number(sendMinuteStr);
  const isSunday = localParts.weekday.toLowerCase().startsWith('sun');
  return isSunday && localParts.hour === sendHour && localParts.minute === sendMinute;
}

function parseYmd(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function diffDaysUtc(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const utcA = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const utcB = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.floor((utcB - utcA) / msPerDay);
}

function computeWeekIndex(anchorDateYmd, targetDateYmd) {
  // Returns 0..3 where 0 corresponds to Type 1
  const anchor = parseYmd(anchorDateYmd);
  const target = parseYmd(targetDateYmd);
  const days = diffDaysUtc(anchor, target);
  const weeks = Math.floor(days / 7);
  let idx = weeks % 4;
  if (idx < 0) idx += 4;
  return idx;
}

function getLocalDateYmd(timezone) {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

async function postToDiscord(webhookUrl, content) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Discord webhook failed: ${res.status} ${txt}`);
  }
}

async function main() {
  const cfg = readConfig();
  const localParts = getLocalNowParts(cfg.timezone);

  // Gate: only run at exact local send time on Sunday to avoid duplicates.
  if (!isSundayAtSendTime(localParts, cfg.sendTimeLocal)) {
    console.log('Not send window; skipping.');
    return;
  }

  const todayYmd = getLocalDateYmd(cfg.timezone);
  // Compute next week start date as today + 7 days in UTC YMD space for rotation purposes.
  const todayUtc = parseYmd(todayYmd);
  const nextWeekUtc = new Date(todayUtc.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextWeekYmd = `${nextWeekUtc.getUTCFullYear()}-${String(nextWeekUtc.getUTCMonth() + 1).padStart(2, '0')}-${String(nextWeekUtc.getUTCDate()).padStart(2, '0')}`;

  const index = computeWeekIndex(cfg.anchorDate, nextWeekYmd);
  const label = cfg.labels[index];

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) throw new Error('Missing DISCORD_WEBHOOK_URL secret');

  const msg = `WeekRoster · Next week type: ${label} (anchor ${cfg.anchorDate})`;
  await postToDiscord(webhook, msg);
  console.log('Sent:', msg);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});



