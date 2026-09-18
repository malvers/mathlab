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
// Google's per-minute limit counts the whole project: a burst from here once locked Solita's voice for everyone,
// DocPad and live decks included (16.09.2026, HTTP 429). Serial with 5 s between requests stays clear of it.
const GAP_MS = 5000;
const sleep = ms => new Promise(ok => setTimeout(ok, ms));

let n = 0, sent = 0;
for (const [s, parts] of Object.entries(N.slides)) {
  for (let k = 0; k < parts.length; k++) {
    const name = 's' + pad(+s) + '-' + pad(k) + '.mp3';
    if (!parts[k].trim()) continue;                   // a line copied in the deck editor: Solita stays quiet there
    const text = fix(parts[k]);
    n++;
    if (done[name] === text && existsSync(dir + name)) continue;
    if (sent) await sleep(GAP_MS);
    // a gateway hiccup answers with an HTML page instead of JSON (18.09.2026, clip 47 of 65): one more try after 20 s
    let r, j;
    for (let tries = 0; tries < 2; tries++) {
      if (tries) await sleep(20000);
      r = await fetch(TTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SB, Authorization: 'Bearer ' + SB },
        body: JSON.stringify({ text, voice: VOICE, languageCode: CODE, speakingRate: 1.0 }),
      });
      const body = await r.text();
      try { j = JSON.parse(body); } catch (e) { j = { notJson: body.slice(0, 120) }; }
      if (j.audioContent || r.status === 429) break;   // 429: stop and wait a minute, a retry would only make it worse
    }
    if (!j.audioContent) throw new Error(name + ': HTTP ' + r.status + ' ' + JSON.stringify(j).slice(0, 200));
    writeFileSync(dir + name, Buffer.from(j.audioContent, 'base64'));
    done[name] = text;
    writeFileSync(dir + 'texts.json', JSON.stringify(done, null, 1));
    sent++;
    console.log(name, text.length, 'chars');
  }
}
console.log(N.deck + ':', n, 'clips ready,', sent, 'new, in', dir);
