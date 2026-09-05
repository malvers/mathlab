// Shell demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Public by default (PRIVACY=private|unlisted overrides). The cached OAuth token only
// carries the youtube.upload scope, so visibility can be SET here but not changed
// afterwards — get it right before the upload, not after.
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('shell');
const FILE = `${OUT}/shell-demo-1440p.mp4`;
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8').trim() : '';

const id = await uploadVideo(FILE, {
  title: 'Die Schnecke schreibt Protokoll — wie das Muster auf die Schale kommt | Doc Alvers Mathe-Labor',
  description:
    'Wer malt das Muster auf einer Meeresschnecke? Niemand. Die Schale wächst nur an ihrer Kante, ' +
    'einer einzigen Reihe Zellen, und jede Zeile, die fertig ist, wandert nach unten und ist für ' +
    'immer Kalk. Quer über die Schale liegt der Ort, nach unten läuft die Zeit: Das Muster ist kein ' +
    'Bild, es ist ein Protokoll.\n\n' +
    'Der Film baut den Mechanismus in Schritten auf. Ein Zündpunkt wird zu einer Welle, die nach ' +
    'links und rechts davonläuft — im Protokoll ein V. Zwei Wellen löschen sich beim Treffen aus, ' +
    'das ist die Spitze eines Zelts. Warum sie sterben, zeigt das Substrat: der Vorrat, den die Welle ' +
    'frisst und der sich nur langsam erholt. Zwei Gleichungen von Hans Meinhardt reichen dafür.\n\n' +
    'Dann dreht sich alles um eine einzige Zahl, den Substrat-Vorrat: knapp ergibt kleine, verstreute ' +
    'Keile, ein Drittel mehr ergibt Zeltreihen — sonst wird nichts geändert. Und am Ende wird es ' +
    'absichtlich kaputt gemacht: zu wenig Vorrat, und keine Welle kommt vom Fleck; zu viel, und die ' +
    'ganze Kante zündet auf einmal — Querstreifen statt Zelte. Das Muster braucht den Mangel.\n\n' +
    'Ehrlich bleibt der Film auch da, wo das Modell aufhört: Die großen Flächen mancher Schalen ' +
    'kann es nicht — dafür fehlt vermutlich ein dritter Stoff.\n\n' +
    '🧪 https://docalvers.de/shell.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? chapters + '\n' : ''),
  tags: ['Muschelmuster', 'Schneckenschale', 'Meinhardt', 'Musterbildung', 'Reaktion-Diffusion',
    'Aktivator Substrat', 'Turing-Muster', 'Selbstorganisation', 'Simulation', 'Biologie',
    'Mathematik', 'Physik', 'Doc Alvers', 'interaktiv', 'Unterricht'],
  privacy: process.env.PRIVACY || 'public',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
