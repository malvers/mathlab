// Kovarianz demo — step 1: Solita speaks the script.
// The measured durations drive the recording (run2), so this always runs first.
//
// Incremental on purpose: the Studio voice has a hard quota (HTTP 429
// "RESOURCE_EXHAUSTED" after a couple of full runs), so only scenes whose text
// actually changed are re-sent. FORCE=1 re-synthesises everything.
import fs from 'fs';
import { execSync } from 'child_process';
import { synthScenes } from '../lib/tts.mjs';
import { workDir } from '../lib/paths.mjs';
import { NARRATION, TARGET } from './narration.mjs';

const OUT = workDir('kovarianz');
const read = (f, fb) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return fb; } };

const oldText = process.env.FORCE ? {} : read(`${OUT}/texts.json`, {});
const durs = read(`${OUT}/durs.json`, {});
const todo = Object.fromEntries(Object.entries(NARRATION).filter(([k, v]) =>
    v !== oldText[k] || !durs[k] || !fs.existsSync(`${OUT}/${k}.mp3`)));

if (!Object.keys(todo).length) {
    console.log('nichts zu tun — alle Szenen sind aktuell.');
} else {
    console.log('neu zu sprechen:', Object.keys(todo).join(' '));
    // Persist after every scene, not at the end: a scene that failed further down
    // the list must not cost the quota for the ones already spoken.
    const done = { ...(read(`${OUT}/texts.json`, {})) };
    const flush = () => {
        fs.writeFileSync(`${OUT}/durs.json`, JSON.stringify(durs));
        fs.writeFileSync(`${OUT}/texts.json`, JSON.stringify(done));
    };
    try {
        await synthScenes(todo, {
            outDir: OUT, rate: 1.0,
            onScene: (name, sec) => { durs[name] = sec; done[name] = NARRATION[name]; flush(); },
        });
    } catch (e) {
        flush();
        console.error('\nABBRUCH:', e.message);
        console.error('Bereits gesprochene Szenen sind gesichert — erneut starten macht nur den Rest.');
        process.exit(1);
    }
    flush();
}

// The SSML breaks are stage directions: run2 performs the action inside them.
// Measuring where they actually landed beats guessing from the text, because a
// rewritten sentence moves every later cue. Only gaps >= MIN_CUE count - the
// shorter ones are the voice breathing between sentences.
const MIN_CUE = 0.7;
const cues = {};
for (const k of Object.keys(NARRATION)) {
    const f = `${OUT}/${k}.mp3`;
    if (!fs.existsSync(f)) continue;
    const log = execSync(`ffmpeg -nostdin -hide_banner -v info -i "${f}" ` +
        `-af silencedetect=noise=-45dB:d=${MIN_CUE} -f null - 2>&1`, { encoding: 'utf8' });
    const starts = [...log.matchAll(/silence_start: ([0-9.]+)/g)].map((m) => +m[1]);
    const ends = [...log.matchAll(/silence_end: ([0-9.]+)/g)].map((m) => +m[1]);
    // fire in the middle of the gap, so a slightly early or late action still lands inside it
    cues[k] = starts.map((s, i) => +(((ends[i] ?? s + MIN_CUE) + s) / 2).toFixed(2));
}
fs.writeFileSync(`${OUT}/cues.json`, JSON.stringify(cues, null, 1));

console.log('---');
console.log('Szene  Dauer   Ziel   Abw.   Cues (s)');
let total = 0, warn = [];
for (const k of Object.keys(NARRATION)) {
    const d = durs[k];
    if (!d) continue;
    total += d;
    const t = TARGET[k], drift = (d - t) / t * 100;
    if (Math.abs(drift) > 15) warn.push(k);
    console.log(`${k.padEnd(6)} ${d.toFixed(1).padStart(5)}s ${String(t).padStart(5)}s ` +
        `${(drift > 0 ? '+' : '') + drift.toFixed(0) + '%'}`.padStart(7) +
        `   ${(cues[k] || []).join(' ')}`);
}
console.log('---');
console.log(`Sprache gesamt ${total.toFixed(1)} s (${Math.floor(total / 60)}:` +
    `${String(Math.round(total % 60)).padStart(2, '0')}) über ${Object.keys(durs).length} Szenen.`);
if (warn.length) console.log('Abweichung > 15 % bei:', warn.join(' '), '— Plot-Sekunden ggf. anpassen.');
console.log('Musikbett: Teil 1 loopt nahtlos (21,220–163,998 s), Laenge ist also frei.');
