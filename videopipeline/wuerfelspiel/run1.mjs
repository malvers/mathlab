// Würfelspiel demo — step 1: Solita speaks the script.
// The measured durations drive both the recording (run2) and the cut (run3), so this runs first.
//
// Incremental on purpose: the Studio voice has a hard quota (HTTP 429 "RESOURCE_EXHAUSTED"
// after a couple of full runs), so only scenes whose text actually changed are re-sent.
// Durations are persisted after EVERY scene - a scene already paid for must never be lost
// because a later one threw. FORCE=1 re-synthesises everything.
//
// Unlike the earlier films this one sends the scenes ONE BY ONE with a pause in between:
// 24 scenes back to back is a burst, and the per-minute limit is shared with the live voice
// in DocPad, the decks and solita.html (measured 16.09.2026 - a burst locked Solita for
// everyone for a minute). GAP=<seconds> changes the spacing.
import fs from 'fs';
import { synthScenes } from '../lib/tts.mjs';
import { workDir } from '../lib/paths.mjs';
import { NARRATION } from './narration.mjs';

const OUT = workDir('wuerfelspiel');
const GAP = Number(process.env.GAP || 5) * 1000;
// Doc, 17.09.2026: "zu schnell, wir reden über Schülerinnen und Schüler" - 0.92 plus the
// 400 ms sentence breaks in narration.mjs. RATE=1 would give the first cut's tempo back.
// Doc, 19.09.2026, in the live tour: "wieder langsam ... 96 % probieren" - the 0.92 takes are in rate092/.
// A new rate needs FORCE=1 (the text did not change, only the tempo).
const RATE = Number(process.env.RATE || 0.96);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const read = (f, fallback) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return fallback; } };

const oldText = process.env.FORCE ? {} : read(`${OUT}/texts.json`, {});
const durs = read(`${OUT}/durs.json`, {});
const done = { ...oldText };
const todo = Object.entries(NARRATION).filter(([k, v]) =>
  v !== oldText[k] || !durs[k] || !fs.existsSync(`${OUT}/${k}.mp3`));

const chars = todo.reduce((a, [, v]) => a + v.replace(/<[^>]+>/g, '').length, 0);
console.log(todo.length ? `neu zu sprechen: ${todo.map(([k]) => k).join(' ')} (${chars} Zeichen)`
                        : 'nichts zu tun — alle Szenen sind aktuell.');

for (const [k, v] of todo) {
  // On 429 the voice is exhausted for everyone for about a minute: wait, then try again.
  for (let attempt = 1; ; attempt++) {
    try {
      await synthScenes({ [k]: v }, {
        outDir: OUT, rate: RATE,
        onScene: (name, sec) => {                 // persist after every paid-for scene
          durs[name] = sec;
          done[name] = NARRATION[name];
          fs.writeFileSync(`${OUT}/durs.json`, JSON.stringify(durs));
          fs.writeFileSync(`${OUT}/texts.json`, JSON.stringify(done));
        },
      });
      break;
    } catch (e) {
      const quota = /429|RESOURCE_EXHAUSTED|exhausted|quota/i.test(e.message);
      if (!quota || attempt >= 6) throw e;
      console.log(`${k}: Kontingent erschöpft (Versuch ${attempt}) — warte 60 s`);
      await sleep(60000);
    }
  }
  if (todo[todo.length - 1][0] !== k) await sleep(GAP);
}

const order = Object.keys(NARRATION);
const missing = order.filter((k) => !durs[k]);
if (missing.length) console.log('FEHLEN NOCH:', missing.join(' '));
const total = order.reduce((a, k) => a + (durs[k] || 0), 0);
console.log('---');
for (const k of order) console.log(k.padEnd(4), (durs[k] || 0).toFixed(1) + 's');
console.log('Sprache gesamt', total.toFixed(1), 's über', order.length, 'Szenen.');
console.log('Mit Luft, Denkpause und Abspann landet der Film bei etwa', (total + 24 * 1.6 + 5 + 10).toFixed(0), 's.');
// This film is cut WITHOUT D-ID (Doc, 17.09.2026: "erstmal ohne, nur voice"), so no credits
// are spent - but the number is what a later talking-head pass would cost.
console.log('D-ID würde diesen Stand rund', Math.ceil(total / 15), 'Credits kosten — run3 ruft es nicht auf.');
