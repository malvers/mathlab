// Galton demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Public by default (PRIVACY=private|unlisted overrides). The cached OAuth token only
// carries the youtube.upload scope, so visibility can be SET here but not changed
// afterwards — get it right before the upload, not after.
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('galton');
const FILE = `${OUT}/galton-demo-1440p.mp4`;
// One chapter per line, first one at 0:00 — that is what YouTube parses.
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8').trim() : '';

const id = await uploadVideo(FILE, {
  title: 'Die Glocke, die niemand hinmalt — warum immer diese Kurve? | Doc Alvers Mathe-Labor',
  description:
    'Eine Kugel fällt durch achtzehn Reihen Nägel. An jedem Nagel geht es nach links oder nach ' +
    'rechts, fifty-fifty. Wo sie landet, ist nichts als die Bilanz aus achtzehn Münzwürfen. Zwölf ' +
    'Kugeln ergeben nichts Erkennbares — tausend ergeben eine Glocke. Jedes Mal.\n\n' +
    'Der Film beantwortet eine einzige Frage: warum ausgerechnet diese Form? Die Antwort ist keine ' +
    'Formel, sondern eine Zählung. Durch das Brett führen 2^18 = 262 144 Wege, alle gleich ' +
    'wahrscheinlich. In das mittlere Fach führen 48 620 davon, in das äußerste genau einer. Die ' +
    'Mitte gewinnt nicht durch Glück, sondern durch Buchhaltung.\n\n' +
    'Und dann die unbequeme Rechnung: für eine einzige Kugel ganz außen bräuchte man im Mittel ' +
    'dreiundsiebzig Minuten, selbst wenn das Labor am Anschlag läuft. Deshalb bleiben die Ränder ' +
    'leer — das ist keine Schlamperei, das ist das Ergebnis.\n\n' +
    'Zum Schluss die Grenze: die Glocke kommt nicht vom Galton-Brett, sie kommt vom Summieren. ' +
    'Würfelsummen, Körpergrößen, Messfehler — dieselbe Kurve. Aber nur, wenn die Beiträge ' +
    'ungefähr gleich viel wiegen. Wo einer alle anderen erschlagen kann, kommt sie nicht.\n\n' +
    '🧪 https://docalvers.de/galtonboard.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? chapters + '\n' : ''),
  tags: ['Galtonbrett', 'Galton Board', 'Quincunx', 'Normalverteilung', 'Glockenkurve',
    'Binomialverteilung', 'Pascalsches Dreieck', 'Zentraler Grenzwertsatz', 'Wahrscheinlichkeit',
    'Stochastik', 'Zufall', 'Mathematik', 'Doc Alvers', 'interaktiv', 'Unterricht'],
  privacy: process.env.PRIVACY || 'public',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
