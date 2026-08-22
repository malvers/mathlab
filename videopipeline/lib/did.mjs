// D-ID talking-head clips from one portrait + narration MP3s. API key lives in ~/.config/did/api_key
// (never in the repo). One credit per ~15 s of talk.
import fs from 'fs';
import os from 'os';

const KEY = fs.readFileSync(os.homedir() + '/.config/did/api_key', 'utf8').trim();
const AUTH = 'Basic ' + Buffer.from(KEY).toString('base64');
const API = 'https://api.d-id.com';

async function api(path, opts = {}) {
  const res = await fetch(API + path, { ...opts, headers: { Authorization: AUTH, ...(opts.headers || {}) } });
  if (!res.ok) throw new Error(path + ' → ' + res.status + ' ' + (await res.text()).slice(0, 200));
  return res.json();
}
async function uploadFile(path, field, file, type) {
  const fd = new FormData();
  fd.append(field, new Blob([fs.readFileSync(file)], { type }), file.split('/').pop());
  return api(path, { method: 'POST', body: fd });
}

export async function makeTalks(image, audios, { outDir }) {
  const img = await uploadFile('/images', 'image', image, 'image/png');
  const ids = {};
  for (const a of audios) {
    const aud = await uploadFile('/audios', 'audio', a, 'audio/mpeg');
    const talk = await api('/talks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_url: img.url, script: { type: 'audio', audio_url: aud.url }, config: { stitch: true } }),
    });
    ids[a] = talk.id;
    console.log('talk created for', a);
  }
  const out = {};
  for (const [a, id] of Object.entries(ids)) {
    for (let i = 0; i < 80; i++) {
      const r = await api('/talks/' + id);
      if (r.status === 'done') {
        const f = `${outDir}/talk_${a.split('/').pop().replace('.mp3', '')}.mp4`;
        fs.writeFileSync(f, Buffer.from(await (await fetch(r.result_url)).arrayBuffer()));
        out[a] = f; console.log('downloaded', f);
        break;
      }
      if (['error', 'rejected'].includes(r.status)) throw new Error('talk failed: ' + JSON.stringify(r).slice(0, 300));
      await new Promise((r2) => setTimeout(r2, 8000));
    }
  }
  console.log('credits left:', (await api('/credits')).remaining);
  return out;
}
