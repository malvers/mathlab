#!/usr/bin/env node
// DocMitschrift without the USB cable (Doc, 06.11.2026: "Können wir das nicht über R2 pipen? Es muss ja
// noch nicht mal da bleiben." - "Ja, baut es so. Verschlüsselt ist klar ... AES 256").
//
// The phone encrypts every finished five-minute piece with AES-256-GCM and puts it into the private R2
// bucket "docmitschrift" through the Worker in bruecke/worker.js. This Mac fetches it, deletes it there at
// once and writes it down (mitschrift.py, all on this Mac). The other way round the Mac puts Doc's
// timetable on the bridge, so the phone starts recording a minute before every lesson by itself, and the
// phone reports whether it is recording (live.json, read by serve.py for the plans' "Notizen" button).
// Only the two devices hold the key; R2 and Cloudflare only ever see ciphertext.
//
//   node docmitschrift-app/bruecke.mjs einrichten     key + tokens (Keychain), Worker + secrets, phone config
//   node docmitschrift-app/bruecke.mjs telefon        only hand the config (and the plan) to the Pixel again (USB)
//   node docmitschrift-app/bruecke.mjs plan-usb       only the timetable onto the Pixel (USB), no bridge needed
//   node docmitschrift-app/bruecke.mjs takt           one round: plan up, status + pieces down, write down
//   node docmitschrift-app/bruecke.mjs plan           show the recording windows of the next 14 days
//   node docmitschrift-app/bruecke.mjs plan --test 2  push a test window starting in 2 minutes (3 min long)
//   node docmitschrift-app/bruecke.mjs status         what the bridge and the phone say right now
//
// launchd runs "takt" every minute (de.docalvers.docmitschrift-bruecke.plist next to this file).
// Box format (same in the app, Bruecke.java): "DMB1" | 12-byte nonce | ciphertext | 16-byte tag,
// the object's name as additional data, so a box cannot be passed off as another one.

import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.dirname(HERE);
const ROOT = path.join(os.homedir(), 'Documents', 'mitschrift');
const PLAN_DIR = path.join(REPO, 'HTML', 'svp', 'plandaten');
const LIVE = path.join(ROOT, 'live.json');
const SENT = path.join(ROOT, 'daten', 'plan-gesendet.txt');
const KC = 'docmitschrift-bruecke';                 // Keychain service; accounts aes-key, phone-token, mac-token, url
const ADB = path.join(os.homedir(), 'Library', 'Android', 'sdk', 'platform-tools', 'adb');
const PIXEL = '43211JEKB10668';
const PKG = 'de.docalvers.docmitschrift';
const PYTHON = '/opt/homebrew/bin/python3';
const WRANGLER = ['--yes', 'wrangler@4.40.0'];     // 4.152 cannot write to R2 (memory: reference_wrangler_r2_upload_pin)
const MAGIC = Buffer.from('DMB1');
const PIECE = /^\d{8}-\d{6}(?:-hand)?\.m4a$/;   // -hand: recorded by hand, not a lesson

const BEFORE_MIN = 1;      // Doc: "am Anfang jeder Stunde eine Minute vorher"
const AFTER_MIN = 2;       // a lesson often runs a little over
const JOIN_GAP_MIN = 10;   // shorter breaks are recorded through (Android may delay alarms by minutes)
const MERGE_GAP_MIN = 20;  // the same class again after a short break is one lesson (as in mitschrift.py)
const DAYS = 14;

const log = (...a) => console.log(new Date().toLocaleString('de-DE'), ...a);

// ------------------------------------------------------------------ Keychain

function kcGet(account) {
  try {
    return execFileSync('/usr/bin/security', ['find-generic-password', '-s', KC, '-a', account, '-w'],
      { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch { return ''; }
}

function kcSet(account, value) {
  execFileSync('/usr/bin/security', ['add-generic-password', '-U', '-s', KC, '-a', account, '-w', value],
    { stdio: 'ignore' });
}

function config() {
  const key = kcGet('aes-key'), token = kcGet('mac-token'), url = kcGet('url');
  if (!key || !token || !url) throw new Error('Bruecke nicht eingerichtet: node docmitschrift-app/bruecke.mjs einrichten');
  return { key: Buffer.from(key, 'base64'), token, url: url.replace(/\/$/, '') };
}

// ------------------------------------------------------------------ AES-256-GCM boxes

function seal(key, aad, plain) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  c.setAAD(Buffer.from(aad));
  const ct = Buffer.concat([c.update(plain), c.final()]);
  return Buffer.concat([MAGIC, iv, ct, c.getAuthTag()]);
}

function open(key, aad, box) {
  if (box.length < 32 || !box.subarray(0, 4).equals(MAGIC)) throw new Error('kein DMB1-Kasten');
  const d = crypto.createDecipheriv('aes-256-gcm', key, box.subarray(4, 16));
  d.setAAD(Buffer.from(aad));
  d.setAuthTag(box.subarray(box.length - 16));
  return Buffer.concat([d.update(box.subarray(16, box.length - 16)), d.final()]);
}

// ------------------------------------------------------------------ the Worker

async function call(cfg, method, route, body) {
  const res = await fetch(cfg.url + route, {
    method, body,
    headers: { Authorization: 'Bearer ' + cfg.token },
    signal: AbortSignal.timeout(60000),
  });
  if (res.status === 404 && method === 'GET') return null;
  if (!res.ok) throw new Error(`${method} ${route}: HTTP ${res.status}`);
  return method === 'GET' ? Buffer.from(await res.arrayBuffer()) : null;
}

// ------------------------------------------------------------------ the timetable -> recording windows

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const hm = (n, day) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(n / 100), n % 100);

function lessonsOf(day) {
  const monday = new Date(day); monday.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  const file = path.join(PLAN_DIR, `w${ymd(monday)}.json`);
  if (!fs.existsSync(file)) return [];
  const want = Number(ymd(day));
  const rows = JSON.parse(fs.readFileSync(file, 'utf8')).lessons
    .filter((l) => l.date === want && l.code !== 'cancelled' && l.subject)   // no subject = break duty, not a lesson
    .sort((a, b) => a.startTime - b.startTime);
  const blocks = [];
  for (const l of rows) {
    const start = hm(l.startTime, day), end = hm(l.endTime, day);
    const key = l.subject + '|' + (l.classes || []).join(',');
    const last = blocks[blocks.length - 1];
    if (last && last.key === key && start - last.end <= MERGE_GAP_MIN * 60000) {
      last.end = new Date(Math.max(last.end, end));
      continue;
    }
    blocks.push({ key, start, end, name: `${l.subject} · ${(l.classes || []).join(', ')}` });
  }
  return blocks;
}

function windows(now = new Date()) {
  const out = [];
  for (let i = 0; i < DAYS; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    for (const b of lessonsOf(day)) {
      const von = b.start.getTime() - BEFORE_MIN * 60000, bis = b.end.getTime() + AFTER_MIN * 60000;
      const last = out[out.length - 1];
      if (last && von - last.bis < JOIN_GAP_MIN * 60000) {
        last.bis = Math.max(last.bis, bis);
        if (!last.name.includes(b.name)) last.name += ' / ' + b.name;
      } else out.push({ von, bis, name: b.name });
    }
  }
  return out.filter((w) => w.bis > now.getTime());
}

const fmt = (ms) => new Date(ms).toLocaleString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

async function pushPlan(cfg, list, force = false) {
  const plain = JSON.stringify({ fenster: list });
  const hash = crypto.createHash('sha256').update(plain).digest('hex');
  const before = fs.existsSync(SENT) ? fs.readFileSync(SENT, 'utf8').trim() : '';
  if (!force && hash === before) return false;
  await call(cfg, 'PUT', '/plan', seal(cfg.key, 'plan', Buffer.from(plain)));
  fs.writeFileSync(SENT, hash + '\n');
  return true;
}

// ------------------------------------------------------------------ one round

async function takt() {
  const cfg = config();
  fs.mkdirSync(path.join(ROOT, 'eingang'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'daten'), { recursive: true });

  // 1. the timetable up, only when it changed (the 06:00 Untis run renews plandaten/)
  const list = windows();
  if (await pushPlan(cfg, list)) log(`Plan hochgeschoben: ${list.length} Fenster, nächstes ${list[0] ? fmt(list[0].von) + ' ' + list[0].name : '–'}`);

  // 2. what the phone says
  const box = await call(cfg, 'GET', '/status');
  if (box) {
    try {
      const st = JSON.parse(open(cfg.key, 'status', box).toString());
      st.empfangen = Date.now();
      fs.writeFileSync(LIVE + '.tmp', JSON.stringify(st));
      fs.renameSync(LIVE + '.tmp', LIVE);
    } catch (e) { log('Status unlesbar:', e.message); }
  }

  // 3. the pieces down, each deleted on the bridge as soon as it is safe here
  const pieces = JSON.parse((await call(cfg, 'GET', '/stuecke')) || '[]');
  let got = 0;
  for (const p of pieces) {
    if (!PIECE.test(p.name)) continue;
    const data = await call(cfg, 'GET', '/stueck/' + p.name);
    if (!data) continue;
    let plain;
    try { plain = open(cfg.key, 'stueck/' + p.name, data); }
    catch (e) { log(`${p.name}: nicht zu entschlüsseln (${e.message}), bleibt liegen`); continue; }
    const target = path.join(ROOT, 'eingang', p.name);
    fs.writeFileSync(target + '.tmp', plain);
    fs.renameSync(target + '.tmp', target);
    await call(cfg, 'DELETE', '/stueck/' + p.name);
    got++;
  }
  if (!got) return;
  log(`Über R2 geholt: ${got} Stück(e) – schreibe mit`);

  // 4. write down on this Mac, at background priority (Doc may be presenting from it)
  const r = spawnSync('/usr/sbin/taskpolicy', ['-b', PYTHON, path.join(HERE, 'mitschrift.py'), '--nicht-holen'],
    { encoding: 'utf8', timeout: 30 * 60000 });
  const tail = (r.stdout || '').trim().split('\n').filter((l) => !l.startsWith('  schreibe mit')).slice(-4);
  log(r.status === 0 ? 'mitgeschrieben:' : `mitschrift.py Fehler ${r.status}:`, tail.join(' | '), (r.stderr || '').trim().slice(-300));
}

// ------------------------------------------------------------------ setup

function adbThere() {
  try { return execFileSync(ADB, ['devices']).toString().split('\n').some((l) => l.startsWith(PIXEL) && /\tdevice$/.test(l)); }
  catch { return false; }
}

/** The timetable straight onto the phone over USB - so "Start" never records outside a lesson, even
    before the bridge has delivered a plan (without plan.json the app records from Start to Stopp). */
function planAufsTelefon() {
  if (!adbThere()) throw new Error('Pixel nicht per USB da');
  const plain = JSON.stringify({ fenster: windows() });
  // adb joins the arguments into one command line on the phone: one simple command per call, no && inside
  execFileSync(ADB, ['-s', PIXEL, 'exec-in', 'run-as', PKG, 'sh', '-c', 'cat > files/plan.json.tmp'], { input: plain });
  execFileSync(ADB, ['-s', PIXEL, 'exec-out', 'run-as', PKG, 'chmod', '600', 'files/plan.json.tmp']);
  execFileSync(ADB, ['-s', PIXEL, 'exec-out', 'run-as', PKG, 'mv', 'files/plan.json.tmp', 'files/plan.json']);
  const n = JSON.parse(plain).fenster.length;
  console.log(`Plan per USB aufs Pixel: ${n} Fenster.`);
}

function telefon() {
  const key = kcGet('aes-key'), token = kcGet('phone-token'), url = kcGet('url');
  if (!key || !token || !url) throw new Error('erst einrichten');
  if (!adbThere()) throw new Error('Pixel nicht per USB da');
  planAufsTelefon();
  // the config goes straight into the app's private folder; it never appears on screen or in a file here
  // written through run-as the file would be readable for everybody (umask 0): close it before the key goes in
  execFileSync(ADB, ['-s', PIXEL, 'exec-out', 'run-as', PKG, 'touch', 'files/bruecke.json']);
  execFileSync(ADB, ['-s', PIXEL, 'exec-out', 'run-as', PKG, 'chmod', '600', 'files/bruecke.json']);
  execFileSync(ADB, ['-s', PIXEL, 'exec-in', 'run-as', PKG, 'sh', '-c', 'cat > files/bruecke.json'],
    { input: JSON.stringify({ url, token, key }) });
  const mode = execFileSync(ADB, ['-s', PIXEL, 'exec-out', 'run-as', PKG, 'stat', '-c', '%a', 'files/bruecke.json']).toString().trim();
  if (mode !== '600') throw new Error('bruecke.json hat Rechte ' + mode + ' statt 600');
  const size = execFileSync(ADB, ['-s', PIXEL, 'exec-out', 'run-as', PKG, 'stat', '-c', '%s', 'files/bruecke.json']).toString().trim();
  console.log(`Pixel eingerichtet (bruecke.json, ${size} Bytes, nur in der App).`);
}

function wrangler(args, input) {
  return execFileSync('npx', [...WRANGLER, ...args], { cwd: path.join(HERE, 'bruecke'), input, encoding: 'utf8',
    stdio: [input ? 'pipe' : 'ignore', 'pipe', 'pipe'] });
}

function einrichten() {
  const fresh = (n) => crypto.randomBytes(n);
  if (!kcGet('aes-key')) { kcSet('aes-key', fresh(32).toString('base64')); console.log('neuer AES-256-Schlüssel im Schlüsselbund'); }
  for (const a of ['phone-token', 'mac-token']) {
    if (!kcGet(a)) { kcSet(a, fresh(32).toString('hex')); console.log(`neues ${a} im Schlüsselbund`); }
  }
  const out = wrangler(['deploy']);
  const url = (out.match(/https:\/\/docmitschrift-bruecke\.[a-z0-9-]+\.workers\.dev/) || [])[0];
  if (!url) throw new Error('Worker-Adresse nicht gefunden:\n' + out.slice(-800));
  kcSet('url', url);
  console.log('Worker:', url);
  wrangler(['secret', 'put', 'PHONE_TOKEN'], kcGet('phone-token'));
  wrangler(['secret', 'put', 'MAC_TOKEN'], kcGet('mac-token'));
  console.log('Worker-Geheimnisse gesetzt (PHONE_TOKEN, MAC_TOKEN)');
  if (adbThere()) telefon(); else console.log('Pixel nicht da – später: node docmitschrift-app/bruecke.mjs telefon');
}

// ------------------------------------------------------------------ main

const [cmd, ...rest] = process.argv.slice(2);
try {
  if (cmd === 'takt') await takt();
  else if (cmd === 'einrichten') einrichten();
  else if (cmd === 'telefon') telefon();
  else if (cmd === 'plan-usb') planAufsTelefon();
  else if (cmd === 'plan') {
    let list = windows();
    const t = rest.indexOf('--test');
    if (t >= 0) {
      const von = Date.now() + Number(rest[t + 1] || 2) * 60000;
      list = [{ von, bis: von + 3 * 60000, name: 'Test' }, ...list].sort((a, b) => a.von - b.von);
      await pushPlan(config(), list, true);
      console.log('Testfenster hochgeschoben:', fmt(von));
    }
    for (const w of list) console.log(fmt(w.von), '–', new Date(w.bis).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }), ' ', w.name);
  } else if (cmd === 'status') {
    const cfg = config();
    const pieces = JSON.parse((await call(cfg, 'GET', '/stuecke')) || '[]');
    console.log('auf der Brücke:', pieces.length, 'Stück(e)');
    console.log('live.json:', fs.existsSync(LIVE) ? fs.readFileSync(LIVE, 'utf8') : '–');
  } else {
    console.log('Aufruf: einrichten | telefon | takt | plan [--test N] | status');
    process.exitCode = 2;
  }
} catch (e) {
  log('Fehler:', e.message);
  process.exitCode = 1;
}
