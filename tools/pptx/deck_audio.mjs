// Solita reads an HTML deck (Doc, 15.09.2026: "NIEMALS Browserstimme! So wie beim DocPad!") - the
// same voice and pipe as ~/IdeaProjects/docpad/tools/make_tour_audio.mjs: the Supabase "tts"
// function with de-DE-Studio-C. The spoken parts are the ones the build embedded in the deck
// (html_deck.say -> <script id="narration">), written to HTML/decks/audio/<deck>/sNN-KK.mp3 with a
// texts.json next to them. Incremental: only changed parts are sent - the Studio voice has a hard
// quota (HTTP 429: wait a minute and run again). Needs network.
//
//     node tools/pptx/deck_audio.mjs mathe11-wuerfelspiel
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const ROOT = new URL('../../', import.meta.url).pathname;
const TTS = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';
// Publishable (client-safe) anon key, read from the video pipeline instead of copying it here.
const SB = readFileSync(ROOT + 'videopipeline/lib/tts.mjs', 'utf8').match(/sb_publishable_[\w-]+/)[0];
const VOICE = 'de-DE-Studio-C', CODE = 'de-DE';
// spoken as words, not spelled out (same fixes as the DocPad tour)
const fix = t => t.replace(/\bSolita\b/g, 'Solíta').replace(/\bDOCPAD\b/g, 'Dockpäd');

const deck = process.argv[2];
if (!deck) { console.error('usage: node tools/pptx/deck_audio.mjs <deck-name>'); process.exit(1); }
const html = readFileSync(ROOT + 'HTML/decks/' + deck + '.html', 'utf8');
const m = html.match(/<script id="narration" type="application\/json">([\s\S]*?)<\/script>/);
if (!m || !m[1].trim()) { console.error(deck + ': no narration in the deck (d.say in the build script?)'); process.exit(1); }
const N = JSON.parse(m[1].replace(/<\\\//g, '</'));
const dir = ROOT + 'HTML/decks/audio/' + N.deck + '/';
mkdirSync(dir, { recursive: true });
const done = existsSync(dir + 'texts.json') ? JSON.parse(readFileSync(dir + 'texts.json', 'utf8')) : {};
const pad = n => String(n).padStart(2, '0');

let n = 0, sent = 0;
for (const [s, parts] of Object.entries(N.slides)) {
  for (let k = 0; k < parts.length; k++) {
    const name = 's' + pad(+s) + '-' + pad(k) + '.mp3';
    const text = fix(parts[k]);
    n++;
    if (done[name] === text && existsSync(dir + name)) continue;
    const r = await fetch(TTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SB, Authorization: 'Bearer ' + SB },
      body: JSON.stringify({ text, voice: VOICE, languageCode: CODE, speakingRate: 1.0 }),
    });
    const j = await r.json();
    if (!j.audioContent) throw new Error(name + ': HTTP ' + r.status + ' ' + JSON.stringify(j).slice(0, 200));
    writeFileSync(dir + name, Buffer.from(j.audioContent, 'base64'));
    done[name] = text;
    writeFileSync(dir + 'texts.json', JSON.stringify(done, null, 1));
    sent++;
    console.log(name, text.length, 'chars');
  }
}
console.log(N.deck + ':', n, 'clips ready,', sent, 'new, in', dir);
