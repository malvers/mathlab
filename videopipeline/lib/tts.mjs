// Solita narration: Google Cloud TTS via the project's Supabase edge fn. Plain text or SSML
// (SSML for pronunciation, e.g. <say-as interpret-as="characters">ISS</say-as>).
import fs from 'fs';
import { execFileSync } from 'child_process';

const SB = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; // publishable anon key — client-safe
const URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';

// A number that ends a sentence is said as a number: "Seite 20." is "zwanzig", not "zwanzigste" (Doc, 24.11.2026).
// The rule is NOT copied here - it lives with her other pronunciation rules in HTML/js/solita-karaoke.js (decks and
// labs, in the browser). That file is a plain script that hangs its functions on the `window` it is given, so Node
// runs the same file with a stand-in. tools/pptx/deck_audio.mjs and the call hook ~/.claude/hooks/solita-ruf.mjs take
// the rule from here. Should the file not load, the text goes out as written (with a warning) - never a failed voice.
let karaoke;
export function satzendZahlen(text) {
  if (karaoke === undefined) {
    try {
      const win = {};
      new Function('window', fs.readFileSync(new globalThis.URL('../../HTML/js/solita-karaoke.js', import.meta.url), 'utf8'))(win);
      karaoke = win.SolitaKaraoke;
    } catch (e) {
      karaoke = null;
      console.warn('solita-karaoke.js not loaded, numbers at a sentence end go out as written: ' + e.message);
    }
  }
  return karaoke && karaoke.satzendZahlen ? karaoke.satzendZahlen(text) : text;
}

// onScene(name, seconds) fires after every finished scene. Callers use it to persist
// durations incrementally - the Studio voice has a hard quota, so a scene that was
// already paid for must never be re-synthesised because a later one threw.
export async function synthScenes(items, { outDir, voice = 'de-DE-Studio-C', lang = 'de-DE', rate = 1.0, onScene }) {
  const durs = {};
  for (const [name, text] of Object.entries(items)) {
    const isSsml = /^\s*<speak>/.test(text);
    // German only; the callers compare their own texts, so this never makes a scene be spoken again
    const said = /^de/i.test(lang) ? satzendZahlen(text) : text;
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SB, Authorization: 'Bearer ' + SB },
      body: JSON.stringify({ [isSsml ? 'ssml' : 'text']: said, voice, languageCode: lang, speakingRate: rate }),
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
