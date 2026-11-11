// Solita reads an HTML deck (Doc, 15.09.2026: "NIEMALS Browserstimme! So wie beim DocPad!") - the
// same voice and pipe as ~/IdeaProjects/docpad/tools/make_tour_audio.mjs: the Supabase "tts"
// function with de-DE-Studio-C. The spoken parts are the ones the build embedded in the deck
// (html_deck.say -> <script id="narration">), written to HTML/decks/audio/<deck>/sNN-KK.mp3 with a
// texts.json next to them. Incremental: only changed parts are sent - the Studio voice has a hard
// quota (HTTP 429: wait a minute and run again). Needs network.
//
//     node tools/pptx/deck_audio.mjs mathe11-wuerfelspiel
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

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
// Doc picked these two by ear out of the samples (11.11.2026, ~/Desktop/hoerproben-aussprache): Backpropagation as
// 'Bäckproppagäjschn' (no. 2; "Bäck Propagehschen" read its "-schen" like the German "-chen": "Absolute Katastrophe",
// and the English spelling stays German "-tsion" in this voice) and Fehler as 'Fehhler' (no. 23; "Feeler" came out as
// "Vieler", and never with ä). English words always in this voice, de-DE-Studio-C, never the English one (Doc, 11.11.2026).
const SAY = { Backpropagation: 'Bäckproppagäjschn', Deepfakes: 'Diepfäiks', DeepSeek: 'Diepsiek', DeepMind: 'Diepmeind', OpenAI: 'Oupen Ei Ei', 'SynthID-Text': 'Sinnt Ei Di Text', 'Lotto-Jackpot': 'Lotto Tschäckpott', Jackpot: 'Tschäckpott', Gemini: 'Dschemini', Anthropic: 'Antropik', Lab: 'Läbb', Fehler: 'Fehhler', Fehlers: 'Fehhlers', Perzeptron: 'Perzeptronn', Perzeptronen: 'Perzeptronen', Umschreiben: 'Úmschreiben',
  // mathe11-lehrbuch (02.11.2026). Widgets stays as it is: the voice says it the English way (Gemini heard /ˈwɪdʒɪts/,
  // "Widdschets" came out as "Witschets"); IT alone is "it", and Doc wants it English, /aɪ tiː/ ("Ei wie das Ei, T wie tea"):
  // Doc picked "Ai-Tíeh" by ear out of four (02.11.2026: "Ganz klar 3"), the stress on the T as in English; "Eitíe" still leaned
  // on the I, a separate "Tie" is read as English "tie". In the deck it is said as IT-Company, IT-Firma kept the German stress
  // a path is spoken with "Schrägstrich" (03.11.2026), the longer key has to come before docalvers.de
  DocPoint: 'Dock Peunt', Doc: 'Dock', 'docalvers\\.de/buch/mathe11': 'Dock Alvers Punkt D E Schrägstrich Buch Schrägstrich Mathe elf',
  'docalvers\\.de': 'Dock Alvers Punkt D E', IT: 'Ai-Tíeh', 'Røde': 'Röde',
  // "interaktive" came out with the r rolled into the a; Doc picked "inter-aktive" by ear out of five (03.11.2026: "2")
  'interaktiv(e|en|er|es|em)?': 'inter-aktiv$1',
  Schwenkarm: 'Schwenk-Arm' };   // in one word it came out as "schwarzen Kahn" (Doc and Gemini heard the same)
const fix = t => Object.entries(SAY).reduce((x, [w, s]) => x.replace(new RegExp('(?<![\\p{L}])' + w + '(?![\\p{L}])', 'gu'), s), t.replace(/\bSolita\b/g, 'Solíta').replace(/\bDOCPAD\b/g, 'Dockpäd'))
  .replace(/\bKI-/g, 'Ka I ').replace(/\bKI\b/g, 'Ka I');   // spelled out, "KI-Text" came out as "Kitext" and "Key Text"
// [0.7s] in a narration text: she pauses there, by the voice itself (never cut in afterwards)
const pauses = t => {
  if (!/\[[\d.]+s\]/.test(t)) return '';
  const esc = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<speak>' + esc.replace(/\[([\d.]+)s\]/g, '<break time="$1s"/>') + '</speak>';
};

// "[the]Perceptron": a word she says English only after an English "the" (Doc, 11.11.2026, the perceptron: sample 16 "Das ist
// the perceptron" sounded right, "aber nicht 'the' davor sagen, sondern 'das'" - he picked no. 27 and the plural no. 28 by ear).
// The part is spoken twice in her German voice, once without the mark and once with "the " in its place; the cut goes
// through the closure of the word's first stop (p, t, k ...) in both: the beginning of the first, the word and the rest of
// the second, so "the" is gone and the word keeps its English sound. Needs ffmpeg; one [the] per part.
const RATE = 24000, FR = 240;                          // the voice's mp3 rate; 10 ms frames
const QUIET = -34;                                     // a stop's closure (dB); speech stands at -12 .. -20, a "th" at about -31
function pcm(mp3) {
  const out = execFileSync('ffmpeg', ['-v', 'error', '-i', 'pipe:0', '-ac', '1', '-ar', String(RATE), '-f', 'f32le', 'pipe:1'],
    { input: mp3, maxBuffer: 1 << 28 });
  return new Float32Array(out.buffer.slice(out.byteOffset, out.byteOffset + out.length));
}
function loudness(x) {                                 // dB per 10 ms frame, 20 ms window
  const e = [];
  for (let i = 0; i + 2 * FR <= x.length; i += FR) {
    let q = 0;
    for (let j = i; j < i + 2 * FR; j++) q += x[j] * x[j];
    e.push(10 * Math.log10(q / (2 * FR) + 1e-12));
  }
  return e;
}
function theCut(a, b, name) {
  const A = pcm(a), B = pcm(b), ea = loudness(A), eb = loudness(B);
  // Line the second up with the first (dynamic time warping over the first 3 s, loudness clipped at -50 dB): the two say
  // the same, the second with "the" inside - the longest stretch the second runs on alone is that "the". Simpler marks
  // (the first quiet frame of the first while the second sounds) picked a closure both have, a few ms apart (11.11.2026).
  const clip = v => Math.max(-50, Math.min(0, v)), N = Math.min(300, ea.length), M = Math.min(360, eb.length);
  const D = new Float64Array((N + 1) * (M + 1)).fill(1e12), P = new Int8Array((N + 1) * (M + 1)), PEN = 1.5;
  D[0] = 0;
  for (let i = 1; i <= N; i++) for (let j = 1; j <= M; j++) {
    const o = [D[(i - 1) * (M + 1) + j - 1], D[(i - 1) * (M + 1) + j] + PEN, D[i * (M + 1) + j - 1] + PEN];
    const w = o[0] <= o[1] && o[0] <= o[2] ? 0 : o[1] <= o[2] ? 1 : 2;
    D[i * (M + 1) + j] = Math.abs(clip(ea[i - 1]) - clip(eb[j - 1])) + o[w]; P[i * (M + 1) + j] = w;
  }
  let i = N, j = 1;
  for (let jj = 2; jj <= M; jj++) if (D[N * (M + 1) + jj] < D[N * (M + 1) + j]) j = jj;
  let run = 0, best = { len: 0 };
  while (i > 0 && j > 0) {                             // walk back; a run of moves in the second alone
    const w = P[i * (M + 1) + j];
    if (w === 2) { run++; if (run > best.len) best = { len: run, i, end: j + run - 1 }; j--; }
    else { run = 0; if (w === 0) { i--; j--; } else i--; }
  }
  if (best.len < 4) throw new Error(name + ': [the] - no "the" found');
  // from there the closure of the word's stop in each: 20 ms quiet at least
  const closure = (e, k) => {
    k = Math.max(20, k);
    while (k + 1 < e.length && !(e[k] < QUIET && e[k + 1] < QUIET)) k++;
    let k1 = k;
    while (k1 < e.length && e[k1] < QUIET) k1++;
    return [k, k1];
  };
  const [k, k1] = closure(ea, best.i - 3), [m, m1] = closure(eb, best.end - 3);
  const ca = Math.round((k + k1) / 2) * FR + FR, cb = Math.round((m + m1) / 2) * FR + FR;   // both closures' middles
  // after the cut both say the same word: its next stop comes about as late in both, or the cut is wrong (a long part drifts
  // by a second over 30 s, so only the next closure is compared)
  const d = ((closure(eb, m1)[0] - m) - (closure(ea, k1)[0] - k)) / 100;
  if (Math.abs(d) > 0.1) throw new Error(name + ': [the] - the cut looks wrong (next stop ' + d.toFixed(2) + ' s apart)');
  const out = new Float32Array(ca + B.length - cb);
  out.set(A.subarray(0, ca)); out.set(B.subarray(cb), ca);                                  // silence meets silence: no click
  console.log(name, '[the] cut at', (ca / RATE).toFixed(3), 's /', (cb / RATE).toFixed(3), 's, next stop', d.toFixed(2), 's apart');
  return execFileSync('ffmpeg', ['-v', 'error', '-f', 'f32le', '-ar', String(RATE), '-ac', '1', '-i', 'pipe:0', '-b:a', '64k',
    '-f', 'mp3', 'pipe:1'], { input: Buffer.from(out.buffer), maxBuffer: 1 << 28 });
}

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

// one request to the voice; a gateway hiccup answers with an HTML page instead of JSON (18.09.2026, clip 47 of 65): one
// more try after 20 s
async function speak(name, text, ssml, en) {
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
    if (j.audioContent || r.status === 429) break;     // 429: stop and wait a minute, a retry would only make it worse
  }
  if (!j.audioContent) throw new Error(name + ': HTTP ' + r.status + ' ' + JSON.stringify(j).slice(0, 200));
  return Buffer.from(j.audioContent, 'base64');
}

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
    const the = !en && /\[the\]/.test(text);
    if (the && text.match(/\[the\]/g).length > 1) throw new Error(name + ': one [the] per part');
    let audio;
    if (the) {                                         // spoken twice, cut together (see theCut above)
      // the word small after "the", as in Doc's sample 16 ("the perceptron")
      const a = text.replace('[the]', ''), b = text.replace(/\[the\](\p{L})/u, (x, c) => 'the ' + c.toLowerCase());
      const first = await speak(name, a, pauses(a), false);
      await sleep(GAP_MS);
      audio = theCut(first, await speak(name, b, pauses(b), false), name);
    } else audio = await speak(name, text, ssml, en);
    writeFileSync(dir + name, audio);
    done[name] = key;
    writeFileSync(dir + 'texts.json', JSON.stringify(done, null, 1));
    sent++;
    console.log(name, text.length, 'chars');
  }
}
console.log(N.deck + ':', n, 'clips ready,', sent, 'new, in', dir);
