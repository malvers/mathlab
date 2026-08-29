// Kovarianz demo — step 3: cut the take into scenes, mix the narration, let D-ID
// speak it as Solita, record the outro cards and compose the final 1440p master.
//
// The music bed is built to the exact length of the finished film: part 1 of
// Infinity_6min.m4a loops seamlessly, so the old 360 s ceiling is gone.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { buildScenes, compose, mixNarration } from '../lib/assemble.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { buildBed } from '../lib/musicbed.mjs';
import { PORTRAIT, workDir } from '../lib/paths.mjs';

const OUT = workDir('kovarianz');
const durs = JSON.parse(fs.readFileSync(`${OUT}/durs.json`, 'utf8'));
const rawMarks = JSON.parse(fs.readFileSync(`${OUT}/main.json`, 'utf8'));
const marks = Object.fromEntries(rawMarks.map((m) => [m.label, m.t]));
const vdur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
    '-of', 'csv=p=0', `${OUT}/main.mp4`]).toString());

const order = Object.keys(durs).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
const skipped = rawMarks.filter((m) => m.label.startsWith('SKIP'));
if (skipped.length) console.log('ACHTUNG, übersprungen:', JSON.stringify(skipped));

// one clip per scene: the footage between its mark and the next, padded if the voice is longer
const scenes = order.map((k, i) => {
    const t0 = marks[k];
    const tEnd = Math.min(i + 1 < order.length ? marks[order[i + 1]] : marks.end + 1.5, vdur);
    const len = Math.max(tEnd - t0, durs[k] + 1.2);          // 0.5 s lead + tail room
    return {
        name: `kov_${k}`, src: `${OUT}/main.mp4`, segments: [[t0, tEnd]], len,
        audio: `${OUT}/${k}.mp3`, pad: len - (tEnd - t0)
    };
});

let main = 0;
for (const s of scenes) {
    const k = s.name.slice(4);
    if (s.pad > 0.6) console.log('padding', s.name, s.pad.toFixed(1) + 's');
    if (0.5 + durs[k] > s.len + 0.1) console.log('WARN Ton läuft über:', s.name);
    main += s.len;
}
console.log('Hauptteil', main.toFixed(1), 's — Szenen:', scenes.map((s) => s.len.toFixed(1)).join(' '));

// YouTube chapters, straight from the cut — no hand-counted timestamps that go stale
const CHAPTER = {
    s1: 'Die Wolke hat eine Form', s2: 'Der langweilige Fall', s3: 'Dehnen — mal vier',
    s4: 'Die Nebendiagonale', s5: 'Rho ohne Einheiten', s6: 'Die Ellipse ist die Matrix',
    s7: 'Eigenvektoren — das ist PCA', s8: 'Drehen: was sich nicht ändert',
    s9: 'det A = 0', s10: 'Verschieben ändert nichts', s11: 'Zusammenfassung, kein Foto',
    s12: 'Was linear heißt', s13: 'Wo Sigma aufhört zu gelten', s14: 'Finale',
};
let cAt = 0;
const chapters = [];
for (const s of scenes) {
    const k = s.name.slice(4);
    if (CHAPTER[k]) chapters.push({ t: Math.round(cAt), label: CHAPTER[k] });
    cAt += s.len;
}
const mmss = (t) => Math.floor(t / 60) + ':' + String(Math.round(t) % 60).padStart(2, '0');
fs.writeFileSync(`${OUT}/chapters.txt`, chapters.map((c) => `${mmss(c.t)} ${c.label}`).join('\n'));
console.log('Kapitel:', chapters.map((c) => `${mmss(c.t)} ${c.label}`).join(' · '));

buildScenes(scenes, { outDir: OUT });

// One D-ID clip per narration block, so Solita's mouth stays in sync across the film.
// A single ~6 min script is beyond what the API takes, so split at a scene boundary.
const MAX_TALK = 280;
const groups = [];
let cur = [], curLen = 0, at = 0;
const starts = [];
for (const s of scenes) {
    if (cur.length && curLen + s.len > MAX_TALK) { groups.push(cur); cur = []; curLen = 0; }
    if (!cur.length) starts.push(at);
    cur.push(s); curLen += s.len; at += s.len;
}
groups.push(cur);
const narrations = groups.map((g, i) => mixNarration(g, { outDir: OUT, name: `narr${i}` }));
console.log('Sprecherspuren:', narrations.map((n, i) => `${i}: ${n.len.toFixed(1)}s ab ${starts[i].toFixed(1)}s`).join(' · '));

// CUTONLY=1 stops here: check the cut before any D-ID credit is spent
if (process.env.CUTONLY) { console.log('CUTONLY — Schnitt steht, kein D-ID.'); process.exit(0); }

const talks = await makeTalks(PORTRAIT, narrations.map((n) => n.file), { outDir: OUT });
const bubbles = narrations.map((n, i) => ({ talk: talks[n.file], at: starts[i], fade: false }));

const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de/kovarianz.html' });

// bed exactly as long as the film, built from the seamless loop (+2 s of slack)
const outroLen = outros.reduce((a, f) => a + parseFloat(execFileSync('ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString()), 0);
const bed = buildBed(main + outroLen + 2, `${OUT}/bed.m4a`);
console.log('Musikbett gebaut:', (main + outroLen + 2).toFixed(1), 's');

compose(scenes.map((s) => s.name), bubbles,
    {
        outDir: OUT, out: `${OUT}/kovarianz-demo-1440p.mp4`, size: 380, outros,
        music: { file: bed, gain: 0.12 }
    });
