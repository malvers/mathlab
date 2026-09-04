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
    console.log('polling', id, '- falls hier das Netz reisst, ist der Talk trotzdem bezahlt');
    let netErrors = 0;
    for (let i = 0; i < 80; i++) {
      // A dropped connection while polling must NOT throw: at this point the talk is
      // already created and charged, and an uncaught fetch error orphans it - the ID
      // is gone from the log and the credits are spent. Ride out transient failures
      // and, if it really is over, say which ID to fetch by hand.
      let r;
      try {
        r = await api('/talks/' + id);
        netErrors = 0;
      } catch (err) {
        if (++netErrors > 12) throw new Error(
          `Netz weg beim Abholen von ${id} (bezahlt!). Von Hand holen: ` +
          `GET /talks/${id} -> result_url, dann curl -C -. Ursache: ${err.message}`);
        console.log(`  Netzfehler ${netErrors}/12 (${err.message.slice(0, 60)}) - weiter in 10 s`);
        await new Promise((r2) => setTimeout(r2, 10000));
        continue;
      }
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
