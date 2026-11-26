#!/usr/bin/env node
// Reads the weekly Claude usage once and prints one JSON line for DocBar:
//   {"pct":97,"reset":"So 21:00","resetRaw":"Nov 29 at 9pm (Europe/Berlin)"}   or   {"error":"..."} (exit 1)
// Same CLI call as ~/bin/claude-limit-waechter.mjs: the Claude Code CLI's local /usage command - 0 turns, 0 $, ~3 s.
// build.sh copies this file into DocBar.app/Contents/Resources; DocBar runs it every 60 s off the main thread.
//   node claude-usage.mjs                 one reading
//   --claude PATH                         this binary instead of the newest VS Code one (failure tests)
//   --fake "<text>"                       parse this text instead of calling the CLI (parser tests)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const HOME = os.homedir();
const argv = process.argv.slice(2);
const opt = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };

const ARGS = ['-p', '/usage', '--output-format', 'json', '--safe-mode', '--no-session-persistence',
  '--settings', '{"disableAllHooks":true,"remoteControlAtStartup":false}'];
// "Current week (all models): 97% used · resets Nov 29 at 9pm (Europe/Berlin)"
const RE = /(?:current\s+week|aktuelle\s+woche)\s*\(\s*(?:all\s+models|alle\s+modelle)\s*\)\s*[:：-]?\s*(\d{1,3}(?:[.,]\d+)?)\s*%[^\n]*?(?:resets?\s+([^\n]+))?$/im;
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

/** Newest VS Code extension binaries first (the CLI ships inside the extension). */
function binaries() {
  const forced = opt('--claude');
  if (forced) return [forced];
  const base = path.join(HOME, '.vscode', 'extensions');
  let names = [];
  try { names = fs.readdirSync(base); } catch { return []; }
  return names.filter(n => n.startsWith('anthropic.claude-code-'))
    .map(n => path.join(base, n, 'resources', 'native-binary', 'claude'))
    .filter(b => { try { fs.accessSync(b, fs.constants.X_OK); return true; } catch { return false; } })
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
}

/** "Nov 29 at 9pm (Europe/Berlin)" -> "So 21:00"; the raw text when it does not parse. */
function resetLabel(raw) {
  const m = raw.match(/([A-Za-z]{3})[a-z]*\s+(\d{1,2})(?:,?\s*(\d{4}))?\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return raw.replace(/\s*\(.*\)\s*$/, '');
  const mon = MONTHS.indexOf(m[1].toLowerCase());
  let h = Number(m[4]) % 12; if (m[6].toLowerCase() === 'pm') h += 12;
  const now = new Date();
  let d = new Date(m[3] ? Number(m[3]) : now.getFullYear(), mon, Number(m[2]), h, Number(m[5] || 0));
  // No year in the text: a date far in the past means the reset falls into next year (Dec -> Jan).
  if (!m[3] && d < now - 30 * 86400000) d = new Date(d.getFullYear() + 1, mon, Number(m[2]), h, Number(m[5] || 0));
  if (mon < 0 || isNaN(d)) return raw.replace(/\s*\(.*\)\s*$/, '');
  return `${DAYS[d.getDay()]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function parse(text) {
  const m = text.match(RE);
  if (!m) return null;
  const raw = (m[2] || '').trim();
  return { pct: Number(m[1].replace(',', '.')), reset: raw ? resetLabel(raw) : '', resetRaw: raw };
}

const fake = opt('--fake');
if (fake !== undefined) {
  const r = parse(fake);
  console.log(JSON.stringify(r || { error: 'no match' }));
  process.exit(r ? 0 : 1);
}

let why = 'no Claude Code binary found';
for (const bin of binaries().slice(0, 2)) {
  const r = spawnSync(bin, ARGS, { cwd: os.tmpdir(), encoding: 'utf8', timeout: 40000, maxBuffer: 1 << 24 });
  let t = (r.stdout || '').trim();
  try { const j = JSON.parse(t.slice(t.indexOf('{'))); t = String(j.result || ''); } catch {}
  const p = parse(t);
  if (p) { console.log(JSON.stringify(p)); process.exit(0); }
  why = r.error ? String(r.error.code || r.error.message) : `no week line (exit ${r.status})`;
}
console.log(JSON.stringify({ error: why }));
process.exit(1);
