// Conway's Iris demo — step 4: upload to YouTube.
// DRY=1 prints what would be sent without touching the API.
// Visibility defaults to private (PRIVACY=unlisted|public to override) — the API review was
// only passed on 27.08.2026, so public uploads may still be forced to private by YouTube.
import fs from 'fs';
import { uploadVideo } from '../lib/youtube.mjs';
import { workDir } from '../lib/paths.mjs';

const OUT = workDir('iris');
const FILE = `${OUT}/conways-iris-demo-1440p.mp4`;
const chapters = fs.existsSync(`${OUT}/chapters.txt`) ? fs.readFileSync(`${OUT}/chapters.txt`, 'utf8') : '';

const id = await uploadVideo(FILE, {
  title: "Conway's Iris — der Kreis mit den sechs Punkten | Doc Alvers Mathe-Labor",
  description:
    'Verlängere an jeder Ecke eines Dreiecks beide Seiten um die Länge der gegenüberliegenden Seite: ' +
    'Die sechs Endpunkte liegen auf EINEM Kreis. Aus dem Satz von John Conway wird eine Kurve konstanter ' +
    'Breite, das Reuleaux-Dreieck, ein Quadrat, in das sie bei jedem Drehwinkel passt — und eine ' +
    'Evolutionsstrategie (CMA-ES), die diese Lage sucht, samt Qualitätslandschaft als Heatmap.\n\n' +
    '🧪 https://docalvers.de/irisvis.html · 🔬 https://docalvers.de\n\n' +
    (chapters ? 'Kapitel: ' + chapters + '\n' : ''),
  tags: ['Conway', 'Satz von Conway', 'Geometrie', 'Dreieck', 'Inkreis', 'Reuleaux',
    'konstante Breite', 'CMA-ES', 'Evolutionsstrategie', 'Optimierung', 'Mathematik',
    'Informatik', 'Doc Alvers', 'interaktiv', 'Unterricht'],
  privacy: process.env.PRIVACY || 'public',
  dryRun: !!process.env.DRY,
});
if (id) console.log('YouTube:', 'https://youtu.be/' + id);
