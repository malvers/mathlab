// YouTube upload for the video pipeline (installed-app OAuth, no npm deps).
// Credentials: ~/.config/docalvers-videos/client_secret.json ; token cached alongside.
// Note: until the Google API audit is passed, API uploads are locked to "private" by YouTube.
import fs from 'fs';
import os from 'os';
import http from 'http';
import { execFileSync } from 'child_process';

const CFG = os.homedir() + '/.config/docalvers-videos';
const { installed } = JSON.parse(fs.readFileSync(`${CFG}/client_secret.json`, 'utf8'));
const TOKEN_FILE = `${CFG}/token.json`;
const SCOPE = 'https://www.googleapis.com/auth/youtube.upload';

export function authUrl(redirect = 'http://127.0.0.1:8901') {
  const q = new URLSearchParams({
    client_id: installed.client_id, redirect_uri: redirect, response_type: 'code',
    scope: SCOPE, access_type: 'offline', prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

export async function authorize() {          // one-time: opens browser, catches the code locally
  const redirect = 'http://127.0.0.1:8901';
  const code = await new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      const q = new URL(req.url, redirect).searchParams;
      const c = q.get('code'), err = q.get('error');
      res.end(c ? 'OK — Fenster kann geschlossen werden.' : (err ? 'Abgelehnt: ' + err : 'warte …'));
      /* the browser also asks for /favicon.ico — only a request that carries code or error counts */
      if (c) { srv.close(); resolve(c); }
      else if (err) { srv.close(); reject(new Error('OAuth abgelehnt: ' + err)); }
    });
    srv.listen(8901, '127.0.0.1', () => execFileSync('open', [authUrl(redirect)]));
  });
  const tok = await (await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: installed.client_id, client_secret: installed.client_secret,
      redirect_uri: redirect, grant_type: 'authorization_code' }),
  })).json();
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tok), { mode: 0o600 });
  return tok;
}

async function accessToken() {
  const tok = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  const r = await (await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ refresh_token: tok.refresh_token, client_id: installed.client_id,
      client_secret: installed.client_secret, grant_type: 'refresh_token' }),
  })).json();
  if (!r.access_token) {
    throw new Error('Kein Access-Token — Refresh-Token abgelaufen oder zurückgezogen. Einmal authorize() laufen lassen. ' +
      JSON.stringify(r).slice(0, 200));
  }
  return r.access_token;
}

export async function uploadVideo(file, { title, description = '', tags = [], privacy = 'private', dryRun = false }) {
  const size = fs.statSync(file).size;
  console.log(`→ Upload: ${file}`);
  console.log(`  Titel:  ${title}`);
  console.log(`  Tags:   ${tags.join(', ')}`);
  console.log(`  Größe:  ${(size / 1e6).toFixed(1)} MB · Sichtbarkeit: ${privacy}`);
  if (dryRun) { console.log('  [dry-run] nichts gesendet.'); return null; }
  const at = await accessToken();
  const meta = { snippet: { title, description, tags, categoryId: '27' }, status: { privacyStatus: privacy } };
  const init = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: { Authorization: `Bearer ${at}`, 'Content-Type': 'application/json', 'X-Upload-Content-Length': size, 'X-Upload-Content-Type': 'video/mp4' },
    body: JSON.stringify(meta),
  });
  const session = init.headers.get('location');
  if (!init.ok || !session) {
    throw new Error('Upload-Session abgelehnt (HTTP ' + init.status + '): ' + (await init.text()).slice(0, 300));
  }
  /* whole file in memory — fine for the few hundred MB a demo has, and it keeps the PUT a single
     retryable request */
  const put = await fetch(session, { method: 'PUT', headers: { 'Content-Length': size, 'Content-Type': 'video/mp4' }, body: fs.readFileSync(file) });
  const j = await put.json().catch(() => ({}));
  if (!put.ok || !j.id) {
    throw new Error('Upload fehlgeschlagen (HTTP ' + put.status + '): ' + JSON.stringify(j).slice(0, 300));
  }
  console.log(`  ✓ hochgeladen: https://youtu.be/${j.id}`);
  return j.id;
}
