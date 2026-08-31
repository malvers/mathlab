// Does the cached token allow more than uploading? videos.update needs the full
// youtube scope; the pipeline only ever asked for youtube.upload.
import fs from 'fs'; import os from 'os';
const CFG = os.homedir() + '/.config/docalvers-videos';
const { installed } = JSON.parse(fs.readFileSync(`${CFG}/client_secret.json`, 'utf8'));
const tok = JSON.parse(fs.readFileSync(`${CFG}/token.json`, 'utf8'));
const r = await (await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: installed.client_id, client_secret: installed.client_secret,
    refresh_token: tok.refresh_token, grant_type: 'refresh_token' }),
})).json();
const info = await (await fetch('https://oauth2.googleapis.com/tokeninfo?access_token=' + r.access_token)).json();
console.log('Scopes:', info.scope);
