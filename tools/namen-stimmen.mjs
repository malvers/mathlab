// The voices for js/namen-ziehen.js: every name of a class, once in Solita's voice (de-DE-Studio-C) and once in
// Doc's (the tts function's voice 'doc'), recorded ONCE and written into the class file itself (Doc, 27.09.2026:
// "einmal aufnehmen und dann nicht jedes Mal neu abschicken"). The class file never enters this public repo - it
// lives in OneDrive and each device loads it once; this script holds no names, it only reads them.
//
// Incremental: only a name without a recording (or whose spoken text changed) is sent. Doc's voice may come back as
// Solita's (fallback: true - Gemini slow or out of quota): that one is NOT kept, a later run fetches it again.
// Each clip is trimmed of its silence and stored as mp3 (data URI) in "stimmen": { name: { texte, solita, doc } }.
// Run outside the Bash sandbox (network); needs ffmpeg.
// A changed pronunciation re-records that name only (its spoken text changed).
// Usage: node tools/namen-stimmen.mjs "<path>/klasse-bgy11.json"
import { readFileSync, writeFileSync, renameSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const FILE = process.argv[2];
if (!FILE) throw new Error('usage: node tools/namen-stimmen.mjs <class json>');
const TTS_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';
// publishable (client-safe) key, read from the video pipeline instead of copying it here
const SB = readFileSync(new URL('../videopipeline/lib/tts.mjs', import.meta.url), 'utf8').match(/sb_publishable_[\w-]+/)[0];
const VOICES = {
  solita: { voice: 'de-DE-Studio-C', languageCode: 'de-DE', speakingRate: 1.0 },
  doc: { voice: 'doc' },
};

// what is said: the name as it stands ("Ben M." with an ambiguous first name), or how it sounds where a voice gets
// it wrong - "aussprache" in the class file, for both voices or for one: { "<Name>": "<spelt as it sounds>",
// "<Name>": { "solita": "<spelt as it sounds>" } } (Doc, 27.09.: Solita, though set to German, said several first
// names the English way; a German spelling of the sound fixed most). "ipa:<IPA>" gives Solita the sounds themselves
// (SSML phoneme) where no spelling helps; Doc's voice takes no SSML - there it says the name as it stands.
// "de:<Name>" is for Doc's voice, which guesses the language from the text alone: it says the name inside a German
// sentence and keeps what follows the pause (that way the names came out German); Solita just says the name.
// No real names in here: this repo is public, the class file is not.
const spoken = (name, key) => {
  const a = data.aussprache && data.aussprache[name];
  const t = (typeof a === 'string' ? a : a && a[key]) || name;
  return t.startsWith('ipa:') ? t : t + '.';
};
const xml = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const VORSATZ = 'Sag auf Deutsch: ';
function input(key, text, name) {
  if (text.startsWith('de:')) return { text: (key === 'doc' ? VORSATZ : '') + text.slice(3) };
  if (!text.startsWith('ipa:')) return { text };
  if (key === 'doc') return { text: name + '.' };
  return { ssml: `<speak><phoneme alphabet="ipa" ph="${xml(text.slice(4))}">${xml(name)}</phoneme>.</speak>` };
}

// where the name starts after the German sentence: the end of the longest pause inside the take
function nachDerPause(buf) {
  // from a file, not a pipe: only then ffmpeg knows the length, and the silence at the end is not taken for the pause
  const dir = mkdtempSync(join(tmpdir(), 'namen-')), f = join(dir, 'take.wav');
  writeFileSync(f, buf);
  const log = String(spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'silencedetect=noise=-40dB:d=0.12', '-f', 'null', '-'],
    { maxBuffer: 16 << 20 }).stderr);
  rmSync(dir, { recursive: true, force: true });
  const d = /Duration: (\d+):(\d+):([\d.]+)/.exec(log), dauer = d ? +d[1] * 3600 + +d[2] * 60 + +d[3] : Infinity;
  const st = [...log.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]), en = [...log.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
  let best = null;
  st.forEach((a, i) => {
    const b = en[i];
    if (b === undefined || a < 0.05 || b > dauer - 0.05) return;        // not the silence at either end
    if (!best || b - a > best.b - best.a) best = { a, b };
  });
  return best ? Math.max(0, best.b - 0.02) : null;
}

// Every clip as loud as Solita's average (Doc, 27.09.: "meine Stimme leiser ... weil sie tiefer ist? ... ein kleines
// bisschen hochpushen" - measured: Solita -17.3 LUFS, Doc's voice -22.2 and from name to name -26 to -15). Loudness
// in LUFS weighs the ear's weaker bass, so a deep voice is lifted more than a plain level would; a limiter keeps the
// lifted peaks under -1.5 dBFS.
const PEGEL = -17;
function ffmpeg(args, input) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], { input, maxBuffer: 16 << 20 });
  if (r.status !== 0 || !r.stdout.length) throw new Error('ffmpeg: ' + String(r.stderr).slice(0, 200));
  return r.stdout;
}
function lufs(buf) {
  // from a file with half a second of silence behind: the 400 ms blocks of the measure cover even a short name
  const dir = mkdtempSync(join(tmpdir(), 'namen-')), f = join(dir, 'clip');
  writeFileSync(f, buf);
  const log = String(spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'apad=pad_dur=0.5,ebur128', '-f', 'null', '-'],
    { maxBuffer: 16 << 20 }).stderr);
  rmSync(dir, { recursive: true, force: true });
  const I = [...log.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop();
  return I ? +I[1] : null;
}
function angleichen(buf) {
  const I = lufs(buf);
  const db = I === null || I < -70 ? 0 : Math.max(-12, Math.min(15, PEGEL - I));
  return ffmpeg(['-i', 'pipe:0', '-af', `volume=${db.toFixed(2)}dB,alimiter=limit=0.84:level=0`, '-ac', '1', '-b:a', '64k', '-f', 'mp3', 'pipe:1'], buf);
}
// silence off both ends (the name comes the moment it lands on the board), then the loudness, then mono mp3;
// ab: seconds cut off the front
function toMp3(buf, ab = 0) {
  const wav = ffmpeg([...(ab ? ['-ss', String(ab)] : []), '-i', 'pipe:0',
    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
    '-ac', '1', '-f', 'wav', 'pipe:1'], buf);
  return angleichen(wav);
}

async function record(key, text, name) {
  const r = await fetch(TTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SB, Authorization: 'Bearer ' + SB },
    body: JSON.stringify({ ...input(key, text, name), ...VOICES[key] }),
  });
  const j = await r.json().catch(() => ({}));
  if (!j.audioContent) return { why: 'HTTP ' + r.status + ' ' + String(j.error || '').slice(0, 120) };
  if (key === 'doc' && j.fallback) return { why: 'fallback (' + String(j.why || '').slice(0, 120) + ')' };
  const buf = Buffer.from(j.audioContent, 'base64');
  let ab = 0;
  if (key === 'doc' && text.startsWith('de:')) {
    ab = nachDerPause(buf);
    if (ab === null) return { why: 'keine Pause nach dem deutschen Satz gefunden' };
  }
  return { uri: 'data:audio/mpeg;base64,' + toMp3(buf, ab).toString('base64') };
}

const data = JSON.parse(readFileSync(FILE, 'utf8'));
if (!Array.isArray(data.namen) || !data.namen.length) throw new Error('no "namen" in ' + FILE);
const stimmen = data.stimmen && typeof data.stimmen === 'object' ? data.stimmen : {};
// names that left the class take their recordings with them
for (const n of Object.keys(stimmen)) if (!data.namen.includes(n)) delete stimmen[n];
data.stimmen = stimmen;

const save = () => {   // written after every clip, via a temp file: an abort never leaves half a class file
  writeFileSync(FILE + '.tmp', JSON.stringify(data, null, 2) + '\n');
  renameSync(FILE + '.tmp', FILE);
};
const count = { neu: 0, da: 0, fehlt: 0 };
for (const [i, name] of data.namen.entries()) {
  const s = stimmen[name] || (stimmen[name] = {});
  // what each voice said (one "text" for both before 27.09.)
  if (!s.texte) s.texte = typeof s.text === 'string' ? Object.fromEntries(Object.keys(VOICES).map(k => [k, s.text])) : {};
  delete s.text;
  for (const key of Object.keys(VOICES)) {
    const text = spoken(name, key);
    if (s[key] && s.texte[key] === text) { count.da++; continue; }
    // a failed take keeps the old clip (its old text: the next run tries again)
    const got = await record(key, text, name);
    // no names in the log - the number in the list is enough
    if (got.uri) { s[key] = got.uri; s.texte[key] = text; (s.pegel = s.pegel || {})[key] = PEGEL; count.neu++; save(); console.log(`${i + 1}/${data.namen.length} ${key} ok`); }
    else { count.fehlt++; console.log(`${i + 1}/${data.namen.length} ${key} FEHLT: ${got.why}`); }
  }
}
// clips from before the levelling (or chosen by hand): levelled once, marked so a later run leaves them alone
let angeglichen = 0;
for (const name of data.namen) {
  const s = stimmen[name];
  for (const key of Object.keys(VOICES)) {
    if (!s || !s[key] || (s.pegel && s.pegel[key] === PEGEL)) continue;
    s[key] = 'data:audio/mpeg;base64,' + angleichen(Buffer.from(s[key].split(',')[1], 'base64')).toString('base64');
    (s.pegel = s.pegel || {})[key] = PEGEL;
    angeglichen++;
  }
}
if (angeglichen) console.log(`angeglichen auf ${PEGEL} LUFS: ${angeglichen}`);
save();
console.log(`neu ${count.neu}, schon da ${count.da}, fehlt ${count.fehlt}` + (count.fehlt ? ' - später noch einmal laufen lassen' : ''));
