// Solita narration: Google Cloud TTS via the project's Supabase edge fn. Plain text or SSML
// (SSML for pronunciation, e.g. <say-as interpret-as="characters">ISS</say-as>).
import fs from 'fs';
import { execFileSync } from 'child_process';

const SB = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe
const URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';

// onScene(name, seconds) fires after every finished scene. Callers use it to persist
// durations incrementally - the Studio voice has a hard quota, so a scene that was
// already paid for must never be re-synthesised because a later one threw.
export async function synthScenes(items, { outDir, voice = 'de-DE-Studio-C', lang = 'de-DE', rate = 1.0, onScene }) {
  const durs = {};
  for (const [name, text] of Object.entries(items)) {
    const isSsml = /^\s*<speak>/.test(text);
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SB, Authorization: 'Bearer ' + SB },
      body: JSON.stringify({ [isSsml ? 'ssml' : 'text']: text, voice, languageCode: lang, speakingRate: rate }),
    });
    const j = await res.json();
    if (!j.audioContent) throw new Error('TTS failed for ' + name + ': ' + JSON.stringify(j).slice(0, 200));
    const f = `${outDir}/${name}.mp3`;
    fs.writeFileSync(f, Buffer.from(j.audioContent, 'base64'));
    durs[name] = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
    console.log(name, durs[name].toFixed(1) + 's');
    if (onScene) onScene(name, durs[name]);
  }
  return durs;
}
