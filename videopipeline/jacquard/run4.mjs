// Jacquard demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Public by default (PRIVACY=private|unlisted overrides). The cached OAuth token only
// carries the youtube.upload scope, so visibility can be SET here but not changed
// afterwards — get it right before the upload, not after.
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('jacquard');
const FILE = `${OUT}/jacquard-demo-1440p.mp4`;
// One chapter per line, first one at 0:00 — that is what YouTube parses.
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8').trim() : '';

const id = await uploadVideo(FILE, {
  title: 'Ein Loch, ein Faden — wie ein Bild in eine Maschine von 1805 kommt | Doc Alvers Mathe-Labor',
  description:
    'Der Jacquard-Webstuhl von 1805 ist vollständig mechanisch: Holz, Draht, Schnüre und ein Stapel ' +
    'Pappe. Kein Bauteil, das rechnet — und trotzdem webt er ein Bild, das vorher jemand aufgeschrieben ' +
    'hat. Wie schreibt man ein Bild auf, wenn die Maschine nichts kann außer Fäden heben?\n\n' +
    'Der Film geht den Weg vorwärts: eine Lochkarte entscheidet pro Kettfaden oben oder unten, das ' +
    'Schiffchen legt den Schuss, eine Karte ist eine Zeile. Und dann rückwärts: dieselbe Zeichnung, ' +
    'in Löchern — nicht gedeutet, sondern Punkt für Punkt abgetastet. Am Ende die Grenze: bei vierzig ' +
    'Fäden webt die Maschine ein Muster, das in der Zeichnung nirgends steht. Kein Defekt, sondern ' +
    'die Auflösung. Bei tausend Fäden ist alles da.\n\n' +
    '🧪 https://docalvers.de/jacquard.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? chapters + '\n' : ''),
  tags: ['Jacquard', 'Jacquardwebstuhl', 'Webstuhl', 'Lochkarte', 'Weben', 'Auflösung',
    'Abtastung', 'Informatikgeschichte', 'Babbage', 'Hollerith', 'Mathematik', 'Informatik',
    'Doc Alvers', 'interaktiv', 'Unterricht'],
  privacy: process.env.PRIVACY || 'public',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
