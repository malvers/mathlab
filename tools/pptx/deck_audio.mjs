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
// Words she says wrong, written the way German reads it (Doc, 01.11.2026: "englische Wörter soll sie englisch aussprechen").
// Only the ear can check these. <phoneme> does nothing in the Studio voice (measured 17.09.2026, heard again 02.11.2026: "immer
// noch Fehler mit ä"), <lang> is refused. In German "ei" is /ai/, an English /ei/ is written "eh". Token stays German: the
// spelled "Touken" came out as "Tucken" (Doc, 02.11.2026).
const SAY = { Backpropagation: 'Bäck Propagehschen', Deepfakes: 'Diepfäiks', DeepSeek: 'Diepsiek', DeepMind: 'Diepmeind', OpenAI: 'Oupen Ei Ei', 'SynthID-Text': 'Sinnt Ei Di Text', 'Lotto-Jackpot': 'Lotto Tschäckpott', Jackpot: 'Tschäckpott', Gemini: 'Dschemini', Anthropic: 'Antropik', Lab: 'Läbb', Fehler: 'Feeler', Fehlers: 'Feelers', Perzeptron: 'Perzeptronn', Perzeptronen: 'Perzeptronen', Umschreiben: 'Úmschreiben',
  // mathe11-lehrbuch (02.11.2026). Widgets stays as it is: the voice says it the English way (Gemini heard /ˈwɪdʒɪts/,
  // "Widdschets" came out as "Witschets"); IT alone is "it", and Doc wants it English, /aɪ tiː/ ("Ei wie das Ei, T wie tea"):
  // Doc picked "Ai-Tíeh" by ear out of four (02.11.2026: "Ganz klar 3"), the stress on the T as in English; "Eitíe" still leaned
  // on the I, a separate "Tie" is read as English "tie". In the deck it is said as IT-Company, IT-Firma kept the German stress
  DocPoint: 'Dock Peunt', Doc: 'Dock', 'docalvers\\.de': 'Dock Alvers Punkt D E', IT: 'Ai-Tíeh', 'Røde': 'Röde',
  Schwenkarm: 'Schwenk-Arm' };   // in one word it came out as "schwarzen Kahn" (Doc and Gemini heard the same)
const fix = t => Object.entries(SAY).reduce((x, [w, s]) => x.replace(new RegExp('(?<![\\p{L}])' + w + '(?![\\p{L}])', 'gu'), s), t.replace(/\bSolita\b/g, 'Solíta').replace(/\bDOCPAD\b/g, 'Dockpäd'))
  .replace(/\bKI-/g, 'Ka I ').replace(/\bKI\b/g, 'Ka I');   // spelled out, "KI-Text" came out as "Kitext" and "Key Text"
// [0.7s] in a narration text: she pauses there, by the voice itself (never cut in afterwards)
const pauses = t => {
  if (!/\[[\d.]+s\]/.test(t)) return '';
  const esc = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<speak>' + esc.replace(/\[([\d.]+)s\]/g, '<break time="$1s"/>') + '</speak>';
};

// "[en] That's crazy!": the clip is spoken by Solita's English voice, as on the English site (js/solita-core.js), without the
// German spellings above (Doc, 02.11.2026: "let's speak her English: that's crazy")
const EN = { voice: 'en-US-Studio-O', code: 'en-US' };
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
    const en = /^\[en\]\s*/.test(parts[k]);
    const text = en ? parts[k].replace(/^\[en\]\s*/, '') : fix(parts[k]), ssml = pauses(text), key = (en ? '[en] ' : '') + (ssml || text);
    n++;
    if (done[name] === key && existsSync(dir + name)) continue;
    if (sent) await sleep(GAP_MS);
    // a gateway hiccup answers with an HTML page instead of JSON (18.09.2026, clip 47 of 65): one more try after 20 s
    let r, j;
    for (let tries = 0; tries < 2; tries++) {
      if (tries) await sleep(20000);
      r = await fetch(TTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SB, Authorization: 'Bearer ' + SB },
        body: JSON.stringify({ ...(ssml ? { ssml } : { text }), voice: en ? EN.voice : VOICE, languageCode: en ? EN.code : CODE, speakingRate: 1.0 }),
      });
      const body = await r.text();
      try { j = JSON.parse(body); } catch (e) { j = { notJson: body.slice(0, 120) }; }
      if (j.audioContent || r.status === 429) break;   // 429: stop and wait a minute, a retry would only make it worse
    }
    if (!j.audioContent) throw new Error(name + ': HTTP ' + r.status + ' ' + JSON.stringify(j).slice(0, 200));
    writeFileSync(dir + name, Buffer.from(j.audioContent, 'base64'));
    done[name] = key;
    writeFileSync(dir + 'texts.json', JSON.stringify(done, null, 1));
    sent++;
    console.log(name, text.length, 'chars');
  }
}
console.log(N.deck + ':', n, 'clips ready,', sent, 'new, in', dir);
