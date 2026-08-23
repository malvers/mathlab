// Channel trailer ("About"): best-of montage from existing scene clips, Solita narration.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { synthScenes } from '../lib/tts.mjs';
import { makeTalks } from '../lib/did.mjs';
import { recordOutros } from '../lib/outro.mjs';
import { compose, mixNarration } from '../lib/assemble.mjs';
import { MUSIC, PORTRAIT, VP_HOME, workDir } from '../lib/paths.mjs';

const SP = VP_HOME;                    // the other projects' scenes live next door
const OUT = workDir('trailer');

const NARR = {
  b1: 'Willkommen im Doc Alvers Mathe-Labor — dem Kanal, auf dem Mathematik und Informatik zum Anfassen werden.',
  b2: 'Hier reist du im Zeitraffer durch das Planetarium und fängst die Raumstation ein,',
  b3: 'schaust einem Elektron mitten in seine Wahrscheinlichkeitswolke,',
  b4: 'siehst einem winzigen neuronalen Netz dabei zu, wie es das Rechnen lernt,',
  b5: 'verfolgst, was im Computer wirklich passiert, wenn er eins plus eins rechnet,',
  b6: 'und lernst schriftliches Rechnen Schritt für Schritt — in Farbe.',
  b7: '<speak>Über hundert interaktive Labore warten auf dich — kostenlos, ohne Anmeldung, auf doc alvers punkt <say-as interpret-as="characters">de</say-as>.</speak>',
  b8: 'Jedes Labor bekommt hier sein eigenes kurzes Video. Schau dich um — und nimm dir die Mathematik einfach selbst in die Hand!',
};
const durs = await synthScenes(NARR, { outDir: OUT });

// beat → (source clip, start offset). Length = narration + breathing room.
const CUTS = [
  ['b1', `${SP}/wc1440/scene5.mp4`, 2.0],     // clock→planetarium crossfade
  ['b2', `${SP}/wc1440/scene7.mp4`, 12.0],    // ISS close-up glide
  ['b3', `${SP}/orb/orb_s5.mp4`, 3.5],        // probability cloud
  ['b4', `${SP}/na/scene4.mp4`, 0.5],         // GESCHAFFT moment
  ['b5', `${SP}/e1/scene3.mp4`, 15.0],        // carry ripple in the adder
  ['b6', `${SP}/gra/multiplikation_sc1.mp4`, 0.5],   // coloured partial products
  ['b7', `${SP}/wc1440/scene3.mp4`, 6.0],     // globe flight to Tokio
  ['b8', `${SP}/wc1440/scene1.mp4`, 1.0],     // beauty shot with branding
];
const scenes = [];
for (const [k, src, off] of CUTS) {
  const len = Math.max(5.5, durs[k] + 1.4);
  execFileSync('ffmpeg', ['-nostdin','-y','-v','error','-ss',String(off),'-i',src,'-i',`${OUT}/${k}.mp3`,
    '-filter_complex', `[0:v]trim=duration=${len},setpts=PTS-STARTPTS,fps=25[v];[1:a]adelay=700|700,apad[a]`,
    '-map','[v]','-map','[a]','-t',String(len),'-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-r','25','-c:a','aac','-b:a','128k','-ar','44100',`${OUT}/tr_${k}.mp4`]);
  scenes.push({ k, len });
  console.log('tr_' + k, len.toFixed(1) + 's');
}

const { len: off2 } = mixNarration(scenes.map((s) => ({ audio: `${OUT}/${s.k}.mp3`, len: s.len })), { outDir: OUT, lead: 0.7 });
console.log('Trailer-Länge (main):', off2.toFixed(1), 's');

await makeTalks(PORTRAIT, [`${OUT}/fullnarration.mp3`], { outDir: OUT });
const outros = await recordOutros({ outDir: OUT, qrUrl: 'https://docalvers.de' });
compose(scenes.map((s) => `tr_${s.k}`), [{ talk: `${OUT}/talk_fullnarration.mp4`, at: 0, fade: false }],
  { outDir: OUT, out: `${OUT}/kanaltrailer-1440p.mp4`, size: 520, outros, music: { file: MUSIC, gain: 0.13 } });
